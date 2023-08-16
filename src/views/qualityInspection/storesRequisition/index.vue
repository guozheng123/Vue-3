<template>
    <TpfTab
        :tabPaneList="requisitionOrderStatusList"
        @tabChange="tabChange"
        v-model:activeKey="activeKey"
        :fieldNames="{ key: 'value', tab: 'label' }"
    >
        <OutboundOrderModal
            ref="OutboundOrderModalDom"
            @updateTable="updateTable"
            v-if="showOutboundOrderModal"
        />
        <AddStoresRequisitionModal
            ref="AddStoresRequisitionModalDom"
            v-if="showAddStoresRequisitionModal"
            @updateTable="updateTable"
        />
        <TpfLayout>
            <template #header>
                <LoadingSkeleton>
                    <TpfForm
                        isConfig
                        :pageCode="pageCode"
                        @onSubmit="onSubmit"
                        :labelCol="{ style: { width: '110px' } }"
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
                        <template #operateLeft> <TpfButton :btnList="btnList" /> </template>
                    </TpfTableLayout>
                </LoadingSkeleton>
            </template>
        </TpfLayout>
    </TpfTab>
</template>

<script setup lang="tsx">
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, defineAsyncComponent, unref, computed } from 'vue';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import type { TpfColumnType, TpfOperateBtn } from '@/types';
    import { useQueryAPi, useMaterialRequisitionApi } from '@/api';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import TpfForm from '@/components/TpfForm/index.vue';
    import TpfTab from '@/components/TpfTab/index.vue';
    import { PageCodeEnum, getTpfOptionEnum } from '@/config';
    import AddStoresRequisitionModal from './components/AddStoresRequisitionModal.vue';
    import TpfButton from '@/components/TpfButton/index.vue';
    import { isEmpty } from 'lodash-es';
    import { message } from 'ant-design-vue';

    const OutboundOrderModal = defineAsyncComponent(
        () => import('./components/OutboundOrderModal.vue')
    );

    const { getLabel, requisitionOrderStatusList, orderSource } = getTpfOptionEnum();

    const pageCode = PageCodeEnum.materialRequisitionOrder;

    const materialRequisitionApi = useMaterialRequisitionApi();

    const useQuery = useQueryAPi();

    const activeKey = ref('1');

    const tabChange = (val: string) => {
        activeKey.value = val;
        updateTable();
    };

    const [
        AddStoresRequisitionModalDom,
        openAddStoresRequisitionModalDom,
        showAddStoresRequisitionModal
    ] = useOpenAntdModal();

    const [OutboundOrderModalDom, openOutboundOrderModal, showOutboundOrderModal] =
        useOpenAntdModal();

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const searchInfo = ref<any>({});

    const onDel = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定是否删除该数据?' });
        await materialRequisitionApi.delete(unref(selectedRowInfo).selectedRowKeys as string[]);
        const { message } = await import('ant-design-vue');
        message.success('删除成功');
        updateTable();
    };

    const btnList = computed(() => {
        const disabled = isEmpty(unref(selectedRowInfo).selectedRowKeys);
        return [
            {
                title: '新增',
                icon: { type: 'icon-insert' },
                props: { type: 'primary', onClick: () => onEdit() }
                // slots: {
                //     overlay: () => {
                //         return {
                //             onClick: (val: any) => {
                //                 console.log('val: ', val);
                //             },
                //             menu: [{ title: '124', key: 123 }]
                //         };
                //     }
                // }
            },
            {
                title: '删除',
                icon: { type: 'icon-shanchu' },
                props: { type: 'primary', onClick: () => onDel(), disabled }
            },
            {
                title: '打印',
                icon: { type: 'icon-dayin' },
                props: { type: 'primary', onClick: () => {}, disabled }
            }
        ];
    });
    const beforeRender = (list: TpfColumnType[]) => {
        return list.map(item => {
            if (item.dataIndex === 'material_requisition_order_code') {
                item.customRender = ({ text, record }) => (
                    <span class="tpf-link" onClick={() => onEdit(record, true)}>
                        {text}
                    </span>
                );
            }

            if (item.dataIndex === 'material_requisition_order_status') {
                item.customRender = ({ text }) => getLabel(text, requisitionOrderStatusList);
            }
            if (item.dataIndex === 'origin') {
                item.customRender = ({ text }) => getLabel(text, orderSource);
            }

            return item;
        });
    };

    const defaultBtn = [
        { title: '编辑', onClick: ({ record }) => onEdit(record) },
        { title: '生成出库单', onClick: ({ record }) => openOutboundOrderModal(record) }
    ] as TpfOperateBtn[];

    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 150,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });

    const { tableInfo, pagination, getDataList, selectedRowInfo } = useAntdTable({
        api: async pagination => {
            const { pageSize, current, sortByAsc, sortedField } = unref(pagination);
            const { conditions } = unref(searchInfo);
            const params = {
                ...unref(searchInfo),
                page: current,
                pageSize,
                sortByAsc,
                sortedField: sortedField || 'create_date',
                conditions: [
                    ...conditions,
                    {
                        conditionFieldName: 'material_requisition_order_status',
                        value: activeKey.value
                    }
                ]
            };
            return await useQuery.execute(params).then(res => res.data.object);
        },
        rowKey: 'material_requisition_order_code',
        isPageAble: true,
        hasRowSelection: true,
        isConfig: true
    });

    const updateTable = () => {
        unref(pagination).current = 1;
        getDataList();
    };

    //编辑-新增
    const onEdit = (row = {} as any, readOnly = false) => {
        if (!isEmpty(row)) {
            // 编辑
            if (row.material_requisition_order_status !== '1') {
                message.error('领料申请单不是待领料状态不能编辑！');
                return;
            }
        }
        openAddStoresRequisitionModalDom(row, readOnly);
    };

    const onSubmit = (val: Record<string, any>) => {
        searchInfo.value = unref(val);
        unref(pagination).current = 1;
        getDataList();
    };
</script>
