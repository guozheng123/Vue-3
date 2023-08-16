<template>
    <TpfModal
        destroyOnClose
        class="FactoryModal"
        v-model:visible="visible"
        height="300px"
        :title="title"
        width="600px"
    >
        <a-form
            ref="formRef"
            :model="formState"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 10 }"
            :rules="rules"
        >
            <a-form-item label="角色编号" name="roleCode">
                <a-input
                    :disabled="isEdit"
                    :maxlength="12"
                    allowClear
                    v-model:value.trim="formState.roleCode"
                />
            </a-form-item>
            <a-form-item label="角色名称" name="roleName">
                <a-input :maxlength="32" allowClear v-model:value.trim="formState.roleName" />
            </a-form-item>

            <a-form-item label="角色描述" name="roleText">
                <a-input :maxlength="100" allowClear v-model:value.trim="formState.roleText" />
            </a-form-item>

            <a-form-item label="启用" name="lockFlag">
                <a-switch
                    :checkedValue="1"
                    :unCheckedValue="0"
                    v-model:checked="formState.lockFlag"
                />
            </a-form-item>
            <!-- <a-form-item label="互斥角色" name="repelRoleId">
                <a-select
                    v-model:value="formState.repelRoleId"
                    mode="multiple"
                    style="width: 100%"
                    :options="options"
                    optionFilterProp="roleName"
                    :fieldNames="{
                        label: 'roleName',
                        value: 'roleId'
                    }"
                />
            </a-form-item> -->
        </a-form>

        <template #footerRight>
            <a-button class="tpf-button" @click="onCancel">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="onSave">保存</a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="ts" name="AddDRole">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { checkRequired, checkSpecial, checkNumLetter } from '@/formRuleConfig/Tpfrules';
    import { useRef, useAntdForm } from '@/hooks';
    import type { TpfValidateRule } from '@/types';

    import { Rule } from 'ant-design-vue/es/form';
    import { ref, unref } from 'vue';
    import { useRoleApi } from '@/api';
    const roleApi = useRoleApi();
    const [visible, setVisible] = useRef(false);
    const { formRef, submitForm } = useAntdForm();

    const formState = ref({
        roleName: '',
        roleCode: '',
        roleText: '',
        lockFlag: 1,
        // repelRoleId: [],
        tenantId: '',
        roleId: null,
        systemFlag: ''
    });
    const isEdit = ref(true);
    const title = ref<string>('');
    // const options = ref([]);

    const emits = defineEmits(['submitAdd', 'submitUpdata']);
    const rules = {
        roleCode: [
            checkRequired(),
            checkSpecial(),
            checkNumLetter(),
            {
                validator: async (_rule: Rule, value: string) => {
                    try {
                        if (!unref(isEdit)) {
                            if (!value) {
                                return Promise.resolve();
                            }
                            const params = {
                                roleCode: value
                            };
                            const res = await roleApi.checkRoleCode(params);
                            if (!res.data.value) {
                                return Promise.reject(res.errorMessage || '角色编号重复');
                            }
                            return Promise.resolve();
                        }
                    } catch (error) {
                        console.log('error: ', error);
                    }
                },
                trigger: ['blur']
            }
        ],
        roleName: [
            checkRequired(),
            checkSpecial(),
            {
                validator: async (_rule: Rule, value: string) => {
                    try {
                        if (!value) {
                            return Promise.resolve();
                        }
                        const params = {
                            roleName: value,
                            roleId: formState.value.roleId
                        };
                        const res = await roleApi.checkRoleName(params);
                        if (!res.data.value) {
                            return Promise.reject(res.errorMessage || '角色名称重复');
                        }
                        return Promise.resolve();
                    } catch (error) {
                        console.log('error: ', error);
                    }
                },
                trigger: ['blur']
            }
        ],
        roleText: [checkSpecial()]
    } as TpfValidateRule;

    const onSave = async () => {
        const res = await submitForm();
        if (title.value === '新增角色') {
            emits('submitAdd', res);
        } else {
            const params = {
                ...unref(formState)
            };
            emits('submitUpdata', params);
        }
    };
    const onCancel = () => {
        setVisible(!visible.value);
    };
    const open = async (t: string, data: any) => {
        setVisible(!visible.value);
        if (t === 'edit') {
            isEdit.value = true;
            title.value = '编辑角色';
            Object.keys(formState.value).forEach(key => {
                formState.value[key] = data[key];
            });
        } else if (t === 'add') {
            isEdit.value = false;
            title.value = '新增角色';
            formState.value = {
                roleName: '',
                roleCode: '',
                roleText: '',
                lockFlag: 1,
                // repelRoleId: [],
                tenantId: '',
                roleId: null,
                systemFlag: ''
            };
        }
    };
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
