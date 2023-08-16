<template>
    <div>
        <TpfModal
            class="ViewSerialNumber"
            v-model:visible="visible"
            title="查看序列号"
            height="400px"
            width="1000px"
        >
            <TpfLayout style="height: 320px">
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
                                    columns,
                                    seq: true
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
    </div>
</template>

<script setup lang="ts" name="ViewWorkOrderSerialNumber">
    import TpfModal from '@/components/TpfModal/index.vue';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, unref, defineAsyncComponent } from 'vue';
    import type { TpfColumnType } from '@/types';
    import { useAntdTable, useRef } from '@/hooks';
    import { useJobOrderAPi } from '@/api';
    import { tableResizable, getTpfOptionEnum } from '@/config';

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));
    const { statusOption, getLabel } = getTpfOptionEnum();

    const jobOrderAPi = useJobOrderAPi();
    const [visible, setVisible] = useRef(false);
    const ids = ref([]);
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
        { title: '工单序列号', dataIndex: 'workOrderNumberCode', ...tableResizable() },

        {
            title: '是否打印',
            dataIndex: 'isPrint',
            ...tableResizable(),
            customRender: ({ text }) => {
                return getLabel(text, statusOption);
            }
        }
    ]);
    const open = (val: any) => {
        ids.value = val;
        setVisible(!visible.value);
        pagination.value.current = 1;
        getDataList();
    };
    const { tableInfo, pagination, loading, getDataList } = useAntdTable({
        api: async pageInfo => {
            const { current = 1, pageSize } = unref(pageInfo);

            const res = await jobOrderAPi.queryWorkOrderSerialNumberList({
                workOrderCode: ids.value,
                page: current,
                pageSize
            });

            return res.data.object;
        },
        rowKey: 'id',
        isPageAble: true,
        hasRowSelection: false
    });

    defineExpose({ open });
</script>

<style scoped lang="less">
    :deep(.operate-line) {
        height: 0 !important;
    }
</style>
