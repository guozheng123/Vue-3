import http from '@/utils/http';
import type { ResTpfObject } from '@/types/axios';
import { useNetworkApi, proxyEnum } from '@/api';

export type getQuality = {
    qualityInspectionCode: string;
    qualityInspectionName: string;
    createUser: string;
    qualityInspectionAttribute: string;
    startDatetime: string;
    endDatetime: string;
    qualityInspectionId?: any;
};

interface ReqQueryDefectCauseListByPage {
    total: number;
    page: number;
    pageSize: number;
    totalPage: number;
    orderRule: string;
    defectCauseClassifyName: string;
    defectCauseCode: string;
    defectCauseName: string;
    iqcFlag: string;
    ipqcFlag: string;
    fqcFlag: string;
    oqcFlag: string;
    createUser: string;
    modifyUser: string; //修改人
    modifyDateStart: string; //查询修改开始时间
    modifyDateEnd: string; //查询修改结束时间
    createDateStart: string; //创建时间开始
    createDateEnd: string; //创建时间结束
    ids: number[];
    totalPageValue: number;
}

export interface ReqGetQualityInspectionSchemeList {
    total: number;
    page: number;
    pageSize: number;
    totalPage: number;
    qualityInspectionCode: string; //质检项编号
    qualityInspectionName: string; //质检项名称
    qualityInspectionAttribute: string;
    createUser: string; //创建人
    modifyUser: string; //修改人
    modifyDateStart: string; //查询修改开始时间
    modifyDateEnd: string; //查询修改结束时间
    createDateStart: string; //创建时间开始
    createDateEnd: string; //创建时间结束
    ids: number[]; //id集合
    totalPageValue: number;
    createData: any[];
}

interface ResGetQualityInspectionSchemeList {
    total: number;
    page: number;
    pageSize: number;
    totalPage: number;
    inspectionSchemeId: number;
    tenantId: number;
    inspectionSchemeCode: string; //质检方案编号
    inspectionSchemeName: string; //质检方案名称
    deleted: string;
    createUser: string; //创建人
    modifyUser: string; //修改人
    modifyDateStart: string; //查询修改开始时间
    modifyDateEnd: string; //查询修改结束时间
    createDateStart: string; //创建时间开始
    createDateEnd: string; //创建时间结束
    qualityInspectionVos?: any;
}

interface ResQueryDefectCauseClassifyListByPage {
    defectCauseClassifyId: number;
    tenantId: number;
    defectCauseClassifyCode: string;
    defectCauseClassifyName: string;
    deleted: string;
    createUser: string;
    createDatetime: string;
    modifyUser: string;
    modifyDatetime: string;
}

export interface ResQueryDefectCauseListByPage {
    defectCauseId: number;
    tenantId: number;
    defectCauseClassifyId: number;
    defectCauseCode: string;
    defectCauseName: string;
    defectCauseClassifyCode: string;
    defectCauseClassifyName: string;
    iqcFlag: string;
    ipqcFlag: string;
    fqcFlag: string;
    oqcFlag: string;
    deleted: string;
    createUser: string;
    createDatetime: string;
    modifyUser: string;
    modifyDatetime: string;
}

