<template>
    <TpfModal
        class="WorknModel"
        v-model:visible="visible"
        title="选择用户"
        height="400px"
        width="880px"
    >
        <a-form
            :label-col="{ span: 10, offset: 2 }"
            layout="inline"
            :model="formState"
            @finish="handleFinish"
        >
            <a-form-item label="用户账号">
                <a-input v-model:value="formState.userAccount" />
            </a-form-item>
            <a-form-item label="用户姓名">
                <a-input v-model:value="formState.userName" />
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
                >保存
            </a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="ts" name="WorknModel">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { ref, unref, defineAsyncComponent } from 'vue';
    import type { TpfColumnType } from '@/types';
    import { useAntdTable, useRef } from '@/hooks';
    import { useUserApi } from '@/api';
    import { tableResizable } from '@/config';
    import { isEmpty } from 'lodash-es';

    const userApi = useUserApi();
    const [visible, setVisible] = useRef(false);
    const emit = defineEmits(['getData']);
    const indexNum = ref();
    const open = (i: number, workshopId: number) => {
        indexNum.value = i;
        formState.value.workshopId = workshopId;
        getDataList();
        setVisible(!visible.value);
    };

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const formState = ref({
        userAccount: '',
        userName: '',
        workshopId: -1
    });
    const columns = ref<TpfColumnType[]>([
        {
            title: '用户账号',
            dataIndex: 'userAccount',
            ...tableResizable()
        },
        {
            title: '用户姓名',
            dataIndex: 'userName',
            ...tableResizable()
        },
        { title: '岗位描述', dataIndex: 'position', ...tableResizable() }
    ]);

    const { tableInfo, pagination, getDataList, selectRow } = useAntdTable({
        api: async pageInfo => {
            const { current = 1, pageSize } = unref(pageInfo);
            const params = {
                page: current,
                pageSize,
                ...unref(formState)
            };
            const res = await userApi.queryUserPageByParam(unref(params));
            return res.data.object;
        },
        rowKey: 'userAccount',
        isPageAble: true,
        colorRow: true
    });

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
