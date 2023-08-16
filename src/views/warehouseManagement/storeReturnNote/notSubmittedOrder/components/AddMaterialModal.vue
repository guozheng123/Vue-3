<template>
    <TpfModal
        v-model:visible="visible"
        title="选择库存物料"
        height="400px"
        width="800px"
        class="addProjectCodeModal"
    >
        <a-form layout="inline" :model="formState" @finish="handleFinish" class="tpf-form">
            <a-row style="width: 100%">
                <a-col :span="5">
                    <a-form-item label="项目编号" name="projectCode">
                        <a-input v-model:value="formState.projectCode" />
                    </a-form-item>
                </a-col>
                <a-col :span="5">
                    <a-form-item label="批次号" name="batchNo">
                        <a-input v-model:value="formState.batchNo" />
                    </a-form-item>
                </a-col>
                <a-col :span="5">
                    <a-form-item label="物料编号" name="materialCode">
                        <a-input v-model:value="formState.materialCode" />
                    </a-form-item>
                </a-col>
                <a-col :span="5">
                    <a-form-item label="仓位" name="positionName">
                        <a-input v-model:value="formState.positionName" />
                    </a-form-item>
                </a-col>
                <a-col :span="4">
                    <a-button type="primary" @click="onCheck">查询</a-button>
                </a-col>
            </a-row>
        </a-form>
        <TpfTable
            v-bind="{
                ...tableInfo,
                pagination,
                columns
            }"
        />
        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">取消</a-button>
            <a-button
                class="tpf-button"
                type="primary"
                @click="saveProjectCode"
                :disabled="isEmpty(selectedRowInfo.selectedRowKeys)"
            >
                保存
            </a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="tsx" name="addMaterialModal">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useAntdTable, useRef } from '@/hooks';
    import TpfTable from '@/components/TpfTable/index.vue';
    import { ref, computed, unref } from 'vue';
    import { tableResizable } from '@/config';
    import { TpfColumnType } from '@/types';
    import { useWarehouseApi } from '@/api';
    import { isEmpty } from 'lodash-es';
    const warehouseApi = useWarehouseApi();

    const emit = defineEmits<{
        (e: 'getMaterialInfo', val: any): void;
    }>();

    const [visible, setVisible] = useRef(false);

    const formState = ref<{
        projectCode?: string;
        batchNo?: string;
        materialCode?: string;
        positionName?: string;
    }>({});

    const columns = computed(() => {
        return [
            { title: '所属组织名称', dataIndex: 'orgName', ...tableResizable() },
            { title: '项目编号', dataIndex: 'projectCode', ...tableResizable() },
            { title: '批次号', dataIndex: 'batchNo', ...tableResizable() },
            { title: '物料编号', dataIndex: 'materialCode', ...tableResizable() },
            { title: '物料名称', dataIndex: 'materialName', ...tableResizable() },
            {
                title: '库存数量',
                dataIndex: 'basicNum',
                ...tableResizable(),
                customRender: ({ record }: { record: any }) => {
                    return (record.basicNum = record.basicNum + '');
                }
            },
            { title: '基本单位', dataIndex: 'basicUnit', ...tableResizable() },
            { title: '物料类型', dataIndex: 'materialType', ...tableResizable() },
            { title: '仓库名称', dataIndex: 'positionName', ...tableResizable() },
            { title: '库位名称', dataIndex: 'storeLocationName', ...tableResizable() }
        ] as TpfColumnType[];
    });
    const { tableInfo, selectedRowInfo, pagination, getDataList } = useAntdTable({
        api: async pagination => {
            const { current: page, pageSize } = unref(pagination);
            const res = await warehouseApi.queryPopMaterialStores({
                pageSize: pageSize,
                page,
                ...unref(formState)
            });
            return res.data.object;
        },
        rowKey: 'id',
        isPageAble: true,
        hasRowSelection: true
    });

    // 查询
    const onCheck = () => {
        unref(pagination).current = 1;
        getDataList();
    };

    const handleFinish = (val: any) => {
        formState.value = unref(val);
        unref(pagination).current = 1;
        getDataList();
    };

    const saveProjectCode = () => {
        if (unref(selectedRowInfo).selectedRows) {
            emit('getMaterialInfo', unref(selectedRowInfo).selectedRows);
        }
        setVisible(false);
    };

    const open = () => {
        setVisible(true);
        unref(pagination).current = 1;
        getDataList();
    };
    defineExpose({ open });
</script>
