export interface AddWorkshopSection {
    operationRequestVos: operationRequestVos;
    WorkshopSectionVo: WorkshopSectionVo;
}
interface operationRequestVos {
    operationCode: string; // 工序编号
    operationName: string; // 工序名称
    operationTypeCode: string; // 工序类型编号
}

interface WorkshopSectionVo {
    workshopSectionId: number;
    workshopSectionCode: string; // 工段编号
    workshopSectionName: string; // 工段名称
    departmentCode: string; // 部门编号
    departmentName: string; // 部门名称
    remark: string; // 备注
    enabled: string; // 是否启用0：未启用 1：启用
    createUser: string; // 创建人
    createDatetime: string; // 创建日期
    modifyUser: string; // 修改人
    modifyDatetime: string; // 修改日期
}

export interface RootObject {
    workshopSectionVo: WorkshopSectionVo;
    operationRequestVos: OperationRequestVo[];
}

interface OperationRequestVo {
    operationCode: string;
    operationName: string;
    operationTypeCode: string;
}

interface WorkshopSectionVo {
    workshopSectionId: number;
    workshopSectionCode: string;
    workshopSectionName: string;
    departmentCode: string;
    departmentName: string;
    remark: string;
    enabled: number;
    createUser: string;
    createDatetime: string;
    modifyUser: string;
    modifyDatetime: string;
}
