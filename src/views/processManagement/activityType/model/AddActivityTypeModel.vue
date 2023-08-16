<template>
    <TpfModal v-model:visible="visible" :title="props.title" height="300px" width="800px">
        <a-form
            ref="formRef"
            class="tpf-form"
            layout="inline"
            :model="formState"
            @finish="handleFinish"
            :rules="rules"
            :colProps="{ span: 6 }"
            :labelCol="{ style: { width: '150px' } }"
        >
            <a-row class="t-w-[100%]">
                <a-col :span="12">
                    <a-form-item label="作业单元类型编号" name="workUnitTypeCode">
                        <a-input
                            :disabled="type === 'edit'"
                            :maxlength="11"
                            v-model:value.trim="formState.workUnitTypeCode"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="作业单元类型名称" name="workUnitTypeName">
                        <a-input :maxlength="50" v-model:value.trim="formState.workUnitTypeName" />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="所属工厂" name="factoryId">
                        <a-select
                            v-model:value="formState.factoryId"
                            :field-names="{
                                label: 'factoryName',
                                value: 'factoryId'
                            }"
                            :options="factoryIdOption"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="启用">
                        <a-switch
                            checkedValue="1"
                            unCheckedValue="0"
                            :disabled="type === 'edit'"
                            v-model:checked="formState.status"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="备注" name="remark">
                        <a-textarea :maxlength="200" v-model:value.trim="formState.remark" />
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

<script setup lang="ts" name="AddActivityTypeModel">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { FormInstance, message } from 'ant-design-vue';
    import { ref, computed } from 'vue';
    import { useRef } from '@/hooks';
    import { Rule } from 'ant-design-vue/es/form';
    import { useWorkingProcedure } from '@/api';
    import { checkRequired, checkSpecial, checkNumLetter } from '@/formRuleConfig/Tpfrules';
    import type { TpfValidateRule } from '@/types';
    const factoryIdOption = ref([]);

    const emit = defineEmits(['uploadTable']);
    const [visible, setVisible] = useRef(false);
    const workingProcedure = useWorkingProcedure();

    type Props = {
        type: string;
        title: string;
    };

    const props = withDefaults(defineProps<Props>(), {
        type: '',
        title: ''
    });

    const workUnitTypeId = ref('');
    const open = async (data: any) => {
        if (data.type === 'add') {
            formState.value = {
                workUnitTypeCode: '',
                factoryId: '',
                workUnitTypeName: '',
                remark: '',
                status: '1'
            };
        } else {
            workUnitTypeId.value = data.workUnitTypeId;
            const params = {
                workUnitTypeId: workUnitTypeId.value
            };
            console.log(params);

            const res = await workingProcedure.getWorkUnitTypeById(params);
            formState.value = {
                ...res.data.object
            };
        }
        const res = await workingProcedure.getFactoryList();
        factoryIdOption.value = res.data.list;
        setVisible(!visible.value);
    };

    const rules = computed(() => {
        return {
            workUnitTypeCode: [
                {
                    validator: async (_rule: Rule, value: string) => {
                        if (value && props.type === 'add') {
                            const res = await workingProcedure.checkWorkUnitTypeCode({
                                workUnitTypeCode: value
                            });

                            if (!res.data.value) {
                                return Promise.reject(
                                    res.errorMessage === ''
                                        ? '作业单元类型编号重复'
                                        : res.errorMessage
                                );
                            }

                            return Promise.resolve();
                        }
                    },
                    trigger: ['blur']
                },
                checkRequired({
                    message: '请输入作业单元类型编号'
                }),
                checkSpecial(),
                checkNumLetter()
            ],

            factoryId: [
                checkRequired({
                    message: '请选择所属工厂'
                })
            ],
            workUnitTypeName: [
                checkRequired({
                    message: '请输入作业单元类型名称'
                })
            ]
        } as TpfValidateRule;
    });
    interface FormState {
        workUnitTypeCode: string;
        factoryId: string;
        workUnitTypeName: string;
        remark: string;
        status: string;
    }
    const formRef = ref<FormInstance>() as any;
    const formState = ref<FormState>({
        workUnitTypeCode: '',
        factoryId: '',
        workUnitTypeName: '',
        remark: '',
        status: '1'
    });

    const handleFinish = () => {};
    const submitBinSettingsModel = async () => {
        if (props.type === 'add') {
            await workingProcedure.addWorkUnitType({ ...formState.value });
            message.success('新增成功');
        } else {
            const params = {
                ...formState.value,
                workUnitTypeId: workUnitTypeId.value
            };
            await workingProcedure.editWorkUnitType(params);
            message.success('编辑成功');
        }
        emit('uploadTable');
        setVisible(!visible.value);
    };

    defineExpose({ open });
</script>
