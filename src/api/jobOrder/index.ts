import { ResTpfObject, ResTpfList, ResTpfValue } from '@/types/axios';
import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';
const tmgc2Production = useNetworkApi(proxyEnum.tmgc2Production);
type ReqQueryWorkOrderListExport = {
    workOrderCode: string;
    materialCode: string;
    materialName: string;
    productionOrderCode: string;
    projectName: string;
    workshopName: string;
    workOrderStatus: string;
    tenantId: number;
    workOrderId: number[];
    sortField: string;
    sortType: string;
    tableHeaderConfig: any[];
    sortByAsc: boolean;
    sortedField: string;
};

interface ReqGetMaterialBaseList {
    total: number;
    page: number;
    pageSize: number;
    totalPage: number;
    materialList: Partial<ResGetMaterialBaseList>[]; //过滤的
    materialCode: string;
    materialName: string;
    materialTypeCode: string;
    totalPageValue: number;
}

interface ResGetMaterialBaseList {
    materialCode: string; //物料编号
    materialName: string; //物料名称
    num: number; //数量
    remark: string; //备注
    materialUnitCode: string; //物料单位
    materialSpec: string; //物料规格
    supervisorModeCode: string; //管理方式 0按单管理 1序列管理 2批次管理
    materialTypeCode: string; //物料类型编号
}

// interface ResReleaseOperationTaskOrder {
//     workOrderId: string;
//     workOrderCode: string;
//     materialCode: string;
//     productionOrderCode: string;
//     materialName: string; //物料名称
//     projectCode: string; //项目编号
//     projectName: string; //项目名称
//     workshopName: string; //车间名称
//     plannedNumber: string; // 工序任务单计划数
//     createDatetime: string; //创建时间
//     sortField: string; //排序字段
//     sortType: string;
//     plannedStartDate: string; // 排序字段
//     plannedEndDate: string; // 	s计划结束日期
//     operationTaskOrderCode: string;
//     operationTaskOrderStatus: string;
// }

export interface workingProcedurePlan {
    workOrderCode: string; //作业工单号
    productionOrderCode: string; //生产订单号
    materialCode: string; //物料编号
    projectCode: string; //项目编号
    projectGroupCode: string; //项目集编号
    materialName: string; //物料名称
    materialUnitCode: string; // 物料单位
    materialSpec: string; //物料规格
    projectName: string; //项目名称
    projectGroupName: string; //项目集名称
    reportInOrder: string;
    orderSource: string; //订单来源
    orderTypeCode: string; //订单类型
    figureNum: string;
    customerSupplierCode: string;
    customerOrder: string;
    startType: string;
    operPlanStatus: string;
    workOrderStatus: string;
    processCode: string;
    processName: string;
    operationVersion: string;
    workshopCode: string; //车间编号
    workshopName: string; //车间名称
    plannedNumber: number; //计划数
    completionsNumber: number; //完工数
    scrapNumber: number;
    repairNumber: number;
    reportNumberType: string;
    bomStatus: string;
    operationCode: string;
    operationName: string;
    equipmentDebug: string;
    overProduction: string;
    overProductionRatio: number;
    startTime: string;
    requirementDate: string;
    plannedStartDate: any; //计划开始日期
    plannedEndDate: any; //计划结束日期
    actualStartDatetime: string;
    actualEndDatetime: string;
    drawingBomModifyDatetime: string;
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
    operationPlannedNumber: number; //计划数
    surplusNumber: number; //剩余数
    index: string;
    workUnitName: string;
    workUnitCode: string;
    workUnitList: any[];
    workOrderId: string;
    workingTeamCode: string;
    workingTeamName: string;
    userAccount: string;
    userId: string;
    userName: string;
}
interface ResWorkOrderProcessingSchedule {
    workOrderId: number; // 作业工单主键id
    processCode: string; // 工艺编号
    processName: string; // 工艺名称
    plannedNumber: number; //计划数
    qualifiedQuantity: number; //完工数
    scrapQuantity: number; // 报废数
    repairQuantity: number; //返修数
    plannedStartDate: string; // 计划开始日期
    plannedEndDate: string; // 计划结束日期
    operationCode: string; //工序编号
    operationName: string; // 工序名称
    operationType: string; //工序类型
    actualWorkingHours: number; //实际工时 小时
    plannedWorkingHours: number; // 计划工时 小时
    differenceHours: number; //工时差异 小时
}

