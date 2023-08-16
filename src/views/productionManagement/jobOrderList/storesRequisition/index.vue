<template>
    <TpfAddInfoLayout title="工序计划" class="storesRequisition">
        <TpfLayout>
            <template #header>
                <LoadingSkeleton>
                    <TpfForm
                        :labelCol="{ style: { width: '120px' } }"
                        :formList="formList"
                        @onSubmit="onSubmit"
                        ref="tpfForm"
                    />
                </LoadingSkeleton>
            </template>
            <template #content>
                <LoadingSkeleton>
                    <TpfTableLayout>
                        <template #default="args">
                            <a-form
                                style="height: 100%"
                                ref="formRef"
                                :model="tableInfo"
                                class="table-form"
                            >
                                <TpfTable
                                    style="height: 100%"
                                    ref="tableInstance"
                                    class="tpf-table-form"
                                    v-bind="{
                                        ...args,
                                        ...tableInfo,
                                        pagination,
                                        seq: true,
                                        columns
                                    }"
                                />
                            </a-form>
                        </template>
                    </TpfTableLayout>
                </LoadingSkeleton>
            </template>
        </TpfLayout>
        <template #footerRight>
            <a-button class="tpf-button" @click="routeBackTab()"> 取消 </a-button>
            <a-button type="primary" class="tpf-button" @click="onSave()"> 保存 </a-button>
        </template>
    </TpfAddInfoLayout>
</template>

