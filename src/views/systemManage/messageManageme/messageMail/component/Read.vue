<template>
    <TpfLayout>
        <template #header>
            <LoadingSkeleton>
                <TpfForm
                    @onSubmit="onSubmit"
                    :labelCol="{ style: { width: '98px' } }"
                    :formList="formList"
                />
            </LoadingSkeleton>
        </template>
        <template #content>
            <LoadingSkeleton>
                <TpfTableLayout>
                    <template #default="args">
                        <TpfTable
                            v-bind="{
                                ...args,
                                ...tableInfo,
                                pagination,
                                seq: true,
                                columns
                            }"
                        />
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
    </TpfLayout>
</template>

<script setup lang="tsx" name="completedStorageTicket">
    import { useMessageApi } from '@/api';
    import type { ReqGetTableList } from '@/api';
    import type { TpfColumnType } from '@/types';
    import { useAntdTable } from '@/hooks';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, unref, defineAsyncComponent, computed } from 'vue';
    import TpfForm from '@/components/TpfForm/index.vue';

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));
    const messageApi = useMessageApi();

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );

    const searchInfo = ref<ReqGetTableList>({} as ReqGetTableList);

    const formList = computed(() => {
        return [
            {
                type: 'Input',
                field: 'objectCode',
                label: '消息标题',
                showDefaultValue: '',
                placeholder: '',
                allowClear: true
            },
            {
                type: 'RangePicker',
                valueFormat: 'YYYY-MM-DD HH:mm:ss',
                label: '时间',
                field: 'queryTimeStart@_@queryTimeEnd',
                allowClear: true,
                showTime: true,
                placeholder: ['开始日期', '结束日期']
            }
        ];
    });

    const onSubmit = (val: any) => {
        val.mainEntityCode = 't_material_return';
        searchInfo.value = unref(val);
        unref(pagination).current = 1;
        getDataList();
    };
    const { tableInfo, pagination, getDataList } = useAntdTable({
        api: async pageInfo => {
            const { current: page, pageSize, sortedField, sortByAsc } = unref(pageInfo);
            const info = {
                page,
                pageSize,
                sortedField: sortedField || 'createDateTime',
                sortByAsc,
                isRead: 1
            };
            const res = await messageApi.viewquerylist(info);
            return res.data.object;
        },
        rowKey: 'inspectionTypeId',
        isPageAble: true,
        hasRowSelection: true,
        useSorter: true
    });
    const columns = computed(() => {
        return [
            { title: '消息标题', dataIndex: 'templateTitle' },
            { title: '消息内容', dataIndex: 'sendInfo' },
            { title: '时间', dataIndex: 'createDateTime' }
        ] as TpfColumnType[];
    });
</script>
