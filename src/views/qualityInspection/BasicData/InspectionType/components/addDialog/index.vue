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
                    @finishFailed="onFinishFailed"
                >
                    <div class="center-box">
                        <a-row :gutter="24">
                            <a-col :span="24">
                                <a-form-item
                                    label="检验类型编号"
                                    name="inspectionTypeCode"
                                    :rules="[
                                        {
                                            required: !(typeDialog == 3),
                                            message: '请填写类型编号！'
                                        },
                                        {
                                            validator: validatePassChange,
                                            trigger: 'blur'
                                        }
                                    ]"
                                >
                                    <a-input
                                        :maxlength="30"
                                        v-model:value.trim="formList.inspectionTypeCode"
                                        :disabled="isDisabled"
                                        v-if="isDetails"
                                    />
                                    <span v-if="!isDetails">{{ formList.inspectionTypeCode }}</span>
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24">
                            <a-col :span="24">
                                <a-form-item
                                    label="检验类型名称"
                                    name="inspectionTypeName"
                                    :rules="[
                                        {
                                            required: !(typeDialog == 3),
                                            message: '请填写类型名称！'
                                        }
                                    ]"
                                >
                                    <a-input
                                        :maxlength="30"
                                        v-model:value.trim="formList.inspectionTypeName"
                                        v-if="isDetails"
                                    />
                                    <span v-if="!isDetails">{{ formList.inspectionTypeName }}</span>
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24" :class="typeDialog == 3 ? 'qua-xiang' : 'qua-xiang1'">
                            <a-col>
                                <a-form-item
                                    label="检验方法"
                                    :rules="[{ required: false }]"
                                    name="inspectionMethod"
                                >
                                    <a-radio-group v-model:value="formList.inspectionMethod">
                                        <a-radio :value="1">全检</a-radio>
                                    </a-radio-group>
                                    <!-- <span v-if="!isDetails">{{ formList.inspectionMethod }}</span> -->
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </div>
                    <div class="footerRight">
                        <a-space>
                            <a-button class="tpf-button" @click="visible = false" v-if="!isDetails"
                                >关闭</a-button
                            >
                            <a-button class="tpf-button" @click="visible = false" v-else
                                >取消</a-button
                            >
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
    import type { Rule } from 'ant-design-vue/es/form';
    import { useRef } from '@/hooks';
    import { ref, watch } from 'vue';
    import { useQualityApi } from '@/api';
    import console from 'console';
    const qualityApi = useQualityApi();
    const isShow = ref<boolean>(false);
    const isDisabled = ref<boolean>(false);
    const isDetails = ref<boolean>(true);
    const [visible, setVisible] = useRef(false);
    const emit = defineEmits(['ongetDataList']);
    const title = ref(['质检项目标题', '新增质检项目', '编辑质检项目', '质检项目详情']);
    const typeDialog = ref<number>(1);
    const formList = ref({
        inspectionTypeName: '',
        inspectionTypeCode: '',
        inspectionMethod: 1,
        standardValue: '',
        samplingProportion: '',
        inspectionTypeId: ''
    });

    const openAddDialogView = (num: number, data: any) => {
        typeDialog.value = num;
        setVisible(!visible.value);
        if (typeDialog.value === 1) return;
        data.inspectionMethod = Number(data.inspectionMethod);
        if (typeDialog.value === 2) {
            isDisabled.value = true;
            formList.value = data;
        } else if (typeDialog.value === 3) {
            isDetails.value = false;
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
                    inspectionTypeName: '',
                    inspectionTypeCode: '',
                    inspectionMethod: 1,
                    standardValue: '',
                    samplingProportion: '',
                    inspectionTypeId: ''
                };
                isDetails.value = true;
            }
        }
    );

    const onFinish = async (values: any) => {
        console.log('Success:', values); //收集到的数据
        let res: any = [];
        if (typeDialog.value === 1) {
            res = await qualityApi.createQualityInspectionType(values);
        }
        if (typeDialog.value === 2) {
            //还要额外传id
            values.inspectionTypeId = formList.value.inspectionTypeId;
            res = await qualityApi.updateQualityInspectionType(values);
        }
        if (res.success == true) {
            emit('ongetDataList'); //刷新数据
            message.success('保存成功');
        }
        setVisible(!visible.value);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
        return;
    };

    const validatePassChange = async (_rule: Rule, value: any) => {
        try {
            if (typeDialog.value == 1) {
                console.log(value);
                if (!value) return;
                if (/[\u4e00-\u9fa5]/.test(value)) {
                    return Promise.reject('只允许数字字母组合!');
                }
                const info = { inspectionTypeCode: value };
                const res = await qualityApi.checkQualityInspectionTypeCodeUnique(info);
                if (res.data.value == false) {
                    return Promise.reject('检验类型编号重复！');
                }
            }
        } catch (error) {
            console.log('error: ', error);
        }
    };

    defineExpose({ openAddDialogView });
</script>

<style scoped lang="less">
    .center-box {
        width: 70%;
        margin: 20px auto;
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

    :deep(.ant-col-24) {
        height: 55px;
    }
</style>
