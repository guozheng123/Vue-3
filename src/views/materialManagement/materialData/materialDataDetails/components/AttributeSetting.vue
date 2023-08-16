<template>
    <TpfCollapse title="业务属性">
        <TpfForm
            v-show="['0', '1'].includes(routerType)"
            :formList="formList"
            hiddenCollapse
            hiddenSubmit
            noUseInit
            ref="TpfFormRef"
            :rules="rules"
            :labelCol="{ style: { width: '110px' } }"
        />
        <TpfDescriptions
            v-if="['2'].includes(routerType)"
            :originalDate="originalDate"
            :renderList="formList"
        />
    </TpfCollapse>
</template>

<script setup lang="ts">
    import { ref, onMounted, computed, unref, watch, watchEffect } from 'vue';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import {
        useWarehouseApi,
        useQualityInspectionTypeApi,
        useQualityInspectionSchemeApi
    } from '@/api';
    import { checkRequired } from '@/formRuleConfig/Tpfrules';
    import type { TpfValidateRule } from '@/types';
    import TpfForm from '@/components/TpfForm/index.vue';
    import TpfDescriptions from '@/components/TpfDescriptions/index.vue';
    import { getTpfOptionEnum } from '@/config';
    import { cloneDeep, isEmpty } from 'lodash-es';

    const { managementOpt, getLabel, equipmentDebugEnum } = getTpfOptionEnum();

    const props = defineProps<{
        routerType: string;
        productUnitCodeList?: any[];
        materialUnitList?: any;
        // productUnitCodeOpt?: any;
        originalInfo?: any;
    }>();

    const TpfFormRef = ref<InstanceType<typeof TpfForm> | null>(null);

    const qualityInspectionTypeApi = useQualityInspectionTypeApi();

    const qualityInspectionSchemeApi = useQualityInspectionSchemeApi();

    const warehouseApi = useWarehouseApi();
    const inspectionTypeCodeOpt = ref<any[]>([]);
    const prepareMaterialTypeOpt = ref<any[]>([
        { value: 'AS_PLAN', label: '按计划' },
        { value: 'AS_BATCH', label: '批量' }
    ]);
    const isExemption = ref(true);
    const stockManagementTypeList = ref<any[]>([
        { value: 'STOCK_AS_QUANTITY', label: '数量' },
        { value: 'STOCK_AS_BATCH', label: '批次' }
    ]);
    // const productUnitCodeOpt = ref<any[]>([]);
    const inspectionSchemeCodeOpt = ref<any[]>([]);

    const qnWarehouseCodeOpt = ref<any[]>([]);
    const formList = computed(() => [
        {
            field: 'supervisorModeCode',
            label: '生产管理方式',
            type: 'Select',
            showDefaultValue: '0',
            options: managementOpt.slice(1)
        },
        {
            field: 'productUnitCode',
            label: '生产单位',
            type: 'Select',
            showDefaultValue: '',
            fieldNames: { label: 'materialUnitName', value: 'materialUnitCode' },
            options: props.productUnitCodeList
        },
        {
            field: 'prepareMaterialType',
            label: '备料方式',
            type: 'Select',
            showDefaultValue: 'AS_PLAN',
            options: prepareMaterialTypeOpt
        },
        {
            field: 'isExemption',
            label: '是否免检',
            type: 'Select',
            showDefaultValue: '1',
            options: equipmentDebugEnum,
            onChange: (val: any) => {
                isExemption.value = val === '1';
            }
        },
        {
            field: 'inspectionTypeCode',
            label: '检验类型',
            type: 'Select',
            fieldNames: { label: 'inspectionTypeName', value: 'inspectionTypeCode' },
            options: unref(inspectionTypeCodeOpt),
            hidden: isExemption.value
        },
        {
            field: 'inspectionSchemeCode',
            label: '检验方案',
            type: 'Select',
            fieldNames: { label: 'inspectionSchemeName', value: 'inspectionSchemeCode' },
            options: unref(inspectionSchemeCodeOpt),
            hidden: isExemption.value
        },
        {
            field: 'stockManagementType',
            label: '库存管理方式',
            type: 'Select',
            options: stockManagementTypeList,
            disabled: props.routerType === '1'
        },
        {
            field: 'qnWarehouseCode',
            label: '合格品仓',
            type: 'Select',
            allowClear: true,
            fieldNames: { label: 'name', value: 'code' },
            options: unref(qnWarehouseCodeOpt)
        },
        {
            field: 'noWarehouseCode',
            label: '不合格品仓',
            type: 'Select',
            fieldNames: { label: 'name', value: 'code' },
            options: unref(qnWarehouseCodeOpt),
            allowClear: true
        },
        {
            field: 'materialMinInventory',
            label: '最小库存',
            type: 'TpfInputNumber',
            fromSys: true,
            onChange: () => {
                TpfFormRef.value?.validateFields(['materialMinInventory', 'materialMaxInventory']);
            }
        },
        {
            field: 'materialMaxInventory',
            label: '最大库存',
            type: 'TpfInputNumber',
            fromSys: true,
            onChange: () => {
                TpfFormRef.value?.validateFields(['materialMinInventory', 'materialMaxInventory']);
            }
        }
    ]);

    const checkInventory = () => {
        return {
            validator: () => {
                const { materialMinInventory, materialMaxInventory } =
                    TpfFormRef.value?.newState || {};
                if (Number(materialMinInventory) > Number(materialMaxInventory)) {
                    return Promise.reject('最小库存不可大于最大库存');
                }
                return Promise.resolve();
            },
            trigger: ['blur']
        };
    };
    const rules = computed(() => {
        return {
            qnWarehouseCode: [checkRequired()],
            noWarehouseCode: [checkRequired()],
            materialMinInventory: [checkInventory()],
            materialMaxInventory: [checkInventory()],
            stockManagementType: [checkRequired()],
            inspectionSchemeCode: [checkRequired({ required: !isExemption.value })],
            inspectionTypeCode: [checkRequired({ required: !isExemption.value })]
        } as TpfValidateRule;
    });

    const getInspectionTypeCodeOpt = async () => {
        inspectionTypeCodeOpt.value = await qualityInspectionTypeApi
            .getInspectionTypeByIdByTenantId()
            .then(res => res.data.list || []);
    };

    const getInspectionSchemeCodeOpt = async () => {
        inspectionSchemeCodeOpt.value = await qualityInspectionSchemeApi
            .getInspectionSchemeByTenantId()
            .then(res => res.data.list || []);
    };

    const getQnWarehouseCode = async () => {
        qnWarehouseCodeOpt.value = await warehouseApi
            .queryPositionListByParam()
            .then(res => res.data.list || []);
        const newInfo = unref(qnWarehouseCodeOpt).reduce(
            (t, v) => {
                if (v.defaultQualified === 1) {
                    t.qnWarehouseCode = v.code;
                }
                if (v.defaultDisqualified === 1) {
                    t.noWarehouseCode = v.code;
                }
                return t;
            },
            { qnWarehouseCode: '', noWarehouseCode: '' }
        );
        if (props.routerType === '0') {
            TpfFormRef.value?.setNewState(newInfo);
        }
    };

    const getSubmitInfo = async () => {
        const res = (await TpfFormRef.value?.onSubmit()) as any;
        if (res.isExemption === '1') {
            res.inspectionSchemeCode = '';
            res.inspectionTypeCode = '';
        }
        return { ...res };
    };
    // const originalInfo = ref({} as Record<string, any>);

    const setSubmitInfo = (val: Record<string, any>) => {
        // productUnitCodeOpt.value = val.materialAuxiliaryUnitList;
        isExemption.value = val.isExemption === '1';

        TpfFormRef.value?.setNewState(val);
        // originalInfo.value = unref(val);
    };

    const originalDate = computed(() => {
        const originalInfo = props.originalInfo || {};

        const productUnitCode = originalInfo.productUnitCodeName;
        return {
            ...originalInfo,
            supervisorModeCode: getLabel(
                unref(originalInfo).supervisorModeCode,
                managementOpt.slice(1)
            ),
            inspectionTypeCode: getLabel(
                unref(originalInfo).inspectionTypeCode,
                unref(inspectionTypeCodeOpt),
                { label: 'inspectionTypeName', value: 'inspectionTypeCode' }
            ),
            inspectionSchemeCode: getLabel(
                unref(originalInfo).inspectionSchemeCode,
                unref(inspectionSchemeCodeOpt),
                { label: 'inspectionSchemeName', value: 'inspectionSchemeCode' }
            ),
            qnWarehouseCode: getLabel(
                unref(originalInfo).qnWarehouseCode,
                unref(qnWarehouseCodeOpt),
                { label: 'name', value: 'code' }
            ),
            noWarehouseCode: getLabel(
                unref(originalInfo).noWarehouseCode,
                unref(qnWarehouseCodeOpt),
                { label: 'name', value: 'code' }
            ),
            prepareMaterialType: getLabel(
                unref(originalInfo).prepareMaterialType,
                unref(prepareMaterialTypeOpt),
                { label: 'label', value: 'value' }
            ),
            isExemption: getLabel(unref(originalInfo).isExemption, unref(equipmentDebugEnum), {
                label: 'label',
                value: 'value'
            }),
            stockManagementType: getLabel(
                unref(originalInfo).stockManagementType,
                unref(stockManagementTypeList),
                {
                    label: 'label',
                    value: 'value'
                }
            ),
            productUnitCode
        };
    });

    onMounted(() => {
        getInspectionTypeCodeOpt();
        getInspectionSchemeCodeOpt();
        getQnWarehouseCode();
    });
    const stop = watchEffect(() => {
        if (props.originalInfo && !isEmpty(props.originalInfo) && TpfFormRef.value) {
            setSubmitInfo(cloneDeep(props.originalInfo));
            stop();
        }

        const productUnitCode = props.productUnitCodeList?.length
            ? props.productUnitCodeList[0].materialUnitCode
            : '';
        TpfFormRef.value?.setNewState({ productUnitCode: productUnitCode });
    });

    defineExpose({ getSubmitInfo });
</script>
