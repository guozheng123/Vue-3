import { ResTpfList, ResTpfObject } from '@/types/axios';
import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';
type ReqGetDepartmentlist = {
    departmentCode: string;
    lockFlag: string | number;
    departmentName: string;
    pageSize: string | number;
    page: string | number;
    [k: string]: any;
};
export type AddGetDepartmentlist = {
    departmentId: string;
    departmentCode: string;
    lockFlag: string | number;
    departmentName: string;
    parentDepartmentId: string;
    departmentEnName: string;
    remarks: string;
    factoryId: string;
};

export const useDepartmentApi = () => {
    const tmgc2Org = useNetworkApi(proxyEnum.tmgc2Org);

    return {
        /**
         * 获取部门列表
         */

        getDepartmentList: (params?: Partial<ReqGetDepartmentlist>) => {
            return http.post<ResTpfObject<{ list: any[] }>>(
                `${tmgc2Org}/department/getDepartmentList`,
                params
            );
        },
        /**
         * 获取部门树列表
         * @returns
         */
        getDepartmentTreeList: () => {
            return http.get<ResTpfList<any[]>>(`${tmgc2Org}/department/getDepartmentTreeList`);
        },
        /**
         * 获取部门信息详情
         * @returns
         */
        getDepartmentDetails: (params: any) => {
            return http.get(`${tmgc2Org}/department/getDepartmentDetails`, {
                params
            });
        },
        /**
         * 检查部门编号是否重复
         * @returns
         */
        checkDepartmentCodeUnique: (params: any) => {
            return http.post(`${tmgc2Org}/department/checkDepartmentCodeUnique`, params);
        },
        /**
         * 检查部门名称是否重复
         * @returns
         */
        checkDepartmentNameUnique: (params: any) => {
            return http.post(`${tmgc2Org}/department/checkDepartmentNameUnique`, params);
        },
        /**
         * 新增部门
         * @returns
         */
        createDepartment: (params: AddGetDepartmentlist) => {
            return http.post(`${tmgc2Org}/department/createDepartment`, params);
        },
        /**
         * 删除部门
         * @returns
         */
        deleteDepartment: (params: any) => {
            return http.post(`${tmgc2Org}/department/deleteDepartment`, params);
        },
        /**
         * 导出所见列表
         * @returns
         */
        departmentListDerive: (params: any) => {
            return http.post(`${tmgc2Org}/department/departmentListDerive`, params);
        },
        /**
         * 导入部门列表
         * @returns
         */
        departmentListImport: (params: any) => {
            return http.post(`${tmgc2Org}/department/departmentListImport`, params);
        },
        /**
         * 导出部门模板
         * @returns
         */
        getDepartmentTemplate: () => {
            return http.post(`${tmgc2Org}/department/getDepartmentTemplate`);
        },
        /**
         * 修改部门信息
         * @returns
         */
        updateDepartment: (params: any) => {
            return http.put(`${tmgc2Org}/department/updateDepartment`, params);
        }
    };
};
