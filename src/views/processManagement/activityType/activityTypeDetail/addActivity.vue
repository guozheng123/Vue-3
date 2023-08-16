<template>
    <TpfModal
        class="WorkModel"
        v-model:visible="visible"
        title="选择作业单元"
        height="400px"
        width="880px"
    >
        <a-form
            :label-col="{ span: 10, offset: 2 }"
            layout="inline"
            :model="formState"
            @finish="handleFinish"
        >
            <a-form-item label="作业单元编号">
                <a-input v-model:value="formState.workUnitCode" />
            </a-form-item>
            <a-form-item label="作业单元名称">
                <a-input v-model:value="formState.workUnitName" />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit">查询</a-button>
            </a-form-item>
        </a-form>
        <TpfTable v-bind="{ ...tableInfo, pagination, columns, seq: true }" />
        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="onSave">保存</a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="ts" name="WorknModel">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { ref, unref, defineAsyncComponent } from 'vue';
    import type { TpfColumnType } from '@/types';
    import { useAntdTable, useRef } from '@/hooks';
    import { useWorkingProcedure } from '@/api';
    import { tableResizable } from '@/config';

    const factoryId = ref('');

    const workingProcedure = useWorkingProcedure();
    const [visible, setVisible] = useRef(false);
    const emit = defineEmits(['getData']);
    const open = (item: any) => {
        factoryId.value = item.factoryId;
        setVisible(!visible.value);
        getDataList();

        const workUnitIds = item.workUnitIds.map((e: any) => {
            return e.workUnitId;
        });
        selectedRowInfo.value.selectedRowKeys = workUnitIds;
        selectedRowInfo.value.selectedRows = item.workUnitIds;
    };
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const formState = ref({
        workUnitCode: '',
        workUnitName: ''
    });
    const columns = ref<TpfColumnType[]>([
        {
            title: '作业单元编号',
            dataIndex: 'workUnitCode',
            ...tableResizable()
        },
        {
            title: '作业单元名称',
            dataIndex: 'workUnitName',
            ...tableResizable()
        },
        { title: '创建人', dataIndex: 'createUser', ...tableResizable() },

        {
            title: '创建时间',
            dataIndex: 'createDatetime',
            ...tableResizable()
        }
    ]);

    const { tableInfo, pagination, getDataList, selectRow, selectedRowInfo } = useAntdTable({
        api: async pageInfo => {
            const { current = 1, pageSize } = unref(pageInfo);
            const params = {
                page: current,
                pageSize,
                status: '1',
                factoryId: factoryId.value,
                ...unref(formState)
            };
            const res = await workingProcedure.queryWorkUnitList(unref(params));
            return res.data.object;
        },
        rowKey: 'workUnitId',
        isPageAble: true,
        hasRowSelection: true
    });
    const onSave = () => {
        emit('getData', selectedRowInfo.value.selectedRows);
        setVisible(false);
    };
    const handleFinish = () => {
        unref(pagination).current = 1;
        getDataList();
    };

    defineExpose({ open });
</script>

<style scoped lang="less">
    :deep(.tpf-layout-content) {
        margin-top: 0 !important;

        .operate-line {
            height: 0 !important;
        }
    }
</style>
