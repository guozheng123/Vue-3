<template>
    <TpfCollapse title="基本信息">
        <TpfForm
            :formList="formList"
            hiddenCollapse
            hiddenSubmit
            noUseInit
            ref="TpfFormRef"
            :labelCol="{ style: { width: '110px' } }"
        />
    </TpfCollapse>
</template>

<script setup lang="tsx" name="inStorageInfo">
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { ref, computed, onMounted, unref } from 'vue';
    import { getTpfOptionEnum } from '@/config';

    type Props = {
        inStorageInfo?: { [k: string]: any };
    };
    const { moveTypeList } = getTpfOptionEnum();
    const props = defineProps<Props>();
    const searchInfo = ref<{ [key: string]: string }>();
    const TpfFormRef = ref<InstanceType<typeof TpfForm> | null>(null);
    const formList = computed(() => {
        return [
            {
                type: 'Input',
                field: 'materialCode',
                showDefaultValue: '',
                disabled: true,
                label: '入库单号'
            },
            {
                type: 'Input',
                field: 'supplier_code',
                showDefaultValue: '',
                label: '单位编号',
                disabled: true
            },
            {
                type: 'Input',
                field: 'supplier_code-customer_supplier_name',
                showDefaultValue: '',
                label: '单位名称',
                disabled: true
            },
            {
                type: 'Select',
                field: 'move_type_code',
                showDefaultValue: '',
                label: '移动类型',
                disabled: true,
                options: moveTypeList
            }
        ];
    });
    onMounted(() => {
        TpfFormRef.value?.setNewState({ ...props.inStorageInfo });
    });
</script>
