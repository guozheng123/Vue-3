import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';

interface updateReportProgressData {
    reportProgressId: string;
    startTime: string;
    endTime: string;
}
//系统配置
export const useExecReportApi = () => {
    const tmgc2OExec = useNetworkApi(proxyEnum.tmgc2OExec);

    return {
        /**
         * 编辑保存报工记录
         * @returns
         */
        updateReportProgressData: (params: updateReportProgressData) => {
            return http.put(`${tmgc2OExec}/exec/report/update-report-progress-data`, params);
        },

        /**
         * 获取报工记录详情
         * @returns
         */
        getUpdateReportProgressDetail: (params: { reportProgressId: string }) => {
            return http.get(`${tmgc2OExec}/exec/report/get-report-progress-detail`, { params });
        },

        /**
         * 删除报工记录
         * @returns
         */

        // deleteReportProgress: (data: { ids: string[] }) => {
        //     return http.delete(`${tmgc2Production}/productionOrder/deleteReportProgress`, { data });
        // },
        // deleteReportProgress: (data: any) => {
        //     return http.delete(`${tmgc2OExec}/reportProgressApi/deleteReportProgress`, {
        //         ids: data
        //     });
        // },

        /**
         * 获取工序bom
         * @returns
         */
        material: (params: {
            operationId: string;
            beReportProgressId: string;
            reportProgressCode: string;
        }) => {
            return http.post(`${tmgc2OExec}/exec/report/material`, params);
        }
    };
};
