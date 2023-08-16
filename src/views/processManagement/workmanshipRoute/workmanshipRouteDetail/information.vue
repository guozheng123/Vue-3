<template>
    <div>
        <TpfCollapse title="基本信息" gap="0">
            <a-form
                ref="baseRef"
                :model="formState"
                name="advanced_search"
                :label-col="{
                    style: { width: '100px' }
                }"
                :rules="rules"
            >
                <a-card style="width: 100%">
                    <a-row :gutter="24">
                        <a-col :span="6">
                            <a-form-item label="工艺编号" name="processCode">
                                <a-input
                                    v-if="routerType !== 'detail'"
                                    :disabled="routerType === 'edit' || routerType === 'upgrade'"
                                    :maxlength="11"
                                    v-model:value.trim="formState.processCode"
                                />
                                <span v-if="routerType === 'detail'">{{
                                    formState.processCode
                                }}</span>
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="工艺名称" name="processName">
                                <a-input
                                    v-if="routerType !== 'detail'"
                                    :maxlength="11"
                                    v-model:value.trim="formState.processName"
                                />
                                <span v-if="routerType === 'detail'">{{
                                    formState.processName
                                }}</span>
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="版本" name="processVersion">
                                <a-input
                                    v-if="routerType !== 'detail'"
                                    :maxlength="50"
                                    disabled
                                    defaultValue="V1"
                                    v-model:value.trim="formState.processVersion"
                                />
                                <span v-if="routerType === 'detail'">{{
                                    formState.processVersion
                                }}</span>
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="所属工厂" name="factoryCode">
                                <a-select
                                    v-if="routerType !== 'detail'"
                                    v-model:value="formState.factoryCode"
                                    :field-names="{
                                        label: 'factoryName',
                                        value: 'factoryCode'
                                    }"
                                    :options="factoryIdOption"
                                />
                                <span v-else>{{
                                    getLabel(formState.factoryCode, factoryIdOption)
                                }}</span>
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="是否发布" name="releaseFlag">
                                <a-switch
                                    checkedValue="1"
                                    :disabled="routerType === 'detail'"
                                    unCheckedValue="0"
                                    v-model:checked="formState.releaseFlag"
                                />
                            </a-form-item>
                        </a-col>

                        <a-col v-if="routerType === 'detail'" :span="6">
                            <a-form-item label="外部版本">
                                <span>{{ formState.outDockProcessVersion }}</span>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-card>
            </a-form>
        </TpfCollapse>
    </div>
</template>

<script setup lang="ts" name="Information">
    import { ref, computed, onMounted, watch } from 'vue';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import type { FormInstance } from 'ant-design-vue';
    import { checkNumLetter, checkRequired, checkSpecial } from '@/formRuleConfig/Tpfrules';
    import { Rule } from 'ant-design-vue/es/form';
    import router from '@/router';
    import { useWorkingProcedure } from '@/api';
    import { getSysGroupManagement } from '@/utils';
    import type { TpfValidateRule } from '@/types';
    import mitts from '@/utils/bus';

    const workingProcedure = useWorkingProcedure();
    const factoryIdOption = ref([]);

    type Props = {
        paramsData: any;
    };
    const props = withDefaults(defineProps<Props>(), {
        paramsData: () => ({})
    });
    const routerType = computed(() => router.currentRoute.value.query.type);
    const baseRef = ref<FormInstance>() as any;
    const formState = ref<any>({
        processCode: '',
        processVersion: 'V1',
        processName: '',
        factoryCode: '',
        releaseFlag: '0',
        enable: 1,
        outDockProcessVersion: ''
    });

    const getLabel = (
        factoryCode: string | number,
        list: { factoryCode: string | number; factoryName: string }[]
    ) => {
        const findItem = list.find(item => item.factoryCode === factoryCode);
        return findItem ? findItem.factoryName : factoryCode;
    };
    const rules = computed(() => {
        return {
            processCode: [
                checkRequired({
                    message: '请输入工艺编号',
                    required: routerType.value !== 'detail'
                }),
                checkSpecial(),
                checkNumLetter(),
                {
                    validator: async (_rule: Rule, value: string) => {
                        try {
                            if (routerType.value === 'add') {
                                if (value) {
                                    const res = await workingProcedure.checkProcessCode({
                                        processCode: value
                                    });
                                    if (!res.data.value) {
                                        return Promise.reject(
                                            res.errorMessage === ''
                                                ? '工艺编号重复'
                                                : res.errorMessage
                                        );
                                    }
                                    return Promise.resolve();
                                }
                            }
                        } catch (error) {
                            console.log('error: ', error);
                        }
                    },
                    trigger: ['blur']
                }
            ],
            processName: [
                checkRequired({
                    message: '请输入工艺名称',
                    required: routerType.value !== 'detail'
                })
            ],
            factoryCode: [
                checkRequired({
                    message: '请选择所属工厂',
                    required: routerType.value !== 'detail' ? getSysGroupManagement() : false
                })
            ]
        } as TpfValidateRule;
    });

    const load = async () => {
        if (routerType.value !== 'add') {
            Object.keys(formState.value).forEach(key => {
                formState.value[key] = props.paramsData[key];
            });
        }
    };

    watch(
        () => formState.value,
        async val => {
            mitts.emit('formList', val);
        },
        { deep: true, immediate: true }
    );

    defineExpose({
        formState,
        baseRef
    });

    onMounted(async () => {
        const res = await workingProcedure.getFactoryList();
        factoryIdOption.value = res.data.list;
        load();
    });
</script>

<style scoped lang="less">
    :deep(.ant-card) {
        .ant-card-body {
            padding: 8px 12px 8px 12px;

            .title_name {
                padding-left: 16px !important;
                color: #1d2129;
                font-size: 16px;
            }
        }
    }
</style>
