<template>
    <SelectProjectGroup ref="selectProjectGroup" @submitAdd="submitAdd" />
    <TpfModal v-model:visible="visible" height="400px" width="800px" :title="title">
        <a-form
            v-if="title != '项目信息详情'"
            ref="formRef"
            class="tpf-form"
            :model="formState"
            :label-col="{ span: 7 }"
            :wrapper-col="{ span: 20 }"
            :rules="rules"
        >
            <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-item name="projectCode" label="项目编号">
                        <a-input
                            :disabled="title === '编辑项目信息'"
                            v-model:value.trim="formState.projectCode"
                        /> </a-form-item
                ></a-col>
                <a-col :span="12">
                    <a-form-item name="projectName" label="项目名称">
                        <a-input v-model:value.trim="formState.projectName" /> </a-form-item
                ></a-col>
                <a-col :span="12">
                    <a-form-item name="projectGroupCode" label="项目集编号">
                        <a-input-search
                            v-model:value="formState.projectGroupCode"
                            class="btnBorder"
                            @search="openSelectModal"
                        /> </a-form-item
                ></a-col>
                <a-col :span="12">
                    <a-form-item name="projectGroupName" label="项目集名称">
                        <a-input
                            :disabled="true"
                            v-model:value.trim="formState.projectGroupName"
                        /> </a-form-item
                ></a-col>
                <a-col :span="12">
                    <a-form-item name="companyId" label="所属公司">
                        <a-select v-model:value="formState.companyId" allowClear>
                            <a-select-option
                                v-for="item in companyOption"
                                :value="item.value"
                                :key="item.value"
                                >{{ item.label }}</a-select-option
                            >
                        </a-select>
                    </a-form-item></a-col
                >
                <a-col :span="12">
                    <a-form-item name="boardShowFlag" label="看板显示">
                        <a-select v-model:value="formState.boardShowFlag">
                            <a-select-option value="1">是</a-select-option>
                            <a-select-option value="0">否</a-select-option>
                        </a-select>
                    </a-form-item></a-col
                >
                <a-col :span="12">
                    <a-form-item name="forbidden" label="启用">
                        <a-switch v-model:checked="formState.forbidden" /> </a-form-item
                ></a-col>
            </a-row>
            <a-row :gutter="24">
                <a-col :span="15">
                    <div style="padding-left: 10px">
                        <a-form-item name="remark" label="备注" :labelCol="{ span: 5 }">
                            <a-textarea :rows="3" v-model:value="formState.remark" /> </a-form-item
                    ></div>
                </a-col>
            </a-row>
        </a-form>
        <a-form
            v-else-if="title === '项目信息详情'"
            ref="formRef"
            class="tpf-form read"
            :model="formState"
            :label-col="{ span: 7 }"
            :wrapper-col="{ span: 20 }"
        >
            <div class="itemBox">
                <div class="itemBox_main">
                    <a-row :gutter="24">
                        <a-col :span="12">
                            <a-form-item name="projectCode" label="项目编号">
                                <span class="fontcolor">{{
                                    formState.projectCode ? formState.projectCode : '- -'
                                }}</span>
                            </a-form-item></a-col
                        >
                        <a-col :span="12">
                            <a-form-item name="projectName" label="项目名称">
                                <span class="fontcolor">{{
                                    formState.projectName ? formState.projectName : '- -'
                                }}</span>
                            </a-form-item></a-col
                        >
                        <a-col :span="12">
                            <a-form-item name="projectGroupCode" label="项目集编号">
                                <span class="fontcolor">{{
                                    formState.projectGroupCode ? formState.projectGroupCode : '- -'
                                }}</span>
                            </a-form-item></a-col
                        >
                        <a-col :span="12">
                            <a-form-item name="projectGroupName" label="项目集名称">
                                <span class="fontcolor">{{
                                    formState.projectGroupName ? formState.projectGroupName : '- -'
                                }}</span>
                            </a-form-item></a-col
                        >
                        <a-col :span="12">
                            <a-form-item name="companyId" label="所属公司">
                                <span class="fontcolor">{{
                                    formState.companyName ? formState.companyName : '- -'
                                }}</span>
                            </a-form-item></a-col
                        >
                        <a-col :span="12">
                            <a-form-item name="boardShowFlag" label="看板显示">
                                <span class="fontcolor">{{
                                    formState.boardShowFlag
                                        ? formState.boardShowFlag === '1'
                                            ? '是'
                                            : '否'
                                        : '- -'
                                }}</span>
                            </a-form-item></a-col
                        >
                        <a-col :span="12">
                            <a-form-item name="forbidden" label="启用">
                                <a-switch
                                    v-model:checked="formState.forbidden"
                                    :disabled="title === '项目信息详情'"
                                /> </a-form-item
                        ></a-col>
                    </a-row>
                    <a-row :gutter="24">
                        <a-col :span="15">
                            <div style="padding-left: 10px">
                                <a-form-item name="remark" label="备注" :labelCol="{ span: 5 }">
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
        <template #footerRight>
            <a-button class="tpf-button" @click="setVisible(false)">
                {{ title !== '项目信息详情' ? '取消' : '关闭' }}
            </a-button>
            <a-button
                class="tpf-button"
                type="primary"
                @click="onSave"
                v-if="title !== '项目信息详情'"
            >
                保存
            </a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="ts" name="InfoModalProject">
    import { ref, defineAsyncComponent, reactive } from 'vue';
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useRef, useAntdForm, useOpenAntdModal } from '@/hooks';
    import { checkRequired, checkMaxLength, checkNumLetter } from '@/formRuleConfig/Tpfrules';
    import { useProjectApi, useCompanyAPi } from '@/api';
    import type { TpfValidateRule } from '@/types';
    import { Rule } from 'ant-design-vue/es/form';
    import { getSysGroupManagement } from '@/utils';

    const SelectProjectGroup = defineAsyncComponent(() => import('./SelectProjectGroup.vue'));

    const [selectProjectGroup, onOpenSelectModal] = useOpenAntdModal();

    const { formRef, submitForm } = useAntdForm();

    const [visible, setVisible] = useRef(false);

    const emits = defineEmits(['submitAdd', 'submitUpdata']);

    const projectApi = useProjectApi();

    const companyAPi = useCompanyAPi();

    const title = ref('新增项目信息');

    const formState = ref();

    const projectId = ref();

    const projectGroupId = ref();

    const companyOption = reactive([{ value: 0 as number, label: '所有' }]);

    const initObj = () => {
        return {
            projectCode: '',
            projectName: '',
            projectGroupCode: '',
            projectGroupName: '',
            forbidden: true,
            boardShowFlag: '1',
            remark: '',
            companyId: '',
            projectGroupId: ''
        };
    };
    const rules = {
        projectCode: [
            checkRequired({ message: '必填字段,只允许数字字母组合!' }),
            checkNumLetter({ message: '必填字段,只允许数字字母组合!', required: true }),
            checkMaxLength(50),
            {
                validator: async (_rule: Rule, value: string) => {
                    try {
                        if (!value) {
                            return Promise.resolve();
                        }
                        if (title.value === '编辑项目信息') {
                            return Promise.resolve();
                        }
                        const { projectCode } = formState.value;
                        if (/^[A-Za-z0-9]+$/.test(value)) {
                            const res = await projectApi.checkProjectCode({
                                projectCode
                            });
                            if (!res.data.value) {
                                return Promise.reject(res.errorMessage || '该项目编号已有！');
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
        projectName: [checkRequired(), checkMaxLength(100)],
        projectGroupCode: [checkMaxLength(50)],
        projectGroupName: [checkMaxLength(100)],
        remark: [checkMaxLength(500)],
        companyId: [checkRequired({ required: getSysGroupManagement() })]
    } as TpfValidateRule;
    const getCompany = async () => {
        companyOption.length = 0;
        const res = await companyAPi.getCompanyIsValidList();
        if (res.success === true) {
            res.data.list.forEach(item => {
                const o = { label: '所有', value: 0 };
                o.label = item.companyName;
                o.value = item.companyId;
                companyOption.push(o);
            });
        }
    };
    const submitAdd = (v: any) => {
        formState.value.projectGroupCode = v.projectGroupCode;
        formState.value.projectGroupName = v.projectGroupName;
        projectGroupId.value = v.projectGroupId;
    };
    const open = (t: string, v: any) => {
        setVisible(!visible.value);
        getCompany();
        if (t === 'add') {
            title.value = '新增项目信息';
            formState.value = initObj();
        } else if (t === 'update') {
            title.value = '编辑项目信息';
            formState.value = initObj();
            formState.value = { ...v };
            formState.value.forbidden = v.forbidden === '0' ? false : true;
            projectId.value = v.projectId;
            projectGroupId.value = v.projectGroupId;
        } else if (t === 'viewInfo') {
            title.value = '项目信息详情';
            formState.value = initObj();
            formState.value = { ...v };
            formState.value.forbidden = v.forbidden === '0' ? false : true;
        }
    };
    const openSelectModal = () => {
        onOpenSelectModal();
    };
    const onSave = async () => {
        const res = await submitForm();
        if (res) {
            res.forbidden = res.forbidden ? 1 : 0;
            res.projectGroupId = projectGroupId.value ? projectGroupId.value : null;
            if (title.value === '新增项目信息') {
                emits('submitAdd', res);
            } else if (title.value === '编辑项目信息') {
                res.projectId = projectId.value;
                emits('submitUpdata', res);
            }
        }
    };
    defineExpose({ open });
</script>

<style scoped lang="less">
    .read {
        .fontcolor {
            color: #1d2129;
        }
    }
</style>
