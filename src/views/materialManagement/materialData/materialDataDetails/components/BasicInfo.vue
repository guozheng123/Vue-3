<template>
    <TpfCollapse title="基本信息">
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
        <AddProcessFromMaterielModal
            unHasRowSelection
            v-if="showAddProcessFromMaterielModalDom"
            ref="addProcessFromMaterielModalDom"
            @getMaterialCode="getMaterialInfo"
        />
    </TpfCollapse>
</template>

<script setup lang="ts">
    import { ref, unref, onMounted, computed, watchEffect } from 'vue';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import { checkRequired, checkMaxLength, checkNumLetter } from '@/formRuleConfig/Tpfrules';
    import {
        useFactoryAPi,
        useMaterialApi,
        useMaterialUnitApi,
        useMaterialTypeApi,
        useSysPageFieldDiyApi
    } from '@/api';
    import { Rule } from 'ant-design-vue/es/form';
    import { getTpfOptionEnum } from '@/config';
    import type { TpfValidateRule } from '@/types';
    import TpfForm from '@/components/TpfForm/index.vue';
    import TpfDescriptions from '@/components/TpfDescriptions/index.vue';
    import { formateTreeCode } from '@/utils';
    import { isEmpty, isArray, cloneDeep } from 'lodash-es';
    import { useAddProcessFromMaterielModal } from '@/components';

    const {
        AddProcessFromMaterielModal,
        addProcessFromMaterielModalDom,
        openAddProcessFromMaterielModalDom,
        showAddProcessFromMaterielModalDom
    } = useAddProcessFromMaterielModal();
    type Props = {
        originalInfo?: any;
        routerType: string;
        materialUnitInfo: { materialUnitCode: string; materialUnitName: string };
    };
    const props = defineProps<Props>();

    const emit = defineEmits<{
        (e: 'update:materialUnitInfo', val: any): void;
        (e: 'update:changeMaterialTypeCode', val: any): void;
    }>();

    const TpfFormRef = ref<InstanceType<typeof TpfForm> | null>(null);

    const { partTypeOpt, workshopNameOpt, getLabel, statusOptionStr } = getTpfOptionEnum();

    const materialApi = useMaterialApi();
    const materialUnitApi = useMaterialUnitApi();

    const materialTypeApi = useMaterialTypeApi();

    const factoryAPi = useFactoryAPi();
    const useSysPageFieldDiy = useSysPageFieldDiyApi();
    const materialUnitCodeOpt = ref<any[]>([]);

    const affiliatedOrganizationOpt = ref<any[]>([]);
    const materialMoldList = ref<any[]>([]);
    const materialTypeCodeOpt = ref<any>([]);
    const filterOption = (input: string, option: any) => {
        return option.label.indexOf(input) >= 0;
    };

    const materialReplaceMaterialList = ref([]);
    const materialCodeList = ref<any[]>([]);
    const queryMaterialListByPage = async (materialCode: any = '') => {
        materialCodeList.value = await materialApi
            .queryMaterialListByPage({
                page: 1,
                pageSize: 20,
                materialCode,
                enable: '1'
            })
            .then(res => res.data.object.list || []);
    };
    const formList = computed(() => [
        {
            field: 'materialCode',
            label: '物料编号',
            type: 'Input',
            disabled: props.routerType === '1'
        },
        { field: 'materialName', label: '物料名称', type: 'Input' },
        { field: 'figureNum', label: '图号', type: 'Input' },
        {
            field: props.routerType === '2' ? 'materialUnitName' : 'materialUnitCode',
            label: '基本单位',
            type: 'Select',
            fieldNames: { label: 'materialUnitName', value: 'materialUnitCode' },
            options: unref(materialUnitCodeOpt),
            onChange: (val: any) => {
                changeMaterialUnitCode(val);
            },
            disabled: props.routerType === '1'
        },
        { field: 'materialSpec', label: '物料规格', type: 'Input' },
        {
            field: 'theirCompanyCode@_@theirFactoryCode',
            label: '所属组织',
            type: 'Cascader',
            fieldNames: { label: 'rootName', value: 'rootId', children: 'branchTree' },
            options: unref(affiliatedOrganizationOpt)
        },
        {
            field: 'materialMold',
            label: '物料类型',
            type: 'Select',
            options: materialMoldList.value,
            fieldNames: { label: 'dictLabel', value: 'dictValue', children: 'children' }
        },
        {
            field: 'materialTypeCodeArr',
            label: '物料分类',
            changeOnSelect: true,
            type: 'Cascader',
            options: unref(materialTypeCodeOpt),
            fieldNames: { label: 'label', value: 'id', children: 'children' },
            onChange: (val: any) => {
                changeMaterialTypeCode(cloneDeep(val).slice(1).pop());
            }
        },
        {
            field: 'partsType',
            label: '零件类型',
            type: 'Select',
            showDefaultValue: '0',
            options: workshopNameOpt.slice(1)
        },
        {
            field: 'materialPropertyEnumList',
            label: '物料属性',
            type: 'Select',
            showDefaultValue: ['MAKE'],
            mode: 'multiple',
            maxTagCount: 'responsive',
            filterOption,
            showSearch: true,
            options: partTypeOpt,
            allowClear: true,
            showArrow: true
        },

        {
            type: 'TpfAutoComplete',
            field: 'materialReplaceMaterialList',
            label: '替代料',
            fieldNames: { label: 'materialName', value: 'materialCode' },
            options: unref(materialCodeList),
            onSearchInput: (val: any) => {
                queryMaterialListByPage(val);
            },
            onSelectValue: (row: any, text: any) => {
                getMaterialInfo(row);
            },
            onClickIcon: () => {
                materialCodeList.value = [];
                if (props.routerType === '1') {
                    if (props.originalInfo.materialReplaceMaterialList.length !== 0) {
                        const res = props.originalInfo.materialReplaceMaterialList.reduce(
                            (t: any, v: any) => {
                                const { materialCode, replaceMaterialCode } = v;
                                return [
                                    ...t,
                                    { materialCode },
                                    { materialCode: replaceMaterialCode }
                                ];
                            },
                            []
                        );
                        openAddProcessFromMaterielModalDom(res);
                    } else {
                        openAddProcessFromMaterielModalDom([
                            { materialCode: props.originalInfo.materialCode }
                        ]);
                    }
                } else if (props.routerType === '0') {
                    openAddProcessFromMaterielModalDom([{}]);
                }
            }
        },
        {
            field: 'enable',
            label: '启用',
            bindValue: 'checked',
            type: 'Switch',
            style: { width: 'unset' },
            checkedValue: '1',
            unCheckedValue: '0',
            showDefaultValue: '1'
        },

        { field: 'remark', label: '备注', type: 'Textarea', rows: 1 }
    ]);

    const getMaterialInfo = (val: any) => {
        materialReplaceMaterialList.value = [];
        materialReplaceMaterialList.value.push(val as never);
        if (TpfFormRef.value?.setNewState) {
            TpfFormRef.value.setNewState(
                { materialReplaceMaterialList: unref(val).materialName } || {}
            );
        }
    };
    const changeMaterialUnitCode = (val: string) => {
        const res = unref(materialUnitCodeOpt).find(e => e.materialUnitCode === val);
        emit('update:materialUnitInfo', res);
    };
    const changeMaterialTypeCode = (val: string) => {
        emit('update:changeMaterialTypeCode', val);
    };

    const rules = computed(
        () =>
            ({
                materialCode: [
                    checkRequired({ required: ['0'].includes(props.routerType) }),
                    checkNumLetter({ required: true }),
                    checkMaxLength(50),
                    {
                        validator: async (_rule: Rule, value: string) => {
                            try {
                                if (props.routerType === '1') {
                                    return Promise.resolve();
                                }
                                if (!value) return Promise.resolve();
                                if (/^[A-Za-z0-9]+$/.test(value)) {
                                    const res = await materialApi.checkMaterialCode({
                                        materialCode: value
                                    });
                                    if (!res.data.value) {
                                        return Promise.reject(
                                            res.errorMessage || '该物料编号已有！'
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
                materialName: [
                    checkRequired({ required: ['0', '1'].includes(props.routerType) }),
                    checkMaxLength(100)
                ],
                materialUnitCode: [
                    checkRequired({ required: ['0', '1'].includes(props.routerType) })
                ],
                partsType: [checkRequired({ required: ['0', '1'].includes(props.routerType) })],
                figureNum: [checkMaxLength(40)],
                materialSpec: [checkMaxLength(100)],
                remark: [checkMaxLength(200)],
                materialMold: [checkRequired()]
            } as TpfValidateRule)
    );

    const getAffiliatedOrganizationOpt = async () => {
        affiliatedOrganizationOpt.value = await factoryAPi
            .getCompanyFactoryTreeIsValidList()
            .then(res => res.data.list || []);
    };

    const getMaterialTypeCodeOpt = async () => {
        materialTypeCodeOpt.value = await materialTypeApi
            .getMaterialTypeTree()
            .then(res => res.data.list || []);
    };

    const getMaterialUnitByTenantId = async () => {
        materialUnitCodeOpt.value = await materialUnitApi
            .getMaterialUnitByTenantId({
                status: '1'
            })
            .then(res => res.data.list || []);
        if (unref(props.routerType) === '0') {
            unref(materialUnitCodeOpt).forEach(item => {
                if (item.defaultFlag === '1') {
                    TpfFormRef.value?.setNewState({ materialUnitCode: item.materialUnitCode });
                    emit('update:materialUnitInfo', item);
                }
            });
        }
    };
    const getSubmitInfo = async () => {
        const res = (await TpfFormRef.value?.onSubmit()) as any;
        const materialTypeCode =
            isArray(res.materialTypeCodeArr) && !isEmpty(res.materialTypeCodeArr)
                ? res.materialTypeCodeArr.at(-1)
                : '';

        const materialReplaceMaterialListRes = materialReplaceMaterialList.value.map((e: any) => ({
            replaceMaterialCode: e.materialCode
        }));

        res.materialReplaceMaterialList =
            materialReplaceMaterialListRes.length > 0 ? materialReplaceMaterialListRes : [];
        return { ...res, materialTypeCode };
    };

    const getShowMaterialPropertyEnumList = (arr = []) => {
        return arr.map((item: any) => getLabel(item, partTypeOpt)).join(',');
    };

    const setSubmitInfo = async (val: Record<string, any>) => {
        val.materialTypeCode = val.materialTypeCodeArr;
        TpfFormRef.value!.setNewState(val);
        // emit('getMaterialUnitCodeOptList', val);
    };
    const stop = watchEffect(() => {
        if (!isEmpty(props.originalInfo) && TpfFormRef.value) {
            materialReplaceMaterialList.value = cloneDeep(
                props.originalInfo.materialReplaceMaterialList
            ).map((e: any) => {
                e.materialCode = e.replaceMaterialCode;
                e.replaceMaterialCode = e.materialCode;
                return e;
            });
            if (props.originalInfo.materialReplaceMaterialList.length > 0) {
                const {
                    materialReplaceMaterialList: [{ replaceMaterialCodeName }]
                } = props.originalInfo;
                setSubmitInfo({
                    ...props.originalInfo,
                    materialReplaceMaterialList: replaceMaterialCodeName
                });
            } else {
                setSubmitInfo({
                    ...props.originalInfo,
                    materialReplaceMaterialList: ''
                });
            }

            stop();
        }
    });

    // watch(
    //     () => props.originData,
    //     val => {
    //         console.log(val, TpfFormRef);

    //         if (!isEmpty(val) && TpfFormRef) {
    //         }
    //     },
    //     {
    //         deep: true,
    //         immediate: true
    //     }
    // );
    const originalDate = computed(() => {
        const originalInfo = cloneDeep(props.originalInfo || {});
        console.log('originalInfo: ', originalInfo);
        const materialTypeCodeArr = formateTreeCode(
            unref(materialTypeCodeOpt),
            originalInfo.materialTypeCodeArr,
            { label: 'label', value: 'id', children: 'children' }
        );

        const materialPropertyEnumList = getShowMaterialPropertyEnumList(
            originalInfo.materialPropertyEnumList
        );

        const partsType = getLabel(originalInfo.partsType, workshopNameOpt.slice(1));
        const materialMold = getLabel(originalInfo.materialMold, unref(materialMoldList), {
            label: 'dictLabel',
            value: 'dictValue'
        });

        const companyFactoryCode = formateTreeCode(
            unref(affiliatedOrganizationOpt),
            originalInfo['theirCompanyCode@_@theirFactoryCode'],
            { label: 'rootName', value: 'rootId', children: 'branchTree' }
        );

        const enable = getLabel(originalInfo.enable, statusOptionStr);

        const materialTypeCode = formateTreeCode(
            unref(materialTypeCodeOpt),
            originalInfo.materialTypeCodeArr,
            { label: 'label', value: 'id', children: 'children' }
        );

        const materialReplaceMaterialList = (originalInfo.materialReplaceMaterialList || [])
            .map((item: any) => item.replaceMaterialCodeName)
            .join(',');

        return {
            ...originalInfo,
            materialTypeCodeArr,
            materialPropertyEnumList,
            partsType,
            materialTypeCode,
            enable,
            materialMold,
            materialReplaceMaterialList,
            'theirCompanyCode@_@theirFactoryCode': companyFactoryCode
        };
    });
    const getSysDictType = async () => {
        const res = await useSysPageFieldDiy.getSysDictType({ dictType: 'material_mold' });
        materialMoldList.value = res.data.object.dictValueVos;
    };

    onMounted(() => {
        getAffiliatedOrganizationOpt();
        getMaterialTypeCodeOpt();
        getMaterialUnitByTenantId();
        getSysDictType();
    });

    defineExpose({ getSubmitInfo });
</script>
