export * from './index.d';

import type { ResTpfList, ResTpfObject, ResTpfValue } from '@/types/axios';
import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';
import type { TpfDelInfo } from '@/types';

import type {
    ReqQueryMaterialPopoutListByPage,
    ResGetAccBomInfoList,
    ResQueryMaterialPopoutListByPage,
    IReqGetMaterialDataList,
    IResGetMaterialDataList,
    ReqExportMaterialExcelFile,
    ResQueryMaterialListByPage
} from './index.d';

export const useMaterialApi = () => {
    const tmgc2Material = useNetworkApi(proxyEnum.tmgc2Material);

    return {
        /**
         * 查询物料弹框数据
         * @param params
         * @returns
         */
        queryMaterialPopoutListByPage: (params?: Partial<ReqQueryMaterialPopoutListByPage>) => {
            return http.post<ResTpfObject<{ list: ResQueryMaterialPopoutListByPage[] }>>(
                `${tmgc2Material}/material/queryMaterialPopoutListByPage`,
                params
            );
        },
        /**
         * 查询产品bom父级物料弹框数据
         * @param params
         * @returns
         */

        queryProductBomMaterialByPage: (params?: Partial<ReqQueryMaterialPopoutListByPage>) => {
            return http.post<ResTpfObject<{ list: ResQueryMaterialPopoutListByPage[] }>>(
                `${tmgc2Material}/material/queryProductBomMaterialByPage`,
                params
            );
        },
        /**
         * 查询产品bom子级物料弹框数据
         * @param params
         * @returns
         */

        queryProductBomChildMaterialByPage: (
            params?: Partial<ReqQueryMaterialPopoutListByPage>
        ) => {
            return http.post<ResTpfObject<{ list: ResQueryMaterialPopoutListByPage[] }>>(
                `${tmgc2Material}/material/queryProductBomChildMaterialByPage`,
                params
            );
        },

        /**
         * 查询图纸云物料弹框数据
         * @param params
         * @returns
         */
        getAccBomInfoList: (
            params: Partial<{ bomAccId: string; level: number; filterIds: any[] }>
        ) => {
            return http.post<ResTpfObject<{ list: ResGetAccBomInfoList[] }>>(
                `${tmgc2Material}/material/getAccBomInfoList`,
                params
            );
        },
        /**
         * 删除物料自定义字段
         * @param params
         * @returns
         */
        deleteMaterialDiyFieldByIds: (params: { ids: number[] }) => {
            return http.post<ResTpfList<TpfDelInfo[]>>(
                `${tmgc2Material}/material/deleteMaterialDiyFieldByIds`,
                params
            );
        },
        /**
         * @returns 获取列表
         */
        queryMaterialListByPage: (params?: Partial<IReqGetMaterialDataList>) => {
            return http.post<ResTpfObject<{ list: ResQueryMaterialListByPage[] }>>(
                `${tmgc2Material}/material/queryMaterialListByPage`,
                params
            );
        },
        /**
         * @returns 获取列表
         */
        queryMaterialPopListByPage: (params?: Partial<IReqGetMaterialDataList>) => {
            return http.post<ResTpfObject<{ list: ResQueryMaterialListByPage[] }>>(
                `${tmgc2Material}/material/queryMaterialPopoutListByPage`,
                params
            );
        },
        /**
         * @returns 编辑
         */
        editMaterial: (entity: Partial<IReqGetMaterialDataList>) => {
            return http.put(`${tmgc2Material}/material/editMaterial`, entity);
        },
        /**
         * @returns 新增
         */
        addMaterial: (entity: Partial<IReqGetMaterialDataList>) => {
            return http.post(`${tmgc2Material}/material/addMaterial`, entity);
        },
        /**
         * @returns 检查code是否重复
         */
        checkMaterialCode: (params?: { materialCode: string }) => {
            return http.get(`${tmgc2Material}/material/checkMaterialCode`, { params });
        },
        /**
         * @returns 批量删除
         */
        deleteMaterialByIds: (entity: number[]) => {
            return http.post(`${tmgc2Material}/material/deleteMaterialByIds`, {
                ids: entity
            });
        },
        /**
         * @returns 导入
         */
        importMaterial: (params: { overrideFlag: boolean; fileCode: string }) => {
            return http.get<ResTpfValue>(`${tmgc2Material}/material/importMaterial`, {
                params: params
            });
        },
        /**
         * @returns 导出
         */
        exportMaterialExcelFile: (data: Partial<ReqExportMaterialExcelFile>) => {
            return http.post(`${tmgc2Material}/material/exportMaterialExcelFile`, data);
        },
        /**
         * @returns 查询单条数据
         */
        getMaterialById: (params: { id: string }) => {
            return http.get<ResTpfObject<IResGetMaterialDataList>>(
                `${tmgc2Material}/material/getMaterialById`,
                { params: params }
            );
        },
        // /**
        //  * @returns 删除
        //  */
        // deleteMaterialById: (entity: number) => {
        //     return http.delete(`${tmgc2Material}/material/deleteMaterialById`, {
        //         id: entity
        //     });
        // },
        /**
         * @returns 查询打印数据
         */
        getMaterialPrint: (entity: number[]) => {
            return http.post(`${tmgc2Material}/material/getMaterialPrint`, {
                ids: entity
            });
        },
        /**
         * @returns 查询辅助单位
         */
        getMaterialProductUnitList: (params: { materialCode?: string; enable?: number }) => {
            return http.get<any>(`${tmgc2Material}/material/getMaterialProductUnitList`, {
                params: params
            });
        },
        /**
         * @returns 新增物料类型缺陷原因数据
         */
        addMaterialTypeCause: (params: any) => {
            return http.post(`${tmgc2Material}/materialType/addMaterialTypeCause`, params);
        },

        /**
         * @returns 删除物料类型缺陷原因数据
         */
        //

        // deleteMaterialTypeCause: (params: any) => {
        //     return http.delete(`${tmgc2Material}/materialType/deleteMaterialTypeCause`, { params });
        // }

        deleteMaterialTypeCause: (data: { ids: string[] }) => {
            return http.delete(`${tmgc2Material}/materialType/deleteMaterialTypeCause`, {
                data
            });
        },
        /**
         *
         * @param data 查询物料类型缺陷数据
         * @returns
         */
        queryMaterialTypeCauseList: (data: any) => {
            return http.post(`${tmgc2Material}/materialType/queryMaterialTypeCauseList`, data);
        }
    };
};
