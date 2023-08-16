<template>
    <TpfModal
        class="teamGroups"
        v-model:visible="visible"
        title="选择班组"
        height="400px"
        width="800px"
    >
        <a-form
            :label-col="{ span: 10, offset: 2 }"
            layout="inline"
            :model="formState"
            @finish="handleFinish"
        >
            <a-row>
                <a-col :span="10">
                    <a-form-item label="班组编码">
                        <a-input v-model:value="formState.workingTeamCode" />
                    </a-form-item>
                </a-col>
                <a-col :span="10">
                    <a-form-item label="班组名称">
                        <a-input v-model:value="formState.workingTeamName" />
                    </a-form-item>
                </a-col>
                <a-col :span="3">
                    <a-form-item>
                        <a-button type="primary" html-type="submit">查询</a-button>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>

        <TpfTable v-bind="{ ...tableInfo, pagination, columns }" />

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

<script setup lang="ts" name="TeamGroups">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { ref, unref, defineAsyncComponent } from 'vue';
    import type { TpfColumnType } from '@/types';
    import { useAntdTable, useRef } from '@/hooks';
    import { useJobOrderAPi } from '@/api';
    import { tableResizable } from '@/config';
    import { isEmpty } from 'lodash-es';

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const jobOrderAPi = useJobOrderAPi();

    const [visible, setVisible] = useRef(false);

    const workOrderCode = ref<string[]>([]);

    const emit = defineEmits(['setTeamGroups']);

    const open = (res: string[]) => {
        workOrderCode.value = res;
        setVisible(!visible.value);
        getDataList();
    };

    const formState = ref({ workingTeamCode: '', workingTeamName: '' });
    const columns = ref<TpfColumnType[]>([
        { title: '班组编码', dataIndex: 'workingTeamCode', ...tableResizable() },
        { title: '班组名称', dataIndex: 'workingTeamName', ...tableResizable() },
        { title: '班组简称', dataIndex: 'workingTeamAbbreviation', ...tableResizable() },
        { title: '班组长', dataIndex: 'workingTeamLeader', ...tableResizable() }
    ]);

    const { tableInfo, pagination, getDataList, selectRow } = useAntdTable({
        api: async () => {
            const res = await jobOrderAPi.queryWorkingTeamList({
                ...unref(formState),
                workOrderCode: workOrderCode.value
            });

            return res.data.object;
        },
        rowKey: 'workingTeamId',
        isPageAble: false,
        colorRow: true
    });

    const onSave = () => {
        if (selectRow.value.workingTeamId) {
            emit('setTeamGroups', selectRow.value);
        }
        setVisible(false);
    };

    const handleFinish = () => {
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