interface queryWorkingTeamList {
    workOrderCode: string[];
    workingTeamCode: string;
    workingTeamName: string;
}
interface queryResponsiblePersonList {
    workOrderCode: string[];
    userName: string;
    userAccount: string;
}

export interface queryResponsiblePersonListType {
    userAccount: string;
    userId: string;
    userName: string;
}

export interface queryWorkingTeamListType {
    workingTeamAbbreviation: string;
    workingTeamCode: string;
    workingTeamId: string;
    workingTeamLeader: string;
    workingTeamName: string;
}
interface ReqUpdateMaterialByIds {
    bomVersion: string | number;
    bomId: string | number;
    list: any[];
    operationCode: string;
    operationId: string | number;
}

interface ReqUpdateProcessInfo {
    workOrderCode: string;
    processCode: string;
    processVersion: number | string;
    editVos: any[];
}

interface ReqGetOperationBomTree {
    processCode: string;
    businessCode: string;
    processVersion: number;
}
interface ResGetWorkOrderDetails {
    tenantId: number;
    deleted: number;
    workOrderId: number; // 作业工单主键id
    workOrderCode: string; // 作业工单号
    materialCode: string; // 物料编号
    productionOrderCode: string; // 生产订单号
    projectCode: string; // 项目编号
    projectGroupCode: string; // 项目集编号
    materialName: string; // 物料名称
    materialUnitCode: string; // 物料单位
    materialSpec: string; // 物料规格
    projectName: string; // 项目名称
    projectGroupName: string; // 项目集名称
    reportInOrder: string; // 是否顺序报工
    orderSource: string; // 订单来源
    orderTypeCode: string; // 订单类型
    figureNum: string; // 图号
    customerSupplierCode: string; // 客户/供应商编号
    customerSupplierName: string; // 单位名称
    customerOrder: string; // 客户单号
    startType: string; // 投产类型
    operPlanStatus: string; // 工序计划状态
    workOrderStatus: string; // 工单状态
    productType: string; // 产品类型
    processCode: string; // 工艺编号
    processName: string; // 工艺名称
    operationVersion: number; // 版本
    workshopId: number; // 车间Id
    workshopCode: string; // 车间编号
    workshopName: string; // 车间名称
    plannedNumber: number; // 计划数
    completionsNumber: number; // 完工数
    scrapNumber: number; // 报废数
    repairNumber: number; // 返修数
    reportNumberType: string; // 管理方式
    bomStatus: string; // 工序bom维护状态
    equipmentDebug: string; // 是否装备调试
    overProduction: string; // 是否超产
    overProductionRatio: number; // 超产比例
    startTime: string; // 投产日期
    requirementDate: string; // 订单交期
    plannedStartDate: string; // 计划开始日期
    plannedEndDate: string; // 计划结束日期
    actualStartDatetime: string; // 实际开始日期
    actualEndDatetime: string; // 实际结束日期
    drawingBomModifyDatetime: string; // 图纸云清单变更时间
    createUserId: number; // 图纸云清单变更时间
    createUserName: string; // 创建人
    createDatetime: string; // 创建时间
    modifyDatetime: string; // 修改时间
    batchSerialNo: string; // 批次序号
    productionBatchNum: string; // 订单批次
    lotNum: string; // 批号
    billNo: string; // 清单编号
    oneLevelMaterialCode: string; // 父级物料编号
    oneLevelMaterialText: string; // 父级物料名称
    twoLevelMaterialCode: string; // 二层父级物料编号
    twoLevelMaterialText: string; // 二层父级物料名称
    twoMaterialCode: string; // 二层物料编号
    twoMaterialText: string; // 二层物料名称
    confirmLogic: string; // 报工计算逻辑
    supervisorModeCode: string; // 管理方式
    processVersion: string;
    operationInfos: any[];
}

export interface materialRequisition {
    workOrderId: number; //作业工单主键id
    workOrderCode: string; //作业工单号
    projectCode: string; //项目编号
    projectName: string; //项目名称
    materialCode: string; //物料编号
    materialName: string; //物料名称
    materialSpec: string; //物料规格
    operationCode: string; //工序编号
    operationName: string; //工序名称
    plannedNumber: number; //计划数
    requisitionNumber: number; //领料数
    managementMode: number; //管理方式
    createUserName: string;
    createDatetime: string;
    modifyUserName: string;
    modifyDatetime: string;
    tenantId: number;
    remark: string; //remark
    index?: string;
    requisitionFinishNumber: number;
    remainingRequisitionNumber: number; //剩余领料数
}

