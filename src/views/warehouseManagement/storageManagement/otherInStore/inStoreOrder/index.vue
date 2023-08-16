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
                        <a-button type="primary" class="tpf-button" @click="onAdd">
                            <SvgIcon type="icon-xinzeng" /> 新增
                        </a-button>
                        <TpfTableImportBtn
                            :uploadAction="uploadAction"
                            :multiple="false"
                            :customText="'导入上限为5000条'"
                            :showDuplication="false"
                            @upload-table="getDataList"
                            downLoadTemplate="other_in_store_template"
                        />
                        <a-button ghost type="primary" class="tpf-button" @click="exportTable">
                            <SvgIcon type="icon-daochu" /> 导出
                        </a-button>
                        <a-button ghost type="primary" disabled class="tpf-button">
                            <SvgIcon type="icon-daochu" /> 打印
                        </a-button>
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
    </TpfLayout>
</template>

<script setup lang="tsx" name="inStorageOrder">
    import { useStore } from '@/store';
    import { useRouter } from 'vue-router';
    import { useFilesystemApi, useQueryAPi, useOtherInStoreApi } from '@/api';
    import type { ReqGetTableList } from '@/api';
    import { PageCodeEnum, getTpfOptionEnum } from '@/config';
    import type { TpfColumnType, TpfUploadFile } from '@/types';
    import { useRouteBase64, useAntdTable } from '@/hooks';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, unref, defineAsyncComponent } from 'vue';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { withTpfTableSortColumn } from '@/components/TpfTable/index';

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTableImportBtn = defineAsyncComponent(
        () => import('@/components/TpfTable/TpfTableImportBtn.vue')
    );
    const pageCode = PageCodeEnum.otherInStore;

    const filesystemApi = useFilesystemApi();
    const useOtherInStore = useOtherInStoreApi();

    const { getLabel, OtherInStoreInfoMoveTypeList } = getTpfOptionEnum();

    const searchInfo = ref<ReqGetTableList>({} as ReqGetTableList);

    const useQuery = useQueryAPi();
    const { encodeParams } = useRouteBase64();
    const { cacheSearchStore } = useStore();
    const router = useRouter();

    const onAdd = () => {
        router.push({
            path: '/warehouseManagement/storageManagement/otherInStore/inStoreOrderOrderEditDetail'
        });
    };
    const uploadAction = async (fileInfo: { list: TpfUploadFile[]; overrideFlag: boolean }) => {
        const { list, overrideFlag } = unref(fileInfo);
        const [{ fileCode }] = list;
        return await useOtherInStore.queryInitializeImportExcel({
            overrideFlag,
            fileCode
        });
    };
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
                item.customRender = ({ text }) => getLabel(text, OtherInStoreInfoMoveTypeList);
            }
            if (item.dataIndex === 'create_date_time') {
                item.sorter = {
                    compare: (a: any, b: any) => {
                        return withTpfTableSortColumn(a, b)('create_date_time');
                    }
                };
            }
            if (item.dataIndex === 'in_no') {
                item.customRender = ({ text, record }) => (
                    <span
                        class="tpf-link"
                        onClick={() => {
                            router.push({
                                path: '/warehouseManagement/storageManagement/otherInStore/inStoreOrderOrderEditDetail',
                                query: encodeParams({ id: record.id })
                            });
                        }}
                    >
                        {text}
                    </span>
                );
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
            useOtherInStore.dataExport({
                ...unref(searchInfo),
                conditions: conditionsList,
                sortByAsc: false,
                sortedField: 'create_date_time',
                tableHeaderConfig: cacheSearchStore.getUploadLoadSortColumns(pageCode)
            })
        );
    };
</script>
