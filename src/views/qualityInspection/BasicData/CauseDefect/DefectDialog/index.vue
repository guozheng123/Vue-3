<template>
    <TpfModal v-model:visible="visible" :title="props.type" height="360px" width="600px">
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
                    <a-form-item label="缺陷原因编号" name="defectCauseCode">
                        <a-input
                            v-if="!(isEdit === 3)"
                            :maxlength="12"
                            :disabled="props.isEdit === 1"
                            v-model:value.trim="formState.defectCauseCode"
                        />
                        <span v-else>{{ formState.defectCauseCode }}</span>
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter="24">
                <a-col :span="24">
                    <a-form-item label="缺陷原因名称" name="defectCauseName">
                        <a-input
                            v-if="!(isEdit === 3)"
                            :maxlength="32"
                            v-model:value.trim="formState.defectCauseName"
                        />
                        <span v-else>{{ formState.defectCauseName }}</span>
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter="24">
                <a-col :span="24">
                    <a-form-item label="缺陷类型编号" name="defectCauseClassifyCode">
                        <a-input-group compact>
                            <a-input
                                readonly
                                v-if="!(isEdit === 3)"
                                :maxlength="32"
                                v-model:value.trim="formState.defectCauseClassifyCode"
                                style="width: calc(100% - 33px)"
                            />
                            <a-button class="btn" @click="addItem" v-if="!(isEdit === 3)"
                                ><SvgIcon type="icon-sousuo" :size="20"
                            /></a-button>
                        </a-input-group>
                        <span v-if="isEdit === 3">{{ formState.defectCauseClassifyCode }}</span>
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter="24">
                <a-col :span="24">
                    <a-form-item label="缺陷类型名称" name="defectCauseClassifyName">
                        <a-input
                            :disabled="true"
                            v-if="!(isEdit === 3)"
                            :maxlength="12"
                            v-model:value.trim="formState.defectCauseClassifyName"
                        />
                        <span v-else>{{ formState.defectCauseName }}</span>
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter="24">
                <a-col :span="24">
                    <a-form-item label="QC阶段" name="defectCauseClassifyName">
                        <a-checkbox-group
                            :disabled="isEdit == 3"
                            v-model:value="formState.value2"
                            :options="plainOptions"
                        />
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
            >
                保存
            </a-button>
        </template>
    </TpfModal>
    <filterDialog ref="dialog" @clickFu="receive" />
</template>

<script setup lang="ts" name="MoveTypeModel">
    import { defineAsyncComponent } from 'vue';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import TpfModal from '@/components/TpfModal/index.vue';
    import { FormInstance, message } from 'ant-design-vue';
    import { ref, watch, computed } from 'vue';
    import { useRef } from '@/hooks';
    import { Rule } from 'ant-design-vue/es/form';
    import { checkRequired, checkSpecial, checkNumLetter } from '@/formRuleConfig/Tpfrules';
    import type { TpfValidateRule } from '@/types';

    import { useQualityApi } from '@/api';

    const filterDialog = defineAsyncComponent(() => import('../filterDialog/index.vue'));
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
    const plainOptions = [
        { label: 'IQC', value: 'iqcFlag' },
        { label: 'IPQC', value: 'ipqcFlag' },
        { label: 'FQC', value: 'fqcFlag' },
        { label: 'OQC', value: 'oqcFlag' }
    ];
    interface FormState {
        defectCauseCode: string;
        defectCauseName: string;
        defectCauseClassifyCode: string;
        defectCauseClassifyName: string;
        postId?: string;
        value2?: any;
        defectCauseClassifyId?: any;
        iqcFlag: any;
        ipqcFlag: any;
        fqcFlag: any;
        oqcFlag: any;
    }
    const formRef = ref<FormInstance>() as any;
    const formState = ref<FormState>({
        defectCauseCode: '',
        defectCauseName: '',
        defectCauseClassifyCode: '',
        defectCauseClassifyName: '',
        defectCauseClassifyId: '',
        iqcFlag: 0,
        ipqcFlag: 0,
        fqcFlag: 0,
        oqcFlag: 0,
        value2: []
    });
    const rules = computed(
        () =>
            ({
                defectCauseCode: [
                    checkRequired({
                        message: '请输入缺陷原因编号！',
                        required: props.isEdit !== 3
                    }),
                    checkSpecial(),
                    checkNumLetter(),
                    {
                        validator: async (_rule: Rule, value: string) => {
                            try {
                                if (props.isEdit === 0) {
                                    const res = await qualityApi.checkDefectCauseCode({
                                        defectCauseCode: value
                                    });
                                    if (!res.data.value) {
                                        return Promise.reject(
                                            res.errorMessage || '缺陷原因编号重复'
                                        );
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
                defectCauseName: [
                    checkRequired({ message: '请输入缺陷原因名称！', required: props.isEdit !== 3 })
                ]
            } as TpfValidateRule)
    );
    watch(
        () => props.editData,
        val => {
            if (JSON.stringify(val) === '{}') {
                formState.value = {
                    defectCauseCode: '',
                    defectCauseName: '',
                    defectCauseClassifyCode: '',
                    defectCauseClassifyName: '',
                    defectCauseClassifyId: '',
                    iqcFlag: 0,
                    ipqcFlag: 0,
                    fqcFlag: 0,
                    oqcFlag: 0,
                    value2: []
                };
            } else {
                //拿多选框的默认值
                const value2: any = [];
                for (const item in val) {
                    if (['iqcFlag', 'ipqcFlag', 'fqcFlag', 'oqcFlag'].includes(item)) {
                        if (val[item] === '1') {
                            value2.push(item);
                        }
                    }
                }
                val.value2 = value2;
                formState.value = val;
            }
        }
    );
    const dialog = ref<null | HTMLElement | any>(null);
    const addItem = () => {
        dialog.value.open();
    };
    const receive = (info: any, index: any) => {
        formState.value.defectCauseClassifyCode = info.code;
        formState.value.defectCauseClassifyName = info.name;
        formState.value.defectCauseClassifyId = index;
    };
    const handleFinish = () => {};

    const submitBinSettingsModel = async () => {
        console.log(formRef.value);
        try {
            await formRef.value.validateFields();
            let res: any = {};
            [
                formState.value.iqcFlag,
                formState.value.fqcFlag,
                formState.value.oqcFlag,
                formState.value.ipqcFlag
            ] = [0, 0, 0, 0];
            if (formState.value.value2) {
                formState.value.value2.map((item: any) => {
                    formState.value[item] = 1;
                });
            }
            if (props.isEdit === 0) {
                res = await qualityApi.addDefectCause({ ...formState.value });
            } else {
                res = await qualityApi.editDefectCause({ ...formState.value });
            }
            if (res.data.value === true) {
                message.success(props.isEdit == 1 ? '编辑成功' : '新增成功');
                emit('uploadTable');
            } else {
                message.error(props.isEdit == 1 ? '编辑失败' : '编辑失败');
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

        .btn {
            width: 33px;
            background: #f7f8fa;
            text-align: center;
            padding: 0 !important;
            border-radius: 0 3px 3px 0;
        }
    }
</style>
