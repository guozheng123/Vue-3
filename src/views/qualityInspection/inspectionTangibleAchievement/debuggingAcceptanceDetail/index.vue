<template>
    <TpfAddInfoLayout title="调试验收详情" class="debugging-acceptance-detail">
        <!-- 单据信息 -->
        <TpfCollapse title="单据信息" id="billData">
            <LoadingSkeleton>
                <TpfDescriptions :originalDate="invoicesData" :renderList="invoicesList" />
            </LoadingSkeleton>
        </TpfCollapse>
        <!-- 质检项目及标准 -->
        <TpfCollapse title="质检项目及标准" id="qcItemsData">
            <LoadingSkeleton>
                <QcItemsTable :qcColumns="qcColumns" :qcTableData="qcTableData" />
            </LoadingSkeleton>
        </TpfCollapse>
        <!-- 图片 -->
        <TpfCollapse title="图片" id="imageView">
            <LoadingSkeleton>
                <TpfImagePreview
                    v-bind="{ ...wh }"
                    :imgList="imgList"
                    :useClose="false"
                    class="t-bg-white"
                />
            </LoadingSkeleton>
        </TpfCollapse>
        <TpfAnchor :anchorList="anchorList" />
    </TpfAddInfoLayout>
</template>

<script setup lang="tsx" name="debuggingAcceptanceDetail">
    import { TpfColumnType } from '@/types';
    import { useRouteQuery } from '@/hooks';
    import { useQcSatAPi } from '@/api';
    import { ref, computed, onMounted, defineAsyncComponent } from 'vue';
    import { getTpfOptionEnum, statusAcceptanceOption, actionStatus } from '@/config';
    import { Badge } from 'ant-design-vue';
    import QcItemsTable from '../components/QcItemsTable.vue';
    import HolyGrailLayout from '../components/HolyGrailLayout.vue';
    import TpfImagePreview from '@/components/TpfImagePreview/index.vue';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import TpfDescriptions from '@/components/TpfDescriptions/index.vue';
    import TpfAddInfoLayout from '@/components/TpfAddInfoLayout/index.vue';
    const TpfAnchor = defineAsyncComponent(() => import('@/components/TpfAnchor/index.vue'));
    const { getLabel, statusNameColor } = getTpfOptionEnum();

    const qcSatAPi = useQcSatAPi();

    const anchorList = [
        { href: 'billData', title: '单据信息', visible: true },
        { href: 'qcItemsData', title: '质检项目及标准', visible: true },
        { href: 'imageView', title: '图片', visible: true }
    ];
    const wh = {
        width: 160,
        height: 180
    };
    const tableAttribute = {
        top: 'upperlimitValue',
        value: 'standardValue',
        down: 'lowerlimitValue'
    };
    const { id } = useRouteQuery<{ id: string }>();

    const invoicesData = ref({});
    const departmentData = ref<any[]>();
    const qcTableData = ref<any[]>();
    const imgList = ref<any[]>();
    const invoicesList = computed(() => {
        return [
            { label: '作业工单编号', field: 'workOrderCode' },
            { label: '工序名称', field: 'operationName' },
            { label: '作业单元名称', field: 'workUnitName' },
            { label: '检验人', field: 'inspectUserName' },
            { label: '物料编号', field: 'materialCode' },
            { label: '物料名称', field: 'materialName' },
            { label: '检验日期', field: 'inspectDate' },
            { label: '创建日期', field: 'createDate' },
            { label: '合格数', field: 'qualifiedQuantity' }
        ] as { label: string; field: string }[];
    });
    const qcColumns = ref<TpfColumnType[]>([
        { title: '质检项目', dataIndex: 'qualityInspectionName' },
        { title: '质检标准', dataIndex: 'qualityInspectionStandard' },
        {
            title: '标准值',
            dataIndex: 'standardValue',
            customRender: ({ record }: { record: any }) => {
                return record.qualityInspectionAttribute === '2' ? (
                    <HolyGrailLayout tableAttribute={tableAttribute} data={record} />
                ) : (
                    ''
                );
            }
        },
        {
            title: '实际值',
            dataIndex: 'actualValue',
            customRender: ({ record }: { record: any }) => {
                return onGetVnodeType(record);
            }
        },
        {
            title: '结果',
            dataIndex: 'result',
            customRender: ({ record }: { record: any }) => {
                return getLabel(record.result, statusAcceptanceOption);
            }
        },
        { title: '图片', dataIndex: 'files' },
        {
            title: '操作',
            dataIndex: 'operationResult',
            customRender: ({ record }: { record: any }) => {
                const showText = getLabel(record.operationResult, actionStatus);
                return <Badge color={getLabel(showText, statusNameColor)} text={showText} />;
            }
        }
    ]);
    const onGetVnodeType = (record: any) => {
        const type = record.qualityInspectionAttribute;
        if (type === '1') {
            return getLabel(record.actualValue, statusAcceptanceOption);
        }
        return record.actualValue;
    };
    const onGetDetailData = async () => {
        try {
            const { data } = await qcSatAPi.satDetails({ id });
            invoicesData.value = data.object;
            qcTableData.value = data.object?.qualityInspections || [];
            departmentData.value = data.object?.departmentData || [];
            imgList.value = data.object?.files || [];
        } catch (error) {
            console.log(error);
        }
    };
    onMounted(() => {
        onGetDetailData();
    });
</script>

<style lang="less" scoped>
    .debugging-acceptance-detail {
        height: 100%;

        .t-bg-white {
            background: white;
        }
    }
</style>
