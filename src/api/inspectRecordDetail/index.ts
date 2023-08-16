import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';

export const inspectRecordDetailAPi = () => {
    const tmgc2Qc = useNetworkApi(proxyEnum.tmgc2Qc);

    return {
        /**
         * @returns 过程质检详情
         */
        getInspectRecordDetailDataById: (params: any) => {
            return http.get<any>(`${tmgc2Qc}/inspectRecordDetail/getInspectRecordDetailDataById`, {
                params
            });
        },

        /**
         * @returns 过程质检主页详情的详情
         */
        getInspectRecordDetailByInspectOrderId: (params: any) => {
            return http.get<any>(
                `${tmgc2Qc}/inspectRecordDetail/getInspectRecordDetailByInspectOrderId`,
                {
                    params
                }
            );
        }
    };
};
