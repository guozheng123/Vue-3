<template>
    <TpfCollapse title="基本信息">
        <TpfSubmitForm
            :formList="initFormList"
            ref="TpfFormRef"
            :rules="rules"
            :labelCol="{ style: { width: '110px' } }"
        />
        <TravelMerchantModal
            ref="travelMerchantModalDom"
            v-if="showTravelMerchantModal"
            @getData="getTravelMerchant"
        />
    </TpfCollapse>
</template>

<script setup lang="tsx" name="inStorageInfo">
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import { ref, computed } from 'vue';
    import { moveTypeList } from '@/config';
    import { checkRequired } from '@/formRuleConfig/Tpfrules';
    import { useTpfSubmitForm } from '@/components';
    import { useTravelMerchantModal } from '@/components';

    const { TpfSubmitForm } = useTpfSubmitForm();
    type Props = {
        productionOrderMaterial?: { [k: string]: any };
    };
    const {
        TravelMerchantModal,
        travelMerchantModalDom,
        openTravelMerchantModal,
        showTravelMerchantModal
    } = useTravelMerchantModal();
    const props = defineProps<Props>();
    const TpfFormRef = ref<InstanceType<typeof TpfSubmitForm> | null>(null);
    const getTravelMerchant = (data: any) => {
        const { customerSupplierCode = '', customerSupplierName = '' } = data;
        TpfFormRef?.value?.setNewState({
            supplierCode: customerSupplierCode,
            supplierName: customerSupplierName
        });
    };
    const rules = {
        supplierCode: [checkRequired()],
        moveTypeCode: [checkRequired()]
    };
    const initFormList = computed(() => {
        return [
            { type: 'Input', field: 'rkdh', label: '入库单号', disabled: true },
            {
                type: 'InputSearch',
                field: 'supplierCode',
                readonly: true,
                label: '单位编号',
                onSearch: () => openTravelMerchantModal()
            },
            {
                type: 'Input',
                field: 'supplierName',
                label: '单位名称',
                disabled: true
            },
            {
                type: 'Select',
                field: 'moveTypeCode',
                label: '移动类型',
                options: moveTypeList,
                showDefaultValue: 'R02'
            }
        ];
    });
    const submit = async () => {
        const res = (await TpfFormRef.value?.onSubmit()) as any;
        return { formData: { ...res } };
    };
    defineExpose({ submit });
</script>

<style lang="less" scoped>
    .form-box {
        padding: 15px 10px 0;
    }
</style>
