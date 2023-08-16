<template>
    <TpfLayout>
        <template #header>
            <LoadingSkeleton>
                <TpfForm
                    @onSubmit="onSubmit"
                    :pageCode="pageCode"
                    ref="TpfFormRef"
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

<script setup lang="tsx" name="inStorageOrder">
    import { useStore } from '@/store';
    import { useFilesystemApi, useQueryAPi, useOtherInStoreApi } from '@/api';
    import type { ReqGetTableList } from '@/api';
    import { PageCodeEnum, getTpfOptionEnum } from '@/config';
    import type { TpfColumnType } from '@/types';
    import { useAntdTable } from '@/hooks';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, unref, defineAsyncComponent } from 'vue';
    import TpfForm from '@/components/TpfForm/index.vue';

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const pageCode = PageCodeEnum.otherInStoreDetail;

    const filesystemApi = useFilesystemApi();

    const { getLabel, OtherInStoreInfoMoveTypeList } = getTpfOptionEnum();

    const searchInfo = ref<ReqGetTableList>({} as ReqGetTableList);

    const useQuery = useQueryAPi();
    const useOtherInStore = useOtherInStoreApi();

    const { cacheSearchStore } = useStore();

    const onSubmit = (val: any) => {
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
        isConfig: true,
        isPageAble: true,
        hasRowSelection: true
    });

    const beforeRender = (list: TpfColumnType[]) => {
        return unref(list).map(item => {
            if (item.dataIndex === 'move_type_code') {
                item.customRender = ({ text }: { text: number }) => {
                    return getLabel(text, OtherInStoreInfoMoveTypeList);
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
            useOtherInStore.getOtherDetailDataExcel({
                ...unref(searchInfo),
                conditions: conditionsList,
                sortByAsc: false,
                sortedField: 'create_date_time',
                tableHeaderConfig: cacheSearchStore.getUploadLoadSortColumns(pageCode)
            })
        );
    };
</script>
