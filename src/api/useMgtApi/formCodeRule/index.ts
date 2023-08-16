import { ResTpfObject } from '@/types/axios';
import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';
export type IResNumberingRuleList = {
    id: number;
    numberRuleCode: string;
    formName: string;
    prefix: string;
    submitTime: string;
    num: string;
    remarks: string;
    formNumberRule: string;
    pageSize: number;
    page: number;
    modifyUser: string;
    modifyDateTime: string;
};
export type IReqGetNumberingRule = {
    numberRuleCode: string;
    formName: string;
    formNumberRule: string;
    pageSize: number;
    page: number;
};

//班组
export const useFormCodeRuleApi = () => {
    const networkApi = useNetworkApi(proxyEnum.tmgc2Mgt);

    return {
        /**
         * @returns 获取列表
         */
        getFormList: (params: any) => {
            return http.post<ResTpfObject<{ list: IResNumberingRuleList[] }>>(
                `${networkApi}/formCodeRule/getFormList`,
                params
            );
        },
        /**
         * @returns 编辑
         */
        updateFormTeam: (entity: IResNumberingRuleList) => {
            return http.put(`${networkApi}/formCodeRule/updateFormTeam`, entity);
        },
        /**
         * @returns 查询单条数据
         */
        getFormDetails: (entity: any) => {
            return http.get(`${networkApi}/formCodeRule/getFormDetails`, { params: entity });
        }
    };
};
