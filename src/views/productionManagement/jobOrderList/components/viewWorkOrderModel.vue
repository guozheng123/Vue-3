<template>
    <div class="view-work-order-model">
        <TpfModal v-model:visible="visible" title="查看工单序列号" height="400px" width="800px">
            <div class="vw-model-content">
                <LoadingSkeleton>
                    <TpfTable
                        rowKey="id"
                        v-bind="{
                            loading,
                            columns,
                            ...tableInfo,
                            pagination,
                            getDataList,
                            seq: true
                        }"
                    />
                </LoadingSkeleton>
            </div>

            <template #footerRight>
                <a-button class="tpf-button" @click="setVisible(false)">关闭</a-button>
            </template>
        </TpfModal>
    </div>
</template>

<script setup lang="tsx" name="viewWorkOrderModel">
    import { ref, unref, defineAsyncComponent } from 'vue';
    import { useRef, useAntdTable } from '@/hooks';
    import { tableResizable } from '@/config';
    import { useJobOrderAPi } from '@/api';
    import { TpfColumnType } from '@/types';
    import TpfModal from '@/components/TpfModal/index.vue';
    import TpfTable from '@/components/TpfTable/index.vue';
    const jobOrderAPi = useJobOrderAPi();

    const [visible, setVisible] = useRef(false);
    const workOrderCode = ref<string>();
    const columns = ref<TpfColumnType[]>([
        {
            title: '生产单号',
            dataIndex: 'productionOrderCode',
            ...tableResizable()
        },
        {
            title: '作业单号',
            dataIndex: 'workOrderCode',
            ...tableResizable()
        },
        {
            title: '工单序列号',
            dataIndex: 'workOrderNumberCode',
            ...tableResizable()
        },
        {
            title: '是否打印',
            dataIndex: 'isPrint',
            ...tableResizable(),
            customRender: ({ text }) => (text === 1 ? '是' : '否')
        }
    ]);
    const { tableInfo, pagination, loading, getDataList, changeDataSource } = useAntdTable({
        api: async pagination => {
            const { pageSize = 20, current = 1 } = unref(pagination);
            const codeList = [];
            if (typeof workOrderCode.value === 'string') codeList.push(workOrderCode.value);
            const res = await jobOrderAPi.queryWorkOrderSerialNumberList({
                workOrderCode: codeList,
                pageSize,
                page: current
            });
            return res.data.object;
        },
        rowKey: 'id',
        isPageAble: true
    });

    const open = (data: any) => {
        workOrderCode.value = data.record.workOrderCode;
        setVisible(!visible.value);
        changeDataSource(() => []);
        unref(pagination).current = 1;
        getDataList();
    };
    defineExpose({
        open
    });
</script>

<style lang="less" scoped>
    .vw-model-content {
        height: 100%;

        :deep(.tpf-table) {
            height: 100%;
        }
    }
</style>
