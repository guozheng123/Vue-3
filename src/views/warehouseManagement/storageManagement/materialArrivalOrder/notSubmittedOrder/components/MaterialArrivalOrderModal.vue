<template>
    <TpfModal
        class="material-arrival-order-modal"
        v-model:visible="visible"
        width="1000px"
        :title="title + '物料到货单'"
        height="400px"
    >
        <TpfLayout>
            <template #header>
                <a-form :model="formState">
                    <div class="form-box">
                        <a-row :gutter="24">
                            <a-col :span="6">
                                <a-form-item label="单位编号" required>
                                    <a-input-search
                                        :disabled="Boolean(modelType)"
                                        readonly
                                        allowClear
                                        v-model:value="formState.customerSupplierCode"
                                        @search="() => openTravelMerchantModal()"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="6">
                                <a-form-item label="单位名称" required>
                                    <a-input
                                        v-model:value="formState.customerSupplierCodeName"
                                        disabled
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="6">
                                <a-form-item label="来源单号">
                                    <a-input :maxlength="20" v-model:value="formState.sourceNo" />
                                </a-form-item>
                            </a-col>
                            <a-col :span="6">
                                <a-form-item label="移动类型" required>
                                    <a-select v-model:value="formState.moveTypeCode">
                                        <a-select-option
                                            v-for="item in moveTypeList"
                                            :value="item.value"
                                            :key="item.value"
                                            >{{ item.label }}</a-select-option
                                        >
                                    </a-select>
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </div>
                </a-form>
            </template>
            <template #content>
                <LoadingSkeleton>
                    <TpfTableLayout>
                        <template #default="args">
                            <a-form ref="formRef" :model="tableForm" class="table-form">
                                <TpfTable
                                    class="tpf-table-form"
                                    v-bind="{
                                        ...args,
                                        ...tableInfo,
                                        columns,
                                        seq: true
                                    }"
                                    :dataSource="dataSource"
                            /></a-form>
                        </template>
                        <template #operateRight>
                            <a-button
                                v-show="!modelType"
                                type="primary"
                                class="tpf-button"
                                ghost
                                @click="onAdd"
                            >
                                <SvgIcon type="icon-xinzeng" />新增
                            </a-button>
                            <a-button
                                class="tpf-button"
                                type="primary"
                                :disabled="isEmpty(selectedRowInfo.selectedRowKeys)"
                                @click="onDelete"
                                ghost
                            >
                                <SvgIcon type="icon-shanchu" /> 删除
                            </a-button>
                        </template>
                    </TpfTableLayout>
                </LoadingSkeleton>
            </template>
        </TpfLayout>

        <template #footerRight>
            <a-button class="tpf-button" @click="setVisible(false)">取消</a-button>
            <a-button
                class="tpf-button"
                type="primary"
                :disabled="isEmpty(unref(dataSource))"
                :loading="loading"
                @click="onNext('0')"
            >
                保存
            </a-button>
            <a-button
                :disabled="isEmpty(unref(dataSource))"
                class="tpf-button"
                type="primary"
                :loading="loading"
                @click="onNext('1')"
            >
                保存并提交
            </a-button>
        </template>
        <TravelMerchantModal
            ref="travelMerchantModalDom"
            v-if="showTravelMerchantModal"
            @getData="getTravelMerchant"
        />
        <AddProcessFromMaterielModal
            v-if="showAddProcessFromMaterielModalDom"
            ref="addProcessFromMaterielModalDom"
            @getMaterialCode="getMaterial"
        />
    </TpfModal>
</template>

