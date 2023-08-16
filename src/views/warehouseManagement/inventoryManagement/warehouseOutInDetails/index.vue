<template>
    <TpfLayout>
        <template #header>
            <LoadingSkeleton>
                <TpfForm
                    @onSubmit="onSubmit"
                    :pageCode="pageCode"
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
                        <a-button @click="exportTable" class="tpf-button" type="primary" ghost>
                            <SvgIcon type="icon-daochu" /> 导出
                        </a-button>
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
    </TpfLayout>
</template>

<script setup lang="tsx" name="warehouseOutInDetails">
    import { useStore } from '@/store';
    import { useWarehouseApi, useFilesystemApi } from '@/api';
    import type { ReqGetTableList } from '@/api';
    import { PageCodeEnum, getTpfOptionEnum } from '@/config';
    import { useAntdTable } from '@/hooks';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, unref, defineAsyncComponent } from 'vue';
    import type { TpfColumnType } from '@/types';
    import TpfForm from '@/components/TpfForm/index.vue';
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );

    const pageCode = PageCodeEnum.warehouseManagementWarehouseOutInDetails;

    const { cacheSearchStore } = useStore();

    const filesystemApi = useFilesystemApi();

    const searchInfo = ref<ReqGetTableList>({} as ReqGetTableList);

    const warehouseManagementAPi = useWarehouseApi();
    const { outInStrongTypeOption, getLabel } = getTpfOptionEnum();

    const { tableInfo, pagination, getDataList, sortFieldInfo } = useAntdTable({
        api: async pageInfo => {
            const { current, pageSize, sortByAsc, sortedField } = unref(pageInfo);
            const res = await warehouseManagementAPi.queryOutInStoreDetailPageByParam({
                ...unref(searchInfo),
                page: current,
                pageSize,
                sortByAsc,
                sortedField
            });
            return res.data.object;
        },
        rowKey: 'id',
        isPageAble: true,
        useSorter: true
    });

    const beforeRender = (list: TpfColumnType[]) => {
        return unref(list).map(item => {
            if (item.dataIndex === 'createDateTime') {
                item.sorter = true;
            }
            if (item.dataIndex === 'outInType') {
                item.customRender = ({ text }) => {
                    return <span>{getLabel(text, outInStrongTypeOption)}</span>;
                };
            }
            return item;
        });
    };
    const onSubmit = (val: any) => {
        searchInfo.value = unref(val);
        unref(pagination).current = 1;
        getDataList();
    };
    const exportTable = async () => {
        filesystemApi.exportFileList(() =>
            warehouseManagementAPi.exportOutInStoreDetail({
                ...unref(searchInfo),
                ...unref(sortFieldInfo),
                tableHeaderConfig: cacheSearchStore.getUploadLoadSortColumns(pageCode)
            })
        );
    };
</script>
