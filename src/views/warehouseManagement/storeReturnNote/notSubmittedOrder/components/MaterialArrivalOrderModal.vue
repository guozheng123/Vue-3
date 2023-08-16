<template>
    <TpfModal v-model:visible="visible" width="1000px" :title="title + '物料退货单'" height="480px">
        <a-form
            class="tpf-form"
            ref="formReff"
            :colProps="{ span: 6 }"
            :labelCol="{ style: { width: '90px' } }"
            :model="formState"
            :rules="rules"
        >
            <a-row class="t-w-full">
                <a-col :span="6">
                    <a-form-item label="退货单号" name="returnNo">
                        <a-input v-model:value="formState.returnNo" disabled />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="退货方式" name="returnTypeCode">
                        <a-select
                            @change="openReturnMethod"
                            v-model:value="formState.returnTypeCode"
                            :options="returnMethod"
                            :disabled="modelType === 1"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="到货单号" name="arrivalNo">
                        <a-input-search
                            readonly
                            allowClear
                            v-model:value="formState.arrivalNo"
                            @search="() => onOpentoTheTrackingNumber()"
                            :disabled="!flot || modelType === 1"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="移动类型" name="moveTypeCode">
                        <a-select
                            v-model:value="formState.moveTypeCode"
                            :options="movementType"
                            :disabled="modelType === 1"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="单位编号" name="customerSupplierCode">
                        <a-input-search
                            :disabled="flot || modelType === 1"
                            readonly
                            allowClear
                            v-model:value="formState.customerSupplierCode"
                            @search="() => openTravelMerchantModal()"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="单位名称" name="customerSupplierName">
                        <a-input v-model:value="formState.customerSupplierName" disabled />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="备注" name="remarks">
                        <a-textarea
                            v-model:value="formState.remarks"
                            :rows="1"
                            :disabled="modelType === 1"
                            :maxlength="50"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <LoadingSkeleton>
            <TpfTableLayout>
                <template #default="args">
                    <a-form :model="tableInfo" class="table-form t-flex-1 t-flex" ref="formRef">
                        <TpfTable
                            class="tpf-table-form"
                            v-bind="{ ...args, ...tableInfo, columns, seq: true }"
                    /></a-form>
                </template>
                <template #operateRight>
                    <a-button
                        type="primary"
                        class="tpf-button"
                        ghost
                        @click="onAdd"
                        :disabled="flot"
                    >
                        <SvgIcon type="icon-xinzeng" />新增
                    </a-button>
                    <a-button
                        class="tpf-button"
                        type="primary"
                        :disabled="isEmpty(selectedRowInfo.selectedRowKeys)"
                        @click="delSelectRow()"
                        ghost
                    >
                        <SvgIcon type="icon-shanchu" /> 删除
                    </a-button>
                </template>
            </TpfTableLayout>
        </LoadingSkeleton>

        <template #footerRight>
            <a-button class="tpf-button" @click="setVisible(false)">取消</a-button>
            <a-button class="tpf-button" type="primary" :loading="loading" @click="onNext()">
                保存
            </a-button>
        </template>
        <!-- 选择客商 -->
        <TravelMerchantModal
            ref="travelMerchantModalDom"
            v-if="showTravelMerchantModal"
            @getData="getTravelMerchant"
        />
        <!-- 选择到货单号 -->
        <ToTheTrackingNumber
            ref="toTheTrackingNumber"
            v-if="toTheTrackingNumberShow"
            @getArrive="getToTheTrackingNumber"
        />
        <!-- 选择库存物料 -->
        <AddMaterialModal
            ref="addMaterialModal"
            v-if="addMaterialModalShow"
            @getMaterialInfo="getMaterial"
            fieldName="detailDtoList"
            :list="returnGoods.detailDtoList"
        />
    </TpfModal>
</template>

