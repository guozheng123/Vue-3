import type { ResTpfList, ResTpfValue } from '@/types/axios';
import { useNetworkApi, proxyEnum } from '@/api';
import http from '@/utils/http';
import type { ExportTableHeaderConfig } from '@/types';
export type GroupCreateObj = {
    groupId: number;
    groupCode: string;
    groupName: string;
    groupAbbreviation: string;
    groupEnglishName: string;
    status: number;
    remarks: string;
};
type GroupList = {
    groupId: number;
    groupCode: string;
    groupName: string;
    groupAbbreviation: string;
    groupEnglishName: string;
    status: number;
    createUser: string;
    modifyUser: string;
    createDatetime: string;
    modifyDatetime: string;
    remarks: string;
};
//集团
export const useGroupAPi = () => {
    const networkApi = useNetworkApi(proxyEnum.tmgc2Org);

    return {
        //获取集团列表
        getGroupList: () => {
            return http.get<ResTpfList<GroupList[]>>(`${networkApi}/group/getGroupList`);
        },
        //修改集团
        updateGroup: (entity: GroupCreateObj) => {
            return http.put(`${networkApi}/group/updateGroup`, entity);
        },
        //新增集团
        createGroup: (entity: GroupCreateObj) => {
            return http.post(`${networkApi}/group/createGroup`, entity);
        },
        //检查集团名称是否重复
        checkGroupNameUnique: (entity?: {
            groupCode?: string;
            groupName?: string;
            operation?: number;
        }) => {
            return http.post(`${networkApi}/group/checkGroupNameUnique`, entity);
        },
        //检查集团编码是否重复
        checkGroupCodeUnique: (entity?: {
            groupCode?: string;
            groupId?: string;
            operation?: number;
        }) => {
            return http.post(`${networkApi}/group/checkGroupCodeUnique`, entity);
        },
        //导出所见集团
        groupListExport: (params: { tableHeaderConfig: ExportTableHeaderConfig }) => {
            return http.post<ResTpfValue>(`${networkApi}/group/groupListExport`, params);
        },
        //删除集团
        deleteGroup: (entity: Array<number>) => {
            return http.post(`${networkApi}/group/deleteGroup`, {
                groupId: entity
            });
        }
    };
};
