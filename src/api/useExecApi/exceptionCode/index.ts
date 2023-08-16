import { ResTpfObject, ResTpfValue } from '@/types/axios';
import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';
export interface ReqQueryExceptionCodeByPage {
    page: number;
    pageSize: number;
    orderRule: string; // 排序规则
    tenantId: number; // 租户id
    exceptionCode: string; // 异常编码
    pauseReason: string; // 停产原因
    exceptionType: string; // 异常类型
    report: string; // 是否上报
    available: string; // 是否可用
    modifyDatetime: string; // 修改时间
    createDatetimeStart: string; // 创建时间开始
    createDatetimeEnd: string; // 创建时间结束
    modifyDatetimeStart: string; // 修改时间开始
}

interface ResGetMaterialBaseList {
    id: number; //自增id
    exceptionCode: string; //生产异常编号
    pauseReason: string; //停产原因
    exceptionType: string; //异常类型
    report: string; //是否上报
    available: string; //是否可用
    remark: string; // 备注
    createUser: number; //创建人
    createDatetime: string; // 创建时间
    createUserName: string; // 创建人名称
}
interface ReqGetDeleteIDs {
    ids: number[];
}
interface ReqGetSaveData {
    id: number;
    exceptionCode: string; // 生产异常编号
    pauseReason: string; // 停产原因
    exceptionType: string; // 异常类型
    report: string; // 是否上报
    available: string; // 是否可用
    remark: string; // 备注
}
// 生产异常类型
export const useExceptionCodeAPi = () => {
    const tmgc2OExec = useNetworkApi(proxyEnum.tmgc2OExec);

    return {
        /**
         * @return 生产异常类型列表
         */
        queryExceptionCodeByPage: (params?: Partial<ReqQueryExceptionCodeByPage>) => {
            return http.post<ResTpfObject<{ list: ResGetMaterialBaseList[] }>>(
                `${tmgc2OExec}/exceptionCode/queryExceptionCodeByPage`,
                params
            );
        },
        /**
         * @return 生产异常类型删除
         */
        deleteExceptionCodeById: (params?: Partial<ReqGetDeleteIDs>) => {
            return http.post<ResTpfValue>(
                `${tmgc2OExec}/exceptionCode/deleteExceptionCodeById`,
                params
            );
        },
        /**
         * @return 生产异常类型校验是否重复
         */
        checkExceptionType: (params: { exceptionType: string }) => {
            return http.get<ResTpfValue>(`${tmgc2OExec}/exceptionCode/checkExceptionType`, {
                params
            });
        },
        /**
         * @return 生产异常编码校验是否重复
         */
        checkExceptionCode: (params: { exceptionCode: string }) => {
            return http.get<ResTpfValue>(`${tmgc2OExec}/exceptionCode/checkExceptionCode`, {
                params
            });
        },
        /**
         * @return 生产异常类型保存
         */
        saveExceptionCode: (params?: Partial<ReqGetSaveData>) => {
            return http.post<ResTpfValue>(`${tmgc2OExec}/exceptionCode/saveExceptionCode`, params);
        },
        /**
         * @return 生产异常类型编辑保存
         */
        editExceptionCodeById: (params?: Partial<ReqGetSaveData>) => {
            return http.post<ResTpfValue>(
                `${tmgc2OExec}/exceptionCode/editExceptionCodeById`,
                params
            );
        }
    };
};
