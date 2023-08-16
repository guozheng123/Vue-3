<template>
    <TpfAddInfoLayout :title="getTitle">
        <!-- 检验信息 -->
        <TpfCollapse title="单据信息" id="TpfCollapse">
            <LoadingSkeleton>
                <TpfDescriptions
                    :originalDate="processCheckHomeDetails || {}"
                    :renderList="invoicesList || []"
                />
            </LoadingSkeleton>
        </TpfCollapse>

        <TpfCollapse title="检验记录" id="inspectionItems" class="processInfo-collapse">
            <LoadingSkeleton>
                <TpfTable
                    seq
                    :columns="columns"
                    :dataSource="tableData"
                    size="small"
                    :pagination="false"
                />
            </LoadingSkeleton>
        </TpfCollapse>
    </TpfAddInfoLayout>
</template>

<script setup lang="tsx" name="productionOrderEdit">
    import router from '@/router';
    import TpfTable from '@/components/TpfTable/index.vue';
    import type { TpfColumnType, TpfOperateBtn } from '@/types';
    import { useRouteQuery, useRouteBase64 } from '@/hooks';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import TpfAddInfoLayout from '@/components/TpfAddInfoLayout/index.vue';
    import { ref, computed, onMounted, defineAsyncComponent } from 'vue';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import { useStore, cacheKeyEnum } from '@/store';
    import { inspectRecordDetailAPi } from '@/api';
    import TpfDescriptions from '@/components/TpfDescriptions/index.vue';
    const inspectRecordAPi = inspectRecordDetailAPi();
    const { saveRowDataStore } = useStore();
    import { tableResizable } from '@/config';

    const InspectionItems = defineAsyncComponent(() => import('../detailsView/defectCause.vue'));

    const { productionOrderId, title, type } = useRouteQuery<{
        productionOrderId: string;
        title: string;
        type: string;
    }>();
    const loading = ref(false);
    const { encodeParams } = useRouteBase64();
    const invoicesList = computed(() => {
        return [
            { label: '作业工单编号', field: 'work_order_code' },
            { label: '工序名称', field: 'operation_code-operation_name' },
            { label: '作业单元名称', field: 'report_progress_id-work_unit_code-work_unit_name' },
            { label: '检验人', field: 'inspect_user-user_id-user_name' },
            { label: '待检数量', field: 'pending_inspect_num' },
            { label: '合格数', field: 'inspect_order_id-PZSQL_countQualifiedQuantity' },
            { label: '物料编号', field: 'material_code' },
            { label: '物料名称', field: 'material_code-material_name' },
            { label: '检验日期', field: 'inspect_time' },
            { label: '创建日期', field: 'create_date' },
            { label: '返修数', field: 'inspect_order_id-PZSQL_countRepairQuantity' },
            { label: '报废数', field: 'inspect_order_id-PZSQL_countScrappedQuantity' }
        ] as { label: string; field: string }[];
    });
    const columns = computed(() => {
        return [
            { title: '检验人', dataIndex: 'inspectUserName', ...tableResizable() },
            { title: '检验时间', dataIndex: 'inspectTime', ...tableResizable() },
            { title: '检验工时（分钟）', dataIndex: 'inspectHours', ...tableResizable() },
            { title: '合格数', dataIndex: 'qualifiedQuantity', ...tableResizable() },
            { title: '返修数', dataIndex: 'repairQuantity', ...tableResizable() },
            { title: '报废数', dataIndex: 'scrappedQuantity', ...tableResizable() },
            {
                title: '操作',
                width: 120,
                dataIndex: 'operate',
                customRender: (...args) => withTpfTableOperateColumn(...args)(onOpenDetail)
            }
        ] as TpfColumnType[];
    });
    const tableData = ref<any[]>();

    const onOpenDetail = [
        {
            title: '详情',
            onClick: row => {
                router.push({
                    path: '/qualityInspection/qualityInspectionTask/components/detailsView',
                    query: encodeParams({
                        type: type,
                        productionOrderId: row.record.inspectRecordId,
                        title: title,
                        userName: processCheckHomeDetails.value['inspect_user-user_id-user_name']
                    })
                });
            }
        }
    ] as TpfOperateBtn[];
    const inspectOrderId = ref<string>();
    const getProductionOrderById = async () => {
        loading.value = true;
        try {
            const res = await inspectRecordAPi.getInspectRecordDetailByInspectOrderId({
                inspectOrderId: inspectOrderId.value
            });
            tableData.value = res.data.list;
        } finally {
            loading.value = false;
        }
    };
    const getTitle = computed(() => {
        return (title ? title + '-' : '') + '查看详情';
    });
    const processCheckHomeDetails = ref<any>({});
    const getProcessCheckHomeDetails = () => {
        // 0过程质检 1成品质检
        if (type === '0') {
            processCheckHomeDetails.value = saveRowDataStore.getRowData(
                cacheKeyEnum.processCheckHomeDetails
            );
        } else {
            processCheckHomeDetails.value = saveRowDataStore.getRowData(
                cacheKeyEnum.processCheckHomeDetails
            );
        }
        inspectOrderId.value = processCheckHomeDetails.value.inspect_order_id;
        getProductionOrderById();
        console.log(processCheckHomeDetails.value, 'dddd', type);
    };
    onMounted(() => {
        getProcessCheckHomeDetails();
    });
</script>

<style scoped lang="less">
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

    :deep(.tpf-operateColumn) {
        justify-content: left;
    }
</style>
