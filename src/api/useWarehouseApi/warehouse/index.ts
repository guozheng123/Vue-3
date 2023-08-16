export * from './index.d';
import type {
    MoveType,
    ReqGetTableList,
    ResGetOutInStoreDetailList,
    ResGetPositionDataList,
    ResGetStoreLocationDataList,
    ReqGetStoreInfoPageByParamList,
    ResGetQueryStoreInfoPageByParamList,
    ReqExportStoreInfoParamList,
    ReqGetQueryStoreAlertPageByParamList,
    ResGetQueryStoreAlertPageByParamList,
    ResExportMaterialInStore,
    MaterialStorePopRespDtos,
    ArriveList,
    ReqQueryExecute,
    MaterialReturn,
    ReqQueryPopMaterialArrivalData,
    ReqConfirmMoveStore,
    ResQueryPositionListByParam
} from './index.d';

import type { ResTpfObject, ResTpfValue, ResTpfList } from '@/types/axios';
import { useNetworkApi, proxyEnum } from '@/api';
import http from '@/utils/http';
interface ReqGetConfirmCompleteInStoreObject {
    positionCode: string;
    storeLocationCode: string;
    id: any[];
}

//集团
export const useWarehouseApi = () => {
    const tmgc2Warehouse = useNetworkApi(proxyEnum.tmgc2Warehouse);

    return {
        //移动类型-

        /**
         * @returns 移动类型列表
         */

        queryMoveTypeByParam: (params: any) => {
            return http.post<ResTpfObject<{ list: MoveType[] }>>(
                `${tmgc2Warehouse}/warehouse/queryMoveTypeByParam`,
                params
            );
        },
        /**
         * 删除移动类型
         */
        deleteMoveType: (params: any) => {
            return http.post<ResTpfObject<any>>(
                `${tmgc2Warehouse}/warehouse/deleteMoveType`,
                {},
                {
                    params
                }
            );
        },
        /**
         * 新增/编辑移动类型
         */
        createUpdateMoveType: (params: any) => {
            return http.post<ResTpfValue>(
                `${tmgc2Warehouse}/warehouse/createUpdateMoveType`,
                params
            );
        },

        //仓位类型        //----------------------------------------------------------------------------------------
        /**
         * 删除仓位类型
         */
        deletePositionType: (params: any) => {
            return http.post<any>(
                `${tmgc2Warehouse}/warehouse/deletePositionType`,
                {},
                {
                    params
                }
            );
        },
        /**
         * 新增或更新仓位类型
         */
        createUpdatePositionType: (params: any) => {
            return http.post<ResTpfValue>(
                `${tmgc2Warehouse}/warehouse/createUpdatePositionType`,
                params
            );
        },
        /**
         * 仓位类型列表
         */
        queryPositionTypeByParam: (params: any) => {
            return http.post<ResTpfObject<{ list: any[] }>>(
                `${tmgc2Warehouse}/warehouse/queryPositionTypeByParam`,
                params
            );
        },

        //仓位设置//----------------------------------------------------------------------------------------

        /**
         * 仓位设置列表
         */
        queryPositionByParam: (params: any) => {
            return http.post<ResTpfObject<{ list: any[] }>>(
                `${tmgc2Warehouse}/warehouse/queryPositionByParam`,
                params
            );
        },
        /**
         * 仓位设置列表
         */
        createUpdatePosition: (params: any) => {
            return http.post<ResTpfObject<any>>(
                `${tmgc2Warehouse}/warehouse/createUpdatePosition`,
                params
            );
        },

        /**
         * 删除仓位设置
         */
        deletePosition: (params: any) => {
            return http.post<any>(
                `${tmgc2Warehouse}/warehouse/deletePosition`,
                {},
                {
                    params
                }
            );
        },

        /**
         * 导出仓位
         */
        exportPosition: (params: any) => {
            return http.post(`${tmgc2Warehouse}/warehouse/exportPosition`, params);
        },
        //库位设置
        //-----------------------------------------------------------------------------------------------------------------------
        /**
         * 库位列表
         */

        queryStoreLocationByParam: (params: any) => {
            return http.post<ResTpfObject<{ list: any }>>(
                `${tmgc2Warehouse}/warehouse/queryStoreLocationByParam`,
                params
            );
        },

        /**
         * 新增或者编辑库位列表
         */

        createUpdateStoreLocation: (params: any) => {
            return http.post<ResTpfObject<any>>(
                `${tmgc2Warehouse}/warehouse/createUpdateStoreLocation`,
                params
            );
        },
        /**
         * 删除库位设置
         */
        deleteStoreLocation: (params: any) => {
            return http.post(
                `${tmgc2Warehouse}/warehouse/deleteStoreLocation`,
                {},
                {
                    params
                }
            );
        },

        /**
         * 导入库位设置
         */
        importStoreLocation: (params: any) => {
            return http.post(`${tmgc2Warehouse}/warehouse/importStoreLocation`, {}, { params });
        },

        /**
         * 导出库位设置
         */
        exportStoreLocation: (params: any) => {
            return http.post(`${tmgc2Warehouse}/warehouse/exportStoreLocation`, params);
        },

        /**
         * 下载模板
         */
        downloadStoreLocationTemplate: () => {
            return http.post(`${tmgc2Warehouse}/warehouse/downloadStoreLocationTemplate`);
        },

        /**
         * 仓位列表
         */
        queryPositionListByParam: (params: any = {}) => {
            return http.post<ResTpfList<ResQueryPositionListByParam[]>>(
                `${tmgc2Warehouse}/warehouse/queryPositionListByParam`,
                params
            );
        },
        /**
         * 移动类型-移动类型代码检验
         */
        checkMoveTypeCode: (params: any) => {
            return http.post<ResTpfValue>(
                `${tmgc2Warehouse}/warehouse/checkMoveTypeCode`,
                {},
                { params }
            );
        },

        /**
         * 移动类型-移动类型代码检验
         */
        checkMoveTypeName: (params: any) => {
            return http.post<ResTpfValue>(
                `${tmgc2Warehouse}/warehouse/checkMoveTypeName`,
                {},
                { params }
            );
        },
        /**
         * 仓位设置-仓位代码检验
         */
        checkPositionCode: (params: any) => {
            return http.post(`${tmgc2Warehouse}/warehouse/checkPositionCode`, {}, { params });
        },
        /**
         * 仓位设置-仓位代码检验
         */
        checkPositionName: (params: any) => {
            return http.post(`${tmgc2Warehouse}/warehouse/checkPositionName`, {}, { params });
        },
        /**
         * 仓位类型-仓位类型代码
         */
        checkPositionTypeCode: (params: any) => {
            return http.post<ResTpfValue>(
                `${tmgc2Warehouse}/warehouse/checkPositionTypeCode`,
                {},
                { params }
            );
        },
        /**
         * 仓位类型-仓位类型
         */
        checkPositionTypeName: (params: any) => {
            return http.post<ResTpfValue>(
                `${tmgc2Warehouse}/warehouse/checkPositionTypeName`,
                {},
                { params }
            );
        },
        /**
         * 库位设置-库位代码
         */
        checkStoreLocationCode: (params: any) => {
            return http.post(`${tmgc2Warehouse}/warehouse/checkStoreLocationCode`, {}, { params });
        },
        /**
         * 库位设置-库位名称
         */
        checkStoreLocationName: (params: any) => {
            return http.post(`${tmgc2Warehouse}/warehouse/checkStoreLocationName`, {}, { params });
        },
        /**
         * 出入库明细查询
         */
        queryOutInStoreDetailPageByParam: (params?: Partial<ReqGetTableList>) => {
            return http.post<ResTpfObject<{ list: ResGetOutInStoreDetailList[] }>>(
                `${tmgc2Warehouse}/warehouse/queryOutInStoreDetailPageByParam`,
                params
            );
        },
        /**
         * 导出出入库明细
         */
        exportOutInStoreDetail: (params?: Partial<ReqGetTableList>) => {
            return http.post<ResTpfValue>(
                `${tmgc2Warehouse}/warehouse/exportOutInStoreDetail`,
                params
            );
        },
        /**
         * 获取仓位数据
         */
        getPositionDataList: () => {
            return http.get<ResTpfList<ResGetPositionDataList[]>>(
                `${tmgc2Warehouse}/warehouse/getPositionDataList`
            );
        },
        /**
         * 获取库位数据
         */
        getStoreLocationDataList: (params?: { positionCode: string }) => {
            return http.get<ResTpfList<ResGetStoreLocationDataList[]>>(
                `${tmgc2Warehouse}/warehouse/getStoreLocationDataList`,
                { params }
            );
        },
        /**
         * 库存报表列表
         */
        getQueryStoreInfoPageByParam: (params?: Partial<ReqGetStoreInfoPageByParamList>) => {
            return http.post<ResTpfObject<{ list: ResGetQueryStoreInfoPageByParamList[] }>>(
                `${tmgc2Warehouse}/warehouse/queryStoreInfoPageByParam`,
                params
            );
        },
        /**
         * 库存报表导出
         */
        exportStoreInfo: (params?: Partial<ReqExportStoreInfoParamList>) => {
            return http.post<any>(`${tmgc2Warehouse}/warehouse/exportStoreInfo`, params);
        },
        /**
         * 库存预警列表
         */
        getQueryStoreAlertPageByParam: (params?: Partial<ReqGetQueryStoreAlertPageByParamList>) => {
            return http.post<ResTpfObject<{ list: ResGetQueryStoreAlertPageByParamList[] }>>(
                `${tmgc2Warehouse}/warehouse/queryStoreAlertPageByParam`,
                params
            );
        },
        /**
         * 库存预警导出
         */
        exportStoreAlert: (params?: Partial<ReqExportStoreInfoParamList>) => {
            return http.post<any>(`${tmgc2Warehouse}/warehouse/exportStoreAlert`, params);
        },
        /**
         * 物料到货单 待提交 新增保存 / 提交 ReqAddToBeSubmittedManifestParamList
         */
        addToBeSubmittedManifest: (params?: any) => {
            return http.post<any>(`${tmgc2Warehouse}/warehouse/addToBeSubmittedManifest`, params);
        },
        /**
         * 物料到货单 待提交 编辑保存 / 提交 ReqAddToBeSubmittedManifestParamList
         */
        addSubmitMaterialData: (params?: any) => {
            return http.post<any>(`${tmgc2Warehouse}/warehouse/addSubmitMaterialData`, params);
        },
        /**
         * 物料到货单 待提交 列表删除
         */
        deleteToBeSubmittedData: (params?: any) => {
            return http.delete<any>(`${tmgc2Warehouse}/warehouse/deleteToBeSubmittedData`, {
                data: params
            });
        },
        /**
         * 物料到货单 待提交 编辑 物料删除
         */
        deleteMaterialArrivalDetails: (params?: any) => {
            return http.delete<any>(`${tmgc2Warehouse}/warehouse/deleteMaterialArrivalDetails`, {
                data: params
            });
        },
        /**
         * 物料到货单 待提交 批量提交
         */
        batchSubmitData: (params?: any) => {
            return http.post<any>(`${tmgc2Warehouse}/warehouse/batchSubmitData`, params);
        },
        /**
         * 物料到货单 待提交 编辑
         */
        queryMaterialArrivalToEdit: (params?: any) => {
            return http.get<any>(`${tmgc2Warehouse}/warehouse/queryMaterialArrivalToEdit`, {
                params
            });
        },
        /**
         * 物料到货单 详情
         */
        queryMaterialDetailData: (params?: any) => {
            return http.get<any>(`${tmgc2Warehouse}/warehouse/queryMaterialDetailData`, {
                params
            });
        },
        /**
         * 物料入库单 入库
         */
        confirmMaterialInStore: (params?: any) => {
            return http.post<any>(`${tmgc2Warehouse}/warehouse/confirmMaterialInStore`, params);
        },
        /**
         * 物料入库单 入库 详情
         */
        queryMaterialInStoreById: (params?: any) => {
            return http.get<any>(`${tmgc2Warehouse}/warehouse/queryMaterialInStoreById`, {
                params
            });
        },

        // 盘点单---------------------------------------------------------------------------------
        /**
         * @return 新增盘点单
         */
        confirmCompleteInStore: (params?: Partial<ReqGetConfirmCompleteInStoreObject>) => {
            return http.post<ResTpfValue>(`${tmgc2Warehouse}/warehouse/createStoreCheck`, params);
        },
        /**
         * 删除盘点单
         */
        deleteStoreCheck: (params: { id: any[] }) => {
            return http.post(`${tmgc2Warehouse}/warehouse/deleteStoreCheck`, params);
        },
        /**
         * @returns 执行盘点单
         */
        executeStoreCheck: (params: { id: number }) => {
            return http.post<ResTpfValue<boolean>>(
                `${tmgc2Warehouse}/warehouse/executeStoreCheck`,
                params
            );
        },
        /**
         * @returns 盘点单详情
         */
        queryStoreCheckById: (params: { id: number }) => {
            return http.get<any>(`${tmgc2Warehouse}/warehouse/queryStoreCheckById`, {
                params
            });
        },

        //新接口--------列表导出接口
        exportStoreCheck: (params: Partial<ReqQueryExecute> = {}) => {
            return http.post(`${tmgc2Warehouse}/warehouse/exportStoreCheck`, params);
        },

        /**
         * @returns 编辑保存
         */
        saveStoreCheck: (params?: any) => {
            return http.post<any>(`${tmgc2Warehouse}/warehouse/saveStoreCheck`, params);
        },

        /**
         * @returns 编辑保存并执行
         */ saveExecuteStoreCheck: (params?: any) => {
            return http.post<any>(`${tmgc2Warehouse}/warehouse/saveExecuteStoreCheck`, params);
        },

        /**
         * 物料入库单导出
         */
        exportMaterialInStore: (params: Partial<ResExportMaterialInStore> = {}) => {
            return http.post<any>(`${tmgc2Warehouse}/warehouse/exportMaterialInStore`, params);
        },

        //物料退货单---------------------------------------------------------------------------------------------------------

        /**
         * @returns 获取列表
         */
        queryPopMaterialArrivalData: (params?: Partial<ReqQueryPopMaterialArrivalData>) => {
            return http.post<ResTpfObject<{ list: ArriveList[] }>>(
                `${tmgc2Warehouse}/warehouse/queryPopMaterialArrivalData`,
                params
            );
        },

        /**
         * 根据到货单查询库存信息
         */
        byarrivalno: (params?: { arrivalNo: string }) => {
            return http.get<any>(`${tmgc2Warehouse}/warehouse/queryPopMaterialStores/byarrivalno`, {
                params
            });
        },
        /**
         * 查询 物料 批次号
         */
        getBatchNoListByMaterialCode: (params: { materialCode: string }) => {
            return http.get<any>(`${tmgc2Warehouse}/warehouse/getBatchNoListByMaterialCode`, {
                params
            });
        },
        /**
         * @returns 执行移库
         */
        confirmMoveStore: (params?: { dtoList: ReqConfirmMoveStore[] }) => {
            return http.post<ResTpfValue>(`${tmgc2Warehouse}/warehouse/confirmMoveStore`, params);
        },
        /**
         * @returns 查询物料库存信息
         */
        queryPopMaterialStores: (params?: any) => {
            return http.post<ResTpfObject<{ list: MaterialStorePopRespDtos[] }>>(
                `${tmgc2Warehouse}/warehouse/queryPopMaterialStores`,
                params
            );
        },

        /**
         * 物料退货单-新增
         */
        addMaterialreturn: (params: Partial<MaterialReturn>) => {
            return http.post<any>(`${tmgc2Warehouse}/warehouse/materialreturn/add`, params);
        },

        /**
         * 物料退货单-待提交-详情
         */
        querydetail: (params?: { materialReturnNo: string }) => {
            return http.get<ResTpfObject<any>>(
                `${tmgc2Warehouse}/warehouse/materialreturn/querydetail`,
                {
                    params
                }
            );
        },

        /**
         * 物料退货单-编辑查看详情
         */
        querydetailtoeidt: (params?: Partial<MaterialReturn>) => {
            return http.get<any>(`${tmgc2Warehouse}/warehouse/materialreturn/querydetailtoeidt`, {
                params
            });
        },

        /**
         * 物料退货单-编辑
         */
        updatedetail: (params?: Partial<MaterialReturn>) => {
            return http.post(`${tmgc2Warehouse}/warehouse/materialreturn/updatedetail`, params);
        },

        /**
         * @returns 物料退货单-删除
         */
        batchdeleted: (params?: { returnNos: string[] }) => {
            return http.delete(`${tmgc2Warehouse}/warehouse/materialreturn/batchdeleted`, {
                data: params
            });
        },

        /**
         * @returns 物料退货单-提交
         */
        batchsubmit: (params: any) => {
            return http.put(`${tmgc2Warehouse}/warehouse/materialreturn/batchsubmit`, {
                returnNos: params
            });
        },

        //新接口--------列表导出接口
        materialreturnexecute: (params: Partial<ReqQueryExecute> = {}) => {
            return http.post(`${tmgc2Warehouse}/warehouse/materialreturn/execute`, params);
        },

        /**
         * 导出出入库明细
         */
        materialDetailDataExecute: (params?: Partial<ReqGetTableList>) => {
            return http.post<ResTpfValue>(
                `${tmgc2Warehouse}/warehouse/materialDetailData/execute`,
                params
            );
        }
    };
};
