<template>
    <TpfModal
        class="material-arrival-order-detail-modal"
        v-model:visible="visible"
        width="1000px"
        title="物料退货单详情"
        height="400px"
    >
        <TpfLayout>
            <template #header>
                <a-form :model="formState">
                    <div class="form-box">
                        <a-row :gutter="24">
                            <a-col :span="6">
                                <a-form-item label="退货单号">
                                    <a-input-search disabled v-model:value="formState.returnNo" />
                                </a-form-item>
                            </a-col>
                            <a-col :span="6">
                                <a-form-item label="退货方式">
                                    <a-select v-model:value="formState.returnTypeCode" disabled>
                                        <a-select-option
                                            v-for="item in returnMethod"
                                            :value="item.value"
                                            :key="item.value"
                                            >{{ item.label }}</a-select-option
                                        >
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :span="6">
                                <a-form-item label="到货单号">
                                    <a-input disabled v-model:value="formState.arrivalNo" />
                                </a-form-item>
                            </a-col>
                            <a-col :span="6">
                                <a-form-item label="移动类型">
                                    <a-select v-model:value="formState.moveTypeCode" disabled>
                                        <a-select-option
                                            v-for="item in moveTypeList"
                                            :value="item.value"
                                            :key="item.value"
                                            >{{ item.label }}</a-select-option
                                        >
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :span="6">
                                <a-form-item label="单位编号">
                                    <a-input
                                        v-model:value="formState.customerSupplierCode"
                                        disabled
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="6">
                                <a-form-item label="单位名称">
                                    <a-input
                                        v-model:value="formState.customerSupplierName"
                                        disabled
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="6">
                                <a-form-item label="备注" :label-col="{ span: 8 }">
                                    <a-input v-model:value="formState.remarks" disabled />
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </div>
                </a-form>
            </template>
            <template #content>
                <LoadingSkeleton>
                    <TpfTable
                        class="tpf-table-form"
                        v-bind="{
                            ...tableInfo,
                            columns,
                            seq: true
                        }"
                        :dataSource="dataSource"
                    />
                </LoadingSkeleton>
            </template>
        </TpfLayout>

        <template #footerRight>
            <a-button class="tpf-button" @click="setVisible(false)">关闭</a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="tsx" name="materialArrivalOrderModal">
    import { useWarehouseApi, useInStoreAPi } from '@/api';
    import { useRef, useAntdTable } from '@/hooks';
    import TpfModal from '@/components/TpfModal/index.vue';
    import { ref, unref, reactive, toRefs, defineAsyncComponent, computed } from 'vue';
    import { tableResizable } from '@/config';
    import type { TpfColumnType } from '@/types';
    import { message } from 'ant-design-vue';
    import TpfLayout from '@/components/TpfLayout/index.vue';

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const warehouseApi = useWarehouseApi();
    const emit = defineEmits<{
        (e: 'onGetTableList'): void;
    }>();
    const [visible, setVisible] = useRef(false);
    const tableForm = reactive<{ dataSource: { [k: string]: any }[] }>({
        dataSource: []
    });
    const { dataSource } = toRefs(tableForm);
    let editInfoData: { [k: string]: any } = {};
    const modelType = ref(0);
    const loading = ref<boolean>(false);
    const formState = ref({
        returnNo: '', //退货单号
        returnTypeCode: '0', //退货单类型
        arrivalNo: '', //到货单号
        moveTypeCode: '', //移动类型
        remarks: '', //备注
        customerSupplierCode: '', //单位编号
        customerSupplierName: '' //单位名称
    });
    const moveTypeList = ref([
        { label: '采购订单退货', value: 'C04' },
        { label: '委外订单退货', value: 'C05' },
        { label: '客供物料退货', value: 'C07' }
    ]);
    const returnMethod = ref([
        { label: '按到货单退货', value: '0' },
        { label: '按库存退货', value: '1' }
    ]);
    const columns = ref<TpfColumnType[]>([
        {
            title: '项目编号',
            dataIndex: 'projectCode',
            ...tableResizable()
        },
        {
            title: '采购订单号',
            dataIndex: 'purchaseOrderNo',
            ...tableResizable()
        },
        {
            title: '批次号',
            dataIndex: 'batchNo',
            ...tableResizable()
        },
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
            title: '退货数',
            dataIndex: 'returnNum',
            ...tableResizable()
        },
        {
            title: '退货单位',
            dataIndex: 'returnUnitName',
            ...tableResizable()
        },
        {
            title: '基本数量',
            dataIndex: 'returnBasicNum',
            ...tableResizable()
        },
        {
            title: '基本单位',
            dataIndex: 'returnBasicUnitName',
            ...tableResizable()
        },
        {
            title: '仓位名称',
            dataIndex: 'positionName',
            ...tableResizable()
        },
        {
            title: '库位名称',
            dataIndex: 'storeLocationName',
            ...tableResizable()
        },
        {
            title: '说明',
            dataIndex: 'descriptions',
            ...tableResizable()
        }
    ]);
    const { tableInfo } = useAntdTable({
        api: async () => {
            return { list: [] };
        },
        rowKey: 'countId',
        isPageAble: false
    });

    const onGetInfoData = async () => {
        try {
            loading.value = true;
            console.log(editInfoData, 'datares');
            const { data } = await warehouseApi.querydetail({
                materialReturnNo: editInfoData.return_no
            });
            if (data.object?.materialReturnDetails) {
                dataSource.value = data.object.materialReturnDetails.map((item: any) => {
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
        editInfoData = data;
        onGetInfoData();
    };

    const onReset = (data = {}) => {
        for (const key in unref(formState)) {
            formState.value[key] = data[key] || '';
        }
        dataSource.value = [];
    };
    defineExpose({ open });
</script>

<style scoped lang="less">
    .tpf-table-form {
        height: 270px;
    }

    :deep(.ant-row) {
        margin: 0 !important;
        margin-bottom: 10px !important;
    }
</style>
