import http from '@/utils/http';
import { ResTpfObject } from '@/types/axios';
import { useNetworkApi, proxyEnum } from '@/api';
import type { ReqFatOrSatDetails } from '../fat';
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
export const useQcSatAPi = () => {
    const tmgc2Qc = useNetworkApi(proxyEnum.tmgc2Qc);

    return {
        // sat 提交
        satSubmit: (params: ResFatSubmit) => {
            return http.post(`${tmgc2Qc}/sat/inspect-order/submit`, params);
        },
        // sat 详情
        satDetails: (params: { id: string }) => {
            return http.get<ResTpfObject<ReqFatOrSatDetails>>(
                `${tmgc2Qc}/sat/inspect-order/details`,
                { params }
            );
        }
    };
};
