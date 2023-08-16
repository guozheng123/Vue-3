import { ResTpfList, ResTpfObject, ResTpfValue } from '@/types/axios';
import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';
import type { ExportTableHeaderConfig } from '@/types';
export type IResGetFactoryList = {
    companyCode: string; //	公司编码
    companyName: string; //公司名称
    companyId: string; //公司id
    factoryId: string; //工厂id
    factoryCode: string; //工厂编码
    factoryName: string; //工厂名称
    factoryAbbreviation: string; //工厂简称
    factoryEnglishName: string; //英文名称
    status: number; //状态
    createUser: string; //创建用户
    updateUser: string; //编辑用户
    createTime: string; //创建时间
    updateTime: string; //编辑时间
    remarks: string; //备注
};
export type IResFactoryTreeList = {
    rootId: string; //节点id
    rootName: string; //节点名称
    rootCode: string; //节点Code
    branchTree: IResFactoryTreeList[];
    fatherCode: string;
};

interface ReqCreateFactory {
    companyId: string; //公司id
    factoryCode: string; //工厂编码
    factoryName: string; //工厂名称
    factoryAbbreviation: string; //工厂简称
    factoryEnglishName: string; //英文名称
    status: number; //状态
    createUser: string; //创建用户
    modifyUser: string; //编辑用户
    createDateTime: string; //创建时间
    modifyDateTime: string; //编辑时间
    remarks: string; //备注
    deleted: number;
    tenantId: number;
}
interface ReqUpdateFactory {
    factoryId: string; //工厂id
    factoryName: string; //工厂名称
    factoryAbbreviation: string; //工厂简称
    factoryEnglishName: string; //英文名称
    status: number; //状态
    modifyUser: string; //编辑用户
    modifyDateTime: string; //编辑时间
    remarks: string; //备注
}

//工厂
export const useFactoryAPi = () => {
    const tmgc2Org = useNetworkApi(proxyEnum.tmgc2Org);

    return {
        /**
         * 获取工厂列表
         */
        getFactoryList: (params: { companyId?: string } = {}) => {
            return http.get<ResTpfList<IResGetFactoryList[]>>(
                `${tmgc2Org}/factory/getFactoryList`,
                { params }
            );
        },
        /**
         * 获取公司-工厂树型列表
         */
        getCompanyFactoryTreeList: () => {
            return http.get<ResTpfList<IResFactoryTreeList[]>>(
                `${tmgc2Org}/factory/getCompanyFactoryTreeList`
            );
        },
        /**
         * 检查工厂名称是否重复
         */
        checkFactoryNameUnique: (params: {
            factoryCode?: string;
            factoryName: string;
            operation: number;
        }) => {
            return http.post<ResTpfValue<boolean>>(
                `${tmgc2Org}/factory/checkFactoryNameUnique`,
                params
            );
        },
        /**
         * 检查车间编码是否重复
         */
        checkFactoryCodeUnique: (params: {
            factoryCode: string;
            companyCode: string;
            operation: number;
        }) => {
            return http.post<ResTpfValue<boolean>>(
                `${tmgc2Org}/factory/checkFactoryCodeUnique`,
                params
            );
        },
        /**
         * 新增工厂
         * @param params
         * @returns
         */
        createFactory: (params?: Partial<ReqCreateFactory>) => {
            return http.post(`${tmgc2Org}/factory/createFactory`, params);
        },
        /**
         * 修改工厂信息
         * @param params
         * @returns
         */
        updateFactory: (params?: Partial<ReqUpdateFactory>) => {
            return http.put<ResTpfValue<boolean>>(`${tmgc2Org}/factory/updateFactory`, params);
        },
        /**
         * 获取工厂信息详情
         * @param params
         * @returns
         */
        getFactoryDetails: (params?: { factoryId: string }) => {
            return http.get<ResTpfObject<IResGetFactoryList>>(
                `${tmgc2Org}/factory/getFactoryDetails`,
                {
                    params
                }
            );
        },
        /**
         * 删除工厂
         * @param params
         * @returns
         */
        deleteFactory: (data: { id: string[] }) => {
            return http.delete(`${tmgc2Org}/factory/deleteFactory`, {
                data
            });
        },
        /**
         * 导出所见工厂
         * @param params
         * @returns
         */
        factoryListExport: (
            params?: Partial<{
                tableHeaderConfig: ExportTableHeaderConfig;
            }>
        ) => {
            return http.post(`${tmgc2Org}/factory/factoryListExport`, params);
        },
        /**
         * 获取公司-工厂树型列表-已启用
         */
        getCompanyFactoryTreeIsValidList: () => {
            return http.get<ResTpfList<IResFactoryTreeList[]>>(
                `${tmgc2Org}/factory/getCompanyFactoryTreeIsValidList`
            );
        }
    };
};
