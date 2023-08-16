import type { ResTpfObject, ResTpfValue } from '@/types/axios';
import { useNetworkApi, proxyEnum } from '@/api';
import http from '@/utils/http';
interface queryOtherOutInDetailDataDetailPageByParamType {
    page: number;
    pageSize: number;
    sortedField: string;
    sortByAsc: true;
    inNo: string; //入库单号
    sourceNo: string; //来源单号
    departmentCode: string; //部门编号
    moveTypeCode: string; //移动类型编号
    createUserName: string;
    startDateTime: string;
    endDateTime: string;
    idList: number[];
}
interface queryOtherOutInDetailDataDetailPageByParamRes {
    id: number; //其他入库单主键id
    tenantId: number;
    inNo: string; //出库单号
    sourceNo: string; //来源单号
    projectCode: string; //项目编号
    materialCode: string; //物料编号
    materialName: string; //物料名称
    departmentCode: string; //部门编号
    batchNo: string; //批次号
    moveTypeCode: string; //移动类型编号
    moveTypeName: string; //移动类型名称
    positionCode: string; //仓位代码
    positionName: string; //仓位名称
    storeLocationCode: string; //库位代码
    storeLocationName: string; //库位名称
    outNum: number; //出库数量
    createUser: number; //创建者
    createUserName: string; //创建者名称
    createDateTime: string;
    modifyUser: number; //修改者
    modifyDateTime: string;
    remarks: string; //备注
    deleted: string;
    basicUnit: string; //基本单位
}

export interface getOtherDetailDataExcelType {
    id: number;
    tenantId: number;
    inNo: string; //入库单号
    sourceNo: string; //来源单号
    moveTypeCode: string; //移动类型编号
    moveTypeName: string; //移动类型名称
    departmentCode: string; //部门编号
    createUser: number; //创建者
    createUserName: string; //创建人名称
    createDateTime: string;
    modifyUser: number; //修改者
    modifyDateTime: string;
    deleted: string; //删除标识（0未删除，1已删除)
    remarks: string;
    otherInStoreDetailList: OtherInStoreDetailList[]; //其他入库详情
    otherOutInStoreDetailList: OtherOutInStoreDetailList[]; //其他出库详情
}

interface OtherOutInStoreDetailList {
    id: number;
    tenantId: number;
    inNo: string;
    sourceNo: string;
    projectCode: string;
    materialCode: string;
    materialName: string;
    departmentCode: string;
    batchNo: string;
    moveTypeCode: string;
    moveTypeName: string;
    positionCode: string;
    positionName: string;
    storeLocationCode: string;
    storeLocationName: string;
    outNum: number;
    createUser: number;
    createUserName: string;
    createDateTime: string;
    modifyUser: number;
    modifyDateTime: string;
    remarks: string;
    deleted: string;
    basicUnit: string;
}

export interface OtherInStoreDetailList {
    id: number; //其他入库单主键id
    tenantId: number;
    inNo: string; //入库单号
    sourceNo: string; //来源单号
    remark: string;
    projectCode: string; //项目编号
    materialCode: string; //物料编号
    materialName: string; //物料名称
    departmentCode: string; //部门编号
    batchNo: string; //批次号
    moveTypeCode: string; //移动类型编号
    moveTypeName: string; //移动类型名称
    positionCode: string; //仓位代码
    positionName: string; //仓位名称
    storeLocationCode: string; //库位代码
    storeLocationName: string; //库位名称
    inNum: number; //入库数量
    createUser: number;
    createUserName: string;
    createDateTime: string;
    modifyUser: number; //修改者
    modifyDateTime: string;
    remarks: string;
    deleted: string; //删除标识（0未删除，1已删除）
    departmentName: string;
    materialUnitName: string;
}

//集团
export const useOtherInStoreApi = () => {
    const tmgc2Warehouse = useNetworkApi(proxyEnum.tmgc2Warehouse);

    return {
        /**
         * @returns 根据条件分页查询其他出库明细列表
         */
        queryOtherOutInDetailDataDetailPageByParam: (
            params: queryOtherOutInDetailDataDetailPageByParamType
        ) => {
            return http.post<
                ResTpfObject<{ list: queryOtherOutInDetailDataDetailPageByParamRes[] }>
            >(`${tmgc2Warehouse}/warehouse/queryOtherOutInDetailDataDetailPageByParam`, params);
        },
        /**
         * @returns 根据条件分页查询其他入库明细列表
         */
        queryOtherInDetailDataDetailPageByParam: (
            params: queryOtherOutInDetailDataDetailPageByParamType
        ) => {
            return http.post<
                ResTpfObject<{ list: queryOtherOutInDetailDataDetailPageByParamRes[] }>
            >(`${tmgc2Warehouse}/warehouse/queryOtherInDetailDataDetailPageByParam`, params);
        },

        /**
         * @returns 导入
         */
        queryInitializeImportExcel: (params: any) => {
            return http.get(`${tmgc2Warehouse}/warehouse/queryInitializeImportExcel`, { params });
        },
        /**
         * @returns 其他入库单详情页展示数据Excel导出
         */
        getOtherDetailDataExcel: (params: any) => {
            return http.post<ResTpfValue>(
                `${tmgc2Warehouse}/warehouse/getOtherDetailDataExcel`,
                params
            );
        },

        /**
         * @returns 导出
         */
        dataExport: (params: any) => {
            return http.post(`${tmgc2Warehouse}/warehouse/dataExport`, params);
        },
        /**
         * @returns 其他出库单数据详情页更新保存
         */
        addOtherOutInStore: (params: Partial<getOtherDetailDataExcelType>) => {
            return http.post<ResTpfValue>(`${tmgc2Warehouse}/warehouse/addOtherOutInStore`, params);
        },
        /**
         * @returns 其他入库单数据详情页更新保存
         */
        addOtherInStore: (params: Partial<getOtherDetailDataExcelType>) => {
            return http.post<ResTpfValue>(`${tmgc2Warehouse}/warehouse/addOtherInStore`, params);
        },
        /**
         * @returns 通过id查询其他出库单数据详情页
         */
        queryOtherOutInDetailData: (params: { id: string }) => {
            return http.get<ResTpfObject<any>>(
                `${tmgc2Warehouse}/warehouse/queryOtherOutInDetailData`,
                { params }
            );
        },
        /**
         * @returns 通过id入库单号查询其他入库单数据详情页
         */
        queryOtherDetailData: (params: { id: string }) => {
            return http.get<ResTpfObject<any>>(`${tmgc2Warehouse}/warehouse/queryOtherDetailData`, {
                params
            });
        },
        /**
         * @returns 其它出库单详情导出
         */
        getOtherOutStoreDetailExcel: (params: any) => {
            return http.post<ResTpfValue>(
                `${tmgc2Warehouse}/warehouse/getOtherOutStoreDetailExcel`,
                params
            );
        },

        /**
         * @returns 其它出库单导出
         */
        getOtherOutStoreExcel: (params: any) => {
            return http.post(`${tmgc2Warehouse}/warehouse/getOtherOutStoreExcel`, params);
        }
    };
};
