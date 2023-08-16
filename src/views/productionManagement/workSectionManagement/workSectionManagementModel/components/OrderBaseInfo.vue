<template>
    <TpfCollapse title="基本信息">
        <TpfForm
            :formList="formList"
            hiddenCollapse
            hiddenSubmit
            noUseInit
            ref="TpfFormRef"
            :rules="rules"
            :labelCol="{ style: { width: '110px' } }"
        />
    </TpfCollapse>
</template>

<script setup lang="tsx" name="orderBaseInfo">
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { ref, computed, unref, onMounted, defineAsyncComponent, watchEffect, watch } from 'vue';
    import { useWarehouseApi, getDepartmentTreeList, useWorkshopApi } from '@/api';
    import { checkRequired, checkNumLetter, checkNoChinese } from '@/formRuleConfig/Tpfrules';
    import { useOpenAntdModal, useRouteQuery } from '@/hooks';

    type Props = {
        info?: { [k: string]: any };
        workshopSectionVo?: { [k: string]: any };
        type?: string;
    };

    const workShopApi = useWorkshopApi();
    const props = defineProps<Props>();
    const { WorkshopSectionId } = useRouteQuery<{ WorkshopSectionId: string }>();

    const TpfFormRef = ref<InstanceType<typeof TpfForm> | null>(null);

    const tpfFormRefData = computed(() => {
        return TpfFormRef.value;
    });
    const warehouseApi = useWarehouseApi();

    const formSelectType = ref<any[]>([]);

    watchEffect(() => {
        if (props.info) {
            unref(tpfFormRefData)?.setNewState({ ...props.info, version: props.info.versionName });
        }
    });

    const showOverProductionRatio = computed(
        () => unref(tpfFormRefData)?.newState.overProduction === '1'
    );
    watch(
        () => showOverProductionRatio.value,
        flag => {
            if (!flag) {
                unref(tpfFormRefData)?.clearValidate(['overProductionRatio']);
            }
        }
    );

    const initFormList = computed(() => {
        return [
            {
                type: 'Input',
                field: 'workshopSectionCode',
                showDefaultValue: '',
                label: '工段编号',
                disabled: unref(getIsEdit)
            },
            {
                type: 'Input',
                field: 'workshopSectionName',
                showDefaultValue: '',
                label: '工段名称'
            },
            {
                // 树型控件
                type: 'TreeSelect',
                field: 'departmentCode',
                label: '所属部门',
                placeholder: '',
                allowClear: true,
                fieldNames: {
                    children: 'branchTree',
                    label: 'rootName',
                    value: 'rootCode'
                },
                treeData: treeData.value
            },
            {
                type: 'Textarea',
                field: 'remark',
                showDefaultValue: '',
                rows: 1,
                label: '备注',
                // 限制最大字数为200
                maxlength: 200
            },
            {
                type: 'Switch',
                // 不需要传递
                field: 'enabled',
                label: '启用',
                style: { width: 'unset' },
                bindValue: 'checked',
                unCheckedValue: 0,
                checkedValue: 1,
                showDefaultValue: 1
                // 默认启用
            }
        ];
    });

    // 树型控件数据
    const { treeData } = getDepartmentTreeList();
    const formList = computed(() => unref(initFormList).filter(o => o));

    // 校验重复性
    const validatorGuidebookCode = () => ({
        trigger: ['blur'],
        validator: async (_rule: any, value: string) => {
            try {
                if (['DETAIL', 'UPGRADES'].includes(props.type || '')) {
                    return Promise.resolve();
                }
                const flag = await workShopApi
                    .WorkshopSectionIdCode({ workshopSectionCode: value })
                    .then(res => res.data.value);
                if (flag) {
                    return Promise.resolve();
                }
                return Promise.reject('存在重复的编号');
            } catch (error) {
                console.log('error: ', error);
            }
        }
    });

    // 校验表单字段
    const rules = computed(() => {
        return {
            // 工段编号
            workshopSectionCode: [checkRequired(), checkNoChinese(), validatorGuidebookCode()],
            // 工序名称
            workshopSectionName: [checkRequired()],
            equipmentDebug: [checkRequired()],
            reportInOrder: [checkRequired()],
            overProduction: [checkRequired()],
            overProductionRatio: [checkRequired({ required: unref(showOverProductionRatio) })],
            confirmLogic: [checkRequired()]
        };
    });

    const getProjectInfo = (val: any) => {
        if (TpfFormRef.value?.setNewState) {
            TpfFormRef.value.setNewState(unref(val) || {});
        }
    };

    const submit = async () => {
        return { workshopSectionVo: await TpfFormRef.value?.onSubmit() };
    };
    // 请求数据
    onMounted(async () => {
        const res = await warehouseApi.queryPositionTypeByParam({});
        formSelectType.value = res.data.object.list.map((e: any) => {
            e.value = e.code;
            e.label = e.name;
            return e;
        });
    });
    const getIsEdit = computed(() => (WorkshopSectionId ? true : false));
    defineExpose({ submit });
</script>

<style lang="less" scoped></style>
