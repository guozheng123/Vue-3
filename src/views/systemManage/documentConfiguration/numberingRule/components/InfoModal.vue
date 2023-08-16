<template>
    <TpfModal
        class="InfoModal"
        v-model:visible="visible"
        height="450px"
        width="600px"
        :title="title"
    >
        <div class="modalBox">
            <a-form
                ref="formRef"
                :model="formState"
                :label-col="{ span: 7 }"
                :wrapper-col="{ span: 13 }"
                :rules="rules"
            >
                <a-form-item name="numberRuleCode" label="编号规则代码">
                    <a-input :disabled="true" v-model:value.trim="formState.numberRuleCode" />
                </a-form-item>
                <a-form-item name="formName" label="目标表单名称">
                    <a-input :disabled="true" v-model:value.trim="formState.formName" />
                </a-form-item>
                <a-form-item name="prefix" label="编号前缀">
                    <a-input
                        v-model:value.trim="formState.prefix"
                        :disabled="fromDetail.oldNumber > 0"
                        @change="prefixChange"
                    />
                </a-form-item>
                <a-form-item name="submitTime" label="提交时间">
                    <a-radio-group
                        v-model:value="formState.submitTime"
                        :options="plainOptions"
                        @change="submitTimeChange"
                        :disabled="fromDetail.oldNumber > 0"
                    />
                </a-form-item>
                <a-form-item name="num" label="流水号">
                    <a-input-number
                        v-model:value="formState.num"
                        @change="numChange"
                        :min="fromDetail.oldNumber > 0 ? formState.num : 1"
                        :max="8"
                        :precision="0"
                        :step="1"
                        style="width: 100%"
                    />
                </a-form-item>
                <a-form-item name="remarks" label="备注">
                    <a-textarea :rows="1" v-model:value="formState.remarks" />
                </a-form-item>

                <a-form-item name="formNumberRule" label="目标表单编号生成规则">
                    <a-input v-model:value="formState.formNumberRule" :disabled="true" />
                </a-form-item>
                <a-form-item class="dis" label="123">
                    <div class="numPreview">
                        编号预览
                        <span>{{ formState.prefix }}{{ submitTimeNum }}{{ numNum }}</span></div
                    >
                </a-form-item>
            </a-form>
        </div>
        <template #footerRight>
            <a-button class="tpf-button" @click="setVisible(false)">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="onSave">保存</a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="ts" name="InfoModal">
    import { ref } from 'vue';
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useRef, useAntdForm } from '@/hooks';
    import { checkRequired, checkMaxLength, checkLetter } from '@/formRuleConfig/Tpfrules';
    import type { TpfValidateRule } from '@/types';

    import dayjs from 'dayjs';
    const { formRef, submitForm } = useAntdForm();
    const [visible, setVisible] = useRef(false);
    const emits = defineEmits(['submitUpdata']);
    const title = ref('新增');
    const formState = ref();
    const initObj = () => {
        return {
            numberRuleCode: '',
            formName: '',
            prefix: '',
            submitTime: '',
            num: 4,
            remarks: '',
            formNumberRule: ''
        };
    };
    const plainOptions = ['年', '年月', '年月日'];
    const submitTimeNum = ref();
    const numNum = ref();
    const fromDetail = ref();
    const rules = {
        prefix: [checkRequired(), checkLetter(), checkMaxLength(5)],
        submitTime: [checkRequired()],
        num: [checkRequired()]
    } as TpfValidateRule;

    const open = (t: string, v: any) => {
        setVisible(!visible.value);
        if (t === 'update') {
            title.value = '编辑';
            formState.value = initObj();
            formState.value = { ...v };
            fromDetail.value = { ...v };
            submitTimeNum.value =
                v.submitTime === '年'
                    ? dayjs(new Date()).format('YYYY')
                    : v.submitTime === '年月'
                    ? dayjs(new Date()).format('YYYYMM')
                    : dayjs(new Date()).format('YYYYMMDD');
            numNum.value = ('00000000' + 1).slice(-v.num);
            console.log(formState.value);
        }
    };
    const onSave = async () => {
        const res = await submitForm();
        if (res) {
            if (title.value === '编辑') {
                res.id = fromDetail.value.id;
                emits('submitUpdata', res);
            }
        }
    };
    // 编号前缀处理
    const prefixChange = (v: any) => {
        formState.value.formNumberRule =
            v.target.value +
            '+' +
            formState.value.submitTime +
            '+(' +
            ('00000000' + 1).slice(-formState.value.num) +
            '-' +
            '99999999'.slice(-formState.value.num) +
            ')';
    };
    // 年月日处理
    const submitTimeChange = (v: any) => {
        submitTimeNum.value =
            v.target.value === '年'
                ? dayjs(new Date()).format('YYYY')
                : v.target.value === '年月'
                ? dayjs(new Date()).format('YYYYMM')
                : dayjs(new Date()).format('YYYYMMDD');
        formState.value.formNumberRule =
            formState.value.prefix +
            '+' +
            v.target.value +
            '+(' +
            ('00000000' + 1).slice(-formState.value.num) +
            '-' +
            '99999999'.slice(-formState.value.num) +
            ')';
    };
    // 流水号处理
    const numChange = (v: any) => {
        numNum.value = ('00000000' + 1).slice(-v);
        formState.value.formNumberRule =
            formState.value.prefix +
            '+' +
            formState.value.submitTime +
            '+(' +
            numNum.value +
            '-' +
            '99999999'.slice(-v) +
            ')';
    };
    defineExpose({
        open
    });
</script>

<style scoped lang="less">
    .InfoModal {
        .ant-modal-body {
            padding-top: 24px !important;

            .modalBox {
                :deep(.dis) {
                    .ant-form-item-label {
                        visibility: hidden;
                    }

                    span {
                        margin-left: 10px;
                    }
                }
            }
        }

        .numPreview {
            background-color: #f2f2f2;
            width: 100%;
            height: 50px;
            line-height: 50px;
            // text-align: center;
            padding-left: 12px;
        }
    }
</style>
