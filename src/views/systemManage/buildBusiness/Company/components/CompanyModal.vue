<template>
    <TpfModal
        class="FactoryModal"
        v-model:visible="visible"
        height="500px"
        width="600px"
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
                <a-input allowClear :disabled="true" v-model:value.trim="formState.groupCode" />
            </a-form-item>
            <a-form-item label="集团名称" name="groupName">
                <a-input allowClear :disabled="true" v-model:value.trim="formState.groupName" />
            </a-form-item>
            <a-form-item label="公司编号" name="companyCode">
                <a-input
                    allowClear
                    v-model:value.trim="formState.companyCode"
                    :disabled="title === '编辑公司'"
                />
            </a-form-item>
            <a-form-item label="公司名称" name="companyName">
                <a-input allowClear v-model:value.trim="formState.companyName" />
            </a-form-item>
            <a-form-item label="公司简称" name="companyAbbreviation">
                <a-input allowClear v-model:value.trim="formState.companyAbbreviation" />
            </a-form-item>
            <a-form-item label="英文名称" name="companyEnglishName">
                <a-input allowClear v-model:value="formState.companyEnglishName" />
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

<script setup lang="ts" name="FactoryModal">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useRef, useAntdForm } from '@/hooks';
    import { ref } from 'vue';
    import { useCompanyAPi } from '@/api';
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
    const formState = ref();
    const companyId = ref<number>();
    const groupId = ref<number | string>('');
    const initObj = () => {
        return {
            groupCode: '',
            groupName: '',
            companyCode: '',
            companyName: '',
            companyAbbreviation: '',
            companyEnglishName: '',
            status: true,
            remarks: ''
        };
    };
    const emits = defineEmits(['submitAdd', 'submitUpdata']);
    const companyAPi = useCompanyAPi();
    const title = ref<string>('');
    const onSave = async () => {
        const res = await submitForm();
        if (res) {
            res.status = res.status ? 1 : 0;
            res.groupId = groupId.value;
            if (title.value === '新增公司') {
                emits('submitAdd', res);
            } else {
                res.companyId = companyId.value;
                emits('submitUpdata', res);
            }
        }
    };
    const open = (t: string, v: any) => {
        setVisible(!visible.value);
        if (t === 'edit') {
            title.value = '编辑公司';
            groupId.value = v.groupId;
            companyId.value = v.companyId;
            formState.value = { ...v };
            formState.value.status = v.status === 1 ? true : false;
        } else if (t === 'add') {
            title.value = '新增公司';
            formState.value = initObj();
            groupId.value = v.rootId;
            formState.value.groupCode = v.rootCode;
            formState.value.groupName = v.rootName;
        }
    };
    const rules = {
        companyCode: [
            checkMaxLength(12),
            checkNumLetter({ required: true }),
            {
                validator: async (_rule: Rule, value: string) => {
                    try {
                        if (!value) {
                            return Promise.resolve();
                        }
                        if (title.value === '编辑公司') {
                            return Promise.resolve();
                        }
                        const { companyCode } = formState.value;
                        const res = await companyAPi.checkCompanyCodeUnique({
                            companyCode,
                            groupId: groupId.value,
                            operation: Number(title.value === '编辑公司') //1=编辑 0 =新增
                        });
                        if (!res.data.value) {
                            return Promise.reject(res.errorMessage || '公司编号重复');
                        }
                        return Promise.resolve();
                    } catch (error) {
                        console.log('error: ', error);
                    }
                },
                trigger: ['blur']
            }
        ],
        companyName: [
            checkRequired(),
            checkMaxLength(32),
            checkSpecial(),
            {
                validator: async (_rule: Rule, value: string) => {
                    try {
                        if (!value) {
                            return Promise.resolve();
                        }
                        const { companyCode, companyName } = formState.value;

                        const params = {
                            companyCode,
                            companyName,
                            groupId: groupId.value,
                            operation: Number(title.value === '编辑公司') //1=编辑 0 =新增
                        };
                        const res = await companyAPi.checkCompanyNameUnique(params);
                        if (!res.data.value) {
                            return Promise.reject(res.errorMessage || '公司名称重复');
                        }
                        return Promise.resolve();
                    } catch (error) {
                        console.log('error: ', error);
                    }
                },
                trigger: ['blur']
            }
        ],
        companyAbbreviation: [checkSpecial(), checkMaxLength(32)],
        companyEnglishName: [checkSpecial(), checkMaxLength(200)],
        remarks: [checkMaxLength(200)]
    } as TpfValidateRule;
    defineExpose({ open });
</script>

<style lang="less">
    .FactoryModal {
        .ant-modal-body {
            padding-top: 24px !important;
        }

        .isExist {
            position: absolute;
        }
    }
</style>
