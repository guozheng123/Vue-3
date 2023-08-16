import { ResTpfList, ResTpfObject, ResTpfValue } from '@/types/axios';
import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';

export interface ResQueryUserListByParam {
    userId: string;
    tenantId: number;
    userName: string;
    userAccount: string;
    userCode: any;
    userText: string;
    enterpriseId: string;
    enterpriseName: string;
    serialNo: string;
    fromDate: string;
    toDate: string;
    mobile: string;
    email: string;
    employeeNo: string;
    departmentId: number;
    receiveSmsFlag: number;
    receiveMailFlag: number;
    remark: string;
    address: string;
    position: string;
    birthDate: string;
    sex: string;
    photo: string;
    lockFlag: number;
    systemFlag: number;
    sourceFlag: number;
    deleted: string;
    languageCode: string;
    timeZoneCode: string;
    roleNames: any;
    departmentName: string;
    limitStatus: any;
    roleList: any;
    postList: any;
    workingTeamList: any;
    printInfo: any;
    createUser: number;
    createDateTime: any;
    modifyUser: number;
    modifyDateTime: any;
    createUserName: any;
    modifyUserName: any;
}

export const useUserApi = () => {
    const tmgc2Org = useNetworkApi(proxyEnum.tmgc2Org);

    return {
        /**
         * 重置密码
         */
        resetPassword: (params: { userId: string }) => {
            return http.post<ResTpfValue<boolean>>(
                `${tmgc2Org}/user/resetPassword`,
                {},
                { params }
            );
        },

        /**
         * 根据条件查询用户列表
         */
        queryUserPageByParam: (params: any) => {
            return http.post<ResTpfObject<{ list: any[] }>>(
                `${tmgc2Org}/user/queryUserPageByParam`,
                params
            );
        },
        /**
         * 获取打印查询用户列表
         */
        queryPrintUserList: (params: any) => {
            return http.post(`${tmgc2Org}/user/queryPrintUserList`, params);
        },
        /**
         * 删除用户
         */
        deleteUser: (params: any) => {
            return http.post(`${tmgc2Org}/user/deleteUser`, params);
        },
        /**
         * 新增或者更新用户信息
         */
        createUpdateUser: (params: any) => {
            return http.post<ResTpfValue>(`${tmgc2Org}/user/createUpdateUser`, params);
        },
        /**
         * 校验用户账号
         */
        checkUserAccount: (params: { userAccount: string; userId: any | string }) => {
            return http.post<ResTpfValue>(`${tmgc2Org}/user/checkUserAccount`, params);
        },
        /**
         * 校验手机号
         */
        checkMobile: (params: { mobile: string; userId: any | number }) => {
            return http.post<ResTpfValue>(`${tmgc2Org}/user/checkMobile`, params);
        },
        /**
         * 校验员工工号
         */
        checkEmployeeNo: (params: { employeeNo: string; userId: any | string }) => {
            return http.post(`${tmgc2Org}/user/checkEmployeeNo`, params);
        },
        /**
         * 根据id获取用户信息
         */
        getLoginUserById: (params: any) => {
            return http.get<ResTpfObject<{ tpfUser: { [k: string]: any } }>>(
                `${tmgc2Org}/user/getLoginUserById`,
                { params }
            );
        },
        /**
         * 查询单条数据
         */
        getUserById: (params: { userId: string | any }) => {
            return http.get(`${tmgc2Org}/user/getUserById`, { params });
        },
        /**



        /**
         * @returns 导出
         */
        exportUser: (params: any) => {
            return http.post(`${tmgc2Org}/user/exportUser`, params);
        },

        /**
         * 导入
         */
        importUser: (params: any) => {
            return http.post(`${tmgc2Org}/user/importUser`, {}, { params });
        },

        /**
         * 根据角色查询用户信息
         */
        queryRoleUserListByParam: (params: any) => {
            return http.post(`${tmgc2Org}/user/queryRoleUserListByParam`, params);
        },
        /**
         * 根据条件查询用户列表
         */
        queryUserListByParam: (params: Record<string, any> = {}) => {
            return http.post<ResTpfList<ResQueryUserListByParam[]>>(
                `${tmgc2Org}/user/queryUserListByParam`,
                params
            );
        }
    };
};
