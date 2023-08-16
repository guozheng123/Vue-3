import { useNetworkApi, proxyEnum } from '@/api';
import http from '@/utils/http';

//公司
export const useOperationInfoApi = () => {
    const tmgc2Process = useNetworkApi(proxyEnum.tmgc2Process);

    return {
        /**
         * 获取工段管理选择工序列表
         * @returns
         */
        queryOperationListByWorkshopSectionPage: (params?: any) => {
            return http.post(
                `${tmgc2Process}/operationInfo/queryOperationListByWorkshopSectionPage`,
                params
            );
        }
    };
};