<script setup lang="tsx">
    import { useWarehouseApi, useMaterialApi } from '@/api';
    import { checkRequired, checkNoChinese } from '@/formRuleConfig/Tpfrules';
    import { isEmpty } from 'lodash-es';
    import { useOpenAntdModal, useRef, useAntdTable, useAntdForm } from '@/hooks';
    import TpfModal from '@/components/TpfModal/index.vue';
    import { ref, unref, defineAsyncComponent, computed, watchEffect, watch } from 'vue';
    import { tableResizable, getTpfOptionEnum } from '@/config';
    import type { TpfValidateRule } from '@/types';
    import { FormItem, Select, Input, message } from 'ant-design-vue';
    import AddMaterialModal from './AddMaterialModal.vue';
    import ToTheTrackingNumber from './ToTheTrackingNumber.vue';
    import TpfInputNumber from '@/components/TpfInputNumber/index.vue';
    import { useTravelMerchantModal } from '@/components';
    import { v4 } from 'uuid';
    import { unionBy } from 'lodash-es';
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

    const [addMaterialModal, onOpenAddMaterialModal, addMaterialModalShow] = useOpenAntdModal();

    const [toTheTrackingNumber, onOpentoTheTrackingNumber, toTheTrackingNumberShow] =
        useOpenAntdModal();

    const warehouseApi = useWarehouseApi();

    const materialApi = useMaterialApi();

    const returnGoods = ref<any>({});

    const emit = defineEmits<{
        (e: 'onGetTableList'): void;
    }>();

    const { formRef, submitForm, resetFields, clearValidate } = useAntdForm();

    const [visible, setVisible] = useRef(false);

    const { returnMethod, movementType } = getTpfOptionEnum();

    const modelType = ref(0);
    const loading = ref(false);
    const formState = ref({
        returnNo: '', //退货单号
        returnTypeCode: '0', //退货单类型
        arrivalNo: '', //到货单号
        moveTypeCode: '', //移动类型
        remarks: '', //备注
        customerSupplierCode: '', //单位编号
        customerSupplierName: '' //单位名称
    });

    const columns = computed(() => {
        return [
            { title: '项目编号', dataIndex: 'projectCode', ...tableResizable() },
            {
                title: '采购订单号',
                dataIndex: 'purchaseOrderNo',
                ...tableResizable(),
                customRender: ({ record, index }: { record: any; index: any }) => {
                    return (
                        <FormItem
                            name={['dataSource', index, 'purchaseOrderNo']}
                            rules={[checkNoChinese()] as any}
                        >
                            <Input
                                disabled={formState.value.returnTypeCode === '0'}
                                v-model={[record.purchaseOrderNo, 'value']}
                                maxlength={20}
                            />
                        </FormItem>
                    );
                }
            },
            { title: '批次号', dataIndex: 'batchNo', ...tableResizable() },
            { title: '物料编号', dataIndex: 'materialCode', ...tableResizable() },
            { title: '物料名称', dataIndex: 'materialName', ...tableResizable() },
            {
                title: () => <span class="required"> 退货数</span>,
                dataIndex: 'returnNum',
                ...tableResizable(),
                customRender: ({ record, index }: { record: any; index: any }) => {
                    return (
                        <FormItem
                            name={['dataSource', index, 'returnNum']}
                            rules={[checkRequired()] as any}
                        >
                            <TpfInputNumber
                                style={{ width: '90%' }}
                                v-model={[record.returnNum, 'value']}
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
                title: '退货单位',
                dataIndex: 'returnUnitName',
                ...tableResizable(),
                customRender: ({ record, index }: { record: any; index: any }) => {
                    return (
                        <Select
                            options={record.inCWList}
                            v-model={[record.materialAuxiliaryUnitCode, 'value']}
                            disabled={formState.value.returnTypeCode === '0'}
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
                            placeholder={record.returnUnitName}
                        />
                    );
                }
            },
            {
                title: '基本数量',
                dataIndex: 'returnBasicNum',
                ...tableResizable()
            },
            { title: '基本单位', dataIndex: 'basicUnit', ...tableResizable() },
            {
                title: '仓位名称',
                dataIndex: 'positionName',
                ...tableResizable()
            },
            { title: '库位名称', dataIndex: 'storeLocationName', ...tableResizable() },
            {
                title: '说明',
                dataIndex: 'descriptions',
                ...tableResizable(),
                customRender: ({ record, index }: { record: any; index: any }) => {
                    return <Input v-model={[record.descriptions, 'value']} maxlength={50} />;
                }
            }
        ];
    });

    // 退货方式onChange方法
    const openReturnMethod = async (value: any) => {
        if (value === '1') {
            //移除表单项校验
            formReff.value.clearValidate('arrivalNo');
            formState.value.arrivalNo = '';
            setTableList([]);
        } else {
            //移除表单项校验
            formReff.value.clearValidate('customerSupplierCode');
            formState.value.customerSupplierCode = '';
            formState.value.customerSupplierName = '';
            setTableList([]);
        }
    };

    const flot = ref(true);
    // 点击新增触发弹框
    const onAdd = async () => {
        for (const key in unref(formState)) {
            if (!unref(formState)[key] && !['id', 'sourceNo'].includes(key)) {
                // isEmpty = true;
                break;
            }
        }
        onOpenAddMaterialModal();
    };

    const getTravelMerchant = (data: any) => {
        const { customerSupplierCode, customerSupplierName } = data;
        formState.value = {
            ...formState.value,
            customerSupplierCode,
            customerSupplierName
        };
    };

    // 库存物料
    const getMaterial = (data: any) => {
        data.forEach((item: any) => {
            setTableList([...unref(getTableList()), { ...item, returnNum: '', uuid: v4() }]);
        });
    };

    // 到货单号
    const getToTheTrackingNumber = async (data: any) => {
        console.log(data, 'data');
        const {
            arrivalNo,
            customerSupplierCode,
            customerSupplierCodeName: customerSupplierName
        } = data;
        formState.value = {
            ...formState.value,
            arrivalNo,
            customerSupplierCode,
            customerSupplierName
        };
        const res = await warehouseApi.byarrivalno({
            arrivalNo
        });
        res.data.list.forEach((item: any) => {
            setTableList(unionBy([...unref(getTableList()), { ...item, uuid: v4() }], 'arrivalNo'));
        });
    };

    // 校验
    const rules = computed(() => {
        return {
            returnTypeCode: [checkRequired()],
            moveTypeCode: [checkRequired()],
            arrivalNo: [checkRequired({ required: unref(formState).returnTypeCode === '0' })],
            customerSupplierCode: [
                checkRequired({ required: unref(formState).returnTypeCode === '1' })
            ]
        } as TpfValidateRule;
    });

    const { tableInfo, selectedRowInfo, getTableList, setTableList, delSelectRow, getDataList } =
        useAntdTable({
            api: async () => ({ list: [] as any[] }),
            rowKey: 'uuid',
            isPageAble: false,
            hasRowSelection: true
        });

    const onGetArrivalUnit = async (record: any, index: number) => {
        try {
            if (record?.inCWList?.length && !record.onload) return;
            const res = await materialApi.getMaterialProductUnitList({
                materialCode: record.materialCode,
                enable: 1
            });
            res.data?.list.forEach((item: any) => {
                item.materialAuxiliaryUnitCode =
                    item.materialAuxiliaryUnitCode || item.materialUnitName;
                item.materialAuxiliaryUnitName =
                    item.materialAuxiliaryUnitName || item.returnUnitName;
            });
            record.inCWList = res.data.list || [];
            record.onload = false;
        } catch (error) {
            console.log(error);
        }
    };

    const onGetBasicNum = (record: any, index: number) => {
        if (record?.inCWList?.length && record.materialAuxiliaryUnitCode && record.returnNum) {
            const l = record.inCWList.filter(
                (item: any) => item.materialAuxiliaryUnitCode === record.materialAuxiliaryUnitCode
            );
            if (l.length) {
                const curData = l[0];
                record.returnBasicNum = Number(
                    (
                        record.returnNum *
                        (curData.materialUnitUsage / curData.materialAuxiliaryUnitUsage)
                    ).toFixed(8)
                );
            }
        } else {
            record.returnBasicNum = record.returnNum / record.convertRate;
        }
    };

    const formReff: any = ref(null);

    const onNext = async () => {
        const dataArray = tableInfo.value.dataSource || [];
        try {
            await submitForm();
            await formReff.value.validateFields();
            loading.value = true;
            const res = await warehouseApi[
                modelType.value === 1 ? 'updatedetail' : 'addMaterialreturn'
            ]({
                ...formState.value,
                materialReturnDetailAddReqDtos: [
                    ...unref(dataArray).map(item => {
                        const unitCode =
                            item.inCWList?.map(
                                (item: any) =>
                                    item.materialAuxiliaryUnitCode || item.materialUnitCode
                            ) || [];
                        return {
                            projectCode: item.projectCode,
                            batchNo: item.batchNo,
                            purchaseOrderNo: item.purchaseOrderNo,
                            materialCode: item.materialCode,
                            returnNum: item.returnNum,
                            returnBasicNum: item.returnBasicNum,
                            returnUnitCode: unitCode[0] || item.returnUnitCode,
                            positionCode: item.positionCode,
                            storeLocationCode: item.storeLocationCode,
                            descriptions: item.descriptions,
                            orgCode: item.orgCode || '',
                            returnDetailNo: modelType.value === 1 ? item.returnDetailNo : undefined
                        };
                    })
                ],
                arrivalNo:
                    formState.value.returnTypeCode === '0' ? formState.value.arrivalNo : undefined,
                returnNo: modelType.value === 1 ? formState.value.returnNo || '' : undefined
            });
            if (res.errorCode === '0') {
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

    const onGetEditTable = async (materialReturnNo: string) => {
        try {
            const { materialReturnDetailEdits = [], ...args } = await warehouseApi
                .querydetailtoeidt({ materialReturnNo })
                .then(res => res.data.object || {});
            setTableList(materialReturnDetailEdits.map((item: any) => ({ ...item, uuid: v4() })));
            formState.value = args;
        } catch (error) {
            console.log(error);
        } finally {
            loading.value = false;
        }
    };

    watchEffect(() => {
        if (formState.value.returnTypeCode === '0') {
            flot.value = true;
        } else {
            flot.value = false;
        }
    });

    const open = (type: number, data: any = {}) => {
        modelType.value = type;
        getDataList();
        setVisible(!visible.value);
        if (type === 1) {
            onGetEditTable(data.return_no);
        } else {
            formState.value = data;
            formState.value.returnTypeCode = '0';
        }
    };

    const getModelType = computed(() => unref(modelType) === 0);
    const title = computed(() => {
        if (unref(getModelType)) return '新增 - ';
        return '编辑 - ';
    });
    defineExpose({ open });
</script>
