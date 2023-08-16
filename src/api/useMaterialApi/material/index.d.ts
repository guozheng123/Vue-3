export interface ReqQueryMaterialPopoutListByPage {
    total: number;
    page: number;
    pageSize: number;
    totalPage: number;
    orderRule: string;
    id: number;
    filterIds: any[];
    filterCodes: any[];
    tenantId: number;
    materialCode: string;
    materialCodes: string[];
    materialName: string; //物料名称
    materialTypeCode: string; //物料类型编号
    materialUnitCode: string; //物料单位
    theirOrganizeCode: string; //所属组织编号
    theirCompanyCode: string; //所属公司编号
    theirFactoryCode: string; //所属工厂编号
    partsType: string; //零件类型 0非标件 1标准件
    makeFlag: string; //自制件标记
    buyFlag: string; //采购件标记
    blankingFlag: string; //下料件标志
    virtualFlag: string; //虚拟件标志
    materialMinInventory: number; //最小库存
    materialMaxInventory: number; //最大库存
    supervisorModeCode: string; //管理方式 0按单管理 1序列管理 2批次管理
    inspectionTypeCode: string; //检验类型
    inspectionSchemeCode: string; //检验方案
    qnWarehouseCode: string; //合格品仓库
    noWarehouseCode: string; //不合格品仓库
    deleted: string;
    createUser: string;
    modifyUser: string;
    remark: string;
    createDatetimeStart: string;
    createDatetimeEnd: string;
    modifyDatetimeStart: string;
    modifyDatetimeEnd: string;
    totalPageValue: number;
    enable: string;
}

export interface ResQueryMaterialPopoutListByPage {
    id: number;
    tenantId: number;
    materialCode: string;
    materialName: string;
    materialTypeCode: string;
    materialTypeName: string;
    materialUnitCode: string;
    materialUnitName: string;
    materialSpec: string;
    theirCompanyCode: string;
    theirCompanyName: string;
    theirFactoryCode: string;
    theirFactoryName: string;
    theirOrganizeName: string;
    figureNum: string;
    partsType: string;
    makeFlag: string;
    buyFlag: string;
    blankingFlag: string;
    virtualFlag: string;
    materialPropertyArr: string[];
    materialMinInventory: number;
    materialMaxInventory: number;
    supervisorModeCode: string;
    supervisorModeName: any;
    inspectionTypeCode: string;
    inspectionTypeName: string;
    inspectionSchemeCode: string;
    inspectionSchemeName: string;
    qnWarehouseCode: string;
    qnWarehouseName: string;
    qnStoreLocationCode: any;
    noWarehouseCode: string;
    noWarehouseName: string;
    noStoreLocationCode: any;
    deleted: string;
    createUser: string;
    createUserName: any;
    createDatetime: string;
    modifyUser: string;
    modifyDatetime: string;
    remark: string;
    materialProcessList: MaterialProcessList[];
}

export interface MaterialProcessList {
    total: number;
    page: number;
    pageSize: number;
    totalPage: number;
    userId: any;
    orderRule: any;
    id: number;
    materialId: number;
    processCode: string;
    processVersion: number;
    processName: string;
    defaultProcess: string;
    createUser: any;
    createDatetime: any;
    createDatetimeStart: any;
    createDatetimeEnd: any;
    modifyDatetimeStart: any;
    modifyDatetimeEnd: any;
    versions: number[];
}

export interface ResGetAccBomInfoList {
    id: number;
    tenantId: any;
    materialCode: string;
    materialName: string;
    materialTypeCode: string;
    materialTypeName: string;
    materialUnitCode: string;
    materialUnitName: string;
    materialSpec: string;
    theirCompanyCode: string;
    theirCompanyName: string;
    theirFactoryCode: string;
    theirFactoryName: string;
    theirOrganizeName: string;
    figureNum: string;
    partsType: string;
    makeFlag: string;
    buyFlag: string;
    blankingFlag: string;
    virtualFlag: string;
    materialPropertyArr: string;
    materialMinInventory: string;
    materialMaxInventory: string;
    supervisorModeCode: string;
    supervisorModeName: string;
    inspectionTypeCode: string;
    inspectionTypeName: string;
    inspectionSchemeCode: string;
    inspectionSchemeName: string;
    qnWarehouseCode: string;
    qnWarehouseName: string;
    qnStoreLocationCode: string;
    noWarehouseCode: string;
    noWarehouseName: string;
    noStoreLocationCode: string;
    deleted: string;
    defaultProcess: string;
    createUser: string;
    createUserName: string;
    createDatetime: string;
    modifyUser: string;
    modifyUserName: string;
    modifyDatetime: string;
    remark: string;
    batchNumber: string;
    bomRatio: number;
    materialProcessList: string;
}

