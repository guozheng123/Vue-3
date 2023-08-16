export interface ReqEditMaterialUnit {
    id: number;
    materialUnitCode: string; //计量单位编号
    materialUnitName: string; //计量单位名称
    defaultFlag: string; //默认标志（0：不默认，1：默认）
    status: string; //状态（是否启用0:不启用,1:启用）
}
export interface ReqAddMaterialUnit {
    materialUnitCode: string; //计量单位编号
    materialUnitName: string; //计量单位名称
    defaultFlag: string; //默认标志（0：不默认，1：默认）
    status: string; //状态（是否启用0:不启用,1:启用）
}
export interface ReqGetMaterialUnitByTenantId {
    total: number;
    page: number;
    pageSize: number;
    totalPage: number;
    orderRule: string; //排序规则
    materialUnitCode: string; //计量单位编号
    materialUnitName: string; //计量单位名称
    defaultFlag: string; //默认标志（0：不默认，1：默认
    status: string; //状态（是否启用0:不启用,1:启用
    createUser: string; //创建人
    modifyUser: string; //修改人
    createDatetimeStart: string; //创建时间开始
    createDatetimeEnd: string; //创建时间结束
    modifyDatetimeStart: string; //修改时间开始
    modifyDatetimeEnd: string; //修改时间结束
    totalPageValue: number;
}
export interface ReqQueryMaterialUnitListByPage {
    total: number;
    page: number;
    pageSize: number;
    totalPage: number;
    orderRule: string; //排序规则
    materialUnitCode: string; //计量单位编号
    materialUnitName: string; //计量单位名称
    defaultFlag: string; //默认标志（0：不默认，1：默认）
    status: string; //状态（是否启用0:不启用,1:启用
    createUser: string; //创建人
    modifyUser: string; //修改人
    createDatetimeStart: string; //创建时间开始
    createDatetimeEnd: string; //创建时间结束
    modifyDatetimeStart: string; //修改时间开始
    modifyDatetimeEnd: string; //修改时间结束
    totalPageValue: number;
}
