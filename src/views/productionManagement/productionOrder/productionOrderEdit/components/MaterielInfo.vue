<template>
    <TpfCollapse title="物料信息">
        <TpfForm
            :formList="formList"
            hiddenCollapse
            hiddenSubmit
            noUseInit
            ref="TpfFormRef"
            :rules="rules"
            :labelCol="{ style: { width: '110px' } }"
        />

        <AddProcessFromMaterielModal
            unHasRowSelection
            v-if="showAddProcessFromMaterielModalDom"
            ref="addProcessFromMaterielModalDom"
            @getMaterialCode="getMaterialInfo"
        />
    </TpfCollapse>
</template>

<script setup lang="tsx" name="materielInfo">
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { ref, computed, unref, watchEffect, onMounted } from 'vue';
    import { checkGreaterThan, checkRequired } from '@/formRuleConfig/Tpfrules';
    import { useMaterialApi } from '@/api';
    import { isEmpty } from 'lodash-es';

    import { useAddProcessFromMaterielModal } from '@/components';

    const {
        AddProcessFromMaterielModal,
        addProcessFromMaterielModalDom,
        openAddProcessFromMaterielModalDom,
        showAddProcessFromMaterielModalDom
    } = useAddProcessFromMaterielModal();

    const materialApi = useMaterialApi();

    type Props = {
        productionOrderMaterial?: { [k: string]: any };
    };

    const props = defineProps<Props>();

    const emit = defineEmits<{
        (e: 'setMaterialProcessList', list: Record<string, any>[]): void;
    }>();

    const TpfFormRef = ref<InstanceType<typeof TpfForm> | null>(null);

    const tpfFormRefData = computed(() => {
        return TpfFormRef.value;
    });
    watchEffect(() => {
        if (props.productionOrderMaterial) {
            unref(tpfFormRefData)?.setNewState(props.productionOrderMaterial);
        }
    });

    const materialCodeList = ref<any[]>([]);
    const queryMaterialListByPage = async (materialCode: any = '') => {
        const res = await materialApi
            .queryMaterialListByPage({
                page: 1,
                pageSize: 20,
                materialCode
            })
            .then(res => res.data.object.list || []);

        materialCodeList.value = res.map(item => ({
            ...item,
            showMaterialName: `${item.materialCode}-${item.materialName}`
        }));
    };

    const formList = computed(() => {
        return [
            {
                type: 'TpfAutoComplete',
                field: 'materialCode',
                label: '物料编号',
                fieldNames: { label: 'showMaterialName', value: 'materialCode' },
                options: unref(materialCodeList),
                onSearchInput: (val: any) => {
                    queryMaterialListByPage(val);
                },
                onSelectValue: (row: any, text: any) => {
                    getMaterialInfo(row);
                },
                onClickIcon: () => {
                    materialCodeList.value = [];
                    openAddProcessFromMaterielModalDom([TpfFormRef.value?.newState || {}]);
                }
            },
            {
                type: 'Input',
                field: 'materialName',
                showDefaultValue: '',
                label: '物料名称',
                disabled: true
            },
            {
                type: 'Input',
                field: 'materialSpec',
                showDefaultValue: '',
                label: '物料规格',
                disabled: true
            },
            {
                type: 'Input',
                field: 'figureNum',
                showDefaultValue: '',
                label: '图号'
            },
            {
                type: 'TpfInputNumber',
                min: 0,
                field: 'plannedQuantity',
                showDefaultValue: '',
                label: '计划数'
            },
            {
                type: 'Input',
                field: 'materialUnitName',
                showDefaultValue: '',
                label: '基本单位',
                disabled: true
            }
        ];
    });
    const rules = computed(() => {
        return {
            materialCode: [checkRequired()],
            plannedQuantity: [checkRequired(), checkGreaterThan()]
        };
    });

    const getMaterialInfo = (val: any) => {
        const { materialProcessList = [] } = unref(val) || {};
        if (TpfFormRef.value?.setNewState) {
            const info = isEmpty(val)
                ? { materialName: '', materialSpec: '', materialUnitName: '' }
                : val;
            TpfFormRef.value.setNewState(info);

            TpfFormRef.value.formRef?.validateFields('materialCode');
            emit('setMaterialProcessList', materialProcessList || []);
        }
    };

    const submit = async () => {
        return { productionOrderMaterial: await TpfFormRef.value?.onSubmit() };
    };

    onMounted(() => {
        queryMaterialListByPage();
    });

    defineExpose({ submit });
</script>

<style lang="less" scoped></style>
