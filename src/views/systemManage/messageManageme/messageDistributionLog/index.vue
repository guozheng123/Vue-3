<template>
    <div class="content">
        <TpfLayout>
            <template #header>
                <LoadingSkeleton>
                    <TpfForm :pageCode="pageCode" @onSubmit="onSubmit" isConfig />
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
                                    seq: true,
                                    operateColumn,
                                    beforeRender
                                }"
                            />
                        </template>
                    </TpfTableLayout>
                </LoadingSkeleton>
            </template>
        </TpfLayout>
    </div>
</template>

<script setup lang="tsx" name="OperationTaskList">
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, unref, defineAsyncComponent, onMounted } from 'vue';
    import { TpfColumnType, TpfOperateBtn } from '@/types';
    import { useQueryAPi, useSysPageFieldDiyApi } from '@/api';
    import { PageCodeEnum, getTpfOptionEnum } from '@/config';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { useAntdTable, useRouteBase64 } from '@/hooks';
    import { useRouter } from 'vue-router';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));
    const { encodeParams } = useRouteBase64();

    const router = useRouter();

    const { getLabel, IQCCheckResult, materialCodeMaterialMold } = getTpfOptionEnum();
    const pageCode = PageCodeEnum.noticeMsgEventLog;
    const useQuery = useQueryAPi();

    const searchInfo = ref<{ [k: string]: any }>({});

    const beforeRender = (list: TpfColumnType[]) => {
        return unref(list).map(item => {
            if (item.dataIndex === 'inspect_order_id-PZSQL_iqcinspect_result') {
                item.customRender = ({ text }) => getLabel(text, IQCCheckResult);
            }
            if (item.dataIndex === 'material_code-material_mold') {
                item.customRender = ({ text }) => getLabel(text, materialCodeMaterialMold);
            }

            return item;
        });
    };

    const onSubmit = (res: any) => {
        res.mainEntityCode = 't_msg_event_info';
        searchInfo.value = unref(res) || {};
        getDataList();
    };

    const defaultBtn = [
        { title: '详情', onClick: ({ record }) => getLogDetails(record) }
    ] as TpfOperateBtn[];

    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 150,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });

    //查看详情
    const getLogDetails = (row: any) => {
        console.log(row, '查看详情');
        router.push({
            path: '/systemManage/messageManageme/messageDistributionLog/distributionLogDetail',
            query: encodeParams({ eventNo: row.event_no })
        });
    };

    const { tableInfo, pagination, loading, getDataList } = useAntdTable({
        api: async pageInfo => {
            const { current, pageSize, sortByAsc, sortedField } = unref(pageInfo);
            const res = await useQuery.execute({
                page: current,
                pageSize,
                sortByAsc,
                sortedField: sortedField || 'create_date_time',
                ...unref(searchInfo)
            });
            return res.data.object;
        },
        rowKey: 'event_no',
        isPageAble: true,
        isConfig: true,
        useSorter: true
    });
</script>

<style lang="less" scoped>
    .content {
        height: 100%;
    }
</style>
