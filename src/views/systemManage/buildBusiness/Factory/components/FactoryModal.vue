<template>
    <TpfModal
        destroyOnClose
        class="FactoryModal"
        v-model:visible="visible"
        height="400px"
        :title="modalType === 'add' ? '新增工厂' : '编辑工厂'"
    >
        <a-form
            ref="formRef"
            :model="formState"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 10 }"
            :rules="rules"
        >
            <a-form-item label="公司编号" name="companyCode">
                <a-input allowClear v-model:value.trim="formState.companyCode" disabled />
            </a-form-item>
            <a-form-item label="公司名称" name="companyName">
                <a-input allowClear v-model:value.trim="formState.companyName" disabled />
            </a-form-item>
            <a-form-item label="工厂编号" name="factoryCode">
                <a-input
                    allowClear
                    v-model:value.trim="formState.factoryCode"
                    :disabled="modalType === 'edit'"
                />
            </a-form-item>
            <a-form-item label="工厂名称" name="factoryName">
                <a-input allowClear v-model:value.trim="formState.factoryName" />
            </a-form-item>
            <a-form-item label="工厂简称" name="factoryAbbreviation">
                <a-input allowClear v-model:value.trim="formState.factoryAbbreviation" />
            </a-form-item>
            <a-form-item label="英文名称" name="factoryEnglishName">
                <a-input allowClear v-model:value="formState.factoryEnglishName" />
            </a-form-item>
            <a-form-item label="启用" name="status">
                <a-switch
                    v-model:checked="formState.status"
                    :checked-value="1"
                    :un-checked-value="0"
                />
            </a-form-item>
            <a-form-item label="备注" name="remarks">
                <a-textarea allowClear v-model:value="formState.remarks" />
            </a-form-item>
        </a-form>

        <template #footerRight>
            <a-button class="tpf-button" @click="onCancel">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="onSave">保存</a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="ts" name="FactoryModal">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useRef, useAntdForm } from '@/hooks';
    import type { TpfValidateRule } from '@/types';

    import { ref, unref, computed } from 'vue';
    import {
        checkMaxLength,
        checkSpecial,
        checkRequired,
        checkNumLetter
    } from '@/formRuleConfig/Tpfrules';
    import { Rule } from 'ant-design-vue/es/form';

    import { useFactoryAPi } from '@/api';
    import { message } from 'ant-design-vue';
    const factoryAPi = useFactoryAPi();

    const emit = defineEmits<{
        (e: 'updateList'): void;
    }>();

    const [modalType, setModalType] = useRef<'add' | 'edit'>('add');

    const [visible, setVisible] = useRef(false);
    const { formRef, submitForm } = useAntdForm();

    const initFormState = () => ({
        companyCode: '', //公司编码
        companyName: '', //公司名称
        companyId: '', //公司id
        factoryId: '', //工厂id
        factoryCode: '', //工厂编码
        factoryName: '', //工厂名称
        factoryAbbreviation: '', //工厂简称
        factoryEnglishName: '', //英文名称
        status: 1, //状态
        remarks: '' //备注
    });

    const formState = ref<ReturnType<typeof initFormState>>(initFormState());

    const rules = computed(() => {
        return {
            factoryCode: [
                checkMaxLength(12),
                checkNumLetter({ required: unref(modalType) === 'add' }),
                {
                    validator: async (_rule: Rule, value: string) => {
                        try {
                            if (!value) {
                                return Promise.resolve();
                            }
                            if (unref(modalType) === 'edit') {
                                return Promise.resolve();
                            }
                            const { factoryCode, companyCode } = formState.value;
                            const res = await factoryAPi.checkFactoryCodeUnique({
                                factoryCode,
                                companyCode,
                                operation: Number(unref(modalType) === 'edit') //1=编辑 0 =新增
                            });
                            if (!res.data.value) {
                                return Promise.reject(res.errorMessage);
                            }
                            return Promise.resolve();
                        } catch (error) {
                            console.log('error: ', error);
                        }
                    },
                    trigger: ['blur']
                }
            ],
            factoryName: [
                checkRequired(),
                checkMaxLength(32),
                checkSpecial(),
                {
                    validator: async (_rule: Rule, value: string) => {
                        try {
                            if (!value) {
                                return Promise.resolve();
                            }
                            const { factoryCode, factoryName } = formState.value;

                            const params = {
                                factoryName,
                                operation: Number(unref(modalType) === 'edit') //1=编辑 0 =新增
                            } as any;
                            if (unref(modalType) === 'edit') {
                                params.factoryCode = factoryCode;
                            }
                            const res = await factoryAPi.checkFactoryNameUnique(params);
                            if (!res.data.value) {
                                return Promise.reject(res.errorMessage);
                            }
                            return Promise.resolve();
                        } catch (error) {
                            console.log('error: ', error);
                        }
                    },
                    trigger: ['blur']
                }
            ],
            factoryAbbreviation: [checkSpecial(), checkMaxLength(32)],
            factoryEnglishName: [checkSpecial(), checkMaxLength(200)],
            remarks: [checkMaxLength(200)]
        } as TpfValidateRule;
    });

    const onSave = async () => {
        await submitForm();

        if (unref(modalType) === 'add') {
            await factoryAPi.createFactory(unref(formState));
            message.success('新增成功');
        }
        if (unref(modalType) === 'edit') {
            const resp = await factoryAPi.updateFactory(unref(formState));
            if (!resp.data.value) {
                message.error(resp.errorMessage);
                return;
            }
            message.success('编辑成功');
        }
        emit('updateList');
        onCancel();
    };
    const onCancel = () => {
        setVisible(!visible.value);
    };

    const onOpenEdit = async (info: any) => {
        const { factoryId = '' } = unref(info);
        const res = await factoryAPi.getFactoryDetails({ factoryId });
        formState.value = res.data.object;
    };
    const open = async (
        type: 'add' | 'edit',
        info: ReturnType<typeof initFormState> & {
            rootName: string;
            rootCode: string;
            rootId: string;
        }
    ) => {
        formState.value = initFormState();
        setModalType(type);
        if (type === 'add') {
            const { rootName, rootCode, rootId } = unref(info);
            unref(formState).companyName = rootName;
            unref(formState).companyCode = rootCode;
            unref(formState).companyId = rootId;
        }
        if (type === 'edit') {
            await onOpenEdit(info);
        }

        setVisible(!visible.value);
    };

    defineExpose({ open });
</script>

<style lang="less">
    .FactoryModal {
        .ant-modal-body {
            padding-top: 24px !important;
        }
    }
</style>
