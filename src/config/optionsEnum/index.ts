//省市区三级联动选项
export { regionData } from 'element-china-area-data';
import { regionData } from 'element-china-area-data';

export const statusOption = [
    { value: '', label: '所有' },
    { value: 1, label: '是' },
    { value: 0, label: '否' }
];
export const userStatusOption = [
    { value: null, label: '所有' },
    { value: 1, label: '是' },
    { value: 0, label: '否' }
];

export const statusNumberOption = [
    { value: 1, label: '是' },
    { value: 0, label: '否' }
];
export const addOperationTypeNameListOptions = [
    { label: '生产', value: 'PRODUCTION' },
    { label: '质量', value: 'QUALITY' },
    { label: '外协', value: 'OUTSOURCING' },
    { label: '下料', value: 'BLANK' }
];

/**
 * 出入库类型
 */
export const isHideOption = [
    { value: '', label: '所有' },
    { value: 1, label: '是' },
    { value: 0, label: '否' }
];

export const statusOptionStr = [
    { value: '', label: '所有' },
    { value: '1', label: '是' },
    { value: '0', label: '否' }
];
export const customerSupplierType = [
    { label: '所有', value: '' },
    { value: 'CUSTOMER', label: '客户' },
    { value: 'SUPPLIER', label: '供应商' }
];
export const deliveryType = [
    { value: 'BYCUSTOMER', label: '按客户' },
    { value: 'BYBATCH', label: '按订单批次' }
];
export const operationTypeNameListOptions = [
    { label: '所有', value: '' },
    { label: '生产', value: 'PRODUCTION' },
    { label: '质量', value: 'QUALITY' },
    { label: '外协', value: 'OUTSOURCING' },
    { label: '下料', value: 'BLANK' }
];
//仓位属性
export const storePosition = [
    { label: '所有', value: '' },
    { label: '良品', value: 'y' },
    { label: '不良品', value: 'n' }
];
//是否启用
export const isStart = [
    { label: '所有', value: '' },
    { label: '是', value: '1' },
    { label: '否', value: '0' }
];

//.出入库类型
export const receiptIssueType = [
    { label: '入库', value: 0 },
    { label: '出库 ', value: 1 },
    { label: '出入库', value: 2 }
];

//.零件类型
export const workshopNameOpt = [
    { value: '', label: '所有' },
    { value: '0', label: '非标件' },
    { value: '1', label: '标准件' }
];
//.管理方式
export const managementOpt = [
    { value: '', label: '所有' },
    { value: '0', label: '按单管理' },
    { value: '1', label: '批次管理' },
    { value: '2', label: '序列管理' }
];
//.物料单位
export const materialUnitCodeOpt = [
    { value: '', label: '所有' },
    { value: 'J', label: '件' },
    { value: 'G', label: '个' }
];
//菜单类型
export const MENU_TYPE = [
    { label: '所有', value: '' },
    { label: '目录', value: 'M' },
    { label: '菜单 ', value: 'C' },
    { label: '按钮', value: 'F' }
];

//菜单类型
export const menuType = [
    { label: '所有', value: '' },
    { label: '模块', value: 'M', disabled: false },
    { label: '界面 ', value: 'C', disabled: false },
    { label: '功能', value: 'F', disabled: true }
];

//平台类型
export const TREEACE_TYPE = [
    { label: '所有', value: '' },
    { label: 'pc平台', value: 'pc' },
    { label: 'app平台 ', value: 'app' },
    { label: 'pad平台', value: 'pad' },
    { label: 'PDA平台', value: 'pda' }
];
//行业
export const TRADE = [
    { label: '所有', value: '' },
    { label: '装备', value: '0' },
    { label: '机加 ', value: '1' },
    { label: '综合', value: '2' }
];
export const TRADE2 = [
    { label: '装备', value: '0' },
    { label: '机加 ', value: '1' },
    { label: '综合', value: '2' }
];

