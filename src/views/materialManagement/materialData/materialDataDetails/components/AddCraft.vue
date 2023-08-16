<template>
    <TpfModal v-model:visible="visible" title="添加工艺" height="400px" width="800px">
        <a-form
            :label-col="{ span: 6, offset: 3 }"
            layout="inline"
            :model="formState"
            @finish="handleFinish"
        >
            <a-form-item label="工艺编号">
                <a-input v-model:value="formState.processCode" />
            </a-form-item>
            <a-form-item label="工艺名称">
                <a-input v-model:value="formState.processName" />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit"> 查询 </a-button>
            </a-form-item>
        </a-form>
        <TpfTable v-bind="{ ...tableInfo, pagination, columns, seq: true }" />
        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">取消</a-button>
            <a-button
                class="tpf-button"
                type="primary"
                @click="submitModel"
                :disabled="isEmpty(selectedRowInfo.selectedRowKeys)"
            >
                保存
            </a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="ts" name="RoleModel">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { ref, unref, defineAsyncComponent } from 'vue';
    import { useAntdTable, useRef } from '@/hooks';
    import { useWorkingProcedure } from '@/api';
    import { isEmpty } from 'lodash-es';

    const workingProcedure = useWorkingProcedure();

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const formState = ref({
        processCode: '',
        processName: ''
    });
    const [visible, setVisible] = useRef(false);

    const emit = defineEmits(['getList']);

    const open = (val: any[]) => {
        setVisible(!visible.value);
        formState.value = {
            processCode: '',
            processName: ''
        };
        unref(pagination).current = 1;

        handleFinish();

        const codes = unref(val).map(e => e.processCode);

        selectedRowInfo.value = {
            selectedRowKeys: codes,
            selectedRows: unref(val)
        };
    };

    const columns = [
        { title: '工艺编号', dataIndex: 'processCode' },
        { title: '工艺名称', dataIndex: 'processName' }
    ];

    const { tableInfo, pagination, getDataList, selectedRowInfo } = useAntdTable({
        api: async pagination => {
            const { pageSize = 20, current = 1 } = unref(pagination);
            const res = await workingProcedure.queryProcessListByPage({
                ...unref(formState),
                pageSize,
                releaseFlag: '1',
                enable: '1',
                latestVersionFlag: 1,
                page: current
            });
            return res.data.object;
        },
        rowKey: 'processCode',
        isPageAble: true,
        hasRowSelection: true
    });
    const handleFinish = () => {
        unref(pagination).current = 1;
        getDataList();
    };
    const submitModel = () => {
        emit('getList', unref(selectedRowInfo).selectedRows);
        setVisible(!visible.value);
    };

    defineExpose({ open });
</script>
