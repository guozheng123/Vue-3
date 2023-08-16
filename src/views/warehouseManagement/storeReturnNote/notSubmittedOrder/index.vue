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
                                operateColumn,
                                pagination,
                                seq: true,
                                beforeRender
                            }"
                        />
                    </template>
                    <template #operateLeft>
                        <a-button type="primary" class="tpf-button" @click="onStorage">
                            <SvgIcon type="icon-xinzeng" /> 新增
                        </a-button>
                        <a-button
                            type="primary"
                            class="tpf-button"
                            @click="onSubmitMore"
                            :disabled="isEmpty(selectedRowInfo.selectedRows)"
                        >
                            <SvgIcon type="icon-fabu" /> 提交
                        </a-button>
                        <a-button type="primary" class="tpf-button" @click="exportTable">
                            <SvgIcon type="icon-querenruku" /> 导出
                        </a-button>
                        <a-button ghost type="primary" class="tpf-button" disabled>
                            <SvgIcon type="icon-dayin" /> 打印
                        </a-button>
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
        <MaterialArrivalOrderModal
            v-if="materialArrivalOrderModal"
            ref="materialArrivalOrderRef"
            @onGetTableList="getDataList"
        />
        <TravelMerchantModal
            ref="travelMerchantModalDom"
            v-if="showTravelMerchantModal"
            @getData="getDataList"
        />
        <StoreReturnDetails
            v-if="materialArrivalOrderDetailModal"
            ref="materialArrivalOrderDetailRef"
            @onGetTableList="getDataList"
        />
    </TpfLayout>
</template>

<script setup lang="tsx" name="completedStorageTicket">
    import { useWarehouseApi, useQueryAPi, useFilesystemApi } from '@/api';
    import type { ReqGetTableList } from '@/api';
    import { PageCodeEnum, getTpfOptionEnum } from '@/config';
    import type { TpfColumnType } from '@/types';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, unref, defineAsyncComponent } from 'vue';
    import { Badge, message } from 'ant-design-vue';
    import { isEmpty } from 'lodash-es';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import { withTpfTableSortColumn } from '@/components/TpfTable/index';
    import type { TpfOperateBtn } from '@/types';
    import { useTravelMerchantModal } from '@/components';
    import { useStore } from '@/store';

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));
    const MaterialArrivalOrderModal = defineAsyncComponent(
        () => import('./components/MaterialArrivalOrderModal.vue')
    );
    const StoreReturnDetails = defineAsyncComponent(
        () => import('../components/StoreReturnDetails.vue')
    );
    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const warehouseApi = useWarehouseApi();
    const useQuery = useQueryAPi();
    const pageCode = PageCodeEnum.materialReturnOrderNotSubmitted;
    const { getLabel, statusNameColor, returnMethod, submitStatus, movementType } =
        getTpfOptionEnum();
    const searchInfo = ref<any>({});
    const [materialArrivalOrderRef, onOpenMaterialArrivalOrder, materialArrivalOrderModal] =
        useOpenAntdModal();
    const {
        TravelMerchantModal,
        travelMerchantModalDom,
        openTravelMerchantModal,
        showTravelMerchantModal
    } = useTravelMerchantModal();

    const [
        materialArrivalOrderDetailRef,
        onOpenMaterialArrivalOrderDetail,
        materialArrivalOrderDetailModal
    ] = useOpenAntdModal();
    const onStorage = async () => {
        onOpenMaterialArrivalOrder(0);
    };

    const filesystemApi = useFilesystemApi();
    const { saveRowDataStore, cacheSearchStore } = useStore();

    const onSubmit = (val: any) => {
        val.mainEntityCode = 't_material_return';
        if (!val.conditions.filter((v: any) => v.conditionFieldName === 'submit_status').length) {
            val.conditions.push({
                conditionFieldName: 'submit_status',
                value: '0'
            });
        }
        searchInfo.value = unref(val);
        unref(pagination).current = 1;
        getDataList();
    };

    const onDeleteTitle = async (data: any) => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定删除选中的物料退货单吗？' });
        const res = await warehouseApi.batchdeleted({
            returnNos: [data.return_no]
        });
        if (res.data.value) {
            message.success('物料退货单删除成功！');
            getDataList();
        }
    };

    // 提交
    const onSubmitMore = async () => {
        try {
            const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
            await TpfDelConfirm({ title: '确认批量提交', content: '请确认是否批量提交？' });
            const res = await warehouseApi.batchsubmit(selectedRowInfo.value.selectedRowKeys);
            console.log(res, 'datadata');
            if (res.data.value) {
                getDataList();
                message.success('批量提交成功!');
            } else {
                message.error(res.errorMessage);
            }
        } catch (error) {
            console.log(error);
        } finally {
            // loading.value = false;
        }
    };

    const defaultBtn = [
        {
            title: '编辑',
            onClick: (row: any) => {
                onOpenMaterialArrivalOrder(1, row.record);
            }
        },
        {
            title: '删除',
            onClick: (row: any) => {
                onDeleteTitle(row.record);
            }
        }
    ] as TpfOperateBtn[];

    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 150,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });

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
        rowKey: 'return_no',
        isPageAble: true,
        isConfig: true,
        hasRowSelection: true
    });

    // 导出
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
            warehouseApi.materialreturnexecute({
                ...searchInfo.value,
                conditions: conditionsList,
                ...unref(sortFieldInfo),
                sortedField: unref(sortFieldInfo).sortedField || 'create_date_time',
                tableHeaderConfig: cacheSearchStore.getUploadLoadSortColumns(pageCode)
            })
        );
    };

    const beforeRender = (list: TpfColumnType[]) => {
        return unref(list).map(item => {
            if (item.dataIndex === 'submit_status') {
                item.customRender = ({ text }: { text: number }) => {
                    if (text === null) return text;
                    const showText = getLabel(text, submitStatus);
                    return <Badge color={getLabel(showText, statusNameColor)} text={showText} />;
                };
            }
            if (item.dataIndex === 'return_type_code') {
                item.customRender = ({ text }) => getLabel(text, returnMethod);
            }
            if (item.dataIndex === 'move_type_code') {
                item.customRender = ({ text }) => getLabel(text, movementType);
            }
            if (item.dataIndex === 'return_no') {
                item.customRender = ({ text, record }) => (
                    <span
                        class="tpf-link"
                        onClick={() => onOpenMaterialArrivalOrderDetail(0, record)}
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
            return item;
        });
    };
</script>