/**
 * 生产状态
 */
const productionStatus = [
    { label: '正常', value: '0' },
    { label: '返修', value: '1' }
];

/**
 * 生产状态
 */
const orderTypeCodeEnum = [
    { label: '', value: 'PRODUCTION' },
    { label: '返修订单', value: 'REPAIR' }
];
/**
 * 订单类型
 */
const productionOrderTypeCodeEnum = [
    { label: '生产订单', value: 'PRODUCTION' },
    { label: '返修订单', value: 'REPAIR' },
    { label: '委外订单', value: 'OUTSOURCING' }
];

/**
 * 是否装备调试
 */
const equipmentDebugEnum = [
    { label: '否', value: '0' },
    { label: '是', value: '1' }
];
/**
 * 是否顺序报工
 */
const reportInOrderEnum = [
    { label: '否', value: '0' },
    { label: '是', value: '1' }
];
/**
 * 是否超产
 */
const overProductionEnum = [
    { label: '否', value: '0' },
    { label: '是', value: '1' }
];

/**
 * 报工计算逻辑
 */
const confirmLogicEnum = [
    { label: '主零件', value: '1' },
    { label: '子零件', value: '2' }
];

/**
 * 工单状态  name -  颜色
 */
const statusNameColor = [
    { value: '创建', label: '#1266fe' },
    { value: '未投产', label: '#1266fe' },
    { value: '未入库', label: '#1266fe' },
    { value: '未发布', label: '#1266fe' },
    { value: '待检验', label: '#1266fe' },
    { value: '待验收', label: '#1266fe' },
    { value: '下达', label: '#7FB92D' },
    { value: '部分下达', label: '#7FB92D' },
    { value: '全部下达', label: '#7FB92D' },
    { value: '投产', label: '#7FB92D' },
    { value: '已入库', label: '#7FB92D' },
    { value: '接收', label: '#7FB92D' },
    { value: '检验中', label: '#7FB92D' },
    { value: '已检验', label: '#7FB92D' },
    { value: '验收中', label: '#7FB92D' },
    { value: '已验收', label: '#7FB92D' },
    { value: '已提交', label: '#7FB92D' },
    { value: '已生成', label: '#7FB92D' },
    { value: '报工', label: '#55cbe4' },
    { value: '发布', label: '#55cbe4' },
    { value: '强制完工', label: '#f8434a' },
    { value: '强制关闭', label: '#f8434a' },
    { value: '强制下达', label: '#f8434a' },
    { value: '完工', label: '#999' },
    { value: '拒收', label: '#999' },
    { value: '待提交', label: '#999' },
    { value: '待生成', label: '#999' },
    { value: '是', label: '#1266fe' },
    { value: '否', label: '#f8434a' },
    { value: '盘点中', label: '#f79a43' },
    { value: '盘点完成', label: '#999' }
];

export const publishOption = [
    { value: '', label: '所有' },
    { value: '1', label: '发布' },
    { value: '0', label: '未发布' }
];

export const timeUnitOption = [
    { value: 'SECOND', label: '秒' },
    { value: 'MINUTE', label: '分钟' },
    { value: 'HOUR', label: '小时' },
    { value: 'DAY', label: '天' }
];

/**
 * 信息来源
 */
export const informatioSources = [
    { value: null, label: '所有' },
    { value: 0, label: '系统内建' },
    { value: 1, label: '用户中心' }
];

/**
 * 超期
 */
export const exceedTheTimeLimit = [
    { value: null, label: '' },
    { value: 0, label: '未超期' },
    { value: 1, label: '超期' }
];

/**
 * 管理方式
 */
export const reportNumberType = [
    // { value: 'ORDER', label: '按单管理' },
    // { value: 'BATCH', label: '批次管理' },
    // { value: 'SEQ', label: '序列管理' }
    { value: '0', label: '按单管理' },
    { value: '1', label: '批次管理' },
    { value: '2', label: '序列管理' }
];

