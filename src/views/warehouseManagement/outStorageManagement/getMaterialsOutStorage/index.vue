<template>
    <TpfLayout>
        <template #header>
            <LoadingSkeleton>
                <TpfForm
                    @onSubmit="onSubmit"
                    :pageCode="pageCode"
                    isConfig
                    :labelCol="{ style: { width: '118px' } }"
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
                                seq: true,
                                beforeRender,
                                operateColumn
                            }"
                        />
                    </template>
                    <template #operateLeft>
                        <a-button ghost type="primary" class="tpf-button" :disabled="true">
                            <SvgIcon type="icon-dayin" /> 打印
                        </a-button>
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
    </TpfLayout>
</template>

<script setup lang="tsx" name="getMaterialsOutStorage">
    import { useStore } from '@/store';
    import { useRouter } from 'vue-router';
    import { useQueryAPi, useFilesystemApi, useWarehouseApi } from '@/api';
    import type { ReqGetTableList } from '@/api';
    import { PageCodeEnum, getTpfOptionEnum } from '@/config';
    import { useRouteBase64, useAntdTable } from '@/hooks';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, unref, defineAsyncComponent } from 'vue';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { withTpfTableSortColumn, withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import type { TpfColumnType, TpfOperateBtn } from '@/types';
    import { message } from 'ant-design-vue';
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );

    const pageCode = PageCodeEnum.wMGetMaterialsOutStorage; // wMGetMaterialsOutStorage
    const warehouseApi = useWarehouseApi();
    const useQuery = useQueryAPi();

    const { getLabel, checkResult, moveTypeList } = getTpfOptionEnum();

    const searchInfo = ref<ReqGetTableList>({} as ReqGetTableList);
    const { encodeParams } = useRouteBase64();
    const router = useRouter();

    const onSubmit = (res: any) => {
        searchInfo.value = unref(res) || {};
        unref(pagination).current = 1;
        getDataList();
    };

    const { tableInfo, pagination, getDataList } = useAntdTable({
        api: async pageInfo => {
            const { current, pageSize } = unref(pageInfo);
            const res = await useQuery.execute({
                ...unref(searchInfo),
                pageSize,
                sortByAsc: false,
                // sortedField: 'create_date_time',
                page: current
            });
            return res.data.object;
        },
        rowKey: 'id',
        isPageAble: true,
        hasRowSelection: true,
        useSorter: true,
        isConfig: true
    });

    const defaultBtn = [
        {
            title: '退料', // 当出库数=已退料数时，将退料按钮置灰。
            onClick: ({ record }) => {
                const { out_storage_number = 0, return_finish_number = 0 } = record;
                console.log(record);
                if (out_storage_number === return_finish_number) {
                    message.warning('已退料数等于出库数，不能进行退料操作！');
                    // return;
                }
                router.push({
                    path: '/warehouseManagement/outStorageManagement/getMaterialsOutStorage/materialsReturned',
                    query: encodeParams({ id: record.out_storage_order_id })
                });
            }
        }
    ] as TpfOperateBtn[];

    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 90,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });

    const beforeRender = (list: TpfColumnType[]) => {
        return unref(list).map(item => {
            if (item.dataIndex === 'out_storage_order_code') {
                item.customRender = ({ text, record }) => (
                    <span
                        class="tpf-link"
                        onClick={() => {
                            router.push({
                                path: '/warehouseManagement/outStorageManagement/getMaterialsOutStorage/getMaterialsOutStorageDetail',
                                query: encodeParams({ id: record.out_storage_order_id })
                            });
                        }}
                    >
                        {text}
                    </span>
                );
            }
            if (item.dataIndex === 'create_date_time') {
                item.sorter = {
                    compare: (a: any, b: any) => {
                        return withTpfTableSortColumn(a, b)('create_date_time');
                    }
                };
            }
            return item;
        });
    };
</script>
