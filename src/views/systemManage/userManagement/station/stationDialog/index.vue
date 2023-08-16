<template>
    <TpfModal v-model:visible="visible" :title="props.type" height="300px" width="600px">
        <a-form
            ref="formRef"
            class="moveTypeModel"
            style="display: block; width: 80%; margin: 0 auto"
            layout="inline"
            :model="formState"
            @finish="handleFinish"
            :rules="rules"
        >
            <a-row :gutter="24">
                <a-col :span="24">
                    <a-form-item label="岗位编号" name="postCode">
                        <a-input
                            :maxlength="12"
                            :disabled="props.isEdit"
                            v-model:value.trim="formState.postCode"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter="24">
                <a-col :span="24">
                    <a-form-item label="岗位名称" name="postName">
                        <a-input :maxlength="32" v-model:value.trim="formState.postName" />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter="24">
                <a-col :span="24">
                    <a-form-item label="岗位描述" name="postText">
                        <a-input :maxlength="100" v-model:value.trim="formState.postText" />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter="24">
                <a-col :span="24">
                    <a-form-item label="启用">
                        <a-switch
                            :checkedValue="1"
                            :unCheckedValue="0"
                            v-model:checked="formState.lockFlag"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>

        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="submitBinSettingsModel"
                >保存</a-button
            >
        </template>
    </TpfModal>
</template>

<script setup lang="ts" name="MoveTypeModel">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { FormInstance, message } from 'ant-design-vue';
    import { ref, watch } from 'vue';
    import { useRef } from '@/hooks';
    import { Rule } from 'ant-design-vue/es/form';
    import { usePostApi } from '@/api';
    import { checkRequired, checkSpecial, checkNumLetter } from '@/formRuleConfig/Tpfrules';
    import type { TpfValidateRule } from '@/types';

    const emit = defineEmits(['uploadTable']);
    const [visible, setVisible] = useRef(false);
    const postApi = usePostApi();

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
        postCode: string;
        postName: string;
        postText: string;
        lockFlag: number;
        postId?: string;
    }
    const formRef = ref<FormInstance>() as any;
    const formState = ref<FormState>({
        postCode: '',
        postName: '',
        lockFlag: 1,
        postText: ''
    });
    const rules = {
        postCode: [
            checkRequired({ message: '请输入岗位编码' }),
            checkSpecial(),
            checkNumLetter(),
            {
                validator: async (_rule: Rule, value: string) => {
                    try {
                        if (props.isEdit === false) {
                            const res = await postApi.checkPostCodeUnique({
                                postCode: value
                            });
                            if (!res.data.value) {
                                return Promise.reject(res.errorMessage || '岗位编码重复');
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
        postName: [
            checkRequired({ message: '请输入岗位名称' }),
            {
                validator: async (_rule: Rule, value: string) => {
                    try {
                        const res = await postApi.checkPostNameUnique({
                            postCode: formState.value.postCode,
                            postName: value,
                            operation: Number(props.isEdit)
                        });
                        if (!res.data.value) {
                            return Promise.reject(res.errorMessage || '岗位名称重复');
                        }
                        return Promise.resolve();
                    } catch (error) {
                        console.log('error: ', error);
                    }
                },
                trigger: ['blur']
            }
        ]
    } as TpfValidateRule;
    watch(
        () => props.editData,
        val => {
            if (JSON.stringify(val) === '{}') {
                formState.value = {
                    postCode: '',
                    postName: '',
                    lockFlag: 1,
                    postText: ''
                };
            } else {
                formState.value = val;
            }
        }
    );

    const handleFinish = () => {};
    const submitBinSettingsModel = async () => {
        console.log(formRef.value);
        try {
            const values = await formRef.value.validateFields();
            let res: any = {};
            const { postCode, postName, lockFlag, postText, postId } = formState.value;
            const info = {
                postCode: postCode,
                postName: postName,
                lockFlag: lockFlag,
                postText: postText
            };
            if (props.isEdit === false) {
                res = await postApi.createPost(info);
            } else {
                res = await postApi.updatePost({ ...info, postId });
            }
            if (res.data.value === true) {
                message.success(props.isEdit ? '编辑成功' : '新增成功');
                emit('uploadTable');
            } else {
                message.error(props.isEdit ? '编辑失败' : '新增失败');
            }
            setVisible(!visible.value);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    defineExpose({ open });
</script>

<style scoped lang="less">
    .moveTypeModel {
        :deep(.ant-form-item-label) {
            width: 110px !important;
        }

        :deep(.ant-row) {
            margin-right: 0 !important;
            height: 60px !important;
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
