<template>
    <TpfCollapse title="基本信息">
        <TpfSubmitForm
            v-if="!isEdit"
            :formList="formList"
            ref="TpfFormRef"
            :rules="rules"
            :labelCol="{ style: { width: '110px' } }"
        />
        <TpfDescriptions v-else :originalDate="originalDate" :renderList="formList" />
    </TpfCollapse>
</template>

<script setup lang="tsx" name="otherInStoreInfo">
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import { ref, computed, onUpdated, unref } from 'vue';
    import { useTpfSubmitForm } from '@/components';
    import { getTpfOptionEnum } from '@/config';
    import { checkRequired } from '@/formRuleConfig/Tpfrules';
    import { getDepartmentTreeList } from '@/api';
    import TpfDescriptions from '@/components/TpfDescriptions/index.vue';
    import { cloneDeep } from 'lodash-es';

    const { OtherInStoreInfoMoveTypeList, getLabel } = getTpfOptionEnum();
    const { TpfSubmitForm } = useTpfSubmitForm();
    type Props = {
        inStorageFromInfo?: { [k: string]: any };
        isEdit: boolean;
        originalInfo?: any;
    };

    const props = withDefaults(defineProps<Props>(), {
        isEdit: false
    });
    const TpfFormRef = ref<InstanceType<typeof TpfSubmitForm> | null>(null);
    const rules = { departmentCode: [checkRequired()], moveTypeCode: [checkRequired()] };
    const { treeData } = getDepartmentTreeList();
    const formList = computed(() => {
        return [
            {
                type: 'TreeSelect',
                field: props.isEdit ? 'departmentName' : 'departmentCode',
                label: '部门',
                placeholder: '',
                disabled: props.isEdit,
                allowClear: true,
                fieldNames: {
                    children: 'branchTree',
                    label: 'rootName',
                    value: 'rootCode'
                },
                treeData: treeData.value
            },
            {
                type: 'Input',
                field: 'sourceNo',
                label: '来源单号',
                disabled: props.isEdit,
                maxLength: 20
            },
            {
                type: 'Select',
                field: 'moveTypeCode',
                label: '移动类型',
                disabled: props.isEdit,
                options: OtherInStoreInfoMoveTypeList
            },
            {
                type: 'Input',
                field: 'remarks',
                label: '备注',
                disabled: props.isEdit,
                maxLength: 50
            }
        ];
    });
    const originalDate = computed(() => {
        const originalInfo = cloneDeep(props.originalInfo || {});
        const moveTypeCode = getLabel(originalInfo.moveTypeCode, OtherInStoreInfoMoveTypeList);

        return {
            ...originalInfo,
            moveTypeCode
        };
    });
    onUpdated(() => {
        TpfFormRef.value?.setNewState({
            ...unref(props.inStorageFromInfo)
        });
    });
    const submit = async () => {
        const res = (await TpfFormRef.value?.onSubmit()) as any;
        return { ...res };
    };
    defineExpose({ submit });
</script>
