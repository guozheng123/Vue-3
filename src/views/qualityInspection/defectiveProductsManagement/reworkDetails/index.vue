<template>
    <TpfLayout>
        <template #header>
            <LoadingSkeleton>
                <TpfForm
                    isConfig
                    @onSubmit="onSubmit"
                    :pageCode="pageCode"
                    :labelCol="{ style: { width: '100px' } }"
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
                                loading,
                                pagination,
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

<script setup lang="tsx" name="reworkDetails">
    import { useQueryAPi } from '@/api';
    import { PageCodeEnum, getTpfOptionEnum } from '@/config';
    import { useAntdTable } from '@/hooks';
    import type { TpfColumnType } from '@/types';
    import TpfForm from '@/components/TpfForm/index.vue';

    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, unref, defineAsyncComponent } from 'vue';

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));
    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );

    const pageCode = PageCodeEnum.repairDetail;

    const { getLabel, repairOrderDetailStatus } = getTpfOptionEnum();
    const searchInfo = ref<{ [k: string]: any }>({});

    const queryAPi = useQueryAPi();

    const onSubmit = (res: any) => {
        searchInfo.value = unref(res) || {};
        getDataList();
    };

    const beforeRender = (list: TpfColumnType[]) => {
        return unref(list).map(item => {
            if (item.dataIndex === 'repair_status') {
                item.customRender = ({ text }) => {
                    return getLabel(text, repairOrderDetailStatus);
                };
            }
            return item;
        });
    };
    const { tableInfo, pagination, loading, getDataList } = useAntdTable({
        api: async pageInfo => {
            const { current, pageSize } = unref(pageInfo);
            // const res = await useApi.queryRepairOrderDetailListByPage({
            const res = await queryAPi.execute({
                page: current,
                pageSize,
                ...unref(searchInfo)
            });
            return res.data.object;
        },
        rowKey: 'repairOrderDetailId',
        isPageAble: true,
        isConfig: true
    });
</script>
