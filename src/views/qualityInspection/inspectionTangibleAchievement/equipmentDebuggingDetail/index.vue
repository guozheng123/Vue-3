<template>
    <TpfAddInfoLayout title="装备调试详情" class="equipment-debugging-detail">
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
        <!-- 问题描述 -->
        <TpfCollapse title="问题描述" id="description">
            <Description :departmentData="departmentData" />
        </TpfCollapse>
        <TpfAnchor :anchorList="anchorList" />
    </TpfAddInfoLayout>
</template>

<script setup lang="tsx" name="equipmentDebuggingDetail">
    import { useRouteQuery } from '@/hooks';
    import { getTpfOptionEnum, statusAcceptanceOption } from '@/config';

    import { ref, computed, onMounted, defineAsyncComponent } from 'vue';
    import { useQcFatAPi } from '@/api';
    import Description from './Description.vue';
    import QcItemsTable from '../components/QcItemsTable.vue';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import TpfDescriptions from '@/components/TpfDescriptions/index.vue';
    import TpfAddInfoLayout from '@/components/TpfAddInfoLayout/index.vue';
    import HolyGrailLayout from '../components/HolyGrailLayout.vue';

    const TpfAnchor = defineAsyncComponent(() => import('@/components/TpfAnchor/index.vue'));
    const qcFatAPi = useQcFatAPi();
    const { getLabel } = getTpfOptionEnum();
    const { id } = useRouteQuery<{ id: string }>();
    const anchorList = [
        { href: 'billData', title: '单据信息', visible: true },
        { href: 'qcItemsData', title: '质检项目及标准', visible: true },
        { href: 'description', title: '问题描述', visible: true }
    ];
    const tableAttribute = {
        top: 'upperlimitValue',
        value: 'standardValue',
        down: 'lowerlimitValue'
    };
    const invoicesData = ref({});
    const departmentData = ref<any[]>();
    const qcTableData = ref<any[]>();
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
    const qcColumns = computed(() => {
        return [
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
            { title: '图片', dataIndex: 'files' }
        ] as { title: string; dataIndex: string }[];
    });
    const onGetVnodeType = (record: any) => {
        const type = record.qualityInspectionAttribute;
        if (type === '1') {
            return getLabel(record.actualValue, statusAcceptanceOption);
        }
        return record.actualValue;
    };
    const onGetDetailData = async () => {
        try {
            const { data } = await qcFatAPi.fatDetails({ id });
            invoicesData.value = data.object;
            qcTableData.value = data.object?.qualityInspections || [];
            departmentData.value = data.object?.problems || [];
        } catch (error) {
            console.log(error);
        }
    };
    onMounted(() => {
        onGetDetailData();
    });
</script>

<style lang="less" scoped>
    .equipment-debugging-detail {
        height: 100%;
    }
</style>
