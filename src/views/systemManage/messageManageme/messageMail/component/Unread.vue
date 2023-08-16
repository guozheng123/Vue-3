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
                    <template #operateLeft>
                        <a-button type="primary" class="tpf-button" @click="exportTable(0)">
                            全部已读
                        </a-button>
                        <a-button
                            @click="exportTable(1)"
                            class="tpf-button"
                            type="primary"
                            ghost
                            :disabled="isEmpty(selectedRowInfo.selectedRows)"
                        >
                            标记已读
                        </a-button>
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
    </TpfLayout>
</template>

<script setup lang="tsx" name="completedStorageTicket">
    import { useMessageApi } from '@/api';
    import type { TpfColumnType } from '@/types';
    import { useAntdTable } from '@/hooks';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, unref, defineAsyncComponent, computed } from 'vue';

    import TpfForm from '@/components/TpfForm/index.vue';

    import { isEmpty } from 'lodash-es';

    import { message } from 'ant-design-vue';
    import { getTpfOptionEnum } from '@/config/optionsEnum';

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const messageApi = useMessageApi();

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );

    const { getLabel, returnMethod } = getTpfOptionEnum();

    const searchInfo = ref<{ [k: string]: any }>({});

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
        searchInfo.value = unref(val);
        unref(pagination).current = 1;
        getDataList();
    };
    const { tableInfo, pagination, getDataList, selectedRowInfo } = useAntdTable({
        api: async pageInfo => {
            const { current: page, pageSize, sortedField, sortByAsc } = unref(pageInfo);
            const info = {
                page,
                pageSize,
                sortedField: sortedField || 'createDateTime',
                sortByAsc,
                isRead: 0,
                ...unref(searchInfo)
            };
            const res = await messageApi.viewquerylist(info);
            return res.data.object;
        },
        rowKey: 'sendDetailNo',
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

    // 全部已读/标记已读
    const exportTable = async (type: number) => {
        try {
            if (type === 0) {
                const { data } = await messageApi.batchupdate([]);
                if (data.value) {
                    message.success('操作成功');
                    getDataList();
                }
            } else if (type === 1) {
                const { data } = await messageApi.batchupdate(
                    selectedRowInfo.value.selectedRowKeys
                );
                if (data.value) {
                    message.success('操作成功');
                    getDataList();
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
</script>
