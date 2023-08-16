<template>
    <TpfModal v-model:visible="visible" :title="props.type" height="300px" width="800px">
        <a-form
            ref="formRef"
            class="tpf-form"
            layout="inline"
            :model="formState"
            :rules="rules"
            :colProps="{ span: 6 }"
            :labelCol="{ style: { width: '110px' } }"
        >
            <a-row class="t-w-[100%]">
                <a-col :span="12">
                    <a-form-item label="移动类型代码" name="code">
                        <a-input
                            :maxlength="10"
                            :disabled="props.isEdit"
                            v-model:value.trim="formState.code"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="移动类型名称" name="name">
                        <a-input
                            :disabled="props.isEdit"
                            :maxlength="20"
                            v-model:value.trim="formState.name"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item name="outInStockType" label="出入库类型">
                        <a-select
                            :disabled="props.isEdit"
                            v-model:value="formState.outInStockType"
                            :options="receiptIssueType"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="启用" name="isUsed">
                        <a-switch
                            :checkedValue="1"
                            :unCheckedValue="0"
                            v-model:checked="formState.isUsed"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="备注" name="remark">
                        <a-textarea :maxlength="200" v-model:value.trim="formState.remark" />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="是否内置" name="isInternal">
                        <a-switch
                            checkedValue="1"
                            unCheckedValue="0"
                            v-model:checked="formState.isInternal"
                        />
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

<script setup lang="ts" name="MoveTypeModel">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { FormInstance, message } from 'ant-design-vue';
    import { ref, watch } from 'vue';
    import { useRef } from '@/hooks';
    import { receiptIssueType } from '@/config';
    import { Rule } from 'ant-design-vue/es/form';
    import { useWarehouseApi } from '@/api';
    import { checkRequired, checkSpecial, checkNumLetter } from '@/formRuleConfig/Tpfrules';
    import type { TpfValidateRule } from '@/types';

    const emit = defineEmits(['uploadTable']);

    const [visible, setVisible] = useRef(false);

    const warehouseApi = useWarehouseApi();

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
        outInStockType: string;
        remark: string;
        isUsed: number;
        isInternal: number;
    }
    const formRef = ref<FormInstance>() as any;

    const formState = ref<FormState>({
        id: '',
        code: '',
        name: '',
        outInStockType: '',
        remark: '',
        isUsed: 1,
        isInternal: 0
    });

    const rules = {
        code: [
            checkRequired({ message: '请输入移动类型代码' }),
            checkSpecial(),
            checkNumLetter(),
            {
                validator: async (_rule: Rule, value: string) => {
                    try {
                        if (props.isEdit === false) {
                            const res = await warehouseApi.checkMoveTypeCode({ code: value });
                            if (!res.data.value) {
                                return Promise.reject(res.errorMessage || '移动类型代码重复');
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
            checkRequired({ message: '请输入移动类型名称' }),
            {
                validator: async (_rule: Rule, value: string) => {
                    try {
                        if (props.isEdit === false) {
                            const res = await warehouseApi.checkMoveTypeName({ name: value });
                            if (!res.data.value) {
                                return Promise.reject(res.errorMessage || '移动类名称重复');
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
        outInStockType: [checkRequired({ message: '请选择出入库类型' })]
    } as TpfValidateRule;
    watch(
        () => props.editData,
        val => {
            if (JSON.stringify(val) === '{}') {
                formState.value = {
                    id: '',
                    code: '',
                    name: '',
                    outInStockType: '',
                    remark: '',
                    isUsed: 1,
                    isInternal: 0
                };
            } else {
                formState.value = val;
            }
        }
    );

    const submitBinSettingsModel = async () => {
        try {
            await formRef.value.validateFields();
            const res = await warehouseApi.createUpdateMoveType({ ...formState.value });
            if (res.success === true) {
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