export type IResGetMaterialDataList = {
    materialCode: string;
    materialName: string;
    materialTypeCode: string;
    materialUnitCode: string;
    theirOrganizeCode: string;
    theirOrganizeType: string;
    pageSize: number;
    page: number;
    partsType: string;
    materialMinInventory: number;
    materialMaxInventory: number;
    inspectionTypeCode: string;
    inspectionSchemeCode: string;
    qnWarehouseCode: string;
    noWarehouseCode: string;
    remark: string;
    createUser: string;
    createDatetime: Array<any>;
    createDatetimeStart: string;
    createDatetimeEnd: string;
    modifyUser: string;
    modifyDatetime: Array<any>;
    modifyDatetimeStart: string;
    modifyDatetimeEnd: string;
    materialProcessList: Array<any>;
    materialCauseList: Array<any>;
    materialMbomList: Array<any>;
    materialFileList: Array<any>;
    theirCompanyCode: string;
    theirFactoryCode: string;
    materialPropertyArr: Array<any>;
    materialTypeCodeArr: Array<any>;
};
export type IReqGetMaterialDataList = {
    materialCode: string;
    materialName: string;
    materialTypeCode: string;
    materialUnitCode: string;
    theirOrganizeCode: string;
    theirOrganizeType: string;
    pageSize: number;
    page: number;
    partsType: string;
    supervisorModeCode: string;
    createUser: string;
    createDatetime: Array<any>;
    createDatetimeStart: string;
    createDatetimeEnd: string;
    modifyUser: string;
    modifyDatetime: Array<any>;
    modifyDatetimeStart: string;
    modifyDatetimeEnd: string;
    enable: string;
};
export type IResGetTreeList = {
    id: string;
    label: string;
    children: Array<IResGetTreeList>;
};

export interface ReqExportMaterialExcelFile {
    total: number;
    page: number;
    pageSize: number;
    totalPage: number;
    orderRule: string; //排序规则
    id: number; //自增id
    filterIds: number[]; //过滤id数组
    tenantId: number; //租户ID
    materialCode: string; //物料编号
    materialCodes: string[]; //物料编号数组
    materialName: string; //物料名称
    materialTypeCode: string; //物料类型编号
    materialUnitCode: string; //物料单位
    theirOrganizeCode: string; //所属组织编号
    theirCompanyCode: string; //所属公司编号
    theirFactoryCode: string; //所属工厂编号
    partsType: string; //零件类型 0非标件 1标准件
    makeFlag: string; //自制件标记
    buyFlag: string; //采购件标记
    blankingFlag: string; //下料件标志
    virtualFlag: string; //虚拟件标志
    materialMinInventory: number; //最小库存
    materialMaxInventory: number; //最大库存
    supervisorModeCode: string; //管理方式 0按单管理 1序列管理 2批次管理
    inspectionTypeCode: string; //检验类型
    inspectionSchemeCode: string; //检验方案
    qnWarehouseCode: string; //合格品仓库
    noWarehouseCode: string; //不合格品仓库
    deleted: string; //是否删除（0未删除 1已删除）
    createUser: string; //创建人
    modifyUser: string; //修改人
    remark: string; //备注
    createDatetimeStart: string; //创建时间开始
    createDatetimeEnd: string; //创建时间结束
    modifyDatetimeStart: string; //修改时间开始
    modifyDatetimeEnd: string; //修改时间结束
    totalPageValue: number;
    tableHeaderConfig: any[];
}

export interface ResQueryMaterialListByPage {
    id: number;
    tenantId: number;
    materialCode: string;
    materialName: string;
    materialTypeCode: string;
    materialTypeName: string;
    materialUnitCode: string;
    materialUnitName: string;
    materialSpec?: any;
    theirCompanyCode: string;
    theirCompanyName: string;
    theirFactoryCode?: any;
    theirFactoryName?: any;
    theirOrganizeName: string;
    figureNum: string;
    partsType: string;
    makeFlag: string;
    buyFlag: string;
    blankingFlag: string;
    virtualFlag: string;
    materialPropertyArr: string[];
    materialMinInventory: number;
    materialMaxInventory: number;
    supervisorModeCode: string;
    inspectionTypeCode: string;
    inspectionTypeName?: any;
    inspectionSchemeCode: string;
    inspectionSchemeName?: any;
    qnWarehouseCode: string;
    qnWarehouseName: string;
    qnStoreLocationCode?: any;
    noWarehouseCode: string;
    noWarehouseName: string;
    noStoreLocationCode?: any;
    deleted: string;
    createUser: string;
    createUserName?: any;
    createDatetime: string;
    modifyUser: string;
    modifyDatetime: string;
    remark: string;
    materialProcessList: any[];
    materialReplaceMaterialList: any;
}
