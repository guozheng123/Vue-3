<template>
    <TpfModal v-model:visible="visible" title="工序计划详情" height="400px" width="1000px">
        <TpfLayout>
            <template #content>
                <TpfTableLayout>
                    <template #default="args">
                        <TpfTable
                            :scroll="{ y: 350, x: 700 }"
                            v-bind="{
                                ...args,
                                ...tableInfo,
                                loading,
                                pagination,
                                columns
                            }"
                        />
                    </template>
                </TpfTableLayout>
            </template>
        </TpfLayout>
        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">关闭</a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="ts" name="ProcessPlanningDetail">
    import TpfModal from '@/components/TpfModal/index.vue';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, unref, defineAsyncComponent } from 'vue';
    import type { TpfColumnType } from '@/types';
    import { useAntdTable, useRef } from '@/hooks';
    import { tableResizable } from '@/config';
    import { useJobOrderAPi, workingProcedurePlan } from '@/api';

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));
    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const jobOrderAPi = useJobOrderAPi();
    const [visible, setVisible] = useRef(false);
    const params = ref({});
    let data: any = [];
    const open = (res: any) => {
        console.log(res);
        data = res;
        params.value = res;
        setVisible(!visible.value);
        getDataList();
    };

    const columns = ref<TpfColumnType[]>([
        {
            title: '工序任务单号',
            dataIndex: 'workOrderCode',
            ...tableResizable()
        },
        {
            title: '项目编号',
            dataIndex: 'projectCode',
            ...tableResizable()
        },
        {
            title: '项目名称',
            dataIndex: 'projectName',
            ...tableResizable()
        },
        {
            title: '物料编号',
            dataIndex: 'materialCode',
            ...tableResizable()
        },
        {
            title: '工序名称',
            dataIndex: 'operationName',
            ...tableResizable()
        },
        {
            title: '物料名称',
            dataIndex: 'materialName',
            ...tableResizable()
        },

        {
            title: '作业单元',
            dataIndex: 'workUnitName',
            ...tableResizable()
        },
        {
            title: '计划开始日期',
            dataIndex: 'plannedStartDate',
            ...tableResizable()
        },
        {
            title: '计划结束日期',
            dataIndex: 'plannedEndDate',
            ...tableResizable()
        },
        {
            title: '工序计划数',
            dataIndex: 'plannedNumber',
            ...tableResizable()
        },

        {
            title: '计划数',
            dataIndex: 'operationPlannedNumber',
            ...tableResizable()
        },
        {
            title: '创建时间',
            dataIndex: 'createDatetime',
            ...tableResizable()
        },
        {
            title: '创建人',
            dataIndex: 'createUserName',
            ...tableResizable()
        }
    ]);

    const { tableInfo, pagination, loading, getDataList } = useAntdTable({
        api: async () => {
            return data.data.object;
        },
        rowKey: 'id',
        isPageAble: false
    });

    defineExpose({ open });
</script>

<style scoped lang="less">
    :deep(.tpf-layout-content) {
        margin-top: 0 !important;

        .operate-line {
            height: 0 !important;
        }
    }
</style>
