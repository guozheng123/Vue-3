<template>
    <TpfCollapse title="查询信息">
        <TpfForm
            @onSubmit="onSubmit"
            :formList="formList"
            ref="TpfFormRef"
            :labelCol="{ style: { width: '110px' } }"
        />
    </TpfCollapse>
</template>

<script setup lang="tsx" name="MaterialsSearchInfo">
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import { ref, computed, onUpdated, unref } from 'vue';
    import { useTpfSubmitForm } from '@/components';
    import { getTpfOptionEnum } from '@/config';
    import { checkRequired } from '@/formRuleConfig/Tpfrules';
    import { getDepartmentTreeList } from '@/api';
    import TpfDescriptions from '@/components/TpfDescriptions/index.vue';
    import { cloneDeep } from 'lodash-es';
    import TpfForm from '@/components/TpfForm/index.vue';

    const emit = defineEmits<{
        (e: 'onSearch', val: any): void;
    }>();
    const { otherOutMoveTypeList, getLabel } = getTpfOptionEnum();
    const { TpfSubmitForm } = useTpfSubmitForm();
    const TpfFormRef = ref<InstanceType<typeof TpfSubmitForm> | null>(null);

    const formList = computed(() => {
        return [
            {
                type: 'Input',
                field: 'materialCode',
                label: '物料编号',
                maxLength: 100
            },
            {
                type: 'Input',
                field: 'materialName',
                label: '物料名称',
                maxLength: 100
            }
        ];
    });
    const onSubmit = (val: Record<string, any>) => emit('onSearch', val);
    const submit = async () => {
        const res = (await TpfFormRef.value?.onSubmit()) as any;
        return { formData: { ...res } };
    };
    defineExpose({ submit });
</script>
