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
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
    </TpfLayout>
</template>

<script setup lang="tsx" name="materialsPreparationOrder">
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
    import { Badge, message } from 'ant-design-vue';
    import { isEmpty } from 'lodash-es';
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );

    const pageCode = PageCodeEnum.materialPreparation; // materialPreparation;
    const warehouseApi = useWarehouseApi();
    const useQuery = useQueryAPi();

    const {
        getLabel,
        statusNameColor,
        materialsPreparationOrderSource,
        materialsPreparationOrderStatus
    } = getTpfOptionEnum();

    const searchInfo = ref<ReqGetTableList>({} as ReqGetTableList);
    const { encodeParams } = useRouteBase64();
    const router = useRouter();

    const onSubmit = (res: any) => {
        searchInfo.value = unref(res) || {};
        unref(pagination).current = 1;
        getDataList();
    };
    const defaultBtn = [
        {
            title: '编辑',
            onClick: (row: any) => onEdit(row.record)
        },
        {
            title: '生成领料单',
            onClick: (row: any) => onAddMaterialOrder(row.record)
        }
    ] as TpfOperateBtn[];

    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 150,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });

    const { tableInfo, pagination, getDataList } = useAntdTable({
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
        rowKey: 'result_entity_id',
        isPageAble: true,
        useSorter: true,
        isConfig: true
    });

    const onEdit = (current: { [key: string]: any }) => {
        if (current.status_code === '1') {
            message.warning('当前备料清单状态为已生成不允许编辑！');
            return;
        }
        router.push({
            path: '/productionManagement/materialsPreparationOrder/materialsPreparationOrderEditDetails',
            query: encodeParams({
                isEdit: true,
                id: current.material_preparation_id
            })
        });
    };

    const onAddMaterialOrder = (current: { [key: string]: any }) => {
        if (current.status_code === '1') {
            message.warning('当前备料清单状态为已生成不允许生成领料申请单！');
            return;
        }
        router.push({
            path: '/productionManagement/materialsPreparationOrder/getMaterialsGenerate',
            query: encodeParams({ id: current.material_preparation_id })
        });
    };

    const beforeRender = (list: TpfColumnType[]) => {
        return unref(list).map(item => {
            if (item.dataIndex === 'material_preparation_code') {
                item.customRender = ({ text, record }) => (
                    <span
                        class="tpf-link"
                        onClick={() => {
                            router.push({
                                path: '/productionManagement/materialsPreparationOrder/materialsPreparationOrderEditDetails',
                                query: encodeParams({
                                    isEdit: false,
                                    id: record.material_preparation_id
                                })
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
            if (item.dataIndex === 'source') {
                item.customRender = ({ text }) => getLabel(text, materialsPreparationOrderSource);
            }
            if (item.dataIndex === 'status_code') {
                item.customRender = ({ text }) => {
                    const showText = getLabel(text, materialsPreparationOrderStatus);
                    return <Badge color={getLabel(showText, statusNameColor)} text={showText} />;
                };
            }
            return item;
        });
    };
</script>
