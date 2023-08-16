<template>
    <TpfCollapse title="基本信息">
        <TpfDescriptions :renderList="formList" :originalDate="originalDate" />
    </TpfCollapse>
</template>

<script setup lang="tsx" name="MaterialsReturnedInfo">
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import { ref, computed, onUpdated, unref } from 'vue';
    import { getTpfOptionEnum } from '@/config';
    import TpfDescriptions from '@/components/TpfDescriptions/index.vue';
    import { cloneDeep } from 'lodash-es';

    const { otherOutMoveTypeList, getLabel } = getTpfOptionEnum();

    type Props = {
        originalInfo?: { [k: string]: any };
    };

    const props = withDefaults(defineProps<Props>(), {});

    const formList = computed(() => {
        return [
            {
                type: 'Input',
                field: 'outStorageOrderCode',
                label: '领料出库单'
            },
            {
                type: 'Input',
                field: 'projectName',
                label: '项目名称'
            },
            {
                type: 'Select',
                field: 'productionOrderCode',
                label: '生产订单编号'
            },
            {
                type: 'Input',
                field: 'businessCode',
                label: '领料申请单'
            }
        ];
    });

    const originalDate = computed(() => {
        const originalInfo = cloneDeep(props.originalInfo || {});
        return {
            ...originalInfo
        };
    });
</script>
