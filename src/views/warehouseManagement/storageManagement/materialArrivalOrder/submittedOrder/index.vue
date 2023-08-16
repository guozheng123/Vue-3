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
                        <a-button @click="() => {}" class="tpf-button" type="primary" ghost>
                            <SvgIcon type="icon-dayin" /> 打印
                        </a-button>
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
        <MaterialArrivalOrderDetailModal
            v-if="materialArrivalOrderDetailModal"
            ref="materialArrivalOrderDetailRef"
            @onGetTableList="getDataList"
        />
    </TpfLayout>
</template>

<script setup lang="tsx" name="completedStorageTicket">
    import { useQueryAPi } from '@/api';
    import type { ReqGetTableList } from '@/api';
    import { PageCodeEnum, getTpfOptionEnum } from '@/config';
    import type { TpfColumnType } from '@/types';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, unref, defineAsyncComponent } from 'vue';
    import { Badge } from 'ant-design-vue';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { withTpfTableSortColumn } from '@/components/TpfTable/index';

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const MaterialArrivalOrderDetailModal = defineAsyncComponent(
        () => import('../components/MaterialArrivalOrderDetailModal.vue')
    );

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );

    const pageCode = PageCodeEnum.wMMaterialArrivalOrderSubmitted;
    const [
        materialArrivalOrderDetailRef,
        onOpenMaterialArrivalOrderDetail,
        materialArrivalOrderDetailModal
    ] = useOpenAntdModal();
    const useQuery = useQueryAPi();
    const {
        moveTypeList,
        getLabel,
        statusNameColor,
        materialOrderSource,
        customerSupplierType,
        submitStatus
    } = getTpfOptionEnum();

    const searchInfo = ref<ReqGetTableList>({} as ReqGetTableList);

    const onSubmit = (val: any) => {
        val.mainEntityCode = 'material_arrival_note';
        if (!val.conditions.filter((v: any) => v.conditionFieldName === 'submit_status').length) {
            val.conditions.push({
                conditionFieldName: 'submit_status',
                value: '1'
            });
        }
        searchInfo.value = unref(val);
        unref(pagination).current = 1;
        getDataList();
    };
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
        rowKey: 'id',
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
