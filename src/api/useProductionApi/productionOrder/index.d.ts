import { ExportTableHeaderConfig } from '@/types';

export type IProductionOrderList = {
    partsVersionId: string;
    drawingBomAccId: string;
    productionOrderId: string; //生产订单id
    companyCode: number; //公司编码
    factoryCode: number; //工厂编码
    productionOrderCode: string; //生产订单编号
    statusCode: string; //订单状态 0创建 1部分下达 2全部下达 3完工 4强制完工 5强制关闭
    projectCode: string; //项目编号
    projectName: string; //项目名称
    projectGroupCode: string; //项目集编号
    projectGroupName: string; //项目集名称
    orderTypeCode: string; //订单类型 PRODUCTION:生产订单,REPAIR:返修订单
    orderSource: string; //订单来源 0生产、1非标、2返工修、3图纸云
    plannedStartDate: string; //计划开始日期
    plannedEndDate: string; //计划结束日期
    actualStartDatetime: string; //实际开始时间
    actualEndDatetime: string; //实际结束时间
    requirementDate: string; //订单交期
    equipmentDebug: string; //是否装备调试（0否 1是）
    reportInOrder: string; //是否顺序报工（0否 1是）
    overProduction: string; //是否超产(0否 1是)
    overProductionRatio: string; //超产比例
    confirmLogic: string; //报工计算逻辑 1主零件，2子零件
    remark: string; //备注
    materialCode: string; //物料编号
    materialName: string; //物料名称
    materialSpc: string; //物料规格
    materialUnitText: string; //物料单位
    plannedQuantity: string; //计划数量
    releasedQuantity: string; //已下达数量
    overProduceQuantity: string; //超产数量
    customerSupplierCode: string; //客户/供应商编号
    customerSupplierName: string; //单位名称
    customerOrder: string; //客户单号
    customerOrderNum: string; //客户单行号
    externalErpNum: string; //外部订单号
    externalErpRowNum: string; //外部订单行号
    price: string; //销售单价（元）含税单价
    customerQuotationPrice: string; //客户报价（元）
    priceExcludingTax: string; //未税单价
    manufactureFee: string; //加工报价（元）
    manufactureAccountFee: string; //加工核价（元）
    taxRate: string; //税率(%)
    figureNum: string; //图号
    createUserName: string; //创建人名称
    createDatetime: string; //创建时间
    modifyUserName: string; //修改人名称
    modifyDatetime: string; //修改时间
    processCode: string; //工艺编号
    processName: string; //工艺名称
    processRev: string; //工艺版本
    productOrderCode: string; //产品订单编号
    dockingStatus: string; //对接状态 0已通知 1生单成功 2生单失败
    fullSetRate: string; //是否齐套
    bomStatus: string; //工序bom维护状态 0未维护 1已维护
    drawingBomAccId: string; //图纸云物料清单id
    batchSerialNo: string; //批次序号
    productionBatchNum: string; //订单批次
    oneLevelMaterialCode: string; //父级物料编号
    oneLevelMaterialText: string; //父级物料名称
    twoLevelMaterialCode: string; //二层父级物料编号
    twoLevelMaterialText: string; //二层父级物料名称
    twoMaterialCode: string; //二层物料编号
    twoMaterialText: string; //二层物料名称
    lotNum: string; //批号
    productType: string; //产品类型
    billNo: string; //清单编号
};

export type IProductionOrderInfo = {
    workshopCode: string;
    productionOrderId: number;
    companyCode: string;
    companyName?: any;
    factoryCode: string;
    factoryName?: any;
    productionOrderCode: string;
    statusCode: string;
    projectCode: string;
    projectName: string;
    projectGroupCode: string;
    projectGroupName: string;
    orderTypeCode: string;
    orderSource?: any;
    plannedStartDate: string;
    plannedEndDate: string;
    actualStartDatetime?: any;
    actualEndDatetime?: any;
    requirementDate: string;
    equipmentDebug: string;
    reportInOrder: string;
    overProduction: string;
    overProductionRatio?: any;
    confirmLogic: string;
    remark: string;
    materialCode: string;
    materialName?: any;
    materialSpc?: any;
    materialUnitText?: any;
    plannedQuantity: number;
    releasedQuantity: number;
    overProduceQuantity?: any;
    completedQuantity: number;
    repairQuantity: number;
    scrappedQuantity: number;
    customerSupplierCode: string;
    customerSupplierName?: any;
    customerOrder: string;
    customerOrderNum?: any;
    externalErpNum: string;
    externalErpRowNum: number;
    price: number;
    customerQuotationPrice: number;
    priceExcludingTax: number;
    manufactureFee: number;
    manufactureAccountFee: number;
    taxRate: number;
    figureNum: string;
    createUserName?: any;
    createDatetime: string;
    modifyUserName?: any;
    modifyDatetime: string;
    drawingFlag?: any;
    processCode: string;
    processName?: any;
    processRev?: any;
    productOrderCode?: any;
    dockingStatus?: any;
    fullSetRate?: any;
    bomStatus?: any;
    drawingBomAccId?: any;
    batchSerialNo?: any;
    productionBatchNum?: any;
    sourceNo?: any;
    drawingBomModifyDatetime?: any;
    oneLevelMaterialCode?: any;
    oneLevelMaterialText?: any;
    twoLevelMaterialCode?: any;
    twoLevelMaterialText?: any;
    twoMaterialCode?: any;
    twoMaterialText?: any;
    lotNum?: any;
    productType?: any;
    billNo?: any;
    compulsoryExecutionFlag: any;
    productionOrderProcessVoList: TypeProductionOrderProcessVoList[];
    productionOrderFileVoList: any[];
    [k: string]: any;
};

