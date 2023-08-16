import { ResTpfObject, ResTpfList, ResTpfValue } from '@/types/axios';
import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';
import type { ExportTableHeaderConfig } from '@/types';

export type IResGetWorkshopList = {
    factoryCode: string;
    factoryId: number;
    workshopId: number; //车间id
    workshopCode: string; //车间编码
    workshopName: string; //车间名称
    workshopAbbreviation: string; //车间简称
    workshopEnglishName: string; //英文名称
    status: string; //状态
    createUser: string; //创建用户
    updateUser: string; //编辑用户
    updateTime: string; //编辑时间
    remarks: string; //备注
};

export type IResGetFactoryWorkshopTreeList = {
    rootCode: string; //
    rootId: number; //节点id
    rootName: string; //节点名称
    branchTree: IResGetFactoryWorkshopTreeList[];
    fatherCode: string;
};

export type IReqCheckWorkshopNameUnique = {
    workshopCode?: string;
    workshopName?: string;
    operation?: number;
};

export type IReqUpdateWorkshop = {
    factoryId: string;
    workshopName: string; //车间名称
    workshopAbbreviation: string; //车间简称
    workshopEnglishName: string; //英文名称
    status: number; //状态
    // modifyUser?: string;//编辑用户
    // modifyDateTime?: string;//编辑时间
    remarks: string; //备注
    factoryCode: string;
    factoryName: string;
    workshopCode: string;
};

interface ReqCreateWorkshop {
    factoryId: number | string;
    workshopCode: string;
    workshopName: string;
    workshopAbbreviation: string;
    workshopEnglishName: string;
    status: number;
    createUser: string;
    modifyUser: string;
    createDateTime: string;
    modifyDateTime: string;
    remarks: string;
    deleted: number;
    tenantId: number;
}

//车间
export const useWorkshopAPi = () => {
    const networkApi = useNetworkApi(proxyEnum.tmgc2Org);

    return {
        /**
         * 获取车间列表
         * @returns
         */
        getWorkshopList: (params?: { factoryCode?: string }) => {
            return http.get<ResTpfList<IResGetWorkshopList[]>>(
                `${networkApi}/workshop/getWorkshopList`,
                { params }
            );
        },
        /**
         *
         * @returns 获取工厂-车间树型列表
         */
        getFactoryWorkshopTreeList: () => {
            return http.get<ResTpfList<IResGetFactoryWorkshopTreeList[]>>(
                `${networkApi}/workshop/getFactoryWorkshopTreeList`
            );
        },
        /**
         *
         * @returns 检查车间名称是否重复
         */
        checkWorkshopNameUnique: (params: IReqCheckWorkshopNameUnique) => {
            return http.post<ResTpfValue<boolean>>(
                `${networkApi}/workshop/checkWorkshopNameUnique`,
                params
            );
        },
        /**
         *
         * @returns 检查车间编码是否重复
         */
        checkWorkshopCodeUnique: (params: { workshopCode?: string; factoryId: any }) => {
            return http.post<ResTpfValue<boolean>>(
                `${networkApi}/workshop/checkWorkshopCodeUnique`,
                params
            );
        },
        /**
         *
         * @returns 修改车间
         */
        updateWorkshop: (params: IReqUpdateWorkshop) => {
            return http.put<ResTpfValue<boolean>>(`${networkApi}/workshop/updateWorkshop`, params);
        },
        /**
         *
         * @returns 新增车间
         */
        createWorkshop: (params?: Partial<ReqCreateWorkshop>) => {
            return http.post<ResTpfValue<boolean>>(`${networkApi}/workshop/createWorkshop`, params);
        },
        /**
         *
         * @returns 获取车间信息详情
         */
        getWorkshopDetails: (params: { workshopId: string }) => {
            return http.get<ResTpfObject<IReqUpdateWorkshop>>(
                `${networkApi}/workshop/getWorkshopDetails`,
                { params }
            );
        },
        /**
         *
         * @returns 导出所见车间列表
         */
        workshopListDerive: (params: { tableHeaderConfig: ExportTableHeaderConfig }) => {
            return http.post(`${networkApi}/workshop/workshopListDerive`, params);
        },
        /**
         * @returns 删除车间
         */
        deleteWorkshop: (data: { id: string[] }) => {
            return http.delete(`${networkApi}/workshop/deleteWorkshop`, { data });
        }
    };
};
