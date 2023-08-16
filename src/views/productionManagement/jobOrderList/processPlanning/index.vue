<template>
    <TpfAddInfoLayout title="工序计划" class="productionOrderDetail">
        <TpfLayout>
            <template #header>
                <LoadingSkeleton>
                    <TpfForm
                        :labelCol="{ style: { width: '120px' } }"
                        :formList="formList"
                        @onSubmit="onSubmit"
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
                        <template #operateLeft>
                            <TpfForm
                                :formList="formListTitle"
                                hiddenCollapse
                                hiddenSubmit
                                noUseInit
                                ref="TpfFormRef"
                                :labelCol="{ style: { width: '120px' } }"
                            />
                        </template>
                        <template #operateRight>
                            <a-button @click="onSave" class="tpf-button" type="primary" ghost>
                                <SvgIcon type="icon-daoru" style="margin-right: 5px" />
                                下达
                            </a-button>
                        </template>
                    </TpfTableLayout>
                </LoadingSkeleton>
            </template>
        </TpfLayout>

        <TeamGroupsModel @setTeamGroups="setTeamGroups" ref="teamGroupsModel" />
        <PersonLiableModel @setData="setPerson" ref="personLiableModel" />
        <ProcessPlanningDetail ref="processPlanningDetail" />
    </TpfAddInfoLayout>
</template>

