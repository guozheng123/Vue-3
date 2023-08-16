import http from '@/utils/http';
import type { ResTpfList } from '@/types/axios';
import { useNetworkApi, proxyEnum } from '@/api';
export * from './index.d';
import { ResGetBomInfoRevisionHistory } from './index.d';
export const useBomInfoApi = () => {
    const tmgc2Material = useNetworkApi(proxyEnum.tmgc2Material);

    return {
        getBomInfoRevisionHistory: (params: { bomId: string; bomType: string }) => {
            return http.get<ResTpfList<ResGetBomInfoRevisionHistory[]>>(
                `${tmgc2Material}/bomInfo/getBomInfoRevisionHistory`,
                { params }
            );
        }
    };
};
