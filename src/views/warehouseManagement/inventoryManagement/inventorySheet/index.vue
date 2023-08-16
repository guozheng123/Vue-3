<template>
    <TpfLayout>
        <template #header>
            <LoadingSkeleton>
                <TpfForm
                    @onSubmit="onSubmit"
                    :pageCode="pageCode"
                    :labelCol="{ style: { width: '126px' } }"
                    is-config
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
                                operateColumn,
                                beforeRender
                            }"
                        />
                    </template>
                    <template #operateLeft>
                        <OperateBtnAction
                            :selectedRowInfo="selectedRowInfo"
                            :getDataList="getDataList"
                            :getExportParams="getExportParams"
                        />
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
    </TpfLayout>
</template>

<script setup lang="tsx">
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, defineAsyncComponent, unref } from 'vue';
    import { useAntdTable, useRouteBase64 } from '@/hooks';
    import type { TpfColumnType, TpfOperateBtn } from '@/types';
    import { useQueryAPi, useWarehouseApi } from '@/api';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import { PageCodeEnum, getTpfOptionEnum } from '@/config';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { useRouter } from 'vue-router';
    import { Badge, message } from 'ant-design-vue';
    import OperateBtnAction from './OperateBtnAction.vue';
    import { useStore } from '@/store';
    const { cacheSearchStore } = useStore();

    const useQuery = useQueryAPi();
    const warehose = useWarehouseApi();

    const { statusNameColor, getLabel, InventoryStatus } = getTpfOptionEnum();

    const { encodeParams } = useRouteBase64();

    const pageCode = PageCodeEnum.storeCheck;

    const router = useRouter();

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const searchInfo = ref<any>({});

    const beforeRender = (list: TpfColumnType[]) => {
        const res = unref(list).map(item => {
            if (['create_date_time'].includes(item.dataIndex as string)) {
                item.sorter = true;
            }
            // 查看详情
            if (item.dataIndex === 'check_no') {
                item.sorter = true;
                item.customRender = ({ text, record }) => (
                    <span class="tpf-link" onClick={() => getMerchantManagementInfo(record)}>
                        {text}
                    </span>
                );
            }
            // 盘点状态
            if (item.dataIndex === 'check_status') {
                item.customRender = ({ text }: { text: string }) => {
                    const showName = getLabel(text, InventoryStatus);
                    return <Badge color={getLabel(showName, statusNameColor)} text={showName} />;
                };
            }

            return item;
        });
        return res;
    };

    const defaultBtn = [
        { title: '编辑', onClick: ({ record }) => onEdit(record) },
        { title: '执行', onClick: ({ record }) => releaseGuidebook(record) }
    ] as TpfOperateBtn[];

    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 150,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });

    const { tableInfo, pagination, getDataList, selectedRowInfo, sortFieldInfo } = useAntdTable({
        api: async pagination => {
            const { pageSize, current, sortByAsc, sortedField } = unref(pagination);
            const res = await useQuery.execute({
                ...unref(searchInfo),
                page: current,
                pageSize,
                sortByAsc,
                sortedField: sortedField || 'create_date_time'
            });
            return res.data.object;
        },

        rowKey: 'id',
        isPageAble: true,
        hasRowSelection: true,
        useSorter: true,
        isConfig: true
    });

    //查看详情
    const getMerchantManagementInfo = (row: any) => {
        router.push({
            path: '/warehouseManagement/inventoryManagement/inventorySheet/detailStock',
            query: encodeParams({ id: row.id })
        });
    };

    //编辑
    const onEdit = async (row: any) => {
        if (row.check_status === '1') {
            message.warning('该盘点单状态为盘点完成，不可编辑!');
            return;
        } else {
            router.push({
                path: '/warehouseManagement/inventoryManagement/inventorySheet/editTakeStock',
                query: encodeParams({ id: row.id })
            });
        }
    };

    // 执行盘点单
    const releaseGuidebook = async (record: any) => {
        if (record.check_status === '1') {
            message.warning('该盘点单状态为盘点完成，不可执行!');
            return;
        } else {
            const res = await warehose.executeStoreCheck({
                id: record.id
            });
            if (res.data.value) {
                getDataList();
                message.success('执行成功');
            }
        }
    };

    const onSubmit = (val: any) => {
        val.mainEntityCode = 't_store_check';
        unref(pagination).current = 1;
        searchInfo.value = unref(val);
        getDataList();
    };

    const getExportParams = () => {
        const { conditions } = searchInfo.value;
        return {
            ...searchInfo.value,
            conditions: [
                ...conditions,
                {
                    conditionFieldName: 'id',
                    values: unref(selectedRowInfo).selectedRowKeys.map(item => String(item)),
                    type: 'contain',
                    valueType: 'CHAR'
                }
            ],
            ...unref(sortFieldInfo),
            sortedField: unref(sortFieldInfo).sortedField || 'create_date_time',
            tableHeaderConfig: cacheSearchStore.getUploadLoadSortColumns(pageCode)
        };
    };
</script>
