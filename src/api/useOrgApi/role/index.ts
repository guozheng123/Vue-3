import { ResTpfList, ResTpfValue } from '@/types/axios';
import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';

export const useRoleApi = () => {
    const tmgc2Org = useNetworkApi(proxyEnum.tmgc2Org);

    return {
        /**
         * 角色
         */
        /**
         * 根据用户编号查询角色数据
         */
        queryRolePageByParam: (params: any) => {
            return http.post(`${tmgc2Org}/role/queryRolePageByParam`, params);
        },
        /**
         * 更新用户与角色的关系
         */
        deleteRole: (params: any) => {
            return http.post<ResTpfList<{ list: any[] }>>(`${tmgc2Org}/role/deleteRole`, params);
        },
        /**
         * 新建或者更新角色数据
         */
        createUpdateRole: (params: any) => {
            return http.post<ResTpfValue>(`${tmgc2Org}/role/createUpdateRole`, params);
        },
        /**
         * 校验角色编码
         */
        checkRoleCode: (params: { roleCode: string }) => {
            return http.post<ResTpfValue>(`${tmgc2Org}/role/checkRoleCode`, {}, { params });
        },
        /**
         * 校验角色名称
         */
        checkRoleName: (params: { roleName: string; roleId: string | any }) => {
            return http.post<ResTpfValue>(`${tmgc2Org}/role/checkRoleName`, params);
        },
        /**
         * 更新角色权限
         */
        updateRolePermission: (params: any) => {
            return http.post<ResTpfValue>(`${tmgc2Org}/role/updateRolePermission`, params);
        },
        /**
         * 根据角色id 查询用户id列表
         */
        queryUserIdListByRoleId: (params: any) => {
            return http.post(`${tmgc2Org}/role/queryUserIdListByRoleId`, params);
        },
        /**
         * 根据用户编号查询角色数据
         */
        queryRoleById: (params: { roleName: string }) => {
            return http.post<ResTpfValue>(`${tmgc2Org}/role/queryRoleById`, params);
        },

        /**
         * 根据角色查询用户信息
         */
        updateRoleUser: (params: any) => {
            return http.post(`${tmgc2Org}/role/updateRoleUser`, params);
        },
        /**
         * 根据角色查询用户信息
         */
        deleteRoleUser: (params: any) => {
            return http.post(`${tmgc2Org}/role/deleteRoleUser`, params);
        }
    };
};
