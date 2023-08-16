<template>
    <TpfCollapse title="工序列表" class="processInfo">
        <AddProcessModal
            v-if="showAddProcessFromMaterielModalDom"
            ref="addProcessFromMaterielModalDom"
            @clickFu="clickFu"
        />
        <!-- 表格 -->
        <TpfTable v-bind="{ ...tableInfo, columns, seq: true, pagination, operateColumn }" />

        <template #right>
            <a-button
                v-if="!readOnly"
                type="primary"
                class="tpf-button"
                ghost
                @click="openAddProcessModal"
            >
                <SvgIcon type="icon-shu_xinzeng" cursor />添加
            </a-button>
        </template>
    </TpfCollapse>
</template>

<script setup lang="tsx" name="processInfo">
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import TpfTable from '@/components/TpfTable/index.vue';
    import { tableResizable, getTpfOptionEnum } from '@/config';
    import { useAntdTable, useRef } from '@/hooks';
    import { TpfColumnType } from '@/types';
    import { ref, computed, unref, watchEffect, defineAsyncComponent, onMounted } from 'vue';
    import { useAddProcessFromMaterielModal } from '@/components/commonComponents';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import { unionBy } from 'lodash-es';

    const {
        addProcessFromMaterielModalDom,
        openAddProcessFromMaterielModalDom,
        showAddProcessFromMaterielModalDom
    } = useAddProcessFromMaterielModal();

    type Props = {
        list?: { [k: string]: any }[];
        readOnly?: boolean;
        fieldName?: string;
    };
    const props = withDefaults(defineProps<Props>(), {
        list: () => [],
        readOnly: false,
        fieldName: 'operationRequestVos'
    });

    // 点击添加按钮弹出选择工序弹框
    const AddProcessModal = defineAsyncComponent(() => import('./AddProcessFromMaterielModal.vue'));

    const dataSource = ref<any[]>([{}, {}]);
    const { operationTypeNameListOptions, getLabel } = getTpfOptionEnum();

    // 表格的列数据
    const columns = computed(() => {
        return [
            { title: '工序编号', dataIndex: 'operationCode', ...tableResizable() },
            { title: '工序名称', dataIndex: 'operationName', ...tableResizable() },
            {
                title: '工序类型',
                dataIndex: 'operationTypeCode',
                ...tableResizable(),
                customRender: ({ text }) => getLabel(text, operationTypeNameListOptions)
            }
        ] as TpfColumnType[];
    });

    // 自定义事件
    const clickFu = (info: any[]) => {
        setTableList(unionBy([...unref(getTableList()), ...info], 'operationCode'));
    };
    // 操作
    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 80,
        fixed: 'right',
        visible: !props.readOnly,
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });
    // 删除
    const defaultBtn = [
        {
            title: '删除',
            onClick: ({ record }: any) => delSelectRow([record.operationCode])
        }
    ];

    const {
        tableInfo,
        pagination,
        selectedRowInfo,
        getDataList,
        setTableList,
        getTableList,
        delSelectRow
    } = useAntdTable({
        api: async () => ({ list: [] as any[] }),
        rowKey: 'operationCode',
        isPageAble: false
    });
    const setMaterialProcessList = (list: Record<string, any>[]) => {
        dataSource.value = unref(list).map(item => ({
            ...item,
            defaultFlag: item.defaultProcess
        }));
    };

    // 添加按钮
    const openAddProcessModal = () => {
        openAddProcessFromMaterielModalDom(unref(dataSource));
    };

    const [visible, setVisible] = useRef(false);
    // const open = (val: string[]) => {
    //     setVisible(!visible.value);
    //     selectedRowInfo.value.selectedRowKeys = val;
    //     unref(pagination).current = 1;

    //     getDataList();
    // };
    const submit = async () => {
        return { [props.fieldName]: unref(getTableList()) };
    };
    watchEffect(() => {
        if (props.list) {
            setTableList(props.list || []);
        }
    });
    onMounted(() => {
        getDataList();
    });
    defineExpose({ submit, setMaterialProcessList, dataSource });
</script>

<style lang="less">
    .processInfo {
        &.tpf-collapse {
            .tpf-collapse-content {
                padding: 12px;
                box-sizing: border-box;
                height: 280px;

                .tpf-table {
                    height: 100%;
                }
            }
        }
    }
</style>
