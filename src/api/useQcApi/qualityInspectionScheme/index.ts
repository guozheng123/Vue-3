import { ResTpfList } from '@/types/axios';
import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';

export const useQualityInspectionSchemeApi = () => {
    const tmgc2Qc = useNetworkApi(proxyEnum.tmgc2Qc);

    return {
        /**
         * @returns 查询质检方案列表
         */
        getInspectionSchemeByTenantId: () => {
            return http.post<ResTpfList<any>>(
                `${tmgc2Qc}/qualityInspectionScheme/getInspectionSchemeByTenantId`
            );
        }
    };
};
