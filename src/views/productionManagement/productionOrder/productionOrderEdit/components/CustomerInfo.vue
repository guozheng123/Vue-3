<template>
    <TpfCollapse title="客户信息">
        <TpfForm
            :formList="formList"
            hiddenCollapse
            hiddenSubmit
            ref="TpfFormRef"
            noUseInit
            :labelCol="{ style: { width: '110px' } }"
        />
        <AddCustomerModal
            ref="addCustomerModalDom"
            v-if="showAddCustomerModalDom"
            @getCustomerInfo="getCustomerInfo"
        />
    </TpfCollapse>
</template>

<script setup lang="tsx" name="customerInfo">
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { ref, computed, unref, defineAsyncComponent, watchEffect, onMounted } from 'vue';
    import { useOpenAntdModal } from '@/hooks';
    import { useCustomerSupplierAPi } from '@/api';
    const customerSupplierAPi = useCustomerSupplierAPi();

    type Props = {
        productionOrderCustomer?: { [k: string]: any };
    };

    const props = defineProps<Props>();

    const [addCustomerModalDom, openAddCustomerModalDom, showAddCustomerModalDom] =
        useOpenAntdModal();

    const AddCustomerModal = defineAsyncComponent(() => import('./AddCustomerModal.vue'));

    const TpfFormRef = ref<InstanceType<typeof TpfForm> | null>(null);
    const customerInfo = ref<{ customerSupplierName: string; customerSupplierCode: string }>({
        customerSupplierName: '',
        customerSupplierCode: ''
    });

    const tpfFormRefData = computed(() => {
        return TpfFormRef.value;
    });

    watchEffect(() => {
        if (props.productionOrderCustomer) {
            unref(tpfFormRefData)?.setNewState(props.productionOrderCustomer);
            const { customerSupplierName, customerSupplierCode } = props.productionOrderCustomer;
            customerInfo.value = { customerSupplierName, customerSupplierCode };
        }
    });

    const customerSupplierNameList = ref<any[]>([]);

    const queryCustomerSupplierListByPage = async (customerSupplierName: any = '') => {
        const res = await customerSupplierAPi
            .queryCustomerSupplierListByPage({
                pageSize: 20,
                page: 1,
                forbidden: '1',
                customerSupplierName
            })
            .then(res => res.data.object.list || []);
        customerSupplierNameList.value = res.map(item => ({
            ...item,
            showCustomerSupplierCode: `${item.customerSupplierCode}-${item.customerSupplierName}`
        }));
    };

    const formList = computed(() => {
        return [
            {
                type: 'TpfAutoComplete',
                field: 'customerSupplierName',
                label: '客户',
                fieldNames: { label: 'showCustomerSupplierCode', value: 'customerSupplierName' },
                options: unref(customerSupplierNameList),
                onSearchInput: (val: any) => {
                    queryCustomerSupplierListByPage(val);
                },
                onSelectValue: (row: any) => {
                    getCustomerInfo(row);
                },
                onClickIcon: () => {
                    customerSupplierNameList.value = [];
                    openAddCustomerModalDom();
                }
            },
            {
                type: 'Input',
                field: 'customerOrder',
                showDefaultValue: '',
                label: '客户单号'
            },
            {
                type: 'Input',
                field: 'externalErpNum',
                showDefaultValue: '',
                label: '外部订单号'
            },
            {
                type: 'Input',
                field: 'externalErpRowNum',
                showDefaultValue: '',
                label: '外部订单行号'
            },
            {
                type: 'InputNumber',
                controls: false,
                field: 'price',
                showDefaultValue: '',
                label: '销售单价(元)'
            },
            {
                type: 'InputNumber',
                controls: false,
                field: 'customerQuotationPrice',
                showDefaultValue: '',
                label: '客户报价(元)'
            },
            {
                type: 'InputNumber',
                controls: false,
                field: 'priceExcludingTax',
                showDefaultValue: '',
                label: '未税报价(元)'
            },
            {
                type: 'InputNumber',
                controls: false,
                field: 'manufactureFee',
                showDefaultValue: '',
                label: '加工报价(元)'
            },
            {
                type: 'InputNumber',
                controls: false,
                field: 'manufactureAccountFee',
                showDefaultValue: '',
                label: '加工核价(元)'
            },
            {
                type: 'InputNumber',
                controls: false,
                field: 'taxRate',
                showDefaultValue: '',
                label: '税率(%)'
            }
        ];
    });

    const submit = async () => {
        return {
            productionOrderCustomer: {
                ...(await TpfFormRef.value?.onSubmit()),
                ...unref(customerInfo)
            }
        };
    };

    const getCustomerInfo = (val: any) => {
        if (TpfFormRef.value?.newState) {
            const { customerSupplierName = '', customerSupplierCode = '' } = val || {};
            customerInfo.value = { customerSupplierName, customerSupplierCode };
            TpfFormRef.value.setNewState({
                customerSupplierCode,
                customerSupplierName
            });
        }
    };
    onMounted(() => {
        queryCustomerSupplierListByPage();
    });

    defineExpose({ submit });
</script>

<style lang="less" scoped></style>
