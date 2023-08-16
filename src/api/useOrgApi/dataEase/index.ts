import { ResTpfValue } from '@/types/axios';
import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';

//DataEase
export const useDataEaseApi = () => {
    const tmgc2Org = useNetworkApi(proxyEnum.tmgc2Org);

    return {
        getPanelSrc: (panel: string, params: Record<string, any>) => {
            return http.get<ResTpfValue>(`${tmgc2Org}/dataEase/panel/${panel}`, { params });
        }
    };
};