/**
 * 管理方式
 */
export const operationTaskType = [
    { value: 'ORDER', label: '按单管理' },
    { value: 'BATCH', label: '批次管理' },
    { value: 'SEQ', label: '序列管理' }
];

/**
 * 工序类型
 */
export const operationTypeCode = [
    { value: null, label: '' },
    { value: 'PRODUCTION', label: '生产' },
    { value: 'QUALITY', label: '质量' },
    { value: 'OUTSOURCING', label: '外协' },
    { value: 'ENGINEERING', label: '工程' },
    { value: 'BLANK', label: '下料' }
];
/**
 * 管理类型
 */
export const supervisorModeCode = [
    { value: '', label: '' },
    { value: '0', label: '按单管理' },
    { value: '1', label: '批次管理' },
    { value: '2', label: '序列管理' }
];
/**
 * 工单状态
 */
export const workOrderStatus = [
    { value: '', label: '' },
    { value: 'FOCLOSE', label: '强制关闭' },
    { value: 'FINISH', label: '完工' },
    { value: 'FOFINISH', label: '强制完工' },
    { value: 'START', label: '投产' },
    { value: 'UNSTART', label: '未投产' },
    { value: 'REPORT', label: '报工' }
];
/**
 * 投产类型
 */
export const startType = [
    { value: '', label: '' },
    { value: 'WORKORDER', label: '作业工单' },
    { value: 'OPERPLAN', label: '工序计划' },
    { value: 'NONE', label: '' }
];
/**
 * 工序计划状态
 */
export const operPlanStatus = [
    { value: '', label: '' },
    { value: 'SCHED', label: '已排完' },
    { value: 'SCHING', label: '排产中' },
    { value: 'UNSCH', label: '未排产' }
];
/**
 * 是否
 */
export const reportInOrder = [
    { value: null, label: '' },
    { value: '0', label: '否' },
    { value: '1', label: '是' }
];
/**
 * 订单来源
 */
export const orderSource = [
    { value: '', label: '' },
    { value: '0', label: '生产' },
    { value: '1', label: '非标' },
    { value: '2', label: '返工修' },
    { value: '3', label: '图纸云' }
];
/**
 * 工序bom维护
 */
export const bomStatus = [
    { value: '', label: '' },
    { value: '0', label: '未维护' },
    { value: '1', label: '已维护' }
];
/**
 * 入库状态
 */
export const inStatus = [
    { value: null, label: '' },
    { value: 0, label: '未入库' },
    { value: 1, label: '已入库' }
];

/**
 * 报工状态
 */
export const workReportingStatus = [
    { value: null, label: '所有' },
    { value: 'REPORTING', label: '开始' },
    { value: 'PAUSE', label: '暂停' },
    { value: 'PA_AP', label: '暂停待审批' },
    { value: 'FINISH', label: '结束' },
    { value: 'SUBMIT', label: '报工完成' }
];
/**
 * 操作状态
 */
export const actionStatus = [
    { value: null, label: '' },
    { value: '1', label: '接收' },
    { value: '0', label: '拒收' }
];
/**
 * 操作状态颜色
 */
export const actionStatusColor = [
    { value: null, label: '' },
    { value: '1', label: '#7FB92D' },
    { value: '0', label: '#B0B4B7' }
];
/**
 * 返修状态
 */
export const reworkStatus = [
    { value: null, label: '' },
    { value: '0', label: '待返修' },
    { value: '1', label: '部分返修' },
    { value: '2', label: '已返修' }
];

/**
 * 报工状态
 */
export const reportStatus = [
    { value: '', label: '所有' },
    { value: '0', label: '开始' },
    { value: '1', label: '暂停' },
    { value: '2', label: '继续' },
    { value: '2', label: '结束' },
    { value: '2', label: '提交报工' }
];
/**
 * 出入库类型
 */
