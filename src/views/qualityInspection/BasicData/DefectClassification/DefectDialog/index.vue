<template>
    <TpfModal v-model:visible="visible" :title="props.type" height="160px" width="600px">
        <a-form
            ref="formRef"
            class="tpf-form"
            :label-col="{ span: 7, offset: 3 }"
            :model="formState"
            :rules="rules"
        >
            <a-row :gutter="24">
                <a-col :span="18">
                    <a-form-item label="缺陷类型编号" name="defectCauseClassifyCode">
                        <a-input
                            v-if="isEdit !== 3"
                            :maxlength="12"
                            :disabled="props.isEdit === 1"
                            v-model:value.trim="formState.defectCauseClassifyCode"
                        />
                        <span v-else>{{ formState.defectCauseClassifyCode }}</span>
                    </a-form-item>
                </a-col>
                <a-col :span="18">
                    <a-form-item label="缺陷类型名称" name="defectCauseClassifyName">
                        <a-input
                            v-if="!(isEdit === 3)"
                            :maxlength="32"
                            v-model:value.trim="formState.defectCauseClassifyName"
                        />
                        <span v-else>{{ formState.defectCauseClassifyName }}</span>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>

        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false" v-if="isEdit === 3"
                >关闭</a-button
            >
            <a-button class="tpf-button" @click="visible = false" v-else>取消</a-button>
            <a-button
                class="tpf-button"
                type="primary"
                @click="submitBinSettingsModel"
                v-if="!(isEdit === 3)"
                >保存</a-button
            >
        </template>
    </TpfModal>
</template>

<script setup lang="ts" name="MoveTypeModel">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { FormInstance, message } from 'ant-design-vue';
    import { ref, watch, computed } from 'vue';
    import { useRef } from '@/hooks';
    import { Rule } from 'ant-design-vue/es/form';
    import { checkRequired, checkSpecial, checkNumLetter } from '@/formRuleConfig/Tpfrules';
    import type { TpfValidateRule } from '@/types';

    import { useQualityApi } from '@/api';
    const qualityApi = useQualityApi();
    const emit = defineEmits(['uploadTable']);
    const [visible, setVisible] = useRef(false);

    type Props = {
        type: string;
        isEdit: number;
        editData: any;
    };

    const props = withDefaults(defineProps<Props>(), {
        type: '',
        isEdit: 0,
        editData: {}
    });

    const open = () => {
        setVisible(!visible.value);
    };

    interface FormState {
        defectCauseClassifyCode: string;
        defectCauseClassifyName: string;
        defectCauseClassifyId?: any;
    }
    const formRef = ref<FormInstance>() as any;
    const formState = ref<FormState>({
        defectCauseClassifyCode: '',
        defectCauseClassifyName: '',
        defectCauseClassifyId: ''
    });
    const rules = computed(
        () =>
            ({
                defectCauseClassifyCode: [
                    checkRequired({
                        message: '请输入缺陷类型编号！',
                        required: props.isEdit !== 3
                    }),
                    checkSpecial(),
                    checkNumLetter(),
                    {
                        validator: async (_rule: Rule, value: string) => {
                            try {
                                if (props.isEdit === 0) {
                                    const res = await qualityApi.checkDefectCauseClassifyCode({
                                        defectCauseClassifyCode: value
                                    });
                                    if (!res.data.value) {
                                        return Promise.reject(
                                            res.errorMessage || '缺陷类型编号重复'
                                        );
                                    }
                                    return Promise.resolve();
                                }
                                return Promise.resolve();
                            } catch (error) {
                                console.log('error: ', error);
                            }
                        },
                        trigger: ['blur']
                    }
                ],
                defectCauseClassifyName: [
                    checkRequired({ message: '请输入缺陷类型名称！', required: props.isEdit !== 3 })
                ]
            } as TpfValidateRule)
    );
    watch(
        () => props.editData,
        val => {
            if (JSON.stringify(val) === '{}') {
                formState.value = {
                    defectCauseClassifyCode: '',
                    defectCauseClassifyName: ''
                };
            } else {
                formState.value = val;
            }
        }
    );

    const submitBinSettingsModel = async () => {
        console.log(formRef.value);
        try {
            await formRef.value.validateFields();
            let res: any = {};
            const { defectCauseClassifyCode, defectCauseClassifyName, defectCauseClassifyId } =
                formState.value;
            const info = {
                defectCauseClassifyCode: defectCauseClassifyCode,
                defectCauseClassifyName: defectCauseClassifyName
            };
            if (props.isEdit === 0) {
                res = await qualityApi.addDefectCauseClassify(info);
            } else {
                res = await qualityApi.editDefectCauseClassify({ ...info, defectCauseClassifyId });
            }
            if (res.data.value === true) {
                message.success(props.isEdit === 1 ? '编辑成功' : '新增成功');
                emit('uploadTable');
            } else {
                message.error(props.isEdit === 1 ? '编辑失败' : '新增失败');
            }
            setVisible(!visible.value);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    defineExpose({ open });
</script>
