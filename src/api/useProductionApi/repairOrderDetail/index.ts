import type { ResTpfObject } from '@/types/axios';
import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';
export type IReqGetList = {
    total: number;
    page: number;
    pageSize: number;
    totalPage: number;
    orderRule: string;
    repairOrderDetailId: number;
    tenantId: number;
    deleted: string;
    repairOrderCode: string;
    sourceOperationId: number;
    sourceOperationCode: string;
    repairType: string;
    newProductionOrderCode: string;
    operationId: number;
    operationCode: string;
    repairPlanQuantity: number;
    beRepairQuantity: number;
    repairStatus: string;
    repairUser: number;
    repairDatetime: string;
    createUser: number;
    createDatetime: string;
    createDatetimeStart: string;
    createDatetimeEnd: string;
    modifyDatetimeStart: string;
    modifyDatetimeEnd: string;
    totalPageValue: number;
};

export interface queryRepairOrderListByPage {
    page: number;
    pageSize: number;
    sortedField: string;
    sortByAsc: boolean;
    tenantId: number;
    workOrderCode: string;
    originalProductionOrderCode: string;
    operationTaskOrderCode: string;
    projectCode: string;
    projectName: string;
    materialCode: string;
    materialName: string;
    materialCodes: string[];
    figureNum: string;
    workUnitName: string;
    workUnitCodes: string[];
    operationName: string;
    operationCodes: string[];
    repairStatus: string;
    scrappedStatus: string;
    repairDatetimeStart: string;
    repairDatetimeEnd: string;
    scrappedDatetimeStart: string;
    scrappedDatetimeEnd: string;
    createDateStart: string;
    createDateEnd: string;
}

export interface repairOrderListByPageRes {
    repairOrderId: number; //返修单ID
    repairOrderCode: string; //返修单编号
    workOrderCode: string; //	作业业工单编号 （ 排序 ）
    originalProductionOrderCode: string; //生产订单编号
    operationTaskOrderCode: string; //工序任务单编号
    projectCode: string;
    projectName: string;
    materialCode: string;
    materialName: string;
    figureNum: string;
    workUnitName: string;
    operationId: number;
    workUnitCode: string;
    operationName: string;
    qualifiedQuantity: number;
    repairQuantity: number; //返修数
    operationRepairPlanQuantity: number; //工序返修计划数
    scrappedQuantity: number; //报废数
    productionOrderRepairQuantity: number; //订单返修数
    beRepairQuantity: number; //已返修数
    beScrappedQuantity: number; //已报废数
    repairStatus: string; //返修状态
    scrappedStatus: string; //报废状态
    repairDatetime: string; //返修时间
    scrappedDatetime: string; //报废时间
    createDate: string;
    newProductionOrderCode: string; //新生产订单编号
}

//项目集
export const useRepairOrderDetailApi = () => {
    const tmgc2Production = useNetworkApi(proxyEnum.tmgc2Production);

    return {
        /**
         * @returns 返修明细==获取列表
         */
        queryRepairOrderDetailListByPage: (params?: Partial<IReqGetList>) => {
            return http.post<ResTpfObject<{ list: IReqGetList[] }>>(
                `${tmgc2Production}/repairOrderDetail/queryRepairOrderDetailListByPage`,
                params
            );
        },

        /**
         * @returns 返修单==获取列表
         */
        queryRepairOrderListByPage: (params?: Partial<queryRepairOrderListByPage>) => {
            return http.post<ResTpfObject<{ list: repairOrderListByPageRes[] }>>(
                `${tmgc2Production}/repairOrder/queryRepairOrderListByPage`,
                params
            );
        },

        /**
         * @returns 生成返修单
         */
        generateRepairTypeProductionOrder: (params: { repairOrderId: number }) => {
            return http.post(
                `${tmgc2Production}/repairOrder/generateRepairTypeProductionOrder`,
                {},
                { params }
            );
        },
        /**
         * @returns 返修
         */
        generateRepairOrderDetail: (params: {
            id: string;
            operationId: string;
            operationRepairQuantity: number;
        }) => {
            return http.post(`${tmgc2Production}/repairOrder/generateRepairOrderDetail`, params);
        },
        /**
         * @returns 获取工序列表
         */
        getRepairOrderOperationList: (params: { repairOrderId: string }) => {
            return http.get(`${tmgc2Production}/repairOrder/getRepairOrderOperationList`, {
                params
            });
        }
    };
};
