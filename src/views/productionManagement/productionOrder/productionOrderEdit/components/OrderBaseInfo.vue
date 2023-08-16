<template>
    <TpfCollapse title="基本信息">
        <TpfForm
            :formList="initFormList"
            hiddenCollapse
            hiddenSubmit
            noUseInit
            ref="TpfFormRef"
            :rules="rules"
            :labelCol="{ style: { width: '110px' } }"
        />
        <AddProjectCodeModal
            ref="addProjectCodeModalDom"
            v-if="showAddProjectCodeModalDom"
            @getProjectInfo="getProjectInfo"
        />
    </TpfCollapse>
</template>

<script setup lang="tsx" name="orderBaseInfo">
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { ref, computed, unref, onMounted, defineAsyncComponent, watchEffect } from 'vue';
    import { getTpfOptionEnum } from '@/config';
    import { IResFactoryTreeList, useFactoryAPi, useProjectApi } from '@/api';
    import { checkRequired } from '@/formRuleConfig/Tpfrules';
    import { useOpenAntdModal } from '@/hooks';
    import type { Rule } from 'ant-design-vue/es/form';
    import { isEmpty } from 'lodash-es';

    const projectApi = useProjectApi();

    type Props = {
        productionOrder?: { [k: string]: any };
        orderSource?: string; //订单来源
    };

    const props = defineProps<Props>();

    const AddProjectCodeModal = defineAsyncComponent(() => import('./AddProjectCodeModal.vue'));

    const [addProjectCodeModalDom, openAddProjectCodeModalDom, showAddProjectCodeModalDom] =
        useOpenAntdModal();

    const {
        productionOrderTypeCodeEnum,
        equipmentDebugEnum,
        reportInOrderEnum,
        overProductionEnum,
        confirmLogicEnum
    } = getTpfOptionEnum();

    const companyFactoryTreeList = ref<IResFactoryTreeList[]>([]);

    const factoryAPi = useFactoryAPi();

    const TpfFormRef = ref<InstanceType<typeof TpfForm> | null>(null);

    const tpfFormRefData = computed(() => {
        return TpfFormRef.value;
    });

    const showOverProductionRatio = ref(false);
    const useInit = ref(false);

    watchEffect(() => {
        if (props.productionOrder && !isEmpty(props.productionOrder) && !unref(useInit)) {
            const {
                plannedStartDate = '',
                plannedEndDate = '',
                companyCode = '',
                factoryCode = ''
            } = props.productionOrder || {};
            const searchForm = {
                ...props.productionOrder,
                'plannedStartDate@_@plannedEndDate': [plannedStartDate, plannedEndDate]
            } as any;
            if (companyCode) {
                searchForm['companyCode@_@factoryCode'] = [companyCode, factoryCode];
            }
            unref(tpfFormRefData)?.setNewState(searchForm);
            showOverProductionRatio.value = searchForm.overProduction === '1';
            useInit.value = true;
        }
    });

    const projectCodeList = ref<any[]>([]);

    const queryPopProjectListByPage = async (projectCode: any = '') => {
        const res = await projectApi
            .queryPopProjectListByPage({
                page: 1,
                pageSize: 20,
                forbidden: '1',
                projectCode
            })
            .then(res => res.data.object.list || []);
        projectCodeList.value = res.map(item => ({
            ...item,
            showProjectName: `${item.projectCode}-${item.projectName}`
        }));
    };

    const initFormList = computed(() => {
        return [
            {
                type: 'TpfAutoComplete',
                field: 'projectCode',
                label: '项目编号',
                fieldNames: { label: 'showProjectName', value: 'projectCode' },
                options: unref(projectCodeList),
                onSearchInput: (val: any) => {
                    queryPopProjectListByPage(val);
                },
                onSelectValue: (row: any) => {
                    getProjectInfo(row);
                },
                onClickIcon: () => {
                    projectCodeList.value = [];
                    openAddProjectCodeModalDom();
                }
            },
            {
                type: 'Input',
                field: 'projectName',
                showDefaultValue: '',
                label: '项目名称',
                disabled: true
            },
            {
                type: 'Input',
                field: 'projectGroupCode',
                showDefaultValue: '',
                label: '项目集编号',
                disabled: true
            },
            {
                type: 'Input',
                field: 'projectGroupName',
                showDefaultValue: '',
                label: '项目集名称',
                disabled: true
            },
            {
                type: 'Select',
                field: 'orderTypeCode',
                showDefaultValue: 'PRODUCTION',
                label: '订单类型',
                disabled: props.orderSource === '3', //图纸云
                options: productionOrderTypeCodeEnum
            },
            {
                type: 'RangePicker',
                format: 'YYYY-MM-DD',
                valueFormat: 'YYYY-MM-DD',
                field: 'plannedStartDate@_@plannedEndDate',
                showDefaultValue: [],
                label: '计划日期',
                onChange: () => {
                    if (!unref(tpfFormRefData)?.newState.requirementDate) return;
                    unref(tpfFormRefData)?.validateFields('requirementDate');
                }
            },
            {
                type: 'DatePicker',
                format: 'YYYY-MM-DD',
                valueFormat: 'YYYY-MM-DD',
                field: 'requirementDate',
                showDefaultValue: '',
                label: '订单交期'
            },
            {
                type: 'Cascader',
                field: 'companyCode@_@factoryCode',
                showDefaultValue: [],
                label: '所属工厂',
                options: unref(companyFactoryTreeList),
                fieldNames: { label: 'rootName', value: 'rootCode', children: 'branchTree' }
            },
            {
                type: 'Select',
                field: 'equipmentDebug',
                showDefaultValue: '0',
                label: '装备调试',
                options: equipmentDebugEnum
            },

            {
                type: 'Select',
                field: 'reportInOrder',
                showDefaultValue: '0',
                label: '顺序报工',
                options: reportInOrderEnum
            },
            {
                type: 'Select',
                field: 'overProduction',
                showDefaultValue: '0',
                label: '超产',
                options: overProductionEnum,
                onChange: (val: any) => {
                    showOverProductionRatio.value = val === '1';
                    if (showOverProductionRatio.value) {
                        unref(tpfFormRefData)?.clearValidate(['overProductionRatio']);
                    }
                }
            },
            {
                type: 'InputNumber',
                controls: false,
                field: 'overProductionRatio',
                label: '超产比例(%)',
                visible: unref(showOverProductionRatio)
            },
            {
                type: 'Select',
                field: 'confirmLogic',
                showDefaultValue: '1',
                label: '报工计算逻辑',
                options: confirmLogicEnum
            },
            {
                type: 'Textarea',
                field: 'remark',
                showDefaultValue: '',
                rows: 1,
                label: '备注'
            }
        ];
    });

    const rules = computed(() => {
        return {
            orderTypeCode: [checkRequired()],
            'plannedStartDate@_@plannedEndDate': [checkRequired()],
            requirementDate: [
                checkRequired(),
                {
                    validator: (_rule: Rule, value: string) => {
                        if (!value) return Promise.resolve();
                        const plannedDate =
                            unref(tpfFormRefData)?.newState['plannedStartDate@_@plannedEndDate'];
                        if (!plannedDate || plannedDate.length !== 2) {
                            return Promise.resolve();
                        }
                        const plannedEndDate = plannedDate[1];
                        if (+new Date(plannedEndDate) > +new Date(value)) {
                            return Promise.reject('不能小于计划结束日期');
                        }
                        return Promise.resolve();
                    },
                    trigger: ['change', 'blur']
                }
            ],
            equipmentDebug: [checkRequired()],
            reportInOrder: [checkRequired()],
            overProduction: [checkRequired()],
            overProductionRatio: [checkRequired({ required: unref(showOverProductionRatio) })],
            confirmLogic: [checkRequired()]
        };
    });

    const getProjectInfo = (val: any = {}) => {
        if (TpfFormRef.value?.setNewState) {
            const {
                projectCode = '',
                projectName = '',
                projectGroupCode = '',
                projectGroupName = ''
            } = val;
            const info = { projectCode, projectName, projectGroupCode, projectGroupName };
            TpfFormRef.value.setNewState(info);
        }
    };

    const submit = async () => {
        return { productionOrder: await TpfFormRef.value?.onSubmit() };
    };
    const getCompanyFactoryTreeList = async () => {
        const res = await factoryAPi.getCompanyFactoryTreeList();
        companyFactoryTreeList.value = res.data.list;
    };

    onMounted(() => {
        getCompanyFactoryTreeList();
        queryPopProjectListByPage();
    });

    defineExpose({ submit });
</script>

<style lang="less" scoped></style>
