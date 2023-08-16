<template>
    <div>
        <TpfModal
            class="InfoModal"
            v-model:visible="visible"
            height="300px"
            width="800px"
            :title="title"
        >
            <div class="modalBox">
                <a-form
                    v-if="title != '项目集信息详情'"
                    ref="formRef"
                    :model="formState"
                    :label-col="{ span: 7 }"
                    :wrapper-col="{ span: 20 }"
                    :rules="rules"
                >
                    <div class="itemBox">
                        <div class="itemBox_main">
                            <a-row :gutter="24">
                                <a-col :span="12">
                                    <a-form-item name="projectGroupCode" label="项目集编号">
                                        <a-input
                                            :disabled="
                                                title === '编辑项目集信息' ||
                                                title === '项目集信息详情'
                                            "
                                            v-model:value.trim="formState.projectGroupCode"
                                        /> </a-form-item
                                ></a-col>
                                <a-col :span="12">
                                    <a-form-item name="projectGroupName" label="项目集名称">
                                        <a-input
                                            :disabled="title === '项目集信息详情'"
                                            v-model:value.trim="formState.projectGroupName"
                                        /> </a-form-item
                                ></a-col>
                                <a-col :span="12">
                                    <a-form-item name="requirementDate" label="交期">
                                        <a-date-picker
                                            v-model:value="formState.requirementDate"
                                            :disabled="title === '项目集信息详情'"
                                        /> </a-form-item
                                ></a-col>

                                <a-col :span="12">
                                    <a-form-item name="forbidden" label="启用">
                                        <a-switch
                                            v-model:checked="formState.forbidden"
                                            :disabled="title === '项目集信息详情'"
                                        /> </a-form-item
                                ></a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="15">
                                    <div style="padding-left: 10px">
                                        <a-form-item
                                            name="remark"
                                            label="备注"
                                            :labelCol="{ span: 5 }"
                                        >
                                            <a-textarea
                                                :rows="3"
                                                v-model:value="formState.remark"
                                                :disabled="title === '项目集信息详情'"
                                            /> </a-form-item
                                    ></div>
                                </a-col>
                            </a-row>
                        </div>
                    </div>
                </a-form>
                <a-form
                    v-else-if="title === '项目集信息详情'"
                    ref="formRef"
                    :model="formState"
                    :label-col="{ span: 7 }"
                    :wrapper-col="{ span: 20 }"
                    class="read"
                >
                    <div class="itemBox">
                        <div class="itemBox_main">
                            <a-row :gutter="24">
                                <a-col :span="12">
                                    <a-form-item name="projectGroupCode" label="项目集编号">
                                        <span class="fontcolor">{{
                                            formState.projectGroupCode
                                                ? formState.projectGroupCode
                                                : '- -'
                                        }}</span>
                                    </a-form-item></a-col
                                >
                                <a-col :span="12">
                                    <a-form-item name="projectGroupName" label="项目集名称">
                                        <span class="fontcolor">{{
                                            formState.projectGroupName
                                                ? formState.projectGroupName
                                                : '- -'
                                        }}</span>
                                    </a-form-item></a-col
                                >
                                <a-col :span="12">
                                    <a-form-item name="requirementDate" label="交期">
                                        <span class="fontcolor">{{
                                            formState.requirementDate
                                                ? formState.requirementDate
                                                : '- -'
                                        }}</span>
                                    </a-form-item></a-col
                                >

                                <a-col :span="12">
                                    <a-form-item name="forbidden" label="启用">
                                        <a-switch
                                            v-model:checked="formState.forbidden"
                                            :disabled="title === '项目集信息详情'"
                                        /> </a-form-item
                                ></a-col>
                            </a-row>
                            <a-row :gutter="24">
                                <a-col :span="15">
                                    <div style="padding-left: 10px">
                                        <a-form-item
                                            name="remark"
                                            label="备注"
                                            :labelCol="{ span: 5 }"
                                        >
                                            <span class="fontcolor">{{
                                                formState.remark ? formState.remark : '- -'
                                            }}</span>
                                        </a-form-item></div
                                    >
                                </a-col>
                            </a-row>
                        </div>
                    </div>
                </a-form>
            </div>
            <template #footerRight>
                <a-button class="tpf-button" @click="setVisible(false)">
                    {{ title !== '项目集信息详情' ? '取消' : '关闭' }}
                </a-button>
                <a-button
                    class="tpf-button"
                    type="primary"
                    @click="onSave"
                    v-if="title !== '项目集信息详情'"
                >
                    保存
                </a-button>
            </template>
        </TpfModal>
    </div>
