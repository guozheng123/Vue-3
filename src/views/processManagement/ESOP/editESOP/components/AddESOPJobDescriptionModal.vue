<template>
    <TpfModal v-model:visible="visible" title="新增作业说明" height="300px" width="800px">
        <a-form
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 18 }"
            :model="formState"
            class="tpf-form"
            :rules="rules"
            ref="formRef"
        >
            <a-form-item label="作业内容" name="content">
                <a-input v-model:value="formState.content" show-count allow-clear :maxlength="50" />
            </a-form-item>
            <a-form-item label="作业要求" name="requirement">
                <a-textarea
                    v-model:value="formState.requirement"
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
        (e: 'getDesc', val: any): void;
    }>();

    const [visible, setVisible] = useRef(false);
    type FormState = {
        content?: string;
        requirement?: string;
        attention?: string;
    };

    const formState = ref<FormState>({});

    const rules = { content: [checkRequired()] } as TpfValidateRule;

    const saveProjectCode = async () => {
        emit('getDesc', await submitForm());
        setVisible(false);
    };

    const open = async () => {
        formState.value = {} as FormState;
        setVisible(true);
    };

    defineExpose({ open });
</script>
