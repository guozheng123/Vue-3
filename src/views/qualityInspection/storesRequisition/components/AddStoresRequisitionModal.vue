<template>
    <TpfModal v-model:visible="visible" width="1000px" height="500px" :title="showTitle">
        <LoadingSkeleton>
            <TpfSubmitForm
                v-show="!isDetail"
                :formList="initFormList"
                ref="TpfFormRef"
                :labelCol="{ style: { width: '80px' } }"
            />
        </LoadingSkeleton>
        <LoadingSkeleton>
            <TpfTableLayout :hiddenOperate="isDetail">
                <template #default="args">
                    <a-form
                        style="height: 100%"
                        ref="formRef"
                        :model="tableInfo"
                        class="table-form"
                    >
                        <TpfTable
                            class="tpf-table-form"
                            v-bind="{ ...args, ...tableInfo, pagination, seq: true, columns }"
                            :rowSelection="isDetail ? null : tableInfo.rowSelection"
                        />
                    </a-form>
                </template>
                <template #operateLeft>
                    <TpfButton :btnList="btnList" />
                </template>
            </TpfTableLayout>
        </LoadingSkeleton>
        <template #footerRight>
            <TpfButton :btnList="operateBtnList" />
        </template>
    </TpfModal>
    <AddProcessFromMaterielModal
        v-if="showAddProcessFromMaterielModalDom"
        ref="addProcessFromMaterielModalDom"
        @getMaterialCode="getMaterialCode"
    />
</template>

