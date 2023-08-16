import type { ResTpfObject, ResTpfValue, ResTpfList } from '@/types/axios';
import { useNetworkApi, proxyEnum } from '@/api';
import http from '@/utils/http';
export interface ReqCreateReturnMaterialList {
    outStorageOrderId: number; //出库单id
    id: number; //出库单详情id
    outStorageOrderCode: string; //出库单编号
    returnNum: number; //退料数
    materialCode: string; //物料编号
    replaceMaterialCode: string; //替代料编号
    storeInfoId: number; //仓库详情id
}
type materialRequisitionOrderInfoVosList = {
    operationCode: string; // 工序编号
    materialCode: string; // 物料编号
    requisitionNumber: number; // 领料数
    remark: string; // 备注
};
export interface ResGetMaterialOutStorageByIdList {
    materialCode: string; //物料编号
    materialName: string; //物料名称
    materialSpec: string; //物料规格
    replaceMaterialCode: string; //替代物料-物料名称
    materialUnitCode: string; //物料基本单位
    materialUnitName: string; //物料基本单位名称
    productUnitCode: string; //生产单位
    projectCode: string; //项目编号
    projectName: string; //项目名称
    workOrderCode: string; //作业工单编号
    productionOrderCode: string; //生产订单编号
    requisitionNumber: number; //领料数
    operationCode: string; //工序编号
    operationName: string; //工序名称
    remark: string; //备注
    materialRequisitionOrderInfoVos: materialRequisitionOrderInfoVosList[];
}
//领料出库单
export const useOutStorageApi = () => {
    const tmgc2Warehouse = useNetworkApi(proxyEnum.tmgc2Warehouse);

    return {
        /**
         * @returns 领料出库单退料
         */

        createReturnMaterial: (params: Partial<{ list: any[] }>) => {
            return http.post<ResTpfValue>(
                `${tmgc2Warehouse}/outStorage/createReturnMaterial`,
                params
            );
        },
        /**
         * @returns 领料出库单获取详情
         */
        getMaterialOutStorageById: (params: { outStorageOrderId: number }) => {
            return http.get<ResTpfObject<ResTpfList<ResGetMaterialOutStorageByIdList[]>>>(
                `${tmgc2Warehouse}/outStorage/getMaterialOutStorageById`,
                {
                    params
                }
            );
        },
        /**
         * 生成领料申请单出库单
         * @param params
         * @returns
         */
        createOutStorage: (params?: any) => {
            return http.post<any>(`${tmgc2Warehouse}/outStorage/createOutStorage`, params);
        }
    };
};
