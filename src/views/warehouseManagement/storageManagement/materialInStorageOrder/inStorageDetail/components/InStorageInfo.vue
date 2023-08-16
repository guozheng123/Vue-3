<template>
    <TpfCollapse title="基本信息">
        <TpfSubmitForm
            :formList="formList"
            ref="TpfFormRef"
            :labelCol="{ style: { width: '110px' } }"
        />
    </TpfCollapse>
</template>

<script setup lang="tsx" name="inStorageInfo">
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import { ref, computed, onUpdated, unref } from 'vue';
    import { useTpfSubmitForm } from '@/components';
    import { getTpfOptionEnum } from '@/config';

    const { moveTypeList } = getTpfOptionEnum();
    const { TpfSubmitForm } = useTpfSubmitForm();
    type Props = {
        inStorageFromInfo?: { [k: string]: any };
    };

    const props = defineProps<Props>();

    const TpfFormRef = ref<InstanceType<typeof TpfSubmitForm> | null>(null);

    const formList = computed(() => {
        return [
            {
                type: 'Input',
                field: 'inNo',
                disabled: true,
                label: '入库单号'
            },
            {
                type: 'Input',
                field: 'supplierCode',
                label: '单位编号',
                disabled: true
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
                disabled: true,
                options: moveTypeList
            },
            {
                type: 'Input',
                field: 'createUserName',
                label: '创建人',
                disabled: true
            },
            {
                type: 'Input',
                field: 'createDateTime',
                label: '创建时间',
                disabled: true
            }
        ];
    });
    onUpdated(() => {
        TpfFormRef.value?.setNewState({
            ...unref(props.inStorageFromInfo)
        });
    });
</script>
