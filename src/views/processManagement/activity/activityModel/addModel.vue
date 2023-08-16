<template>
    <div>
        <TpfModal v-model:visible="visible" :title="props.type" height="300px" width="800px">
            <a-form
                ref="formRef"
                class="locationSettingModel"
                layout="inline"
                :model="formState"
                :rules="rules"
            >
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-item label="作业单元编号" name="workUnitCode">
                            <span v-if="isDetail">{{ formState.workUnitCode }} </span>
                            <a-input
                                v-else
                                :disabled="isEdit || isDetail"
                                v-model:value="formState.workUnitCode"
                                :maxlength="11"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="作业单元名称" name="workUnitName">
                            <span v-if="isDetail">{{ formState.workUnitName }} </span>
                            <a-input
                                v-else
                                :disabled="isDetail"
                                v-model:value="formState.workUnitName"
                            />
                        </a-form-item>
                    </a-col>

                    <a-col :span="12">
                        <a-form-item name="workshopId" label="所属车间">
                            <span v-if="isDetail">
                                {{
                                    getLabel(formState.workshopId, workshopIdOption, {
                                        label: 'workshopName',
                                        value: 'workshopId'
                                    })
                                }}
                            </span>

                            <a-select
                                v-else
                                :disabled="isDetail"
                                v-model:value="formState.workshopId"
                                :field-names="{
                                    label: 'workshopName',
                                    value: 'workshopId'
                                }"
                                :options="workshopIdOption"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="标准工时" name="standardHours">
                            <span v-if="isDetail">{{ formState.standardHours }} </span>

                            <a-input-number
                                v-else
                                :controls="false"
                                v-model:value="formState.standardHours"
                                :min="1"
                                :disabled="isDetail"
                            >
                                <template #addonAfter>
                                    <a-select
                                        :disabled="isDetail"
                                        v-model:value="formState.timeUnit"
                                        style="width: 80px"
                                        :options="timeUnitOption"
                                    />
                                </template>
                            </a-input-number>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="标准产能" name="standardCapacity">
                            <span v-if="isDetail">{{ formState.standardCapacity }} </span>

                            <a-input
                                v-else
                                :disabled="isDetail"
                                :maxlength="20"
                                v-model:value.trim="formState.standardCapacity"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="作业单元类型">
                            <span v-if="isDetail">{{ formState.workUnitTypeName }} </span>

                            <a-input-search
                                v-else
                                :disabled="isDetail"
                                v-model:value="formState.workUnitTypeName"
                                @search="openPositionModel"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="备注">
                            <span v-if="isDetail">{{ formState.remark }} </span>

                            <a-textarea
                                v-else
                                :disabled="isDetail"
                                :maxlength="200"
                                v-model:value.trim="formState.remark"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="启用">
                            <a-switch
                                :disabled="isDetail"
                                checkedValue="1"
                                unCheckedValue="0"
                                v-model:checked="formState.status"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
            <template #footerRight>
                <a-button class="tpf-button" @click="visible = false">{{
                    isDetail ? '关闭' : '取消'
                }}</a-button>
                <a-button
                    v-if="props.type !== '作业单元详情'"
                    class="tpf-button"
                    type="primary"
                    @click="onSave"
                    >保存</a-button
                >
            </template>
        </TpfModal>
        <WorkModel @get-data="getData" ref="workModel" />
    </div>
</template>

