export interface ReqGetTableList {
    total: number;
    page: number;
    pageSize: number;
    totalPage: number;
    orgCode: string;
    businessOrderNo: string;
    moveTypeCode: string;
    materialCode: string;
    positionCode: string;
    fromTo: string;
    outInType: number;
    startDateTime: string;
    endDateTime: string;
    idList: number[];
    tableHeaderConfig: any[];
    totalPageValue: number;
    sortedField: string;
    sortByAsc: boolean;
    conditions: any[];
}
export type ReqGetQueryStoreAlertPageByParamList = ReqGetStoreInfoPageByParamList;
export interface ReqExportStoreInfoParamList extends ResGetQueryStoreInfoPageByParamList {
    tableHeaderConfig: any;
}
export interface ReqGetStoreInfoPageByParamList {
    page: number;
    pageSize: number;
    sortedField: string;
    sortByAsc: boolean;
    orgCode: string;
    projectCode: string;
    materialCode: string;
    materialName: string;
    materialType: string;
    positionCode: string;
    positionType: string;
    positionAttribute: string;
    mergeProject: number;
    mergeBatchNo: number;
    mergePosition: number;
    mergeStoreLocation: number;
    tableHeaderConfig: any[];
}
export interface ResGetQueryStoreInfoPageByParamList {
    id: number; // 主键id
    tenantId: number; //  租户id
    orgCode: string; // 所属组织编号
    orgName: string; // 所属组织名称
    projectCode: string; // 项目编号
    batchNo: string; // 批次号
    materialCode: string; // 物料编号
    materialName: string; // 物料名称
    materialType: string; // 物料类型
    figureNo: string; // 图号
    positionCode: string; // 仓位编号
    positionName: string; // 仓位名称
    storeLocationCode: string; // 库位编号
    storeLocationName: string; // 库位名称
    num: number; //数量
    unit: string; // 单位
    positionType: string; // 仓位类型
    positionAttribute: string; // 仓位属性
    minNum: number; // 最小库存
    maxNum: number; // 最大库存
    createUserName: string; // 创建人
    createDateTime: string; // 创建时间
}
export interface ResGetOutInStoreDetailList {
    id: number; //主键id
    tenantId: number; // 租户id
    orgCode: string; //所属组织编号
    orgName: string; //所属组织名称
    voucherNo: string; //单据凭证号
    moveTypeCode: string; // 移动类型编号
    moveTypeName: string; // 移动类型名称
    projectCode: string; // 项目编号
    businessOrderNo: string; //业务单号
    fromTo: string; //来源或去向
    batchNo: string; //批次号
    materialCode: string; //物料编号
    materialName: string; //物料名称
    materialType: string; // 物料类型
    figureNo: string; //图号
    positionCode: string; // 仓位编号
    positionName: string; //仓位名称
    storeLocationCode: string; // 库位编号
    storeLocationName: string; // 库位名称
    outInType: number; //出入库类型
    num: number; // 数量
    unit: string; //单位
    remark: string; // 备注
    createUserName: string; // 创建人
    createDateTime: string; // 创建时间
}
export interface ResGetQueryStoreAlertPageByParamList {
    id: number; // 主键id
    tenantId: number; //租户id
    orgCode: string; // 所属组织编号
    orgName: string; // 所属组织名称
    materialCode: string; // 物料编号
    materialName: string; // 物料名称
    materialType: string; // 物料类型
    yNum: number; // 良品数量
    nNum: number; // 不良品数量
    num: number; // 数量
    unit: string; // 单位
    minNum: number; // 最小库存
    maxNum: number; // 最大库存
    remark: string; // 说明
}
// export type IResGetWorkshopWorkingTeamTreeList = {
//     rootId: string; //节点id
//     rootName: string; //节点名称
//     rootCode: string; //节点编码
//     branchTree: IResGetWorkshopWorkingTeamTreeList[];
// };
export type MoveType = {
    id: string;
    code: string;
    name: string;
    outInStockType: string;
    remark: string;
    isUsed: string;
    tenantId: string;
};

