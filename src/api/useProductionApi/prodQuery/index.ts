import http from '@/utils/http';
import { ResTpfObject } from '@/types/axios';
import { useNetworkApi, proxyEnum } from '@/api';
export type ReqQueryWorkOrderList = {
    total: number;
    page: number;
    pageSize: number;
    totalPage: number;
    workOrderCode: string;
    materialCode: string;
    materialName: string;
    productionOrderCode: string;
    projectCode: string;
    projectName: string;
    workshopName: string;
    workOrderStatus: string;
    reportNumberType: string;
    reportInOrder: string;
    orderSource: string;
    orderTypeCode: string;
    startType: string;
    actualStartDatetime: string;
    actualEndDatetime: string;
    startTime: string;
    requirementDate: string;
    createDatetime: string;
    totalPageValue: number;
    sortByAsc: boolean;
    sortedField: string;
};
export type ResQueryWorkOrderList = {
    tenantId: number;
    deleted: number;
    workOrderId: number;
    workOrderCode: string;
    materialCode: string;
    productionOrderCode: string;
    projectCode: string;
    projectGroupCode: string;
    materialName: string;
    materialUnitCode: string;
    materialSpec: string;
    projectName: string;
    projectGroupName: string;
    reportInOrder: string;
    orderSource: string;
    orderTypeCode: string;
    figureNum: string;
    customerSupplierCode: string;
    customerOrder: string;
    startType: string;
    operPlanStatus: string;
    workOrderStatus: string;
    operationCode: string;
    operationName: string;
    operationVersion: string;
    workshopCode: string;
    workshopName: string;
    plannedNumber: number;
    completionsNumber: number;
    scrapNumber: number;
    repairNumber: number;
    reportNumberType: string;
    bomStatus: string;
    equipmentDebug: string;
    overProduction: string;
    overProductionRatio: number;
    startTime: string;
    requirementDate: string;
    plannedStartDate: string;
    plannedEndDate: string;
    actualStartDatetime: string;
    actualEndDatetime: string;
    drawingBomModifyDatetime: string;
    createUserId: number;
    createDatetime: string;
    modifyDatetime: string;
    batchSerialNo: string;
    productionBatchNum: string;
    lotNum: string;
    billNo: string;
    oneLevelMaterialCode: string;
    oneLevelMaterialText: string;
    twoLevelMaterialCode: string;
    twoLevelMaterialText: string;
    twoMaterialCode: string;
    twoMaterialText: string;
    processCode: string;
    processVersion: string;
};

export const useProdQueryAPi = () => {
    const tmgc2Production = useNetworkApi(proxyEnum.tmgc2Production);

    return {
        /**
         * @returns 获取作业工单列表
         */
        queryWorkOrderList: (params?: Partial<ReqQueryWorkOrderList>) => {
            return http.post<ResTpfObject<{ list: ResQueryWorkOrderList[] }>>(
                `${tmgc2Production}/query/queryWorkOrderList`,
                params
            );
        }
    };
};
