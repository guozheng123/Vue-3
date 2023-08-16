<template>
    <div class="processingProgress">
        <div>
            <a-form
                :model="formState"
                name="advanced_search"
                :label-col="{
                    style: { width: '100px' }
                }"
            >
                <a-row :gutter="24">
                    <a-col :span="6">
                        <a-form-item label="工序任务单号" name="operationTaskOrderCode">
                            <span>{{ formState.operationTaskOrderCode }}</span>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="工序编号" name="operationCode">
                            <span>{{ formState.operationCode }}</span>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="工序名称" name="operationName">
                            <span>{{ formState.operationName }}</span>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="工序计划数" name="plannedNumber">
                            <span>{{ formState.plannedNumber }}</span>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </div>

        <TpfTable
            v-bind="{
                dataSource
            }"
            :columns="columns"
        />
    </div>
</template>

<script setup lang="tsx" name="ProcessingProgress">
    import TpfTable from '@/components/TpfTable/index.vue';
    import { computed, ref } from 'vue';
    import { TpfColumnType } from '@/types';
    import { tableResizable } from '@/config';
    import { useRouteQuery } from '@/hooks';
    import { useOperationTaskListAPi } from '@/api';
    import { onMounted } from 'vue';

    const operationTaskListAPi = useOperationTaskListAPi();
    const { operationTaskOrderId } = useRouteQuery<{ operationTaskOrderId: string }>();

    const dataSource = ref([]);
    const formState = ref({
        operationTaskOrderCode: '',
        operationName: '',
        operationCode: '',
        plannedNumber: ''
    });
    const columns = computed(() => {
        return [
            {
                title: '序号',
                dataIndex: '',
                ...tableResizable(),
                customRender: ({ index }) => {
                    return index + 1;
                }
            },
            {
                title: '物料编号',
                dataIndex: 'materialCode',
                ...tableResizable()
            },
            { title: '物料名称', dataIndex: 'materialName', ...tableResizable() },
            { title: '计划开始日期', dataIndex: 'plannedStartDate', ...tableResizable() },
            { title: '计划结束日期', dataIndex: 'plannedEndDate', ...tableResizable() },
            { title: '计划数', dataIndex: 'plannedNumber', ...tableResizable() },
            { title: '工序完工数', dataIndex: 'completionsNumber', ...tableResizable() },
            { title: '报废数 ', dataIndex: 'scrapNumber', ...tableResizable() },

            { title: '返修数 ', dataIndex: 'repairNumber', ...tableResizable() },
            { title: '班组 ', dataIndex: 'workingTeamName', ...tableResizable() },
            { title: '报工人 ', dataIndex: 'userName', ...tableResizable() },
            { title: '报工时间 ', dataIndex: 'reportTime', ...tableResizable() }
        ] as TpfColumnType[];
    });

    onMounted(async () => {
        const res = await operationTaskListAPi.operationOrderProcessingSchedule({
            operationTaskOrderId: operationTaskOrderId
        });
        formState.value = { ...res.data.object };
        dataSource.value = res.data.object.materialBomVos;
    });
</script>

<style lang="less" scoped>
    .processingProgress {
        height: 100%;
        padding: 10px 12px 0;
        box-sizing: border-box;

        :deep(.tpf-table) {
            height: 100%;
        }
    }
</style>
