export interface ReqEditMaterialType {
    id: number; //自增id
    materialTypeCode: string; //物料类型编号
    materialTypeName: string; //物料类型编号
    materialTypeParentCode: string; //父节点编号
    deleted: string; //是否删除（0未删除 1已删除)
    createUser: string; //创建人
    createDatetime: string; //创建时间
    modifyUser: string; //修改人
    modifyDatetime: string; //修改时间
    remark: string; //备注
}

export type IReqGetTreeList = {
    // materialTypeCode: string;
    materialTypeName: string;
    materialTypeParentCode: string;
};

export type ResGetMaterialTypeTree = {
    id: string;
    label: string;
    children: ResGetMaterialTypeTree[];
};
