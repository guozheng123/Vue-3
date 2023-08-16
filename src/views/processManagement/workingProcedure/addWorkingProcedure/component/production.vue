<template>
    <div>
        <TpfCollapse title="生产信息" gap="0">
            <a-form
                ref="productionRef"
                :model="formState"
                name="advanced_search"
                :label-col="labelCol"
                :rules="rules"
            >
                <a-card style="width: 100%">
                    <a-row :gutter="24">
                        <a-col :span="6">
                            <a-form-item label="作业单元类型编号" name="workUnitTypeCode">
                                <a-input readonly v-model:value="formState.workUnitTypeCode">
                                    <template #addonAfter>
                                        <SvgIcon
                                            type="icon-sousuo"
                                            size="16"
                                            cursor
                                            @click="openWorkModelFun"
                                        />
                                    </template>
                                </a-input>
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="作业单元类型名称">
                                <a-input v-model:value.trim="formState.workUnitTypeName" disabled />
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="标准产能" name="standardCapacity">
                                <a-input-number
                                    :controls="false"
                                    v-model:value="formState.standardCapacity"
                                    :min="1"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="标准工时" name="standardTime">
                                <a-input-number
                                    :controls="false"
                                    v-model:value="formState.standardTime"
                                    :min="1"
                                >
                                    <template #addonAfter>
                                        <a-select
                                            v-model:value="formState.standardTimeUnit"
                                            style="width: 80px"
                                        >
                                            <a-select-option value="SECOND">秒</a-select-option>
                                            <a-select-option value="MINUTE">分钟</a-select-option>
                                            <a-select-option value="HOUR">小时</a-select-option>
                                            <a-select-option value="DAY">天</a-select-option>
                                        </a-select>
                                    </template>
                                </a-input-number>
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="最大产能">
                                <a-input-number
                                    :controls="false"
                                    v-model:value="formState.maxCapacity"
                                    :min="1"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="最小产能">
                                <a-input-number
                                    :controls="false"
                                    v-model:value="formState.minCapacity"
                                    :min="1"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="辅助工时" name="auxiliaryTime">
                                <a-input-number
                                    :controls="false"
                                    v-model:value="formState.auxiliaryTime"
                                    :min="1"
                                >
                                    <template #addonAfter>
                                        <a-select
                                            v-model:value="formState.auxiliaryTimeUnit"
                                            style="width: 80px"
                                            ><a-select-option value="SECOND">秒</a-select-option>
                                            <a-select-option value="MINUTE">分钟</a-select-option>
                                            <a-select-option value="HOUR">小时</a-select-option>
                                            <a-select-option value="DAY">天</a-select-option>
                                        </a-select>
                                    </template>
                                </a-input-number>
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="计时单价" name="pricePerTime">
                                <a-input-number
                                    :controls="false"
                                    :hideRequiredMark="false"
                                    v-model:value.trim="formState.pricePerTime"
                                >
                                    <template #addonAfter>
                                        <a-select
                                            v-model:value="formState.pricePerTimeUnit"
                                            style="width: 100px"
                                        >
                                            <a-select-option value="SECOND">元/秒</a-select-option>
                                            <a-select-option value="MINUTE"
                                                >元/分钟</a-select-option
                                            >
                                            <a-select-option value="HOUR">元/小时</a-select-option>
                                            <a-select-option value="DAY">元/天</a-select-option>
                                        </a-select>
                                    </template>
                                </a-input-number>
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="计件单价(元)">
                                <a-input-number
                                    :min="1"
                                    :controls="false"
                                    v-model:value="formState.pricePerQuantity"
                                    :precision="2"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="工段">
                                <a-input
                                    v-model:value.trim="formState.workshopSectionName"
                                    :disabled="true"
                                />
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-card>
            </a-form>
        </TpfCollapse>
        <WorknModel @get-data="getData" ref="workModel" />
    </div>
</template>

<script setup lang="ts">
    import { ref, unref, defineAsyncComponent, computed, onMounted } from 'vue';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import { useOpenAntdModal } from '@/hooks';
    import { checkRequired } from '@/formRuleConfig/Tpfrules';
    import { useRouter } from 'vue-router';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import type { TpfValidateRule } from '@/types';

    const WorknModel = defineAsyncComponent(() => import('../workingProcedureModel/work.vue'));

    const $router = useRouter();

    type Props = {
        data: any;
    };
    const props = withDefaults(defineProps<Props>(), {
        data: () => ({})
    });
    const routerType = computed(() => $router.currentRoute.value.query.type);
    const [workModel, onOpenWorkModel] = useOpenAntdModal();
    const labelCol = { style: { width: '120px' } };
    const productionRef = ref();
    const formState = ref({
        workUnitTypeCode: '',
        workUnitTypeName: '',
        standardCapacity: 1,
        standardTime: '',
        standardTimeUnit: 'MINUTE',
        maxCapacity: '',
        minCapacity: '',
        auxiliaryTime: '',
        auxiliaryTimeUnit: 'MINUTE',
        pricePerTime: '',
        pricePerTimeUnit: 'MINUTE',
        pricePerQuantity: '',
        workshopSectionName: ''
    });

    const rules = {
        workUnitTypeCode: [checkRequired({ message: '请选择作业单元类型编号' })],
        standardCapacity: [checkRequired({ message: '请输入标准产能' })],
        standardTime: [checkRequired({ message: '请输入标准用时' })]
    } as TpfValidateRule;

    const openWorkModelFun = () => {
        onOpenWorkModel();
    };
    const getData = (list: any) => {
        const { workUnitTypeCode, workUnitTypeName } = unref(list);
        formState.value.workUnitTypeCode = workUnitTypeCode;
        formState.value.workUnitTypeName = workUnitTypeName;

        if (workUnitTypeCode) {
            productionRef.value.validateFields(['workUnitTypeCode']);
        }
    };

    const load = async () => {
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
        productionRef
    });
</script>

<style scoped lang="less">
    :deep(.ant-input-number-group-wrapper) {
        width: 100%;
    }

    .ant-input-number,
    .ant-input-search {
        width: 100% !important;
    }

    :deep(.ant-form-item-label) {
        text-overflow: ellipsis;
        padding-top: 5px;
    }

    :deep(.ant-form-item-label) > label {
        display: inline;
    }

    .btn {
        width: 33px;
        background: #f7f8fa;
        text-align: center;
        padding: 0 !important;
    }
</style>