//质量管理
export const useQualityApi = () => {
    const tmgc2Qc = useNetworkApi(proxyEnum.tmgc2Qc);

    return {
        /**
         * 获取质检维护列表
         * @returns
         */
        getQualityInspectionList: (params?: any) => {
            return http.post(`${tmgc2Qc}/qualityInspection/getQualityInspectionList`, params);
        },
        /**
         *
         * @returns 质检维护编辑
         */
        updateQualityInspection: (params: any) => {
            return http.post<any>(`${tmgc2Qc}/qualityInspection/updateQualityInspection`, params);
        },
        /**
         *
         * @returns 质检维护导出
         */
        exportQualityInspectionFileExcelFile: (params: any) => {
            return http.post<any>(
                `${tmgc2Qc}/qualityInspection/exportQualityInspectionFileExcelFile`,
                params
            );
        },

        /**
         *
         * @returns 质检维护导入
         */
        importQualityInspectionFile: (params: any) => {
            return http.get<any>(`${tmgc2Qc}/qualityInspection/importQualityInspectionFile`, {
                params
            });
        },

        /**
         *
         * @returns 质检维护新增
         */
        createQualityInspection: (params: any) => {
            return http.post<any>(`${tmgc2Qc}/qualityInspection/createQualityInspection`, params);
        },
        /**
         *
         * @returns 检验类型编号是否重复
         */
        checkQualityInspectionCodeUnique: (params: any) => {
            return http.post<any>(
                `${tmgc2Qc}/qualityInspection/checkQualityInspectionCodeUnique`,
                params
            );
        },
        /**
         *
         * @returns 删除质检维护项目
         */
        deleteQualityInspection: (params: any) => {
            return http.post<any>(`${tmgc2Qc}/qualityInspection/deleteQualityInspection`, params);
        },
        /**
         *
         * @returns 获取质检类型列表
         */
        getQualityInspectionTypeList: (params: any) => {
            return http.post<any>(
                `${tmgc2Qc}/qualityInspectionType/getQualityInspectionTypeList`,
                params
            );
        },
        /**
         *
         * @returns 质检类型编号是否重复
         */
        checkQualityInspectionTypeCodeUnique: (params: any) => {
            return http.post<any>(
                `${tmgc2Qc}/qualityInspectionType/checkQualityInspectionTypeCodeUnique`,
                params
            );
        },
        /**
         *
         * @returns 质检类型新增
         */
        createQualityInspectionType: (params: any) => {
            return http.post<any>(
                `${tmgc2Qc}/qualityInspectionType/createQualityInspectionType`,
                params
            );
        },
        /**
         *
         * @returns 质检类型删除
         */
        deleteQualityInspectionType: (params: any) => {
            return http.post<any>(
                `${tmgc2Qc}/qualityInspectionType/deleteQualityInspectionType`,
                params
            );
        },
        /**
         *
         * @returns 质检类型编辑
         */
        updateQualityInspectionType: (params: any) => {
            return http.post<any>(
                `${tmgc2Qc}/qualityInspectionType/updateQualityInspectionType`,
                params
            );
        },
        /**
         *
         * @returns 获取质检方案列表
         */
        getQualityInspectionSchemeList: (params?: Partial<ReqGetQualityInspectionSchemeList>) => {
            return http.post<ResTpfObject<{ list: ResGetQualityInspectionSchemeList[] }>>(
                `${tmgc2Qc}/qualityInspectionScheme/getQualityInspectionSchemeList`,
                params
            );
        },
        /**
         *
         * @returns 质检方案编号是否重复
         */
        checkQualityInspectionSchemeCodeUnique: (params: any) => {
            return http.post<any>(
                `${tmgc2Qc}/qualityInspectionScheme/checkQualityInspectionSchemeCodeUnique`,
                params
            );
        },
        /**
         *
         * @returns 新增质检方案
         */
        createQualityInspectionScheme: (params: any) => {
            return http.post<any>(
                `${tmgc2Qc}/qualityInspectionScheme/createQualityInspectionScheme`,
                params
            );
        },
        /**
         *
         * @returns 质检方案删除
         */
        deleteQualityInspectionScheme: (params: any) => {
            return http.post<any>(
                `${tmgc2Qc}/qualityInspectionScheme/deleteQualityInspectionScheme`,
                params
            );
        },
        /**
         *
         * @returns 质检方案查询
         */
        getQualityInspectionSchemeDetails: (params: any) => {
            return http.post<any>(
                `${tmgc2Qc}/qualityInspectionScheme/getQualityInspectionSchemeDetails`,
                params
            );
        },
        /**
         *
         * @returns 质检方案查询
         */
        updateQualityInspectionScheme: (params: any) => {
            return http.post<any>(
                `${tmgc2Qc}/qualityInspectionScheme/updateQualityInspectionScheme`,
                params
            );
        },

        // ******************************************************
        // 缺陷原因分类
        /**
         *
         * @returns 缺陷原因分类列表
         */
        queryDefectCauseClassifyListByPage: (params: any) => {
            return http.post<ResTpfObject<{ list: ResQueryDefectCauseClassifyListByPage[] }>>(
                `${tmgc2Qc}/defectCauseClassify/queryDefectCauseClassifyListByPage`,
                params
            );
        },
        /**
         *
         * @returns 缺陷原因分类新增
         */
        addDefectCauseClassify: (params: any) => {
            return http.post<any>(`${tmgc2Qc}/defectCauseClassify/addDefectCauseClassify`, params);
        },
        /**
         *
         * @returns 缺陷原因分类编辑
         */
        editDefectCauseClassify: (params: any) => {
            return http.put<any>(`${tmgc2Qc}/defectCauseClassify/editDefectCauseClassify`, params);
        },
        /**
         *
         * @returns 校验数据重复
         */
        checkDefectCauseClassifyCode: (params: any) => {
            return http.get<any>(`${tmgc2Qc}/defectCauseClassify/checkDefectCauseClassifyCode`, {
                params
            });
        },
        /**
         *
         * @returns 删除数据
         */
        deleteDefectCauseClassifyByIds: (params: any) => {
            return http.post<any>(
                `${tmgc2Qc}/defectCauseClassify/deleteDefectCauseClassifyByIds`,
                params
            );
        },
        // ******************************************************
        // 缺陷原因模块
        /**
         *
         * @returns 缺陷原因列表
         */
        queryDefectCauseListByPage: (data?: Partial<ReqQueryDefectCauseListByPage>) => {
            return http.post<ResTpfObject<{ list: ResQueryDefectCauseListByPage[] }>>(
                `${tmgc2Qc}/defectCause/queryDefectCauseListByPage`,
                data
            );
        },
        /**
         *
         * @returns 检验数据重复
         */
        checkDefectCauseCode: (params: any) => {
            return http.get<any>(`${tmgc2Qc}/defectCause/checkDefectCauseCode`, { params });
        },
        /**
         *
         * @returns 新增缺陷原因
         */
        addDefectCause: (params: any) => {
            return http.post<any>(`${tmgc2Qc}/defectCause/addDefectCause`, params);
        },
        /**
         *
         * @returns 缺陷原因编辑
         */
        editDefectCause: (params: any) => {
            return http.put<any>(`${tmgc2Qc}/defectCause/editDefectCause`, params);
        },
        /**
         *
         * @returns 导出数据
         */
        exportDefectCauseExcelFile: (params: any) => {
            return http.post<any>(`${tmgc2Qc}/defectCause/exportDefectCauseExcelFile`, params);
        },
        /**
         *
         * @returns 批量删除
         */
        deleteDefectCauseByIds: (params: any) => {
            return http.post<any>(`${tmgc2Qc}/defectCause/deleteDefectCauseByIds`, params);
        },
        /**
         *
         * @returns 导入
         */
        importDefectCause: (params: any) => {
            return http.get<any>(`${tmgc2Qc}/defectCause/importDefectCause`, { params });
        }
    };
};