<script setup lang="tsx">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useRef, useAntdTable, useAntdForm } from '@/hooks';
    import { computed, defineAsyncComponent, ref, unref } from 'vue';
    import { getDepartmentTreeList, useProjectApi, useMaterialRequisitionApi } from '@/api';
    import type { ResQueryPopProjectListByPage, ResQueryMaterialPopoutListByPage } from '@/api';
    import type { TpfColumnType } from '@/types';
    import { useAddProcessFromMaterielModal, useTpfSubmitForm } from '@/components';
    import { getTpfOptionEnum } from '@/config';
    import { isEmpty, cloneDeep } from 'lodash-es';
    import TpfInputNumber from '@/components/TpfInputNumber/index.vue';
    import TpfButton from '@/components/TpfButton/index.vue';
    import { checkRequired, checkMoreZero } from '@/formRuleConfig/Tpfrules';
    import { FormItem, Textarea } from 'ant-design-vue';

    const { receiveTypeList, getLabel } = getTpfOptionEnum();

    const projectApi = useProjectApi();

    const materialRequisitionApi = useMaterialRequisitionApi();

    const currentRowInfo = ref<any>({});

    const {
        AddProcessFromMaterielModal,
        addProcessFromMaterielModalDom,
        openAddProcessFromMaterielModalDom,
        showAddProcessFromMaterielModalDom
    } = useAddProcessFromMaterielModal();
    const { TpfSubmitForm } = useTpfSubmitForm();

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const emit = defineEmits<{
        (e: 'updateTable'): void;
    }>();

    const { treeData, ops } = getDepartmentTreeList();

    const TpfFormRef = ref<InstanceType<typeof TpfSubmitForm> | null>(null);
    const projectList = ref<ResQueryPopProjectListByPage[]>([]);

    const { formRef, validateFields } = useAntdForm();

    const isDetail = ref(false);

    const initFormList = computed(() => {
        const disabled = !!unref(currentRowInfo).material_requisition_order_code;
        return [
            {
                type: 'TreeSelect',
                field: 'departmentId',
                label: '部门',
                treeData: treeData.value,
                disabled,
                ...ops
            },
            {
                type: 'Select',
                field: 'projectCode',
                label: '项目名称',
                options: projectList.value,
                disabled,
                fieldNames: { label: 'projectName', value: 'projectCode', options: 'options' }
            },
            {
                type: 'Select',
                field: 'receiveType',
                label: '领料类型',
                disabled,
                options: receiveTypeList
            }
        ];
    });

    const [visible, setVisible] = useRef(false);

    const editColumns = computed<TpfColumnType[]>(() => {
        const projectCode = TpfFormRef.value?.newState.projectCode;
        const projectName = getLabel(projectCode, unref(projectList), {
            label: 'projectName',
            value: 'projectCode'
        });
        return [
            { title: '物料编号', dataIndex: 'materialCode' },
            { title: '物料名称', dataIndex: 'materialName' },
            { title: '物料规格', dataIndex: 'materialSpec' },
            {
                title: '项目编号',
                dataIndex: 'projectCode',
                customRender: ({ text }) => projectCode
            },
            { title: '项目名称', dataIndex: 'projectName', customRender: () => projectName },
            { title: '作业工单编号', dataIndex: 'workOrderCode' },
            { title: '工序名称', dataIndex: 'operationName' },
            {
                title: () => <span class="required"> 领料数</span>,
                dataIndex: 'requisitionNumber',
                customRender: ({ record, text, index }) => {
                    return (
                        <FormItem
                            name={['dataSource', index, 'requisitionNumber']}
                            rules={[checkRequired(), checkMoreZero()] as any}
                        >
                            <TpfInputNumber
                                min={0}
                                style={{ width: '90%' }}
                                v-model={[record.requisitionNumber, 'value']}
                            />
                        </FormItem>
                    );
                }
            },
            { title: '领料单位', dataIndex: 'productUnitCode' },
            { title: '替代料编号', dataIndex: 'storageName' },
            { title: '替代料名称', dataIndex: 'storageName' },
            { title: '基本数量', dataIndex: 'basicNumber' },
            { title: '基本单位', dataIndex: 'basicUnitName' },
            {
                title: '备注',
                dataIndex: 'remark',
                customRender: ({ record, index }) => {
                    return (
                        <FormItem name={['dataSource', index, 'remark']}>
                            <Textarea v-model={[record.remark, 'value']} rows={1} maxlength={50} />
                        </FormItem>
                    );
                }
            }
        ];
    });

    const detailColumns = [
        { title: '物料编号', dataIndex: 'materialCode' },
        { title: '物料名称', dataIndex: 'materialName' },
        { title: '物料规格', dataIndex: 'materialSpec' },
        { title: '项目编号', dataIndex: 'projectCode' },
        { title: '项目名称', dataIndex: 'projectName' },
        { title: '生产订单编号', dataIndex: 'productionOrderCode' },
        { title: '作业工单编号', dataIndex: 'workOrderCode' },
        { title: '工序编号', dataIndex: 'operationCode' },
        { title: '工序名称', dataIndex: 'operationName' },
        { title: '领料数', dataIndex: 'requisitionNumber' },
        { title: '单位', dataIndex: 'productUnitCodeName' },
        { title: '出库数', dataIndex: 'outStorageNumber' },
        { title: '已退料数', dataIndex: 'returnedNumber' },
        { title: '替代料编号', dataIndex: 'replaceMaterialCode' },
        { title: '替代料名称', dataIndex: 'replaceMaterialName' },
        { title: '基本数量', dataIndex: 'basicNumber' },
        { title: '基本单位', dataIndex: 'basicUnitName' },
        { title: '备注', dataIndex: 'remark' },
        { title: '工步', dataIndex: 'workStep' },
        { title: '是否保税', dataIndex: 'isBonded' }
    ] as TpfColumnType[];

    const columns = computed(() => {
        if (isDetail.value) {
            return detailColumns;
        }
        return editColumns.value;
    });

    const queryPopProjectListByPage = async () => {
        projectList.value = await projectApi
            .queryPopProjectListByPage({
                page: 1,
                pageSize: 50,
                forbidden: '1'
            })
            .then(res => res.data.object.list);
    };

    const {
        loading,
        tableInfo,
        pagination,
        getDataList,
        setTableList,
        getTableList,
        delSelectRow,
        selectedRowInfo
    } = useAntdTable({
        api: async pagination => {
            return { list: [] as any[] };
        },
        rowKey: 'materialCode',
        isPageAble: false,
        hasRowSelection: true
    });
    const btnList = computed(() => {
        return [
            {
                title: '新增',
                props: { type: 'primary', onClick: () => onAdd() },
                icon: { type: 'icon-insert' }
            },
            {
                title: '删除',
                icon: { type: 'icon-shanchu' },
                props: {
                    type: 'primary',
                    onClick: () => delSelectRow(),
                    disabled: isEmpty(unref(selectedRowInfo).selectedRowKeys)
                }
            }
        ];
    });

    const operateBtnList = computed(() => {
        return [
            {
                title: isDetail.value ? '关闭' : '取消',
                props: { onClick: () => setVisible(false) }
            },
            {
                title: '保存',
                visible: !isDetail.value,
                props: {
                    type: 'primary',
                    onClick: () => onSave(),
                    disabled: isEmpty(unref(tableInfo).dataSource)
                }
            }
        ];
    });

    const onSave = async () => {
        await validateFields();
        const { material_requisition_order_code: materialRequisitionOrderCode } =
            unref(currentRowInfo);

        const operationMaterialList = unref(getTableList()).map(item => ({
            materialRequisitionOrderCode: item.materialRequisitionOrderCode,
            remark: item.remark,
            materialCode: item.materialCode,
            requisitionNumber: item.requisitionNumber
        }));
        if (materialRequisitionOrderCode) {
            //存在code 则为编辑
            const params = {
                materialRequisitionOrderCode,
                editItems: operationMaterialList
            };
            await materialRequisitionApi.editMaterialRequisition(params);
        } else {
            // 新增
            const params = {
                ...(await TpfFormRef.value?.onSubmit()),
                operationInfoList: [{ operationMaterialList }]
            };
            console.log('params', params);
            await materialRequisitionApi.create(params);
        }
        const { message } = await import('ant-design-vue');
        message.success('保存成功');
        emit('updateTable');
        setVisible(false);
    };

    const showTitle = computed(() => {
        if (isDetail.value) {
            return '详情';
        }
        if (unref(currentRowInfo).material_requisition_order_code) {
            return '编辑';
        }
        return '新增';
    });

    const getMaterialRequisitionByCode = async (row = {} as any) => {
        const { material_requisition_order_code: materialRequisitionOrderCode } = row || {};
        if (!materialRequisitionOrderCode) return;
        loading.value = true;
        const res = await materialRequisitionApi
            .getMaterialRequisitionByCode({
                materialRequisitionOrderCode
            })
            .then(res => res.data.object || {});

        const { departmentId, projectCode, receiveType, detailVoList } = res;
        setTableList(detailVoList || []);
        TpfFormRef.value?.setNewState({ departmentId, projectCode, receiveType });
        loading.value = false;
    };

    const open = (row = {}, status = false) => {
        isDetail.value = status;
        setTableList([]);
        currentRowInfo.value = cloneDeep(row) as any;

        setVisible(true);

        getMaterialRequisitionByCode(row);

        queryPopProjectListByPage();
    };

    const onAdd = () => {
        openAddProcessFromMaterielModalDom(unref(getTableList()));
    };

    const getMaterialCode = (list: ResQueryMaterialPopoutListByPage[]) => {
        const newList = list.map(item => ({ ...item, remark: '' }));
        setTableList([...unref(getTableList()), ...newList]);
    };

    getDataList();

    defineExpose({ open });
</script>
