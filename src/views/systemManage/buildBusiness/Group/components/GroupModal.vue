<template>
    <TpfModal
        class="GroupModal"
        v-model:visible="visible"
        width="600px"
        height="400px"
        :title="title"
    >
        <a-form
            ref="formRef"
            :model="formState"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 10 }"
            :rules="rules"
        >
            <a-form-item label="集团编号" name="groupCode">
                <a-input
                    allowClear
                    v-model:value.trim="formState.groupCode"
                    :disabled="title === '编辑集团'"
                />
            </a-form-item>
            <a-form-item label="集团名称" name="groupName">
                <a-input allowClear v-model:value.trim="formState.groupName" />
            </a-form-item>
            <a-form-item label="集团简称" name="groupAbbreviation">
                <a-input allowClear v-model:value.trim="formState.groupAbbreviation" />
            </a-form-item>
            <a-form-item label="英文名称" name="groupEnglishName">
                <a-input allowClear v-model:value="formState.groupEnglishName" />
            </a-form-item>
            <a-form-item label="启用" name="status">
                <a-switch v-model:checked="formState.status" />
            </a-form-item>
            <a-form-item label="备注" name="remarks">
                <a-textarea allowClear v-model:value="formState.remarks" />
            </a-form-item>
        </a-form>
        <template #footerRight>
            <a-button class="tpf-button" @click="setVisible(false)">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="onSave">保存</a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="ts" name="GroupModal">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useRef, useAntdForm } from '@/hooks';
    import { ref } from 'vue';
    import { useGroupAPi } from '@/api';

    import {
        checkRequired,
        checkMaxLength,
        checkSpecial,
        checkNumLetter
    } from '@/formRuleConfig/Tpfrules';
    import { Rule } from 'ant-design-vue/es/form';
    import type { TpfValidateRule } from '@/types';

    const [visible, setVisible] = useRef(false);
    const { formRef, submitForm } = useAntdForm();
    const groupApi = useGroupAPi();
    const title = ref<string>('');
    const groupId = ref<number>();
    const formState = ref();
    const initObj = () => {
        return {
            groupCode: '',
            groupName: '',
            groupAbbreviation: '',
            groupEnglishName: '',
            status: true,
            remarks: ''
        };
    };
    const emits = defineEmits(['submitAdd', 'submitUpdata']);
    const onSave = async () => {
        const res = await submitForm();
        if (res) {
            res.status = res.status ? 1 : 0;
            if (title.value === '新增集团') {
                emits('submitAdd', res);
            } else {
                res.groupId = groupId.value;
                emits('submitUpdata', res);
            }
        }
    };

    const open = (t: string, v: any) => {
        setVisible(!visible.value);
        if (t === 'edit') {
            title.value = '编辑集团';
            groupId.value = v.groupId;
            formState.value = { ...v };
            formState.value.status = v.status === 1 ? true : false;
        } else {
            title.value = '新增集团';
            formState.value = initObj();
        }
    };
    const rules = {
        groupCode: [
            checkMaxLength(12),
            checkNumLetter({ required: true }),
            {
                validator: async (_rule: Rule, value: string) => {
                    try {
                        if (!value) {
                            return Promise.resolve();
                        }
                        if (title.value === '编辑集团') {
                            return Promise.resolve();
                        }
                        const { groupCode } = formState.value;
                        const res = await groupApi.checkGroupCodeUnique({
                            groupCode,
                            operation: Number(title.value === '编辑集团') //1=编辑 0 =新增
                        });
                        if (!res.data.value) {
                            return Promise.reject(res.errorMessage || '集团编号重复');
                        }
                        return Promise.resolve();
                    } catch (error) {
                        console.log('error: ', error);
                    }
                },
                trigger: ['blur']
            }
        ],
        groupName: [
            checkRequired(),
            checkMaxLength(32),
            checkSpecial(),
            {
                validator: async (_rule: Rule, value: string) => {
                    try {
                        if (!value) {
                            return Promise.resolve();
                        }
                        const { groupCode, groupName } = formState.value;

                        const params = {
                            groupCode,
                            groupName,
                            operation: Number(title.value === '编辑集团') //1=编辑 0 =新增
                        };
                        const res = await groupApi.checkGroupNameUnique(params);
                        if (!res.data.value) {
                            return Promise.reject(res.errorMessage || '集团名称重复');
                        }
                        return Promise.resolve();
                    } catch (error) {
                        console.log('error: ', error);
                    }
                },
                trigger: ['blur']
            }
        ],
        groupAbbreviation: [checkSpecial(), checkMaxLength(32)],
        groupEnglishName: [checkSpecial(), checkMaxLength(200)],
        remarks: [checkMaxLength(200)]
    } as TpfValidateRule;
    defineExpose({ open });
</script>

<style lang="less" scoped>
    .GroupModal {
        .ant-modal-body {
            padding-top: 24px !important;
        }

        .isExist {
            position: absolute;
        }
    }
</style>
