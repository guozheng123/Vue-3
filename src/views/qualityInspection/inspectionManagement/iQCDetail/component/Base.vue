<template>
    <div>
        <TpfCollapse title="基本信息" id="productionOrder">
            <TpfDescriptions
                :originalDate="productionOrderInfo"
                :renderList="productionOrderList"
            />
        </TpfCollapse>
    </div>
</template>

<script setup lang="ts" name="Base">
    import { onMounted, ref, computed } from 'vue';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import TpfDescriptions from '@/components/TpfDescriptions/index.vue';
    import type { TpfDescColumnType } from '@/types';
    import { getTpfOptionEnum } from '@/config';
    import { cloneDeep } from 'lodash-es';

    type Props = {
        baseDataVal?: any;
    };
    const props = withDefaults(defineProps<Props>(), {
        baseDataVal: () => ({})
    });

    const { getLabel, materialCodeMaterialMold } = getTpfOptionEnum();

    const productionOrderList = computed(() => {
        return [
            { label: '到货单号', field: 'business_code' },
            {
                label: '单位名称',
                field: 'arrival_record_id-customer_supplier_code-customer_supplier_name'
            },
            { label: '来源单号', field: 'arrival_record_id-arrival_no-source_no' },
            { label: '项目编号', field: 'project_code' },
            { label: '订单号', field: 'arrival_record_id-purchase_order_no' },
            { label: '批次号', field: 'business_code-batch_no' },
            { label: '物料名称', field: 'material_code-material_name' },
            { label: '物料编号', field: 'material_code' },
            { label: '物料类型', field: 'material_code-material_mold' },
            { label: '检验类型', field: 'material_code-inspection_type_code-inspection_type_name' },
            {
                label: '质检方案',
                field: 'material_code-inspection_scheme_code-inspection_scheme_name'
            },
            { label: '到货数', field: 'production_quantity' }
        ] as TpfDescColumnType[];
    });

    const productionOrderInfo = computed(() => {
        const originalInfo = cloneDeep(props.baseDataVal || {});
        originalInfo['material_code-material_mold'] = getLabel(
            originalInfo['material_code-material_mold'],
            materialCodeMaterialMold
        );
        return {
            ...originalInfo
        };
    });
</script>

<style scoped lang="less">
    :deep(.ant-card) {
        .ant-card-body {
            padding: 8px 12px 8px 12px;

            .title_name {
                padding-left: 16px !important;
                color: #1d2129;
                font-size: 16px;
            }
        }
    }
</style>
