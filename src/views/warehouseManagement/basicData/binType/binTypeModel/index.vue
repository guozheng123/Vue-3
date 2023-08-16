<template>
    <TpfModal v-model:visible="visible" :title="props.type" height="300px" width="800px">
        <a-form
            ref="formRef"
            class="binTypeModel"
            layout="inline"
            :model="formState"
            :rules="rules"
        >
            <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-item label="仓位类型代码" name="code">
                        <a-input
                            :maxlength="10"
                            :disabled="props.isEdit"
                            v-model:value.trim="formState.code"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="仓位类型" name="name">
                        <a-input
                            :disabled="props.isEdit"
                            :maxlength="20"
                            v-model:value.trim="formState.name"
                        />
                    </a-form-item>
                </a-col>

                <a-col :span="24">
                    <a-form-item label="启用">
                        <a-switch
                            :checkedValue="1"
                            :unCheckedValue="0"
                            v-model:checked="formState.isUsed"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="备注">
                        <a-textarea :maxlength="200" v-model:value.trim="formState.remark" />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="submitBinSettingsModel">
                保存
            </a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="ts" name="BinTypeModel">
    import TpfModal from '@/components/TpfModal/index.vue';
    import type { FormInstance } from 'ant-design-vue';
    import { message } from 'ant-design-vue';
    import { ref, watch } from 'vue';
    import { useRef } from '@/hooks';
    import { useWarehouseApi } from '@/api';
    import { Rule } from 'ant-design-vue/es/form';
    import { checkRequired, checkSpecial, checkNumLetter } from '@/formRuleConfig/Tpfrules';
    import type { TpfValidateRule } from '@/types';

    const warehouseApi = useWarehouseApi();

    const [visible, setVisible] = useRef(false);
    const emit = defineEmits(['uploadTable']);

    type Props = {
        type: string;
        isEdit: boolean;
        editData: any;
    };

    const props = withDefaults(defineProps<Props>(), {
        type: '',
        isEdit: false,
        editData: {}
    });

    const open = () => {
        setVisible(!visible.value);
    };
    interface FormState {
        id: string;
        code: string;
        name: string;
        remark: string;
        isUsed: number;
    }
    const formRef = ref<FormInstance>() as any;
    const formState = ref<FormState>({
        id: '',
        code: '',
        name: '',
        remark: '',
        isUsed: 1
    });
    const rules = {
        code: [
            checkRequired({ message: '请输入仓位类型代码' }),
            checkSpecial(),
            checkNumLetter(),
            {
                validator: async (_rule: Rule, value: string) => {
                    try {
                        if (props.isEdit === false) {
                            const res = await warehouseApi.checkPositionTypeCode({
                                code: value
                            });
                            if (!res.data.value) {
                                return Promise.reject(res.errorMessage || '仓位类型代码重复');
                            }
                        }
                        return Promise.resolve();
                    } catch (error) {
                        console.log('error: ', error);
                    }
                },
                trigger: ['blur']
            }
        ],
        name: [
            checkRequired({ message: '请输入仓位类型' }),
            {
                validator: async (_rule: Rule, value: string) => {
                    try {
                        if (props.isEdit === false) {
                            const res = await warehouseApi.checkPositionTypeName({
                                name: value
                            });
                            if (!res.data.value) {
                                return Promise.reject(res.errorMessage || '仓位类型重复');
                            }
                        }
                        return Promise.resolve();
                    } catch (error) {
                        console.log('error: ', error);
                    }
                },
                trigger: ['blur']
            }
        ],
        attribute: [checkRequired({ message: '请选择仓位属性' })]
    } as TpfValidateRule;
    watch(
        () => props.editData,
        val => {
            if (JSON.stringify(val) === '{}') {
                formState.value = {
                    id: '',
                    code: '',
                    name: '',
                    remark: '',
                    isUsed: 1
                };
            } else {
                formState.value = val;
            }
        }
    );
    const submitBinSettingsModel = async () => {
        try {
            await formRef.value.validateFields();
            const res = await warehouseApi.createUpdatePositionType({ ...formState.value });
            if (res.data.value) {
                message.success(props.isEdit ? '编辑成功' : '新增成功');
                emit('uploadTable');
                setVisible(!visible.value);
            }
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    defineExpose({ open });
</script>

<style scoped lang="less">
    .binTypeModel {
        :deep(.ant-form-item-label) {
            width: 110px !important;
        }

        :deep(.ant-row) {
            margin-right: 0 !important;
            margin-left: 0 !important;
        }
        // :deep(.ant-form-item-label) .ant-form-item-control {
        //     margin-left: 10px;
        // }
        .ant-form-item {
            margin: 20px 0 0 0;
        }
    }
</style>
