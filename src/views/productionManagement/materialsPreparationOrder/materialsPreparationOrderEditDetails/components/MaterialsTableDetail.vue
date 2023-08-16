<template>
    <TpfCollapse title="入库明细" class="MaterialsTableDetail">
        <a-form ref="formRef" :model="tableForm" class="table-form">
            <TpfTable
                class="tpf-table-form"
                v-bind="{
                    columns,
                    seq: true,
                    dataSource
                }"
            />
        </a-form>
    </TpfCollapse>
</template>

<script setup lang="tsx" name="MaterialsTableDetail">
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import TpfTable from '@/components/TpfTable/index.vue';
    import { getTpfOptionEnum } from '@/config';
    import { TpfColumnType } from '@/types';
    import { Input, message } from 'ant-design-vue';
    import { ref, computed, toRefs, unref, reactive, watchEffect } from 'vue';
    const { getLabel, overProductionEnum } = getTpfOptionEnum();
    type Props = {
        originalInfo?: { [k: string]: any }[];
        isEdit: boolean;
    };
    const props = withDefaults(defineProps<Props>(), {
        originalInfo: () => [],
        isEdit: false
    });

    const tableForm = reactive<{ dataSource: { [k: string]: any }[] }>({
        dataSource: []
    });
    const { dataSource } = toRefs(tableForm);
    const columns = computed(() => {
        return [
            {
                title: '生产订单编号',
                dataIndex: 'businessCode'
            },
            {
                title: '项目编号',
                dataIndex: 'projectCode'
            },
            {
                title: '项目名称',
                dataIndex: 'projectName'
            },
            {
                title: '物料编号',
                dataIndex: 'materialCode'
            },
            {
                title: '物料名称',
                dataIndex: 'materialName'
            },
            {
                title: '计划数量',
                dataIndex: 'planNum'
            },

            props.isEdit && {
                title: '单位',
                dataIndex: 'materialUnitName'
            },
            {
                title: '工序编号',
                dataIndex: 'techCode',
                customRender: ({ record, index }) => {
                    if (props.isEdit)
                        return <Input v-model={[record.techCode, 'value']} maxlength={50} />;
                    return record.techCode;
                }
            } as TpfColumnType,
            {
                title: '是否保税',
                dataIndex: 'isBonded',
                customRender: ({ text }) => getLabel(text, overProductionEnum)
            } as TpfColumnType,
            {
                title: '是否采购方供货',
                dataIndex: 'purchaserSupplyFlag',
                customRender: ({ text }) => getLabel(text, overProductionEnum)
            } as TpfColumnType,
            {
                title: '比例数',
                dataIndex: 'proportion'
            },

            !props.isEdit && {
                title: '实际出库数',
                dataIndex: 'outStorageNumber'
            },
            !props.isEdit && {
                title: '已退料数',
                dataIndex: 'returnedNumber'
            }
        ].filter(item => item) as TpfColumnType[];
    });

    watchEffect(() => {
        if (props.originalInfo) {
            dataSource.value = props.originalInfo;
        }
    });
</script>

<style lang="less">
    .MaterialsTableDetail {
        .nStorageDetail-header {
            display: flex;
        }

        &.tpf-collapse {
            .tpf-collapse-content {
                padding: 12px;
                box-sizing: border-box;
                height: 380px;
                display: flex;
                flex-direction: column;

                .table-form {
                    flex: 1 0 0;
                }

                .tpf-table {
                    height: 100%;
                }
            }
        }
    }
</style>