</template>

<script setup lang="ts" name="InfoModalProject">
    import { ref } from 'vue';
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useRef, useAntdForm } from '@/hooks';
    import { checkRequired, checkMaxLength, checkNumLetter } from '@/formRuleConfig/Tpfrules';
    import { useProjectGroupApi } from '@/api';
    import type { TpfValidateRule } from '@/types';

    import { Rule } from 'ant-design-vue/es/form';
    import dayjs from 'dayjs';
    const { formRef, submitForm } = useAntdForm();
    const [visible, setVisible] = useRef(false);
    const emits = defineEmits(['submitAdd', 'submitUpdata']);
    const projectGroupApi = useProjectGroupApi();
    const title = ref('新增项目集信息');
    const formState = ref();
    const projectGroupId = ref();
    const initObj = () => {
        return {
            projectGroupCode: '',
            projectGroupName: '',
            forbidden: true,
            remark: '',
            requirementDate: ''
        };
    };
    const rules = {
        projectGroupCode: [
            checkRequired({ message: '必填字段,只允许数字字母组合!' }),
            checkNumLetter({ message: '必填字段,只允许数字字母组合!', required: true }),
            checkMaxLength(50),
            {
                validator: async (_rule: Rule, value: string) => {
                    try {
                        if (!value) {
                            return Promise.resolve();
                        }
                        if (title.value === '编辑项目集信息') {
                            return Promise.resolve();
                        }
                        const { projectGroupCode } = formState.value;
                        if (/^[A-Za-z0-9]+$/.test(value)) {
                            const res = await projectGroupApi.checkProjectGroupCode({
                                projectGroupCode
                            });
                            if (!res.data.value) {
                                return Promise.reject(res.errorMessage || '该项目集编号已有！');
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
        projectGroupName: [checkRequired(), checkMaxLength(100)],
        remark: [checkMaxLength(500)]
    } as TpfValidateRule;
    const open = (t: string, v: any) => {
        setVisible(!visible.value);
        if (t === 'add') {
            title.value = '新增项目集信息';
            formState.value = initObj();
        } else if (t === 'update') {
            title.value = '编辑项目集信息';
            formState.value = initObj();
            formState.value = { ...v };
            formState.value.forbidden = v.forbidden === '0' ? false : true;
            formState.value.requirementDate = v.requirementDate ? dayjs(v.requirementDate) : null;
            projectGroupId.value = v.projectGroupId;
        } else if (t === 'viewInfo') {
            title.value = '项目集信息详情';
            formState.value = initObj();
            formState.value = { ...v };
            formState.value.forbidden = v.forbidden === '0' ? false : true;
            formState.value.requirementDate = v.requirementDate
                ? dayjs(v.requirementDate).format('YYYY-MM-DD')
                : null;
        }
    };
    const onSave = async () => {
        const res = await submitForm();
        if (res) {
            res.forbidden = res.forbidden ? 1 : 0;
            res.requirementDate = res.requirementDate
                ? dayjs(res.requirementDate).format('YYYY-MM-DD')
                : null;
            if (title.value === '新增项目集信息') {
                emits('submitAdd', res);
            } else if (title.value === '编辑项目集信息') {
                res.projectGroupId = projectGroupId.value;
                emits('submitUpdata', res);
            }
        }
    };
    defineExpose({
        open
    });
</script>

<style scoped lang="less">
    .InfoModal {
        .ant-modal-body {
            padding-top: 24px !important;
        }

        .modalBox {
            padding: 10px;
            height: 100%;

            .itemBox {
            }
        }
    }

    .read {
        .fontcolor {
            color: #1d2129;
        }
    }
</style>

<style lang="less">
    .InfoModal {
        .ant-picker {
            width: 100%;
        }
    }
</style>
