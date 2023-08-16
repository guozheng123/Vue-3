import type { ResTpfObject } from '@/types/axios';
import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';

export interface queryOperationTaskOrderList {
    operationTaskOrderId: number; //工序任务单主键id
    operationTaskOrderCode: string; //工序任务单主键Code
    operation_task_order_code: string; //工序任务单主键Code
    workOrderCode: string; //作业工单号
    materialCode: string; //物料编号
    productionOrderCode: string; //生产订单号
    projectCode: string; //项目编号
    projectGroupCode: string; //项目集编号
    materialName: string; //物料名称
    materialUnitCode: string; //物料单位
    materialSpec: string;
    projectName: string;
    projectGroupName: string;
    reportInOrder: string;
    orderSource: string;
    orderTypeCode: string;
    figureNum: string;
    productType: string;
    customerSupplierCode: string;
    customerSupplierName: string;
    customerOrder: string;
    startType: string;
    operPlanStatus: string;
    workOrderStatus: string;
    processCode: string;
    processName: string;
    operationName: string;
    operationCode: string;
    processVersion: number;
    workshopCode: string;
    workshopName: string;
    plannedNumber: number;
    completionsNumber: number;
    scrapNumber: number;
    repairNumber: number;
    reportNumberType: string;
    bomStatus: string;
    equipmentDebug: string;
    overProduction: string; //是否超产(0否 1是)
    overProductionRatio: number;
    startTime: string;
    requirementDate: string;
    plannedStartDate: string;
    plannedEndDate: string;
    actualStartDatetime: string;
    actualEndDatetime: string;
    drawingBomModifyDatetime: string;
    confirmLogic: string;
    createUserId: number;
    createUserName: string;
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
    supervisorModeCode: string;
    materialBomVos: MaterialBomVo[];
}

interface MaterialBomVo {
    materialCode: string;
    materialName: string;
    materialUnitName: string;
    num: number;
    remark: string;
    materialUnitCode: string;
    materialSpec: string;
    supervisorModeCode: string;
    materialTypeCode: string;
}

export const useOperationTaskListAPi = () => {
    const tmgc2Production = useNetworkApi(proxyEnum.tmgc2Production);

    return {
        /**
         * 更新打印序列号状态
         * @returns
         */
        updatePrintSerialNumberStatus: (params: { ids: any[] }) => {
            return http.post(
                `${tmgc2Production}/operationTaskOrder/updatePrintSerialNumberStatus`,
                params
            );
        },
        /**
         *查询序列号打印信息*
         * @returns
         */
        printSerialNumber: (params: { ids: number[] }) => {
            return http.post(`${tmgc2Production}/operationTaskOrder/printSerialNumber`, params);
        },
        /**
         * 撤回工序计划
         * @returns
         */
        rollbackOperationTaskOrder: (params: { operationTaskOrderId: any[] }) => {
            return http.post<ResTpfObject<{ success: boolean; message: string }>>(
                `${tmgc2Production}/operationTaskOrder/rollbackOperationTaskOrder`,
                params
            );
        },

        /**
         * 下达工序任务单
         * @returns
         */
        releaseOperationTaskOrder: (params: any) => {
            return http.post(`${tmgc2Production}/operationTaskOrder/releaseOperationTaskOrder`, {
                params
            });
        },
        /**
         * 根据工单任务单code 获取工单序列号
         * @returns
         */
        queryWorkOrderSerialNumberList: (params: any) => {
            return http.post(
                `${tmgc2Production}/operationTaskOrder/queryWorkOrderSerialNumberList`,
                params
            );
        },

        /**
         * 获取工序任务单列表
         * @returns
         */
        queryOperationTaskOrderList: (params: any) => {
            return http.post(
                `${tmgc2Production}/operationTaskOrder/queryOperationTaskOrderList`,
                params
            );
        },

        /**
         *查询工序任务单打印信息*
         * @returns
         */
        printOperationTaskOrder: (params: { operationTaskOrderId: any[] }) => {
            return http.post(
                `${tmgc2Production}/operationTaskOrder/printOperationTaskOrder`,
                params
            );
        },
        /**
         *导出工序任务单
         * @returns
         */
        operationTaskOrderListExport: (params: any) => {
            return http.post(
                `${tmgc2Production}/operationTaskOrder/operationTaskOrderListExport`,
                params
            );
        },
        /**
         *批量强制完工
         * @returns
         */
        batchForcedFinish: (params: { operationTaskOrderId: any[] }) => {
            return http.post<ResTpfObject<{ success: boolean; message: string }>>(
                `${tmgc2Production}/operationTaskOrder/batchForcedFinish`,
                params
            );
        },
        /**
         *批量强制关闭
         * @returns
         */
        batchForcedClose: (params: { operationTaskOrderId: any[] }) => {
            return http.post<ResTpfObject<{ success: boolean; message: string }>>(
                `${tmgc2Production}/operationTaskOrder/batchForcedClose`,
                params
            );
        },
        /**
         *工序任务单详情
         * @returns
         */
        getOperationTaskOrderDetailById: (params: { operationTaskOrderId: string }) => {
            return http.get<ResTpfObject<any>>(
                `${tmgc2Production}/operationTaskOrder/getOperationTaskOrderDetailById`,
                { params }
            );
        },

        /**
         *工序计划 根据作业工单号查工序
         * @returns
         */
        getOperationList: (params: { workOderCodes: string[] }) => {
            return http.post<any>(`${tmgc2Production}/process/getOperationList`, params);
        },

        /**
         *工序任务单 加工进度
         * @returns
         */
        operationOrderProcessingSchedule: (params: { operationTaskOrderId: string }) => {
            return http.get<any>(
                `${tmgc2Production}/operationTaskOrder/operationOrderProcessingSchedule`,
                { params }
            );
        }
    };
};
