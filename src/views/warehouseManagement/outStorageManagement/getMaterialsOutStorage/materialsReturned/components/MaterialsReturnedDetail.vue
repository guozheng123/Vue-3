<template>
    <TpfCollapse title="退料单明细" class="MaterialsReturnedDetail">
        <template #right>
            <a-button
                ghost
                type="primary"
                class="tpf-button"
                :disabled="isEmpty(dataSource)"
                @click="onDelete"
            >
                <SvgIcon type="icon-shanchu" /> 删除
            </a-button>
        </template>
        <a-form ref="formRef" :model="tableForm" class="table-form">
            <TpfTable
                class="tpf-table-form"
                v-bind="{
                    ...tableInfo,
                    columns,
                    seq: true,
                    pagination,
                    dataSource
                }"
            />
        </a-form>
    </TpfCollapse>
</template>

<script setup lang="tsx" name="MaterialsReturnedDetail">
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import TpfTable from '@/components/TpfTable/index.vue';
    import { useAntdTable, useAntdForm } from '@/hooks';
    import { TpfColumnType } from '@/types';
    import { FormItem } from 'ant-design-vue';
    import { ref, computed, toRefs, unref, reactive, onUpdated } from 'vue';
    import { checkRequired, checkGreaterThan } from '@/formRuleConfig/Tpfrules';
    import TpfInputNumber from '@/components/TpfInputNumber/index.vue';
    import { isEmpty } from 'lodash-es';

    type Props = {
        originalInfo?: { [k: string]: any }[];
    };
    const props = withDefaults(defineProps<Props>(), {
        originalInfo: () => []
    });
    const { formRef, submitForm } = useAntdForm();
    const tableForm = reactive<{ dataSource: { [k: string]: any }[] }>({
        dataSource: []
    });
    const { dataSource } = toRefs(tableForm);
    const columns = computed(() => {
        return [
            {
                title: '物料编号',
                dataIndex: 'materialCode'
            },
            {
                title: '物料名称',
                dataIndex: 'materialName'
            },
            {
                title: '规格',
                dataIndex: 'materialSpec'
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
                title: '作业工单编号',
                dataIndex: 'materialUnitName'
            },
            {
                title: '工序编号',
                dataIndex: 'workOrderCode'
            },
            {
                title: '工序名称',
                dataIndex: 'operationName'
            },
            {
                title: '单位',
                dataIndex: 'productUnitCode'
            },
            {
                title: '出库数',
                dataIndex: 'outStorageNumber'
            },
            {
                title: '替代料编号',
                dataIndex: 'replaceMaterialCode'
            },
            {
                title: '替代料名称',
                dataIndex: 'replaceMaterialName'
            },
            {
                title: '仓位',
                dataIndex: 'positionName'
            },
            {
                title: '基本数量',
                dataIndex: ''
            },
            {
                title: '基本单位',
                dataIndex: 'materialUnitName'
            },
            {
                title: '批次',
                dataIndex: 'batchNo'
            },
            {
                title: '备注',
                dataIndex: 'remark'
            },
            {
                title: '已退料数',
                dataIndex: 'returnFinishNumber'
            },
            {
                title: '本次退料数',
                dataIndex: 'returnNum',
                customRender: ({ record, index }) => {
                    const { outStorageNumber = 0, returnFinishNumber = 0, returnNum } = record;
                    return (
                        <FormItem
                            name={['dataSource', index, 'returnNum']}
                            rules={
                                [
                                    checkGreaterThan(),
                                    {
                                        validator: async (_rule: any, value: string) => {
                                            if (returnNum > outStorageNumber - returnFinishNumber) {
                                                return Promise.reject('不能大于剩余退料数');
                                            }
                                            return Promise.resolve();
                                        },
                                        trigger: ['change', 'blur']
                                    }
                                ] as any
                            }
                        >
                            <TpfInputNumber
                                style={{ width: '90%' }}
                                v-model={[record.returnNum, 'value']}
                            />
                        </FormItem>
                    );
                }
            }
        ] as TpfColumnType[];
    });
    const { tableInfo, pagination, selectedRowInfo } = useAntdTable({
        api: async () => ({ list: [] }),
        rowKey: 'countId',
        isPageAble: false,
        hasRowSelection: true
    });

    const onDelete = () => {
        const { selectedRowKeys } = unref(selectedRowInfo);
        dataSource.value = dataSource.value.filter(item => {
            if (!selectedRowKeys.includes(item.countId)) return item;
        });
        selectedRowInfo.value.selectedRowKeys = [];
    };
    const submit = async () => {
        await submitForm();
        return unref(dataSource);
    };
    onUpdated(() => {
        let countId = 0;
        dataSource.value = props.originalInfo.map(item => {
            countId++;
            return {
                ...item,
                countId
            };
        });
    });
    defineExpose({ submit });
</script>

<style lang="less" scoped>
    .MaterialsReturnedDetail {
        .tpf-table-form {
            height: 350px;
        }
    }
</style>
