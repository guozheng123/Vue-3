<template>
    <TpfModal v-model:visible="visible" :title="props.type" height="400px" width="650px">
        <a-form
            ref="formRef"
            :model="formState"
            :rules="rules"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 12 }"
        >
            <a-form-item label="模板编号" name="templateCode">
                <span v-if="isDetail">{{ formState.templateCode }} </span>
                <a-input
                    v-else
                    :disabled="isEdit || isDetail"
                    v-model:value="formState.templateCode"
                    :maxlength="11"
                />
            </a-form-item>

            <a-form-item label="模板标题" name="templateTitle">
                <span v-if="isDetail">{{ formState.templateTitle }} </span>
                <a-input v-else v-model:value="formState.templateTitle" />
            </a-form-item>

            <a-form-item name="languageCode" label="语言">
                <span v-if="isDetail">
                    {{
                        getLabel(formState.languageCode, MessageLanguage, {
                            label: 'workshopName',
                            value: 'workshopId'
                        })
                    }}
                </span>

                <a-select
                    v-else
                    :disabled="isEdit"
                    v-model:value="formState.languageCode"
                    :options="MessageLanguage"
                />
            </a-form-item>
            <a-form-item name="objectCode" label="对象">
                <span v-if="isDetail">
                    {{
                        getLabel(formState.objectCode, MessageLanguage, {
                            label: 'workshopName',
                            value: 'workshopId'
                        })
                    }}
                </span>

                <a-select
                    v-else
                    :disabled="isEdit"
                    v-model:value="formState.objectCode"
                    :options="materialMoldList"
                    :fieldNames="{ label: 'dictLabel', value: 'dictValue' }"
                    @Change="onGetStoreLocationList"
                />
            </a-form-item>
            <a-form-item label="变量" name="variable" v-if="props.type === '新增消息模板'">
                <a-textarea :maxlength="200" disabled v-model:value.trim="formState.variable" />
            </a-form-item>

            <a-form-item label="消息模板内容" name="templateInfo">
                <span v-if="isDetail">{{ formState.templateInfo }} </span>

                <a-textarea v-else :maxlength="200" v-model:value.trim="formState.templateInfo" />
            </a-form-item>

            <a-form-item label="启用">
                <a-switch
                    :disabled="isDetail"
                    checkedValue="1"
                    unCheckedValue="0"
                    v-model:checked="formState.enable"
                />
            </a-form-item>
        </a-form>
        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">{{
                isDetail ? '关闭' : '取消'
            }}</a-button>
            <a-button
                v-if="props.type !== '消息模板详情'"
                class="tpf-button"
                type="primary"
                @click="onSave"
                >保存</a-button
            >
        </template>
    </TpfModal>
</template>

