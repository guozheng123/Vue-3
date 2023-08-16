<template>
    <TpfModal v-model:visible="visible" title="选择作业单元" height="300px" width="800px">
        <a-form layout="inline" :model="formState" @finish="handleFinish" class="tpf-form">
            <a-row style="width: 100%">
                <a-col :span="11">
                    <a-form-item label="作业单元编号" name="workUnitCode">
                        <a-input v-model:value="formState.workUnitCode" />
                    </a-form-item>
                </a-col>
                <a-col :span="11">
                    <a-form-item label="作业单元名称" name="workUnitName">
                        <a-input v-model:value="formState.workUnitName" />
                    </a-form-item>
                </a-col>
                <a-col :span="2">
                    <a-form-item>
                        <a-button type="primary" class="tpf-button" html-type="submit">
                            查询
                        </a-button>
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
            <a-button class="tpf-button" type="primary" @click="saveProjectCode">保存</a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="tsx" name="SelectWorkUnitModel">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useAntdTable, useRef } from '@/hooks';
    import TpfTable from '@/components/TpfTable/index.vue';
    import { ref, computed, unref } from 'vue';
    import { tableResizable } from '@/config';
    import { TpfColumnType } from '@/types';
    import { useWorkingProcedure } from '@/api';
    const workingProcedure = useWorkingProcedure();

    const emit = defineEmits<{
        (e: 'getWorkUnit', val: any): void;
    }>();

    const [visible, setVisible] = useRef(false);

    const formState = ref<{ workUnitCode?: string; workUnitName?: string }>({});

    const columns = computed(() => {
        return [
            { title: '作业单元编号', dataIndex: 'workUnitCode', ...tableResizable() },
            { title: '作业单元名称', dataIndex: 'workUnitName', ...tableResizable() },
            { title: '车间', dataIndex: 'workshopName', ...tableResizable() },
            { title: '标准产能', dataIndex: 'standardCapacity', ...tableResizable() },
            { title: '标准工时', dataIndex: 'standardHours', ...tableResizable() },
            { title: '时间单位', dataIndex: 'address', ...tableResizable() }
        ] as TpfColumnType[];
    });

    const { tableInfo, pagination, loading, getDataList, selectRow } = useAntdTable({
        api: async pagination => {
            const { pageSize, current: page } = unref(pagination);
            const res = await workingProcedure.queryWorkUnitListByPage({
                ...unref(formState),
                pageSize,
                page
            });
            return res.data.object;
        },
        rowKey: 'workUnitCode',
        isPageAble: true,
        colorRow: true
    });

    const handleFinish = (val: any) => {
        formState.value = unref(val);
        unref(pagination).current = 1;
        getDataList();
    };

    const saveProjectCode = () => {
        if (unref(selectRow).workUnitCode) {
            emit('getWorkUnit', unref(selectRow));
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
