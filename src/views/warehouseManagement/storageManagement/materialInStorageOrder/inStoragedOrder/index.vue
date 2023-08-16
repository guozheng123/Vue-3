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
                        <a-button ghost type="primary" class="tpf-button" @click="onAdd">
                            <SvgIcon type="icon-xinzeng" /> 新增
                        </a-button>
                        <a-button ghost type="primary" class="tpf-button">
                            <SvgIcon type="icon-dayin" /> 打印
                        </a-button>
                        <a-button ghost type="primary" class="tpf-button" @click="exportTable">
                            <SvgIcon type="icon-daochu" /> 导出
                        </a-button>
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
    </TpfLayout>
</template>

<script setup lang="tsx" name="notInStorageOrder">
    import { useStore } from '@/store';
    import { useRouter } from 'vue-router';
    import { useQueryAPi, useFilesystemApi, useWarehouseApi } from '@/api';
    import type { ReqGetTableList } from '@/api';
    import { PageCodeEnum, getTpfOptionEnum } from '@/config';
    import type { TpfColumnType } from '@/types';
    import { useRouteBase64, useAntdTable } from '@/hooks';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, unref, defineAsyncComponent } from 'vue';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { withTpfTableSortColumn } from '@/components/TpfTable/index';

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );

    const pageCode = PageCodeEnum.wMMaterialInStore;
    const warehouseApi = useWarehouseApi();
    const useQuery = useQueryAPi();

    const { getLabel, checkResult, moveTypeList } = getTpfOptionEnum();

    const searchInfo = ref<ReqGetTableList>({} as ReqGetTableList);
    const filesystemApi = useFilesystemApi();
    const { encodeParams } = useRouteBase64();
    const { cacheSearchStore } = useStore();
    const router = useRouter();

    const onAdd = async () => {
        router.push({
            path: '/warehouseManagement/storageManagement/materialInStorageOrder/addMaterialInStorageOrder'
        });
    };

    const onSubmit = (val: any) => {
        val.mainEntityCode = 't_material_in_store';
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
    const { tableInfo, pagination, getDataList, selectedRowInfo } = useAntdTable({
        api: async pageInfo => {
            const { current, pageSize } = unref(pageInfo);
            const res = await useQuery.execute({
                ...unref(searchInfo),
                pageSize,
                sortByAsc: false,
                sortedField: 'create_date_time',
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

    const beforeRender = (list: TpfColumnType[]) => {
        return unref(list).map(item => {
            if (item.dataIndex === 'in_no') {
                item.customRender = ({ text, record }) => (
                    <span
                        class="tpf-link"
                        onClick={() => {
                            router.push({
                                path: '/warehouseManagement/storageManagement/materialInStorageOrder/inStorageDetail',
                                query: encodeParams({ id: record.id })
                            });
                        }}
                    >
                        {text}
                    </span>
                );
            }
            if (item.dataIndex === 'is_qualified') {
                item.customRender = ({ text }: { text: number }) => {
                    return getLabel(text, checkResult);
                };
            }
            if (item.dataIndex === 'create_date_time') {
                item.sorter = {
                    compare: (a: any, b: any) => {
                        return withTpfTableSortColumn(a, b)('create_date_time');
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
        let conditionsList = searchInfo.value?.conditions;
        if (unref(selectedRowInfo).selectedRowKeys.length) {
            conditionsList = [
                ...conditionsList,
                {
                    conditionFieldName: 'id',
                    values: unref(selectedRowInfo).selectedRowKeys.map(item => String(item)),
                    type: 'contain',
                    valueType: 'CHAR'
                }
            ];
        }
        filesystemApi.exportFileList(() =>
            warehouseApi.exportMaterialInStore({
                ...unref(searchInfo),
                conditions: conditionsList,
                sortByAsc: false,
                sortedField: 'create_date_time',
                tableHeaderConfig: cacheSearchStore.getUploadLoadSortColumns(pageCode)
            })
        );
    };
</script>
