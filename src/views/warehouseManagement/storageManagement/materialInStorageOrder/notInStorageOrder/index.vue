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
                        <a-button
                            :disabled="isEmpty(selectedRowInfo.selectedRows)"
                            type="primary"
                            class="tpf-button"
                            @click="onInStorage"
                        >
                            <SvgIcon type="icon-querenruku" /> 入库
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
    import { useStore, cacheKeyEnum } from '@/store';
    import { useRouter } from 'vue-router';
    import { useWarehouseApi, useFilesystemApi, useQueryAPi } from '@/api';
    import type { ReqGetTableList } from '@/api';
    import { PageCodeEnum, getTpfOptionEnum } from '@/config';
    import type { TpfColumnType } from '@/types';
    import { useRouteBase64, useAntdTable } from '@/hooks';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, unref, defineAsyncComponent } from 'vue';
    import { Badge, message } from 'ant-design-vue';
    import { isEmpty } from 'lodash-es';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { withTpfTableSortColumn } from '@/components/TpfTable/index';

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const pageCode = PageCodeEnum.wMMaterialNoInStoreDetail;

    const filesystemApi = useFilesystemApi();

    const {
        getLabel,
        inStatus,
        statusNameColor,
        checkResult,
        checkType,
        materialOrderSource,
        moveTypeList
    } = getTpfOptionEnum();

    const searchInfo = ref<ReqGetTableList>({} as ReqGetTableList);

    const warehouseApi = useWarehouseApi();
    const useQuery = useQueryAPi();
    const { encodeParams } = useRouteBase64();
    const { saveRowDataStore, cacheSearchStore } = useStore();
    const router = useRouter();
    const onInStorage = async () => {
        const list = unref(selectedRowInfo).selectedRows.map(
            item => item['supplier_code'] + item['move_type_code']
        );
        if ([...new Set(list)].length > 1) {
            message.warning('不同单位编号与移动类型不能合并入库!');
            return;
        }
        saveRowDataStore.setRowData(cacheKeyEnum.inStorageList, [
            ...unref(selectedRowInfo).selectedRows
        ]);
        router.push({
            path: '/warehouseManagement/storageManagement/materialInStorageOrder/materialInStorageOrderEdit'
        });
    };
    const addRequiredFieldsName = [
        'material_code-qn_warehouse_code-name',
        'material_code-qn_warehouse_code',
        'material_code-no_warehouse_code-name',
        'material_code-no_warehouse_code'
    ];
    const onSubmit = (val: any) => {
        val.mainEntityCode = 't_material_no_in_store_detail';
        if (!val.conditions.filter((v: any) => v.conditionFieldName === 'in_status').length) {
            val.conditions.push({
                conditionFieldName: 'in_status',
                value: '0'
            });
        }
        addRequiredFieldsName.forEach(item => {
            if (!val.requiredFields.includes(item)) val.requiredFields.push(item);
        });

        searchInfo.value = unref(val);
        unref(pagination).current = 1;
        getDataList();
    };
    const { tableInfo, pagination, getDataList, selectedRowInfo, sortFieldInfo } = useAntdTable({
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
            if (item.dataIndex === 'create_date_time') {
                item.sorter = {
                    compare: (a: any, b: any) => {
                        return withTpfTableSortColumn(a, b)('create_date_time');
                    }
                };
            }
            if (item.dataIndex === 'check_result') {
                item.customRender = ({ text }: { text: number }) => {
                    return getLabel(text, checkResult);
                };
            }
            if (item.dataIndex === 'check_type') {
                item.customRender = ({ text }: { text: number }) => {
                    return getLabel(text, checkType);
                };
            }
            if (item.dataIndex === 'arrival_no-order_source') {
                item.customRender = ({ text }: { text: number }) => {
                    return getLabel(text, materialOrderSource);
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
