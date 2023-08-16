<template>
    <TpfModal v-model:visible="visible" title="添加工序" height="300px" width="800px">
        <a-form layout="inline" :model="formState" @finish="handleFinish" class="tpf-form">
            <a-row style="width: 100%">
                <a-col :span="7">
                    <a-form-item label="工序编号" name="operationCode">
                        <a-input v-model:value.trim="formState.operationCode" allow-clear />
                    </a-form-item>
                </a-col>
                <a-col :span="7">
                    <a-form-item label="物料名称" name="operationName">
                        <a-input v-model:value.trim="formState.operationName" allow-clear />
                    </a-form-item>
                </a-col>
                <a-col :span="7">
                    <a-form-item label="工序类型 " name="operationTypeCode">
                        <a-select
                            allow-clear
                            v-model:value.trim="formState.operationTypeCode"
                            :options="addOperationTypeNameListOptions"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="2">
                    <a-form-item>
                        <a-button
                            type="primary"
                            class="tpf-button"
                            html-type="submit"
                            :loading="loading"
                        >
                            查询
                        </a-button>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <TpfTable v-bind="{ ...tableInfo, loading, pagination, columns }" />
        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">取消</a-button>
            <a-button
                class="tpf-button"
                type="primary"
                @click="saveProjectCode"
                :disabled="isEmpty(selectRow)"
            >
                保存
            </a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="tsx">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useAntdTable, useRef } from '@/hooks';
    import TpfTable from '@/components/TpfTable/index.vue';
    import { ref, computed, unref } from 'vue';
    import { getTpfOptionEnum, tableResizable } from '@/config';
    import { TpfColumnType } from '@/types';
    import { useWorkingProcedure } from '@/api';
    import { isEmpty } from 'lodash-es';

    const workingProcedure = useWorkingProcedure();
    const { getLabel, addOperationTypeNameListOptions } = getTpfOptionEnum();

    const emit = defineEmits<{
        (e: 'getSelect', val: any): void;
    }>();

    const [visible, setVisible] = useRef(false);

    const formState = ref<{
        operationCode?: string;
        operationName?: string;
        operationTypeCode?: string;
    }>({});

    const columns = computed(() => {
        return [
            { title: '工序编号', dataIndex: 'operationCode', ...tableResizable() },
            { title: '工序名称', dataIndex: 'operationName', ...tableResizable() },
            {
                title: '工序类型',
                dataIndex: 'operationTypeCode',
                ...tableResizable(),
                customRender: ({ text }) => getLabel(text, addOperationTypeNameListOptions)
            }
        ] as TpfColumnType[];
    });

    const { tableInfo, pagination, loading, getDataList, selectRow } = useAntdTable({
        api: async pagination => {
            const { current: page, pageSize } = unref(pagination);
            const res = await workingProcedure.queryOperationInfoListByPage({
                page,
                pageSize,
                forbidden: '1',
                ...unref(formState)
            });
            return res.data.object;
        },
        rowKey: 'operationId',
        isPageAble: true,
        colorRow: true
    });

    const handleFinish = () => {
        unref(pagination).current = 1;
        getDataList();
    };

    const saveProjectCode = () => {
        if (!isEmpty(unref(selectRow))) {
            emit('getSelect', unref(selectRow));
        }
        setVisible(false);
    };

    const open = async () => {
        unref(pagination).current = 1;
        await getDataList();
        setVisible(true);
    };

    defineExpose({ open });
</script>