//物料数据
export const useJobOrderAPi = () => {
    return {
        /**
         * @return 回退订单
         */
        rollbackOrder: (params: { workOrderId: number[] }) => {
            return http.post<ResTpfObject<{ success: boolean; message: string }>>(
                `${tmgc2Production}/productionOrder/rollbackOrder`,
                params
            );
        },
        /**
         * @returns 查看工单序列号
         */
        queryWorkOrderSerialNumberList: (params: {
            workOrderCode: string[];
            [key: string]: any;
        }) => {
            return http.post<ResTpfObject<{ list: any[] }>>(
                `${tmgc2Production}/workOrder/queryWorkOrderSerialNumberList`,
                params
            );
        },
        /**
         * @returns 投产
         */
        putIntoProduction: (params: { workOrderId: number[] }) => {
            return http.post<ResTpfObject<{ success: boolean; message: string }>>(
                `${tmgc2Production}/workOrder/putIntoProduction`,
                params
            );
        },
        /**
         * @returns 打印工单序列号
         */
        printWorkOrderSerialNumber: (params: { workOrderId: number[] }) => {
            return http.post<ResTpfObject<{ list: any[] }>>(
                `${tmgc2Production}/workOrder/printWorkOrderSerialNumber`,
                params
            );
        },
        /**
         * @returns 打印工艺流转卡
         */
        printProcessFlowCard: (params: { workOrderId: number[] }) => {
            return http.post<ResTpfObject<{ list: any[]; status?: boolean; message?: string }>>(
                `${tmgc2Production}/workOrder/printProcessFlowCard`,
                params
            );
        },
        /**
         * @returns 批量强制完工
         */
        batchForcedFinish: (params: { workOrderId: number[] }) => {
            return http.post<ResTpfObject<{ success: boolean; message: string }>>(
                `${tmgc2Production}/productionOrder/batchForcedFinish`,
                params
            );
        },
        /**
         * @returns 批量强制关闭
         */
        batchForcedClose: (params: { workOrderId: number[] }) => {
            return http.post<ResTpfObject<{ success: boolean; message: string }>>(
                `${tmgc2Production}/productionOrder/batchForcedClose`,
                params
            );
        },
        /**
         * @returns 导出作业工单
         */
        workOrderListExport: (params?: Partial<ReqQueryWorkOrderListExport>) => {
            return http.post(`${tmgc2Production}/workOrder/workOrderListExport`, params);
        },
        /**
         * @returns 编辑工艺
         */
        getProcessEdit: (params: { workOrderId: string; processId: string }) => {
            return http.get<any>(`${tmgc2Production}/process/getProcessById`, {
                params
            });
        },
        /**
         * @returns 作业工单详情
         */
        getWorkOrderDetails: (params: { workOrderId: string; workOrderCode: string }) => {
            return http.post<ResTpfObject<ResGetWorkOrderDetails>>(
                `${tmgc2Production}/workOrder/getWorkOrderDetails`,
                params
            );
        },
        /**
         * @returns 作业工单详情加工进度
         */
        getWorkOrderProcessingSchedule: (params: {
            workOrderId: number;
            workOrderCode: string;
        }) => {
            return http.post<ResTpfObject<ResTpfList<ResWorkOrderProcessingSchedule>>>(
                `${tmgc2Production}/workOrder/workOrderProcessingSchedule`,
                params
            );
        },
        /**
         * @returns 物料列表
         */
        getMaterialList: (params: {
            bomVersion: string;
            bomId: string | number;
            operationCode?: string;
            workOrderCode?: string;
        }) => {
            return http.post<any>(`${tmgc2Production}/material/getMaterialList`, params);
        },
        /**
         * @returns 工艺tree列表
         */
        getOperationBomTree: (params: ReqGetOperationBomTree) => {
            return http.post<
                ResTpfObject<{
                    processName: string;
                    processVersion: number;
                    items: any[];
                    bomAccId: string;
                }>
            >(`${tmgc2Production}/process/getOperationBomTree`, params);
        },
        /**
         * @returns 设置计划工时保存
         */
        updateProcessInfo: (params: ReqUpdateProcessInfo) => {
            return http.post<{ errorMessage: string; value: boolean }>(
                `${tmgc2Production}/process/updateProcessInfo`,
                params
            );
        },
        // /**
        //  * @returns 工序Bom维护保存
        //  */
        // insertMaterialBom: (params: ReqUpdateMaterialByIds) => {
        //     return http.post<{ errorMessage: string; value: boolean }>(
        //         `${tmgc2Production}/material/insertMaterialBom`,
        //         params
        //     );
        // },
        /**
         * @returns 工序Bom维护保存 - 新
         */
        saveWorkOrderOperationBomInfo: (params: ReqUpdateMaterialByIds) => {
            return http.post(`${tmgc2Production}/material/saveWorkOrderOperationBomInfo`, params);
        },
        /**
         * @returns 保存
         */
        // updateMaterialByIds: (params: ReqUpdateMaterialByIds) => {
        //     return http.post<{ errorMessage: string; value: boolean }>(
        //         `${tmgc2Production}/material/updateMaterialByIds`,
        //         params
        //     );
        // },
        /**
         * @returns 查询物料库获取物料列表
         */
        getMaterialBaseList: (params?: Partial<ReqGetMaterialBaseList>) => {
            return http.post<ResTpfObject<{ list: ResGetMaterialBaseList[] }>>(
                `${tmgc2Production}/material/getMaterialBaseList`,
                params
            );
        },
        /**
         * 是否可以删除工序
         */
        getCheckProcessAllowDelete: (params: { workOrderCode: string; operationCode: string }) => {
            return http.post<ResTpfValue>(
                `${tmgc2Production}/process/checkProcessAllowDelete`,
                params
            );
        },
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * 工序计划
         */
        /**
         * @returns 根据作业工单code获取工序任务单详情
         */
        getOperationTaskOrderListByWorkOrderCode: (params?: {
            workOrderCode: string;
            operationCode: string;
        }) => {
            return http.get<ResTpfObject<{ list: workingProcedurePlan[] }>>(
                `${tmgc2Production}/operationTaskOrder/getOperationTaskOrderListByWorkOrderCode`,
                { params }
            );
        },

        /**
         * @returns 工序计划
         */
        workingProcedurePlan: (params?: {
            workOrderId: any[];
            isHide?: string;
            operationName?: string;
        }) => {
            return http.post<
                ResTpfObject<{ list: workingProcedurePlan[]; success: boolean; message: string }>
            >(`${tmgc2Production}/workOrder/workingProcedurePlan`, params);
        },

        /**
         * @returns  下达工序任务单
         */
        releaseOperationTaskOrder: (params?: { list: any }) => {
            return http.post<ResTpfObject<{ success: boolean }>>(
                `${tmgc2Production}/operationTaskOrder/releaseOperationTaskOrder`,
                params
            );
        },

        /**
         * @returns  获取班组列表
         */
        queryWorkingTeamList: (params?: queryWorkingTeamList) => {
            return http.post<ResTpfObject<{ list: queryWorkingTeamListType[] }>>(
                `${tmgc2Production}/operationTaskOrder/queryWorkingTeamList`,
                params
            );
        },

        /**
         * @returns  获取责任人列表
         */
        queryResponsiblePersonList: (params?: queryResponsiblePersonList) => {
            return http.post<ResTpfObject<{ list: queryResponsiblePersonListType[] }>>(
                `${tmgc2Production}/operationTaskOrder/queryResponsiblePersonList`,
                params
            );
        },
        /**
         * @returns  获取工单信息
         */
        getWorkOrderInfo: (params?: { workOrderId: string[] }) => {
            return http.post<ResTpfObject<{ list: workingProcedurePlan[] }>>(
                `${tmgc2Production}/workOrder/getWorkOrderInfo`,
                params
            );
        },

        /**
         * @returns  领料申请单列表
         */
        materialRequisition: (params?: {
            workOrderId: string[];
            operationCode?: string;
            operationName?: string;
        }) => {
            return http.post<
                ResTpfObject<{ list: materialRequisition[]; errorList: any[]; success: boolean }>
            >(`${tmgc2Production}/workOrder/materialRequisition`, params);
        },
        /**
         * @returns  创建工单分解的领料申请单
         */
        createMaterialRequisitionByWorkOrder: (params: materialRequisition[]) => {
            return http.post<ResTpfValue<boolean>>(
                `${tmgc2Production}/workOrder/createMaterialRequisitionByWorkOrder`,
                params
            );
        }
    };
};
