<template>
    <TpfLayout>
        <template #header>
            <LoadingSkeleton>
                <TpfForm @onSubmit="onSubmit" :pageCode="pageCode" />
            </LoadingSkeleton>
        </template>
        <template #content>
            <LoadingSkeleton>
                <TpfTableLayout showChangeTableFontSize showChangeTableGap :pageCode="pageCode">
                    <template #default="args">
                        <TpfTable
                            v-bind="{
                                ...args,
                                ...tableInfo,
                                pagination,
                                seq: true,
                                operateColumn,
                                beforeRender
                            }"
                        />
                    </template>
                    <template #operateLeft>
                        <TableOperateLeft
                            :selectedRowInfo="selectedRowInfo"
                            @getDataList="getDataList"
                            @onOpenModal="onOpenModal"
                        />
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
        <ProcessFlowCard ref="processFlowCardRef" v-if="onloadProcessFlowCard" />
        <ViewWorkOrderModel ref="viewWorkOrderModelRef" v-if="modalShow" />
        <ProcessMaintenance ref="processMaintenance" v-if="processMaintenanceShow" />
        <ProcessBom ref="processBom" v-if="processBomShow" @getDataList="getDataList" />
        <ViewWorkOrderSerialNumber ref="viewWorkOrderSerialNumber" />
        <ViewSerialNumber ref="viewSerialNumber" />
    </TpfLayout>
</template>

