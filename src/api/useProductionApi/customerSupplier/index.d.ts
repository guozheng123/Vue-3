export interface QueryPopCustomerSupplierListByPageList {
    customerSupplierId: number; // 单位id
    customerSupplierCode: string; // 单位编号
    customerSupplierName: string; //单位名称
    companyId: number; // 公司id
    companyName: string; // 公司名称
    customerSupplierShortName: string; // 单位简称
    customerSupplierType: string; // 单位类型 CUSTOMER客户 SUPPLIER供应商
    deliveryType: string; // 发货模式 BYCUSTOMER按客户 BYBATCH按订单批次
    forbidden: string; // 是否启用 0未启用 1启用
    remark: string; // 备注
    contacts: string; // 联系人
    telephone: string; // 电话
    email: string; // 邮箱;
    province: string; //  省;
    city: string; // 市;
    area: string; // 区;
    address: string; // 详细地址;
    createUserName: string; // 创建人名称;
    createDatetime: string; // 创建时间;
    modifyUserName: string; // 修改人名称;
    modifyDatetime: string; // 修改时间;
}

export interface ReqQueryPopCustomerSupplierListByPageList {
    total?: number; //
    page?: number; //
    pageSize?: number; //
    totalPage?: number; //
    orderRule?: string; // 排序规则
    customerSupplierCode?: string; // 单位编号
    customerSupplierName?: string; // 单位名称
    customerSupplierType?: string; // 单位类型 CUSTOMER客户 SUPPLIER供应商
    forbidden?: string; //     是否启用 0未启用 1启用
    exclusionCodes?: any[];
    totalPageValue?: number;
}
