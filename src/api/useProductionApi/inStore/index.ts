import { ResTpfObject, ResTpfValue } from '@/types/axios';
import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';
import type { ExportTableHeaderConfig } from '@/types';
interface ReqGetTableList {
    total: number;
    page: number;
    pageSize: number;
    totalPage: number;
    workOrderCode: string;
    inStatus: number;
    positionCode: string;
    projectName: string;
    materialCode: string;
    materialName: string;
    materialCodeList: string[];
    productionOrderCode: string;
    startInDateTime: string;
    endInDateTime: string;
    totalPageValue: number;
    sortedField: string;
    sortByAsc: boolean;
}
interface ReqGetConfirmCompleteInStoreObject {
    positionCode: string;
    storeLocationCode: string;
    id: any[];
}
interface ResGetMaterialBaseList {
    id: number; // 主键id
    voucherNo: string; //单据凭证号
    workOrderCode: string; //作业工单编号
    workNo: string; // 报工号
    materialCode: string; //物料编号
    materialName: string; //物料名称
    batchNo: string; //批次号
    num: number; //数量
    inStatus: number; //入库状态 0=未入库 1=已入库
    projectCode: string; //项目编号
    projectName: string; //项目名称
    productionOrderCode: string; //生产订单编号
    positionCode: string; // 仓位代码
    positionName: string; // 仓位名称
    storeLocationCode: string; //单据凭证号
    storeLocationName: string; //单据凭证号
    workDateTime: string; //报工时间
    inUserId: number; //入库用户
    inUserName: number | string; //入库用户名称
    inDateTime: string; //入库时间
}

//完工入库单
export const useInStoreAPi = () => {
    const tmgc2Production = useNetworkApi(proxyEnum.tmgc2Production);

    return {
        /**
         * @return 入库单明细列表
         */
        queryCompleteInStorePageByParam: (params?: Partial<ReqGetTableList>) => {
            return http.post<ResTpfObject<{ list: ResGetMaterialBaseList[] }>>(
                `${tmgc2Production}/instore/queryCompleteInStorePageByParam`,
                params
            );
        },
        /**
         * @return 导出入库单明细
         */
        exportCompleteInStore: (
            params?: Partial<ReqGetTableList & { tableHeaderConfig: ExportTableHeaderConfig }>
        ) => {
            return http.post<ResTpfValue>(
                `${tmgc2Production}/instore/exportCompleteInStore`,
                params
            );
        },
        /**
         * @return 更新入库
         */
        confirmCompleteInStore: (params?: Partial<ReqGetConfirmCompleteInStoreObject>) => {
            return http.post<ResTpfValue>(
                `${tmgc2Production}/instore/confirmCompleteInStore`,
                params
            );
        }
    };
};
