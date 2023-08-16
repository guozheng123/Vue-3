import type { ResTpfObject, ResTpfValue, ResTpfList } from '@/types/axios';
import { useNetworkApi, proxyEnum } from '@/api';
import http from '@/utils/http';
export * from './index.d';

import {
    ReqCreateMaterialRequisition,
    ResGetMaterialRequisitionByCode,
    ReqGetOutStorageInfo,
    ResGetOutStorageInfo
} from './index.d';

//领料申请单
export const useMaterialRequisitionApi = () => {
    const tmgc2Warehouse = useNetworkApi(proxyEnum.tmgc2Warehouse);

    return {
        /**
         * @returns  作业工单新增领料申请单
         */
        create: (params: Partial<ReqCreateMaterialRequisition>) => {
            return http.post(`${tmgc2Warehouse}/materialRequisition/create`, params);
        },
        /**
         * @returns  根据领料申请单code获取详情
         */
        getMaterialRequisitionByCode: (params?: { materialRequisitionOrderCode?: string }) => {
            return http.get<ResTpfObject<ResGetMaterialRequisitionByCode>>(
                `${tmgc2Warehouse}/materialRequisition/getMaterialRequisitionByCode`,
                { params }
            );
        },
        /**
         * @returns  编辑领料申请单
         */
        editMaterialRequisition: (params?: any) => {
            return http.post(
                `${tmgc2Warehouse}/materialRequisition/editMaterialRequisition`,
                params
            );
        },
        /**
         * @returns  删除领料申请单
         */
        delete: (params?: string[]) => {
            return http.post(`${tmgc2Warehouse}/materialRequisition/delete`, params);
        },
        /**
         * @returns  先进先出
         */
        getOutStorageInfo: (params?: Partial<ReqGetOutStorageInfo>) => {
            return http.post<ResTpfList<ResGetOutStorageInfo[]>>(
                `${tmgc2Warehouse}/materialRequisition/getOutStorageInfo`,
                params
            );
        }
    };
};
