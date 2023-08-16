<template>
    <div>
        <div>
            <a-button @click="changeEdgeType('normal')">直线箭头</a-button>
            <a-button @click="changeEdgeType('smooth')">曲线箭头</a-button>
            <a-button @click="changeEdgeType('rightAngle')">直角箭头</a-button>
            <a-button @click="changeEdgeType('dotted')">虚线箭头</a-button>

            <a-button @click="centerFn">适应屏幕</a-button>
            <a-button @click="deleteNode()">删除</a-button>
            <a-button @click="undo()">撤销</a-button>
            <a-button @click="redo()">回退</a-button>

            <a-button @click="showData()">保存</a-button>
            <a-button @click="loadData()">显示</a-button>
        </div>
        <div class="container_warp">
            <div id="containerChart"></div>
            <RightDrawer
                class="right_drawer"
                :drawer-type="type"
                :select-cell="selectCell"
                :graph="graph"
                :grid="grid"
                @deleteNode="deleteNode"
            >
            </RightDrawer>
            <div class="operating">
                <div class="btn-group">
                    <div
                        v-for="item in config"
                        :key="item.id"
                        class="btn"
                        @mousedown="startDrag('Circle', $event, item)"
                    >
                        {{ item.label }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import '@antv/x6-vue-shape';
    import { ref, onMounted } from 'vue';
    import { Graph, Shape, Addon, FunctionExt, DataUri, Edge } from '@antv/x6';
    import RightDrawer from './components/RightDrawer.vue';
    // import insertCss from 'insert-css';
    import { startDragToGraph } from './Graph/methods.js';
    import config from './data/config.js';

    const data = {};
    const graph = ref() as any;
    const type = ref('grid');
    const selectCell = ref();
    const connectEdgeType = ref({
        connector: 'normal',
        router: {
            name: ''
        }
    });
    const strokeDasharray: any = ref(0);
    const currentArrow = ref(1);
    const grid = ref({
        // 网格设置
        size: 20, // 网格大小 10px
        visible: true, // 渲染网格背景
        type: 'mesh',
        args: {
            color: '#D0D0D0',
            thickness: 1, // 网格线宽度/网格点大小
            factor: 10
        }
    });
    const loadDataFlag = ref(true);

    onMounted(() => {
        initX6();
    });

    const initX6 = async () => {
        graph.value = new Graph({
            container: document.getElementById('containerChart') as HTMLElement,
            width: 1700,
            panning: true, // 拖拽平移
            height: '100%' as any,
            grid: grid.value,
            resizing: {
                // 调整节点宽高
                enabled: loadDataFlag.value,
                orthogonal: false
            },
            selecting: {
                enabled: true,
                rubberband: true,
                showNodeSelectionBox: true,
                showEdgeSelectionBox: true,
                movable: loadDataFlag.value
            },
            snapline: true,
            interacting: {
                edgeMovable: loadDataFlag.value,
                edgeLabelMovable: loadDataFlag.value,
                arrowheadMovable: loadDataFlag.value,
                vertexMovable: loadDataFlag.value,
                vertexAddable: loadDataFlag.value,
                vertexDeletable: loadDataFlag.value,
                useEdgeTools: loadDataFlag.value,
                nodeMovable: loadDataFlag.value,
                magnetConnectable: loadDataFlag.value,
                stopDelegateOnDragging: loadDataFlag.value
            },
            connecting: {
                // 节点连接
                anchor: 'center',
                connectionPoint: 'anchor',
                allowBlank: true,
                snap: true,
                createEdge() {
                    return new Shape.Edge({
                        attrs: {
                            line: {
                                stroke: '#1890ff',
                                strokeWidth: 1,
                                targetMarker: {
                                    name: 'classic',
                                    size: 8
                                },
                                strokeDasharray: strokeDasharray.value // 虚线
                                // style: {
                                //   animation: "ant-line 30s infinite linear"
                                // }
                            }
                        },
                        label: {
                            text: ''
                        },
                        connector: connectEdgeType.value.connector,
                        router: {
                            name: connectEdgeType.value.router.name || ''
                        }
                    });
                }
            },
            highlighting: {
                magnetAvailable: {
                    name: 'stroke',
                    args: {
                        padding: 4,
                        attrs: {
                            strokeWidth: 4,
                            stroke: '#6a6c8a'
                        }
                    }
                }
            },
            history: true,
            keyboard: {
                enabled: true
            }
        });
        // insertCss(`
        //       @keyframes ant-line {
        //         to {
        //             stroke-dashoffset: -1000
        //         }
        //       }
        //     `);
        graph.value.history.redo();
        graph.value.history.undo();
        graph.value.bindKey('delete', (e: any) => {
            if (loadDataFlag.value === true) {
                deleteNode();
            }
        });
        // 鼠标移入移出节点
        graph.value.on(
            'node:mouseenter',
            FunctionExt.debounce(() => {
                if (loadDataFlag.value === true) {
                    const container = document.getElementById('containerChart') as HTMLElement;
                    const ports = container.querySelectorAll('.x6-port-body');
                    showPorts(ports, true);
                }
            }),
            500
        );
        graph.value.on('node:mouseleave', () => {
            if (loadDataFlag.value === true) {
                const container = document.getElementById('containerChart') as HTMLElement;
                const ports = container.querySelectorAll('.x6-port-body');
                showPorts(ports, false);
            }
        });
        // blank 画布空白区域
        graph.value.on('blank:click', () => {
            console.log(1);
            type.value = 'grid';
        });
        // cell 节点/边
        graph.value.on('cell:click', ({ e, cell, view }: any) => {
            console.log({ e, cell, view });
            type.value = cell.isNode() ? 'node' : 'edge';
            // console.log(e);
        });
        // 选中连线后，移动node出现选中的bug
        graph.value.on('node:moving', () => {
            graph.value.cleanSelection();
        });
        graph.value.on('selection:changed', (args: any) => {
            args.added.forEach((cell: any) => {
                console.log(cell);
                selectCell.value = cell;
                if (cell.isEdge()) {
                    // cell.isEdge() && cell.attr("line/strokeDasharray", 5); //虚线蚂蚁线
                    cell.isEdge() &&
                        cell.attr(
                            'line/strokeDasharray',
                            cell.store.data.attrs.line.strokeDasharray
                        );
                    cell.addTools([
                        {
                            name: 'vertices',
                            args: {
                                padding: 4,
                                attrs: {
                                    strokeWidth: 0.1,
                                    stroke: '#2d8cf0',
                                    fill: '#ffffff'
                                }
                            }
                        }
                    ]);
                }
            });
            args.removed.forEach((cell: any) => {
                // cell.isEdge() && cell.attr("line/strokeDasharray", 0); //正常线
                cell.isEdge() &&
                    cell.attr('line/strokeDasharray', cell.store.data.attrs.line.strokeDasharray); // 正常线
                cell.removeTools();
            });
        });
    };

    // 删除节点
    const deleteNode = async () => {
        const cell = graph.value.getSelectedCells();
        graph.value.removeCells(cell);
        type.value = 'grid';
    };
    const showPorts = async (ports: any, show: any) => {
        for (let i = 0, len = ports.length; i < len; i += 1) {
            ports[i].style.visibility = show ? 'visible' : 'hidden';
        }
    };
    const showData = async () => {
        const data = graph.value.toJSON();
        const nodeArr = [];
        for (let i = 0; i < data.cells.length; i++) {
            const e = data.cells[i];
            if (e.shape === 'edge') {
                for (let index = 0; index < nodeArr.length; index++) {
                    const element = nodeArr[index];
                    if (element.oldId === e.source.cell) {
                        e.source.cell = element.nodeId;
                    }
                    if (element.oldId === e.target.cell) {
                        e.target.cell = element.nodeId;
                    }
                }
            } else {
                nodeArr.push({ nodeId: e.operationCode, oldId: e.id });
                e.id = e.operationCode;
            }
        }
        console.log(data);
        localStorage.setItem('json', JSON.stringify(data));

        // console.log(JSON.stringify(this.graph.toJSON()));
    };
    const loadData = async () => {
        // this.loadDataFlag = false;
        // this.initX6();
        const x6Json = JSON.parse(localStorage.getItem('json') as any);
        console.log(localStorage.getItem('json'));
        init(x6Json.cells);
        // this.showNodeStatus(Object.assign([], nodeStatusList))
        graph.value.centerContent();
        // this.loadDataFlag = false;
        // this.initX6();
        // setTimeout(() => {
        //   this.graph.fromJSON(loadData);
        // }, 0);
        // setTimeout(() => {
        //   const container = document.getElementById("containerChart");
        //   const ports = container.querySelectorAll(".x6-port-body");
        //   this.showPorts(ports, false);
        // }, 0);
    };
    const init = async (data = []) => {
        console.log(data, 11);
        const cells: any = [];
        data.forEach((item: any) => {
            if (item.shape === 'edge') {
                cells.push(graph.value.createEdge(item));
            } else {
                // delete item.component
                cells.push(graph.value.createNode(item));
            }
        });
        graph.value.resetCells(cells);
    };
    // 删除节点
    const startDrag = async (type: any, e: any, item: any) => {
        startDragToGraph(graph.value, type, e, item);
    };
    const undo = async () => {
        graph.value.history.undo();
    };
    const redo = async () => {
        graph.value.history.redo();
    };
    const zoomFn = async (num: number) => {
        graph.value.zoom(num);
    };

    const centerFn = async () => {
        const num = 1 - graph.value.zoom();
        num > 1 ? graph.value.zoom(num * -1) : graph.value.zoom(num);
        graph.value.centerContent();
    };

    // 改变边形状
    const changeEdgeType = async (e: any) => {
        console.log(connectEdgeType.value);

        if (e === 'normal') {
            connectEdgeType.value.connector = 'normal';
            connectEdgeType.value.router.name = '';
            strokeDasharray.value = 0;
            currentArrow.value = 1;
        } else if (e === 'smooth') {
            connectEdgeType.value.connector = 'smooth';
            connectEdgeType.value.router.name = '';
            strokeDasharray.value = 0;
            currentArrow.value = 2;
        } else if (e === 'rightAngle') {
            connectEdgeType.value.connector = 'normal';
            connectEdgeType.value.router.name = 'manhattan';
            strokeDasharray.value = 0;
            currentArrow.value = 3;
        } else {
            connectEdgeType.value.connector = 'smooth';
            connectEdgeType.value.router.name = '';
            strokeDasharray.value = '5,5';
            currentArrow.value = 4;
        }
    };
</script>

<style lang="less" scoped>
    @import './index.less';

    .iconfont {
        font-size: 20px;
    }
</style>
