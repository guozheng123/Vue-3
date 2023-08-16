<template>
    <TpfCollapse :title="title" class="inStorageDetail">
        <TpfForm
            ref="TpfFormRef"
            @onSubmit="onSubmit"
            :formList="formList"
            hiddenCollapse
            hiddenSubmit
            noUseInit
            :labelCol="{ style: { width: '130px' } }"
        />
        <a-form ref="formRef" :model="tableForm" class="table-form">
            <TpfTable
                class="tpf-table-form"
                v-bind="{ ...tableInfo, columns, seq: true, pagination, dataSource }"
            />
        </a-form>
    </TpfCollapse>
</template>

<script setup lang="tsx" name="inStorageDetail">
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import TpfTable from '@/components/TpfTable/index.vue';
    import { tableResizable } from '@/config';
    import { useAntdTable, useAntdForm } from '@/hooks';
    import { TpfColumnType } from '@/types';
    import { Select, FormItem } from 'ant-design-vue';
    import { ref, computed, toRefs, unref, reactive, onMounted } from 'vue';
    import { checkRequired } from '@/formRuleConfig/Tpfrules';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { useWarehouseApi } from '@/api';
    import type { ResGetPositionDataList, ResGetStoreLocationDataList } from '@/api';

    type Props = {
        type: string;
        inStorageList?: { [k: string]: any }[];
    };

    const props = withDefaults(defineProps<Props>(), {
        type: 'qualified',
        inStorageList: () => []
    });
    const warehouseManagementAPi = useWarehouseApi();

    const { formRef, submitForm } = useAntdForm();
    const tableForm = reactive<{ dataSource: { [k: string]: any }[] }>({
        dataSource: []
    });
    const { dataSource } = toRefs(tableForm);
    const searchInfo = ref<{ [key: string]: string }>();
    const selectPositionList = ref<ResGetPositionDataList[]>([]);
    const selectStoreCodeList = ref<ResGetStoreLocationDataList[]>([]);
    const TpfFormRef = ref<InstanceType<typeof TpfForm> | null>(null);

    const formList = computed(() => [
        {
            type: 'Select',
            field: 'positionCode',
            label: '批量选择入库仓位',
            allowClear: true,
            fieldNames: { label: 'name', value: 'code' },
            disabled: !unref(dataSource).length,
            options: [...unref(selectPositionList)],
            onChange: async (value: any) => {
                await TpfFormRef.value?.onSubmit();
                onUpdateTableList({ type: 'positionCode', value });
                onGetStoreList(value);
                resetStoreCode();
            },
            onFocus: () => onGetPositionList()
        },
        {
            type: 'Select',
            field: 'storeLocationCode',
            label: '批量选择入库库位',
            allowClear: true,
            fieldNames: { label: 'storeLocationName', value: 'storeLocationCode' },
            options: [...unref(selectStoreCodeList)],
            disabled: !unref(dataSource).length,
            onChange: async (value: string) => {
                await TpfFormRef.value?.onSubmit();
                onUpdateTableList({ type: 'storeLocationCode', value });
            }
        }
    ]);
    const columns = computed(() => {
        return [
            {
                title: '到货单号',
                dataIndex: 'arrival_no',
                ...tableResizable()
            },
            { title: '项目编号', dataIndex: 'project_code', ...tableResizable() },
            {
                title: '批次号',
                dataIndex: 'batch_no',
                ...tableResizable()
            },
            {
                title: '物料编号',
                dataIndex: 'material_code',
                ...tableResizable()
            },
            {
                title: '物料名称',
                dataIndex: 'material_code-material_name',
                ...tableResizable()
            },
            {
                title: '到货数',
                dataIndex: 'arrival_num',
                ...tableResizable()
            },
            {
                title: props.type === 'qualified' ? '合格数' : '不合格数',
                dataIndex: props.type === 'qualified' ? 'qualified_num' : 'no_qualified_num',
                ...tableResizable()
            },
            {
                title: '到货单位',
                dataIndex: 'arrival_unit-material_unit_name',
                ...tableResizable()
            },
            {
                title: () => <span class="required"> 入库仓位</span>,
                dataIndex: 'positionCode',
                ...tableResizable(),
                customRender: ({ record, text, index }) => {
                    return (
                        <FormItem
                            name={['dataSource', index, 'positionCode']}
                            rules={[checkRequired()] as any}
                        >
                            <Select
                                options={record.selectPositionList}
                                class={['workshopCodeRef']}
                                fieldNames={{ label: 'name', value: 'code' }}
                                v-model={[record.positionCode, 'value']}
                                style={{ width: '90%' }}
                                onChange={() => {
                                    onResetCurData(record);
                                    onGetStoreList(record.positionCode, index);
                                }}
                                onFocus={() => onGetPositionList()}
                            />
                        </FormItem>
                    );
                }
            },
            {
                title: '入库库位',
                dataIndex: 'storeLocationCode',
                ...tableResizable(),
                customRender: ({ record, text, index }) => (
                    <Select
                        options={record.selectStoreCodeList}
                        class={['workshopCodeRef']}
                        fieldNames={{ label: 'storeLocationName', value: 'storeLocationCode' }}
                        v-model={[record.storeLocationCode, 'value']}
                        style={{ width: '90%' }}
                        onFocus={() => {
                            if (!(record?.selectStoreCodeList?.length || false))
                                onGetStoreList(record.positionCode, index);
                        }}
                    />
                )
            }
        ] as TpfColumnType[];
    });

    const { tableInfo, pagination } = useAntdTable({
        api: async () => ({ list: [] }),
        rowKey: 'processCode',
        isPageAble: false
    });
    const onSubmit = (val: any) => {
        searchInfo.value = unref(val);
    };
    const title = computed(() => {
        return props.type === 'qualified' ? '合格品入库明细' : '不合格品入库明细';
    });
    const resetStoreCode = async () => {
        selectStoreCodeList.value = [];
        TpfFormRef.value?.setNewState({ ...unref(searchInfo), storeLocationCode: '' });
    };
    const onGetPositionList = async (index?: number) => {
        try {
            if (selectPositionList.value.length) return;
            const { data } = await warehouseManagementAPi.getPositionDataList();
            selectPositionList.value = data.list || [];
            dataSource.value.forEach(item => {
                item.selectPositionList = data.list || [];
            });
        } catch (error) {
            console.log(error);
        }
    };
    const onGetStoreList = async (value: string, index?: number) => {
        try {
            if (!value) return;
            const { data } = await warehouseManagementAPi.getStoreLocationDataList({
                positionCode: value
            });
            if (typeof index === 'number') {
                dataSource.value[index].selectStoreCodeList = data.list || [];
            } else {
                selectStoreCodeList.value = data.list || [];
            }
        } catch (error) {
            console.log(error);
        }
    };
    const onUpdateTableList = async ({ type, value }: { type: string; value?: string }) => {
        dataSource.value.forEach(item => {
            item.selectPositionList = selectPositionList;
            item.selectStoreCodeList = selectStoreCodeList;
            if (type === 'positionCode') {
                item.positionCode = value;
                item.storeLocationCode = '';
            }
            if (type === 'storeLocationCode') {
                item.storeLocationCode = value;
            }
        });
        await submitForm();
    };
    const onResetCurData = (record: any) => {
        record.selectStoreCodeList = [];
        record.storeLocationCode = '';
    };
    onMounted(() => {
        dataSource.value = props.inStorageList;
    });
    const submit = async () => {
        return {
            tableList: {
                ...(await submitForm()),
                list: [...unref(dataSource)]
            }
        };
    };
    defineExpose({ submit });
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