<script setup lang="tsx" name="productionOrder">
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, defineAsyncComponent, unref } from 'vue';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import type { OperateBtnClick, TpfColumnType } from '@/types';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { useRouter } from 'vue-router';
    import {
        ResQueryWorkOrderList,
        useFilesystemApi,
        useJobOrderAPi,
        useProdQueryAPi
    } from '@/api';
    import type { ReqQueryWorkOrderList } from '@/api';
    import { getTpfOptionEnum, PageCodeEnum } from '@/config';

    import { Badge } from 'ant-design-vue';
    import { useStore } from '@/store';
    import TableOperateLeft from './components/TableOperateLeft.vue';
    import type { TpfOperateBtn } from '@/types';
    const {
        reportNumberType,
        getLabel,
        orderTypeCodeEnum,
        statusNameColor,
        workOrderStatus,
        operPlanStatus,
        reportInOrder,
        orderSource,
        supervisorModeCode,
        bomStatus,
        startType
    } = getTpfOptionEnum();

    const ViewWorkOrderModel = defineAsyncComponent(
        () => import('./components/viewWorkOrderModel.vue')
    );
    const ViewWorkOrderSerialNumber = defineAsyncComponent(
        () => import('./components/ViewWorkOrderSerialNumber.vue')
    );
    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const ProcessFlowCard = defineAsyncComponent(() => import('./components/ProcessFlowCard.vue'));

    const ProcessBom = defineAsyncComponent(() => import('./components/ProcessBom.vue'));

    const ProcessMaintenance = defineAsyncComponent(
        () => import('./components/ProcessMaintenance.vue')
    );
    const ViewSerialNumber = defineAsyncComponent(
        () => import('./components/ViewSerialNumber.vue')
    );
    const jobOrderAPi = useJobOrderAPi();

    const prodQueryAPi = useProdQueryAPi();

    const filesystemApi = useFilesystemApi();

    const pageCode = PageCodeEnum.productionManagementJobOrderList;

    const router = useRouter();

    const [processBom, onOpenProcessBomModal, processBomShow] = useOpenAntdModal();

    const [viewWorkOrderModelRef, onOpenVWOModal, modalShow] = useOpenAntdModal();

    const [viewSerialNumber, onOpenViewSerialNumber] = useOpenAntdModal();

    const [processMaintenance, onOpenProcessMaintenance, processMaintenanceShow] =
        useOpenAntdModal();

    const [processFlowCardRef, onOpenProcessFlowCardModal, onloadProcessFlowCard] =
        useOpenAntdModal();

    const [viewWorkOrderSerialNumber, onOpenViewWorkOrderSerialNumber] = useOpenAntdModal();

    const { cacheSearchStore } = useStore();
    const searchInfo = ref({} as ReqQueryWorkOrderList);
    const sorterList = [
        'workOrderCode',
        'productionOrderCode',
        'plannedNumber',
        'completionsNumber',
        'scrapNumber',
        'repairNumber',
        'managementMode'
    ];
    const matchValue = {
        startType,
        reportInOrder,
        operPlanStatus,
        reportNumberType,
        orderSource,
        orderTypeCode: orderTypeCodeEnum,
        equipmentDebug: reportInOrder,
        supervisorModeCode,
        overProduction: reportInOrder,
        bomStatus
    };
    const beforeRender = (list: TpfColumnType<ResQueryWorkOrderList>[]) => {
        return unref(list).map(item => {
            if (sorterList.includes(item.dataIndex as string)) {
                item.sorter = true;
            }
            if (item.dataIndex === 'workOrderCode') {
                item.customRender = ({ text, record }) => (
                    <span class="tpf-link" onClick={() => getMerchantManagementInfo(record)}>
                        {text}
                    </span>
                );
            }
            const key = item.dataIndex || '';
            if (matchValue[key as string]) {
                item.customRender = ({ text }) => getLabel(text, matchValue[key as string]);
            }
            if (item.dataIndex === 'workOrderStatus') {
                item.customRender = ({ text }) => {
                    const showText = getLabel(text, workOrderStatus);
                    return <Badge color={getLabel(showText, statusNameColor)} text={showText} />;
                };
            }
            if (item.dataIndex === 'processVersion') {
                item.customRender = ({ text }) => <span>{text ? 'v' + text : ''}</span>;
            }
            if (item.dataIndex === 'serialNumber') {
                item.customRender = ({ text, record }) => {
                    return <a onClick={() => openOrderNumber(record)}>{text}</a>;
                };
            }
            return item;
        });
    };

    const defaultBtn = [
        { title: '工艺', onClick: row => technology(row) }
    ] as TpfOperateBtn<ResQueryWorkOrderList>[];

    // const getDefaultBtn = (item: [{ value: any }]) => {
    //     const [{ value }] = item;
    //     const { reportNumberType } = unref(value);
    //     // reportNumberType 管理方式 1 不展示 workOrder
    //     const btnList = [
    //         { title: '设置计划工时', key: 'workHour', onClick: row => processContentEdit(row) },
    //         { title: '工序BOM维护', key: 'bom', onClick: row => processBOMEdit(row) }
    //     ] as TpfOperateBtn<ResQueryWorkOrderList>[];
    //     if (reportNumberType === '1') return btnList.filter(v => v.key !== 'workOrder');
    //     return btnList;
    // };
    const moreBtn = [
        { title: '设置计划工时', onClick: row => processContentEdit(row) },
        { title: '工序BOM维护', onClick: row => processBOMEdit(row) }
    ] as TpfOperateBtn<ResQueryWorkOrderList>[];

    const operateColumn = ref<TpfColumnType<ResQueryWorkOrderList>>({
        title: '操作',
        align: 'center',
        width: 120,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn, moreBtn)
    });
    const { tableInfo, pagination, getDataList, selectedRowInfo, sortFieldInfo } = useAntdTable({
        api: async pagination => {
            const { pageSize = 20, current = 1, sortByAsc, sortedField } = unref(pagination);
            const res = await prodQueryAPi.queryWorkOrderList({
                ...unref(searchInfo),
                sortByAsc,
                sortedField,
                pageSize,
                page: current
            });
            return res.data.object;
        },
        rowKey: 'workOrderId',
        isPageAble: true,
        hasRowSelection: true,
        useSorter: true
    });
    const openOrderNumber = async (record: any) => {
        const arr = [];
        arr.push(record.workOrderCode);
        onOpenViewSerialNumber(arr);
    };
    //查看详情
    const getMerchantManagementInfo = ({
        workOrderId,
        workOrderCode
    }: {
        workOrderId: number | string;
        workOrderCode: string;
    }) => {
        router.push({
            path: '/productionManagement/jobOrderList/jobOrderListDetail',
            query: { workOrderId, workOrderCode }
        });
    };

    //工艺
    const technology = (row: { value: { processId: number; workOrderId: number } }) => {
        const { processId = 1, workOrderId } = row.value;
        router.push({
            path: '/productionManagement/jobOrderList/processEdit',
            query: { workOrderId, processId }
        });
    };
    //工序内容维护
    const processContentEdit = (v: OperateBtnClick<ResQueryWorkOrderList>) => {
        onOpenProcessMaintenance(v);
    };
    //工序BOM维护
    const processBOMEdit = (v: OperateBtnClick<ResQueryWorkOrderList>) => {
        onOpenProcessBomModal(v.record);
    };
    //查看工单序列号
    const viewWorkOrderNum = (v: OperateBtnClick<ResQueryWorkOrderList>) => {
        onOpenVWOModal(v);
    };
    // 查询
    const onSubmit = (val: ReqQueryWorkOrderList) => {
        searchInfo.value = unref(val);
        unref(pagination).current = 1;
        getDataList();
    };
    // 导出
    const startExport = async () => {
        filesystemApi.exportFileList(() =>
            jobOrderAPi.workOrderListExport({
                ...unref(searchInfo),
                ...unref(sortFieldInfo),
                tableHeaderConfig: cacheSearchStore.getUploadLoadSortColumns(pageCode),
                workOrderId: unref(selectedRowInfo).selectedRowKeys as number[]
            })
        );
    };
    const openModalObject = {
        onOpenViewWorkOrderSerialNumber,
        onOpenProcessFlowCardModal,
        startExport
    };
    const onOpenModal = ({ name, value }: { name: string; value: any }) => {
        console.log(name, value);
        if (typeof openModalObject[name] === 'function') {
            openModalObject[name](value);
        }
    };
</script>
