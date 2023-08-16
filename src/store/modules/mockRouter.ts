export const user1 = [
    {
        name: 'systemManage',
        path: '/systemManage',
        component: '/systemManage',
        meta: {
            title: '数据集成与接口',
            icon: 'icon-xitongguanli',
            noCache: false,
            link: null,
            closable: true,
            hidden: false
        },
        children: [
            {
                name: 'systemManage_systemConfiguration',
                path: '/systemManage/systemConfiguration',
                component: '/systemManage/systemConfiguration',
                meta: {
                    title: '系统设置',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            }
        ]
    },
    {
        name: 'productionManagement',
        path: '/productionManagement',
        component: '/productionManagement',
        meta: {
            title: '报表管理',
            icon: 'icon-shengchanguanli',
            noCache: false,
            link: null,
            closable: true,
            hidden: false
        },
        children: [
            {
                name: 'scbgmx-1报工明细',
                path: '/productionManagement/productionPerformance/productionWorkReportingDetails',
                component:
                    '/productionManagement/productionPerformance/productionWorkReportingDetails',
                meta: {
                    title: '报工明细',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            }
        ]
    },
    {
        name: '系统管理及工具',
        path: '/qualityInspection',
        meta: {
            title: '系统管理及工具',
            icon: 'icon-wodecaidan',
            noCache: false,
            link: null,
            closable: true,
            hidden: false
        },
        children: [
            {
                name: 'IPQC检验实绩',
                path: '/qualityInspection/qualityInspectionTask/processCheck',
                component: '/qualityInspection/qualityInspectionTask/processCheck',
                meta: {
                    title: 'IPQC检验实绩',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            },
            {
                name: 'FQC检验实绩',
                path: '/warehouseManagement/rkgl',
                component: '/warehouseManagement/storageManagement/completedStorageTicket',
                meta: {
                    title: 'FQC检验实绩',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            },
            {
                name: 'zyxq',
                path: '/qualityInspection/qualityInspectionTask/components/homeDetails',
                component: '/qualityInspection/qualityInspectionTask/components/homeDetails',
                meta: {
                    title: '调试检验实绩',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: true
                }
            },
            {
                name: 'cpzj',
                path: '/qualityInspection/qualityInspectionTask/productInspection',
                component: '/qualityInspection/qualityInspectionTask/productInspection',
                meta: {
                    title: '调试验收实绩',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            },
            {
                name: 'zbts',
                path: '/qualityInspection/inspectionTangibleAchievement/equipmentDebugging',
                component: '/qualityInspection/inspectionTangibleAchievement/equipmentDebugging',
                meta: {
                    title: '调试检验实绩',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            },
            {
                name: 'mxxq',
                path: '/qualityInspection/qualityInspectionTask/components/detailsView',
                component: '/qualityInspection/qualityInspectionTask/components/detailsView',
                meta: {
                    title: '明细详情',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: true
                }
            }
        ]
    },
    {
        name: '基础设置',
        path: '/systemManage',
        component: '/systemManage',
        meta: {
            title: '基础设置',
            icon: 'icon-gongyiguanli',
            noCache: false,
            link: null,
            closable: true,
            hidden: false
        },
        children: [
            {
                name: 'role',
                path: '/systemManage/userManagement/rolePermissions',
                component: '/systemManage/userManagement/rolePermissions',
                meta: {
                    title: '角色权限',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            }
        ]
    },
    {
        name: '数据权限设置',
        path: '/systemManage',
        component: '/systemManage',
        meta: {
            title: '数据权限设置',
            icon: 'icon-jichushuju',
            noCache: false,
            link: null,
            closable: true,
            hidden: false
        },
        children: [
            {
                name: 'systemManage_buildBusiness',
                path: '/systemManage/buildBusiness',
                component: '/systemManage/buildBusiness',
                meta: {
                    title: '工厂',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            },
            {
                name: 'systemManage_teamGroup',
                path: '/systemManage/teamGroup',
                component: '/systemManage/teamGroup',
                meta: {
                    title: '班组',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            },
            {
                name: 'station',
                path: '/systemManage/userManagement/station',
                component: '/systemManage/userManagement/station',
                meta: {
                    title: '车间',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            }
        ]
    },
    {
        name: '流程权限设置',
        path: '/productionManagement/ProductionBase',
        component: '/productionManagement/ProductionBase',
        meta: {
            title: '流程权限设置',
            icon: 'icon-guanxi-dian',
            noCache: false,
            link: null,
            closable: true,
            hidden: false
        },
        children: [
            {
                name: 'workshopMana',
                path: '/productionManagement/workshopManagementAuthority',
                component: '/productionManagement/workshopManagementAuthority',
                meta: {
                    title: '车间管理权限',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            },
            {
                name: 'workshopOper',
                path: '/productionManagement/workshopOperationPermissions',
                component: '/productionManagement/workshopOperationPermissions',
                meta: {
                    title: '车间操作权限',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            }
        ]
    }
];

export const user2 = [
    {
        name: '生产计划排产',
        path: '/productionManagement/scgl',
        component: '/productionManagement/scgl',
        meta: {
            title: '生产计划排产',
            icon: 'icon-xitongguanli',
            noCache: false,
            link: null,
            closable: true,
            hidden: false
        },
        children: [
            {
                name: 'productionManagement_productionOrder',
                path: '/productionManagement/productionOrder',
                component: '/productionManagement/productionOrder',
                meta: {
                    title: '生产订单',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            },
            {
                name: 'productionManagement_productionOrder_productionOrderEdit',
                path: '/productionManagement/productionOrder/productionOrderEdit',
                component: '/productionManagement/productionOrder/productionOrderEdit',
                meta: {
                    title: '编辑生产订单',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: true
                }
            },
            {
                name: 'jobOrder',
                path: '/productionManagement/jobOrderList',
                component: '/productionManagement/jobOrderList',
                meta: {
                    title: '作业工单',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: true
                }
            },
            {
                name: 'productionManagement_productionOrder_productionOrderDetail',
                path: '/productionManagement/productionOrder/productionOrderDetail',
                component: '/productionManagement/productionOrder/productionOrderDetail',
                meta: {
                    title: '生产订单详情',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: true
                }
            },
            {
                name: 'operationTas',
                path: '/productionManagement/operationTaskList',
                component: '/productionManagement/operationTaskList',
                meta: {
                    title: '工序任务单',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            },
            {
                name: 'scddxz',
                path: '/productionManagement/productionOrder/productionOrderAdd',
                component: '/productionManagement/productionOrder/productionOrderEdit',
                meta: {
                    title: '新增生产订单',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: true
                }
            }
        ]
    },
    {
        name: '生产现场管理',
        path: '/productionManagement/ProductionBase',
        component: '/productionManagement/ProductionBase',
        meta: {
            title: '生产现场管理',
            icon: 'icon-guanxi-dian',
            noCache: false,
            link: null,
            closable: true,
            hidden: false
        },
        children: [
            {
                name: 'workshopMana',
                path: '/productionManagement/workshopManagementAuthority',
                component: '/productionManagement/workshopManagementAuthority',
                meta: {
                    title: '车间管理权限',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            },
            {
                name: 'workshopOper',
                path: '/productionManagement/workshopOperationPermissions',
                component: '/productionManagement/workshopOperationPermissions',
                meta: {
                    title: '车间操作权限',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            }
        ]
    },
    {
        name: '异常管理',
        path: '/qualityInspection',
        meta: {
            title: '异常管理',
            icon: 'icon-wodecaidan',
            noCache: false,
            link: null,
            closable: true,
            hidden: false
        },
        children: [
            {
                name: 'qualityInspection_BasicData_projectMaintenance',
                path: '/qualityInspection/BasicData/projectMaintenance',
                component: '/qualityInspection/BasicData/projectMaintenance',
                meta: {
                    title: '质检项目维护',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            },
            {
                name: '质检方案',
                path: '/qualityInspection/BasicData/InspectionScheme',
                component: '/qualityInspection/BasicData/InspectionScheme',
                meta: {
                    title: '质检方案',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            },
            {
                name: '过程质检--',
                path: '/qualityInspection/qualityInspectionTask/processCheck1',
                component: '/qualityInspection/qualityInspectionTask/processCheck',
                meta: {
                    title: '过程质检',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            }
        ]
    },
    {
        name: '质量管理',
        path: '/qualityInspection/BasicData',
        component: '/qualityInspection/BasicData',
        meta: {
            title: '质量管理',
            icon: 'icon-cangchuguanli',
            noCache: false,
            link: null,
            closable: true,
            hidden: false
        },
        children: [
            {
                name: 'qua_yuanyin',
                path: '/qualityInspection/BasicData/DefectClassification',
                component: '/qualityInspection/BasicData/DefectClassification',
                meta: {
                    title: '质量类型',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            },
            {
                name: 'qua_fenlei',
                path: '/qualityInspection/BasicData/CauseDefect',
                component: '/qualityInspection/BasicData/CauseDefect',
                meta: {
                    title: '缺陷原因类型',
                    icon: 'icon-guanxi-dian',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            }
        ]
    },
    {
        name: '统计分析',
        path: '/qualityInspection',
        meta: {
            title: '统计分析',
            icon: 'icon-jichushuju',
            noCache: false,
            link: null,
            closable: true,
            hidden: false
        },
        children: [
            {
                name: 'IPQC检验实绩',
                path: '/qualityInspection/qualityInspectionTask/processCheck',
                component: '/qualityInspection/qualityInspectionTask/processCheck',
                meta: {
                    title: 'IPQC检验实绩',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            },
            {
                name: 'FQC检验实绩',
                path: '/warehouseManagement/rkgl',
                component: '/warehouseManagement/storageManagement/completedStorageTicket',
                meta: {
                    title: 'FQC检验实绩',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            },
            {
                name: 'zyxq',
                path: '/qualityInspection/qualityInspectionTask/components/homeDetails',
                component: '/qualityInspection/qualityInspectionTask/components/homeDetails',
                meta: {
                    title: '调试检验实绩',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: true
                }
            },
            {
                name: 'cpzj',
                path: '/qualityInspection/qualityInspectionTask/productInspection',
                component: '/qualityInspection/qualityInspectionTask/productInspection',
                meta: {
                    title: '调试验收实绩',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            },
            {
                name: 'zbts',
                path: '/qualityInspection/inspectionTangibleAchievement/equipmentDebugging',
                component: '/qualityInspection/inspectionTangibleAchievement/equipmentDebugging',
                meta: {
                    title: '调试检验实绩',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            },
            {
                name: 'mxxq',
                path: '/qualityInspection/qualityInspectionTask/components/detailsView',
                component: '/qualityInspection/qualityInspectionTask/components/detailsView',
                meta: {
                    title: '明细详情',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: true
                }
            }
        ]
    }
];

export const user3 = [
    {
        name: 'productionManagement',
        path: '/productionManagement',
        component: '/productionManagement',
        meta: {
            title: '生产计划管理',
            icon: 'icon-shengchanguanli',
            noCache: false,
            link: null,
            closable: true,
            hidden: false
        },
        children: [
            {
                name: 'operationTas',
                path: '/productionManagement/operationTaskList1',
                component: '/productionManagement/operationTaskList',
                meta: {
                    title: '工序任务单',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            },
            {
                name: 'operationdet',
                path: '/productionManagement/operationTaskList/operationTaskListDetail',
                component: '/productionManagement/operationTaskList/operationTaskListDetail',
                meta: {
                    title: '工序任务单详情',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: true
                }
            }
        ]
    },
    {
        name: 'materialManagement',
        path: '/materialManagement',
        component: '/materialManagement',
        meta: {
            title: '下料清单管理',
            icon: 'icon-jichushuju',
            noCache: false,
            link: null,
            closable: true,
            hidden: false
        },
        children: [
            {
                name: 'wlzsj',
                path: '/materialManagement/materialData',
                component: '/materialManagement/materialData',
                meta: {
                    title: '物料主数据',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            },
            {
                name: 'addMaterial',
                path: '/materialManagement/materialData/addMaterialDataDetails',
                component: '/materialManagement/materialData/materialDataDetails',
                meta: {
                    title: '新增物料',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: true
                }
            },
            {
                name: 'editMateria',
                path: '/materialManagement/materialData/editMaterialDataDetails',
                component: '/materialManagement/materialData/materialDataDetails',
                meta: {
                    title: '编辑物料',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: true
                }
            },
            {
                name: 'materialManagement_materialProperties_unitMeasurement',
                path: '/materialManagement/materialProperties/unitMeasurement',
                component: '/materialManagement/materialProperties/unitMeasurement',
                meta: {
                    title: '计量单位',
                    icon: 'icon-wodecaidan',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: true
                }
            },
            {
                name: 'detail',
                path: '/materialManagement/materialData/materialDataDetails',
                component: '/materialManagement/materialData/materialDataDetails',
                meta: {
                    title: '物料详情',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: true
                }
            }
        ]
    },
    {
        name: '生产数据采集',
        path: '/productionManagement',
        component: '/productionManagement',
        meta: {
            title: '生产数据采集',
            icon: 'icon-shengchanguanli',
            noCache: false,
            link: null,
            closable: true,
            hidden: false
        },
        children: [
            {
                name: '工单报工1',
                path: '/productionManagement/operationTaskList2',
                component: '/productionManagement/operationTaskList',
                meta: {
                    title: '工单报工',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            }
        ]
    },
    {
        name: '生产加工管理',
        path: '/productionManagement',
        component: '/productionManagement',
        meta: {
            title: '生产加工管理',
            icon: 'icon-shengchanguanli',
            noCache: false,
            link: null,
            closable: true,
            hidden: false
        },
        children: [
            {
                name: 'operationTas工序任务单',
                path: '/productionManagement/operationTaskList',
                component: '/productionManagement/operationTaskList',
                meta: {
                    title: '工序任务单报工',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            }
        ]
    },
    {
        name: '生产质量管理',
        path: '/qualityInspection',
        meta: {
            title: '生产质量管理',
            icon: 'icon-wodecaidan',
            noCache: false,
            link: null,
            closable: true,
            hidden: false
        },
        children: [
            {
                name: 'gczj',
                path: '/qualityInspection/qualityInspectionTask/processCheck',
                component: '/qualityInspection/qualityInspectionTask/processCheck',
                meta: {
                    title: '过程检验',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            },
            {
                name: 'cpzj',
                path: '/qualityInspection/qualityInspectionTask/productInspection',
                component: '/qualityInspection/qualityInspectionTask/productInspection',
                meta: {
                    title: '成品检验',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            },
            {
                name: 'mxcx',
                path: '/qualityInspection/qualityInspectionTask/components/detailQuery',
                component: '/qualityInspection/qualityInspectionTask/components/detailQuery',
                meta: {
                    title: '调试检验',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            }
        ]
    },
    {
        name: '图纸管理',
        path: '/productionManagement',
        component: '/productionManagement',
        meta: {
            title: '图纸管理',
            icon: 'icon-shengchanguanli',
            noCache: false,
            link: null,
            closable: true,
            hidden: false
        },
        children: [
            {
                name: 'jobOrder1',
                path: '/productionManagement/jobOrderList',
                component: '/productionManagement/jobOrderList',
                meta: {
                    title: '作业工单',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            },
            {
                name: '1123213',
                path: '/productionManagement/jobOrderList/processEdit',
                component: '/productionManagement/jobOrderList/processEdit',
                meta: {
                    title: '编辑工艺',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: true
                }
            },
            {
                name: 'processPlann',
                path: '/productionManagement/jobOrderList/processPlanning',
                component: '/productionManagement/jobOrderList/processPlanning',
                meta: {
                    title: '工序计划',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: true
                }
            },
            {
                name: 'workOrderdet',
                path: '/productionManagement/jobOrderList/jobOrderListDetail',
                component: '/productionManagement/jobOrderList/jobOrderListDetail',
                meta: {
                    title: '作业工单详情',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: true
                }
            },
            {
                name: 'operationdet',
                path: '/productionManagement/operationTaskList/operationTaskListDetail',
                component: '/productionManagement/operationTaskList/operationTaskListDetail',
                meta: {
                    title: '工序任务单详情',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: true
                }
            }
        ]
    },
    {
        name: '委外加工管理',
        path: '/warehouseManagement',
        meta: {
            title: '委外加工管理',
            icon: 'icon-cangchuguanli',
            noCache: false,
            link: null,
            closable: true,
            hidden: false
        },
        children: [
            {
                name: 'crkmx',
                path: '/warehouseManagement/inventoryManagement/warehouseOutInDetails',
                component: '/warehouseManagement/inventoryManagement/warehouseOutInDetails',
                meta: {
                    title: '出入库明细',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            }
        ]
    },
    {
        name: '统计分析',
        path: '/warehouseManagement',
        meta: {
            title: '统计分析',
            icon: 'icon-cangchuguanli',
            noCache: false,
            link: null,
            closable: true,
            hidden: false
        },
        children: [
            {
                name: 'kcbb',
                path: '/warehouseManagement/inventoryManagement/inventoryReports',
                component: '/warehouseManagement/inventoryManagement/inventoryReports',
                meta: {
                    title: '库存报表',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            }
        ]
    },
    {
        name: 'systemManage',
        path: '/systemManage',
        component: '/systemManage',
        meta: {
            title: '功能迭代',
            icon: 'icon-xitongguanli',
            noCache: false,
            link: null,
            closable: true,
            hidden: false
        },
        children: [
            {
                name: 'scddpz',
                path: '/systemManage/diyFiled/diyProductOrder',
                component: '/systemManage/diyFiled/diyProductOrder',
                meta: {
                    title: '自定义字段设置',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            },
            {
                name: 'rules',
                path: '/systemManage/documentConfiguration/numberingRule',
                component: '/systemManage/documentConfiguration/numberingRule',
                meta: {
                    title: '编码自定义设置',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            }
        ]
    }
];

export const user4 = [
    {
        name: 'processManagement',
        path: '/processManagement',
        component: '/MainLayout',
        meta: {
            title: '工艺管理',
            icon: 'icon-gongyiguanli',
            noCache: false,
            link: null,
            closable: true,
            hidden: false
        },
        children: [
            {
                name: 'gx1',
                path: '/processManagement/workingProcedure',
                component: '/processManagement/workingProcedure',
                meta: {
                    title: '工序',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            },
            {
                name: 'zydylxq',
                path: '/processManagement/activityType/activityTypeDetail',
                component: '/processManagement/activityType/activityTypeDetail',
                meta: {
                    title: '新增作业单元',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: true
                }
            },
            {
                name: 'zydyxq',
                path: '/processManagement/activityType/activityTypeDetail',
                component: '/processManagement/activityType/activityTypeDetail',
                meta: {
                    title: '作业单元详情',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: true
                }
            },
            {
                name: 'addWorkDetai',
                path: '/processManagement/workmanshipRoute/addWorkmanshipRouteDetail',
                component: '/processManagement/workmanshipRoute/workmanshipRouteDetail',
                meta: {
                    title: '新增工艺',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: true
                }
            },
            {
                name: 'editWorkDeta',
                path: '/processManagement/workmanshipRoute/editWorkmanshipRouteDetail',
                component: '/processManagement/workmanshipRoute/workmanshipRouteDetail',
                meta: {
                    title: '编辑工艺',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: true
                }
            },
            {
                name: 'upgradedetai',
                path: '/processManagement/workmanshipRoute/upgradeWorkmanshipRouteDetail',
                component: '/processManagement/workmanshipRoute/workmanshipRouteDetail',
                meta: {
                    title: '升版工艺',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: true
                }
            },
            {
                name: 'processManagement_workingProcedure_workingProcedureDetail',
                path: '/processManagement/workingProcedure/workingProcedureDetail',
                component: '/processManagement/workingProcedure/workingProcedureDetail',
                meta: {
                    title: '工序详情',
                    icon: 'icon-guanxi-dian',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: true
                }
            },
            {
                name: 'copyWorkDeta',
                path: '/processManagement/workmanshipRoute/copyWorkmanshipRouteDetail',
                component: '/processManagement/workmanshipRoute/workmanshipRouteDetail',
                meta: {
                    title: '复制工艺',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: true
                }
            },
            {
                name: 'processManagement_workingProcedure_addWorkingProcedure',
                path: '/processManagement/workingProcedure/addWorkingProcedure',
                component: '/processManagement/workingProcedure/addWorkingProcedure',
                meta: {
                    title: '新增工序',
                    icon: 'icon-guanxi-dian',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: true
                }
            },
            {
                name: 'detailWork',
                path: '/processManagement/workmanshipRoute/detailWorkmanshipRouteDetail',
                component: '/processManagement/workmanshipRoute/workmanshipRouteDetail',
                meta: {
                    title: '工艺详情',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: true
                }
            },
            {
                name: 'processManagement_workmanshipRoute',
                path: '/processManagement/workmanshipRoute',
                component: '/processManagement/workmanshipRoute',
                meta: {
                    title: '工艺',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            },
            {
                name: 'processManagement_workingProcedure_editWorkingProcedure',
                path: '/processManagement/workingProcedure/editWorkingProcedure',
                component: '/processManagement/workingProcedure/addWorkingProcedure',
                meta: {
                    title: '编辑工序',
                    icon: 'icon-guanxi-dian',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: true
                }
            },
            {
                name: 'processManagement_workingProcedure_cpoyWorkingProcedure',
                path: '/processManagement/workingProcedure/cpoyWorkingProcedure',
                component: '/processManagement/workingProcedure/addWorkingProcedure',
                meta: {
                    title: '复制工序',
                    icon: 'icon-guanxi-dian',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: true
                }
            }
        ]
    },
    {
        name: '排产管理',
        path: '/productionManagement',
        component: '/productionManagement',
        meta: {
            title: '排产管理',
            icon: 'icon-shengchanguanli',
            noCache: false,
            link: null,
            closable: true,
            hidden: false
        },
        children: [
            {
                name: 'productionManagement_productionOrder',
                path: '/productionManagement/productionOrder',
                component: '/productionManagement/productionOrder',
                meta: {
                    title: '生产订单',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            },
            {
                name: 'jobOrder',
                path: '/productionManagement/jobOrderList',
                component: '/productionManagement/jobOrderList',
                meta: {
                    title: '作业工单',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            },
            {
                name: '1123213',
                path: '/productionManagement/jobOrderList/processEdit',
                component: '/productionManagement/jobOrderList/processEdit',
                meta: {
                    title: '编辑工艺',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: true
                }
            },
            {
                name: 'processPlann',
                path: '/productionManagement/jobOrderList/processPlanning',
                component: '/productionManagement/jobOrderList/processPlanning',
                meta: {
                    title: '工序计划',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: true
                }
            }
        ]
    },
    {
        name: 'materialManagement',
        path: '/materialManagement',
        redirect: 'noRedirect',
        component: '/materialManagement',
        meta: {
            title: '物料管理',
            icon: 'icon-jichushuju',
            noCache: false,
            link: null,
            closable: true,
            hidden: false
        },
        children: [
            {
                name: 'addMaterial',
                path: '/materialManagement/materialData/addMaterialDataDetails',
                component: '/materialManagement/materialData/materialDataDetails',
                meta: {
                    title: '新增物料',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: true
                }
            },
            {
                name: 'editMateria',
                path: '/materialManagement/materialData/editMaterialDataDetails',
                component: '/materialManagement/materialData/materialDataDetails',
                meta: {
                    title: '编辑物料',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: true
                }
            },
            {
                name: 'materialManagement_materialProperties_unitMeasurement',
                path: '/materialManagement/materialProperties/unitMeasurement',
                component: '/materialManagement/materialProperties/unitMeasurement',
                meta: {
                    title: '计量单位',
                    icon: 'icon-wodecaidan',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            },
            {
                name: 'detail',
                path: '/materialManagement/materialData/materialDataDetails',
                component: '/materialManagement/materialData/materialDataDetails',
                meta: {
                    title: '物料详情',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: true
                }
            },
            {
                name: 'wlzsj',
                path: '/materialManagement/materialData',
                component: '/materialManagement/materialData',
                meta: {
                    title: '物料主数据',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            }
        ]
    },
    {
        name: 'productionManagement',
        path: '/productionManagement',
        component: '/productionManagement',
        meta: {
            title: '报表中心',
            icon: 'icon-shengchanguanli',
            noCache: false,
            link: null,
            closable: true,
            hidden: false
        },
        children: [
            {
                name: 'scbgmx报工明细',
                path: '/productionManagement/productionPerformance/productionWorkReportingDetails',
                component:
                    '/productionManagement/productionPerformance/productionWorkReportingDetails',
                meta: {
                    title: '报工明细',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            }
        ]
    },
    {
        name: 'systemManage',
        path: '/systemManage',
        component: '/systemManage',
        meta: {
            title: '系统设置',
            icon: 'icon-xitongguanli',
            noCache: false,
            link: null,
            closable: true,
            hidden: false
        },
        children: [
            {
                name: 'systemManage_systemConfiguration',
                path: '/systemManage/systemConfiguration',
                component: '/systemManage/systemConfiguration',
                meta: {
                    title: '系统设置',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            },
            {
                name: 'role',
                path: '/systemManage/userManagement/rolePermissions',
                component: '/systemManage/userManagement/rolePermissions',
                meta: {
                    title: '角色权限',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            },
            {
                name: 'systemManage_buildBusiness',
                path: '/systemManage/buildBusiness',
                component: '/systemManage/buildBusiness',
                meta: {
                    title: '集团',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            },
            {
                name: 'systemManage_teamGroup',
                path: '/systemManage/teamGroup',
                component: '/systemManage/teamGroup',
                meta: {
                    title: '公司',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            }
        ]
    },
    {
        name: '新增管理',
        path: '/projectManagement',
        component: '/projectManagement',
        meta: {
            title: '新增管理',
            icon: 'icon-xiangmuguanli',
            noCache: false,
            link: null,
            closable: true,
            hidden: false
        },
        children: [
            {
                name: 'xjjxx1',
                path: '/projectManagement/projectSetInfo',
                component: '/projectManagement/projectSetInfo',
                meta: {
                    title: '项目集信息',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            },
            {
                name: 'xmxx2',
                path: '/projectManagement/projectInfo',
                component: '/projectManagement/projectInfo',
                meta: {
                    title: '项目信息',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: true
                }
            },
            {
                name: '项目管理',
                path: '/projectManagement/merchantManagement',
                component: '/projectManagement/merchantManagement',
                meta: {
                    title: '项目管理',
                    icon: '',
                    noCache: false,
                    link: null,
                    closable: true,
                    hidden: false
                }
            }
        ]
    }
];
