<template>
    <div class="productionOrder" v-loading="loading">
        <!-- 基本信息 -->
        <TpfCollapse title="基本信息" id="productionOrder">
            <TpfDescriptions :originalDate="detailData || {}" :renderList="productionOrderList" />
        </TpfCollapse>

        <!-- 物料信息 -->
        <TpfCollapse title="物料信息" id="productionOrderMaterial">
            <TpfDescriptions
                :originalDate="detailData || {}"
                :renderList="productionOrderMaterialList"
            />
        </TpfCollapse>

        <!-- 其他 -->
        <TpfCollapse title="其他" id="other">
            <TpfDescriptions :originalDate="detailData || {}" :renderList="otherList" />
        </TpfCollapse>

        <!-- 工艺信息 -->
        <TpfCollapse title="工艺信息" class="processInfo-collapse" id="productionOrderProcessVo">
            <TpfTable
                seq
                :columns="columns"
                :dataSource="detailData.operationInfos || []"
                size="small"
                :pagination="false"
            />
        </TpfCollapse>

        <TpfAnchor :anchorList="anchorList" />
    </div>
</template>

<script setup lang="tsx" name="productionOrderInfo">
    import TpfTable from '@/components/TpfTable/index.vue';
    import { ref, computed, defineAsyncComponent, onMounted } from 'vue';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import { tableResizable, getTpfOptionEnum } from '@/config';
    import type { TpfColumnType, TpfDescColumnType } from '@/types';
    import TpfDescriptions from '@/components/TpfDescriptions/index.vue';
    type Props = {
        detailData: Record<string, any>;
    };
    withDefaults(defineProps<Props>(), {
        detailData: () => ({})
    });
    const anchorList = [
        { href: 'productionOrder', title: '基本信息', visible: true },
        { href: 'productionOrderMaterial', title: '物料信息', visible: true },
        { href: 'other', title: '其他', visible: true },
        { href: 'productionOrderProcessVo', title: '工艺信息', visible: true }
    ];

    const TpfAnchor = defineAsyncComponent(() => import('@/components/TpfAnchor/index.vue'));

    const { getLabel, timeUnitOption, operationTypeCode, workOrderStatus, startType } =
        getTpfOptionEnum();

    const loading = ref(false);

    // 字段 对完
    const columns = computed(() => {
        return [
            { title: '工序编号', dataIndex: 'operationCode', ...tableResizable() },
            { title: '工序名称', dataIndex: 'operationName', ...tableResizable() },
            {
                title: '工序类型',
                dataIndex: 'operationTypeCode',
                ...tableResizable(),
                customRender: ({ text }) => getLabel(text, operationTypeCode)
            },
            { title: '作业单元类型', dataIndex: 'workUnitTypeName', ...tableResizable() },
            { title: '工序报工数', dataIndex: '', ...tableResizable() },
            { title: '单件计划工时', dataIndex: 'singlePlanHours', ...tableResizable() },
            { title: '工序计划工时（小时）', dataIndex: '', ...tableResizable() },
            { title: '计件单价（元）', dataIndex: 'pricePerQuantity', ...tableResizable() },
            { title: '计时单价', dataIndex: 'pricePerTime', ...tableResizable() },
            {
                title: '计时单位',
                dataIndex: 'pricePerTimeUnit',
                ...tableResizable(),
                customRender: ({ text }) => getLabel(text, timeUnitOption)
            },
            { title: '作业单元编号', dataIndex: 'workUnitCode', ...tableResizable() },
            { title: '作业单元名称', dataIndex: 'workUnitName', ...tableResizable() },
            { title: '责任人', dataIndex: 'userName', ...tableResizable() },
            { title: '备注', dataIndex: 'remark', ...tableResizable() }
        ] as TpfColumnType[];
    });

    // 对完
    const productionOrderList = [
        { label: '作业单号', field: 'workOrderCode' },
        {
            label: '工单状态',
            field: 'workOrderStatus',
            customRender: ({ text }) => getLabel(text, workOrderStatus)
        },
        {
            label: '投产类型',
            field: 'startType',
            customRender: ({ text }) => getLabel(text, startType)
        },
        { label: '投产时间', field: 'startTime' },
        { label: '计划开始日期', field: 'plannedStartDate' },
        { label: '计划结束日期', field: 'plannedEndDate' },
        { label: '实际开始日期', field: 'actualStartDatetime' },
        { label: '实际结束日期', field: 'actualEndDatetime' },
        { label: '项目编号', field: 'projectCode' },
        { label: '项目名称', field: 'projectName' },
        { label: '项目集编号', field: 'projectGroupCode' },
        { label: '项目集名称', field: 'projectGroupName' },
        { label: '生产单号', field: 'productionOrderCode' },
        { label: '订单交期', field: 'requirementDate' },
        { label: '订单计划数', field: 'plannedNumber' },
        { label: '报工计算逻辑', field: 'confirmLogic' },
        { label: '订单类型', field: 'orderTypeCode' },
        { label: '订单来源', field: 'orderSource' }, // 0生产、1非标、2返工修、3图纸云
        { label: '是否超产', field: 'overProduction' }, // 0否 1是
        { label: '超产比例（%）', field: 'overProductionRatio' },
        { label: '是否顺序报工', field: 'reportInOrder' } // 0否 1是
    ] as TpfDescColumnType[];
    // 对完
    const productionOrderMaterialList = [
        { label: '物料编号', field: 'materialCode' },
        { label: '物料名称', field: 'materialName' },
        { label: '物料规格', field: 'materialSpec' },
        { label: '图号', field: 'figureNum' },
        { label: '计划数', field: 'plannedNumber' },
        { label: '完工数', field: 'completionsNumber' },
        { label: '报废数', field: 'scrapNumber' },
        { label: '返修数', field: 'repairNumber' }
    ];
    // 对完
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

    onMounted(() => {});
</script>

<style lang="less" scoped>
    .productionOrder {
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
