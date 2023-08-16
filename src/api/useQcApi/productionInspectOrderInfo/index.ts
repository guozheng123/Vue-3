import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';

//质量管理
export const useProductionInspectOrderInfoApi = () => {
    const networkApi = useNetworkApi(proxyEnum.tmgc2Qc);

    return {
        /**
         * 查询单条数据
         * @returns
         */
        getInspectFilesByReportProgressId: (params?: { reportProgressId: string }) => {
            return http.get(
                `${networkApi}/productionInspectOrderInfo/getInspectFilesByReportProgressId`,
                { params }
            );
        }
    };
};
