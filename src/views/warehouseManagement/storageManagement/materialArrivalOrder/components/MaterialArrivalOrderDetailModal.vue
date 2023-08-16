<template>
    <TpfModal
        class="material-arrival-order-detail-modal"
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
                                <a-form-item label="单位编号">
                                    <a-input-search
                                        disabled
                                        v-model:value="formState.customerSupplierCode"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="6">
                                <a-form-item label="单位名称">
                                    <a-input
                                        v-model:value="formState.customerSupplierCodeName"
                                        disabled
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="6">
                                <a-form-item label="来源单号">
                                    <a-input disabled v-model:value="formState.sourceNo" />
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
                                <a-form-item label="提交状态">
                                    <a-select v-model:value="formState.submitStatus" disabled>
                                        <a-select-option
                                            v-for="item in submitStatus"
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
            <a-button
                v-show="unref(modelType)"
                class="tpf-button"
                type="primary"
                :loading="loading"
                @click="onSubmit"
            >
                提交
            </a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="tsx" name="materialArrivalOrderModal">
    import { useWarehouseApi, useInStoreAPi } from '@/api';
    import { isEmpty } from 'lodash-es';
    import { useOpenAntdModal, useRef, useAntdTable, useAntdForm } from '@/hooks';
    import TpfModal from '@/components/TpfModal/index.vue';
    import { ref, unref, reactive, toRefs, defineAsyncComponent, computed } from 'vue';
    import { tableResizable, submitStatus } from '@/config';
    import type { TpfColumnType } from '@/types';
    import { FormItem, Select, Input, message } from 'ant-design-vue';
    import TpfLayout from '@/components/TpfLayout/index.vue';

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const inStoreAPi = useInStoreAPi();

    const warehouseApi = useWarehouseApi();
    const emit = defineEmits<{
        (e: 'onGetTableList'): void;
    }>();
    const [visible, setVisible] = useRef(false);
    const tableForm = reactive<{ dataSource: { [k: string]: any }[] }>({
        dataSource: []
    });
    const { dataSource } = toRefs(tableForm);
    let countId = 1;
    let editInfoData: { [k: string]: any } = {};
    const modelType = ref(0);
    const loading = ref<boolean>(false);
    const formState = ref({
        customerSupplierCode: '',
        customerSupplierCodeName: '',
        sourceNo: '',
        moveTypeCode: '',
        submitStatus: ''
    });
    const moveTypeList = ref([
        {
            value: 'R02',
            label: '采购入库'
        },
        {
            value: 'R03',
            label: '委外采购入库'
        }
    ]);
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
            ...tableResizable()
        },
        {
            title: '项目名称',
            dataIndex: 'projectName',
            ...tableResizable()
        },
        {
            title: '订单号',
            dataIndex: 'purchaseOrderNo',
            ...tableResizable()
        },
        {
            title: '批次号',
            dataIndex: 'batchNo',
            ...tableResizable()
        },
        {
            title: '订单数',
            dataIndex: 'purchaseOrdersNum',
            ...tableResizable()
        },
        {
            title: '采购单价',
            dataIndex: 'purchasePrice',
            ...tableResizable()
        },
        {
            title: '到货数',
            dataIndex: 'arrivalNum',
            ...tableResizable()
        },
        {
            title: '到货单位',
            dataIndex: 'arrivalUnit',
            ...tableResizable()
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
            ...tableResizable()
        }
    ]);
    const { tableInfo, selectedRowInfo, setTableList } = useAntdTable({
        api: async () => {
            return { list: [] };
        },
        rowKey: 'countId',
        isPageAble: false
    });

    const onSubmit = async () => {
        try {
            loading.value = true;
            const res = await warehouseApi.batchSubmitData({
                arrivalNos: [editInfoData.arrival_no]
            });
            message.success('提交操作成功！');
            setVisible(!visible.value);
            emit('onGetTableList');
        } catch (error) {
            console.log(error);
        } finally {
            loading.value = false;
        }
    };

    const onGetInfoData = async () => {
        try {
            loading.value = true;
            const { data } = await warehouseApi.queryMaterialDetailData({
                arrivalNo: editInfoData.arrival_no
            });
            if (data.object?.materialDetailDataList) {
                dataSource.value = data.object.materialDetailDataList.map((item: any) => {
                    item.countId = countId;
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
        editInfoData = data;
        onGetInfoData();
    };

    const onReset = (data = {}) => {
        for (const key in unref(formState)) {
            formState.value[key] = data[key] || '';
        }
        dataSource.value = [];
    };
    const getModelType = computed(() => (unref(modelType) === 0 ? true : false));
    const title = computed(() => {
        if (unref(getModelType)) return '详情 - ';
        return '提交 - ';
    });
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
