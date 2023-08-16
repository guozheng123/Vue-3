import { ResTpfList, ResTpfObject, ResTpfValue } from '@/types/axios';
import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';
import type { ExportTableHeaderConfig } from '@/types';
export type IResGetWorkingTeamList = {
    workshopCode: string;
    factoryCode: string;
    workshopId: string;
    workingTeamId: string; //班组id
    workingTeamCode: string; //班组编码
    workingTeamName: string; //班组名称
    workingTeamAbbreviation: string; //班组简称
    workingTeamEnglishName: string; //英文名称
    status: number; //状态
    createUser: string; //创建用户
    updateUser: string; //编辑用户
    createTime: string; //创建时间
    updateTime: string; //编辑时间
    remarks: string; //备注
    workingTeamLeader: string; //班组长
};

export type IResGetWorkshopWorkingTeamTreeList = {
    rootId: string; //节点id
    rootName: string; //节点名称
    rootCode: string; //节点编码
    branchTree: IResGetWorkshopWorkingTeamTreeList[];
};
export type IReqGetWorkingTeamList = {
    workingTeamCode: string;
    workingTeamName: string;
    factoryCode: string;
    factoryName: string;
    workshopCode: string;
    workshopName: string;
    pageSize: number;
    page: number;
    status: number | string;
};

interface ReqGetWorkingTeamList {
    total: number;
    page: number;
    pageSize: number;
    totalPage: number;
    workingTeamCode: string; //班组编码
    workingTeamName: string; //班组名称
    workshopName: string; //车间名称
    workshopCode: string; //车间编码
    factoryName: string; //工厂名称
    factoryCode: string; //工厂编码
    status: number; //状态
    totalPageValue: number;
}

interface ResGetWorkingTeamDetails {
    workingTeamId: number;
    workingTeamCode: string;
    workingTeamName: string;
    workingTeamAbbreviation: string;
    workingTeamEnglishName: string;
    workshopName?: any;
    workshopCode?: any;
    factoryName?: any;
    factoryCode?: any;
    status: number;
    createUser: string;
    modifyUser: string;
    createDatetime: string;
    modifyDatetime: string;
    remarks: string;
    workingTeamLeader: string;
    workingTeamLeaderUserId: number;
}

//班组
export const useWorkingTeamAPi = () => {
    const networkApi = useNetworkApi(proxyEnum.tmgc2Org);

    return {
        /**
         * @returns 获取班组列表
         */
        getWorkingTeamList: (params?: Partial<ReqGetWorkingTeamList>) => {
            return http.post<ResTpfObject<{ list: IResGetWorkingTeamList[] }>>(
                `${networkApi}/workingTeam/getWorkingTeamList`,
                params
            );
        },
        /**
         * @returns 获取班组树结构
         */
        getWorkshopWorkingTeamTreeList: () => {
            return http.get<ResTpfList<IResGetWorkshopWorkingTeamTreeList[]>>(
                `${networkApi}/workingTeam/getWorkshopWorkingTeamTreeList`
            );
        },
        /**
         * @returns 获取班组信息详情
         */
        getWorkingTeamDetails: (params: { workingTeamId: number }) => {
            return http.get<ResTpfObject<ResGetWorkingTeamDetails>>(
                `${networkApi}/workingTeam/getWorkingTeamDetails`,
                { params }
            );
        },
        /**
         * @returns 修改班组
         */
        updateWorkingTeam: (entity: IReqGetWorkingTeamList) => {
            return http.put(`${networkApi}/workingTeam/updateWorkingTeam`, entity);
        },
        /**
         * @returns 新增班组
         */
        createWorkingTeam: (entity: IReqGetWorkingTeamList) => {
            return http.post(`${networkApi}/workingTeam/createWorkingTeam`, entity);
        },
        /**
         * @returns 检查班组名称是否重复
         */
        checkWorkingTeamNameUnique: (
            entity?: Partial<{
                workingTeamCode: string;
                workingTeamName: string;
                operation: number;
            }>
        ) => {
            return http.post(`${networkApi}/workingTeam/checkWorkingTeamNameUnique`, entity);
        },
        /**
         * @returns 检查班组编码是否重复
         */
        checkWorkingTeamCodeUnique: (
            entity?: Partial<{
                workingTeamCode: string;
                groupId: string;
                tenantId: number;
                operation: number;
            }>
        ) => {
            return http.post(`${networkApi}/workingTeam/checkWorkingTeamCodeUnique`, entity);
        },
        /**
         * @returns 删除班组
         */
        deleteWorkingTeam: (entity: number[]) => {
            return http.post(`${networkApi}/workingTeam/deleteWorkingTeam`, {
                workingTeamId: entity
            });
        },
        /**
         * @returns 导出所见班组列表
         */
        workingTeamListDerive: (params: { tableHeaderConfig: ExportTableHeaderConfig }) => {
            return http.post<ResTpfValue>(
                `${networkApi}/workingTeam/workingTeamListDerive`,
                params
            );
        },
        /**
         * @returns 导出所见班组模板
         */
        workingTeamTemplate: () => {
            return http.post<ResTpfValue>(`${networkApi}/workingTeam/workingTeamTemplate`);
        },
        /**
         * @returns 导入班组列表
         */
        workingTeamListImport: (params: { overrideFlag: boolean; fileCode: string }) => {
            return http.post<ResTpfValue>(`${networkApi}/workingTeam/workingTeamListImport`, null, {
                params
            });
        }
    };
};
