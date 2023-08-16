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
                            @click="onDeleteTitle"
                            :disabled="isEmpty(selectedRowInfo.selectedRows)"
                        >
                            <SvgIcon type="icon-shanchu" /> 删除
                        </a-button>
                        <a-button
                            type="primary"
                            class="tpf-button"
                            @click="onSubmitMore"
                            :disabled="isEmpty(selectedRowInfo.selectedRows)"
                        >
                            <SvgIcon type="icon-querenruku" /> 批量提交
                        </a-button>
                        <a-button
                            ghost
                            type="primary"
                            class="tpf-button"
                            :disabled="isEmpty(selectedRowInfo.selectedRows)"
                        >
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
        <MaterialArrivalOrderDetailModal
            v-if="materialArrivalOrderDetailModal"
            ref="materialArrivalOrderDetailRef"
            @onGetTableList="getDataList"
        />
    </TpfLayout>
</template>

<script setup lang="tsx" name="completedStorageTicket">
    import { useWarehouseApi, useQueryAPi } from '@/api';
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

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));
    const MaterialArrivalOrderModal = defineAsyncComponent(
        () => import('./components/MaterialArrivalOrderModal.vue')
    );
    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const MaterialArrivalOrderDetailModal = defineAsyncComponent(
        () => import('../components/MaterialArrivalOrderDetailModal.vue')
    );

    const warehouseApi = useWarehouseApi();
    const useQuery = useQueryAPi();
    const pageCode = PageCodeEnum.wMMaterialArrivalOrderNotSubmitted;
    const {
        moveTypeList,
        getLabel,
        statusNameColor,
        materialOrderSource,
        customerSupplierType,
        submitStatus
    } = getTpfOptionEnum();
    const searchInfo = ref<ReqGetTableList>({} as ReqGetTableList);
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

    const onSubmit = (val: any) => {
        val.mainEntityCode = 'material_arrival_note';
        if (
            !val.conditions.filter(
                (v: { conditionFieldName: string; value: string }) =>
                    v.conditionFieldName === 'submit_status'
            ).length
        ) {
            val.conditions.push({
                conditionFieldName: 'submit_status',
                value: '0'
            });
        }
        searchInfo.value = unref(val);
        unref(pagination).current = 1;
        getDataList();
    };

    const onDeleteTitle = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        const filterList = unref(selectedRowInfo).selectedRows.filter(item => {
            if (!(+item.order_source === 0 && +item.submit_status === 0)) return item;
        });
        if (filterList.length) {
            message.warning('非创建状态不可删除!');
            return;
        }
        await TpfDelConfirm({ content: '确定删除选中的物料到货单吗？' });
        onDelete();
    };

    const onDelete = async () => {
        try {
            loading.value = true;
            const res = await warehouseApi.deleteToBeSubmittedData({
                arrivalNos: selectedRowInfo.value.selectedRowKeys
            });
            message.success('删除成功!');
            loading.value = false;
            unref(pagination).current = 1;
            getDataList();
        } catch (error) {
            console.log(error);
        } finally {
            loading.value = false;
        }
    };

    const onSubmitMore = async () => {
        try {
            const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
            await TpfDelConfirm({ content: '请确认是否批量提交？' });
            loading.value = true;
            const res = await warehouseApi.batchSubmitData({
                arrivalNos: selectedRowInfo.value.selectedRowKeys
            });
            message.success('批量提交成功!');
            loading.value = false;
            unref(pagination).current = 1;
            getDataList();
        } catch (error) {
            console.log(error);
        } finally {
            loading.value = false;
        }
    };

    const defaultBtn = [
        {
            title: '编辑',
            onClick: row => {
                if (+row.record.order_source === 0) {
                    onOpenMaterialArrivalOrder(1, row.record);
                } else {
                    message.warning('其它来源数据不允许编辑！');
                }
            }
        },
        {
            title: '提交',
            onClick: row => {
                if (+row.record.submit_status === 1) {
                    message.warning('该状态为已提交状态不允许提交操作！');
                    return;
                }
                onOpenMaterialArrivalOrderDetail(1, row.record);
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

    const { tableInfo, pagination, getDataList, selectedRowInfo, loading } = useAntdTable({
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
        rowKey: 'arrival_no',
        isPageAble: true,
        isConfig: true,
        hasRowSelection: true
    });

    const beforeRender = (list: TpfColumnType[]) => {
        return unref(list).map(item => {
            if (item.dataIndex === 'submit_status') {
                item.customRender = ({ text }: { text: number }) => {
                    if (text === null) return text;
                    const showText = getLabel(text, submitStatus);
                    return <Badge color={getLabel(showText, statusNameColor)} text={showText} />;
                };
            }
            if (item.dataIndex === 'order_source') {
                item.customRender = ({ text }) => getLabel(text, materialOrderSource);
            }
            if (item.dataIndex === 'move_type_code-code-name') {
                item.customRender = ({ text }) => getLabel(text, customerSupplierType);
            }
            if (item.dataIndex === 'arrival_no') {
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
            if (item.dataIndex === 'move_type_code') {
                item.customRender = ({ text }: { text: number }) => {
                    return getLabel(text, moveTypeList);
                };
            }
            return item;
        });
    };
</script>
