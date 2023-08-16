<template>
    <TpfCollapse class="list" title="工序列表" gap="0">
        <template #right>
            <a-button
                v-if="routerType !== 'detail'"
                type="primary"
                ghost
                @click="open"
                class="tpf-button"
            >
                <SvgIcon type="icon-insert" style="margin-right: 5px" />
                添加工序
            </a-button>
        </template>
        <a-card>
            <TpfTable
                :columns="columns"
                :dataSource="dataSource"
                :pagination="false"
                :customRow="customRow"
                :operateColumn="routerType !== 'detail' ? operateColumn : undefined"
            />
        </a-card>
        <AddWorkingProcedureModel ref="addWorkingProcedureModel" />
    </TpfCollapse>
</template>

<script setup lang="tsx" name="List">
    import { ref, onMounted, computed, defineAsyncComponent } from 'vue';
    import type { TpfColumnType } from '@/types';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import { getTpfOptionEnum, tableResizable } from '@/config';
    import mitts from '@/utils/bus';
    import router from '@/router';
    import { uniqBy } from 'lodash-es';
    import { useOpenAntdModal, useRouteQuery } from '@/hooks';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';

    const AddWorkingProcedureModel = defineAsyncComponent(
        () => import('./addWorkingProcedureModel.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const [addWorkingProcedureModel, onOpenAddWorkingProcedureModel] = useOpenAntdModal();
    const { operationTypeNameListOptions, timeUnitOption, getLabel } = getTpfOptionEnum();

    const { type: routerType } = useRouteQuery<{ type: string }>();
    type Props = {
        paramsData: any;
    };
    const props = withDefaults(defineProps<Props>(), {
        paramsData: () => ({})
    });

    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 120,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });
    const defaultBtn = [
        {
            title: '编辑',
            onClick: ({ record, index }: any) => {
                edit(record, index);
            }
        },
        {
            title: '删除',
            onClick: ({ record }: any) => {
                del(record);
            }
        }
    ];

    let change1: any | null = null; // 源目标数据序号
    let change2: any | null = null; // 目标数据序号

    const columns = computed(
        () =>
            [
                {
                    title: '序号',
                    dataIndex: 'index',
                    customRender: (row: any) => {
                        return (row.index += 1);
                    }
                },
                {
                    title: '工序编号',
                    dataIndex: 'operationCode',
                    ...tableResizable(),
                    customRender: ({ text, record }: any) => {
                        return (
                            <a
                                onClick={() => {
                                    localStorage.setItem(
                                        'processTableList',
                                        JSON.stringify(dataSource.value)
                                    );

                                    router.push({
                                        path: '/processManagement/workingProcedure/workingProcedureDetail',
                                        query: {
                                            type: '2',
                                            operationId: record.operationId
                                        }
                                    });
                                }}
                            >
                                {text}
                            </a>
                        );
                    }
                },
                { title: '工序名称', dataIndex: 'operationName', ...tableResizable() },
                {
                    title: '工序类型',
                    dataIndex: 'operationTypeCode',
                    ...tableResizable(),
                    customRender: ({ text }: { text: string }) => {
                        return getLabel(text, operationTypeNameListOptions);
                    }
                },
                { title: '计件单价(元)', dataIndex: 'pricePerQuantity', ...tableResizable() },
                { title: '计时单价(元)', dataIndex: 'pricePerTime', ...tableResizable() },
                {
                    title: '计时单位',
                    dataIndex: 'pricePerTimeUnit',
                    ...tableResizable(),
                    customRender: ({ text }: { text: string }) => {
                        return getLabel(text, timeUnitOption);
                    }
                },
                { title: '作业单元类型编号', dataIndex: 'workUnitTypeCode', ...tableResizable() },
                { title: '作业单元类型名称', dataIndex: 'workUnitTypeName', ...tableResizable() },
                { title: '备注', dataIndex: 'remark', ...tableResizable() }
            ].filter(o => o) as TpfColumnType[]
    );
    const dataSource = ref<any>([]);

    const informationReflist = ref({});

    const open = () => {
        const params = {
            list: dataSource.value,
            form: informationReflist.value
        };
        onOpenAddWorkingProcedureModel(params);
    };

    const del = async (row: any) => {
        if (routerType === 'detail') {
            return;
        }
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定删除该工序吗' });
        dataSource.value = dataSource.value.filter((item: any) => {
            return item.operationCode !== row.operationCode;
        });
    };

    const edit = (row: any, index: number) => {
        if (routerType === 'detail') {
            return;
        }
        localStorage.setItem('processTableList', JSON.stringify(dataSource.value));
        localStorage.setItem('processOperationCode', row.operationCode);
        localStorage.setItem('isLocalStorage', 'true');
        router.push({
            path: '/processManagement/workingProcedure/editWorkingProcedure',
            query: { type: 'upgrade', operationId: row.operationId }
        });
    };
    const load = async () => {
        if (routerType !== 'add') {
            const isLocalStorage = localStorage.getItem('isLocalStorage');
            if (isLocalStorage === null)
                setTimeout(() => {
                    dataSource.value = props.paramsData.operationInfos;
                }, 300);
        }
    };

    const customRow = (record: any, index: any) => {
        return {
            props: {},
            style: {
                cursor: 'pointer'
            },
            // 鼠标移入
            onMouseenter: (event: any) => {
                // 兼容IE
                const ev = event || window.event;
                ev.target.draggable = true; // 让你要拖动的行可以拖动，默认不可以
            },
            // 开始拖拽
            onDragstart: (event: any) => {
                // 兼容IE
                const ev = event || window.event;
                // 阻止冒泡
                ev.stopPropagation();
                // 得到源目标数据序号
                change1 = index;
                console.log(record, index, 'source');
            },
            // 拖动元素经过的元素
            onDragover: (event: any) => {
                // 兼容 IE
                const ev = event || window.event;
                // 阻止默认行为
                ev.preventDefault();
            },
            // 鼠标松开
            onDrop: (event: any) => {
                // 兼容IE
                const ev = event || window.event;
                // 阻止冒泡
                ev.stopPropagation();
                // 得到目标数据序号
                change2 = index;
                // 这里就是让数据位置互换，让视图更新 你们可以看record，index的输出，看是什么
                [dataSource.value[change1], dataSource.value[change2]] = [
                    dataSource.value[change2],
                    dataSource.value[change1]
                ];
            }
        };
    };

    onMounted(async () => {
        mitts.on('formList', (e: string | any) => {
            informationReflist.value = e;
        });

        const processOperationCode = localStorage.getItem('processOperationCode');
        const processTableList = JSON.parse(localStorage.getItem('processTableList') as string);
        const processList = JSON.parse(localStorage.getItem('processList') as string);

        if (processTableList !== null) {
            processTableList.forEach((e: any, i: number) => {
                if (processOperationCode !== null && processList !== null) {
                    if (
                        e.operationCode === processOperationCode &&
                        processList.operationCode === processOperationCode
                    ) {
                        e = processList;
                    }
                }
                dataSource.value?.push(e as never);
            });
        }

        mitts.on('event', (e: number | any) => {
            dataSource.value = [];
            e.forEach((ele: never | any, index: number) => {
                dataSource.value?.push(ele as never);
            });
            dataSource.value = uniqBy(dataSource.value, 'operationCode');
        });
        load();
    });

    defineExpose({
        dataSource
    });
</script>

<style scoped lang="less">
    .list {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: auto;

        :deep(.tpf-collapse-content) {
            flex: 1;
            overflow: auto;

            .ant-card {
                height: 100%;
                border-radius: 8px 8px 8px 8px;

                .ant-card-body {
                    padding: 12px;
                    height: 100%;

                    .tpf-table {
                        height: 100%;
                    }
                }
            }
        }
    }
</style>
