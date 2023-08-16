<template>
    <TpfModal
        class="WorknModel"
        v-model:visible="visible"
        title="选择作业单元类型"
        height="400px"
        width="880px"
    >
        <a-form
            :label-col="{ span: 10, offset: 2 }"
            layout="inline"
            :model="formState"
            @finish="handleFinish"
        >
            <a-form-item label="作业单元类型编号">
                <a-input v-model:value="formState.workUnitTypeCode" />
            </a-form-item>
            <a-form-item label="作业单元类型名称">
                <a-input v-model:value="formState.workUnitTypeName" />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit">查询</a-button>
            </a-form-item>
        </a-form>
        <TpfLayout style="height: 400px">
            <template #content>
                <TpfTableLayout>
                    <template #default="args">
                        <TpfTable
                            :scroll="{ y: 350, x: 700 }"
                            v-bind="{
                                ...args,
                                ...tableInfo,
                                loading,
                                pagination,
                                columns,
                                seq: true
                            }"
                        />
                    </template>
                </TpfTableLayout>
            </template>
        </TpfLayout>
        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="onSave">保存</a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="ts" name="WorknModel">
    import TpfModal from '@/components/TpfModal/index.vue';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, unref, defineAsyncComponent, onMounted } from 'vue';
    import type { TpfColumnType } from '@/types';
    import { useAntdTable, useRef } from '@/hooks';
    import { useWorkingProcedure } from '@/api';
    import { tableResizable } from '@/config';
    const workingProcedure = useWorkingProcedure();
    const [visible, setVisible] = useRef(false);
    const emit = defineEmits(['getData']);
    const open = () => {
        setVisible(!visible.value);
    };
    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const formState = ref({
        workUnitTypeCode: '',
        workUnitTypeName: ''
    });
    const columns = ref<TpfColumnType[]>([
        {
            title: '作业单元类型编号',
            dataIndex: 'workUnitTypeCode',
            ...tableResizable()
        },
        {
            title: '作业单元类型名称',
            dataIndex: 'workUnitTypeName',
            ...tableResizable()
        },
        { title: '创建人', dataIndex: 'createUser', ...tableResizable() },

        {
            title: '创建时间',
            dataIndex: 'createDatetimeStart',
            ...tableResizable()
        }
    ]);

    const { tableInfo, pagination, loading, getDataList, selectRow } = useAntdTable({
        api: async pageInfo => {
            const { current = 1, pageSize } = unref(pageInfo);
            const params = {
                page: current,
                pageSize,
                status: '1',
                ...unref(formState)
            };
            const res = await workingProcedure.queryWorkUnitTypeListByPage(unref(params));
            return res.data.object;
        },
        rowKey: 'workUnitTypeId',
        isPageAble: true,
        colorRow: true
    });
    const onSave = () => {
        emit('getData', selectRow.value);
        setVisible(false);
    };
    const handleFinish = () => {
        unref(pagination).current = 1;

        getDataList();
    };

    defineExpose({ open });

    onMounted(() => {
        getDataList();
    });
</script>

<style scoped lang="less">
    :deep(.tpf-table) .table-striped td {
        background-color: #ecf5df !important;
    }

    .ant-table-tbody :deep(.table-striped) td {
        background-color: #ecf5df !important;
    }

    :deep(.table-striped) td {
        background-color: #ecf5df !important;
    }

    :deep(.tpf-layout-content) {
        margin-top: 0 !important;

        .operate-line {
            height: 0 !important;
        }
    }
</style>
