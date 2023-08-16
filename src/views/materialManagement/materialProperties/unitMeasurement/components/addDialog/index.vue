<!-- 新增类型弹窗 -->
<template>
    <div>
        <div class="shear-box">
            <TpfModal
                class="WorknModel"
                v-model:visible="visible"
                :title="title[typeDialog]"
                width="600px"
                height="342px"
            >
                <a-form
                    :model="formList"
                    name="basic"
                    autocomplete="off"
                    @finish="onFinish"
                    :rules="rules"
                    @finishFailed="onFinishFailed"
                >
                    <div class="center-box">
                        <a-row :gutter="24">
                            <a-col :span="24">
                                <a-form-item label="计量单位编号" name="materialUnitCode">
                                    <a-input
                                        :maxlength="30"
                                        v-model:value.trim="formList.materialUnitCode"
                                        :disabled="isDisabled"
                                        v-if="isDetails"
                                    />
                                    <span v-if="!isDetails">{{ formList.materialUnitCode }}</span>
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24">
                            <a-col :span="24">
                                <a-form-item label="计量单位名称" name="materialUnitName">
                                    <a-input
                                        :maxlength="30"
                                        v-model:value.trim="formList.materialUnitName"
                                        v-if="isDetails"
                                    />
                                    <span v-if="!isDetails">{{ formList.materialUnitName }}</span>
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24" class="switch-style">
                            <a-col>
                                <a-form-item
                                    label="默认"
                                    :rules="[{ required: false }]"
                                    name="defaultFlag"
                                >
                                    <a-switch v-model:checked="formList.defaultFlag" />
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24" class="switch-style">
                            <a-col>
                                <a-form-item
                                    label="启用"
                                    :rules="[{ required: false }]"
                                    name="status"
                                >
                                    <a-switch v-model:checked="formList.status" />
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </div>
                    <div class="footerRight">
                        <a-space>
                            <a-button class="tpf-button" @click="visible = false">取消</a-button>
                            <a-button
                                class="tpf-button"
                                type="primary"
                                html-type="submit"
                                v-if="isDetails"
                                >保存</a-button
                            >
                        </a-space>
                    </div>
                </a-form>
                <template #footerRight>
                    <div style="height: 32px"></div>
                </template>
            </TpfModal>
        </div>
    </div>
</template>

<script lang="tsx" setup>
    import TpfModal from '@/components/TpfModal/index.vue';
    import { message } from 'ant-design-vue';
    import { checkRequired, checkNumLetter } from '@/formRuleConfig/Tpfrules';
    import type { Rule } from 'ant-design-vue/es/form';
    import { useRef } from '@/hooks';
    import { ref, watch } from 'vue';
    import console from 'console';
    import { useMaterialApi, useMaterialUnitApi } from '@/api';
    import type { TpfValidateRule } from '@/types';

    const materialDataApi = useMaterialApi();
    const materialUnitApi = useMaterialUnitApi();
    const isDisabled = ref<boolean>(false);
    const isDetails = ref<boolean>(true);
    const [visible, setVisible] = useRef(false);
    const emit = defineEmits(['ongetDataList']);
    const title = ref(['质检项目标题', '新增-计量单位', '编辑-计量单位', '质检项目详情']);
    const typeDialog = ref<number>(1);
    const formList = ref({
        materialUnitName: '',
        materialUnitCode: '',
        defaultFlag: false,
        status: true,
        materialUnitId: ''
    });

    const openAddDialogView = (num: number, data: any) => {
        typeDialog.value = num;
        setVisible(!visible.value);
        if (typeDialog.value === 1) return;
        if (typeDialog.value === 2) {
            data.status === '1' ? (data.status = true) : (data.status = false);
            data.defaultFlag === '1' ? (data.defaultFlag = true) : (data.defaultFlag = false);
            isDisabled.value = true;
            console.log(data);
            formList.value = data;
        }
    };

    watch(
        //初始化
        () => visible.value,
        (newValue: boolean, oldValue: boolean) => {
            if (!newValue) {
                isDisabled.value = false;
                formList.value = {
                    materialUnitName: '',
                    materialUnitCode: '',
                    defaultFlag: false,
                    status: true,
                    materialUnitId: ''
                };
                isDetails.value = true;
            }
        }
    );

    const onFinish = async (values: any) => {
        console.log('Success:', values); //收集到的数据
        let res: any = [];
        values.status === true ? (values.status = 1) : (values.status = 0);
        values.defaultFlag === true ? (values.defaultFlag = 1) : (values.defaultFlag = 0);
        if (typeDialog.value === 1) {
            console.log(values);
            res = await materialUnitApi.addMaterialUnit(values);
        }
        if (typeDialog.value === 2) {
            //还要额外传id
            values.materialUnitId = formList.value.materialUnitId;
            res = await materialUnitApi.editMaterialUnit(values);
        }
        if (res.success === true) {
            emit('ongetDataList'); //刷新数据
            message.success('保存成功');
        }
        setVisible(!visible.value);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
        return;
    };

    const rules = {
        materialUnitCode: [
            checkRequired({ message: '请输入计量单位编号！' }),
            // checkSpecial(),
            checkNumLetter(),
            {
                validator: async (_rule: Rule, value: string) => {
                    try {
                        if (typeDialog.value === 1) {
                            if (!value) return;
                            const info = { materialUnitCode: value };
                            const res = await materialUnitApi.checkMaterialUnitCode(info);
                            if (!res.data.value) {
                                return Promise.reject(res.errorMessage || '计量单位编号重复！');
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
        materialUnitName: [
            checkRequired({ message: '请输入计量单位名称！' }),
            {
                validator: async (_rule: Rule, value: string) => {
                    try {
                        if (typeDialog.value === 1) {
                            if (!value) return Promise.resolve();
                            const info = { materialUnitName: value };
                            const res = await materialUnitApi.checkMaterialUnitName(info);
                            if (!res.data.value) {
                                return Promise.reject(res.errorMessage || '计量单位名称重复！');
                            }
                        }
                        if (typeDialog.value === 2) {
                            if (!value) return Promise.resolve();
                            const info = {
                                materialUnitName: value,
                                materialUnitId: formList.value.materialUnitId
                            };
                            const res = await materialUnitApi.checkMaterialUnitEditName(info);
                            if (!res.data.value) {
                                return Promise.reject(res.errorMessage || '计量单位名称重复！');
                            }
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

    defineExpose({ openAddDialogView });
</script>

<style scoped lang="less">
    .center-box {
        width: 70%;
        margin: 20px auto;
        box-sizing: border-box;
    }

    .footerRight {
        position: absolute;
        bottom: 10px;
        right: 12px;
    }

    .qua-xiang {
        height: 35px;
        padding-left: 28px;
    }

    .qua-xiang1 {
        height: 35px;
        padding-left: 40px;
    }

    .switch-style {
        padding-left: 65px;
    }

    :deep(.ant-col-24) {
        height: 55px;
    }
</style>