<script setup lang="ts" name="AddModel">
    import TpfModal from '@/components/TpfModal/index.vue';
    import type { FormInstance } from 'ant-design-vue';
    import { message } from 'ant-design-vue';
    import { ref, defineAsyncComponent, onMounted, computed } from 'vue';
    import { useRef, useOpenAntdModal } from '@/hooks';
    import { useWorkingProcedure } from '@/api';
    import { Rule } from 'ant-design-vue/es/form';
    import { getTpfOptionEnum } from '@/config';
    import { checkRequired, checkSpecial, checkNumLetter } from '@/formRuleConfig/Tpfrules';
    import type { TpfValidateRule } from '@/types';

    const WorkModel = defineAsyncComponent(() => import('./work.vue'));

    const { getLabel, timeUnitOption } = getTpfOptionEnum();

    const workingProcedure = useWorkingProcedure();
    const [workModel, openWorkModel] = useOpenAntdModal();
    const emit = defineEmits(['uploadTable']);
    const isDetail = ref(false);
    const [visible, setVisible] = useRef(false);
    const workshopIdOption = ref([]);
    type Props = {
        type?: string;
        isEdit?: boolean;
        workUnitId?: string | number;
    };

    const props = withDefaults(defineProps<Props>(), {
        type: '',
        isEdit: false,
        workUnitId: ''
    });

    interface FormState {
        workUnitId: string;
        workUnitTypeId: string;
        workUnitTypeName: string;
        workUnitCode: string;
        workUnitName: string;
        workshopId: string;
        standardCapacity: string;
        standardHours: string;
        timeUnit: string;
        remark: string;
        status: string;
    }
    const formRef = ref<FormInstance>() as any;
    const formState = ref<FormState>({
        workUnitId: '',
        workUnitTypeId: '',
        workUnitTypeName: '',
        workUnitCode: '',
        workUnitName: '',
        workshopId: '',
        standardCapacity: '1',
        standardHours: '',
        timeUnit: 'MINUTE',
        remark: '',
        status: '1'
    });
    const open = async (val: string) => {
        const res = await workingProcedure.getWorkshopList();
        workshopIdOption.value = res.data.list;
        if (val === 'add') {
            isDetail.value = false;
            formState.value = {
                workUnitId: '',
                workUnitTypeId: '',
                workUnitTypeName: '',
                workUnitCode: '',
                workUnitName: '',
                workshopId: '',
                standardCapacity: '1',
                standardHours: '',
                timeUnit: 'MINUTE',
                remark: '',
                status: '1'
            };
        } else {
            const res = await workingProcedure.getWorkUnitById({
                workUnitId: props.workUnitId
            });
            formState.value = {
                ...res.data.object
            };
            if (val === 'edit') {
                isDetail.value = false;
            } else if (val === 'detail') {
                isDetail.value = true;
            }
        }

        setVisible(true);
    };
    const rules = computed(() => {
        return {
            standardCapacity: [
                checkRequired({
                    message: '请选择标准产能',
                    required: props.type !== '作业单元详情'
                })
            ],
            workUnitName: [
                checkRequired({
                    message: '请输入作业单元名称',
                    required: props.type !== '作业单元详情'
                })
            ],
            workshopId: [
                checkRequired({
                    message: '请选择所属车间',
                    required: props.type !== '作业单元详情'
                })
            ],
            workUnitCode: [
                checkRequired({
                    message: '请输入作业编号',
                    required: props.type !== '作业单元详情'
                }),
                checkSpecial(),
                checkNumLetter(),
                {
                    validator: async (_rule: Rule, value: string) => {
                        try {
                            if (props.isEdit === false) {
                                const res = await workingProcedure.checkWorkUnitCode({
                                    workUnitCode: formState.value.workUnitCode
                                });
                                if (!res.data.value) {
                                    return Promise.reject(res.errorMessage || '作业单元编号重复');
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
    });

    const openPositionModel = () => {
        openWorkModel();
    };

    const onSave = async () => {
        try {
            if (!isDetail.value) {
                await formRef.value.validateFields();
                if (!props.isEdit) {
                    await workingProcedure.addWorkUnit({ ...formState.value });
                } else {
                    await workingProcedure.editWorkUnit({ ...formState.value });
                }
                message.success(props.isEdit ? '编辑成功' : '新增成功');
                emit('uploadTable');
                setVisible(!visible.value);
            } else {
                setVisible(!visible.value);
            }
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    const getData = (val: any) => {
        formState.value.workUnitTypeId = val.workUnitTypeId;
        formState.value.workUnitTypeName = val.workUnitTypeName;
    };

    onMounted(async () => {});
    defineExpose({ open });
</script>

<style scoped lang="less">
    .locationSettingModel {
        :deep(.ant-form-item-label) {
            width: 110px !important;
        }

        :deep(.ant-row) {
            margin-right: 0 !important;
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
        }
    }
</style>