export type TypeProductionOrderProcessVoList = {
    defaultFlag: string;
    processCode: string;
    processName: string;
    processVersion: number;
};

export type IProjectWordList = {
    projectId: string; //项目id
    projectCode: string; //项目编号
    projectName: string; //项目名称
    projectGroupId: string; //项目集id
};
export type ProductionOrderByIdType = {
    diyFieldData: Record<string, any>;
    productionOrder: Record<string, any>;
    productionOrderMaterial: Record<string, any>;
    productionOrderCustomer: Record<string, any>;
    productionOrderProcessVoList: Record<string, any>[];
    productionOrderFileVoList: TpfUploadFile[];
};

export type ReqEditProductionOrderChange = {
    productionOrderId: number;
    changeType: string;
    changeContent: string;
    changeReason: string;
    problemPointNum: string;
    originalProductionOrderCode: string;
};

export type ResGetProductionOrderChange = {
    changeContent: string;
    changeReason: string;
    changeType: string;
    originalProductionOrderCode: string;
    problemPointNum: string;
    productionOrderId: string;
};

export interface EditVoType {
    id: number;
    tenantId: number;
    factoryCode: string;
    operationCode: string;
    operationName: string;
    operationTypeCode: string;
    remark: string;
    forbidden: string;
    workUnitTypeCode: string;
    standardCapacity: number;
    standardTime: number;
    standardTimeUnit: string;
    minCapacity: number;
    maxCapacity: number;
    auxiliaryTime: number;
    auxiliaryTimeUnit: string;
    pricePerTime: number;
    pricePerTimeUnit: string;
    singlePlanHours: number;
    singlePlanHoursUnit: string;
    plannedStartTime: string;
    plannedEndTime: string;
    plannedQuantity: number;
    pricePerQuantity: number;
    workUnitCode: string;
    userCode: string;
    deleted: string;
    createUser: string;
    createDatetime: string;
    modifyUser: string;
    modifyDatetime: string;
    version: number;
    rowNum: number;
}

export type ResGetProductionOrderProcessOperation = {
    productionOrderId: number;
    projectCode: string;
    projectName: string;
    materialCode: string;
    materialName: string;
    materialSpc: string;
    materialUnitText: string;
    plannedQuantity: number;
    figureNum: string;
    operationCount: number;
    productionOrderProcessVoList: ProductionOrderProcessAddVoList;
};

export interface ProductionOrderProcessAddVoList {
    runtimeProcessId: number;
    runtimeProcessCode: string;
    runtimeProcessName: string;
    processVersion: number;
    companyCode: string;
    factoryCode: string;
    releaseFlag: string;
    defaultFlag: string;
    createUser: string;
    createDatetime: string;
    modifyUser: string;
    modifyDatetime: string;
    versions: number[];
    operationInfos: OperationInfoType[];
}

export interface OperationInfoType {
    id: number;
    tenantId: number;
    factoryCode: string;
    operationCode: string;
    operationName: string;
    operationTypeCode: string;
    remark: string;
    forbidden: string;
    workUnitTypeCode: string;
    standardCapacity: number;
    standardTime: number;
    standardTimeUnit: string;
    minCapacity: number;
    maxCapacity: number;
    auxiliaryTime: number;
    auxiliaryTimeUnit: string;
    pricePerTime: number;
    pricePerTimeUnit: string;
    singlePlanHours: number;
    singlePlanHoursUnit: string;
    pricePerQuantity: number;
    workUnitCode: string;
    userCode: string;
    deleted: string;
    createUser: string;
    createDatetime: string;
    modifyUser: string;
    modifyDatetime: string;
    version: number;
    rowNum: number;
    [k: string]: any;
}

export type ResGetProductionOrderOperationBomList = {
    id: number;
    bomId: number;
    bomVersion: string;
    operationCode: string;
    operationId: number;
    operationName: string;
    parentBomId: number;
    rowNum: number;
    version: string;
    materialCode: string;
};

export interface ReqEditProductionOrderProcess {
    productionOrderId: number;
    productionOrderCode: string;
    productionOrderProcessVoList: Partial<ProductionOrderProcessVoList>[];
}

export interface ProductionOrderProcessVoList {
    processCode: string;
    processName: string;
    processVersion: number;
    defaultFlag: string;
    versions: number[];
}