export const outInStrongTypeOption = [
    { value: null, label: '-' },
    { value: 0, label: '出库' },
    { value: 1, label: '入库' }
];

/**
 * 返修状态
 */
export const repairOrderStatus = [
    { value: 'UNREPAUR', label: '未返修' },
    { value: 'PAREPAUR', label: '部分返修' },
    { value: 'BEREPAUR', label: '已返修' }
];

/**
 * 返修明细状态
 */
export const repairOrderDetailStatus = [
    { value: 'UN_REPAIR', label: '未返修' },
    { value: 'REPAIRING', label: '部分返修' },
    { value: 'REPAIRED', label: '已返修' }
];

/**
 * 报工来源
 */
export const workOrderSource = [
    { value: 'SINGLE_REPORT', label: '单工单' },
    { value: 'MULTIPLE_REPORT', label: '多工单' }
];
export const statusAcceptanceOption = [
    { value: '1', label: '合格' },
    { value: '0', label: '不合格' }
];
export const throughStatus = [
    { value: '0', label: '不通过' },
    { value: '1', label: '通过' }
];
/**
 * 检验状态
 */
export const inspectionStatus = [
    { value: '0', label: '待检验' },
    { value: '1', label: '检验中' },
    { value: '2', label: '已检验' },
    { value: '10', label: '待验收' },
    { value: '11', label: '验收中' },
    { value: '12', label: '已验收' }
];

/**
 * 物料属性
 */
export const partTypeOpt = [
    { label: '自制件', value: 'MAKE' },
    { label: '采购件', value: 'BUY' },
    { label: '下料件', value: 'BLANKING' },
    { label: '虚拟件', value: 'VIRTUAL' }
];

/**
 * 工序类型
 */
export const processOpt = [
    { label: '生产', value: 'MAKE' },
    { label: '质量', value: 'BUY' },
    { label: '外协', value: 'BLANKING' }
];

/**
 * 生产信息
 */
export const giveTime = [
    { label: '分钟', value: 'MAKE' },
    { label: '小时', value: 'BUY' },
    { label: '天', value: 'BUYS' }
];
/**
 * 订单来源
 */
export const materialOrderSource = [
    { label: '系统创建', value: '0' },
    { label: '非标', value: '1' }
];
export const InventoryStatus = [
    { label: '所有', value: '' },
    { label: '盘点中', value: '0' },
    { label: '盘点完成', value: '1' }
];
/**
 * 提交状态
 */
export const submitStatus = [
    { label: '待提交', value: '0' },
    { label: '已提交', value: '1' }
];
/**
 * 提交状态
 */
export const moveTypeList = [
    { label: '采购入库', value: 'R02' },
    { label: '委外采购入库', value: 'R03' }
];
/**
 * 其它出库移动类型
 */
export const otherOutMoveTypeList = [
    { label: '其它出库', value: 'C10' },
    { label: '报废出库', value: 'C09' }
];
/**
 * 检验结果
 */
export const checkResult = [
    { label: '合格', value: 'y' },
    { label: '不合格', value: 'n' }
];
/**
 * 检验方式
 */
export const checkType = [
    { label: '免检', value: '0' },
    { label: '全检', value: '2' },
    { label: '抽检', value: '1' }
];

/**
 * 打印模板code
 */
const printTemplateType = [
    { label: '工序流转卡模板', value: 'PROCESS_FLOW_CARD_CODE' },
    { label: '工序任务单模板', value: 'OPERATION_TASK_CODE' },
    { label: '领料申请单模板', value: 'MATERIAL_REQUISITION_CODE' },
    { label: '领料出库单模板', value: 'MATERIAL_OUT_STORAGE_CODE' },
    { label: '到货单模板', value: 'ARRIVE_ORDER_CODE' },
    { label: '入库单模板', value: 'IN_STORAGE_CODE' },
    { label: '退货单模板', value: 'RETURN_ORDER_CODE' },
    { label: '其他入库单模板', value: 'OTHER_IN_STORAGE_CODE' },
    { label: '其他出库单模板', value: 'OTHER_OUT_STORAGE_CODE' }
];

