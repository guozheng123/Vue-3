import type { ResTpfObject } from '@/types/axios';
import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';

export type QueryUserWorkshopOperationList = {
    total: number;
    page: number;
    pageSize: number;
    totalPage: number;
    workshopId: string;
    userAccount: string;
    userName: string;
    userId: string;
    workshopManageId: string;
    totalPageValue: string;
    workshopOperationId: string;
};

export const userReportManage = () => {
    const tmgc2Production = useNetworkApi(proxyEnum.tmgc2Production);

    return {
        /**
         * 查询用户车间操作权限列表
         * @param params
         * @returns
         */
        queryUserWorkshopOperationList: (params: QueryUserWorkshopOperationList) => {
            return http.post<ResTpfObject<{ list: QueryUserWorkshopOperationList[] }>>(
                `${tmgc2Production}/userReportManage/queryUserWorkshopOperationList`,
                params
            );
        },
        /**
         * 添加操作用户时 选择用户的列表
         * @param params
         * @returns
         */
        queryOperationUserList: (params: Partial<QueryUserWorkshopOperationList>) => {
            return http.post(`${tmgc2Production}/userReportManage/queryOperationUserList`, params);
        },
        /**
         * 删除用户车间操作权限
         * @param params
         * @returns
         */
        deleteUserWorkshopOperation: (params: {
            list: Partial<QueryUserWorkshopOperationList>[];
        }) => {
            return http.post<ResTpfObject<{ success: boolean; message: string }>>(
                `${tmgc2Production}/userReportManage/deleteUserWorkshopOperation`,
                params
            );
        },
        /**
         * 新增用户车间操作权限
         * @param params
         * @returns
         */
        createUserWorkshopOperation: (params: {
            list: Partial<QueryUserWorkshopOperationList>[];
        }) => {
            return http.post<any>(
                `${tmgc2Production}/userReportManage/createUserWorkshopOperation`,
                params
            );
        },

        /**
         * 查询用户车间管理权限列表
         * @param params
         * @returns
         */
        queryUserWorkshopManageList: (params: QueryUserWorkshopOperationList) => {
            return http.post<ResTpfObject<{ list: QueryUserWorkshopOperationList[] }>>(
                `${tmgc2Production}/userReportManage/queryUserWorkshopManageList`,
                params
            );
        },

        /**
         * 添加管理用户时 选择用户的列表
         * @param params
         * @returns
         */
        queryManageUserList: (params: Partial<QueryUserWorkshopOperationList>) => {
            return http.post(`${tmgc2Production}/userReportManage/queryManageUserList`, params);
        },

        /**
         * 删除用户车间管理权限
         * @param params
         * @returns
         */
        deleteUserWorkshopManage: (params: { list: Partial<QueryUserWorkshopOperationList>[] }) => {
            return http.post(
                `${tmgc2Production}/userReportManage/deleteUserWorkshopManage`,
                params
            );
        },

        /**
         * 新增车间管理权限
         * @param params
         * @returns
         */
        createUserWorkshopManage: (params: { list: Partial<QueryUserWorkshopOperationList>[] }) => {
            return http.post<any>(
                `${tmgc2Production}/userReportManage/createUserWorkshopManage`,
                params
            );
        }
    };
};
