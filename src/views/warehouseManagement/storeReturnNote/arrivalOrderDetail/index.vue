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
    import { useFilesystemApi, useQueryAPi, useWarehouseApi } from '@/api';
    import type { ReqGetTableList } from '@/api';
    import { PageCodeEnum, getTpfOptionEnum } from '@/config';
    import type { TpfColumnType } from '@/types';
    import { useAntdTable } from '@/hooks';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, unref, defineAsyncComponent } from 'vue';
    import { Badge } from 'ant-design-vue';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { withTpfTableSortColumn } from '@/components/TpfTable/index';

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );

    const pageCode = PageCodeEnum.materialReturnOrderDetail;

    const warehouseApi = useWarehouseApi();

    const filesystemApi = useFilesystemApi();

    const { getLabel, statusNameColor, returnMethod, submitStatus, movementType } =
        getTpfOptionEnum();

    const searchInfo = ref<ReqGetTableList>({} as ReqGetTableList);
    const useQuery = useQueryAPi();
    const { cacheSearchStore } = useStore();

    const onSubmit = (val: any) => {
        val.mainEntityCode = 't_material_return_detial';
        console.log(searchInfo, 'exportTable44');
        searchInfo.value = unref(val);
        unref(pagination).current = 1;
        getDataList();
    };
    const { tableInfo, pagination, getDataList, selectedRowInfo, sortFieldInfo } = useAntdTable({
        api: async pageInfo => {
            const { current, pageSize } = unref(pageInfo);
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
        console.log(searchInfo, 'exportTable');
        filesystemApi.exportFileList(() =>
            warehouseApi.materialreturnexecute({
                ...unref(searchInfo),
                conditions: [{ conditionFieldName: 'submit_status', value: '' }],
                ...unref(sortFieldInfo),
                sortedField: unref(sortFieldInfo).sortedField || 'create_date_time',
                tableHeaderConfig: cacheSearchStore.getUploadLoadSortColumns(pageCode)
            })
        );
    };

    const beforeRender = (list: TpfColumnType[]) => {
        return unref(list).map(item => {
            if (item.dataIndex === 'create_date_time') {
                item.sorter = {
                    compare: (a: any, b: any) => {
                        return withTpfTableSortColumn(a, b)('create_date_time');
                    }
                };
            }
            if (item.dataIndex === 'return_no-submit_status') {
                item.customRender = ({ text }: { text: number }) => {
                    if (text === null) return text;
                    const showText = getLabel(text, submitStatus);
                    return <Badge color={getLabel(showText, statusNameColor)} text={showText} />;
                };
            }
            if (item.dataIndex === 'return_no-return_type_code') {
                item.customRender = ({ text }) => getLabel(text, returnMethod);
            }
            if (item.dataIndex === 'return_no-move_type_code') {
                item.customRender = ({ text }) => getLabel(text, movementType);
            }
            return item;
        });
    };
</script>