<script setup lang="tsx" name="ProcessPlanning">
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import TpfAddInfoLayout from '@/components/TpfAddInfoLayout/index.vue';
    import { ref, computed, defineAsyncComponent, onMounted, unref } from 'vue';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { useAntdTable, useOpenAntdModal, useAntdForm, useRouteQuery } from '@/hooks';
    import { getTpfOptionEnum } from '@/config';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { useJobOrderAPi, workingProcedurePlan, useOperationTaskListAPi } from '@/api';
    import type { queryResponsiblePersonListType } from '@/api';
    import { tableResizable } from '@/config';
    import { FormItem, Select, message, Input } from 'ant-design-vue';
    import { checkRequired, checkIsAfterTime } from '@/formRuleConfig/Tpfrules';
    import TpfInputNumber from '@/components/TpfInputNumber/index.vue';
    import dayjs from 'dayjs';
    import { cloneDeep } from 'lodash-es';
    import type { TpfColumnType } from '@/types';
    import { withTpfTableSortColumn } from '@/components/TpfTable/index';
    import { v4 } from 'uuid';

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const PersonLiableModel = defineAsyncComponent(
        () => import('./components/PersonLiableModel.vue')
    );
    const TeamGroupsModel = defineAsyncComponent(() => import('./components/TeamGroupsModel.vue'));

    const ProcessPlanningDetail = defineAsyncComponent(
        () => import('./components/ProcessPlanningDetail.vue')
    );

    const TpfFormRef = ref<InstanceType<typeof TpfForm> | null>(null);

    const { formRef, validateFields } = useAntdForm();
    const { params } = useRouteQuery<{ params: string }>();

    const [teamGroupsModel, onOpenTeamGroupsModel] = useOpenAntdModal();
    const [personLiableModel, onOpenPersonLiableModel] = useOpenAntdModal();

    const [processPlanningDetail, onOpenProcessPlanningDetail] = useOpenAntdModal();

    const { statusOptionStr } = getTpfOptionEnum();

    const jobOrderAPi = useJobOrderAPi();
    const operationTaskListAPi = useOperationTaskListAPi();

    const workOrderId = ref<string[]>([]);
    const copyWorkOrderId = ref<string[]>([]);
    type searchInfoType = {
        workOrderId: string;
    };
    const searchInfo = ref<any>({});
    const operationNameOptions = ref([]);
    const workOrderIdOptions = ref([{ label: '所有', value: '' }]);
    const isAllOpenPerson = ref(false); //是否全选责任人
    const openResponIndex = ref(0); //单选责任人列表下标

    const isAllOpenTeamGroups = ref(false); //是否全选班组
    const openTeamGroupsIndex = ref(0); //单选班组下标
    const columns = computed<TpfColumnType<workingProcedurePlan>[]>(() => [
        {
            title: '作业工单号',
            dataIndex: 'workOrderCode',
            ...tableResizable(),
            sorter: (a, b) => withTpfTableSortColumn(a, b)('workOrderCode')
        },
        {
            title: '生产订单号',
            dataIndex: 'productionOrderCode',
            ...tableResizable(),
            sorter: (a, b) => withTpfTableSortColumn(a, b)('productionOrderCode')
        },
        { title: '项目编号', dataIndex: 'projectCode', ...tableResizable() },
        { title: '项目名称', dataIndex: 'projectName', ...tableResizable() },
        { title: '物料编号', dataIndex: 'materialCode', ...tableResizable() },
        { title: '物料名称', dataIndex: 'materialName', ...tableResizable() },
        { title: '工序编号', dataIndex: 'operationCode', ...tableResizable() },
        { title: '工序名称', dataIndex: 'operationName', ...tableResizable() },
        {
            title: '作业单元',
            dataIndex: 'workUnitCode',
            ...tableResizable(),
            customRender: ({ text, record, index }) => {
                if (record.surplusNumber === 0) {
                    return text;
                }
                return (
                    <FormItem name={['dataSource', index, 'workUnitCode']}>
                        <Select
                            fieldNames={{ label: 'workUnitName', value: 'workUnitCode' }}
                            v-model:value={record.workUnitCode}
                            options={record.workUnitList}
                        ></Select>
                    </FormItem>
                );
            }
        },

        {
            title: () => <span class="required"> 计划开始日期</span>,
            dataIndex: 'plannedStartDate',
            // ...tableResizable(),
            width: '180px',
            customRender: ({ text, record, index }) => {
                if (record.surplusNumber === 0) {
                    return text;
                }
                return (
                    <FormItem
                        name={['dataSource', index, 'plannedStartDate']}
                        rules={[checkIsAfterTime(record), checkRequired()] as any}
                    >
                        <a-date-picker
                            valueFormat="YYYY-MM-DD"
                            v-model:value={record.plannedStartDate}
                            allowClear
                        />
                    </FormItem>
                );
            }
        },
        {
            title: '计划结束日期',
            dataIndex: 'plannedEndDate',
            // ...tableResizable(),
            width: '180px',
            customRender: ({ text, record }) => {
                if (record.surplusNumber === 0) {
                    return text;
                }
                return (
                    <a-date-picker valueFormat="YYYY-MM-DD" v-model:value={record.plannedEndDate} />
                );
            }
        },

        { title: '工序计划数', dataIndex: 'plannedNumber', ...tableResizable() },
        {
            title: '已排数',
            dataIndex: 'plannedEndNumber',
            ...tableResizable(),
            customRender: ({ text, record }) => {
                if (text !== 0) {
                    return <a onClick={() => onPlannedEndNumber(record)}>{text}</a>;
                } else {
                    return text;
                }
            }
        },
        { title: '剩余数', dataIndex: 'surplusNumber', ...tableResizable() },
        {
            title: () => <span class="required"> 计划数</span>,
            dataIndex: 'operationPlannedNumber',
            ...tableResizable(),
            customRender: ({ text, record, index }) => {
                if (record.surplusNumber === 0) {
                    return text;
                }
                return (
                    <FormItem
                        name={['dataSource', index, 'operationPlannedNumber']}
                        rules={[checkRequired()] as any}
                    >
                        <TpfInputNumber
                            v-model={[record.operationPlannedNumber, 'value']}
                            class="BDom"
                            max={record.surplusNumber}
                            fromSys={true}
                        />
                    </FormItem>
                );
            }
        },

        {
            title: '班组',
            dataIndex: 'workingTeamName',
            width: '180px',
            customRender: ({ record, index }) => {
                if (record.surplusNumber === 0) {
                    return '';
                }
                return (
                    <Input
                        readonly={true}
                        v-model:value={record.workingTeamName}
                        addonAfter={
                            <SvgIcon
                                type="icon-sousuo"
                                size="16"
                                cursor
                                onClick={() => openTeamGroups(index)}
                            />
                        }
                    ></Input>
                );
            }
        },
        {
            title: '责任人',
            dataIndex: 'userName',
            width: '180px',
            customRender: ({ record, index }) => {
                if (record.surplusNumber === 0) {
                    return '';
                }
                return (
                    <Input
                        readonly={true}
                        v-model:value={record.userName}
                        addonAfter={
                            <SvgIcon
                                type="icon-sousuo"
                                size="16"
                                cursor
                                onClick={() => openResponsible(index)}
                            />
                        }
                    ></Input>
                );
            }
        }
    ]);
    const formListTitle = computed(() => {
        return [
            {
                type: 'DatePicker',
                valueFormat: 'YYYY-MM-DD',
                label: '计划开始日期',
                field: 'planStartTimeVal',
                onChange: planStartTime
            },
            {
                type: 'DatePicker',
                valueFormat: 'YYYY-MM-DD',
                label: '计划开结束日期',
                field: 'planEndTimeVal',
                onChange: planEndTime
            },
            {
                type: 'Input',
                field: 'openTeamGroups',
                showDefaultValue: '',
                label: '班组',
                readOnly: true,
                slots: {
                    addonAfter: () => (
                        <SvgIcon
                            type="icon-sousuo"
                            size="16"
                            cursor
                            onClick={() => openTeamGroups()}
                        />
                    )
                }
            },
            {
                type: 'Input',
                field: 'openResponsible',
                showDefaultValue: '',
                label: '责任人',
                readOnly: true,
                slots: {
                    addonAfter: () => (
                        <SvgIcon
                            type="icon-sousuo"
                            size="16"
                            cursor
                            onClick={() => openResponsible()}
                        />
                    )
                }
            }
        ];
    });
    const formList = computed(() => {
        return [
            {
                type: 'Select',
                field: 'operationName',
                label: '工序',
                showDefaultValue: '',
                placeholder: '',
                allowClear: true,
                options: operationNameOptions.value,
                fieldNames: {
                    label: 'operationName',
                    value: 'operationName'
                }
            },
            {
                type: 'Select',
                field: 'workOrderId',
                label: '作业工单号',
                showDefaultValue: '',
                placeholder: '',
                allowClear: true,
                options: workOrderIdOptions.value
            },
            {
                type: 'Select',
                field: 'isHide',
                label: '隐藏已排完工序',
                placeholder: '',
                showDefaultValue: '1',
                allowClear: true,
                options: statusOptionStr
            }
        ];
    });

    const onSubmit = (res: searchInfoType) => {
        searchInfo.value = res;
        getDataList();
    };

    const planStartTime = (e?: any) => {
        const changeIds = selectedRowInfo.value.selectedRowKeys;
        const changeRow = selectedRowInfo.value.selectedRows;
        if (e) {
            const data = tableInfo.value.dataSource?.map((ele: workingProcedurePlan) => {
                if (
                    ele.surplusNumber !== 0 &&
                    selectedRowInfo.value.selectedRowKeys.includes(ele.index)
                ) {
                    ele.plannedStartDate = dayjs(e).format('YYYY-MM-DD');
                }
                return ele;
            });
            setTableList(data || []);
            selectedRowInfo.value.selectedRowKeys = changeIds;
            selectedRowInfo.value.selectedRows = changeRow;
        }
    };

    const planEndTime = (e?: any) => {
        const changeIds = selectedRowInfo.value.selectedRowKeys;
        const changeRow = selectedRowInfo.value.selectedRows;
        if (e) {
            const data = tableInfo.value.dataSource?.map((ele: workingProcedurePlan) => {
                if (
                    ele.surplusNumber !== 0 &&
                    selectedRowInfo.value.selectedRowKeys.includes(ele.index)
                ) {
                    ele.plannedEndDate = dayjs(e).format('YYYY-MM-DD');
                }
                return ele;
            });
            setTableList(data || []);
            selectedRowInfo.value.selectedRowKeys = changeIds;
            selectedRowInfo.value.selectedRows = changeRow;
        }
    };
    const onPlannedEndNumber = async (record: workingProcedurePlan) => {
        const res = await jobOrderAPi.getOperationTaskOrderListByWorkOrderCode({
            workOrderCode: record.workOrderCode,
            operationCode: record.operationCode
        });
        onOpenProcessPlanningDetail(res);
    };
    const onSave = async () => {
        if (selectedRowInfo.value.selectedRows.length === 0) {
            message.warning('没有选择工序,无法下达');
            return false;
        }

        const validateFieldsArr = selectedRowInfo.value.selectedRows.map((e: any) => {
            return ['dataSource', e.id, 'plannedStartDate'];
        });
        await validateFields(validateFieldsArr);
        let hasSurplusNumberZero = false;
        let hasOperationPlannedNumber = false;
        selectedRowInfo.value.selectedRows.forEach(element => {
            if (element.surplusNumber === 0) {
                hasSurplusNumberZero = true;
            }
            if (element.operationPlannedNumber <= 0) {
                hasOperationPlannedNumber = true;
            }
        });
        if (hasSurplusNumberZero) {
            return message.warning('剩余数为0的无法操作');
        }
        if (hasOperationPlannedNumber) {
            return message.warning('计划数必须大于0');
        }

        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定下达工序计划?', title: '下达' });
        let data = cloneDeep(selectedRowInfo.value.selectedRows);
        const data1 = cloneDeep(selectedRowInfo.value.selectedRows);
        data = data.map((e: any, i: number) => {
            e.plannedNumber = Number(data1[i].operationPlannedNumber);
            e.operationPlannedNumber = Number(data1[i].plannedNumber);
            return e;
        });
        const params = {
            list: data
        };
        const res = await jobOrderAPi.releaseOperationTaskOrder(params);
        if (res.data.object.success === true) {
            message.success('下达成功');
            getDataList();
        }
    };

    const dataCallBack = (list: workingProcedurePlan[]) => {
        const newList = list.map((e: workingProcedurePlan, i: number) => {
            e['index'] = v4();
            e['id'] = i;

            e.operationPlannedNumber = e.surplusNumber;

            return e;
        });

        const filterList = newList.filter((e: workingProcedurePlan) => e.surplusNumber !== 0) || [];
        const ids = filterList.map((e: workingProcedurePlan) => e.index || '');

        selectedRowInfo.value.selectedRowKeys = ids;
        selectedRowInfo.value.selectedRows = unref(filterList);
        return newList;
    };

    const { tableInfo, pagination, getDataList, selectedRowInfo, setTableList } = useAntdTable({
        api: async () => {
            let ids: string[] = [];
            if (searchInfo.value.workOrderId === '') {
                ids = copyWorkOrderId.value;
            } else {
                ids.push(searchInfo.value.workOrderId);
            }
            const params = {
                workOrderId: ids,
                isHide: searchInfo.value.isHide,
                operationName: searchInfo.value.operationName
            };
            const res = await jobOrderAPi.workingProcedurePlan(params);

            // console.log(res.data.object.list, copyWorkOrderId.value);

            return res.data.object;
        },
        rowKey: 'index',
        isPageAble: false,
        hasRowSelection: true,
        dataCallBack
    });

    const openResponsible = (index?: number) => {
        if (typeof index === 'number') {
            isAllOpenPerson.value = false;
            openResponIndex.value = index;
        } else {
            isAllOpenPerson.value = true;
        }
        let ids: string[] = [];
        if (searchInfo.value.workOrderId === '') {
            const result = workOrderIdOptions.value
                .map(item => item.label)
                .filter(item => item !== '所有');
            ids = result;
        } else {
            const result = workOrderIdOptions.value.filter(
                item => item.value === searchInfo.value.workOrderId
            );
            ids.push(result[0].label);
        }
        onOpenPersonLiableModel(ids);
    };
    const openTeamGroups = (index?: number) => {
        if (typeof index === 'number') {
            isAllOpenTeamGroups.value = false;
            openTeamGroupsIndex.value = index;
        } else {
            isAllOpenTeamGroups.value = true;
        }
        let ids: string[] = [];
        if (searchInfo.value.workOrderId === '') {
            const result = workOrderIdOptions.value
                .map(item => item.label)
                .filter(item => item !== '所有');
            ids = result;
        } else {
            const result = workOrderIdOptions.value.filter(
                item => item.value === searchInfo.value.workOrderId
            );
            ids.push(result[0].label);
        }
        onOpenTeamGroupsModel(ids);
    };
    const setPerson = (data: queryResponsiblePersonListType) => {
        const changeIds = selectedRowInfo.value.selectedRowKeys;
        const changeRow = selectedRowInfo.value.selectedRows;
        const res = tableInfo.value.dataSource?.map((e: workingProcedurePlan, index: number) => {
            if (e.surplusNumber !== 0 && selectedRowInfo.value.selectedRowKeys.includes(e.index)) {
                if (isAllOpenPerson.value) {
                    e['userName'] = data.userName;
                    e['userId'] = data.userId;
                } else {
                    if (index === unref(openResponIndex)) {
                        e['userName'] = data.userName;
                        e['userId'] = data.userId;
                    }
                }
            }
            return e;
        });
        setTableList(res || []);
        selectedRowInfo.value.selectedRowKeys = changeIds;
        selectedRowInfo.value.selectedRows = changeRow;
        if (isAllOpenPerson.value) {
            const params = {
                openResponsible: data.userName
            };
            TpfFormRef.value?.setNewState(params);
        }
    };

    const setTeamGroups = (data: any) => {
        const changeIds = selectedRowInfo.value.selectedRowKeys;
        const changeRow = selectedRowInfo.value.selectedRows;
        const res = tableInfo.value.dataSource?.map((e: workingProcedurePlan, index: number) => {
            if (e.surplusNumber !== 0 && selectedRowInfo.value.selectedRowKeys.includes(e.index)) {
                if (isAllOpenTeamGroups.value) {
                    e['workingTeamName'] = data.workingTeamName;
                    e['workingTeamCode'] = data.workingTeamCode;

                    e['userName'] = data.workingTeamLeader;
                    e['userId'] = data.workingTeamLeaderUserId;
                } else {
                    if (index === unref(openTeamGroupsIndex)) {
                        e['workingTeamName'] = data.workingTeamName;
                        e['workingTeamCode'] = data.workingTeamCode;

                        e['userName'] = data.workingTeamLeader;
                        e['userId'] = data.workingTeamLeaderUserId;
                    }
                }
            }

            return e;
        });
        setTableList(res || []);
        selectedRowInfo.value.selectedRowKeys = changeIds;
        selectedRowInfo.value.selectedRows = changeRow;
        if (isAllOpenTeamGroups.value) {
            const params = {
                openTeamGroups: data.workingTeamName
            };
            TpfFormRef.value?.setNewState(params);
        }
    };

    onMounted(async () => {
        workOrderId.value = params.split(',');
        copyWorkOrderId.value = cloneDeep(workOrderId.value);
        const res = await jobOrderAPi.getWorkOrderInfo({
            workOrderId: copyWorkOrderId.value
        });
        const list = res.data.object.list;
        const workOrderCode: string[] = [];
        list.forEach((ele: workingProcedurePlan) => {
            workOrderIdOptions.value.push({ label: ele.workOrderCode, value: ele.workOrderId });
            workOrderCode.push(ele.workOrderCode);
        });
        const operationNameOptionsRes = await operationTaskListAPi.getOperationList({
            workOderCodes: workOrderCode
        });
        operationNameOptions.value = operationNameOptionsRes.data.list;
    });
</script>

<style lang="less" scoped>
    .productionOrderDetail {
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
