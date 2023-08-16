<template>
    <TpfModal
        class="teamGroups"
        v-model:visible="visible"
        title="选择用户"
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
                    <a-form-item label="用户账号">
                        <a-input v-model:value="formState.userAccount" />
                    </a-form-item>
                </a-col>
                <a-col :span="10">
                    <a-form-item label="用户姓名">
                        <a-input v-model:value="formState.userName" />
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

    const [visible, setVisible] = useRef(false);

    const emit = defineEmits(['setData']);

    const open = (res: string[]) => {
        workOrderCode.value = res;
        setVisible(!visible.value);
        getDataList();
    };
    const workOrderCode = ref<string[]>([]);

    const jobOrderAPi = useJobOrderAPi();

    const formState = ref({ userAccount: '', userName: '' });

    const columns = ref<TpfColumnType[]>([
        { title: '用户账号', dataIndex: 'userAccount', ...tableResizable() },
        { title: '用户姓名', dataIndex: 'userName', ...tableResizable() },
        { title: '岗位描述', dataIndex: 'position', ...tableResizable() }
    ]);

    const { tableInfo, pagination, getDataList, selectRow } = useAntdTable({
        api: async () => {
            const res = await jobOrderAPi.queryResponsiblePersonList({
                ...unref(formState),
                workOrderCode: workOrderCode.value
            });
            return res.data.object;
        },
        rowKey: 'userId',
        isPageAble: false,
        colorRow: true
    });

    const onSave = () => {
        if (unref(selectRow).userId) {
            emit('setData', selectRow.value);
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
