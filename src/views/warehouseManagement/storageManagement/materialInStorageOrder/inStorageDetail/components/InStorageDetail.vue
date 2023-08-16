<template>
    <TpfCollapse title="入库明细" class="inStorageDetail">
        <TpfTable
            class="tpf-table-form"
            v-bind="{ ...tableInfo, columns, seq: true, pagination, dataSource }"
        />
    </TpfCollapse>
</template>

<script setup lang="tsx" name="inStorageDetail">
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import TpfTable from '@/components/TpfTable/index.vue';
    import { tableResizable, getTpfOptionEnum } from '@/config';
    import { useAntdTable } from '@/hooks';
    import { TpfColumnType } from '@/types';
    import { computed, toRefs, reactive, onUpdated } from 'vue';
    const { getLabel, checkResult, materialOrderSource } = getTpfOptionEnum();
    type Props = {
        inStorageList?: { [k: string]: any }[];
    };

    const props = withDefaults(defineProps<Props>(), {
        inStorageList: () => []
    });
    const tableForm = reactive<{ dataSource: { [k: string]: any }[] }>({
        dataSource: []
    });
    const { dataSource } = toRefs(tableForm);
    const columns = computed(() => {
        return [
            {
                title: '检验单号',
                dataIndex: 'checkNo',
                ...tableResizable()
            },
            {
                title: '到货单号',
                dataIndex: 'arrivalNo',
                ...tableResizable()
            },
            {
                title: '来源单号',
                dataIndex: 'sourceNo',
                ...tableResizable()
            },
            {
                title: '订单来源',
                dataIndex: 'orderSource',
                ...tableResizable(),
                customRender: ({ text }: { text: string }) => {
                    return getLabel(text, materialOrderSource);
                }
            },
            { title: '项目编号', dataIndex: 'projectCode', ...tableResizable() },
            {
                title: '批次号',
                dataIndex: 'batchNo',
                ...tableResizable()
            },
            {
                title: '物料编号',
                dataIndex: 'materialCode',
                ...tableResizable()
            },
            {
                title: '物料名称',
                dataIndex: 'materialName',
                ...tableResizable()
            },
            {
                title: '到货数',
                dataIndex: 'arrivalNum',
                ...tableResizable()
            },
            {
                title: '是否合格',
                dataIndex: 'isQualified',
                ...tableResizable(),
                customRender: ({ text }: { text: string }) => {
                    return getLabel(text, checkResult);
                }
            },
            {
                title: '入库数',
                dataIndex: 'inNum',
                ...tableResizable()
            },
            {
                title: '到货单位',
                dataIndex: 'arrivalUnitName',
                ...tableResizable()
            },
            {
                title: '基本数量',
                dataIndex: 'basicNum',
                ...tableResizable()
            },
            {
                title: '基本单位',
                dataIndex: 'basicUnit',
                ...tableResizable()
            },
            {
                title: '入库仓位',
                dataIndex: 'positionName',
                ...tableResizable()
            },
            {
                title: '入库库位',
                dataIndex: 'storeLocationName',
                ...tableResizable()
            }
        ] as TpfColumnType[];
    });

    const { tableInfo, pagination } = useAntdTable({
        api: async () => ({ list: [] }),
        rowKey: 'processCode',
        isPageAble: false
    });
    onUpdated(() => {
        dataSource.value = props.inStorageList;
    });
</script>

<style lang="less">
    .inStorageDetail {
        &.tpf-collapse {
            .tpf-collapse-content {
                padding: 12px;
                box-sizing: border-box;
                height: 280px;
                display: flex;
                flex-direction: column;

                // .table-form {
                //     flex: 1 0 0;
                // }

                // .tpf-table {
                //     height: 100%;
                // }
            }
        }
    }
</style>
