import type { ResTpfObject, ResTpfValue } from '@/types/axios';
import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';
export type IReqGetProjectSetInfoList = {
    projectGroupCode: string;
    projectGroupName: string;
    forbidden: string;
    pageSize: number;
    page: number;
    createUser: string;
    createDatetime: Array<any>;
    createDatetimeStart: string;
    createDatetimeEnd: string;
    modifyUser: string;
    modifyDatetime: Array<any>;
    modifyDatetimeStart: string;
    modifyDatetimeEnd: string;
};

interface ReqQueryProjectGroupListByPage {
    total: number;
    page: number;
    pageSize: number;
    totalPage: number;
    orderRule: string; //排序规则
    projectGroupCode: string; //项目集编号
    projectGroupName: string; //项目集名称
    forbidden: string; //是否启用 0未启用 1启用
    requirementDateStart: string; //创建时间开始
    requirementDateEnd: string; //创建时间结束
    createUserName: string; //创建人名称
    modifyUserName: string; //修改人名称
    createDatetimeStart: string; //创建时间开始
    createDatetimeEnd: string; //创建时间结束
    modifyDatetimeStart: string; //修改时间开始
    modifyDatetimeEnd: string; //修改时间结束
    totalPageValue: number;
}

interface ReqQueryPopProjectGroupListByPage {
    total: number;
    page: number;
    pageSize: number;
    totalPage: number;
    orderRule: string; //排序规则
    exclusionCodes: string[]; //需排除的Code列表
    totalPageValue: number;
}

interface ReqAddProjectGroup {
    projectGroupCode: string; //项目集编号
    projectGroupName: string; //项目集名称
    forbidden: string; //是否启用 0未启用 1启用
    remark: string; //备注
    requirementDate: string; //交期
}

//项目集
export const useProjectGroupApi = () => {
    const networkApi = useNetworkApi(proxyEnum.tmgc2Production);

    return {
        /**
         * @returns 获取列表
         */
        queryProjectGroupListByPage: (params?: Partial<ReqQueryProjectGroupListByPage>) => {
            return http.post<ResTpfObject<{ list: IReqGetProjectSetInfoList[] }>>(
                `${networkApi}/projectGroup/queryProjectGroupListByPage`,
                params
            );
        },
        /**
         * @returns 编辑
         */
        editProjectGroup: (entity: IReqGetProjectSetInfoList) => {
            return http.put<ResTpfValue<boolean>>(
                `${networkApi}/projectGroup/editProjectGroup`,
                entity
            );
        },
        /**
         * @returns 新增
         */
        addProjectGroup: (data?: Partial<ReqAddProjectGroup>) => {
            return http.post<ResTpfValue<boolean>>(
                `${networkApi}/projectGroup/addProjectGroup`,
                data
            );
        },
        /**
         * @returns 检查code是否重复
         */
        checkProjectGroupCode: (entity: { projectGroupCode: string }) => {
            return http.get<ResTpfValue<boolean>>(
                `${networkApi}/projectGroup/checkProjectGroupCode`,
                {
                    params: entity
                }
            );
        },
        /**
         * @returns 删除
         */
        deleteProjectGroupById: (params: { projectGroupId: string }) => {
            return http.delete<ResTpfValue<boolean>>(
                `${networkApi}/projectGroup/deleteProjectGroupById`,
                { params }
            );
        },
        /**
         * @returns 查询单条数据
         */
        getProjectGroupById: (params: { customerSupplierId: string }) => {
            return http.post<ResTpfObject<{ list: IReqGetProjectSetInfoList[] }>>(
                `${networkApi}/projectGroup/getProjectGroupById`,
                params
            );
        },
        /**
         * @returns 获取列表
         */
        queryPopProjectGroupListByPage: (params?: Partial<ReqQueryPopProjectGroupListByPage>) => {
            return http.post<ResTpfObject<{ list: IReqGetProjectSetInfoList[] }>>(
                `${networkApi}/projectGroup/queryPopProjectGroupListByPage`,
                params
            );
        }
    };
};
