import { ResTpfList, ResTpfObject, ResTpfValue } from '@/types/axios';
import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';

export interface ResQueryPrintTemplateFields {
    headerList: ResPrint[];
    bodyList: ResPrint[];
}

export interface ResPrint {
    id: number;
    displayOrdinal: number;
    fieldCode: string;
    showName: string;
    fieldType: string;
}

export interface ResGetPrintTemplate {
    id: number;
    tenantId: number;
    printTemplateCode: string; //模板编号
    templateTypeCode: string; //模块模板类型编号
    printTemplateName: string; //模板名称
    canvasJson: string;
    templateVersion: number; //模板版本
    enabled: number;
    defaulet: number;
    createUser?: number;
    createDatetime: string;
    modifyUser?: number;
    modifyDatetime: string;
    list: ResGetPrintTemplate[];
    initialize: number; //是否是默认模板 0是，1否
}

export const useCustomPrintApi = () => {
    const tmgc2Mgt = useNetworkApi(proxyEnum.tmgc2Mgt);
    return {
        /**
         * @returns 查询模版字段
         */
        queryPrintTemplateFields: (params?: { templateTypeCode?: string }) => {
            return http.get<ResTpfObject<ResQueryPrintTemplateFields>>(
                `${tmgc2Mgt}/customPrint/queryPrintTemplateFields`,
                { params }
            );
        },
        /**
         * @returns 创建模版
         */
        createPrintTemplate: (params?: Partial<ResGetPrintTemplate>) => {
            return http.post<ResTpfValue<boolean>>(
                `${tmgc2Mgt}/customPrint/createPrintTemplate`,
                params
            );
        },
        /**
         * @returns 获取打印模板
         */
        getPrintTemplate: (params?: { templateTypeCode?: string; printTemplateName?: string }) => {
            return http.post<ResTpfObject<{ list: ResGetPrintTemplate[] }>>(
                `${tmgc2Mgt}/customPrint/getPrintTemplate`,
                params
            );
        },
        /**
         * @returns 编辑打印模板
         */
        editPrintTemplate: (params?: Partial<ResGetPrintTemplate>) => {
            return http.post<ResTpfValue<boolean>>(
                `${tmgc2Mgt}/customPrint/editPrintTemplate`,
                params
            );
        },
        /**
         * @returns 批量删除模板
         */
        batchDeletedPrintTemplate: (params?: Partial<ResGetPrintTemplate>) => {
            return http.post<ResTpfValue<boolean>>(
                `${tmgc2Mgt}/customPrint/batchDeletedPrintTemplate`,
                params
            );
        }
    };
};
