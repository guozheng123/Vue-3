<template>
    <TpfCollapse title="基本信息">
        <TpfSubmitForm
            v-if="!isAdd"
            :formList="formList"
            ref="TpfFormRef"
            :rules="rules"
            :labelCol="{ style: { width: '110px' } }"
        />
        <TpfDescriptions v-else :originalDate="originalDate" :renderList="formList" />
    </TpfCollapse>
</template>

<script setup lang="tsx" name="otherOutStoreInfo">
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import { ref, computed, onUpdated, unref } from 'vue';
    import { useTpfSubmitForm } from '@/components';
    import { getTpfOptionEnum } from '@/config';
    import { checkRequired } from '@/formRuleConfig/Tpfrules';
    import { getDepartmentTreeList } from '@/api';
    import TpfDescriptions from '@/components/TpfDescriptions/index.vue';
    import { cloneDeep } from 'lodash-es';

    const { otherOutMoveTypeList, getLabel } = getTpfOptionEnum();
    const { TpfSubmitForm } = useTpfSubmitForm();
    type Props = {
        isAdd: boolean;
        originalInfo?: { [k: string]: any };
    };

    const props = withDefaults(defineProps<Props>(), {
        isAdd: true
    });
    const TpfFormRef = ref<InstanceType<typeof TpfSubmitForm> | null>(null);
    const rules = { departmentCode: [checkRequired()], moveTypeCode: [checkRequired()] };

    const { treeData } = getDepartmentTreeList();
    const formList = computed(() => {
        console.log(props.isAdd, 99);
        return [
            {
                type: 'TreeSelect',
                field: props.isAdd ? 'departmentName' : 'departmentCode',
                label: '部门',
                placeholder: '',
                disabled: props.isAdd,
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
                disabled: props.isAdd,
                maxLength: 20
            },
            {
                type: 'Select',
                field: 'moveTypeCode',
                label: '移动类型',
                disabled: props.isAdd,
                options: otherOutMoveTypeList
            },
            {
                type: 'Input',
                field: 'remarks',
                label: '备注',
                disabled: props.isAdd,
                maxLength: 50
            }
        ];
    });
    onUpdated(() => {
        TpfFormRef.value?.setNewState({
            ...unref(props.originalInfo)
        });
    });
    const originalDate = computed(() => {
        const originalInfo = cloneDeep(props.originalInfo || {});
        const moveTypeCode = getLabel(originalInfo.moveTypeCode, otherOutMoveTypeList);

        return {
            ...originalInfo,
            moveTypeCode
        };
    });
    const submit = async () => {
        const res = (await TpfFormRef.value?.onSubmit()) as any;
        return { formData: { ...res } };
    };
    defineExpose({ submit });
</script>