/**
 * 质检属性
 */
export const qualityInspectionAttribute = [
    { label: '逻辑', value: '1' },
    { label: '数值', value: '2' },
    { label: '文本', value: '3' }
];

/**
 * 物料类型
 */
export const materialCodeMaterialMold = [
    { label: '原料', value: 'RAW_MATERIAL' },
    { label: '半成品', value: 'SEMI-FINISHED_PRODUCT' },
    { label: '成品', value: 'FINISHED_PRODUCT' },
    { label: '零件', value: 'PARTS_MATERIAL' }
];

/**
 * IQC检验方式
 */
export const IQCcheckType = [
    { label: '待检验', value: '0' },
    // { label: '部分检验', value: '2' },
    { label: '已检验', value: '2' }
];

/**
 * 入库状态
 */
export const inStoreStatusOptions = [
    { label: '待入库', value: '0' },
    { label: '已入库', value: '1' }
];

/**
 * IQC检验结果
 */
export const IQCCheckResult = [
    { label: '不合格', value: '0' },
    { label: '合格', value: '1' },
    { label: '让步接收', value: '2' }
];

/**
 * 退货方式
 */
export const returnMethod = [
    { label: '按到货单退货', value: '0' },
    { label: '按库存退货', value: '1' }
];

/**
 * 移动类型
 */
export const movementType = [
    { label: '采购订单退货', value: 'C04' },
    { label: '委外订单退货', value: 'C05' },
    { label: '客供物料退货', value: 'C07' }
];

/**
 * 工序交接单状态
 */
export const handoverStatus = [
    { label: '创建', value: 'CREATE' },
    { label: '已收货', value: 'RECEIVED' }
];

/**
 * 实体类型
 */
const entityTypeList = [
    { value: 'ERDB_SYS', label: 'ERDB_SYS' },
    { value: 'ERDB_CUS', label: 'ERDB_CUS' }
];

/**
 * 值类型
 */
const valueTypeOption = [
    { value: 'BIGINT', label: '整数' },
    { value: 'FLOAT', label: '浮点数' },
    { value: 'DECIMAL', label: '实数' },
    { value: 'BOOLEAN', label: '布尔类型' },
    { value: 'CHAR', label: '字符类型' },
    { value: 'DATETIME', label: '时间日期' },
    { value: 'CODE', label: '业务ID' },
    { value: 'ID ', label: 'ID ' }
];

/**
 * 存储类型
 */
const storageTypeOption = [
    { value: 'PRDB_SYS', label: 'PRDB_SYS' },
    { value: 'PRDB_CUS ', label: 'PRDB_CUS' }
];

/**
 * 映射类型
 */
const mapTypeList = [
    { value: 'ONE_ONE', label: '一对一' },
    { value: 'ONE_MANY', label: '一对多' }
];

/**
 * 映射规则值
 */
const mapRuleTypeList = [
    { value: 'INDEX_EQUAL', label: '相等映射' },
    { value: 'SCRIPT_SP_EL', label: 'Spring EL表达式映射' }
];

/**
 * 值来源类型
 */
const valueSourceTypeOptions = [{ value: 'ENTITY ', label: 'ENTITY ' }];

/**
 * 其它入库单移动类型状态
 */
export const OtherInStoreInfoMoveTypeList = [
    { label: '其它入库', value: 'R10 ' },
    { label: '系统初始化', value: 'R07' }
];

/**
 * 消息模板新增语言
 */
export const MessageLanguage = [
    { label: '简体中文', value: '简体中文' },
    { label: 'English', value: 'English' }
];

/**
 * 通知渠道
 */
export const notificationChannels = [
    { label: '站内信', value: '站内信' },
    { label: '邮箱', value: '邮箱' },
    { label: '短信', value: '短信' }
];

