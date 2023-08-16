<template>
    <div class="workOrderInfo">
        <LoadingSkeleton>
            <TpfTable
                v-bind="{
                    ...tableInfo,
                    loading,
                    pagination,
                    columns
                }"
            />
        </LoadingSkeleton>
    </div>
</template>

<script setup lang="tsx" name="workOrderInfo">
    import { computed, defineAsyncComponent, unref } from 'vue';
    import type { TpfColumnType } from '@/types';
    import { tableResizable, getTpfOptionEnum } from '@/config';
    import { useAntdTable, useRouteQuery } from '@/hooks';
    import { type ResQueryWorkOrderList, useProdQueryAPi } from '@/api';
    import { onMounted } from 'vue';

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const { getLabel, workOrderStatus } = getTpfOptionEnum();

    const prodQueryAPi = useProdQueryAPi();

    const { productionOrderCode } = useRouteQuery<{ productionOrderCode: string }>();

    const columns = computed(() => {
        return [
            {
                title: '作业工单号',
                dataIndex: 'workOrderCode',
                ...tableResizable(),
                fixed: 'left'
            },
            { title: '作业工单状态', dataIndex: 'workOrderStatus', ...tableResizable() },
            { title: '计划数', dataIndex: 'plannedNumber', ...tableResizable() },
            { title: '合格数', dataIndex: 'completionsNumber', ...tableResizable() },
            { title: '返修数', dataIndex: 'repairNumber', ...tableResizable() },
            { title: '报废数', dataIndex: 'scrapNumber', ...tableResizable() },
            { title: '实际结束时间 ', dataIndex: 'actualEndDatetime', ...tableResizable() }
        ] as TpfColumnType[];
    });

    const beforeRender = (list: ResQueryWorkOrderList[]) => {
        return unref(list).map(item => {
            item.workOrderStatus = getLabel(item.workOrderStatus, workOrderStatus) as string;
            return item;
        });
    };

    const { tableInfo, pagination, loading, getDataList } = useAntdTable({
        api: async pagination => {
            const { current: page, pageSize } = unref(pagination);
            const res = await prodQueryAPi.queryWorkOrderList({
                pageSize,
                page,
                productionOrderCode: unref(productionOrderCode)
            });
            return res.data.object;
        },
        rowKey: 'workOrderCode',
        isPageAble: true,
        dataCallBack: beforeRender
    });

    onMounted(() => {
        unref(pagination).current = 1;
        getDataList();
    });
</script>

<style lang="less" scoped>
    .workOrderInfo {
        height: 100%;
        padding: 12px;
        box-sizing: border-box;

        :deep(.tpf-table) {
            height: 100%;
        }
    }
</style>
