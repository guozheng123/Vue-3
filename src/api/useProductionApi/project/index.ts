import type { ResTpfList, ResTpfObject, ResTpfValue } from '@/types/axios';
import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';
export type IReqGetProjectInfoList = {
    projectCode: string;
    projectName: string;
    projectGroupCode: string;
    projectGroupName: string;
    forbidden: string;
    boardShowFlag: string;
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
interface ReqQueryPopProjectListByPage {
    total: number;
    page: number;
    pageSize: number;
    totalPage: number;
    orderRule: string;
    projectCode: string;
    projectName: string;
    forbidden: string;
    exclusionCodes: string[];
    totalPageValue: number;
}
export type ResQueryPopProjectListByPage = {
    projectId: string; //项目id
    projectCode: string; //项目编号
    projectName: string; //项目名称
    projectGroupId: string; //项目集id
    projectGroupCode: string; //项目集编号
    projectGroupName: string; //项目集名称
    companyId: string; //公司id
    companyName: string; //公司名称
    boardShowFlag: string; //看板显示标识（0不显示，1显示
    forbidden: string; //是否启用 0未启用 1启用
    remark: string; //备注
    createUserName: string; //创建人名称
    createDatetime: string; //创建时间
    modifyUserName: string; //修改人名称
    modifyDatetime: string; //修改时间
};

interface ReqQueryProjectListByPage {
    total: number;
    page: number;
    pageSize: number;
    totalPage: number;
    orderRule: string; //排序规则
    projectCode: string; //项目编号
    projectName: string; //项目名称
    projectGroupCode: string; //项目集编号
    projectGroupName: string; //项目集名称
    companyId: number; //公司id
    forbidden: string; //是否启用 0未启用 1启用
    boardShowFlag: string; //看板显示标识（0不显示，1显示）
    createUserName: string; //创建人名称
    modifyUserName: string; //修改人名称
    createDatetimeStart: string; //创建时间开始
    createDatetimeEnd: string; //创建时间结束
    modifyDatetimeStart: string; //修改时间开始
    modifyDatetimeEnd: string; //修改时间结束
    totalPageValue: number;
    tt?: any;
}

interface ReqAddProject {
    projectCode: string;
    projectName: string; //项目名称
    projectGroupId: number; //项目集id
    companyId: number; //公司id
    boardShowFlag: string; //看板显示标识（0不显示，1显示）
    forbidden: string; //是否启用 0未启用 1启用
    remark: string; //备注
}

//班组
export const useProjectApi = () => {
    const networkApi = useNetworkApi(proxyEnum.tmgc2Production);

    return {
        /**
         * @returns 获取列表
         */
        queryProjectListByPage: (params?: Partial<ReqQueryProjectListByPage>) => {
            return http.post<ResTpfObject<{ list: IReqGetProjectInfoList[] }>>(
                `${networkApi}/project/queryProjectListByPage`,
                params
            );
        },
        /**
         * @returns 编辑
         */
        editProject: (data?: Partial<ReqAddProject>) => {
            return http.put<ResTpfValue<boolean>>(`${networkApi}/project/editProject`, data);
        },
        /**
         * @returns 新增
         */
        addProject: (data?: Partial<ReqAddProject>) => {
            return http.post<ResTpfValue<boolean>>(`${networkApi}/project/addProject`, data);
        },
        /**
         * @returns 检查code是否重复
         */
        checkProjectCode: (params?: { projectCode?: string }) => {
            return http.get<ResTpfValue<boolean>>(`${networkApi}/project/checkProjectCode`, {
                params
            });
        },
        /**
         * @returns 删除
         */
        deleteProjectByIds: (entity: number[]) => {
            return http.post<ResTpfList<Record<string, any>>>(
                `${networkApi}/project/deleteProjectByIds`,
                {
                    ids: entity
                }
            );
        },
        /**
         * @returns 导入
         */
        importProject: (params: { overrideFlag: boolean; fileCode: string }) => {
            return http.get<ResTpfValue>(`${networkApi}/project/importProject`, { params });
        },
        /**
         * @returns 查询单条数据
         */
        getProjectById: (params: { customerSupplierId: string }) => {
            return http.post<ResTpfObject<{ list: IReqGetProjectInfoList[] }>>(
                `${networkApi}/project/getProjectById`,
                params
            );
        },
        /**
         * @returns 批量更新看板显示数据
         */
        editBoardShowByIds: (entity?: { boardShowFlag: string; ids: number[] }) => {
            return http.post(`${networkApi}/project/editBoardShowByIds`, entity);
        },
        /**
         * @returns 弹窗项目查询列表
         */
        queryPopProjectListByPage: (params?: Partial<ReqQueryPopProjectListByPage>) => {
            return http.post<ResTpfObject<{ list: ResQueryPopProjectListByPage[] }>>(
                `${networkApi}/project/queryPopProjectListByPage`,
                params
            );
        }
    };
};
