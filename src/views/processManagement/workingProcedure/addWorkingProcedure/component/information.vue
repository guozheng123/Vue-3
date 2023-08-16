<template>
    <TpfCollapse title="基础信息" gap="0">
        <a-form
            ref="informationRef"
            :model="formState"
            name="advanced_search"
            :label-col="labelCol"
            :rules="rules"
        >
            <a-card style="width: 100%">
                <a-row :gutter="24">
                    <a-col :span="6">
                        <a-form-item label="工序编号" name="operationCode">
                            <a-input
                                :disabled="routerType == '1' || routerType === 'upgrade'"
                                :maxlength="50"
                                v-model:value.trim="formState.operationCode"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="工序名称" name="operationName">
                            <a-input
                                :disabled="routerType === 'upgrade'"
                                :maxlength="200"
                                v-model:value.trim="formState.operationName"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="工序类型" name="operationTypeCode">
                            <a-select
                                :disabled="routerType === 'upgrade'"
                                v-model:value="formState.operationTypeCode"
                                :options="addOperationTypeNameListOptions"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="所属工厂" name="factoryCode">
                            <a-tree-select
                                :disabled="routerType === 'upgrade'"
                                v-model:value="formState.factoryCode"
                                show-search
                                style="width: 100%"
                                allow-clear
                                tree-default-expand-all
                                :tree-data="treeData"
                                :field-names="{
                                    children: 'branchTree',
                                    label: 'rootName',
                                    value: 'rootCode'
                                }"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="启用">
                            <a-switch
                                :disabled="routerType === 'upgrade'"
                                checkedValue="1"
                                unCheckedValue="0"
                                v-model:checked="formState.forbidden"
                            />
                        </a-form-item>
                    </a-col>

                    <a-col :span="6">
                        <a-form-item label="备注">
                            <a-textarea
                                :maxlength="200"
                                allow-clear
                                v-model:value.trim="formState.remark"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-card>
        </a-form>
    </TpfCollapse>
</template>

<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue';
    import { addOperationTypeNameListOptions } from '@/config';
    import { useRouter } from 'vue-router';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import { Rule } from 'ant-design-vue/es/form';
    import { useWorkingProcedure } from '@/api';
    import { checkRequired, checkNumLetter } from '@/formRuleConfig/Tpfrules';
    import type { TpfValidateRule } from '@/types';

    const $router = useRouter();

    type Props = {
        data: any;
    };
    const props = withDefaults(defineProps<Props>(), {
        data: () => ({})
    });
    const treeData = ref<any[]>([]);

    const routerType = computed(() => $router.currentRoute.value.query.type);
    const labelCol = { style: { width: '120px' } };
    const workingProcedure = useWorkingProcedure();
    const informationRef = ref();
    const formState = ref({
        operationCode: '',
        operationName: '',
        operationTypeCode: 'PRODUCTION',
        forbidden: '1',
        remark: '',
        factoryCode: ''
    });

    const rules = {
        operationCode: [
            checkRequired({ message: '请输入工序编号' }),
            checkNumLetter(),
            {
                validator: async (_rule: Rule, value: string) => {
                    try {
                        if (routerType.value === '0') {
                            const res = await workingProcedure.checkOperationInfoCode({
                                operationInfoCode: value
                            });
                            if (!res.data.value) {
                                return Promise.reject(res.errorMessage || '工序编号重复');
                            }
                            return Promise.resolve();
                        }
                    } catch (error) {
                        console.log('error: ', error);
                    }
                },
                trigger: ['blur']
            }
        ],
        operationName: [checkRequired({ message: '请输入工序名称' })],
        operationTypeCode: [checkRequired({ message: '请选择工序类型' })]
    } as TpfValidateRule;

    const load = async () => {
        const res = await workingProcedure.getCompanyFactoryTreeList();
        const data = res.data.list;
        treeData.value = data.map((e: any) => {
            if (e.branchTree || e.branchTree === null) {
                e.selectable = false;
            }
            return e;
        });

        if (routerType.value !== '0') {
            Object.keys(formState.value).forEach(key => {
                formState.value[key] = props.data[key];
            });
        }
    };
    onMounted(async () => {
        load();
    });
    defineExpose({
        formState,
        informationRef
    });
</script>

<style></style>
