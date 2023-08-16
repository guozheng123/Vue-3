<template>
    <div class="operationTaskList" v-loading="loading">
        <!-- 基本信息 -->
        <TpfCollapse title="基本信息" id="operationTaskList">
            <TpfDescriptions
                :descriptionsProps="{
                    column: 4,
                    labelStyle: { width: '150px', textAlign: 'end' }
                }"
                :originalDate="operationTaskListInfo"
                :renderList="operationTaskList"
            />
        </TpfCollapse>

        <!-- 物料信息 -->
        <TpfCollapse title="物料信息" id="productionOrderMaterial">
            <TpfDescriptions
                :descriptionsProps="{
                    column: 4,
                    labelStyle: { width: '150px', textAlign: 'end' }
                }"
                :originalDate="operationTaskListInfo"
                :renderList="productionOrderMaterialList"
            />
        </TpfCollapse>

        <!-- 其他 -->
        <TpfCollapse gap="20" title="其他" id="other">
            <TpfDescriptions
                :descriptionsProps="{
                    column: 4,
                    labelStyle: { width: '130px', textAlign: 'end' }
                }"
                :originalDate="operationTaskListInfo"
                :renderList="otherList"
            />
        </TpfCollapse>

        <!-- 其他 -->
        <TpfCollapse gap="20" title="工序BOM">
            <TpfTable
                style="height: 200px"
                v-bind="{
                    loading,
                    dataSource
                }"
                :pagination="false"
                :columns="columns"
            />
        </TpfCollapse>
    </div>
</template>

<script setup lang="tsx" name="operationTaskListInfo">
    import { ref, computed, defineAsyncComponent, onMounted } from 'vue';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import { TpfColumnType } from '@/types';
    import TpfDescriptions from '@/components/TpfDescriptions/index.vue';
    import { useOperationTaskListAPi } from '@/api';
    import { useRouteQuery } from '@/hooks';
    import { getTpfOptionEnum, tableResizable } from '@/config';

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));
    const { operationTaskOrderId } = useRouteQuery<{ operationTaskOrderId: string }>();

    const operationTaskListAPi = useOperationTaskListAPi();
    const dataSource = ref([]);

    const loading = ref(false);

    const operationTaskListInfo = ref<{ [k: string]: any }>({});
    const { getLabel, supervisorModeCode, workOrderStatus } = getTpfOptionEnum();

    const columns = computed(() => {
        return [
            { title: '物料编号', dataIndex: 'materialCode', ...tableResizable() },
            { title: '物料名称', dataIndex: 'materialName', ...tableResizable() },
            {
                title: '数量',
                dataIndex: 'num',
                ...tableResizable()
            },
            {
                title: '基本单位',
                dataIndex: 'materialUnitCode',
                ...tableResizable()
            },
            {
                title: '生产管理方式',
                dataIndex: 'supervisorModeCode',
                ...tableResizable(),
                customRender: ({ text, record }) => {
                    return getLabel(text, supervisorModeCode);
                }
            }
        ] as TpfColumnType[];
    });

    const operationTaskList = computed(() => {
        return [
            { label: '工序任务单号', field: 'operationTaskOrderCode' },
            { label: '工序编号', field: 'operationCode' },
            { label: '工序名称', field: 'operationName' },
            { label: '工单计划数', field: 'operationPlannedNumber' },

            { label: '任务单状态', field: 'operationTaskOrderStatus' },
            { label: '创建时间', field: 'createDatetime' },
            { label: '计划开始日期', field: 'plannedStartDate' },
            { label: '计划结束日期', field: 'plannedEndDate' },

            { label: '实际开始日期', field: 'actualStartDatetime' },
            { label: '实际结束日期', field: 'actualEndDatetime' },
            { label: '项目编号', field: 'projectCode' },
            { label: '项目名称', field: 'projectName' },

            { label: '项目集编号', field: 'projectGroupCode' },
            { label: '项目集名称', field: 'projectGroupName' },
            { label: '作业工单号', field: 'workOrderCode' },
            { label: '生产订单号', field: 'productionOrderCode' },

            { label: '订单交期', field: 'requirementDate' },
            { label: '报工计算逻辑', field: 'confirmLogic' },
            { label: '是否超产', field: 'overProduction' },
            { label: '超产比例（%)', field: 'overProductionRatio' },

            { label: '是否顺序报工', field: 'reportInOrder' },
            { label: '班组', field: 'workingTeamName' },
            { label: '责任人', field: 'chargeUserName' }
        ] as { label: string; field: string }[];
    });

    const productionOrderMaterialList = computed(() => {
        return [
            { label: '物料编号', field: 'materialCode' },
            { label: '物料名称', field: 'materialName' },
            { label: '物料规格', field: 'materialSpec' },
            { label: '图号', field: 'figureNum' },

            { label: '计划数', field: 'plannedNumber' },
            {
                label: '工序完工数',
                field: 'completionsNumber',
                description: '工序完工数=该工序任务单在报工明细中报工的【合格数】之和'
            },
            { label: '报废数', field: 'scrapNumber' },
            { label: '返修数', field: 'repairNumber' }
        ];
    });

    const otherList = [
        { label: '产品类型', field: 'productType' },
        { label: '父级物料编号', field: 'oneLevelMaterialCode' },
        { label: '父级物料名称', field: 'oneLevelMaterialText' },
        { label: '二层父级物料编号', field: 'twoLevelMaterialCode' },
        { label: '二层父级物料名称', field: 'twoLevelMaterialText' },
        { label: '批号', field: 'lotNum' },
        { label: '二层物料编号', field: 'twoMaterialCode' },
        { label: '二层物料名称', field: 'twoMaterialText' }
    ];

    const getProductionOrderViewById = async () => {
        loading.value = true;

        try {
            const res = await operationTaskListAPi.getOperationTaskOrderDetailById({
                operationTaskOrderId: operationTaskOrderId
            });
            res.data.object.operationTaskOrderStatus = getLabel(
                res.data.object.operationTaskOrderStatus,
                workOrderStatus
            );
            operationTaskListInfo.value = res.data.object;
            dataSource.value = res.data.object.materialBomVos;
        } finally {
            loading.value = false;
        }
    };

    onMounted(() => {
        getProductionOrderViewById();
    });
</script>

<style lang="less" scoped>
    .operationTaskList {
        :deep(.tpf-collapse) {
            .tpf-collapse-header {
                background: #fff;
            }

            .tpf-collapse-content {
                background: #fff;
            }
        }

        :deep(.processInfo-collapse) {
            &.tpf-collapse {
                .tpf-collapse-content {
                    padding: 12px;
                    box-sizing: border-box;
                    height: 280px;

                    .tpf-table {
                        height: 100%;

                        .ant-table.ant-table-small .ant-table-thead > tr > th {
                            padding: 11px 8px;
                        }
                    }
                }
            }
        }

        .uploadBtn {
            background-color: #fff;
            padding: 20px;
            min-height: 40px;
            box-sizing: border-box;
        }
    }
</style>
