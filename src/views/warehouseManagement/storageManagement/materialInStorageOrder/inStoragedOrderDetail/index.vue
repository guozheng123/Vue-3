<template>
    <TpfLayout>
        <template #header>
            <LoadingSkeleton>
                <TpfForm
                    @onSubmit="onSubmit"
                    :pageCode="pageCode"
                    isConfig
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
                                seq: true,
                                beforeRender
                            }"
                        />
                    </template>
                    <template #operateLeft>
                        <a-button ghost type="primary" class="tpf-button" @click="exportTable">
                            <SvgIcon type="icon-querenruku" /> 导出
                        </a-button>
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
    </TpfLayout>
</template>

<script setup lang="tsx" name="inStoragedOrderDetail">
    import { useStore } from '@/store';
    import { useFilesystemApi, useQueryAPi, useWarehouseApi } from '@/api';
    import type { ReqGetTableList } from '@/api';
    import { PageCodeEnum, getTpfOptionEnum } from '@/config';
    import type { TpfColumnType } from '@/types';
    import { useAntdTable } from '@/hooks';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, unref, defineAsyncComponent } from 'vue';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { withTpfTableSortColumn } from '@/components/TpfTable/index';

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );

    const pageCode = PageCodeEnum.wMMaterialYesInStoreDetail;

    const useQuery = useQueryAPi();
    const warehouseApi = useWarehouseApi();

    const { getLabel, checkResult, moveTypeList } = getTpfOptionEnum();

    const searchInfo = ref<ReqGetTableList>({} as ReqGetTableList);

    const filesystemApi = useFilesystemApi();
    const { cacheSearchStore } = useStore();

    const onSubmit = (val: any) => {
        val.mainEntityCode = 't_material_yes_in_store_detail';
        if (!val.conditions.filter((v: any) => v.conditionFieldName === 'in_status').length) {
            val.conditions.push({
                conditionFieldName: 'in_status',
                value: '1'
            });
        }
        searchInfo.value = unref(val);
        unref(pagination).current = 1;
        getDataList();
    };
    const { tableInfo, pagination, loading, getDataList, selectedRowInfo, sortFieldInfo } =
        useAntdTable({
            api: async pageInfo => {
                const { current, pageSize } = unref(pageInfo);
                const res = await useQuery.execute({
                    ...unref(searchInfo),
                    pageSize,
                    sortByAsc: false,
                    sortedField: 'in_date_time',
                    page: current
                });
                return res.data.object;
            },
            rowKey: 'id',
            isConfig: true,
            useSorter: true,
            isPageAble: true
        });

    const beforeRender = (list: TpfColumnType[]) => {
        return unref(list).map(item => {
            if (item.dataIndex === 'is_qualified') {
                item.customRender = ({ text }: { text: number }) => {
                    return getLabel(text, checkResult);
                };
            }
            if (item.dataIndex === 'in_date_time') {
                item.sorter = {
                    compare: (a: any, b: any) => {
                        return withTpfTableSortColumn(a, b)('in_date_time');
                    }
                };
            }
            if (item.dataIndex === 'move_type_code') {
                item.customRender = ({ text }: { text: number }) => {
                    return getLabel(text, moveTypeList);
                };
            }
            return item;
        });
    };
    const exportTable = async () => {
        filesystemApi.exportFileList(() =>
            warehouseApi.exportMaterialInStore({
                ...unref(searchInfo),
                tableHeaderConfig: cacheSearchStore.getUploadLoadSortColumns(pageCode)
            })
        );
    };
</script>
