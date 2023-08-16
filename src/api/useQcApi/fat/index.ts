import http from '@/utils/http';
import { ResTpfObject } from '@/types/axios';
import { useNetworkApi, proxyEnum } from '@/api';

type QualityInspections = {
    inspectRecordId: number;
    qualityInspectionCode: string;
    qualityInspectionName: string;
    qualityInspectionStandard: string;
    qualityInspectionAttribute: string;
    upperlimitValue: number;
    lowerlimitValue: number;
    standardValue: number;
    actualValue: string;
    result: string;
    files: any[];
    operationResult: string;
};
type ProBlems = {
    inspectType: string;
    description: string;
    departmentCode: string;
    departmentName: string;
    userId: number;
    userName: number;
};
interface ResFatSubmit {
    inspectOrderId: number;
    inspectHours: number;
    qualityInspections: QualityInspections[];
    problems: ProBlems[];
}
export interface ReqFatOrSatDetails {
    workOrderCode: string; // 作业工单
    materialCode: string; // 物料编码
    materialName: string; // 物料名称
    projectCode: string; // 项目编码
    projectName: string; // 项目名称
    operationId: number; // 工序Id
    operationCode: string; // 工序编码
    operationName: string; // 工序名称
    status: string; // 状态
    statusName: string; // 状态名称
    createDate: string; // 创建日期
    inspectUserName: string; // 检验人
    qualifiedQuantit: number; // 合格数
    qualityInspections: any[]; // 质检项目,
    inspectHours?: string | number;
    files?: any[];
    problems?: any[];
    departmentData?: any[];
}
export const useQcFatAPi = () => {
    const tmgc2Qc = useNetworkApi(proxyEnum.tmgc2Qc);

    return {
        // fat 提交
        fatSubmit: (params: ResFatSubmit) => {
            return http.post(`${tmgc2Qc}/fat/inspect-order/submit`, params);
        },
        // fat 详情
        fatDetails: (params: { id: string }) => {
            return http.get<ResTpfObject<ReqFatOrSatDetails>>(
                `${tmgc2Qc}/fat/inspect-order/details`,
                { params }
            );
        }
    };
};