export interface ResGetStoreLocationDataList {
    id: number;
    orgName: string;
    positionCode: string;
    positionName: string;
    storeLocationCode: string;
    storeLocationName: string;
    remark: string;
    isUsed: number;
    tenantId: number;
    createUser: string;
    createDateTime: string;
}
export interface ResGetPositionDataList {
    id: number;
    orgName: string;
    code: string;
    name: string;
    type: string;
    attribute: string;
    address: string;
    remark: string;
    isUsed: number;
    tenantId: number;
    createUser: string;
    createDateTime: string;
    defaultQualified: number;
    defaultDisqualified: number;
}
export interface ReqAddToBeSubmittedManifestParamList {
    arrivalNo: string; // 到货单号
    resourcrNo: string; // 来源单号
    supplierCode: string; // 供应商编号
    orderSource: number; // 订单来源(0系统创建 ， 1 非标)
    moveTypeCode: string; // 移动类型编码
    isSubmit: string; // 是否提交 , 0不提交 ， 1提交
    materialDataDetailList: any[]; // 物料到货详情
}
export type ResExportMaterialInStore = {
    sortedField: string;
    sortByAsc: boolean;
    mainEntityCode: string;
    page: number;
    pageSize: number;
    requiredFields: string[];
    conditions: { conditionFieldName?: string; values?: string[] }[];
    tableHeaderConfig?: any[];
};
export interface ReqQueryPositionListByMoveParam {
    materialCode?: string; // 物料编号
    projectCode?: string; // 项目编号
    positionCode?: string; // 仓位编号
    storeLocationCode?: string; // 库位编号
}

// 查询到货单
export type ArriveList = {
    arrivalNo: string; //到货单号
    sourceNo: string; //来源单号
    orderSource: string; //订单来源
    customerSupplierCodeName: string; //供应商
    createUser: string; //创建人
    createDateTime: string; //创建时间
};

export type ReqQueryPopMaterialArrivalData = {
    page: number;
    pageSize: number;
    sortedField: string;
    sortByAsc: boolean;
    arrivalNo: string;
    customerSupplierName: string;
};

export type ReqConfirmMoveStore = {
    materialCode?: string; // 物料编号
    outPositionCode?: string; // 调出仓位代码
    outStoreLocationCode?: string; // 调出库位代码
    outProjectCode?: string; // 调出项目编号
    inPositionCode?: string; //调入仓位代码
    inStoreLocationCode?: string; // 调入库位代码
    inProjectCode?: string; // 调入项目编号
    batchNo?: string; // 批次号
    moveNum?: number; // 移库数量
    moveUnitCode?: string; // 移库单位
    basicNum?: number; // 基本数量
    basicUnit?: string; // 基本单位
    outPositionList?: any[];
    inPositionList?: any[];
};

export type ResQueryPositionListByParam = {
    orgCode: string; //
    orgName: string; // 组织名称
    code: string; // 编号
    name: string; // 名称
    type: string; // 类型
    attribute: string; // 属性
    address: string; // 地址
    remark: string; // 备注
    isUsed: number; // 是否启用标志 0=否 1=是
    tenantId: number; // 租户id
    createUserName: string; // 创建人
    createDateTime: any;
    defaultQualified: number; // 默认合格仓
    defaultDisqualified: number; // 默认不合格仓
};

// 查询物料库存信息
export type MaterialStorePopRespDtos = {
    orgName: string;
    projectCode: string;
    batchNo: string;
    materialCode: string;
    materialName: string;
    materialType: string;
    positionCode: string;
    positionName: string;
    storeLocationCode: string;
    storeLocationName: string;
    basicNum: number;
    basicUnit: string;
};

// 盘点导出按钮
export type ReqQueryExecute = {
    sortedField: string;
    sortByAsc: boolean;
    mainEntityCode: string;
    page: number;
    pageSize: number;
    requiredFields: string[];
    conditions: {
        conditionFieldName?: string;
        values?: string[];
        type?: string;
        value?: string;
        valueType?: string;
    }[];
    tableHeaderConfig?: any[];
};

// 物料退货单
export type MaterialReturn = {
    materialReturnNo: string; //退货单号
    returnTypeCode: string; //退货类型 0||1
    arrivalNo: string; // 到货单号,按到货单号退货
    moveTypeCode: string; //退货移动类型编码
    customerSupplierCode: string; //供应商编号
    remarks: string; //备注
    returnNo?: string;
    materialReturnDetailAddReqDtos: MaterialReturnDetailAddReqDto[]; //物料明细
};

export type MaterialReturnDetailAddReqDto = {
    projectCode: string; //项目编号
    batchNo: string; //批次号
    purchaseOrderNo: string; //采购订单号
    materialCode: string; //物料编号
    returnNum: number; //退货数量
    returnBasicNum: number; //退货基本数量
    returnUnitCode: string; //退货单位编码
    positionCode: string; //仓位编码
    storeLocationCode: string; //库位代码
    descriptions: string; //说明
    orgCode: string; //所属组织编号
};
