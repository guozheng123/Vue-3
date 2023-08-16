<template>
    <TpfLayout>
        <template #header>
            <LoadingSkeleton>
                <TpfForm
                    @onSubmit="onSubmit"
                    :pageCode="pageCode"
                    :labelCol="{ style: { width: '98px' } }"
                    isConfig
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
                                beforeRender,
                                seq: true
                            }"
                        />
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
    </TpfLayout>
</template>

<script setup lang="tsx" name="debuggingAcceptance">
    import { useRouter } from 'vue-router';
    import { useQueryAPi } from '@/api';
    import { Badge } from 'ant-design-vue';
    import { PageCodeEnum, getTpfOptionEnum } from '@/config';
    import { useAntdTable, useRouteBase64 } from '@/hooks';
    import type { TpfColumnType } from '@/types';
    import TpfForm from '@/components/TpfForm/index.vue';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, unref, defineAsyncComponent, onMounted, computed } from 'vue';
    import { withTpfTableOperateColumn, withTpfTableSortColumn } from '@/components/TpfTable/index';

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));
    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );

    const pageCode = PageCodeEnum.satPcInspectOrderInfo;
    const { getLabel, inspectionStatus, statusNameColor } = getTpfOptionEnum();
    const router = useRouter();
    const { encodeParams } = useRouteBase64();
    const searchInfo = ref<{ [k: string]: any }>({});
    const useQuery = useQueryAPi();
    const onSubmit = (res: any) => {
        unref(pagination).current = 1;
        searchInfo.value = unref(res) || {};
        getDataList();
    };
    const defaultBtn = [
        {
            title: '详情',
            onClick: (row: any) => {
                console.log(row.value);
                router.push({
                    path: 'debuggingAcceptanceDetail',
                    query: encodeParams({ id: row.value.inspect_order_id })
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
    const beforeRender = (list: TpfColumnType[]) => {
        return unref(list).map(item => {
            if (item.dataIndex === 'status') {
                item.customRender = ({ text, record }) => {
                    const showText = getLabel(record.status, inspectionStatus);
                    return <Badge color={getLabel(showText, statusNameColor)} text={showText} />;
                };
            }
            if (item.dataIndex === 'work_order_code') {
                item.sorter = {
                    compare: (a: any, b: any) => {
                        return withTpfTableSortColumn(a, b)('work_order_code');
                    }
                };
            }
            if (item.dataIndex === 'create_date') {
                item.sorter = {
                    compare: (a: any, b: any) => {
                        return withTpfTableSortColumn(a, b)('create_date');
                    }
                };
            }
            if (item.dataIndex === 'inspect_time') {
                item.sorter = {
                    compare: (a: any, b: any) => {
                        return withTpfTableSortColumn(a, b)('inspect_time');
                    }
                };
            }
            return item;
        });
    };
    const { tableInfo, pagination, getDataList } = useAntdTable({
        api: async pageInfo => {
            const { current, pageSize } = unref(pageInfo);
            const res = await useQuery.execute({
                page: current,
                pageSize,
                ...unref(getParams)
            });
            return res.data.object;
        },
        rowKey: 'id',
        isPageAble: true,
        isConfig: true
    });
    const getParams = computed(() => {
        const searchData = { ...unref(searchInfo) };
        searchData.conditions.push({
            conditionFieldName: 'inspect_type',
            value: 'SAT'
        });
        return {
            ...searchData,
            sortedField: 'create_date',
            sortByAsc: false,
            mainEntityCode: 'production_inspect_order_info'
        };
    });
    onMounted(() => {});
</script>
