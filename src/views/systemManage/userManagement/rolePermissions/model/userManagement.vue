<template>
    <TpfModal
        class="userManagement"
        v-model:visible="visible"
        title="用户管理"
        height="400px"
        width="1000px"
    >
        <a-form class="tpf-form" layout="inline" :model="formState" @finish="handleFinish">
            <a-row style="width: 100%">
                <a-col :span="7">
                    <a-form-item label="用户账号">
                        <a-input v-model:value="formState.userAccount" />
                    </a-form-item>
                </a-col>
                <a-col :span="7">
                    <a-form-item label="用户姓名">
                        <a-input v-model:value="formState.userName" />
                    </a-form-item>
                </a-col>

                <a-col :span="7">
                    <a-form-item label="部门">
                        <a-input v-model:value="formState.departmentName" />
                    </a-form-item>
                </a-col>
                <a-col :span="3">
                    <a-form-item style="float: right">
                        <a-button type="primary" html-type="submit">查询</a-button>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <TpfLayout>
            <template #content>
                <TpfTableLayout>
                    <template #default="args">
                        <TpfTable
                            v-bind="{
                                ...args,
                                ...tableInfo,
                                loading,
                                pagination: false,
                                columns,
                                seq: true
                            }"
                        />
                    </template>
                    <template #operateLeft>
                        <a-button type="primary" @click="onAdd" class="tpf-button">
                            <SvgIcon type="icon-insert" style="margin-right: 5px" />
                            新增
                        </a-button>
                        <a-button
                            class="tpf-button"
                            type="primary"
                            :disabled="!selectedRowInfo.selectedRowKeys.length"
                            @click="onDelete"
                        >
                            <SvgIcon type="icon-shanchu" style="margin-right: 5px" /> 删除
                        </a-button>
                    </template>
                    <template #operateRight>
                        <div
                            >已选<span class="cheack">{{
                                selectedRowInfo.selectedRowKeys.length
                            }}</span
                            >位用户</div
                        >
                    </template>
                </TpfTableLayout>
            </template>
        </TpfLayout>
        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="submitModel">保存</a-button>
        </template>
        <AddUserManagement @upload-table="getChildList" ref="addUserManagement" />
    </TpfModal>
</template>

<script setup lang="ts" name="UserManagement">
    import TpfModal from '@/components/TpfModal/index.vue';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, unref, defineAsyncComponent } from 'vue';
    import type { TpfColumnType } from '@/types';
    import { useAntdTable, useRef, useOpenAntdModal } from '@/hooks';
    import { useUserApi, useRoleApi } from '@/api';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { message } from 'ant-design-vue';

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));
    const AddUserManagement = defineAsyncComponent(() => import('./addUserManagement.vue'));

    const formState = ref({
        userAccount: '',
        userName: '',
        departmentName: ''
    });
    const roleApi = useRoleApi();

    const userApi = useUserApi();
    const [visible, setVisible] = useRef(false);
    const [addUserManagement, onOpenAddUserManagement] = useOpenAntdModal();

    const paramsData = ref();

    const columns = ref<TpfColumnType[]>([
        {
            title: '用户账号',
            dataIndex: 'userAccount',
            key: 'userAccount',
            align: 'center',
            width: 150
        },
        {
            title: '用户姓名',
            dataIndex: 'userName',
            key: 'userName',
            align: 'center',
            width: 150
        },
        {
            title: '部门',
            dataIndex: 'departmentName',
            key: 'departmentName',
            align: 'center',
            width: 150
        }
    ]);

    const { tableInfo, loading, getDataList, selectedRowInfo } = useAntdTable({
        api: async () => {
            const res = await userApi.queryRoleUserListByParam({
                ...unref(formState),
                roleId: unref(paramsData).roleId
            });
            return res.data;
        },
        rowKey: 'userId',
        isPageAble: false,
        hasRowSelection: true
    });

    const open = (val: any) => {
        formState.value = {
            userAccount: '',
            userName: '',
            departmentName: ''
        };
        paramsData.value = val;
        getDataList();
        setVisible(!visible.value);
    };

    const handleFinish = () => {
        getDataList();
    };
    const submitModel = async () => {
        const ids = tableInfo.value.dataSource?.map((e: any) => {
            return e.userId;
        });
        const params = {
            ...paramsData.value,
            userId: ids
        };
        await roleApi.updateRoleUser(params);
        message.success('保存成功');
        setVisible(!visible.value);
    };
    const onAdd = () => {
        const ids = tableInfo.value.dataSource?.map((e: any) => {
            return e.userId;
        });
        onOpenAddUserManagement(ids);
    };
    const onDelete = async () => {
        const params = {
            ...paramsData.value,
            userId: unref(selectedRowInfo.value.selectedRowKeys)
        };
        await roleApi.deleteRoleUser(params);
        message.success('删除成功');
        getDataList();
    };

    const getChildList = (data: any) => {
        data.forEach((e: any) => {
            tableInfo.value.dataSource?.push(e);
        });
    };

    defineExpose({ open });
</script>

<style scoped lang="less">
    :deep(.tpf-layout-content) {
        margin-top: 0 !important;

        // .operate-line {
        //     height: 0 !important;
        // }
    }

    .cheack {
        color: var(--ant-primary-color);
    }
</style>
