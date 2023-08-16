<template>
    <TpfModal
        destroyOnClose
        class="FactoryModal"
        v-model:visible="visible"
        height="400px"
        :title="modalType === 'add' ? '新增车间' : '编辑车间'"
    >
        <a-form
            ref="formRef"
            :model="formState"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 10 }"
            :rules="rules"
        >
            <a-form-item label="工厂编号" name="factoryCode">
                <a-input allowClear v-model:value.trim="formState.factoryCode" disabled />
            </a-form-item>
            <a-form-item label="工厂名称" name="factoryName">
                <a-input allowClear v-model:value.trim="formState.factoryName" disabled />
            </a-form-item>
            <a-form-item label="车间编号" name="workshopCode">
                <a-input
                    allowClear
                    v-model:value.trim="formState.workshopCode"
                    :disabled="modalType === 'edit'"
                />
            </a-form-item>
            <a-form-item label="车间名称" name="workshopName">
                <a-input allowClear v-model:value.trim="formState.workshopName" />
            </a-form-item>
            <a-form-item label="车间简称" name="workshopAbbreviation">
                <a-input allowClear v-model:value.trim="formState.workshopAbbreviation" />
            </a-form-item>
            <a-form-item label="英文名称" name="workshopEnglishName">
                <a-input allowClear v-model:value="formState.workshopEnglishName" />
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
    import {
        checkRequired,
        checkMaxLength,
        checkSpecial,
        checkNumLetter
    } from '@/formRuleConfig/Tpfrules';
    import { useRef, useAntdForm, useRequest } from '@/hooks';
    import type { TpfValidateRule } from '@/types';

    import { ref, unref, computed } from 'vue';
    import { Rule } from 'ant-design-vue/es/form';
    import { useWorkshopAPi } from '@/api';
    import { message } from 'ant-design-vue';
    const workshopAPi = useWorkshopAPi();

    const emit = defineEmits<{
        (e: 'updateList'): void;
    }>();

    const [modalType, setModalType] = useRef<'add' | 'edit'>('add');

    const [visible, setVisible] = useRef(false);
    const { formRef, submitForm } = useAntdForm<typeof formState.value>();

    const initFormState = () => ({
        factoryCode: '', // 工厂编码
        factoryName: '', //工厂名称
        factoryId: '', //工厂id
        workshopCode: '', //车间编码
        workshopName: '', //车间名称
        workshopAbbreviation: '', //车间简称
        workshopEnglishName: '', //英文名称
        status: 1, //状态
        remarks: '' //备注
    });

    const formState = ref<ReturnType<typeof initFormState>>(initFormState());
    const rules = computed(() => {
        return {
            workshopCode: [
                checkMaxLength(12),
                checkSpecial(),
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

                            const { workshopCode, factoryId } = formState.value;
                            const res = await workshopAPi.checkWorkshopCodeUnique({
                                factoryId,
                                workshopCode
                            });
                            if (!res.data.value) {
                                return Promise.reject('车间编号已经存在！');
                            }
                            return Promise.resolve();
                        } catch (error) {
                            console.log('error: ', error);
                        }
                    },
                    trigger: ['blur']
                }
            ],
            workshopName: [
                checkRequired(),
                checkMaxLength(32),
                checkSpecial(),
                {
                    validator: async (_rule: Rule, value: string) => {
                        try {
                            if (!value) {
                                return Promise.resolve();
                            }
                            const { workshopCode, workshopName } = formState.value;
                            const res = await workshopAPi.checkWorkshopNameUnique({
                                workshopCode,
                                workshopName,
                                operation: Number(unref(modalType) === 'edit') //1=编辑 0 =新增
                            });
                            if (!res.data.value) {
                                return Promise.reject('车间名称已经存在！');
                            }
                            return Promise.resolve();
                        } catch (error) {
                            console.log('error: ', error);
                        }
                    },
                    trigger: ['blur']
                }
            ],
            workshopAbbreviation: [checkSpecial(), checkMaxLength(32)],
            workshopEnglishName: [checkSpecial(), checkMaxLength(200)],
            remarks: [checkMaxLength(200)]
        } as TpfValidateRule;
    });

    const onSave = async () => {
        await submitForm();

        if (unref(modalType) === 'add') {
            console.log(unref(formState));
            await workshopAPi.createWorkshop(unref(formState));
            message.success('车间信息新增成功');
        }
        if (unref(modalType) === 'edit') {
            console.log('编辑');
            const resp = await workshopAPi.updateWorkshop(unref(formState));
            if (!resp.data.value) {
                message.error(resp.errorMessage);
                return;
            }
            message.success('车间信息保存成功');
        }
        emit('updateList');
        onCancel();
    };
    const onCancel = () => {
        setVisible(!visible.value);
    };

    const onOpenEdit = async (info: any) => {
        const { workshopId = '' } = unref(info);
        const [res, err] = await useRequest(() => workshopAPi.getWorkshopDetails({ workshopId }));
        if (err) return;
        console.log('res ,err: ', res, err);
        formState.value = res.data.object;
        // const res = await workshopAPi.getWorkshopDetails({ workshopId });
        // formState.value = res.data.object;
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
            unref(formState).factoryId = rootId;
            unref(formState).factoryCode = rootCode;
            unref(formState).factoryName = rootName;
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
