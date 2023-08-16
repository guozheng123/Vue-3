<template>
    <TpfAddInfoLayout :title="getTitle" class="productionOrderDetail">
        <!-- 检验信息 -->
        <LoadingSkeleton>
            <TpfCollapse title="检验信息" ref="TpfCollapse" id="TpfCollapse">
                <TpfDescriptions
                    :originalDate="invoicesData || {}"
                    :renderList="invoicesList || []"
                />
            </TpfCollapse>
        </LoadingSkeleton>

        <LoadingSkeleton>
            <TpfCollapse title="质检项目" id="inspectionItems" class="processInfo-collapse">
                <TpfTable
                    seq
                    :columns="columns"
                    :dataSource="tableData"
                    size="small"
                    :pagination="false"
                />
            </TpfCollapse>
        </LoadingSkeleton>

        <LoadingSkeleton>
            <TpfCollapse title="缺陷原因" id="defectCause" class="processInfo-collapse">
                <TpfTable
                    seq
                    :columns="tableColumns"
                    :dataSource="defectCauseData"
                    size="small"
                    :pagination="false"
                />
            </TpfCollapse>
        </LoadingSkeleton>
        <LoadingSkeleton>
            <TpfCollapse title="缺陷图片" id="pictureView">
                <TpfImagePreview
                    v-noData="isEmpty(defectImageList)"
                    v-bind="{ ...initImage }"
                    :imgList="defectImageList"
                />
            </TpfCollapse>
        </LoadingSkeleton>
        <TpfAnchor :anchorList="anchorList" />
        <QCMultipleValuesModal v-if="showQCMultipleValuesModal" ref="QCMultipleValuesDom" />
    </TpfAddInfoLayout>
</template>

<script setup lang="tsx" name="productionOrderEdit">
    import TpfTable from '@/components/TpfTable/index.vue';
    import { TpfColumnType } from '@/types';
    import { useRouteQuery } from '@/hooks';
    import { tableResizable, getTpfOptionEnum } from '@/config';
    import TpfImagePreview from '@/components/TpfImagePreview/index.vue';
    import TpfDescriptions from '@/components/TpfDescriptions/index.vue';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import TpfAddInfoLayout from '@/components/TpfAddInfoLayout/index.vue';
    import { ref, computed, onMounted, defineAsyncComponent } from 'vue';
    import { inspectRecordDetailAPi } from '@/api';
    import { isEmpty } from 'lodash-es';
    const inspectRecordAPi = inspectRecordDetailAPi();
    const TpfAnchor = defineAsyncComponent(() => import('@/components/TpfAnchor/index.vue'));
    import { useQCMultipleValuesModal } from '@/components';
    const { getLabel, statusAcceptanceOption, qualityInspectionAttribute } = getTpfOptionEnum();

    const {
        QCMultipleValuesModal,
        QCMultipleValuesDom,
        openQCMultipleValuesModal,
        showQCMultipleValuesModal
    } = useQCMultipleValuesModal();
    const loading = ref(false);
    const { productionOrderId, title, userName } = useRouteQuery<{
        productionOrderId: string;
        title: string;
        userName: string;
    }>();

    const initImage = {
        width: '20%',
        height: 180,
        useClose: false
    };
    const anchorList = [
        { href: 'TpfCollapse', title: '物料信息', visible: true },
        { href: 'inspectionItems', title: '质检项目', visible: true },
        { href: 'defectCause', title: '缺陷原因', visible: true },
        { href: 'pictureView', title: '缺陷图片', visible: true }
    ];
    const invoicesList = computed(() => {
        return [
            { label: '合格数', field: 'qualifiedQuantity' },
            { label: '不良数', field: 'repairQuantity' },
            { label: '报废数', field: 'scrappedQuantity' },
            { label: '检验人', field: 'inspect_user-user_id-user_name' },
            { label: '检验时间', field: 'inspectTime' }
        ] as { label: string; field: string }[];
    });
    const columns = computed(() => {
        return [
            { title: '质检项目', dataIndex: 'qualityInspectionName', ...tableResizable() },
            { title: '质检标准', dataIndex: 'qualityInspectionStandard', ...tableResizable() },
            {
                title: '质检属性',
                dataIndex: 'qualityInspectionAttribute',
                ...tableResizable(),
                customRender: ({ text }) => {
                    return getLabel(text, qualityInspectionAttribute);
                }
            },
            { title: '上限', dataIndex: 'upValue', ...tableResizable() },
            { title: '标准值', dataIndex: 'standardValue', ...tableResizable() },
            { title: '下限', dataIndex: 'downValue', ...tableResizable() },
            {
                title: '实际值',
                dataIndex: 'actualValue',
                ...tableResizable(),
                customRender: ({ record }: { record: any }) => {
                    if (record.inspectProjectDetailVos?.length > 1) {
                        return (
                            <span
                                class="tpf-link"
                                onClick={() => {
                                    record.projectName = record.qualityInspectionName;
                                    record.standard = record.qualityInspectionStandard;
                                    openQCMultipleValuesModal(record);
                                }}
                            >
                                查看
                            </span>
                        );
                    }
                    if (record.inspectProjectDetailVos?.length === 1) {
                        return record.inspectProjectDetailVos[0].actualValue;
                    }
                    return record.actualValue;
                }
                // ===
            },
            {
                title: '结果',
                dataIndex: 'result',
                ...tableResizable(),
                customRender: ({ record }: { record: any }) => {
                    return getLabel(record.result, statusAcceptanceOption);
                }
            }
        ] as TpfColumnType[];
    });

    const tableColumns = computed(() => {
        return [
            { title: '原因编号', dataIndex: 'defectCauseCode', ...tableResizable() },
            { title: '原因描述', dataIndex: 'defectCauseName', ...tableResizable() },
            { title: '数量', dataIndex: 'num', ...tableResizable() },
            { title: '备注', dataIndex: 'remark', ...tableResizable() }
        ] as TpfColumnType[];
    });
    const tableData = ref<any[]>([]);
    const invoicesData = ref({});
    const defectCauseData = ref<any[]>([]);
    const defectImageList = ref<any[]>([]);

    const getProductionOrderById = async () => {
        loading.value = true;
        try {
            const res = await inspectRecordAPi.getInspectRecordDetailDataById({
                inspectRecordId: productionOrderId
            });
            invoicesData.value = res.data.object;
            invoicesData.value['inspect_user-user_id-user_name'] = userName;
            tableData.value = res.data.object.qualityInspections;
            defectCauseData.value = res.data.object.defectCauses;
            if (defectCauseData.value) {
                defectCauseData.value.forEach(item => {
                    defectImageList.value.push(...item.defectCauseFiles);
                });
                console.log(defectImageList.value, '图片项');
            }
        } finally {
            loading.value = false;
        }
    };
    const getTitle = computed(() => {
        return (title ? title : '') + '详情';
    });

    onMounted(() => {
        getProductionOrderById();
    });
</script>

<style lang="less" scoped>
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

    .top-inner {
        height: 60px;
        line-height: 40px;
        font-size: 15px;
        padding: 10px 50px 10px 50px;
        justify-content: space-between;
        flex-wrap: nowrap;

        div {
            max-width: 300px;
            overflow: hidden;
        }
    }
</style>