<script setup lang="tsx" name="storesRequisition">
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import TpfAddInfoLayout from '@/components/TpfAddInfoLayout/index.vue';
    import { ref, computed, defineAsyncComponent, onMounted, unref } from 'vue';
    import { useAntdTable, useAntdForm, useRouteQuery, useRouteBackTab } from '@/hooks';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { useJobOrderAPi, useOperationTaskListAPi } from '@/api';
    import { tableResizable } from '@/config';
    import { FormItem, Input, message } from 'ant-design-vue';
    import { checkRequired } from '@/formRuleConfig/Tpfrules';
    import TpfInputNumber from '@/components/TpfInputNumber/index.vue';
    import { cloneDeep } from 'lodash-es';
    import type { TpfColumnType } from '@/types';
    import { v4 } from 'uuid';
    import type { materialRequisition } from '@/api';

    const { routeBackTab } = useRouteBackTab();

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const tpfForm = ref<InstanceType<typeof TpfForm> | null>(null);

    const { formRef, validateFields } = useAntdForm();
    const { workOrderIdParams, workOderCodeParams } = useRouteQuery<{
        workOrderIdParams: string;
        workOderCodeParams: string;
    }>();

    const jobOrderAPi = useJobOrderAPi();
    const operationTaskListAPi = useOperationTaskListAPi();

    const workOrderId = ref<string[]>([]);
    const copyWorkOrderId = ref<string[]>([]);
    type searchInfoType = {
        workOrderId: string;
    };
    const searchInfo = ref<any>({});
    const operationNameOptions = ref<any[]>([]);

    const columns = computed<TpfColumnType<materialRequisition>[]>(() => [
        {
            title: '作业工单号',
            dataIndex: 'workOrderCode',
            ...tableResizable()
        },

        { title: '项目编号', dataIndex: 'projectCode', ...tableResizable() },
        { title: '项目名称', dataIndex: 'projectName', ...tableResizable() },
        { title: '物料编号', dataIndex: 'materialCode', ...tableResizable() },
        { title: '物料名称', dataIndex: 'materialName', ...tableResizable() },
        { title: '物料规格', dataIndex: 'materialSpec', ...tableResizable() },

        { title: '工序编号', dataIndex: 'operationCode', ...tableResizable() },
        { title: '工序名称', dataIndex: 'operationName', ...tableResizable() },

        {
            title: '计划领料数',
            dataIndex: 'plannedNumber',
            ...tableResizable(),
            customRender: ({ text }) => {
                return text.toString();
            }
        },
        { title: '已领料数', dataIndex: 'requisitionFinishNumber', ...tableResizable() },
        {
            title: '剩余领料数',
            dataIndex: 'remainingRequisitionNumber',
            ...tableResizable()
        },

        {
            title: () => <span class="required"> 领料数</span>,
            dataIndex: 'requisitionNumber',
            ...tableResizable(),
            customRender: ({ text, record, index }) => {
                return (
                    <FormItem
                        name={['dataSource', index, 'requisitionNumber']}
                        rules={[checkRequired()] as any}
                    >
                        <TpfInputNumber
                            min={0}
                            v-model={[record.requisitionNumber, 'value']}
                            max={record.remainingRequisitionNumber}
                            fromSys={true}
                        />
                    </FormItem>
                );
            }
        },

        { title: '生产单位', dataIndex: 'productUnitCodeName', ...tableResizable() },
        { title: '基本数量', dataIndex: '', ...tableResizable() },
        { title: '基本单位', dataIndex: 'materialUnitName', ...tableResizable() },
        {
            title: '备注',
            dataIndex: 'remark',
            ...tableResizable(),
            customRender: ({ record }) => {
                return <Input v-model={record.remark} allowClear maxlength={50} />;
            }
        }
    ]);

    const formList = computed(() => {
        return [
            {
                type: 'Select',
                field: 'operationCode',
                label: '工序编号',
                showDefaultValue: '',
                placeholder: '',
                allowClear: true,
                options: operationNameOptions.value,
                onChange: (val: any) => {
                    const res = operationNameOptions.value.find(
                        (e: any) => e.operationCode === val
                    ) as any;

                    tpfForm.value?.setNewState({
                        operationName: res ? res.operationName || '' : ''
                    });
                }
            },
            {
                type: 'Input',
                field: 'operationName',
                label: '工序名称',
                disabled: true
            }
        ];
    });

    const onSubmit = (res: searchInfoType) => {
        searchInfo.value = res;
        getDataList();
    };

    const onSave = async () => {
        if (selectedRowInfo.value.selectedRows.length === 0) {
            message.warning('请选择物料!');
            return false;
        }
        const validateFieldsArr = selectedRowInfo.value.selectedRows.map((e: any) => {
            return ['dataSource', e.id, 'requisitionNumber'];
        });
        await validateFields(validateFieldsArr);
        const data = cloneDeep(selectedRowInfo.value.selectedRows);
        const res = await jobOrderAPi.createMaterialRequisitionByWorkOrder(data);
        if (res.data.value === true) {
            message.success('保存成功');
            getDataList();
            routeBackTab();
        }
    };

    const dataCallBack = (list: materialRequisition[]) => {
        const newList = list.map((e: materialRequisition, i: number) => {
            e['index'] = v4();
            e['id'] = i;
            e.requisitionNumber = e.plannedNumber - e.requisitionFinishNumber;
            e.remainingRequisitionNumber = e.plannedNumber - e.requisitionFinishNumber;
            return e;
        });

        return newList;
    };

    const { tableInfo, pagination, getDataList, selectedRowInfo } = useAntdTable({
        api: async () => {
            const params = {
                workOrderId: workOrderId.value,
                ...searchInfo.value
            };
            const res = await jobOrderAPi.materialRequisition(params);
            return res.data.object;
        },
        rowKey: 'index',
        isPageAble: false,
        hasRowSelection: true,
        dataCallBack
    });
    const init = async () => {
        workOrderId.value = workOrderIdParams.split(',');
        copyWorkOrderId.value = cloneDeep(workOrderId.value);
        getDataList();

        const operationNameOptionsRes = await operationTaskListAPi.getOperationList({
            workOderCodes: workOderCodeParams.split(',')
        });
        const res = operationNameOptionsRes.data.list.map((e: any) => {
            e.label = e.operationCode;
            e.value = e.operationCode;
            return e;
        });
        operationNameOptions.value = [{ label: '全部', value: '' }, ...res];
    };
    onMounted(async () => {
        init();
    });
</script>

<style lang="less" scoped>
    .storesRequisition {
        :deep(.addInfoLayout-content) {
            padding: 0 12px;
            box-sizing: border-box;
        }

        :deep(.tpf-collapse) {
            .tpf-collapse-content {
                background: #fff;
            }
        }
    }
</style>
