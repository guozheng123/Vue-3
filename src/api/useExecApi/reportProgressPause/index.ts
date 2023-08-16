import type { ResTpfObject } from '@/types/axios';
import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';
import type { ExportTableHeaderConfig } from '@/types';

export interface ReqPageQuery {
    sortByAsc: boolean;
    sortedField: string;
    total: number;
    page: number;
    pageSize: number;
    totalPage: number;
    tenantId: number;
    workOrderNumber: string; //作业工单编号
    reportProgressCode: string; //报工号
    workUnitCode: string; //作业单元编号
    workUnitName: string; //作业单元描述
    projectCode: string; //项目编号
    materialName: string; //物料名称
    materialCode: string; //物料编号
    pauseStartTime: string; //暂停开始时间
    pauseEndTime: string; //暂停结束时间
    stopReason: string; //停产原因
    exceptionType: string; //异常类型
    solution: string; //解决方案
    solver: number; //解决人
    resolveStartTime: string; //解决开始时间
    resolveEndTime: string; //解决结束时间
    operator: number; //操作员
    createUser: number; //创建人
    totalPageValue: number;
}

export interface ResPageQuery {
    workOrderNumber: string;
    reportProgressCode: string;
    workUnitCode: string;
    workUnitName: string;
    operationName: string;
    projectCode: string;
    materialCode: string;
    materialName: string;
    pauseStartTime: string;
    pauseEndTime: string;
    pauseTime: string;
    stopReason: string;
    isReport: string;
    exceptionType: string;
    solution: string;
    solver: string;
    resolveStartTime: string;
    resolveEndTime: string;
    resolutionTime: string;
    operator: string;
    createUser: string;
}

interface ReqExportReportProgressPauseFile {
    sortByAsc: boolean;
    sortedField: string;
    tenantId: number;
    workOrderNumber: string; //作业工单编号
    reportProgressCode: string; //报工号
    workUnitCode: string; //作业单元编号
    workUnitName: string; //作业单元描述
    projectCode: string; //项目编号
    materialName: string; //物料名称
    materialCode: string; //物料编号
    pauseStartTime: string; //暂停开始时间
    pauseEndTime: string; //暂停结束时间
    stopReason: string; //停产原因
    exceptionType: string; //异常类型
    solution: string; //解决方案
    solver: number; //解决人
    resolveStartTime: string; //解决开始时间
    resolveEndTime: string; //解决结束时间
    operator: number; //操作员
    createUser: number; //创建人
    tableHeaderConfig: ExportTableHeaderConfig;
    reportProgressPauseId: number;
}

export interface ReqStart {
    operateType: string; //操作类型，可不填
    operateTime: string; //操作时间
    solution: string; //解决方案
    operator: number; //操作人
    id: number; //生产暂停id
    tenantId: number;
}
type ReqFinish = ReqStart;

export const useReportProgressPauseApi = () => {
    const tmgc2OExec = useNetworkApi(proxyEnum.tmgc2OExec);

    return {
        /**
         * 生产暂停记录分页查询
         * @returns
         */
        pageQuery: (params?: Partial<ReqPageQuery>) => {
            return http.post<ResTpfObject<{ list: ResPageQuery[] }>>(
                `${tmgc2OExec}/reportProgressPause/pageQuery`,
                params
            );
        },
        /**
         * 开始处理
         * @returns
         */
        start: (params?: ReqStart[]) => {
            return http.post(`${tmgc2OExec}/reportProgressPause/start`, params);
        },
        /**
         * 开始处理
         * @returns
         */
        finish: (params?: ReqFinish[]) => {
            return http.post(`${tmgc2OExec}/reportProgressPause/finish`, params);
        },
        /**
         * 导出
         * @returns
         */
        exportReportProgressPauseFile: (params?: Partial<ReqExportReportProgressPauseFile>) => {
            return http.post(
                `${tmgc2OExec}/reportProgressPause/exportReportProgressPauseFile`,
                params
            );
        }
    };
};
