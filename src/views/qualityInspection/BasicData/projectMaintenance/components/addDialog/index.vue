<!-- 新增质检项目维护弹窗 -->
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
                                    label="质检项目编号"
                                    name="qualityInspectionCode"
                                    :rules="[
                                        { required: !(typeDialog == 3), message: '请填写编号！' },
                                        {
                                            validator: validatePassChange,
                                            trigger: 'blur'
                                        }
                                    ]"
                                >
                                    <a-input
                                        :maxlength="30"
                                        v-model:value.trim="formList.qualityInspectionCode"
                                        :disabled="isDisabled"
                                        v-if="isDetails"
                                    />
                                    <span v-if="!isDetails">{{
                                        formList.qualityInspectionCode
                                    }}</span>
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24">
                            <a-col :span="24">
                                <a-form-item
                                    label="质检项目名称"
                                    name="qualityInspectionName"
                                    :rules="[
                                        {
                                            required: !(typeDialog == 3),
                                            message: '请填写项目名称！'
                                        }
                                    ]"
                                >
                                    <a-input
                                        :maxlength="30"
                                        v-model:value.trim="formList.qualityInspectionName"
                                        v-if="isDetails"
                                    />
                                    <span v-if="!isDetails">{{
                                        formList.qualityInspectionName
                                    }}</span>
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24">
                            <a-col :span="24" style="padding-left: 40px">
                                <a-form-item
                                    label="质检标准"
                                    name="qualityInspectionStandard"
                                    :rules="[
                                        {
                                            required: !(typeDialog == 3),
                                            message: '请填写质检标准！'
                                        }
                                    ]"
                                >
                                    <a-input
                                        :maxlength="30"
                                        v-model:value.trim="formList.qualityInspectionStandard"
                                        v-if="isDetails"
                                    />
                                    <span v-if="!isDetails">{{
                                        formList.qualityInspectionStandard
                                    }}</span>
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24" :class="typeDialog == 3 ? 'qua-xiang' : 'qua-xiang1'">
                            <a-col>
                                <a-form-item
                                    label="质检属性"
                                    :rules="[{ required: false }]"
                                    name="qualityInspectionAttribute"
                                >
                                    <a-radio-group
                                        v-model:value="formList.qualityInspectionAttribute"
                                    >
                                        <a-radio :value="1" v-if="isShowLab.includes(1)"
                                            >逻辑</a-radio
                                        >
                                        <a-radio :value="2" v-if="isShowLab.includes(2)"
                                            >数值</a-radio
                                        >
                                        <a-radio :value="3" v-if="isShowLab.includes(3)">
                                            文本</a-radio
                                        >
                                    </a-radio-group>
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <a-row
                            :gutter="24"
                            style="margin-left: 55px; margin-top: 10px"
                            v-if="isShow"
                        >
                            <a-col :span="8">
                                <a-form-item
                                    label="上限"
                                    name="upperlimitValue"
                                    :rules="[
                                        {
                                            validator: validatePassMax,
                                            trigger: 'change'
                                        }
                                    ]"
                                >
                                    <a-input-number
                                        :controls="false"
                                        :maxlength="30"
                                        v-model:value.trim="formList.upperlimitValue"
                                        v-if="isDetails"
                                        style="width: 70px"
                                    />
                                    <span v-if="!isDetails">{{ formList.upperlimitValue }}</span>
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item
                                    label="标准"
                                    name="standardValue"
                                    :rules="[{ required: !(typeDialog == 3), message: '必填!' }]"
                                >
                                    <a-input-number
                                        :controls="false"
                                        :maxlength="30"
                                        v-model:value.trim="formList.standardValue"
                                        v-if="isDetails"
                                        style="width: 65px"
                                    />
                                    <span v-if="!isDetails">{{ formList.standardValue }}</span>
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item
                                    label="下限"
                                    name="lowerlimitValue"
                                    :rules="[
                                        {
                                            validator: validatePassLess,
                                            trigger: 'change'
                                        }
                                    ]"
                                >
                                    <a-input-number
                                        :controls="false"
                                        :maxlength="30"
                                        v-model:value.trim="formList.lowerlimitValue"
                                        v-if="isDetails"
                                        style="width: 70px"
                                    />
                                    <span v-if="!isDetails">{{ formList.lowerlimitValue }}</span>
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
    const qualityApi = useQualityApi();
    const isShow = ref<boolean>(false);
    const isDisabled = ref<boolean>(false);
    const isDetails = ref<boolean>(true);
    const isShowLab = ref([1, 2, 3]);
    const [visible, setVisible] = useRef(false);
    const emit = defineEmits(['ongetDataList']);
    const title = ref(['质检项目标题', '新增质检项目', '编辑质检项目', '质检项目详情']);
    const typeDialog = ref<number>(1);

    const formList = ref({
        qualityInspectionName: '',
        qualityInspectionCode: '',
        qualityInspectionStandard: '',
        qualityInspectionAttribute: 1,
        upperlimitValue: '',
        standardValue: '',
        lowerlimitValue: '',
        qualityInspectionId: ''
    });

    const openAddDialogView = (num: number, data: any) => {
        typeDialog.value = num;
        setVisible(!visible.value);
        if (typeDialog.value === 2) {
            isDisabled.value = true;
            formList.value = data;
            formList.value.qualityInspectionAttribute = Number(data.qualityInspectionAttribute);
        } else if (typeDialog.value === 3) {
            isDetails.value = false;
            formList.value = data;
            formList.value.qualityInspectionAttribute = Number(data.qualityInspectionAttribute);
            isShowLab.value = [Number(data.qualityInspectionAttribute)];
        }
    };

    watch(
        () => formList.value.qualityInspectionAttribute,
        (newValue: number, oldValue: number) => {
            if (newValue === 2) {
                isShow.value = true;
            } else {
                isShow.value = false;
            }
        }
    );

    watch(
        //初始化
        () => visible.value,
        (newValue: boolean, oldValue: boolean) => {
            if (!newValue) {
                isDisabled.value = false;
                formList.value = {
                    qualityInspectionName: '',
                    qualityInspectionCode: '',
                    qualityInspectionStandard: '',
                    qualityInspectionAttribute: 1,
                    upperlimitValue: '',
                    standardValue: '',
                    lowerlimitValue: '',
                    qualityInspectionId: ''
                };
                isDetails.value = true;
                isShowLab.value = [1, 2, 3];
            }
        }
    );

    const onFinish = async (values: any) => {
        console.log('Success:', values); //收集到的数据
        let res: any = [];
        if (typeDialog.value === 1) {
            res = await qualityApi.createQualityInspection(values);
        }
        if (typeDialog.value === 2) {
            //还要额外传id
            values.qualityInspectionId = formList.value.qualityInspectionId;
            res = await qualityApi.updateQualityInspection(values);
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

    const validatePassMax = async (_rule: Rule, value: any) => {
        if (
            value < Number(formList.value.standardValue) &&
            ![null, undefined, ''].includes(value)
        ) {
            return Promise.reject('需大于标准！');
        }
        if (value == Number(formList.value.standardValue)) {
            return Promise.reject('需要大于标准');
        }
    };

    const validatePassLess = async (_rule: Rule, value: any) => {
        if (value > Number(formList.value.standardValue)) {
            return Promise.reject('需小于标准！');
        }
        if (value == Number(formList.value.standardValue)) {
            return Promise.reject('需要小于标准');
        }
    };

    const validatePassChange = async (_rule: Rule, value: any) => {
        try {
            if (typeDialog.value == 1) {
                console.log(value);
                if (!value) return Promise.resolve();
                if (/[\u4e00-\u9fa5]/.test(value)) {
                    return Promise.reject('只允许数字字母组合!');
                }
                const info = { qualityInspectionCode: value };
                const res = await qualityApi.checkQualityInspectionCodeUnique(info);
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
