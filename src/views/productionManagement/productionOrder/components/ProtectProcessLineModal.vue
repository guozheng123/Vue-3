<template>
    <TpfModal
        v-model:visible="visible"
        title="维护工艺"
        height="300px"
        width="800px"
        class="protectProcessLineModal"
    >
        <a-form layout="inline" :model="formState" class="tpf-form">
            <a-row style="width: 100%">
                <a-col :span="8">
                    <a-form-item label="工艺" name="processName">
                        <a-input :value="formState.processName" readonly>
                            <template #addonAfter>
                                <SvgIcon
                                    type="icon-sousuo"
                                    :size="16"
                                    cursor
                                    @click="openSelectProcess"
                                />
                            </template>
                        </a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item label="工艺编号" name="processCode">
                        <a-input v-model:value="formState.processCode" disabled />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item label="版本号" name="processVersion">
                        <a-input
                            :value="formState.processVersion ? `v${formState.processVersion}` : ''"
                            disabled
                        />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <TpfTable
            v-bind="{
                ...tableInfo,
                loading,
                pagination
            }"
            :columns="columns"
        />
        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="saveProcess"> 保存 </a-button>
        </template>
    </TpfModal>

    <AddProcessModal
        ref="addProcessModalDom"
        v-if="showAddProcessModalDom"
        @getProcessInfo="getProcessInfo"
    />
</template>

<script setup lang="tsx" name="addCustomerModal">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useAntdTable, useOpenAntdModal, useRef } from '@/hooks';
    import TpfTable from '@/components/TpfTable/index.vue';
    import { ref, computed, defineAsyncComponent, unref } from 'vue';
    import { tableResizable } from '@/config';
    import { useProductionOrderApi } from '@/api';
    import { TpfColumnType } from '@/types';

    const AddProcessModal = defineAsyncComponent(() => import('./AddProcessModal.vue'));

    type Props = {
        selectedRows?: Record<string, any>[];
    };

    const props = withDefaults(defineProps<Props>(), {
        selectedRows: () => []
    });

    const emit = defineEmits<{
        (e: 'updateTable'): void;
    }>();

    const productionOrderApi = useProductionOrderApi();

    const [visible, setVisible] = useRef(false);

    const [addProcessModalDom, openSelectProcessModalDom, showAddProcessModalDom] =
        useOpenAntdModal();

    const formState = ref<{
        processName?: string;
        processCode?: string;
        processVersion?: number;
    }>({});

    const columns = computed(() => {
        return [
            { title: '生产订单号', dataIndex: 'productionOrderCode', ...tableResizable() },
            { title: '物料编号', dataIndex: 'materialCode', ...tableResizable() },
            { title: '物料名称', dataIndex: 'materialName', ...tableResizable() },
            { title: '原工艺编号', dataIndex: 'processCode', ...tableResizable() },
            { title: '原工艺名称', dataIndex: 'processName', ...tableResizable() },
            {
                title: '原工艺版本号',
                dataIndex: 'processVersion',
                ...tableResizable(),
                customRender: ({ text }) => text && `v${text}`
            }
        ] as TpfColumnType[];
    });

    const { tableInfo, pagination, loading, getDataList } = useAntdTable({
        api: async () => {
            return { list: props.selectedRows };
        },
        rowKey: 'productionOrderId',
        isPageAble: false
    });

    const getProcessInfo = (val: any) => {
        formState.value = unref(val);
    };

    const openSelectProcess = () => {
        openSelectProcessModalDom();
    };

    const saveProcess = async () => {
        const { processCode, processVersion } = unref(formState);
        if (!processCode) {
            setVisible(false);
            return;
        }
        const params = {
            processCode,
            processVersion,
            ids: unref(tableInfo).dataSource?.map(item => item.productionOrderId)
        };
        try {
            loading.value = true;
            await productionOrderApi.batchEditProductionOrderProcess(params);
            setVisible(false);
            updateTable();
        } catch (error) {
            console.log('error: ', error);
        } finally {
            loading.value = false;
        }
    };
    const updateTable = () => {
        emit('updateTable');
    };

    const open = () => {
        formState.value = {};
        setVisible(true);

        getDataList();
    };
    defineExpose({ open });
</script>
