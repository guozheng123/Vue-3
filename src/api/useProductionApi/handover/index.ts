import { ResTpfList } from '@/types/axios';
import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';

export interface handoverDetailType {
    handoverOrderCode: string; //工序交接单code
    operationName: string; //工序名称
    status: string; //状态
    totalRecipientNumber: string; //交接总数
    recipientUserName: string; //接收人
    createUserName: string; //创建人
    recipientDatetime: string; //接收时间
    createDatetime: string; //创建时间
    detailList: {
        handoverNumber: string; //交接数量
        receivedNumber: string; //接收数量
        workOrderCode: string; //作业工单号
        materialName: string; //物料名称
        materialCode: string; //物料编码
        projectCode: string; //项目编号
    };
}

//班组
export const useHandoverAPi = () => {
    const tmgc2Production = useNetworkApi(proxyEnum.tmgc2Production);

    return {
        /**
         * @returns 工序交接单PC端详情
         */
        handoverDetail: (params: string[]) => {
            return http.post<ResTpfList<{ list: handoverDetailType }>>(
                `${tmgc2Production}/handover/detail`,
                params
            );
        },
        /**
         * @returns 工序交接单PC端导出
         */
        download: (params: any) => {
            return http.post(`${tmgc2Production}/handover/download`, params);
        }
    };
};
