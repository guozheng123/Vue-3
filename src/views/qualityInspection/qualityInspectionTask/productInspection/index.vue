<!-- 成品质检 -->
<template>
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
                    <template #operateLeft>
                        <a-button type="primary" class="tpf-button" @click="detailsView">
                            <SvgIcon type="icon-mingxichaxun" />明细查询
                        </a-button>
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
    </TpfLayout>
</template>

<script setup lang="tsx" name="Station">
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, unref, defineAsyncComponent } from 'vue';
    import router from '@/router';
    import { useAntdTable, useRouteBase64 } from '@/hooks';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import type { TpfColumnType } from '@/types';
    import { useQueryAPi } from '@/api';
    import { PageCodeEnum } from '@/config';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { useStore, cacheKeyEnum } from '@/store';
    const { saveRowDataStore } = useStore();
    const useQuery = useQueryAPi();

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const exportFileParams = ref();

    const pageCode = PageCodeEnum.productionInspectOrderInfo;

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));
    const { encodeParams } = useRouteBase64();
    const searchInfo = ref<{ [k: string]: any }>({});
    const defaultBtn = [
        {
            title: '详情',
            onClick: (row: any) => {
                saveRowDataStore.setRowData(cacheKeyEnum.processCheckHomeDetails, {
                    ...row.record
                });
                router.push({
                    path: '/qualityInspection/qualityInspectionTask/components/homeDetails',
                    query: encodeParams({ type: '1', title: '成品质检' })
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
        searchInfo.value = unref(res) || {};
        getDataList();
    };

    const { tableInfo, pagination, getDataList } = useAntdTable({
        api: async pageInfo => {
            const { current, pageSize } = unref(pageInfo);
            exportFileParams.value = {
                ...unref(searchInfo),
                page: current,
                pageSize,
                conditions: [
                    ...unref(searchInfo).conditions,
                    { conditionFieldName: 'inspect_type', values: ['FQC'] }
                ],
                sortByAsc: false,
                sortedField: 'create_date'
            };
            const res = await useQuery.execute(unref(exportFileParams));
            return res.data.object;
        },
        rowKey: 'result_entity_id',
        isPageAble: true,
        isConfig: true
    });

    const detailsView = () => {
        // 1代表成品质检
        router.push({
            path: '/qualityInspection/qualityInspectionTask/components/detailQuery',
            query: encodeParams({ type: '1', title: '成品质检' })
        });
    };
</script>
