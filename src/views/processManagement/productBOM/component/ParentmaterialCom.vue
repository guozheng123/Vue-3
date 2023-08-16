<template>
    <TpfCollapse class="parentMaterial" title="父级物料">
        <TpfForm
            v-if="!arr.includes(type)"
            :formList="formList"
            hiddenCollapse
            hiddenSubmit
            noUseInit
            ref="TpfFormRef"
            :rules="rules"
            :labelCol="{ style: { width: '110px' } }"
        />
        <TpfDescriptions
            v-if="arr.includes(type)"
            :originalDate="originalDate"
            :renderList="formList"
        />
        <AddProcessFromMaterielModal
            unHasRowSelection
            isMaterialProductBOM
            v-if="showAddProcessFromMaterielModalDom"
            ref="addProcessFromMaterielModalDom"
            @getMaterialCode="getMaterialInfo"
        />
    </TpfCollapse>
</template>

<script setup lang="ts" name="ParentMaterial">
    import { ref, onMounted, computed, unref, watchEffect } from 'vue';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import { checkRequired } from '@/formRuleConfig/Tpfrules';
    import { Rule } from 'ant-design-vue/es/form';
    import { getTpfOptionEnum } from '@/config';
    import type { TpfValidateRule } from '@/types';
    import TpfForm from '@/components/TpfForm/index.vue';
    import TpfDescriptions from '@/components/TpfDescriptions/index.vue';
    import { useAddProcessFromMaterielModal } from '@/components';
    import {
        useMaterialApi,
        useMaterialUnitApi,
        useSysPageFieldDiyApi,
        useMaterialProductBOMApi
    } from '@/api';
    import { useRouteQuery } from '@/hooks';
    import type { ParentMaterialVo } from '@/api';
    import { cloneDeep, isEmpty } from 'lodash-es';
    const arr = ['DETAIL', 'update'];
    const emit = defineEmits<{
        (e: 'onSubmit', val: any): void;
    }>();
    const { getLabel, publishOption } = getTpfOptionEnum();

    const { type } = useRouteQuery<{
        type: string;
    }>();
    const {
        AddProcessFromMaterielModal,
        addProcessFromMaterielModalDom,
        openAddProcessFromMaterielModalDom,
        showAddProcessFromMaterielModalDom
    } = useAddProcessFromMaterielModal();
    type Props = {
        originalInfo?: any;
    };
    const props = defineProps<Props>();

    const materialApi = useMaterialApi();
    const materialUnitApi = useMaterialUnitApi();
    const useSysPageFieldDiy = useSysPageFieldDiyApi();
    const useMaterialProductBOM = useMaterialProductBOMApi();

    const TpfFormRef = ref<InstanceType<typeof TpfForm> | null>(null);
    const materialUnitCodeOpt = ref<any[]>([]);
    const materialCodeList = ref<any[]>([]);
    const materialMoldList = ref<any[]>([]);

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
    const getMaterialInfo = (val: any) => {
        if (TpfFormRef.value?.setNewState) {
            val.remark = '';
            TpfFormRef.value.setNewState(val);
        }
        emit('onSubmit', unref(val));
    };
    const formList = computed(() => [
        {
            type: 'TpfAutoComplete',
            field: 'materialCode',
            label: '物料编号',
            fieldNames: { label: 'materialName', value: 'materialCode' },
            options: unref(materialCodeList),
            onSearchInput: (val: any) => {
                queryMaterialListByPage(val);
            },
            onSelectValue: (row: any, text: any) => {
                getMaterialInfo(row);
            },
            onClickIcon: () => {
                if (type === 'edit') {
                    return;
                }
                openAddProcessFromMaterielModalDom();
            },
            disabled: type === 'edit' || type === 'UPGRADES'
        },
        { field: 'materialName', label: '物料名称', type: 'Input', disabled: true },
        { field: 'materialSpec', label: '物料规格', type: 'Input', disabled: true },
        {
            label: '基本单位',
            field: 'materialUnitCode',
            type: 'Select',
            fieldNames: { label: 'materialUnitName', value: 'materialUnitCode' },
            options: unref(materialUnitCodeOpt),
            disabled: true
        },
        {
            field: 'materialMold',
            label: '物料类型',
            type: 'Select',
            options: materialMoldList.value,
            fieldNames: {
                label: 'dictLabel',
                value: 'dictValue',
                children: 'children'
            },
            disabled: true
        },
        { field: 'num', label: '用量', type: 'Input', disabled: true, showDefaultValue: 1 },
        {
            field: 'bomVersion',
            label: '版本',
            type: 'Input',
            disabled: true,
            showDefaultValue: 'V1'
        },
        { field: 'remark', label: '备注', type: 'Textarea', rows: 1 },
        {
            //是否发布 0否 1是
            field: 'releaseFlag',
            label: '是否发布',
            bindValue: 'checked',
            type: 'Switch',
            style: { width: 'unset' },
            checkedValue: 1,
            unCheckedValue: 0,
            showDefaultValue: 0,
            disabled: type === 'edit' || type === 'UPGRADES'
        }
    ]);

    const getSubmitInfo = async () => {
        if (type === 'update') {
            return { ...props.originalInfo };
        } else {
            const res = (await TpfFormRef.value?.onSubmit()) as any;
            res.bomVersion = res.bomVersion.substring(1);
            return { parentMaterial: res };
        }
    };

    const rules = computed(
        () =>
            ({
                materialCode: [
                    checkRequired(),

                    {
                        validator: async (_rule: Rule, value: string) => {
                            try {
                                if (type === 'add' || type === 'COPY') {
                                    if (value) {
                                        const res = await useMaterialProductBOM.checkMaterialCode({
                                            materialCode: value
                                        });
                                        if (res.data.value) {
                                            return Promise.reject(
                                                res.errorMessage === ''
                                                    ? '物料编号重复'
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
                        trigger: ['blur', 'change']
                    }
                ]
            } as TpfValidateRule)
    );

    const setSubmitInfo = async (val: ParentMaterialVo) => {
        TpfFormRef.value!.setNewState(val);
    };
    const getMaterialUnitByTenantId = async () => {
        materialUnitCodeOpt.value = await materialUnitApi
            .getMaterialUnitByTenantId({})
            .then(res => res.data.list || []);
    };
    const getSysDictType = async () => {
        const res = await useSysPageFieldDiy.getSysDictType({ dictType: 'material_mold' });
        materialMoldList.value = res.data.object.dictValueVos;
    };

    const originalDate = computed(() => {
        const originalInfo = cloneDeep(props.originalInfo || {});
        if (!isEmpty(originalInfo)) {
            const releaseFlag = getLabel(originalInfo.releaseFlag, publishOption);
            const materialMold = originalInfo.materialMoldName;
            const bomVersion = 'V' + originalInfo.bomVersion;
            const materialUnitCode = originalInfo.materialUnitName;

            return {
                ...originalInfo,
                releaseFlag,
                materialMold,
                bomVersion,
                materialUnitCode
            };
        } else {
            return {};
        }
    });

    onMounted(() => {
        getMaterialUnitByTenantId();
        getSysDictType();
    });

    const stop = watchEffect(() => {
        if (!isEmpty(props.originalInfo) && TpfFormRef.value) {
            setSubmitInfo({
                ...props.originalInfo,
                bomVersion: 'v' + props.originalInfo.bomVersion
            });

            stop();
        }
    });

    defineExpose({ getSubmitInfo, setSubmitInfo });
</script>
