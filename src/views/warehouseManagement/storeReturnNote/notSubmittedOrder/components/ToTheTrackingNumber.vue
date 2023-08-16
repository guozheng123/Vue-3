<template>
    <TpfModal
        class="TravelMerchantModal"
        v-model:visible="visible"
        title="选择到货单号"
        height="400px"
        width="880px"
    >
        <a-form
            :label-col="{ span: 10, offset: 2 }"
            layout="inline"
            :model="formState"
            @finish="handleFinish"
        >
            <a-row :gutter="24" class="clear-margin">
                <a-col :span="10">
                    <a-form-item label="到货单号">
                        <a-input allowClear v-model:value="formState.arrivalNo" />
                    </a-form-item>
                </a-col>
                <a-col :span="10">
                    <a-form-item label="供应商名称">
                        <a-input allowClear v-model:value="formState.customerSupplierName" />
                    </a-form-item>
                </a-col>
                <a-col :span="2">
                    <a-button type="primary" @click="onCheck">查询</a-button>
                </a-col>
            </a-row>
        </a-form>
        <TpfTable v-bind="{ ...tableInfo, pagination, columns, seq: true }" />
        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">取消</a-button>
            <a-button
                class="tpf-button"
                type="primary"
                @click="onSave"
                :disabled="isEmpty(selectRow)"
            >
                确认
            </a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="ts" name="travelMerchantModal">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { ref, unref, defineAsyncComponent } from 'vue';
    import type { TpfColumnType } from '@/types';
    import { useAntdTable, useRef } from '@/hooks';
    import { useCustomerSupplierAPi, useWarehouseApi } from '@/api';
    import { tableResizable, getTpfOptionEnum } from '@/config';
    import { isEmpty } from 'lodash-es';

    const customerSupplierAPi = useCustomerSupplierAPi();
    const warehouseApi = useWarehouseApi();
    const { deliveryType, customerSupplierType, getLabel } = getTpfOptionEnum();

    const [visible, setVisible] = useRef(false);
    const emit = defineEmits(['getArrive']);

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const formState = ref({
        arrivalNo: '',
        customerSupplierName: ''
    });
    const indexNum = ref();

    const open = () => {
        onReset();
        getDataList();
        setVisible(!visible.value);
    };
    const columns = ref<TpfColumnType[]>([
        { title: '到货单号', dataIndex: 'arrivalNo', ...tableResizable() },
        { title: '来源单号', dataIndex: 'sourceNo', ...tableResizable() },
        { title: '订单来源', dataIndex: 'orderSource', ...tableResizable() },
        { title: '供应商名称', dataIndex: 'customerSupplierCodeName', ...tableResizable() },
        { title: '创建人', dataIndex: 'createUser', ...tableResizable() },
        { title: '创建时间', dataIndex: 'createDateTime', ...tableResizable() }
    ]);

    const { tableInfo, pagination, getDataList, selectRow, selectedRowInfo } = useAntdTable({
        api: async pageInfo => {
            const { current: page, pageSize } = unref(pageInfo);
            const res = await warehouseApi.queryPopMaterialArrivalData({
                ...unref(formState),
                pageSize: pageSize,
                page
            });
            return res.data.object;
        },
        rowKey: 'arrivalNo',
        isPageAble: true,
        colorRow: true
    });
    // 查询
    const onCheck = () => {
        unref(pagination).current = 1;
        getDataList();
    };
    const onReset = () => {
        for (const key in unref(formState)) {
            formState.value[key] = '';
        }
    };
    const onSave = () => {
        console.log(selectRow);
        // if (unref(selectedRowInfo).selectedRows) {
        //     emit('getArrive', unref(selectedRowInfo).selectedRows);
        // }
        emit('getArrive', selectRow.value);
        setVisible(false);
    };
    const handleFinish = () => {
        unref(pagination).current = 1;
        getDataList();
    };

    defineExpose({ open });
</script>

<style lang="less">
    .clear-margin {
        margin: 0 !important;
    }
</style>
