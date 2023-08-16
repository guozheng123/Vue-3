<template>
    <TpfModal
        v-model:visible="visible"
        title="选择项目"
        height="300px"
        width="800px"
        class="addProjectCodeModal"
    >
        <a-form layout="inline" :model="formState" @finish="handleFinish" class="tpf-form">
            <a-row style="width: 100%">
                <a-col :span="11">
                    <a-form-item label="项目编号" name="projectCode">
                        <a-input v-model:value.trim="formState.projectCode" />
                    </a-form-item>
                </a-col>
                <a-col :span="11">
                    <a-form-item label="项目名称" name="projectName">
                        <a-input v-model:value.trim="formState.projectName" />
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
        <TpfTable
            v-bind="{
                ...tableInfo,
                loading,
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
                :disabled="isEmpty(selectRow)"
            >
                保存
            </a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="tsx" name="addProjectCodeModal">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useAntdTable, useRef } from '@/hooks';
    import TpfTable from '@/components/TpfTable/index.vue';
    import { ref, computed, unref } from 'vue';
    import { tableResizable } from '@/config';
    import { TpfColumnType } from '@/types';
    import { useProjectApi } from '@/api';
    import { isEmpty } from 'lodash-es';

    const projectApi = useProjectApi();

    const emit = defineEmits<{
        (e: 'getProjectInfo', val: any): void;
    }>();

    const [visible, setVisible] = useRef(false);

    const formState = ref<{ projectCode?: string; projectName?: string }>({});

    const columns = computed(() => {
        return [
            { title: '项目编号', dataIndex: 'projectCode', ...tableResizable() },
            { title: '项目名称', dataIndex: 'projectName', ...tableResizable() }
        ] as TpfColumnType[];
    });

    const { tableInfo, pagination, loading, getDataList, selectRow } = useAntdTable({
        api: async pagination => {
            const { current: page, pageSize } = unref(pagination);
            const res = await projectApi.queryPopProjectListByPage({
                page,
                pageSize,
                forbidden: '1',
                ...unref(formState)
            });
            return res.data.object;
        },
        rowKey: 'projectCode',
        isPageAble: true,
        colorRow: true
    });

    const handleFinish = () => {
        unref(pagination).current = 1;
        getDataList();
    };

    const saveProjectCode = () => {
        if (unref(selectRow).projectCode) {
            emit('getProjectInfo', unref(selectRow));
        }

        setVisible(false);
    };

    const open = async () => {
        unref(pagination).current = 1;
        await getDataList();
        setVisible(true);
        formState.value = {};
    };

    defineExpose({ open });
</script>
