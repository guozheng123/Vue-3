<template>
    <div>
        <TpfCollapse title="质检信息" gap="0">
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
                                        seq: true
                                    }"
                                />
                            </template>
                        </TpfTableLayout>
                    </template>
                </TpfLayout>
            </a-card>
        </TpfCollapse>
        <QCMultipleValuesModal v-if="showQCMultipleValuesModal" ref="QCMultipleValuesDom" />
    </div>
</template>

<script setup lang="tsx">
    import { ref, defineAsyncComponent, onMounted } from 'vue';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import type { TpfColumnType } from '@/types';
    import { useAntdTable } from '@/hooks';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import { getTpfOptionEnum } from '@/config';
    import { useQCMultipleValuesModal } from '@/components';

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));
    type Props = {
        paramsData?: any;
    };
    const props = withDefaults(defineProps<Props>(), {
        paramsData: () => ({})
    });

    const { getLabel, qualityInspectionAttribute } = getTpfOptionEnum();

    const {
        QCMultipleValuesModal,
        QCMultipleValuesDom,
        openQCMultipleValuesModal,
        showQCMultipleValuesModal
    } = useQCMultipleValuesModal();
    const columns = ref<TpfColumnType[]>([
        {
            title: '质检项目编号',
            dataIndex: 'inspectProjectCode'
        },
        {
            title: '质检项目名称',
            dataIndex: 'inspectProjectName'
        },
        {
            title: '质检标准',
            dataIndex: 'inspectStandard'
        },
        {
            title: '质检属性',
            dataIndex: 'qualityInspectionAttribute',
            customRender: ({ text }) => {
                return getLabel(text, qualityInspectionAttribute);
            }
        },
        {
            title: '上限',
            dataIndex: 'upValue'
        },
        {
            title: '标准值',
            dataIndex: 'standardValue'
        },
        {
            title: '下限',
            dataIndex: 'downValue'
        },
        {
            title: '实际值',
            dataIndex: 'actualValue',
            customRender: ({ record }: { record: any }) => {
                if (record.inspectProjectDetailVos?.length > 1) {
                    return (
                        <span
                            class="tpf-link"
                            onClick={() => {
                                record.projectName = record.inspectProjectName;
                                record.standard = record.inspectStandard;
                                openQCMultipleValuesModal(record);
                            }}
                        >
                            查看
                        </span>
                    );
                }
                if (record.inspectProjectDetailVos?.length === 1) {
                    return record.inspectProjectDetailVos[0].actualValue;
                }
                return record.actualValue;
            }
        },
        {}
    ]);
    const { tableInfo, loading, getDataList } = useAntdTable({
        api: async () => {
            return {
                list: props.paramsData.inspectProjectResultVos || []
            };
        },
        rowKey: 'id',
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
