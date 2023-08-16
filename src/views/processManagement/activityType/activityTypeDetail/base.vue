<template>
    <TpfCollapse title="基本信息" gap="0">
        <a-form
            ref="baseRef"
            :model="formState"
            name="advanced_search"
            :label-col="{
                style: { width: '138px' }
            }"
            :rules="rules"
        >
            <a-card style="width: 100%">
                <a-row :gutter="24">
                    <a-col :span="6">
                        <a-form-item label="作业单元类型编号" name="workUnitTypeCode">
                            <a-input
                                v-if="routerType !== 'detail'"
                                :disabled="routerType === 'edit'"
                                :maxlength="11"
                                v-model:value.trim="formState.workUnitTypeCode"
                            />
                            <span v-else>{{ formState.workUnitTypeCode }}</span>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="作业单元类型名称" name="workUnitTypeName">
                            <a-input
                                v-if="routerType !== 'detail'"
                                :maxlength="50"
                                v-model:value.trim="formState.workUnitTypeName"
                            />
                            <span v-else>{{ formState.workUnitTypeName }}</span>
                        </a-form-item>
                    </a-col>

                    <a-col :span="6">
                        <a-form-item label="所属工厂" name="factoryId">
                            <a-select
                                v-if="routerType !== 'detail'"
                                v-model:value="formState.factoryId"
                                :field-names="{
                                    label: 'factoryName',
                                    value: 'factoryId'
                                }"
                                :options="factoryIdOption"
                            />
                            <span v-else>{{ getLabel(formState.factoryId, factoryIdOption) }}</span>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="启用" name="status">
                            <a-switch
                                checkedValue="1"
                                unCheckedValue="0"
                                :disabled="routerType === 'detail'"
                                v-model:checked="formState.status"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="备注" name="remark">
                            <a-textarea
                                v-if="routerType !== 'detail'"
                                :maxlength="200"
                                v-model:value.trim="formState.remark"
                            />
                            <span v-else>{{ formState.remark }}</span>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-card>
        </a-form>
    </TpfCollapse>
</template>

<script setup lang="ts" name="Base">
    import { ref, onMounted, watch, computed } from 'vue';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import type { FormInstance } from 'ant-design-vue';
    import router from '@/router';
    import mitts from '@/utils/bus';
    import { useWorkingProcedure } from '@/api';
    import { Rule } from 'ant-design-vue/es/form';
    import { checkRequired, checkSpecial, checkNumLetter } from '@/formRuleConfig/Tpfrules';
    import type { TpfValidateRule } from '@/types';

    const factoryIdOption = ref([]);
    type Props = {
        paramsData?: any;
    };
    const props = withDefaults(defineProps<Props>(), {
        paramsData: () => ({})
    });
    const workingProcedure = useWorkingProcedure();

    const routerType = router.currentRoute.value.query.type;
    const baseRef = ref<FormInstance>() as any;
    const formState = ref<any>({
        workUnitTypeCode: '',
        factoryId: '',
        workUnitTypeName: '',
        remark: '',
        status: '1'
    });

    const rules = computed(() => {
        return {
            workUnitTypeCode: [
                {
                    validator: async (_rule: Rule, value: string) => {
                        try {
                            if (value && routerType === 'add') {
                                const res = await workingProcedure.checkWorkUnitTypeCode({
                                    workUnitTypeCode: value
                                });

                                if (!res.data.value) {
                                    return Promise.reject(
                                        res.errorMessage || '作业单元类型编号重复'
                                    );
                                }

                                return Promise.resolve();
                            }
                        } catch (error) {
                            console.log('error: ', error);
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

    const getLabel = (
        factoryId: string | number,
        list: { factoryId: string | number; factoryName: string }[]
    ) => {
        const findItem = list.find(item => item.factoryId === factoryId);
        return findItem ? findItem.factoryName : factoryId;
    };
    watch(
        () => formState.value.factoryId,
        async val => {
            mitts.emit('factoryId', val);
        },
        { deep: true, immediate: true }
    );

    onMounted(async () => {
        const res = await workingProcedure.getFactoryList();
        factoryIdOption.value = res.data.list;
        Object.keys(formState.value).forEach(key => {
            formState.value[key] = props.paramsData[key] || '';
        });
    });
    defineExpose({
        formState,
        baseRef
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
