export interface ReqCreateMaterialRequisition {
    /**
     * 作业工单号
     */
    workOrderCode: string;
    projectCode: string; //项目编号
    productionOrderCode: string; //生产订单号
    receiveType: string; //领料类型：（1：正常领料，2：超量领料，默认正常领料）
    remark: string; //备注
    stockCode: string; //备料清单编号
    origin: string; //来源(1：图纸云2：作业工单3：新增)
    isPrint: string; //是否打印(0：否1：是)
    operationInfoList: OperationInfoList[];
}

interface OperationInfoList {
    operationCode?: string; //工序code
    operationMaterialList: OperationMaterialList[];
}

interface OperationMaterialList {
    materialCode: string; //物料code
    requisitionNumber: number; //领料数
    remark: string; //备注
}

export interface ResGetMaterialRequisitionByCode {
    departmentId: string;
    detailVoList: ResDetailVoList[];
    projectCode: string;
    receiveType: string;
}

export interface ResDetailVoList {
    /**
     * 主键id
     */
    id: number;
    /**
     * 领料申请单编号
     */
    materialRequisitionOrderCode: string;
    /**
     * 部门编号（创建人的部门，当创建人存在多个部门，默认为空）
     */
    departmentId: any;
    /**
     * 部门名称
     */
    departmentName: string;
    /**
     * 物料code
     */
    materialCode: string;
    /**
     * 物料名称
     */
    materialName: string;
    /**
     * 规格
     */
    specification: string;
    /**
     * 项目编号
     */
    projectCode: string;
    /**
     * 项目名称
     */
    projectName: string;
    /**
     * 生产订单号
     */
    productionOrderCode: any;
    /**
     * 作业工单号
     */
    workOrderCode: any;
    /**
     * 工序编号
     */
    operationCode: string;
    /**
     * 工序名称
     */
    operationName: string;
    /**
     * 领料数
     */
    requisitionNumber: number;
    /**
     * 单位（生产单位）
     */
    productUnitCodeName: string;
    /**
     * 出库数
     */
    outStorageNumber: any;
    /**
     * 已退料数
     */
    returnedNumber: any;
    /**
     * 替代料编号
     */
    replaceMaterialCode: any;
    /**
     * 替代料名称
     */
    replaceMaterialName: any;
    /**
     * 基本数量
     */
    basicNumber: any;
    /**
     * 基本单位
     */
    basicUnitName: string;
    /**
     * 备注
     */
    remark: any;
    /**
     * 工步
     */
    workStep: any;
    /**
     * 是否保税
     */
    isBonded: any;
}

export interface ReqGetOutStorageInfo {
    materialRequisitionOrderCode: string;
    materialCode: string;
}

// export interface ReqCreateMaterialExportStorage {
//     businessType: string; //业务类型（0：领料申请单，）
//     businessCode: string; //业务编号
//     materialDeliveryUser: number; //出库人
//     materialDeliveryDate: string; //出库时间
//     outStorageOrderInfoVos: OutStorageOrderInfoVo[];
// }

// interface OutStorageOrderInfoVo {
//     businessType: string; //业务类型（0：领料申请单，）
//     businessCode: string; //业务编号
//     materialCode: string; //物料编号
//     replaceMaterialCode: string;
//     storeInfoId: number; //物料store_info_id
//     returnNum: number; //已退料数
//     outStorageNumber: number; //出库数
//     remark: string; //备注
//     createUser: number; //创建人
//     createDate: string; //创建日期
//     modifyUser: number; //修改人
//     modifyDate: string; //修改时间
// }

export interface ResGetOutStorageInfo {
    projectName: string;
    batchNo: string;
    materialCode: string;
    materialName: string;
    productUnitCodeName?: any;
    storageNumber: number;
    outStorageNumber?: any;
    basicNumber: number;
    basicUnitName: string;
    positionName?: any;
    storeLocationName?: any;
    storeInfoId: number;
}
