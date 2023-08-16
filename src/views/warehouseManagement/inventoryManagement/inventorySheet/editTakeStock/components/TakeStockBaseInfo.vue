<template>
    <TpfCollapse title="基本信息">
        <TpfSubmitForm
            :formList="initFormList"
            ref="TpfFormRef"
            :labelCol="{ style: { width: '110px' } }"
        />
    </TpfCollapse>
</template>

<script setup lang="tsx">
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import { ref, computed, unref, watchEffect, watch } from 'vue';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { useTpfSubmitForm } from '@/components';
    const { TpfSubmitForm } = useTpfSubmitForm();

    type Props = {
        id?: number;
        info?: { [k: string]: any };
        fieldName?: string;
        storeCheckDto?: { [k: string]: any };
    };

    const props = defineProps<Props>();

    const TpfFormRef = ref<InstanceType<typeof TpfForm> | null>(null);

    const tpfFormRefData = computed(() => {
        return TpfFormRef.value;
    });
    const showOverProductionRatio = computed(
        () => unref(tpfFormRefData)?.newState.overProduction === '1'
    );
    watch(
        () => showOverProductionRatio.value,
        flag => {
            if (!flag) {
                unref(tpfFormRefData)?.clearValidate(['overProductionRatio']);
            }
        }
    );
    const initFormList = computed(() => {
        return [
            { type: 'Input', field: 'checkNo', label: '盘点单编号', disabled: true },
            { type: 'Input', field: 'checkStatus', label: '盘点单状态', disabled: true },
            { type: 'Input', field: 'orgName', label: '所属组织', disabled: true },
            { type: 'Textarea', field: 'remark', label: '备注', rows: 1, maxlength: 200 }
        ];
    });

    const submit = async () => {
        const res = (await TpfFormRef.value?.onSubmit()) as any;
        return { storeCheckDto: { id: props.id, remark: res.remark || '', checkNo: res.checkNo } };
    };
    watchEffect(() => {
        if (props.info) {
            unref(tpfFormRefData)?.setNewState({ ...props.info, version: props.info.versionName });
        }
    });

    defineExpose({ submit });
</script>

<style lang="less" scoped></style>