<script setup lang="tsx" name="materialArrivalOrderModal">
    import { useProjectApi, useWarehouseApi, useMaterialApi } from '@/api';
    import { checkRequired, checkGreaterThan, checkNoChinese } from '@/formRuleConfig/Tpfrules';
    import { isEmpty } from 'lodash-es';
    import { useRef, useAntdTable, useAntdForm } from '@/hooks';
    import TpfModal from '@/components/TpfModal/index.vue';
    import { ref, unref, reactive, toRefs, defineAsyncComponent, computed } from 'vue';
    import { tableResizable, getTpfOptionEnum } from '@/config';
    import type { TpfColumnType } from '@/types';
    import { FormItem, Select, Input, message } from 'ant-design-vue';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { debounce } from 'lodash-es';
    import TpfInputNumber from '@/components/TpfInputNumber/index.vue';
    import { useTravelMerchantModal, useAddProcessFromMaterielModal } from '@/components';
    import BigNumber from 'bignumber.js';
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));
    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const {
        TravelMerchantModal,
        travelMerchantModalDom,
        openTravelMerchantModal,
        showTravelMerchantModal
    } = useTravelMerchantModal();
    const {
        AddProcessFromMaterielModal,
        addProcessFromMaterielModalDom,
        openAddProcessFromMaterielModalDom,
        showAddProcessFromMaterielModalDom
    } = useAddProcessFromMaterielModal();
    const projectApi = useProjectApi();
    const warehouseApi = useWarehouseApi();
    const materialApi = useMaterialApi();
    const emit = defineEmits<{
        (e: 'onGetTableList'): void;
    }>();
    const { formRef, submitForm } = useAntdForm();
    const [visible, setVisible] = useRef(false);
    const tableForm = reactive<{ dataSource: { [k: string]: any }[] }>({
        dataSource: []
    });
    const { moveTypeList } = getTpfOptionEnum();
    const { dataSource } = toRefs(tableForm);
    let countId = 1;
    let editInfoData: { [k: string]: any } = {};
    const modelType = ref(0);
    const loading = ref(false);
    const formState = ref({
        customerSupplierCode: '',
        customerSupplierCodeName: '',
        sourceNo: '',
        moveTypeCode: 'R02'
    });

    const columns = ref<TpfColumnType[]>([
        {
            title: '物料编号',
            dataIndex: 'materialCode',
            ...tableResizable()
        },
        {
            title: '物料名称',
            dataIndex: 'materialName',
            ...tableResizable()
        },
        {
            title: '项目编号',
            dataIndex: 'projectCode',
            width: 260,
            customRender: ({ record, index }) => {
                return (
                    <FormItem
                        name={['dataSource', index, 'projectCode']}
                        rules={[
                            {
                                required: record.isOnLoadSearchProject && !record.outKWList.length,
                                trigger: ['blur'],
                                message: '未检索到项目'
                            }
                        ]}
                    >
                        <Select
                            options={record.outKWList}
                            allowClear
                            show-search
                            loading={record.loading}
                            v-model={[record.projectCode, 'value']}
                            style={{ width: '90%' }}
                            onSearch={(value: string) => onSearchProjectList(record, value)}
                            onFocus={() => onSearchProjectList(record)}
                        />
                    </FormItem>
                );
            }
        },
        {
            title: '批次号',
            dataIndex: 'batchNo',
            ...tableResizable(),
            customRender: ({ record, index }) => {
                return (
                    <FormItem
                        name={['dataSource', index, 'batchNo']}
                        rules={
                            record.supervisorModeName === '批次管理' ||
                            record.supervisorModeCode === '1'
                                ? ([checkRequired(), checkNoChinese()] as any)
                                : ([checkNoChinese()] as any)
                        }
                    >
                        <Input v-model={[record.batchNo, 'value']} maxlength={20} />
                    </FormItem>
                );
            }
        },
        {
            title: () => <span class="required"> 到货数</span>,
            dataIndex: 'arrivalNum',
            ...tableResizable(),
            customRender: ({ record, index }) => {
                return (
                    <FormItem
                        name={['dataSource', index, 'arrivalNum']}
                        rules={[checkRequired(), checkGreaterThan()] as any}
                    >
                        <TpfInputNumber
                            style={{ width: '90%' }}
                            v-model={[record.arrivalNum, 'value']}
                            {...{
                                onChange: () => {
                                    onGetBasicNum(record, index);
                                }
                            }}
                        />
                    </FormItem>
                );
            }
        },
        {
            title: '到货单位',
            dataIndex: 'materialAuxiliaryUnitCode',
            ...tableResizable(),
            customRender: ({ record, index }) => {
                return (
                    <Select
                        options={record.inCWList}
                        v-model={[record.materialAuxiliaryUnitCode, 'value']}
                        fieldNames={{
                            label: 'materialAuxiliaryUnitName',
                            value: 'materialAuxiliaryUnitCode'
                        }}
                        style={{ width: '90%' }}
                        onFocus={() => {
                            {
                                onGetArrivalUnit(record, index);
                            }
                        }}
                        onChange={() => onGetBasicNum(record, index)}
                    />
                );
            }
        },
        {
            title: '基本数量',
            dataIndex: 'basicNum',
            ...tableResizable()
        },
        {
            title: '基本单位',
            dataIndex: 'materialUnitName',
            ...tableResizable()
        },
        {
            title: '备注',
            dataIndex: 'remarks',
            ...tableResizable(),
            customRender: ({ record, index }) => {
                return <Input v-model={[record.remarks, 'value']} maxlength={50} />;
            }
        }
    ]);

    const onAdd = async () => {
        let isEmpty = false;
        for (const key in unref(formState)) {
            if (!unref(formState)[key] && !['id', 'sourceNo'].includes(key)) {
                isEmpty = true;
                break;
            }
        }
        if (isEmpty) {
            message.warning('请选择单位编号！');
            return;
        }
        openAddProcessFromMaterielModalDom();
    };

    const { tableInfo, selectedRowInfo } = useAntdTable({
        api: async () => {
            return { list: [] };
        },
        rowKey: 'countId',
        isPageAble: false,
        hasRowSelection: true
    });

    const getTravelMerchant = (data: any) => {
        const { customerSupplierCode = '', customerSupplierName = '' } = data;
        formState.value.customerSupplierCode = customerSupplierCode;
        formState.value.customerSupplierCodeName = customerSupplierName;
    };

    const getMaterial = (data: any) => {
        data.forEach((item: any) => {
            item.inCWList = [
                {
                    materialAuxiliaryUnitName: item.materialUnitName,
                    materialAuxiliaryUnitCode: item.materialUnitCode,
                    materialAuxiliaryUnitUsage: item.materialUnitUsage || 1,
                    materialUnitUsage: item.materialUnitUsage || 1
                }
            ];
            dataSource.value.push({
                countId,
                ...item,
                arrivalNum: '',
                onload: true,
                materialAuxiliaryUnitCode: item.materialUnitCode
            });
            countId++;
        });
    };

    const onGetArrivalUnit = async (record: any, index: number) => {
        try {
            if (record?.inCWList?.length && !record.onload) return;
            const res = await materialApi.getMaterialProductUnitList({
                materialCode: record.materialCode,
                enable: 1
            });
            res.data?.list.forEach((item: any) => {
                item.materialAuxiliaryUnitCode =
                    item.materialAuxiliaryUnitCode || item.materialUnitCode;
                item.materialAuxiliaryUnitName =
                    item.materialAuxiliaryUnitName || item.materialUnitName;
            });
            dataSource.value[index].inCWList = res.data.list || [];
            dataSource.value[index].onload = false;
            dataSource.value[index].convertRate = 0;
        } catch (error) {
            console.log(error);
        }
    };

    const onGetBasicNum = (record: any, index: number) => {
        if (!unref(getModelType) && record.convertRate) {
            dataSource.value[index].basicNum = new BigNumber(
                Number((record.arrivalNum * record.convertRate).toFixed(8))
            ).toFixed();
            return;
        }
        if (record?.inCWList?.length && record.materialAuxiliaryUnitCode && record.arrivalNum) {
            const l = record.inCWList.filter(
                (item: any) => item.materialAuxiliaryUnitCode === record.materialAuxiliaryUnitCode
            );
            if (l.length) {
                const curData = l[0];
                dataSource.value[index].basicNum = new BigNumber(
                    Number(
                        (
                            record.arrivalNum *
                            (curData.materialUnitUsage / curData.materialAuxiliaryUnitUsage)
                        ).toFixed(8)
                    )
                ).toFixed();
            }
        } else {
            dataSource.value[index].basicNum = '';
        }
    };

    const onSearchProjectList = debounce(async (record: any, value?: string) => {
        try {
            record.loading = true;
            const res = await projectApi.queryProjectListByPage({
                forbidden: '1',
                pageSize: 50,
                page: 1,
                projectCode: value
            });
            record.outKWList = res.data.object?.list.map(item => ({
                label: `${item.projectName} (${item.projectCode})`,
                value: item.projectCode
            }));
            record.isOnLoadSearchProject = true;
        } catch (error) {
            console.log(error);
        } finally {
            record.loading = false;
        }
    }, 300);

    const onNext = async (type: string) => {
        try {
            await submitForm();
            loading.value = true;
            const { errorCode } = await warehouseApi[
                !unref(getModelType) ? 'addSubmitMaterialData' : 'addToBeSubmittedManifest'
            ]({
                ...unref(formState),
                isSubmit: type,
                materialDataDetailList: [
                    ...unref(dataSource).map(item => {
                        const curCW =
                            item?.inCWList?.filter(
                                (v: any) =>
                                    v.materialAuxiliaryUnitCode === item.materialAuxiliaryUnitCode
                            )[0] || null;
                        return {
                            materialCode: item.materialCode,
                            projectCode: item.projectCode,
                            batchNo: item.batchNo,
                            arrivalNum: item.arrivalNum,
                            arrivalUnit:
                                item?.inCWList?.filter(
                                    (v: any) =>
                                        v.materialAuxiliaryUnitCode ===
                                        item.materialAuxiliaryUnitCode
                                )[0].materialAuxiliaryUnitName || '',
                            convertRate:
                                item.convertRate ||
                                (curCW &&
                                    (
                                        curCW.materialUnitUsage / curCW.materialAuxiliaryUnitUsage
                                    ).toFixed(8)) ||
                                '',
                            remarks: item.remarks,
                            basicNum: item.basicNum,
                            materialAuxiliaryUnitCode: item.materialAuxiliaryUnitCode,
                            materialArrivalId: !unref(getModelType) ? +item.materialArrivalId : null
                        };
                    })
                ],
                arrivalNo: !unref(getModelType) ? editInfoData.arrival_no : undefined
            });
            if (errorCode === '0') {
                setVisible(!visible.value);
                message.success('操作成功！');
                emit('onGetTableList');
            }
        } catch (error) {
            console.log(error);
        } finally {
            loading.value = false;
        }
    };

    const onDelete = async () => {
        try {
            const { selectedRowKeys, selectedRows } = unref(selectedRowInfo);
            if (!unref(getModelType)) {
                if (selectedRowKeys.length === dataSource.value.length) {
                    message.warning('物料到货单明细至少保留一条！');
                    return;
                }
                loading.value = true;
                const res = await warehouseApi.deleteMaterialArrivalDetails({
                    ids: selectedRows.reduce((pre: any, cur: any) => {
                        if (selectedRowKeys.includes(cur.countId)) {
                            pre.push(cur.materialArrivalId);
                            return pre;
                        }
                    }, []),
                    arrivalNo: editInfoData.arrival_no
                });
                message.success('删除成功！');
            }
            dataSource.value = dataSource.value.filter(item => {
                if (!selectedRowKeys.includes(item.countId)) return item;
            });
            selectedRowInfo.value.selectedRowKeys = [];
        } catch (error) {
            console.log(error);
        } finally {
            loading.value = false;
        }
    };

    const onGetEditTable = async () => {
        try {
            loading.value = true;
            const { data } = await warehouseApi.queryMaterialArrivalToEdit({
                arrivalNo: editInfoData.arrival_no
            });
            if (data.object?.materialDetailDataList) {
                dataSource.value = data.object.materialDetailDataList.map((item: any) => {
                    item.countId = countId;
                    item.inCWList = [
                        {
                            materialAuxiliaryUnitName: item.arrivalUnit,
                            materialAuxiliaryUnitCode: item.materialAuxiliaryUnitCode
                        }
                    ];
                    item.onload = true;
                    countId++;
                    return item;
                });
            }
            for (const key in unref(formState)) {
                formState.value[key] = data.object[key] || '';
            }
        } catch (error) {
            console.log(error);
        } finally {
            loading.value = false;
        }
    };

    const open = (type: number, data: any) => {
        modelType.value = type;
        onReset(data);
        setVisible(!visible.value);
        if (type === 1) {
            editInfoData = data;
            onGetEditTable();
        }
    };

    const onReset = (data = {}) => {
        for (const key in unref(formState)) {
            formState.value[key] = data[key] || '';
            if (key === 'moveTypeCode' && unref(getModelType)) formState.value[key] = 'R02';
        }
        dataSource.value = [];
    };
    const getModelType = computed(() => (unref(modelType) === 0 ? true : false));
    const title = computed(() => {
        if (unref(getModelType)) return '新增 - ';
        return '编辑 - ';
    });
    defineExpose({ open });
</script>

<style scoped lang="less">
    .tpf-table-form {
        height: 280px;
    }

    :deep(.ant-row) {
        margin: 0 !important;
    }
</style>
