<template>
    <div class="drawer_container">
        <div v-if="drawerType === 'grid'">
            <div class="drawer_title">画布背景设置</div>
            <div class="drawer_wrap">
                <a-form>
                    <a-form-item label="是否显示网格">
                        <a-switch v-model:checked="showGrid" @change="changeGrid" />
                    </a-form-item>
                    <div v-show="showGrid">
                        <a-form-item label="网格类型">
                            <a-radio-group v-model:value="gridType" @change="changeGridType">
                                <a-radio
                                    v-for="item in gridTypeList"
                                    :key="item.value"
                                    :value="item.value"
                                >
                                    {{ item.label }}</a-radio
                                >
                            </a-radio-group>
                        </a-form-item>
                        <a-form-item label="网格大小">
                            <a-slider
                                v-model:value="gridSize"
                                :min="0"
                                :max="30"
                                @change="changeGridSize"
                            ></a-slider>
                        </a-form-item>
                        <!-- <a-form-item label="网格线宽度">
                            <a-slider
                                v-model:value="localGrid.args.thickness"
                                :min="0"
                                :max="20"
                                @change="changeGrid"
                            ></a-slider>
                        </a-form-item> -->
                    </div>
                </a-form>
            </div>
        </div>
        <div v-if="drawerType === 'node'">
            <div class="drawer_title">节点设置</div>
            <div class="drawer_wrap">
                <a-form>
                    <a-form-item label="节点文本">
                        <a-input v-model:value="drawNodeText" @change="changeNodeText"></a-input>
                    </a-form-item>
                    <a-form-item label="节点背景">
                        <input
                            v-model="customColor"
                            type="color"
                            style="position: absolute; overflow: hidden"
                            class="inset-0"
                            :style="colorPickerStyle"
                            @input="setThemeColor({ primaryColor: customColor }, 'body')"
                        />
                        <span :style="{ visibility: getThemeColorVisible(customColor) }"> ✔ </span>
                    </a-form-item>
                    <a-form-item label="字体大小">
                        <a-slider
                            v-model:value="drawNodeTextFontSize"
                            :min="10"
                            :max="20"
                            @change="changefontSize"
                        ></a-slider>
                    </a-form-item>
                    <a-form-item label="字体颜色">
                        <input
                            v-model="customColor"
                            type="color"
                            style="position: absolute; overflow: hidden"
                            class="inset-0"
                            :style="colorPickerStyle"
                            @input="setThemeColor({ primaryColor: customColor }, 'label')"
                        />
                        <span :style="{ visibility: getThemeColorVisible(customColor) }"> ✔ </span>
                    </a-form-item>
                    <a-form-item label="边框宽度">
                        <a-slider
                            v-model:value="drawerNodeStrokeWidth"
                            :min="0"
                            :max="10"
                            @change="changeStrokeWidth"
                        ></a-slider>
                    </a-form-item>
                    <a-form-item label="线条颜色">
                        <input
                            v-model="customColor"
                            type="color"
                            style="position: absolute; overflow: hidden"
                            class="inset-0"
                            :style="colorPickerStyle"
                            @input="setThemeColor({ primaryColor: customColor }, 'line')"
                        />
                        <span :style="{ visibility: getThemeColorVisible(customColor) }"> ✔ </span>
                    </a-form-item>
                    <a-form-item label="功能">
                        <a-button
                            type="primary"
                            danger
                            class="margin-left-10"
                            @click="$emit('deleteNode')"
                            >删除</a-button
                        >
                    </a-form-item>
                </a-form>
            </div>
        </div>

        <div v-if="drawerType === 'edge'">
            <div class="drawer_title">线条设置</div>
            <div class="drawer_wrap">
                <a-form>
                    <a-form-item label="线条文本">
                        <a-input v-model:value="drawerEdgeText" @change="changeEdgeText"></a-input>
                    </a-form-item>
                    <a-form-item label="线条宽度">
                        <a-slider
                            v-model:value="drawerEdgeWidth"
                            :min="1"
                            :max="10"
                            @change="changeEdgeWidth"
                        ></a-slider>
                    </a-form-item>
                    <!--  <el-form-item label="线条颜色">
                        <el-color-picker v-model="drawerEdge.edgeColor" @change="changeEdgeColor" />
                    </el-form-item> -->
                    <a-form-item label="功能">
                        <a-button
                            type="primary"
                            danger
                            class="margin-left-10"
                            @click="$emit('deleteNode')"
                            >删除</a-button
                        >
                    </a-form-item>
                </a-form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, toRefs, Ref, watch, StyleValue } from 'vue';
    import { girdType } from './index';
    import { useThemeStore } from '@/store/modules/projectConfig';
    import type { ThemeName, Theme, ThemeState } from '@/store/modules/projectConfig';

    const themeStore = useThemeStore();
    const customColor = ref(themeStore.primaryColor);

    const colorPickerStyle = computed(
        () => ({ '--custom-color': customColor.value } as StyleValue)
    );
    //节点背景
    const setThemeColor = ({ primaryColor }: Theme, type: string) => {
        console.log(primaryColor);
        const color = `${type}` + '/fill';
        props.selectCell.attr(color, primaryColor);
    };

    const getThemeColorVisible = (color: string) =>
        themeStore.primaryColor === color ? 'visible' : 'hidden';

    type Props = {
        drawerType: string;
        selectCell?: any;
        graph: any;
        grid: girdType;
    };
    const props = defineProps<Props>();
    const localGrid = toRefs(props.grid) as any;
    const gridType = ref('mesh');
    const gridSize = ref(21);
    const drawNodeText = ref('');
    const drawNodeTextFontSize = ref(14);
    const drawerNodeStrokeWidth = ref(1);
    const drawerEdgeWidth = ref(1);

    const drawerEdgeText = ref('');

    const gridTypeList = ref([
        {
            label: '四边网格',
            value: 'mesh'
        },
        {
            label: '点状网格',
            value: 'dot'
        }
    ]);
    const showGrid = ref(true);

    watch(
        () => props.selectCell,
        (val: any) => {
            if (val) {
                if (val.isNode()) {
                    return;
                }
            }
        },
        { deep: true, immediate: true }
    );
    const changeEdgeWidth = async () => {
        props.selectCell.attr('line/strokeWidth', drawerEdgeWidth.value);
    };
    //节点文本
    const changeEdgeText = async () => {
        props.selectCell.setLabels([{ attrs: { label: { text: drawerEdgeText.value } } }]);
    };
    //修改节点文本
    const changeNodeText = async () => {
        props.selectCell.attr('label/text', drawNodeText.value);
    };
    //修改节点文本大小
    const changefontSize = async () => {
        props.selectCell.attr('label/fontSize', drawNodeTextFontSize.value);
    };

    //修改节点宽度
    const changeStrokeWidth = async () => {
        props.selectCell.attr('body/strokeWidth', drawerNodeStrokeWidth.value);
    };
    //是否显示网格
    const changeGridType = async (e: any) => {
        localGrid.type.value = e.target.value;
        changeGrid();
    };
    //网格大小
    const changeGridSize = async () => {
        localGrid.size.value = gridSize.value;
        changeGrid();
    };

    // 网格设置
    const changeGrid = async () => {
        const { args, size, visible, type } = localGrid;
        props.graph.drawGrid({
            // args: args.value,
            size: size.value,
            visible: visible.value,
            type: type.value
        });
        showGrid.value ? props.graph.showGrid() : props.graph.hideGrid();
    };
</script>

<style lang="less" scoped>
    .drawer_container {
        max-width: 300px;
        min-width: 300px;

        .drawer_title {
            border-bottom: 1px solid #e8eaec;
            box-sizing: border-box;
            padding: 14px 16px;
            color: #333;
            font-size: 16px;
        }

        .drawer_wrap {
            box-sizing: border-box;
            padding: 20px 10px 20px 20px;
        }
    }
</style>
