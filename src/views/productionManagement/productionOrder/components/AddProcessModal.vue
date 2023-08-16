<template>
    <TpfModal
        v-model:visible="visible"
        title="选择工艺"
        height="345px"
        width="800px"
        class="addProcessModal"
    >
        <a-form layout="inline" :model="formState" @finish="handleFinish" class="tpf-form">
            <a-row style="width: 100%">
                <a-col :span="11">
                    <a-form-item label="工艺编号" name="processCode">
                        <a-input v-model:value.trim="formState.processCode" />
                    </a-form-item>
                </a-col>
                <a-col :span="11">
                    <a-form-item label="工艺名称" name="processName">
                        <a-input v-model:value.trim="formState.processName" />
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
            <a-button
                class="tpf-button"
                type="primary"
                @click="saveProcessCode"
                :disabled="isEmpty(selectRow)"
            >
                保存
            </a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="tsx" name="addProcessModal">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useAntdTable, useRef } from '@/hooks';
    import TpfTable from '@/components/TpfTable/index.vue';
    import { ref, computed, unref } from 'vue';
    import { tableResizable } from '@/config';
    import { TpfColumnType } from '@/types';
    import { useWorkingProcedure } from '@/api';
    import { isEmpty } from 'lodash-es';

    const emit = defineEmits<{
        (e: 'getProcessInfo', val: any): void;
    }>();

    const processApi = useWorkingProcedure();

    const [visible, setVisible] = useRef(false);

    const exclusionCodes = ref<string[]>([]);

    const { tableInfo, pagination, loading, getDataList, selectRow } = useAntdTable({
        api: async pageInfo => {
            const { current: page, pageSize } = unref(pageInfo);
            const res = await processApi.queryPopProcessListByPage({
                ...unref(formState),
                exclusionCodes: unref(exclusionCodes),
                page,
                pageSize
            });
            return res.data.object;
        },
        rowKey: 'processId',
        isPageAble: true,
        colorRow: true
    });
    const formState = ref<{ processCode?: string; processName?: string }>({});

    const columns = computed(() => {
        return [
            { title: '工艺编号', dataIndex: 'processCode', ...tableResizable() },
            { title: '工艺名称', dataIndex: 'processName', ...tableResizable() },
            {
                title: '版本号',
                dataIndex: 'processVersion',
                ...tableResizable(),
                customRender: ({ text }) => `v${text}`
            }
        ] as TpfColumnType[];
    });

    const handleFinish = (val: any) => {
        unref(pagination).current = 1;
        getDataList();
    };

    const saveProcessCode = () => {
        if (unref(selectRow).processCode) {
            emit('getProcessInfo', unref(selectRow));
        }
        setVisible(false);
    };

    const open = (list: Record<string, any>[] = []) => {
        setVisible(true);

        exclusionCodes.value = list.map(item => item.processCode);

        formState.value = {};

        unref(pagination).current = 1;
        getDataList();
    };
    defineExpose({ open });
</script>