/**
 * 领料类型
 */
const receiveTypeList = [
    { label: '正常领料', value: '1' },
    { label: '超量领料', value: '2' }
];

/**
 * 领料出库单
 */
const requisitionOrderStatusList = [
    { value: '1', label: '待领料' },
    { value: '2', label: '部分领料' },
    { value: '3', label: '领料完成' }
];

/**
 * 出库方式
 */
const stockManagementTypeList = [
    { value: 'FIRST_IN_FIRST_OUT', label: '先进先出' },
    { value: 'STOCK_AS_QUANTITY ', label: '按数量' },
    { value: 'STOCK_AS_BATCH', label: '按批量' }
];
/*
 * 产品BOM更新状态
 */
export const updateResult = [
    { label: '已更新', value: '1' },
    { label: '未更新', value: '0' }
];

/**
 * 备料需求单来源
 */
export const materialsPreparationOrderSource = [{ value: '0', label: '图纸云' }];

/**
 * 备料需求单来源
 */
export const materialsPreparationOrderStatus = [
    { value: '0', label: '待生成' },
    { value: '1', label: '已生成' }
];

type TypeVal = string | number | null;

export const getLabel = <T = TypeVal>(
    value: T,
    list: Record<string, any>[],
    fieldNames = { label: 'label', value: 'value' }
) => {
    const findItem = list.find(item => item[fieldNames.value] === value);
    return (findItem ? findItem[fieldNames.label] : value) as string;
};

export const getTpfOptionEnum = () => {
    return {
        addOperationTypeNameListOptions,
        TRADE,
        menuType,
        TREEACE_TYPE,
        regionData,
        statusOption,
        statusOptionStr,
        customerSupplierType,
        deliveryType,
        operationTypeNameListOptions,
        storePosition,
        isStart,
        receiptIssueType,
        getLabel,
        workshopNameOpt,
        partTypeOpt,
        managementOpt,
        orderTypeCodeEnum,
        equipmentDebugEnum,
        reportInOrderEnum,
        overProductionEnum,
        confirmLogicEnum,
        publishOption,
        timeUnitOption,
        informatioSources,
        statusNumberOption,
        userStatusOption,
        exceedTheTimeLimit,
        reportNumberType,
        operationTypeCode,
        supervisorModeCode,
        workOrderStatus,
        startType,
        operPlanStatus,
        reportInOrder,
        orderSource,
        bomStatus,
        inStatus,
        workReportingStatus,
        actionStatus,
        reworkStatus,
        reportStatus,
        outInStrongTypeOption,
        statusNameColor,
        isHideOption,
        repairOrderStatus,
        repairOrderDetailStatus,
        productionStatus,
        productionOrderTypeCodeEnum,
        workOrderSource,
        statusAcceptanceOption,
        throughStatus,
        inspectionStatus,
        // 工序类型
        processOpt,
        // 生产信息
        giveTime,
        materialOrderSource,
        submitStatus,
        moveTypeList,
        checkResult,
        checkType,
        IQCcheckType,
        printTemplateType,
        InventoryStatus,
        operationTaskType,
        qualityInspectionAttribute,
        materialCodeMaterialMold,
        inStoreStatusOptions,
        IQCCheckResult,
        returnMethod, // 退货方式
        movementType, // 移动类型
        handoverStatus,
        entityTypeList,
        valueTypeOption, //值类型
        storageTypeOption,
        mapTypeList,
        mapRuleTypeList,
        valueSourceTypeOptions,
        OtherInStoreInfoMoveTypeList,
        otherOutMoveTypeList,
        notificationChannels,
        receiveTypeList,
        requisitionOrderStatusList,
        stockManagementTypeList,
        MessageLanguage, //语言
        materialsPreparationOrderSource,
        materialsPreparationOrderStatus,
        updateResult
    };
};
