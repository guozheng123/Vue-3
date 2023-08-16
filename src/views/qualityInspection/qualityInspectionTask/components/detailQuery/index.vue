<!-- 明细查询弹窗-->
<template>
    <TpfAddInfoLayout :title="getTitle" class="productionOrderDetail">
        <TpfLayout>
            <template #header>
                <LoadingSkeleton>
                    <TpfForm
                        isConfig
                        :pageCode="pageCode"
                        @onSubmit="onSubmit"
                        :labelCol="{ style: { width: '98px' } }"
                    />
                </LoadingSkeleton>
            </template>
            <template #content>
                <LoadingSkeleton>
                    <TpfTableLayout showChangeTableFontSize showChangeTableGap :pageCode="pageCode">
                        <template #default="args">
                            <TpfTable
                                v-bind="{
                                    ...args,
                                    ...tableInfo,
                                    pagination,
                                    operateColumn,
                                    seq: true
                                }"
                            />
                        </template>
                    </TpfTableLayout>
                </LoadingSkeleton>
            </template>
        </TpfLayout>
    </TpfAddInfoLayout>
</template>

<script setup lang="tsx" name="Station">
    import router from '@/router';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import TpfAddInfoLayout from '@/components/TpfAddInfoLayout/index.vue';
    import { ref, unref, defineAsyncComponent, computed, onMounted } from 'vue';
    import { useAntdTable, useRouteQuery, useRouteBase64 } from '@/hooks';
    import { PageCodeEnum } from '@/config';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import type { TpfColumnType } from '@/types';
    import { useQueryAPi } from '@/api';
    import TpfForm from '@/components/TpfForm/index.vue';
    const useQuery = useQueryAPi();
    const pageCode = PageCodeEnum.inspectRecordDetail;

    const { encodeParams } = useRouteBase64();
    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));
    const { title, type } = useRouteQuery<{ title: string; type: string }>();

    const exportFileParams = ref();

    const searchInfo = ref<{ [k: string]: any }>({});

    const defaultBtn = [
        {
            title: '详情',
            onClick: (row: any) => {
                router.push({
                    path: '/qualityInspection/qualityInspectionTask/components/detailsView',
                    query: encodeParams({
                        type,
                        title,
                        productionOrderId: row.record.inspect_record_id
                    })
                });
            }
        }
    ];
    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 100,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });

    const onSubmit = (res: any) => {
        searchInfo.value = unref(res);
        getDataList();
    };

    const typePage = ref<string>('');
    const determineType = () => {
        type === '0' ? (typePage.value = 'IPQC') : (typePage.value = 'FQC');
    };
    const { tableInfo, pagination, getDataList } = useAntdTable({
        api: async pageInfo => {
            const { current, pageSize } = unref(pageInfo);
            exportFileParams.value = {
                page: current,
                ...unref(searchInfo),
                pageSize,
                conditions: [
                    ...unref(searchInfo).conditions,
                    { conditionFieldName: 'inspect_type', values: [typePage.value] }
                ]
            };
            const res = await useQuery.execute(unref(exportFileParams));
            return res.data.object;
        },
        rowKey: 'result_entity_id',
        isPageAble: true,
        isConfig: true
    });
    const getTitle = computed(() => {
        return (title ? title + '-' : '') + '明细查询';
    });
    onMounted(() => {
        determineType();
    });
</script>

<style lang="less" scoped>
    .productionOrderDetail {
        :deep(.addInfoLayout-content) {
            padding: 0;
            box-sizing: border-box;
        }

        :deep(.tpf-collapse) {
            .tpf-collapse-content {
                background: #fff;
            }
        }
    }
</style>