export type ReqBatchEditProductionOrderProcess = {
    processCode: string;
    processVersion: number;
    ids: number[];
};

export interface ReqQueryProductionOrderListByPage {
    sortByAsc: boolean;
    sortedField: string;
    total: number;
    page: number;
    pageSize: number;
    totalPage: number;
    orderRule: string; //排序规则
    companyCode: string; //公司编码
    factoryCode: string; //工厂编码
    productionOrderCode: string; //生产订单编号
    projectCode: string; //项目编号
    projectName: string; //项目名称
    figureNum: string; //图号
    materialCode: string; //物料编号
    materialName: string; //物料名称
    statusCodes: string[]; //订单状态多选数组
    requirementDateStart: string; //订单交期结束
    productOrderCode: string; //产品订单编号
    processCode: string; //默认工艺编号
    processVersion: number; //默认工艺版本
    sourceNo: string; //来源单号
    customerOrder: string; //客户单号
    externalErpNum: string; //外部订单号
    projectGroupCode: string; //项目集编号
    projectGroupName: string; //项目集名称
    createUserName: string; //创建人
    modifyUserName: string; //修改人
    compulsoryExecutionFlag: string; //是否强制执行 0否 1是
    orderTypeCode: string; //订单类型 PRODUCTION:生产订单,REPAIR:返修订单
    reportInOrder: string; //是否顺序报工（0否 1是）
    overProduction: string; //是否超产(0否 1是)
    orderSource: string; //订单来源 0生产、1非标、2返工修、3图纸云
    confirmLogic: string; //报工计算逻辑 1主零件，2子零件
    bomStatus: string; //工序bom维护状态 0未维护 1已维护
    createDatetimeStart: string; //创建时间开始
    createDatetimeEnd: string; //创建时间结束
    modifyDatetimeStart: string; //修改时间开始
    modifyDatetimeEnd: string; //修改时间结束
    totalPageValue: number;
}

export interface ReqAddProductionOrder {
    productionOrder: ProductionOrder;
    productionOrderMaterial: Partial<ProductionOrderMaterial>;
    productionOrderCustomer: Partial<ProductionOrderCustomer>;
    productionOrderProcessVoList: Partial<ProductionOrderProcessVoList>[];
    productionOrderFileVoList: Partial<ProductionOrderFileVoList>[];
}

interface ProductionOrderFileVoList {
    fileCode: number;
    fileName: string;
}

interface ProductionOrderProcessVoList {
    processCode: string;
    processName: string;
    processVersion: number;
    defaultFlag: string;
}

interface ProductionOrderCustomer {
    customerSupplierCode: string; //客户/供应商编号
    customerOrder: string; //客户单号
    externalErpNum: string; //外部订单号
    externalErpRowNum: number; //外部订单行号
    price: number; //销售单价（元）含税单价
    customerQuotationPrice: number; //客户报价（元）
    priceExcludingTax: number; //未税单价
    manufactureFee: number; //加工报价（元）
    manufactureAccountFee: number; //加工核价（元）
    taxRate: number; //税率(%)
}

interface ProductionOrderMaterial {
    productionOrderCode: string; //生产订单编号
    materialCode: string; //物料编号
    figureNum: string; //图号
    plannedQuantity: number; //计划数量
}

interface ProductionOrder {
    projectCode: string; //项目编号
    projectGroupCode: string; //项目集编号
    orderTypeCode: string; //订单类型 PRODUCTION:生产订单,REPAIR:返修订单
    plannedStartDate: string; //计划开始日期
    plannedEndDate: string; //计划结束日期
    requirementDate: string; //订单交期
    companyCode: string; //公司编码
    factoryCode: string; //工厂编码
    equipmentDebug: string; //是否装备调试（0否 1是）
    reportInOrder: string; //是否顺序报工（0否 1是）
    overProduction: string; //是否超产(0否 1是)
    overProductionRatio: number; //超产比例
    confirmLogic: string; //报工计算逻辑 1主零件，2子零件
    remark: string; //备注
}

export type ReqReleaseProductionOrder = {
    productionOrderId: number;
    processCode: string;
    processVersion: number;
    workshopCode: string;
    plannedQuantity: number;
    plannedStartDate: string;
    plannedEndDate: string;
    [k: string]: any;
}[];

export interface ReqSaveProductionOrderOperationBomDetail {
    productionOrderId: number; //生产订单id
    bomId: number; //BomId
    operationId: number; //工序id
    operationCode: string; //工序编码
    bomVersion: string; //bom版本
    bomDetailEditVoList: Partial<BomDetailEditVoList>[]; //工序bom列表
}

interface BomDetailEditVoList {
    bomId: number; //BomID
    bomVersion: string; //BOM版本
    materialCode: string; //物料编号
    num: number; //数量
}

export interface ReqExportProductionOrderExcelFile extends ReqQueryProductionOrderListByPage {
    tableHeaderConfig: ExportTableHeaderConfig;
    sortedField: string;
    sortByAsc: boolean;
}
