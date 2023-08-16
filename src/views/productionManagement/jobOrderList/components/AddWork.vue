<template>
    <TpfModal
        class="WorknModel"
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
            <a-button
                class="tpf-button"
                type="primary"
                @click="onSave"
                :disabled="isEmpty(selectRow)"
            >
                保存
            </a-button>
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
    import { isEmpty } from 'lodash-es';

    const workingProcedure = useWorkingProcedure();
    const [visible, setVisible] = useRef(false);
    const emit = defineEmits(['getData']);

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const formState = ref({
        workUnitCode: '',
        workUnitName: '',
        workUnitTypeCodeAccurate: '',
        status: '1'
    });
    const indexNum = ref();
    const open = (i: number, workUnitTypeCode: string) => {
        onReset();
        indexNum.value = i;
        formState.value.workUnitTypeCodeAccurate = workUnitTypeCode;
        getDataList();
        setVisible(!visible.value);
    };
    const columns = ref<TpfColumnType[]>([
        { title: '作业单元编号', dataIndex: 'workUnitCode', ...tableResizable() },
        { title: '作业单元名称', dataIndex: 'workUnitName', ...tableResizable() },
        { title: '创建人', dataIndex: 'createUser', ...tableResizable() },
        { title: '创建时间', dataIndex: 'createDatetime', ...tableResizable() }
    ]);

    const { tableInfo, pagination, getDataList, selectRow } = useAntdTable({
        api: async pageInfo => {
            const { current = 1, pageSize } = unref(pageInfo);
            const params = {
                page: current,
                pageSize,
                ...unref(formState)
            };
            const res = await workingProcedure.queryWorkUnitListByPage(unref(params));
            return res.data.object;
        },
        rowKey: 'workUnitId',
        isPageAble: true,
        colorRow: true
    });
    const onReset = () => {
        formState.value.workUnitCode = '';
        formState.value.workUnitName = '';
    };
    const onSave = () => {
        emit('getData', selectRow.value, unref(indexNum));
        setVisible(false);
    };
    const handleFinish = () => {
        unref(pagination).current = 1;
        getDataList();
    };

    defineExpose({ open });
</script>
