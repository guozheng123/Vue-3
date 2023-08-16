import http from '@/utils/http';
import { ResTpfObject, ResTpfList } from '@/types/axios';
import { useNetworkApi, proxyEnum } from '@/api';

type ReqDataAndDetails = {
    ids: (string | number)[];
    pageCode: string;
};

export const useDataQueryApi = () => {
    const tmgc2Query = useNetworkApi(proxyEnum.tmgc2Query);

    return {
        /**
         * 获取打印数据
         * @returns
         */
        dataAndDetails: (params?: Partial<ReqDataAndDetails>) => {
            return http.post<ResTpfList<any>>(`${tmgc2Query}/dataQuery/dataAndDetails`, params);
        }
    };
};
