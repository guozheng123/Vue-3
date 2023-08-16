<template>
    <TpfModal v-model:visible="visible" title="选择人员" height="300px" width="800px">
        <a-form layout="inline" :model="formState" @finish="handleFinish" class="tpf-form">
            <a-row style="width: 100%">
                <a-col :span="11">
                    <a-form-item label="用户账号" name="userAccount">
                        <a-input v-model:value="formState.userAccount" />
                    </a-form-item>
                </a-col>
                <a-col :span="11">
                    <a-form-item label="用户名称" name="userName">
                        <a-input v-model:value="formState.userName" />
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

<script setup lang="tsx" name="SelectUserModel">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useAntdTable, useRef } from '@/hooks';
    import TpfTable from '@/components/TpfTable/index.vue';
    import { ref, computed, unref } from 'vue';
    import { tableResizable } from '@/config';
    import type { TpfColumnType } from '@/types';
    import { useUserApi } from '@/api';
    const userApi = useUserApi();

    const emit = defineEmits<{
        (e: 'getCustomerInfo', val: any): void;
    }>();

    const [visible, setVisible] = useRef(false);

    const formState = ref<{ userAccount?: string; userName?: string }>({
        userAccount: '',
        userName: ''
    });

    const columns = computed(() => {
        return [
            { title: '用户账号', dataIndex: 'userAccount', ...tableResizable() },
            { title: '用户姓名', dataIndex: 'userName', ...tableResizable() },
            { title: '岗位描述', dataIndex: 'position', ...tableResizable() }
        ] as TpfColumnType[];
    });

    const { tableInfo, pagination, loading, getDataList, selectRow } = useAntdTable({
        api: async pagination => {
            const { userAccount = '', userName = '' } = unref(formState);
            const { pageSize, current: page } = unref(pagination);
            const res = await userApi.queryUserPageByParam({
                userAccount,
                userName,
                pageSize,
                page
            });
            return res.data.object;
        },
        rowKey: 'userAccount',
        isPageAble: true,
        colorRow: true
    });

    const handleFinish = (val: any) => {
        formState.value = unref(val);
        unref(pagination).current = 1;
        getDataList();
    };

    const saveProjectCode = () => {
        if (unref(selectRow).userAccount) {
            emit('getCustomerInfo', unref(selectRow));
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
