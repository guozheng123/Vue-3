<template>
    <TpfModal
        v-model:visible="visible"
        width="1000px"
        height="500px"
        title="生成出库单"
        :body-style="{ padding: 0 }"
    >
        <div class="t-p-[12px]">
            领料申请单编号:{{ currentRowInfo.material_requisition_order_code }}
        </div>
        <LoadingSkeleton>
            <TpfTableLayout>
                <template #default="args">
                    <a-form ref="formRef" :model="tableInfo" class="table-form">
                        <TpfTable
                            class="tpf-table-form"
                            v-bind="{ ...args, ...tableInfo, pagination, seq: true, columns }"
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
    <OutboundModal
        v-if="showOutboundModalDom"
        ref="OutboundModalDom"
        @getBatchInfoList="getBatchInfoList"
    />
</template>

<script setup lang="tsx">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useRef, useAntdTable, useAntdForm, useOpenAntdModal, useBigNumber } from '@/hooks';
    import { computed, defineAsyncComponent, ref, unref } from 'vue';
    import { useMaterialRequisitionApi, useOutStorageApi } from '@/api';
    import type { TpfColumnType } from '@/types';
    import { isEmpty, cloneDeep, isArray } from 'lodash-es';
    import TpfInputNumber from '@/components/TpfInputNumber/index.vue';
    import TpfButton from '@/components/TpfButton/index.vue';
    import { checkRequired } from '@/formRuleConfig/Tpfrules';
    import { FormItem, Textarea } from 'ant-design-vue';
    import OutboundModal from './OutboundModal.vue';
    import { getTpfOptionEnum } from '@/config';
    const { plus } = useBigNumber();

    const { stockManagementTypeList, getLabel } = getTpfOptionEnum();

    const materialRequisitionApi = useMaterialRequisitionApi();

    const outStorageApi = useOutStorageApi();

    const currentRowInfo = ref<any>({});

    const [OutboundModalDom, openOutboundModalDom, showOutboundModalDom] = useOpenAntdModal();

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const emit = defineEmits<{
        (e: 'updateTable'): void;
    }>();

    const { formRef, validateFields } = useAntdForm();

    const [visible, setVisible] = useRef(false);

    const checkOutStorageNumber = (record: any) => {
        return {
            validator: async (_rule: any, value: string) => {
                if ([null, undefined, ''].includes(value)) {
                    return Promise.resolve();
                }
                if (Number(value) === 0) {
                    return Promise.reject('不可为0');
                }
                if (Number(value) > Number(record.requisitionNumber)) {
                    return Promise.reject('不可大于领料数');
                }

                return Promise.resolve();
            },
            trigger: ['change', 'blur']
        };
    };

    const columns = [
        { title: '物料编号', dataIndex: 'materialCode' },
        { title: '物料名称', dataIndex: 'materialName' },
        { title: '规格', dataIndex: 'specification' },
        { title: '项目编号', dataIndex: 'projectCode' },
        { title: '项目名称', dataIndex: 'projectName' },
        { title: '作业工单编号', dataIndex: 'workOrderCode' },
        { title: '工序编号', dataIndex: 'operationCode' },
        { title: '工序名称', dataIndex: 'operationName' },
        { title: '领料数', dataIndex: 'requisitionNumber' },
        {
            title: '出库数',
            dataIndex: 'outStorageNumber',
            customRender: ({ record, index }) => {
                return (
                    <FormItem
                        name={['dataSource', index, 'outStorageNumber']}
                        rules={[checkRequired(), checkOutStorageNumber(record)] as any}
                    >
                        <TpfInputNumber
                            disabled={record.disabled}
                            min={0}
                            style={{ width: '90%' }}
                            v-model={[record.outStorageNumber, 'value']}
                        />
                    </FormItem>
                );
            }
        },
        { title: '单位', dataIndex: 'productUnitCodeName' },
        { title: '替代料编号', dataIndex: 'replaceMaterialCode' },
        { title: '替代料名称', dataIndex: 'replaceMaterialName' },
        { title: '基本数量', dataIndex: 'basicNumber' },
        { title: '基本单位', dataIndex: 'basicUnitName' },
        {
            title: '出库方式',
            dataIndex: 'showText',
            customRender: ({ record }) => {
                let showText = '先进先出';
                if (isArray(record.batchInfoList) && record.batchInfoList.length) {
                    const hasNum = record.batchInfoList.some(
                        (item: any) => Number(item.outStorageNumber) > 0
                    );
                    if (hasNum) {
                        showText = getLabel(record.stockManagementType, stockManagementTypeList);
                    }
                }
                return (
                    <FormItem>
                        <span class="tpf-link" onClick={() => openOutboundModalDom(record)}>
                            {showText}
                        </span>
                    </FormItem>
                );
            }
        },
        { title: '现存量', dataIndex: 'isBonded' },
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
    ] as TpfColumnType[];

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
        api: async () => {
            return { list: [] as any[] };
        },
        rowKey: 'materialCode',
        isPageAble: false,
        hasRowSelection: true
    });
    const btnList = computed(() => {
        return [
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
            { title: '取消', props: { onClick: () => setVisible(false) } },
            {
                title: '保存',
                props: {
                    type: 'primary',
                    onClick: () => onSave(),
                    disabled: isEmpty(unref(tableInfo).dataSource)
                }
            }
        ];
    });

    const getBatchInfoListParams = (list: any[]) => {
        if (!isArray(list)) return [];
        return list.map(item => ({
            batchNo: item.batchNo,
            storeInfoId: item.storeInfoId,
            outStorageNumber: item.outStorageNumber
        }));
    };

    const getStockManagementType = (record: any) => {
        let stockManagementType = 'FIRST_IN_FIRST_OUT';
        if (!isArray(record.batchInfoList)) {
            return stockManagementType;
        }
        const hasNum = record.batchInfoList.some((item: any) => Number(item.outStorageNumber) > 0);
        if (hasNum) {
            stockManagementType = record.stockManagementType;
        }
        return stockManagementType;
    };

    const onSave = async () => {
        await validateFields();
        const {
            material_requisition_order_code: materialRequisitionOrderCode,
            project_code: projectCode
        } = unref(currentRowInfo);

        const infoList = unref(getTableList()).map((record: any) => {
            const { remark, materialCode, outStorageNumber, id, batchInfoList = [] } = record;
            return {
                remark,
                outStorageNumber,
                materialCode,
                materialRequisitionOrderInfoId: id,
                stockManagementType: getStockManagementType(record),
                storeInfoList: getBatchInfoListParams(batchInfoList)
            };
        });

        const params = {
            materialRequisitionOrderCode,
            projectCode,
            infoList
        };
        console.log('params', params);

        await outStorageApi.createOutStorage(params);
        const { message } = await import('ant-design-vue');
        message.success('保存成功');
        emit('updateTable');
        setVisible(false);
    };

    const getMaterialRequisitionByCode = async (row = {} as any) => {
        const { material_requisition_order_code: materialRequisitionOrderCode } = row || {};
        if (!materialRequisitionOrderCode) return;
        loading.value = true;
        try {
            const res = await materialRequisitionApi
                .getMaterialRequisitionByCode({
                    materialRequisitionOrderCode
                })
                .then(res => res.data.object || {});

            const { detailVoList } = res;
            setTableList(detailVoList || []);
        } catch (error) {
            console.log('error: ', error);
        } finally {
            loading.value = false;
        }
    };

    const open = (row = {}) => {
        setTableList([]);
        currentRowInfo.value = cloneDeep(row) as any;

        setVisible(true);

        getMaterialRequisitionByCode(row);
    };

    const getBatchInfoList = (val: any) => {
        unref(getTableList()).forEach((item: any) => {
            if (item.id === val.id) {
                const outStorageNumber = val.batchInfoList.reduce(
                    (t: number, v: any) => (t += plus(t, v.outStorageNumber)),
                    0
                );
                Object.assign(item, { ...val, outStorageNumber, disabled: !!outStorageNumber });
            }
        });
    };

    getDataList();

    defineExpose({ open });
</script>