<script setup lang="ts" name="AddModel">
    import TpfModal from '@/components/TpfModal/index.vue';
    import type { FormInstance } from 'ant-design-vue';
    import { message } from 'ant-design-vue';
    import { ref, computed } from 'vue';
    import { useRef } from '@/hooks';
    import { useWorkingProcedure, useSysPageFieldDiyApi, useMessageApi } from '@/api';
    import { Rule } from 'ant-design-vue/es/form';
    import { getTpfOptionEnum } from '@/config';
    import { checkRequired } from '@/formRuleConfig/Tpfrules';
    import type { TpfValidateRule } from '@/types';
    import { DefaultOptionType } from 'ant-design-vue/es/vc-tree-select/TreeSelect';

    const useSysPageFieldDiy = useSysPageFieldDiyApi();
    const messageApi = useMessageApi();

    // 对象列表
    const materialMoldList = ref<DefaultOptionType[]>([]);
    // 变量列表
    const motificationStatus = ref<DefaultOptionType[]>([]);

    const { getLabel, MessageLanguage } = getTpfOptionEnum();

    const workingProcedure = useWorkingProcedure();

    const emit = defineEmits(['uploadTable']);
    const isDetail = ref(false);
    const [visible, setVisible] = useRef(false);
    const workshopIdOption = ref([]);
    type Props = {
        type?: string;
        isEdit?: boolean;
    };

    const props = withDefaults(defineProps<Props>(), {
        type: '',
        isEdit: false
    });

    // interface FormState {
    //     workUnitId: string;
    //     workUnitTypeId: string;
    //     workUnitTypeName: string;
    //     workUnitCode: string;
    //     workUnitName: string;
    //     workshopId: string;
    //     standardCapacity: string;
    //     standardHours: string;
    //     timeUnit: string;
    //     remark: string;
    //     status: string;
    //     templateTitle: string;
    //     templateCode: string;
    // }
    const formRef = ref<FormInstance>() as any;
    const formState = ref({
        enable: '1', //是否启用
        templateTitle: '', //模板标题
        templateCode: '', //模板编号
        languageCode: '', //语言
        templateInfo: '', //消息模板内容
        objectCode: '', //对象
        variable: '' //变量
    });

    // 校验
    const rules = computed(() => {
        return {
            templateCode: [
                checkRequired({
                    message: '请输入模板编号',
                    required: props.type !== '消息模板详情'
                })
                // {
                //     validator: async (_rule: Rule, value: string) => {
                //         try {
                //             if (props.isEdit === false) {
                //                 const res = await messageApi.checkcodeandlanguage({
                //                     templateCode: formState.value.templateCode,
                //                     languageCode: formState.value.languageCode
                //                 });
                //                 console.log(res, 'res');
                //                 // if (!res.data.value) {
                //                 //     return Promise.reject(res.errorMessage || '模板编号重复');
                //                 // }
                //             }
                //             return Promise.resolve();
                //         } catch (error) {
                //             console.log('error: ', error);
                //         }
                //     },
                //     trigger: ['blur']
                // }
            ],
            templateTitle: [
                checkRequired({
                    message: '请输入模板标题',
                    required: props.type !== '消息模板详情'
                })
            ],
            languageCode: [
                checkRequired({
                    message: '请选择语言',
                    required: props.type !== '消息模板详情'
                })
            ],
            templateInfo: [
                checkRequired({
                    message: '请输入消息模板内容',
                    required: props.type !== '消息模板详情'
                })
            ],
            enable: [
                checkRequired({
                    message: '请选择是否启用',
                    required: props.type !== '消息模板详情'
                })
            ]
        } as TpfValidateRule;
    });

    // 获取对象列表数据
    const getSysDictType = async () => {
        const res = await useSysPageFieldDiy.getSysDictType({ dictType: 'object_code' });
        materialMoldList.value = res.data.object.dictValueVos;
    };

    // 获取变量
    const onGetStoreLocationList = async (value: any, option: any) => {
        try {
            const { data } = await useSysPageFieldDiy.getSysDictType({
                dictType: option.dictValue + '_varibale'
            });
            const dictValueArray = data.object.dictValueVos;
            // 清空原有的motificationStatus.value数组
            motificationStatus.value = [];
            dictValueArray.forEach((item: any) => {
                motificationStatus.value.push({
                    label: item.dictLabel
                });
            });
            const labelsArray = motificationStatus.value.map(item => item.label);
            formState.value.variable = labelsArray.join(',');
        } catch (error) {
            console.log(error);
        }
    };

    const onSave = async () => {
        try {
            if (!isDetail.value) {
                const params = {
                    templateCode: formState.value.templateCode,
                    languageCode: formState.value.languageCode
                };
                await formRef.value.validate().then(async () => {
                    await messageApi.checkcodeandlanguage({
                        ...params
                    });
                });
                if (!props.isEdit) {
                    await messageApi.addMessageTemplate({ ...formState.value });
                } else {
                    console.log(formState.value);
                    await messageApi.updateMessageTemplate({ ...formState.value });
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

    // const getData = (val: any) => {
    //     formState.value.workUnitTypeId = val.workUnitTypeId;
    //     formState.value.workUnitTypeName = val.workUnitTypeName;
    // };

    const open = async (val: string, option: any) => {
        console.log(option, 123);
        // const res = await workingProcedure.getWorkshopList();
        // workshopIdOption.value = res.data.list;
        if (val === 'add') {
            isDetail.value = false;
            formState.value = {
                enable: '1', //是否启用
                templateTitle: '', //模板标题
                templateCode: '', //模板编号
                languageCode: '', //语言
                templateInfo: '', //消息模板内容
                objectCode: '', //对象
                variable: '' //变量
            };
        } else {
            const res = await messageApi.detailMessageTemplate({
                templateNo: option.template_no
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
        // 获取对象数据
        getSysDictType();
    };
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
