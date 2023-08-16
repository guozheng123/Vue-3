<template>
    <TpfModal v-model:visible="visible" title="工艺" height="345px" width="800px">
        <TpfTableLayout>
            <TpfTable
                v-bind="{
                    ...tableInfo,
                    loading,
                    pagination,
                    columns,
                    operateColumn
                }"
            />
            <template #operateRight>
                <a-button class="tpf-button" ghost type="primary" @click="openAddProcess">
                    <SvgIcon type="icon-insert" style="margin-right: 5px" />
                    添加工艺
                </a-button>
                <a-button class="tpf-button" ghost type="primary" @click="openProcessContent">
                    <SvgIcon type="icon-gongxuneirongweihu" style="margin-right: 5px" />
                    工序内容维护
                </a-button>
            </template>
        </TpfTableLayout>
        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">取消</a-button>
            <a-button
                class="tpf-button"
                type="primary"
                @click="saveProcess"
                :disabled="tableInfo.dataSource?.length === 0"
            >
                保存
            </a-button>
        </template>
        <AddProcessModal
            v-if="showAddProcessModal"
            ref="addProcessModalDom"
            @getProcessInfo="getProcessInfo"
        />

        <ProcessContentModal
            ref="processContentModalDom"
            v-if="showProcessContentModal"
            :productionOrderId="productionOrderId"
        />
    </TpfModal>
</template>

<script setup lang="tsx" name="EditProcessModal">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useAntdTable, useOpenAntdModal, useRef } from '@/hooks';
    import TpfTable from '@/components/TpfTable/index.vue';
    import { ref, computed, defineAsyncComponent, unref } from 'vue';
    import { tableResizable } from '@/config';
    import SvgIcon from '@/components/SvgIcon/index.vue';

    import { TpfColumnType } from '@/types';
    import { withTpfTableOperateColumn } from '@/components/TpfTable';
    import { Checkbox, Select } from 'ant-design-vue';
    import { useProductionOrderApi } from '@/api';

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const AddProcessModal = defineAsyncComponent(() => import('./AddProcessModal.vue'));

    const ProcessContentModal = defineAsyncComponent(() => import('./ProcessContentModal.vue'));

    const productionOrderApi = useProductionOrderApi();

    const [addProcessModalDom, openAddProcessModalDom, showAddProcessModal] = useOpenAntdModal();

    const [processContentModalDom, openProcessContentModalDom, showProcessContentModal] =
        useOpenAntdModal();

    const productionOrderId = ref(0);

    const productionOrderCode = ref('');

    const defaultBtn = [
        {
            title: '删除',
            onClick: ({ index }: any) => {
                unref(tableInfo).dataSource?.splice(index, 1);
            }
        }
    ];

    const [visible, setVisible] = useRef(false);

    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 80,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });

    const columns = computed(() => {
        return [
            { title: '工艺编号', dataIndex: 'processCode', ...tableResizable() },
            { title: '工艺名称', dataIndex: 'processName', ...tableResizable() },
            {
                title: '工艺版本',
                dataIndex: 'processVersion',
                ...tableResizable(),
                customRender: ({ record, text }) => {
                    return (
                        <Select
                            value={Number(text)}
                            onChange={val => {
                                record.processVersion = val;
                            }}
                            size="middle"
                            style={{ width: '60%' }}
                            options={formatVersionOption(record.versions)}
                        />
                    );
                }
            },
            {
                title: '默认工艺',
                dataIndex: 'defaultFlag',
                ...tableResizable(),
                customRender: ({ record, text }) => (
                    <Checkbox
                        checked={Number(text) === 1}
                        class="radio-check"
                        onChange={val => {
                            unref(tableInfo).dataSource?.forEach(item => (item.defaultFlag = 0));
                            record.defaultFlag = Number(val.target.checked);
                        }}
                    />
                )
            }
        ] as TpfColumnType[];
    });

    const formatVersionOption = (list: any[]) =>
        list.map(item => ({ value: item, label: `v${item}` }));

    const { tableInfo, pagination, loading, getDataList } = useAntdTable({
        api: async () => {
            const res = await productionOrderApi.getProductionOrderById({
                productionOrderId: unref(productionOrderId)
            });
            return { list: res.data.object.productionOrderProcessVoList || [] };
        },
        rowKey: 'processCode',
        isPageAble: false
    });
    const getProcessInfo = (val: any) => {
        (unref(tableInfo).dataSource || []).push(val);
    };

    const openAddProcess = () => {
        openAddProcessModalDom(unref(tableInfo).dataSource);
    };

    const openProcessContent = () => {
        openProcessContentModalDom();
    };

    const saveProcess = async () => {
        const productionOrderProcessVoList = unref(tableInfo).dataSource?.map(item => ({
            processCode: item.processCode,
            processName: item.processName,
            processVersion: item.processVersion,
            defaultFlag: item.defaultFlag
        }));
        const params = {
            productionOrderId: unref(productionOrderId),
            productionOrderCode: unref(productionOrderCode),
            productionOrderProcessVoList
        };
        try {
            await productionOrderApi.editProductionOrderProcess(params);
            const { message } = await import('ant-design-vue');
            message.success('保存成功');
            setVisible(false);
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const open = (row: any = {}) => {
        productionOrderId.value = row.productionOrderId;
        productionOrderCode.value = row.productionOrderCode;
        getDataList();
        setVisible(true);
    };
    defineExpose({ open });
</script>
