export interface MaterialPreparationDetailsList {
    materialName: string; //物料名称
    materialCode: string; //物料编号
    materialVersion: string; //物料版本号(图纸云推送)
    planNum: number; //计划数
    techCode: string; //工步
    warehouseCode: string; //仓库编号
    isBonded: string; //是否保税(0：否，1：是)
    purchaserSupplyFlag: string; //是否采购商供货(0：否，1：是)
    proportion: number; //比例数
    recoveryFlag: string; //是否回收 (0：否，1：是)
    memo: string; //备注
    id?: number;
}

export interface ResGetMaterialPreparationById {
    materialPreparationId: number; //备料清单id
    tenantId: number; //租户id
    materialPreparationCode: string; //备料单编号
    businessCode: string; //业务单编号（生产订单/）
    businessType: string; //业务类型（0：生产订单 ）
    projectCode: string; //项目编号
    statusCode: string; //状态(0、待生成，1、已生成）
    source: string; //备料清单来源 0图纸云
    resultFlag: number; //是否能创建领料单(0否1是)
    deleted: string; //删除标识（0未删除，1已删除）
    createUser: number; //创建者
    createDateTime: string; //创建时间
    modifyUser: number; //修改者
    modifyDateTime: string; //修改时间
    materialPreparationDetails: MaterialPreparationDetailsList[];
}

export interface ReqEditMaterialPreparation {
    materialPreparationId: number; //备料清单id
    materialPreparationCode: string; //备料单编号
    materialPreparationDetails: MaterialPreparationDetailsList[];
}
