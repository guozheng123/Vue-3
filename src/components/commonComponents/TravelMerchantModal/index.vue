<template>
    <TpfModal
        class="TravelMerchantModal"
        v-model:visible="visible"
        title="选择客商"
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
                <a-col :span="7">
                    <a-form-item label="单位编号">
                        <a-input allowClear v-model:value="formState.customerSupplierCode" />
                    </a-form-item>
                </a-col>
                <a-col :span="7">
                    <a-form-item label="单位名称">
                        <a-input allowClear v-model:value="formState.customerSupplierName" />
                    </a-form-item>
                </a-col>

                <a-col :span="7">
                    <a-form-item label="类型">
                        <a-select v-model:value="formState.customerSupplierType">
                            <a-select-option
                                v-for="item in customerSupplierType"
                                :value="item.value"
                                :key="item.value"
                                >{{ item.label }}</a-select-option
                            >
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="3">
                    <a-form-item>
                        <a-button type="primary" html-type="submit">查询</a-button>
                    </a-form-item>
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
                保存
            </a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="ts" name="travelMerchantModal">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { ref, unref, defineAsyncComponent } from 'vue';
    import type { TpfColumnType } from '@/types';
    import { useAntdTable, useRef } from '@/hooks';
    import { useCustomerSupplierAPi } from '@/api';
    import { tableResizable, getTpfOptionEnum } from '@/config';
    import { isEmpty } from 'lodash-es';

    const customerSupplierAPi = useCustomerSupplierAPi();
    const { deliveryType, customerSupplierType, getLabel } = getTpfOptionEnum();

    const [visible, setVisible] = useRef(false);
    const emit = defineEmits(['getData']);

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const formState = ref({
        customerSupplierCode: '',
        customerSupplierName: '',
        customerSupplierType: ''
    });
    const indexNum = ref();

    const open = () => {
        onReset();
        getDataList();
        setVisible(!visible.value);
    };
    const columns = ref<TpfColumnType[]>([
        { title: '单位编号', dataIndex: 'customerSupplierCode', ...tableResizable() },
        { title: '单位名称', dataIndex: 'customerSupplierName', ...tableResizable() },
        { title: '单位简称', dataIndex: 'customerSupplierShortName', ...tableResizable() },
        {
            title: '类型',
            dataIndex: 'customerSupplierType',
            ...tableResizable(),
            customRender: ({ text }) => {
                return getLabel(text, customerSupplierType);
            }
        },
        {
            title: '发货模式',
            dataIndex: 'deliveryType',
            ...tableResizable(),
            customRender: ({ text }) => {
                return getLabel(text, deliveryType);
            }
        }
    ]);

    const { tableInfo, pagination, getDataList, selectRow } = useAntdTable({
        api: async pageInfo => {
            const { current = 1, pageSize } = unref(pageInfo);
            const res = await customerSupplierAPi.queryPopCustomerSupplierListByPage({
                ...unref(formState),
                pageSize,
                page: current,
                forbidden: '1'
            });
            return res.data.object;
        },
        rowKey: 'customerSupplierId',
        isPageAble: true,
        colorRow: true
    });
    const onReset = () => {
        for (const key in unref(formState)) {
            formState.value[key] = '';
        }
    };
    const onSave = () => {
        emit('getData', selectRow.value, unref(indexNum));
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
