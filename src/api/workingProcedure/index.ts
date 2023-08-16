import type { ResTpfObject, ResTpfList, ResTpfValue } from '@/types/axios';
import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';

const networkApi = useNetworkApi(proxyEnum.tmgc2Process);
const tmgc2Org = useNetworkApi(proxyEnum.tmgc2Org);
const tmgc2Qc = useNetworkApi(proxyEnum.tmgc2Qc);

export type IResGetWorkingProcedureList = {
    operationCode: string; //工序编号
    operationName: string; //工序名称
    operationTypeCode: string; //工序类型
    createUser: string; //创建用户
    workUnitTypeCode: string; //作业单元类型编号
    forbidden: string; //是否禁用
    remark: string; //备注
};

export type QueryWorkUnitListByPageList = {
    workUnitCode: string; //作业单元编号
    workUnitName: string; //作业单元名称
    workUnitTypeCode: string; //作业单元类型编号
    workUnitTypeName: string; //作业单元类型名称
    workshopId: string; //车间id
    status: string; //状态
    createUser: string; //创建人
    createDatetimeStart: string; //创建时间开始
    createDatetimeEnd: string; //创建时间结束
    [k: string]: any;
    pageSize: number;
    page: number;
};

type ReqQueryProcessListByPage = {
    page: number;
    pageSize: number;
    processCode: string;
    processName: string;
    processVersion: number;
    releaseFlag: string; //发布标志 0未发布 1发布
    enable: string; //是否启用 0否 1是
    latestVersionFlag: string | number; //最新版本 0否 1是
    createDateStart: string; //创建日期开始
    createDateEnd: string; //创建日期结束
};

type ReqQueryPopProcessListByPage = {
    page: number;
    pageSize: number;
    processCode: string; //工艺编号
    processName: string; //工艺名称
    orderRule: string; //排序规则
    exclusionCodes: string[]; //需排除的Code列表
};

type ResQueryPopProcessListByPage = {
    processId: number;
    processCode: string;
    processName: string;
    processVersion: number;
    companyCode: string;
    factoryCode: string;
    releaseFlag: string;
    enable: string;
    createUser: string;
    createDatetime: string;
    createUserName: string;
};

interface ReqQueryWorkUnitListByPage {
    total: number;
    page: number;
    pageSize: number;
    totalPage: number;
    workUnitCode: string;
    workUnitName: string;
    workUnitTypeCode: string;
    workUnitTypeName: string;
    workshopId: number;
    status: string;
    createUser: string;
    createDatetimeStart: string;
    createDatetimeEnd: string;
    ids: number[];
    tableHeaderConfig: TableHeaderConfig[];
    totalPageValue: number;
}

interface TableHeaderConfig {
    title: string;
    dataIndex: string;
}

interface ResQueryProcessListByPage {
    processId: number;
    processCode: string;
    processName: string;
    processVersion: number;
    companyCode?: any;
    factoryCode: string;
    releaseFlag: string;
    enable: string;
    createUser: string;
    createDatetime: string;
    createUserName: string;
    modifyUser: string;
    modifyUserName: string;
    modifyDatetime: string;
    versions?: any;
}

