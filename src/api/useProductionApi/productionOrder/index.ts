export * from './index.d';

import { ResTpfObject, ResTpfValue } from '@/types/axios';
import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';
import type { TpfDelInfo } from '@/types';
import { ResTpfList } from '@/types/axios';

import {
    EditVoType,
    IProductionOrderInfo,
    IProductionOrderList,
    IProjectWordList,
    ProductionOrderByIdType,
    ReqBatchEditProductionOrderProcess,
    ReqEditProductionOrderChange,
    ReqEditProductionOrderProcess,
    ResGetProductionOrderChange,
    ResGetProductionOrderOperationBomList,
    ResGetProductionOrderProcessOperation,
    ReqQueryProductionOrderListByPage,
    ReqAddProductionOrder,
    ReqSaveProductionOrderOperationBomDetail,
    ReqExportProductionOrderExcelFile
} from './index.d';

interface ResProductionOrderOperationBomList {
    bomAccId: string;
    items: ResGetProductionOrderOperationBomList[];
    processName: string;
    processVersion: string;
}
interface ResViewProductionOrderDraws {
    pid: string;
    purl: string;
    result: boolean;
    status: string;
}

//班组
export const useProductionOrderApi = () => {
    const tmgc2Production = useNetworkApi(proxyEnum.tmgc2Production);

    return {
        /**
         * @returns 获取列表
         */
        queryProductionOrderListByPage: (params?: Partial<ReqQueryProductionOrderListByPage>) => {
            return http.post<ResTpfObject<{ list: IProductionOrderList[] }>>(
                `${tmgc2Production}/productionOrder/queryProductionOrderListByPage`,
                params
            );
        },
        /**
         * @returns 新增数据
         */
        addProductionOrder: (params?: Partial<ReqAddProductionOrder>) => {
            return http.post<ResTpfValue>(
                `${tmgc2Production}/productionOrder/addProductionOrder`,
                params
            );
        },
        /**
         * @returns 生产订单详情
         */
        getProductionOrderViewById: (productionOrderId: string) => {
            return http.get<ResTpfObject<IProductionOrderInfo>>(
                `${tmgc2Production}/productionOrder/getProductionOrderViewById`,
                {
                    params: { productionOrderId }
                }
            );
        },
        /**
         * @returns 查询单条数据
         */
        getProductionOrderById: (params?: { productionOrderId?: number | string }) => {
            return http.get<ResTpfObject<ProductionOrderByIdType>>(
                `${tmgc2Production}/productionOrder/getProductionOrderById`,
                { params }
            );
        },
        /**
         * @returns 编辑数据
         */
        editProductionOrder: (params?: Partial<ReqAddProductionOrder>) => {
            return http.put<ResTpfObject<ProductionOrderByIdType>>(
                `${tmgc2Production}/productionOrder/editProductionOrder`,
                params
            );
        },
        /**
         * @returns 批量删除数据
         */
        deleteProductionOrderByIds: (params?: { ids: (string | number)[] }) => {
            return http.post<ResTpfList<TpfDelInfo[]>>(
                `${tmgc2Production}/productionOrder/deleteProductionOrderByIds`,
                params
            );
        },
        /**
         * @returns 撤回下达
         */
        withdrawReleaseOrder: (productionOrderId: string | number) => {
            return http.get<ResTpfObject<ProductionOrderByIdType>>(
                `${tmgc2Production}/productionOrder/withdrawReleaseOrder`,
                {
                    params: { productionOrderId }
                }
            );
        },
        /**
         * @returns 单个下达校验
         */
        releaseOrderCheck: (productionOrderId: string | number) => {
            return http.get<{ value: boolean }>(
                `${tmgc2Production}/productionOrder/releaseOrderCheck`,
                {
                    params: { productionOrderId }
                }
            );
        },
        /**
         * @returns 查询是否库存齐套
         */
        checkProductionOrderFullSetRate: (params: { ids: (string | number)[] }) => {
            return http.post<ResTpfList<{ message: string }[]>>(
                `${tmgc2Production}/productionOrder/checkProductionOrderFullSetRate`,
                params
            );
        },
        /**
         * @returns 生产订单下达-作业工单新建
         */
        releaseProductionOrder: (params?: any) => {
            return http.post<boolean>(
                `${tmgc2Production}/productionOrder/releaseProductionOrder`,
                params
            );
        },

        /**
         * @returns 批量下达 校验
         */
        batchReleaseOrderCheck: (params: { ids: number[] }) => {
            return http.post<ResTpfObject<{ [k: string]: TpfDelInfo[] }>>(
                `${tmgc2Production}/productionOrder/batchReleaseOrderCheck`,
                params
            );
        },

        /**
         * @returns 生产订单批量下达-作业工单新建
         */
        batchReleaseProductionOrder: (params?: { ids?: number[]; workshopCode?: string }) => {
            return http.post<boolean>(
                `${tmgc2Production}/productionOrder/batchReleaseProductionOrder`,
                params
            );
        },
        /**
         * @returns 查看工单序列号-作业工单
         */
        viewWorkOrder: (params?: any) => {
            return http.post<ResTpfObject<{ list: IProjectWordList[] }>>(
                `${tmgc2Production}/productionOrder/queryProductionOrderListByPage`,
                params
            );
        },
        /**
         * @returns 批量强制关闭
         */
        batchCompulsoryCloseProductionOrder: (params?: { ids?: (string | number)[] }) => {
            return http.post<ResTpfList<TpfDelInfo[]>>(
                `${tmgc2Production}/productionOrder/batchCompulsoryCloseProductionOrder`,
                params
            );
        },
        /**
         * @returns 批量强制完工
         */
        batchCompulsoryCompletionProductionOrder: (params?: { ids?: (string | number)[] }) => {
            return http.post<ResTpfList<TpfDelInfo[]>>(
                `${tmgc2Production}/productionOrder/batchCompulsoryCompletionProductionOrder`,
                params
            );
        },
        /**
         * @returns 获取订单下未完工工单数量
         */
        getUnCompleteWorkOrderUnderProductionOrder: (params?: { ids?: (string | number)[] }) => {
            return http.post<ResTpfList<{ productionOrderCode: string; count: number }[]>>(
                `${tmgc2Production}/productionOrder/getUnCompleteWorkOrderUnderProductionOrder`,
                params
            );
        },

        /**
         * @returns 获取订单下未完工工单数量
         */
        exportProductionOrderExcelFile: (params?: Partial<ReqExportProductionOrderExcelFile>) => {
            return http.post(
                `${tmgc2Production}/productionOrder/exportProductionOrderExcelFile`,
                params
            );
        },
        /**
         * @returns 导入数据
         */
        importProductionOrder: (params?: { overrideFlag: boolean; fileCode: string }) => {
            return http.get(`${tmgc2Production}/productionOrder/importProductionOrder`, { params });
        },
        /**
         * @returns 编辑生产订单变更数据
         */
        editProductionOrderChange: (params?: Partial<ReqEditProductionOrderChange>) => {
            return http.put(`${tmgc2Production}/productionOrder/editProductionOrderChange`, params);
        },
        /**
         * @returns 查询生产订单变更数据
         */
        getProductionOrderChange: (params?: { productionOrderId?: number }) => {
            return http.get<ResTpfObject<ResGetProductionOrderChange>>(
                `${tmgc2Production}/productionOrder/getProductionOrderChange`,
                { params }
            );
        },
        /**
         * @returns 查询生产订单工艺工序数据
         */
        getProductionOrderProcessOperation: (params?: { productionOrderId?: number | string }) => {
            return http.get<ResTpfObject<ResGetProductionOrderProcessOperation>>(
                `${tmgc2Production}/productionOrder/getProductionOrderProcessOperation`,
                { params }
            );
        },
        /**
         * @returns 保存生产订单工艺工序数据
         */
        saveProductionOrderProcessOperation: (data: { editVos: Partial<EditVoType>[] }) => {
            return http.post(
                `${tmgc2Production}/productionOrder/saveProductionOrderProcessOperation`,
                data
            );
        },
        /**
         * @returns生产订单工艺工序bom：查询生产订单工艺工序数据
         */
        getProductionOrderOperationBomList: (params?: { productionOrderId?: number | string }) => {
            return http.get<ResTpfObject<ResProductionOrderOperationBomList>>(
                `${tmgc2Production}/productionOrder/getProductionOrderOperationBomList`,
                {
                    params
                }
            );
        },
        /**
         * @returns 查询生产订单工艺工序bom数据
         */
        getProductionOrderOperationBomDetail: (params?: {
            bomId?: number;
            bomVersion?: number;
        }) => {
            return http.get<ResTpfList<ResGetProductionOrderOperationBomList[]>>(
                `${tmgc2Production}/productionOrder/getProductionOrderOperationBomDetail`,
                { params }
            );
        },
        /**
         * @returns 保存生产订单工艺工序数据
         */
        saveProductionOrderOperationBomDetail: (
            params?: Partial<ReqSaveProductionOrderOperationBomDetail>
        ) => {
            return http.post(
                `${tmgc2Production}/productionOrder/saveProductionOrderOperationBomDetail`,
                params
            );
        },
        /**
         * @returns 编辑生产订单工艺数据保存
         */
        editProductionOrderProcess: (params?: Partial<ReqEditProductionOrderProcess>) => {
            return http.put(
                `${tmgc2Production}/productionOrder/editProductionOrderProcess`,
                params
            );
        },
        /**
         * @returns 编辑生产订单工艺数据保存
         */
        batchEditProductionOrderProcess: (params?: Partial<ReqBatchEditProductionOrderProcess>) => {
            return http.put(
                `${tmgc2Production}/productionOrder/batchEditProductionOrderProcess`,
                params
            );
        },

        /**
         * 删除报工记录
         * @returns
         */
        deleteReportProgress: (data: { ids: string[] }) => {
            return http.delete(`${tmgc2Production}/productionOrder/deleteReportProgress`, { data });
        },
        /**
         * 批量删除自定义字段
         * @returns
         */
        deleteProductionOrderDiyFieldByIds: (data: { ids: number[] }) => {
            return http.post<ResTpfList<TpfDelInfo[]>>(
                `${tmgc2Production}/productionOrder/deleteProductionOrderDiyFieldByIds`,
                data
            );
        },
        /**
         * 查看生产订单图纸
         * @returns
         */
        viewProductionOrderDraws: (params: { productionOrderId: string }) => {
            return http.get<ResTpfObject<ResViewProductionOrderDraws>>(
                `${tmgc2Production}/productionOrder/viewProductionOrderDraws`,
                { params }
            );
        }
    };
};
