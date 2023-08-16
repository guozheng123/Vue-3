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
                            <SvgIcon type="icon-daochu" /> 导出
                        </a-button>
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
    </TpfLayout>
</template>

<script setup lang="tsx" name="completedStorageTicket">
    import { useStore } from '@/store';
    import { useInStoreAPi, useFilesystemApi, useQueryAPi, useWarehouseApi } from '@/api';
    import type { ReqGetTableList } from '@/api';
    import { PageCodeEnum, getTpfOptionEnum } from '@/config';
    import type { TpfColumnType, ExportTableHeaderConfig } from '@/types';
    import { useAntdTable } from '@/hooks';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, unref, defineAsyncComponent } from 'vue';
    import { Badge } from 'ant-design-vue';
    import { isEmpty } from 'lodash-es';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { withTpfTableSortColumn } from '@/components/TpfTable/index';

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );

    const pageCode = PageCodeEnum.wMMaterialArrivalOrderNotDetail;

    const filesystemApi = useFilesystemApi();
    const warehouseApi = useWarehouseApi();
    const {
        moveTypeList,
        getLabel,
        statusNameColor,
        inStatus,
        materialOrderSource,
        customerSupplierType,
        submitStatus
    } = getTpfOptionEnum();

    const searchInfo = ref<ReqGetTableList>({} as ReqGetTableList);

    const inStoreAPi = useInStoreAPi();
    const useQuery = useQueryAPi();
    const { cacheSearchStore } = useStore();

    const onSubmit = (val: any) => {
        val.mainEntityCode = 'arrival_note_details';
        searchInfo.value = unref(val);
        unref(pagination).current = 1;
        getDataList();
    };
    const { tableInfo, pagination, loading, getDataList, selectedRowInfo, sortFieldInfo } =
        useAntdTable({
            api: async pageInfo => {
                const { current, pageSize, sortByAsc, sortedField } = unref(pageInfo);
                searchInfo.value.page = current || 1;
                searchInfo.value.pageSize = pageSize || 50;
                const res = await useQuery.execute({
                    ...unref(searchInfo)
                });
                return res.data.object;
            },
            rowKey: 'id',
            isConfig: true,
            isPageAble: true
        });

    const exportTable = async () => {
        filesystemApi.exportFileList(() =>
            warehouseApi.materialDetailDataExecute({
                ...unref(searchInfo),
                tableHeaderConfig: cacheSearchStore.getUploadLoadSortColumns(pageCode)
            })
        );
    };

    const beforeRender = (list: TpfColumnType[]) => {
        return unref(list).map(item => {
            if (item.dataIndex === 'arrival_no-submit_status') {
                item.customRender = ({ text }: { text: number }) => {
                    if (text === null) return text;
                    const showText = getLabel(text, submitStatus);
                    return <Badge color={getLabel(showText, statusNameColor)} text={showText} />;
                };
            }
            if (item.dataIndex === 'in_store_status') {
                item.customRender = ({ text }: { text: number }) => {
                    if (text === null) return text;
                    const showText = getLabel(+text, inStatus);
                    return <Badge color={getLabel(showText, statusNameColor)} text={showText} />;
                };
            }
            if (item.dataIndex === 'arrival_no-order_source') {
                item.customRender = ({ text }) => getLabel(text, materialOrderSource);
            }
            if (item.dataIndex === 'move_type_code-code-name') {
                item.customRender = ({ text }) => getLabel(text, customerSupplierType);
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
</script>
