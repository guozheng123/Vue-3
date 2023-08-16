import http from '@/utils/http';
import { ResTpfObject } from '@/types/axios';
import { useNetworkApi, proxyEnum } from '@/api';

export interface ResQueryReportProgressListByPage {
    reportProgressId: string;
    workshopCode: string;
    workOrderCode: string;
    workOrderNumberCode: string;
    batchNo: string;
    operationCode: string;
    operationName: string;
    workUnitCode: string;
    workUnitName: string;
    figureNum: string;
    // 生产状态: string;
    materialCode: string;
    materialName: string;
    reportOrderNo: string;
    workOrderStatus: string;
    // 状态: string;
    reportUserName: string;
    postName: string;
    startTime: string;
    endTime: string;
    qualifiedQuantity: number;
    repairQuantity: number;
    scrappedQuantity: number;
    projectGroupCode: string;
    projectGroupName: string;
    projectCode: string;
    projectName: string;
    productionOrderCode: string;
    requirementDate: string;
    processCode: string;
    plannedQuantity: number;
    plannedNumber: number;
    singlePlanHours: number;
    operationPlanHours: number;
    actualWorkingHours: number;
    pauseTime: number;
    deleted: string;
    createUserName: string;
    createUser: number;
    createDatetime: string;
    defectPicture: string;
    beReportProgressId: string;
    operationId: string;
    report_progress_id: string;
    operation_id: string;
    be_report_progress_id: string;
}
type ReqQueryExecute = {
    sortedField: string;
    sortByAsc: boolean;
    mainEntityCode: string;
    page: number;
    pageSize: number;
    requiredFields: string[];
    conditions: { conditionFieldName?: string; values?: string[] }[];
    tableHeaderConfig?: any[];
};

type ResReqQueryExecute = {
    list: any[];
    displayNames: string[];
    names: string[];
    values: string[];
};
export const useQueryAPi = () => {
    const tmgc2Query = useNetworkApi(proxyEnum.tmgc2Query);

    return {
        /**
         * 查询列表
         * @returns
         */
        queryReportProgressListByPage: (params: any) => {
            return http.post<ResTpfObject<{ list: ResQueryReportProgressListByPage[] }>>(
                `${tmgc2Query}/query/queryReportProgressListByPage`,
                params
            );
        },
        /**
         * 导出数据
         * @returns
         */
        exportReportProgressExcelFile: (params: any) => {
            return http.post(`${tmgc2Query}/query/exportReportProgressExcelFile`, params);
        },

        //新接口--------列表查询接口
        execute: (params: Partial<ReqQueryExecute> = {}) => {
            return http.post<ResTpfObject<ResReqQueryExecute>>(
                `${tmgc2Query}/query/execute`,
                params
            );
        },
        //新接口--------列表导出接口
        exportListExcelFile: (params: Partial<ReqQueryExecute> = {}) => {
            return http.post(`${tmgc2Query}/query/exportListExcelFile`, params);
        }
    };
};