export const useWorkingProcedure = () => {
    return {
        /**
         * 查询列表
         * @param params
         * @returns
         */
        queryOperationInfoListByPage: (params: any) => {
            return http.post<ResTpfObject<{ list: any[] }>>(
                `${networkApi}/operationInfo/queryOperationInfoListByPage`,
                params
            );
        },
        /**
         * 新增数据
         * @param params
         * @returns
         */
        addOperationInfo: (params: any) => {
            return http.post(`${networkApi}/operationInfo/addOperationInfo`, params);
        },
        /**
         * 查询单条数据 工序
         * @param params
         * @returns
         */
        getOperationInfoById: (params: any) => {
            return http.get<ResTpfObject<any>>(`${networkApi}/operationInfo/getOperationInfoById`, {
                params
            });
        },

        /**
         * 查询单条数据 作业工单--> 工艺
         * @param params
         * @returns
         */
        runtimeOperationInfo: (params: any) => {
            return http.get<ResTpfObject<any>>(
                `${networkApi}/runtimeOperationInfo/getOperationInfoById`,
                {
                    params
                }
            );
        },
        /**
         * 编辑数据
         * @param params
         * @returns
         */
        editOperationInfo: (params: any) => {
            return http.put(`${networkApi}/operationInfo/editOperationInfo`, params);
        },

        /**
         * 导入数据
         * @param params
         * @returns
         */
        importOperationInfo: (params: any) => {
            return http.get(`${networkApi}/operationInfo/importOperationInfo`, {
                params
            });
        },
        /**
         * 导出数据
         * @param params
         * @returns
         */
        exportOperationInfoExcelFile: (params: any) => {
            return http.post(`${networkApi}/operationInfo/exportOperationInfoExcelFile`, params);
        },

        /**
         * 下载模板
         */
        downloadStoreLocationTemplate: () => {
            return http.post(`${networkApi}/warehouse/downloadStoreLocationTemplate`);
        },

        /**
         * 删除
         * @param params
         * @returns
         */
        deleteOperationInfoById: (params: any) => {
            return http.post(`${networkApi}/operationInfo/deleteOperationInfoByIds`, params);
        },
        /**
         * 校验数据重复
         * @param params
         * @returns
         */
        checkOperationInfoCode: (params: { operationInfoCode: string }) => {
            return http.get(`${networkApi}/operationInfo/checkOperationInfoCode`, {
                params
            });
        },
        /**
         *
         * @returns 获取质检类型列表
         */
        getQualityInspectionTypeList: (params?: any) => {
            return http.post<any>(
                `${tmgc2Qc}/qualityInspectionType/getQualityInspectionTypeList`,
                params
            );
        },
        /**
         *
         * @returns 获取质检方案列表
         */
        getQualityInspectionSchemeList: (params?: any) => {
            return http.post<any>(
                `${tmgc2Qc}/qualityInspectionScheme/getQualityInspectionSchemeList`,
                params
            );
        },
        //===================================================================================================
        //===================================================================================================
        //===================================================================================================
        //===================================================================================================
        //===================================================================================================
        //===================================================================================================
        /**
         * 作业单元
         */

        /**
         * 编辑数据
         * @param params
         * @returns
         */
        editWorkUnit: (params?: any) => {
            return http.put(`${networkApi}/workUnit/editWorkUnit`, params);
        },
        /**
         * 查询列表
         * @param params
         * @returns
         */
        queryWorkUnitListByPage: (params?: Partial<ReqQueryWorkUnitListByPage>) => {
            return http.post<ResTpfObject<{ list: QueryWorkUnitListByPageList[] }>>(
                `${networkApi}/workUnit/queryWorkUnitListByPage`,
                params
            );
        },

        /**
         * 查询列表 选择作业单元
         * @param params
         * @returns
         */
        queryWorkUnitList: (params?: Partial<ReqQueryWorkUnitListByPage>) => {
            return http.post<ResTpfObject<{ list: QueryWorkUnitListByPageList[] }>>(
                `${networkApi}/workUnit/queryWorkUnitList`,
                params
            );
        },

        /**
         * 导出数据
         */
        exportWorkUnitExcelFile: (params?: any) => {
            return http.post(`${networkApi}/workUnit/exportWorkUnitExcelFile`, params);
        },

        /**
         * 批量删除数据
         */
        deleteWorkUnitByIds: (params?: any) => {
            return http.post(`${networkApi}/workUnit/deleteWorkUnitByIds`, params);
        },
        /**
         * 打印
         */
        getWorkUnitPrint: (params?: any) => {
            return http.post(`${networkApi}/workUnit/getWorkUnitPrint`, params);
        },
        /**
         * 新增
         */
        addWorkUnit: (params?: any) => {
            return http.post<ResTpfValue>(`${networkApi}/workUnit/addWorkUnit`, params);
        },
        /**
         * 导入
         */
        importWorkUnit: (params?: any) => {
            return http.get(`${networkApi}/workUnit/importWorkUnit`, {
                params
            });
        },
        /**
         * 查询单条数据
         */
        getWorkUnitById: (params?: any) => {
            return http.get<ResTpfObject<any>>(`${networkApi}/workUnit/getWorkUnitById`, {
                params
            });
        },
        /**
         * 校验数据重复
         */
        checkWorkUnitCode: (params?: any) => {
            return http.get<ResTpfValue>(`${networkApi}/workUnit/checkWorkUnitCode`, {
                params
            });
        },
        //===================================================================================================
        //===================================================================================================
        //===================================================================================================
        //===================================================================================================
        //===================================================================================================
        //===================================================================================================
        /**
         * 作业单元类型
         */
        /**
         * 编辑数据
         */
        editWorkUnitType: (params?: any) => {
            return http.put<ResTpfValue>(`${networkApi}/workUnitType/editWorkUnitType`, params);
        },
        /**
         * 查询列表
         */
        queryWorkUnitTypeListByPage: (params?: any) => {
            return http.post<ResTpfObject<{ list: any[] }>>(
                `${networkApi}/workUnitType/queryWorkUnitTypeListByPage`,
                params
            );
        },
        /**
         * 导出数据
         */
        exportWorkUnitTypeExcelFile: (params?: any) => {
            return http.post(`${networkApi}/workUnitType/exportWorkUnitTypeExcelFile`, params);
        },
        /**
         * 批量删除数据
         */
        deleteWorkUnitTypeByIds: (params?: any) => {
            return http.post(`${networkApi}/workUnitType/deleteWorkUnitTypeByIds`, params);
        },
        /**
         * 新增数据
         */
        addWorkUnitType: (params?: any) => {
            return http.post<ResTpfValue>(`${networkApi}/workUnitType/addWorkUnitType`, params);
        },
        /**
         * 导入数据
         */
        importWorkUnitType: (params?: any) => {
            return http.get(`${networkApi}/workUnitType/importWorkUnitType`, {
                params
            });
        },
        /**
         * 查询单条数据
         */
        getWorkUnitTypeById: (params?: { workUnitTypeId: any }) => {
            return http.get<ResTpfObject<any>>(`${networkApi}/workUnitType/getWorkUnitTypeById`, {
                params
            });
        },
        /**
         * 效验数据重复
         */
        checkWorkUnitTypeCode: (params?: any) => {
            return http.get(`${networkApi}/workUnitType/checkWorkUnitTypeCode`, { params });
        },
        //===================================================================================================
        //===================================================================================================
        //===================================================================================================
        //===================================================================================================
        //===================================================================================================
        //===================================================================================================
        /**
         * 工艺表
         */
        /**
         * 编辑数据
         * @param params
         * @returns
         */
        editProcess: (params?: any) => {
            return http.put(`${networkApi}/process/editProcess`, params);
        },
        /**
         * 查询列表
         * @param params
         * @returns
         */
        // queryProcessListByPage: (params?: any) => {
        //     return http.post(`${networkApi}/process/queryProcessListByPage`, params);
        // },

        queryProcessListByPage: (params?: Partial<ReqQueryProcessListByPage>) => {
            return http.post<ResTpfObject<{ list: ResQueryProcessListByPage[] }>>(
                `${networkApi}/process/queryProcessListByPage`,
                params
            );
        },
        /**
         * 查询列表 - 包含排除
         * @param params
         * @returns
         */
        queryPopProcessListByPage: (params?: Partial<ReqQueryPopProcessListByPage>) => {
            return http.post<ResTpfObject<{ list: ResQueryPopProcessListByPage[] }>>(
                `${networkApi}/process/queryPopProcessListByPage`,
                params
            );
        },

        /**
         * 导出数据
         * @param params
         * @returns
         */
        exportProcessExcelFile: (params?: any) => {
            return http.post(`${networkApi}/process/exportProcessExcelFile`, params);
        },
        /**
         * 批量删除
         * @param params
         * @returns
         */
        deleteProcessByIds: (params?: any) => {
            return http.post(`${networkApi}/process/deleteProcessByIds`, params);
        },
        /**
         * 新增数据
         * @param params
         * @returns
         */
        addProcess: (params?: any) => {
            return http.post(`${networkApi}/process/addProcess`, params);
        },
        /**
         * 导入
         * @param params
         * @returns
         */
        importProcess: (params?: any) => {
            return http.post(`${networkApi}/process/importProcess`, params);
        },

        /**
         * 校验数据重复
         * @param params
         * @returns
         */
        checkProcessCode: (params?: { processCode: string }) => {
            return http.get<ResTpfValue>(`${networkApi}/process/checkProcessCode`, { params });
        },
        /**
         * 获取公司-工厂树形列表
         */
        getFactoryList: (params?: any) => {
            return http.get(`${tmgc2Org}/factory/getFactoryList`, params);
        },
        /**
         * 获取公司-工厂树型列表
         */
        getCompanyFactoryTreeList: () => {
            return http.get<ResTpfList<any[]>>(`${tmgc2Org}/factory/getCompanyFactoryTreeList`);
        },
        /**
         * 获取工厂-车间树形列表
         */
        getWorkshopList: () => {
            return http.get<ResTpfList<any>>(`${tmgc2Org}/workshop/getWorkshopList`);
        },
        /**
         * 查询单条数据
         * @param params
         * @returns
         */
        getProcessById: (params?: { processId: string | any }) => {
            return http.get(`${networkApi}/process/getProcessById`, {
                params
            });
        },

        /**
         * 查询复制单条数据
         * @param params
         * @returns
         */
        getCopyProcessById: (params?: { processId: string | any }) => {
            return http.get(`${networkApi}/process/getCopyProcessById`, {
                params
            });
        },
        /**
         * 查询升级单条数据
         * @param params
         * @returns
         */
        getUpgradeProcessById: (params?: { processId: string | any }) => {
            return http.get(`${networkApi}/process/getUpgradeProcessById`, {
                params
            });
        },

        /**
         * 批量发布启用工艺
         * @param params
         * @returns
         */
        releaseProcessByIds: (params?: { ids: string[]; enable: '' }) => {
            return http.post<ResTpfValue>(`${networkApi}/process/releaseProcessByIds`, params);
        },

        /**
         * 批量启用禁用工艺
         * @param params
         * @returns
         */
        disableEnableProcessByIds: (params?: { ids: string[] }) => {
            return http.post<ResTpfValue>(
                `${networkApi}/process/disableEnableProcessByIds`,
                params
            );
        },
        /**
         * 编辑工艺下的数据
         * @param params
         * @returns
         */
        editOperationInfoForProcess: (params: any) => {
            return http.put(`${networkApi}/operationInfo/editOperationInfoForProcess`, params);
        }
    };
};
