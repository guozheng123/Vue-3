<template>
    <TpfForm
        v-noData="isEmpty(DIYFieldList)"
        :rules="rules"
        :formList="DIYFieldList"
        hiddenCollapse
        hiddenSubmit
        ref="TpfFormRef"
        noUseInit
        :labelCol="labelCol"
    />
</template>

<script setup lang="tsx" name="TpfDIYFieldForm">
    import TpfForm from '@/components/TpfForm/index.vue';
    import { ref, computed, unref, watchEffect, CSSProperties } from 'vue';
    import { getQueryPageFieldDiyListForInsertOrUpdate } from '@/api';
    import { PageCodeEnum } from '@/config';
    import { isEmpty } from 'lodash-es';

    type Props = {
        diyFieldData?: Record<string, any>;
        pageCode?: PageCodeEnum;
        submitName?: string;
        labelCol?: { style: CSSProperties };
    };

    const props = withDefaults(defineProps<Props>(), {
        submitName: 'diyFieldData',
        labelCol: () => ({ style: { width: '110px' } })
    });

    const TpfFormRef = ref<InstanceType<typeof TpfForm> | null>(null);

    const tpfFormRefData = computed(() => {
        return TpfFormRef.value;
    });

    watchEffect(() => {
        if (props.diyFieldData) {
            unref(tpfFormRefData)?.setNewState(props.diyFieldData);
        }
    });

    const submit = async () => {
        return {
            [props.submitName]: {
                ...(await TpfFormRef.value?.onSubmit())
            }
        };
    };
    const getDiyFieldValue = async () => {
        const res = (await submit()) || {};
        return { ...res[props.submitName] };
    };

    const { DIYFieldList, rules } = getQueryPageFieldDiyListForInsertOrUpdate(
        props.pageCode as string
    );

    defineExpose({ submit, getDiyFieldValue });
</script>
