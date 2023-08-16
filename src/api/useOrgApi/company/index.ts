import { useNetworkApi, proxyEnum } from '@/api';
import type { ExportTableHeaderConfig } from '@/types';
import { ResTpfValue, ResTpfList } from '@/types/axios';
import http from '@/utils/http';
export type CompanyCreateObj = {
    companyId: number;
    companyCode: string;
    companyName: string;
    companyAbbreviation: string;
    companyEnglishName: string;
    status: number;
    remarks: string;
};
export type GroupList = {
    groupCode: string;
    groupId: string;
    companyId: number;
    companyCode: string;
    companyName: string;
    companyAbbreviation: string;
    companyEnglishName: string;
    status: number;
    createUser: string;
    modifyUser: string;
    createDatetime: string;
    modifyDatetime: string;
    remarks: string;
};
export type IResGetCompanyFactoryTreeList = {
    rootId: string; //节点id
    rootName: string; //节点名称
    rootCode: number; //节点名称
    branchTree: IResGetCompanyFactoryTreeList[];
    fatherCode: string;
};
//公司
export const useCompanyAPi = () => {
    const networkApi = useNetworkApi(proxyEnum.tmgc2Org);

    return {
        //获取公司列表
        getCompanyList: () => {
            return http.get<ResTpfList<GroupList[]>>(`${networkApi}/company/getCompanyList`);
        },
        //获取公司信息详情
        getCompanyDetails: () => {
            return http.post<ResTpfList<GroupList[]>>(`${networkApi}/company/getCompanyDetails`);
        },
        //修改公司
        updateCompany: (entity: CompanyCreateObj) => {
            return http.put(`${networkApi}/company/updateCompany`, entity);
        },
        //新增公司
        createCompany: (entity: CompanyCreateObj) => {
            return http.post(`${networkApi}/company/createCompany`, entity);
        },
        //检查公司名称是否重复
        checkCompanyNameUnique: (entity?: {
            companyCode?: string;
            companyName?: string;
            operation?: number;
        }) => {
            return http.post(`${networkApi}/company/checkCompanyNameUnique`, entity);
        },
        //检查公司编码是否重复
        checkCompanyCodeUnique: (entity?: {
            companyCode?: string;
            groupId?: string | number;
            operation?: number;
        }) => {
            return http.post(`${networkApi}/company/checkCompanyCodeUnique`, entity);
        },
        //删除公司
        deleteCompany: (entity: number[]) => {
            return http.post(`${networkApi}/company/deleteCompany`, { id: entity });
        },
        //获取集团-公司树型结构
        getGroupCompanyTreeList: () => {
            return http.get<ResTpfList<IResGetCompanyFactoryTreeList[]>>(
                `${networkApi}/company/getGroupCompanyTreeList`
            );
        },
        /**
         *导出所见公司
         */
        companyListExport: (params?: { tableHeaderConfig: ExportTableHeaderConfig }) => {
            return http.post<ResTpfValue>(`${networkApi}/company/companyListExport`, params);
        },
        //获取公司列表-已启用
        getCompanyIsValidList: () => {
            return http.get<ResTpfList<GroupList[]>>(`${networkApi}/company/getCompanyIsValidList`);
        }
    };
};
