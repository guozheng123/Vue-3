<template>
    <TpfCollapse title="工序BOM" gap="0">
        <template #right>
            <div style="margin-right: 20px">{{ version }}</div>
        </template>
        <TpfTable
            class="t-h-[300px] t-p-[12px]"
            v-bind="{ ...tableInfo, pagination: false, columns, seq: true }"
        />
    </TpfCollapse>
</template>

<script setup lang="ts" name="ProductionProcessesBOM">
    import { ref, defineAsyncComponent } from 'vue';
    import type { TpfColumnType } from '@/types';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import { tableResizable } from '@/config';
    import { useExecReportApi } from '@/api';
    import { useRouteQuery, useAntdTable } from '@/hooks';
    import { onMounted } from 'vue';
    import BigNumber from 'bignumber.js';
    import { getSysDecimalPlaces } from '@/utils/getSysConfig';

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));
    type Props = {
        data: any;
    };
    const props = withDefaults(defineProps<Props>(), {
        data: () => ({})
    });
    const version = ref('');
    const execReportApi = useExecReportApi();

    const { operationId } = useRouteQuery<{ operationId: string }>();

    const { beReportProgressId } = useRouteQuery<{ beReportProgressId: string }>();
    const { reportProgressCode } = useRouteQuery<{ reportProgressCode: string }>();

    const columns = ref<TpfColumnType[]>([
        { title: '物料编号', dataIndex: 'materialCode', ...tableResizable() },
        { title: '物料名称', dataIndex: 'materialName', ...tableResizable() },
        { title: '物料类型', dataIndex: 'materialTypeName', ...tableResizable() },
        { title: '单件用量', dataIndex: 'singleUsageQuantity', ...tableResizable() },
        { title: '单位', dataIndex: 'materialUnitName', ...tableResizable() },
        { title: '定额用量', dataIndex: 'usageQuantity', ...tableResizable() },
        { title: '实际用量', dataIndex: 'usedQuantity', ...tableResizable() }
    ]);

    const { tableInfo, getDataList } = useAntdTable({
        api: async () => {
            const params = {
                operationId: operationId,
                beReportProgressId: beReportProgressId,
                reportProgressCode: reportProgressCode
            };
            const res = await execReportApi.material(params);
            res.data.list = res.data.list.map((e: any) => {
                // e.usageQuantity =  e.singleUsageQuantity * props.data.qualifiedQuantity;
                e.usageQuantity = new BigNumber(props.data.qualifiedQuantity)
                    .multipliedBy(e.singleUsageQuantity)
                    .toFixed(getSysDecimalPlaces());
                return e;
            });
            version.value = res.data.list[0].bomVersion ? res.data.list[0].bomVersion : '';
            return res.data;
        },
        rowKey: 'workingTeamId',
        isPageAble: false,
        hasRowSelection: true
    });
    onMounted(() => {
        getDataList();
    });
</script>
