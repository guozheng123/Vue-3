<template>
    <TpfLayout>
        <template #header>
            <LoadingSkeleton>
                <TpfForm
                    @onSubmit="onSubmit"
                    :pageCode="pageCode"
                    :labelCol="{ style: { width: '100px' } }"
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
                                loading,
                                pagination,
                                operateColumn,
                                beforeRender,
                                seq: true
                            }"
                        />
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
        <ReworkModal
            @reload-tble-list="getDataList"
            ref="reworkModalRef"
            v-if="onloadReworkModal"
            :onGetTableList="getDataList"
        />
    </TpfLayout>
</template>

<script setup lang="tsx" name="reworkOrder">
    import { useOpenAntdModal } from '@/hooks';
    import { useRepairOrderDetailApi } from '@/api';
    import type { repairOrderListByPageRes } from '@/api';
    import { PageCodeEnum, getTpfOptionEnum } from '@/config';
    import { useAntdTable } from '@/hooks';
    import type { TpfColumnType } from '@/types';
    import TpfForm from '@/components/TpfForm/index.vue';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, unref, defineAsyncComponent } from 'vue';
    import ReworkModal from './components/ReworkModal.vue';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import { message } from 'ant-design-vue';

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));
    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );

    const pageCode = PageCodeEnum.repairOrderFront;

    const [reworkModalRef, onOpenReworkModal, onloadReworkModal] = useOpenAntdModal();

    const { getLabel, repairOrderStatus } = getTpfOptionEnum();

    const searchInfo = ref<{ [k: string]: any }>({});

    const useApi = useRepairOrderDetailApi();

    const onSubmit = (res: any) => {
        searchInfo.value = unref(res) || {};
        getDataList();
    };
    const defaultBtn = [
        {
            title: '返修',
            onClick: (row: { value: repairOrderListByPageRes }) => {
                if (row.value.repairStatus === 'BEREPAUR') {
                    return message.warning('当前明细已返修完成,不允许操作!');
                }
                const res = row.value.repairQuantity - row.value.operationRepairPlanQuantity;
                onOpenReworkModal({
                    operationRepairQuantity: res,
                    repairOrderId: row.value.repairOrderId
                });
            }
        },
        {
            title: '生成返修单',
            onClick: async (row: { value: repairOrderListByPageRes }) => {
                if (row.value.repairStatus === 'BEREPAUR') {
                    return message.warning('当前明细已返修完成,不允许操作!');
                }
                const res = await useApi.generateRepairTypeProductionOrder({
                    repairOrderId: row.value.repairOrderId
                });
                if (res.success) {
                    message.success('生成返修单成功');
                }
                getDataList();
            }
        }
    ];

    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 180,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });
    const beforeRender = (list: TpfColumnType[]) => {
        return unref(list).map(item => {
            if (item.dataIndex === 'repairStatus') {
                item.customRender = ({ text }) => {
                    return getLabel(text, repairOrderStatus);
                };
            }
            return item;
        });
    };
    const { tableInfo, pagination, loading, getDataList } = useAntdTable({
        api: async pageInfo => {
            const { current, pageSize } = unref(pageInfo);
            const res = await useApi.queryRepairOrderListByPage({
                page: current,
                pageSize,
                ...unref(searchInfo)
            });

            return res.data.object;
        },
        rowKey: 'repairOrderId',
        isPageAble: true
    });
</script>
