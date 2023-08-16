import { ResTpfList, ResTpfObject } from '@/types/axios';
import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';

export const useMenuApi = () => {
    const tmgc2Mgt = useNetworkApi(proxyEnum.tmgc2Mgt);
    return {
        /**
         * @returns 获取菜单树结构
         */
        queryMenuTreeSelect: () => {
            return http.get<ResTpfList<any[]>>(`${tmgc2Mgt}/menu/queryMenuTreeSelect`);
        },

        /**
         * 根据角色权限查询菜单
         */
        queryMenuTreeSelectByCondition: (params?: any) => {
            return http.get(`${tmgc2Mgt}/menu/queryMenuTreeSelectByCondition`, { params });
        },
        /**
         * @returns 查询菜单列表
         */
        querySysMenuListByPage: (params: any) => {
            return http.get<ResTpfObject<{ list: any[] }>>(
                `${tmgc2Mgt}/menu/querySysMenuListByPage`,
                { params }
            );
        },
        /**
         * @returns 新增菜单列表
         */
        addSysMenu: (params: any) => {
            return http.post(`${tmgc2Mgt}/menu/addSysMenu`, params);
        },

        /**
         * @returns 编辑菜单列表
         */
        editSysMenu: (params: any) => {
            return http.put(`${tmgc2Mgt}/menu/editSysMenu`, params);
        },

        /**
         * @returns 批量删除菜单列表
         */
        deleteSysMenuByIds: (params: any) => {
            return http.post(`${tmgc2Mgt}/menu/deleteSysMenuByIds`, params);
        },
        /**
         * @returns 查询单条数据
         */
        getSysMenuById: (params: any) => {
            return http.get(`${tmgc2Mgt}/menu/getSysMenuById`, { params });
        },

        /**
         * @returns 效验数据重复
         */
        checkSysMenuCode: (params: any) => {
            return http.get(`${tmgc2Mgt}/menu/checkSysMenuCode`, {
                params
            });
        },
        /**
         * @returns 删除数据
         */
        deleteSysMenuById: (params: any) => {
            return http.get(`${tmgc2Mgt}/menu/deleteSysMenuById`, params);
        }

        // /**
        //  * @returns 删除数据
        //  */

        // queryMenuTreeSelectByCondition: (params: any) => {
        //     return http.get(`${tmgc2Mgt}/menu/queryMenuTreeSelectByCondition`, { params });
        // }
        // deleteSysMenuById: (params: any) => {
        //     return http.get(`${tmgc2Mgt}/menu/deleteSysMenuById`, params);
        // }
    };
};
