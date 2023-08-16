<!-- 过程质检 -->
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
    import type { TpfColumnType, TpfOperateBtn } from '@/types';
    import { PageCodeEnum } from '@/config';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { useQueryAPi } from '@/api';
    import { useStore, cacheKeyEnum } from '@/store';

    const { saveRowDataStore } = useStore();

    const useQuery = useQueryAPi();
    const exportFileParams = ref();
    const pageCode = PageCodeEnum.productionInspectOrderInfo;
    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const { encodeParams } = useRouteBase64();
    const searchInfo = ref<{ [k: string]: any }>({});

    const defaultBtn = [
        {
            title: '详情',
            onClick: row => {
                saveRowDataStore.setRowData(cacheKeyEnum.processCheckHomeDetails, {
                    ...row.record
                });
                router.push({
                    path: '/qualityInspection/qualityInspectionTask/components/homeDetails',
                    query: encodeParams({ type: '0', productionOrderId: 10, title: '过程质检' })
                });
            }
        }
    ] as TpfOperateBtn[];

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
                    { conditionFieldName: 'inspect_type', values: ['IPQC'] }
                ],
                sortByAsc: false,
                sortedField: 'create_date'
            };
            const res = await useQuery.execute(unref(exportFileParams));
            return res.data.object;
        },
        rowKey: 'result_entity_id',
        useSorter: true,
        isPageAble: true,
        isConfig: true,
        hasRowSelection: true
    });

    const detailsView = () => {
        router.push({
            path: '/qualityInspection/qualityInspectionTask/components/detailQuery',
            query: encodeParams({ type: '0', title: '过程质检' })
        });
    };
</script>
