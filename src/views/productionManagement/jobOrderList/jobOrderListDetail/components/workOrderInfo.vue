<template>
    <div class="workOrderInfo">
        <TpfTable
            :columns="columns"
            :dataSource="dataSource"
            :pagination="false"
            :loading="loading"
        />
    </div>
</template>

<script setup lang="tsx" name="workOrderInfo">
    import TpfTable from '@/components/TpfTable/index.vue';

    import { computed, ref, onMounted } from 'vue';
    import { useJobOrderAPi } from '@/api';

    import { TpfColumnType } from '@/types';

    import { tableResizable, getTpfOptionEnum } from '@/config';
    const props = defineProps(['detailData']);
    const jobOrderAPi = useJobOrderAPi();
    const { operationTypeNameListOptions, getLabel } = getTpfOptionEnum();

    const columns = computed(() => {
        return [
            { title: '工序编号', dataIndex: 'operationCode', ...tableResizable() },
            { title: '工序名称', dataIndex: 'operationName', ...tableResizable() },
            {
                title: '工序类型',
                dataIndex: 'operationType',
                ...tableResizable(),
                customRender: ({ text }) => {
                    return getLabel(text, operationTypeNameListOptions);
                }
            },
            { title: '计划开始时间', dataIndex: 'plannedStartDate', ...tableResizable() },
            { title: '计划结束时间', dataIndex: 'plannedEndDate', ...tableResizable() },
            { title: '计划数', dataIndex: 'plannedNumber', ...tableResizable() },
            { title: '完工数', dataIndex: 'qualifiedQuantity', ...tableResizable() },
            { title: '报废数', dataIndex: 'scrapQuantity', ...tableResizable() },
            { title: '返修数', dataIndex: 'repairQuantity', ...tableResizable() },
            { title: '计划工时（小时）', dataIndex: 'plannedWorkingHours', ...tableResizable() },
            { title: '实际工时（小时）', dataIndex: 'actualWorkingHours', ...tableResizable() },
            { title: '工时差异（小时）', dataIndex: 'differenceHours', ...tableResizable() }
        ] as TpfColumnType[];
    });
    const dataSource = ref<any[]>([]);
    const loading = ref(false);
    const onGetTableData = async () => {
        try {
            const { workOrderId, workOrderCode } = props.detailData;
            if (typeof workOrderId !== 'number' || !workOrderCode) {
                console.log(workOrderId, workOrderCode);
                return;
            }
            loading.value = true;
            dataSource.value = [];
            const { data } = await jobOrderAPi.getWorkOrderProcessingSchedule({
                workOrderId,
                workOrderCode
            });
            const { object } = data;
            if (Array.isArray(object.list)) {
                dataSource.value = object.list;
            }
        } catch (error) {
            console.log(error);
        } finally {
            loading.value = false;
        }
    };
    onMounted(() => {
        onGetTableData();
    });
</script>

<style lang="less" scoped>
    .workOrderInfo {
        height: 100%;
        padding: 10px 12px;
        box-sizing: border-box;

        :deep(.tpf-table) {
            height: 100%;
        }
    }
</style>
