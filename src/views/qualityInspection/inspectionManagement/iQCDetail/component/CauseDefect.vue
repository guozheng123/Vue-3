<template>
    <div>
        <TpfCollapse title="缺陷原因" gap="0">
            <a-card style="padding-bottom: 20px">
                <TpfLayout style="height: 200px">
                    <template #content>
                        <TpfTableLayout>
                            <template #default="args">
                                <TpfTable
                                    v-bind="{
                                        ...args,
                                        ...tableInfo,
                                        loading,
                                        pagination: false,
                                        columns,
                                        seq: true,
                                        operateColumn
                                    }"
                                />
                            </template>
                        </TpfTableLayout>
                    </template>
                </TpfLayout>
            </a-card>
        </TpfCollapse>
        <ImageModal ref="ImageModalRef" :currentListImages="imgList" />
    </div>
</template>

<script setup lang="ts">
    import { ref, defineAsyncComponent, onMounted } from 'vue';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import type { TpfColumnType } from '@/types';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import { withTpfTableOperateColumn } from '@/components/TpfTable';
    import { useAntdTable, useOpenAntdModal, useRouteQuery } from '@/hooks';

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const ImageModal = defineAsyncComponent(() => import('./ImageModal.vue'));
    const [ImageModalRef, useOpenImageModalRef] = useOpenAntdModal();

    type Props = {
        paramsData?: any;
    };
    const props = withDefaults(defineProps<Props>(), {
        paramsData: () => ({})
    });
    const defaultBtn = [{ title: '预览', onClick: (row: any) => onShow(row) }];
    const imgList = ref([]);
    const onShow = (row: any) => {
        console.log(row.record);
        imgList.value = row.record.inspectDefectFileVos;
        useOpenImageModalRef();
    };
    const operateColumn = ref<TpfColumnType>({
        title: '图片',
        align: 'center',
        width: 100,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });
    const columns = ref<TpfColumnType[]>([
        {
            title: '缺陷原因编号',
            dataIndex: 'defectCauseCode'
        },
        {
            title: '缺陷原因',
            dataIndex: 'defectCauseName'
        },
        {
            title: '缺陷数量',
            dataIndex: 'num'
        },
        {
            title: '备注',
            dataIndex: 'remarks'
        }
    ]);

    const { tableInfo, loading, getDataList } = useAntdTable({
        api: async () => {
            return { list: props.paramsData.inspectDefectCauseVos || [] };
        },
        rowKey: 'defectCauseCode',
        isPageAble: false
    });

    onMounted(() => {
        getDataList();
    });
</script>

<style scoped lang="less">
    :deep(.ant-card) {
        .ant-card-body {
            padding: 8px 12px 8px 12px;

            .tpf-layout {
                padding: 0 !important;

                .tpf-table-layout {
                    padding: 0;
                }
                // /*  */
            }

            .operate-line {
                height: 0 !important;
            }
        }
    }
</style>
