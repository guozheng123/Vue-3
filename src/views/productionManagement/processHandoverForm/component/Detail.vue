<template>
    <div>
        <TpfModal v-model:visible="visible" title="交接单详情" height="400px" width="1000px">
            <TpfDescriptions
                :descriptionsProps="{
                    column: 4,
                    labelStyle: { width: '100px', textAlign: 'end' }
                }"
                :originalDate="originalDate"
                :renderList="renderList"
            />
            <TpfTable
                :scroll="{ y: 350, x: 700 }"
                v-bind="{
                    ...tableInfo,
                    loading,
                    pagination,
                    columns,
                    seq: true
                }"
            />

            <template #footerRight>
                <a-button class="tpf-button" @click="visible = false">关闭</a-button>
            </template>
        </TpfModal>
    </div>
</template>

<script setup lang="ts" name="AddModel">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { ref, defineAsyncComponent, computed, unref } from 'vue';
    import { useRef, useAntdTable } from '@/hooks';
    import { useHandoverAPi } from '@/api';
    import { getTpfOptionEnum } from '@/config';
    import TpfDescriptions from '@/components/TpfDescriptions/index.vue';
    import type { TpfDescColumnType, TpfColumnType } from '@/types';
    import { tableResizable } from '@/config';

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const { getLabel, handoverStatus } = getTpfOptionEnum();

    const originalDate = ref<any>({});
    const useHandover = useHandoverAPi();

    const [visible, setVisible] = useRef(false);

    const columns = ref<TpfColumnType[]>([
        {
            title: '项目编号',
            dataIndex: 'projectCode',
            ...tableResizable()
        },
        {
            title: '物料编码',
            dataIndex: 'materialCode',
            ...tableResizable()
        },
        {
            title: '物料名称',
            dataIndex: 'materialName',
            ...tableResizable()
        },
        {
            title: '交接数量',
            dataIndex: 'handoverNumber',
            ...tableResizable()
        },
        {
            title: '接收数量',
            dataIndex: 'receivedNumber',
            ...tableResizable()
        },

        { title: '作业工单编号', dataIndex: 'workOrderCode', ...tableResizable() }
    ]);
    const renderList = computed(() => {
        return [
            { label: '交接单号', field: 'handoverOrderCode' },
            {
                label: '状态',
                field: 'status'
            },
            { label: '工序名称', field: 'operationName' },
            { label: '创建人', field: 'createUserName' },

            { label: '创建时间', field: 'createDatetime' },

            { label: '接收人', field: 'recipientUserName' },
            { label: '接收时间', field: 'recipientDatetime' }
        ] as TpfDescColumnType[];
    });

    const { tableInfo, pagination, loading, setTableList } = useAntdTable({
        api: async () => {
            return { list: [] };
        },
        rowKey: 'index',
        isPageAble: false,
        colorRow: false,
        hasRowSelection: false
    });
    const open = async (val: string) => {
        const res = await useHandover.handoverDetail([val]);
        originalDate.value = res.data.list[0];
        originalDate.value.status = getLabel(originalDate.value.status, handoverStatus);
        setVisible(true);
        setTableList(unref(originalDate).detailList);
    };

    defineExpose({ open });
</script>

<style scoped lang="less"></style>
