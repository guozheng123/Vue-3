<template>
    <TpfModal
        class="add-exception-type-modal"
        v-model:visible="visible"
        :title="title + ' - 生产异常类型'"
        height="342px"
        width="600px"
    >
        <a-form
            :model="formState"
            :label-col="{ span: 7 }"
            :rules="rules"
            ref="exceptionTypeFormRef"
        >
            <div class="form-content">
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-item label="生产异常代码" name="exceptionCode">
                            <a-input
                                :maxlength="30"
                                :disabled="isEdit"
                                v-model:value.trim="formState.exceptionCode"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label="停产原因" name="pauseReason">
                            <a-input
                                :maxlength="30"
                                :disabled="isEdit"
                                v-model:value.trim="formState.pauseReason"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label="异常类型" name="exceptionType">
                            <a-input
                                :maxlength="30"
                                :disabled="isEdit"
                                v-model:value.trim="formState.exceptionType"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label="备注" name="remark">
                            <a-textarea
                                v-model:value.trim="formState.remark"
                                show-count
                                :maxlength="200"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label="启用" name="available">
                            <a-switch v-model:checked="formState.available" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label="是否上报" name="report">
                            <a-switch v-model:checked="formState.report" />
                        </a-form-item>
                    </a-col>
                </a-row>
            </div>
        </a-form>
        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="onSave" :disabled="loading"
                >保存</a-button
            >
        </template>
    </TpfModal>
</template>

<script setup lang="ts" name="addExceptionTypeModal">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { ref, unref, computed } from 'vue';
    import { message } from 'ant-design-vue';
    import type { Rule } from 'ant-design-vue/es/form';
    import { checkRequired, checkNumLetter, checkMaxLength } from '@/formRuleConfig/Tpfrules';
    import { useRef } from '@/hooks';
    import { useExceptionCodeAPi } from '@/api';
    import type { TpfValidateRule } from '@/types';
    const exceptionCodeAPi = useExceptionCodeAPi();
    const [visible, setVisible] = useRef(false);
    const emit = defineEmits(['onGetTableList']);
    const exceptionTypeFormRef = ref();
    const loading = ref(false);
    const isEdit = ref(false);
    const title = ref('');
    const open = (data: { [key: string]: any } | undefined) => {
        onReset();
        onSetData(data);
        setVisible(!visible.value);
    };
    const formState = ref({
        exceptionCode: '',
        pauseReason: '',
        exceptionType: '',
        remark: '',
        report: true,
        available: true,
        id: -1
    });
    const typeConversionKey = ['report', 'available'];
    const isLoadComplete = [false, false];
    const rules = {
        exceptionCode: [
            checkRequired({ message: '请输入生产异常代码！' }),
            checkNumLetter(),
            checkMaxLength(10),
            {
                validator: async (_rule: Rule, value: string) => {
                    try {
                        if (!value) return;
                        await checkNumLetter().validator(_rule, value);
                        isLoadComplete[0] = false;
                        const info = { exceptionCode: value };
                        const res = await exceptionCodeAPi.checkExceptionCode(info);
                        isLoadComplete[0] = true;
                        if (!res.data.value) {
                            return Promise.reject(
                                res.errorMessage === '' ? '生产异常代码重复！' : res.errorMessage
                            );
                        }
                    } catch (error) {
                        console.log(error);
                    }
                },
                trigger: ['blur']
            }
        ],
        pauseReason: [checkRequired({ message: '请输入停产原因！' }), checkMaxLength(10)],
        exceptionType: [
            checkRequired({ message: '请输入异常类型！' }),
            checkMaxLength(15),
            {
                validator: async (_rule: Rule, value: string) => {
                    try {
                        if (!value) return;
                        isLoadComplete[1] = false;
                        const info = { exceptionType: value };
                        const res = await exceptionCodeAPi.checkExceptionType(info);
                        isLoadComplete[1] = true;
                        if (!res.data.value) {
                            return Promise.reject(
                                res.errorMessage === '' ? '异常类型重复！' : res.errorMessage
                            );
                        }
                    } catch (error) {
                        console.log(error);
                        return Promise.reject('重复对比异常！');
                    }
                    return Promise.resolve();
                },
                trigger: ['blur']
            }
        ],
        remark: [checkMaxLength(200)]
    } as TpfValidateRule;

    const onReset = () => {
        for (const key in formState.value) {
            if (typeConversionKey.includes(key)) {
                formState.value[key] = true;
            } else {
                formState.value[key] = '';
            }
        }
    };
    const onSetData = (data: any) => {
        let type = '';
        if (data && Object.prototype.toString.call(data.value) === '[object Object]') {
            type = 'edit';
            for (const key in formState.value) {
                if (typeConversionKey.includes(key)) {
                    formState.value[key] = data.value[key] === '1' ? true : false;
                } else {
                    formState.value[key] = data.value[key];
                }
            }
        } else {
            type = 'view';
        }
        title.value = type === 'edit' ? '编辑' : '新增';
        isEdit.value = type === 'edit' ? true : false;
    };
    const onSave = async () => {
        try {
            await Promise.all(isValidate()).then(async () => {
                // 新增校验
                if (isLoadComplete.some(v => v === false) && !isEdit.value) {
                    message.warning('接口检验重复未完成！');
                    return;
                }
                loading.value = true;
                const { data } = await exceptionCodeAPi[
                    isEdit.value ? 'editExceptionCodeById' : 'saveExceptionCode'
                ](getParamData.value);
                if (data.value) {
                    onReset();
                    setVisible(false);
                    emit('onGetTableList');
                    message.success(title.value + '成功！');
                }
            });
        } catch (error) {
            console.log(error);
        } finally {
            loading.value = false;
        }
    };
    const isValidate = () => {
        if (isEdit.value) {
            return [
                new Promise(res => {
                    res(true);
                })
            ];
        }
        return [exceptionTypeFormRef.value?.validate()];
    };
    const getParamData = computed(() => {
        const { report, available, id } = formState.value;
        return {
            ...unref(formState),
            id: isEdit.value ? id : undefined,
            report: report ? '1' : '0',
            available: available ? '1' : '0'
        };
    });
    defineExpose({ open });
</script>

<style scoped lang="less">
    .form-content {
        width: 70%;
        margin: 20px auto;
        box-sizing: border-box;
    }
</style>
