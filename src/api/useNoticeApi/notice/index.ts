import type { ResTpfList, ResTpfObject, ResTpfValue } from '@/types/axios';
import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';
import type {
    MessageTemplate,
    querylist,
    viewquerylist,
    MessageLog,
    MessageConfiguration,
    addConfiguration
} from './index.d';

export const useMessageApi = () => {
    const tmgc2Notice = useNetworkApi(proxyEnum.tmgc2Notice);
    return {
        /**
         * 消息模板新增
         * @returns
         */
        addMessageTemplate: (params: Partial<MessageTemplate>) => {
            return http.post(`${tmgc2Notice}/notice/template/add`, params);
        },
        /**
         * 消息模板编辑
         * @returns
         */
        updateMessageTemplate: (params?: Partial<MessageTemplate>) => {
            return http.post(`${tmgc2Notice}/notice/template/update`, params);
        },
        /**
         * 消息模板详情
         * @returns
         */
        detailMessageTemplate: (params: { templateNo: number }) => {
            return http.get(`${tmgc2Notice}/notice/template/detail`, { params });
        },
        /**
         * 模板编号+语言校验
         * @returns
         */
        checkcodeandlanguage: (params: { templateCode: string; languageCode: string }) => {
            return http.get(`${tmgc2Notice}/notice/tempLate/checkcodeandlanguage`, { params });
        },
        /**
         * 站内信查看全部消息/标记为已读
         * @returns
         */
        batchupdate: (params: any) => {
            return http.put(`${tmgc2Notice}/notice/notes/status/batchupdate`, {
                sendDetailNos: params
            });
        },
        /**
         * 消息模板列表查询
         * @returns
         */
        querylist: (params?: Partial<querylist>) => {
            return http.post(`${tmgc2Notice}/notice/template/querylist`, params);
        },
        /**
         * 站内信查看全部消息
         * @returns
         */
        viewquerylist: (params?: Partial<viewquerylist>) => {
            return http.post(`${tmgc2Notice}/notice/notes/query/list`, params);
        },
        /**
         * 站内信未读消息弹窗查询
         * @returns
         */
        unread: () => {
            return http.get(`${tmgc2Notice}/notice/notes/queryPop/unread`);
        },
        /**
         * 消息轮询接口
         * @returns
         */
        unread2: () => {
            return http.get(`${tmgc2Notice}/notice/notes/queryPop/unread2`);
        },
        /**
         * 站内信查看消息详情
         * @returns
         */
        detailStationMessage: (params: { sendDetailNo: string }) => {
            return http.get(`${tmgc2Notice}/notice/notes/query/detail`, { params });
        },
        /**
         * 站内信未读消息数量显示
         * @returns
         */
        countUnread: () => {
            return http.get(`${tmgc2Notice}/notice/notes/count/unread`);
        },
        /**
         * 消息发送日志详情
         * @returns
         */
        detailMessageLog: (params?: Partial<MessageLog>) => {
            return http.post(`${tmgc2Notice}/notice/sendlog/detial`, params);
        },
        /**
         * 消息通知配置控制器
         * @returns
         */
        updateMessageConfiguration: (params?: Partial<MessageConfiguration>) => {
            return http.post(`${tmgc2Notice}/notice/conf/update`, params);
        },
        /**
         * 消息通知配置新增
         * @returns
         */
        addMessageConfiguration: (params: Partial<addConfiguration>) => {
            return http.post(`${tmgc2Notice}/notice/conf/add`, params);
        },
        /**
         * 消息通知配置批量新增
         * @returns
         */
        addBatchMessageConfiguration: (list: any) => {
            return http.post(`${tmgc2Notice}/notice/conf/add/batch`, { list });
        },
        /**
         * 消息配置查看消息详情
         * @returns
         */
        configurationDetail: (params?: any) => {
            return http.get(`${tmgc2Notice}/notice/conf/detail`, { params });
        },
        /**
         * 查询你消息通知配置列表
         * @returns
         */
        configurationList: (params?: any) => {
            return http.post(`${tmgc2Notice}/notice/conf/list`, params);
        }
    };
};
