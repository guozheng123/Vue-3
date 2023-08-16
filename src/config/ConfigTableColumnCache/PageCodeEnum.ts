/* eslint-disable no-unused-vars */
export const enum PageCodeEnum {
    // 班组
    systemManageTeamGroupTable = 'systemManage_teamGroup_table',
    //企业建模-集团
    systemManageBuildBusinessGroup = 'systemManage_buildBusiness_Group',
    //企业建模-公司
    systemManageBuildBusinessCompany = 'systemManage_buildBusiness_Company',
    //企业建模-工厂
    systemManageBuildBusinessFactory = 'systemManage_buildBusiness_Factory',
    //企业建模-车间
    systemManageBuildBusinessWorkshop = 'systemManage_buildBusiness_Workshop',
    // 工序管理
    processManagementWorkingProcedureTable = 'processManagement_workingProcedure_table',
    // 作业单元
    processManagementActivityTable = 'processManagement_activity_table',
    // 作业类型类型
    processManagementActivityTypeTable = 'processManagement_activityType_table',
    // 工艺
    processManagementWorkmanshipRouteTable = 'processManagement_workmanshipRoute_table',
    //仓库管理--基础信息--仓位设置
    warehouseManagementBasicDataBinSettings = 'warehouseManagement_basicData_binSettings',
    //仓库管理--基础信息--仓位类型
    warehouseManagementBasicDataBinType = 'warehouseManagement_basicData_binType',
    //仓库管理--基础信息--库位设置
    warehouseManagementBasicDataLocationSetting = 'warehouseManagement_basicData_locationSetting',
    //仓库管理--基础信息--移动类型
    warehouseManagementBasicDataMoveType = 'warehouseManagement_basicData_moveType',
    // 仓储管理 - 入库管理 - 完工入库单
    warehouseManagementCompletedStorageTicket = 'complete_in_store',
    // 仓储管理 - 入库管理 - 其它出库单
    warehouseManagementOtherOutTable = 't_other_out_in_store',
    // 仓储管理 - 入库管理 - 其它出库单详情
    warehouseManagementOtherOutTableDetails = 't_other_out_in_store_detail',
    // 仓储管理 - 库存管理 - 出入库明细
    warehouseManagementWarehouseOutInDetails = 'out_in_store_detail',
    // 仓储管理 - 库存管理 - 库存报表
    warehouseManagementInventoryReports = 'store_report_form',
    // 仓储管理 - 库存管理 - 物料到货单 - 待提交
    wMMaterialArrivalOrderNotSubmitted = 'material_arrival_order_not_submitted',
    // 仓储管理 - 库存管理 - 物料到货单 - 提交
    wMMaterialArrivalOrderSubmitted = 'material_arrival_order_submitted',
    // 仓储管理 - 库存管理 - 物料到货单 - 详情
    wMMaterialArrivalOrderNotDetail = 'material_arrival_order_detail',
    // 仓储管理 - 库存管理 - 物料入库单 - 入库
    wMMaterialInStore = 'material_in_store',
    // 仓储管理 - 库存管理 - 物料入库单 - 待入库
    wMMaterialNoInStoreDetail = 'material_no_in_store_detail',
    // 仓储管理 - 库存管理 - 物料入库单 - 入库详情
    wMMaterialYesInStoreDetail = 'material_yes_in_store_detail',
    // 仓储管理 - 出库管理 - 领料出库单
    wMGetMaterialsOutStorage = 'out_storage_order',
    // 系统管理-用户管理--部门
    systemManageBuildBusinessDepartment = 'systemManage_buildBusiness_department',
    // 系统管理-用户管理--用户
    systemManageBuildBusinessUser = 'systemManage_buildBusiness_user',
    // 系统管理-用户管理--菜单
    systemManageBuildBusinessMenu = 'systemManage_buildBusiness_menu',
    // 系统管理-用户管理--岗位
    systemManageBuildBusinessStation = 'systemManage_buildBusiness_station',
    // 系统管理-用户管理--角色权限
    systemManageBuildBusinessRole = 'systemManage_buildBusiness_role',

    // 物料管理-物料主数据
    materialList = 'material_list',

    // 物料管理-缺陷原因
    materialCause = 'material_cause',

    //生产订单
    productionOrder = 'productionOrder',

    //作业工单
    productionManagementJobOrderList = 'productionManagement_jobOrderList',

    //备料清单
    materialPreparation = 'material_preparation',

    //计量单位
    unitMeasurement = 'material_unit_table',

    //生产暂停记录
    productionSuspensionRecord = 'production_suspension_record',

    //生产异常类型
    productionExceptionType = 'productionManagement_exceptionType',

    //生产报工明细
    reportProgress = 'report_progress',

    //工序任务单
    operationTaskList = 'operation_task_list',

    //工序任务单 测试 -----
    operationTaskOrder = 'operation_task_order',

    //不良品管理
    //返修明细
    repairDetail = 'repair_order_detail',
    //返修单
    repairOrderFront = 'repair_order_front',
    //过程质检 & 成品质检
    productionInspectOrderInfo = 'production_inspect_order_info',
    //明细质检
    inspectRecordDetail = 'inspect_record_detail',
    //装备调试
    satPcInspectOrderInfo = 'sat_pc_inspect_order_info',
    //调试验收
    fatPcInspectOrderInfo = 'fat_pc_inspect_order_info',
    // 工段管理
    workSectionManagement = 'work_section_management',
    // esop
    guidebook = 'guidebook',

    // IQC检验单
    iqcPcInspectOrderInfo = 'iqc_pc_inspect_order_info',
    // 盘点单
    storeCheck = 'store_check',
    // 物料退货单-待提交
    materialReturnOrderNotSubmitted = 'material_return_order_not_submitted',
    // 物料退货单-已提交
    materialReturnOrderSubmitted = 'material_return_order_submitted',
    // 物料退货单-退货明细
    materialReturnOrderDetail = 'material_return_order_detail',

    // 工序交接单
    handoverOrder = 'handover_order',

    // 入库单列表
    otherInStore = 't_other_in_store',
    // 入库单明细
    otherInStoreDetail = 't_other_in_store_detail',

    //领料申请单
    materialRequisitionOrder = 'material_requisition_order',
    // 消息模板
    noticeMsgTemplate = 'notice_msg_template',
    // 产品BOM
    bomInfo = 'bom_info',
    // 消息发送日志
    noticeMsgEventLog = 'notice_msg_event_log'
}
