<template>
    <TpfModal v-model:visible="visible" title="添加工序" height="300px" width="800px">
        <a-form
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 18 }"
            :model="formState"
            class="tpf-form"
            :rules="rules"
            ref="formRef"
        >
            <a-form-item label="检查事项" name="item">
                <a-input v-model:value="formState.item" show-count allow-clear :maxlength="50" />
            </a-form-item>
            <a-form-item label="检查内容" name="content">
                <a-textarea
                    v-model:value="formState.content"
                    allow-clear
                    show-count
                    :maxlength="150"
                />
            </a-form-item>
            <a-form-item label="注意事项" name="attention">
                <a-textarea
                    v-model:value="formState.attention"
                    allow-clear
                    show-count
                    :maxlength="150"
                />
            </a-form-item>
        </a-form>
        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="saveProjectCode"> 保存 </a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="tsx">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useAntdForm, useRef } from '@/hooks';
    import { ref } from 'vue';
    import { checkRequired } from '@/formRuleConfig/Tpfrules';
    import { TpfValidateRule } from '@/types';
    const { formRef, submitForm } = useAntdForm();

    const emit = defineEmits<{
        (e: 'getInspection', val: any): void;
    }>();

    const [visible, setVisible] = useRef(false);
    type FormState = {
        item?: string;
        content?: string;
        attention?: string;
    };

    const formState = ref<FormState>({});

    const rules = { item: [checkRequired()] } as TpfValidateRule;

    const saveProjectCode = async () => {
        emit('getInspection', await submitForm());
        setVisible(false);
    };

    const open = async () => {
        formState.value = {} as FormState;
        setVisible(true);
    };

    defineExpose({ open });
</script>
