<template>
    <div>
        <TpfCollapse title="质检结果" id="productionOrder">
            <TpfDescriptions
                :originalDate="productionOrderInfo"
                :renderList="productionOrderList"
            />
        </TpfCollapse>
    </div>
</template>

<script setup lang="ts" name="Result">
    import { computed } from 'vue';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import TpfDescriptions from '@/components/TpfDescriptions/index.vue';
    import type { TpfDescColumnType } from '@/types';
    import { cloneDeep } from 'lodash-es';
    import { getTpfOptionEnum } from '@/config';

    type Props = {
        paramsData?: any;
    };
    const props = withDefaults(defineProps<Props>(), {
        paramsData: () => ({})
    });
    const { getLabel, statusAcceptanceOption } = getTpfOptionEnum();

    const productionOrderList = computed(() => {
        return [
            { label: '检验数', field: 'pendingInspectNum' },
            { label: '合格数', field: 'qualifiedQuantity' },
            { label: '不合格数', field: 'unqualifiedQuantity' },
            { label: '让步数', field: 'compromiseQuantity' },
            { label: '合格率', field: 'qualifiedRate' },
            { label: '检验结果', field: 'inspectResult' },
            { label: '处理意见', field: 'remark' }
        ] as TpfDescColumnType[];
    });

    const productionOrderInfo = computed(() => {
        const originalInfo = cloneDeep(props.paramsData || {});
        const inspectResult = getLabel(originalInfo.inspectResult, statusAcceptanceOption);
        return {
            ...originalInfo,
            inspectResult
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
