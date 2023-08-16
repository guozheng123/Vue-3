<template>
    <TpfModal
        destroyOnClose
        class="FactoryModal"
        v-model:visible="visible"
        height="400px"
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
            <a-form-item label="部门编号" name="departmentCode">
                <a-input
                    :disabled="isEdit"
                    :maxlength="12"
                    allowClear
                    v-model:value.trim="formState.departmentCode"
                />
            </a-form-item>
            <a-form-item label="部门名称" name="departmentName">
                <a-input :maxlength="32" allowClear v-model:value.trim="formState.departmentName" />
            </a-form-item>
            <a-form-item label="上级部门" name="parentDepartmentId">
                <a-tree-select
                    :disabled="isEdit"
                    v-model:value="formState.parentDepartmentId"
                    show-search
                    style="width: 100%"
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                    allow-clear
                    tree-default-expand-all
                    :tree-data="treeData"
                    :field-names="{
                        children: 'branchTree',
                        label: 'rootName',
                        value: 'rootId'
                    }"
                />
            </a-form-item>
            <!-- <a-form-item label="英文名称" name="departmentEnName">
                <a-input
                    :maxlength="100"
                    allowClear
                    v-model:value.trim="formState.departmentEnName"
                />
            </a-form-item> -->

            <a-form-item label="启用" name="lockFlag">
                <a-switch
                    :checkedValue="1"
                    :unCheckedValue="0"
                    v-model:checked="formState.lockFlag"
                />
            </a-form-item>
            <a-form-item label="备注" name="remarks">
                <a-textarea :maxlength="200" allowClear v-model:value="formState.remarks" />
            </a-form-item>
        </a-form>

        <template #footerRight>
            <a-button class="tpf-button" @click="onCancel">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="onSave">保存</a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="ts" name="AddDepartment">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { checkRequired, checkNumLetter, checkSpecial } from '@/formRuleConfig/Tpfrules';
    import { useRef, useAntdForm } from '@/hooks';
    import type { TpfValidateRule } from '@/types';

    import { Rule } from 'ant-design-vue/es/form';
    import { ref, watch, unref } from 'vue';
    import { useDepartmentApi } from '@/api';
    const departmentApi = useDepartmentApi();
    const [visible, setVisible] = useRef(false);
    const { formRef, submitForm, resetFields } = useAntdForm();
    const formState = ref({
        departmentId: '',
        departmentCode: '',
        departmentName: '',
        parentDepartmentId: '',
        departmentEnName: '',
        remarks: '',
        lockFlag: 1
    });
    const treeData = ref<any[]>();
    const title = ref<string>('');
    const isEdit = ref(false);
    const emits = defineEmits(['submitAdd', 'submitUpdata']);
    const rules = {
        departmentCode: [
            checkRequired(),
            checkSpecial(),
            checkNumLetter(),
            {
                validator: async (_rule: Rule, value: string) => {
                    try {
                        if (!value) {
                            return Promise.resolve();
                        }
                        if (title.value === '编辑部门') {
                            return Promise.resolve();
                        }
                        const { departmentCode } = formState.value;
                        const res = await departmentApi.checkDepartmentCodeUnique({
                            departmentCode
                        });
                        if (!res.data.value) {
                            return Promise.reject(res.errorMessage || '部门编号重复');
                        }
                        return Promise.resolve();
                    } catch (error) {
                        console.log('error: ', error);
                    }
                },
                trigger: ['blur']
            }
        ],
        departmentName: [checkRequired()]
    } as TpfValidateRule;
    const onSave = async () => {
        const res = await submitForm();
        if (res) {
            if (title.value === '新增部门') {
                emits('submitAdd', res);
            } else {
                const params = {
                    ...res,
                    departmentId: unref(formState).departmentId
                };
                emits('submitUpdata', params);
            }
        }
    };
    const getTree = async () => {
        const res = await departmentApi.getDepartmentTreeList();
        treeData.value = res.data.list;
    };
    const onCancel = () => {
        setVisible(!visible.value);
    };
    const open = async (t: string, v: any) => {
        setVisible(!visible.value);
        getTree();
        if (t === 'edit') {
            title.value = '编辑部门';
            isEdit.value = true;
            formState.value.departmentId = v.departmentId;
            const res = await departmentApi.getDepartmentDetails({
                departmentId: v.departmentId
            });
            res.data.object.parentDepartmentId =
                res.data.object.parentDepartmentId === 0 ? '' : res.data.object.parentDepartmentId;
            formState.value = { ...res.data.object };
        } else if (t === 'add') {
            isEdit.value = false;
            formState.value.parentDepartmentId = v ? v : '';
            title.value = '新增部门';
        }
    };
    watch(visible, () => {
        resetFields();
    });
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
