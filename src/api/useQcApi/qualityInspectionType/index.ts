import { ResTpfList } from '@/types/axios';
import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';

export const useQualityInspectionTypeApi = () => {
    const tmgc2Qc = useNetworkApi(proxyEnum.tmgc2Qc);

    return {
        /**
         * @returns 查询检验类型列表
         */
        getInspectionTypeByIdByTenantId: () => {
            return http.post<ResTpfList<any>>(
                `${tmgc2Qc}/qualityInspectionType/getInspectionTypeByIdByTenantId`
            );
        }
    };
};
