<template>
    <TpfModal
        class="userManagement"
        v-model:visible="visible"
        title="添加用户"
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
            <!-- <a-form-item label="用户账号">
                <a-input v-model:value="formState.userAccount" />
            </a-form-item>
            <a-form-item label="用户姓名">
                <a-input v-model:value="formState.userName" />
            </a-form-item>
            <a-form-item label="部门">
                <a-input v-model:value="formState.departmentName" />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit"> 查询 </a-button>
            </a-form-item> -->
        </a-form>
        <TpfLayout>
            <template #content>
                <TpfTableLayout>
                    <template #default="args">
                        <TpfTable
                            :scroll="{ y: 300, x: 300 }"
                            v-bind="{
                                ...args,
                                ...tableInfo,
                                loading,
                                pagination,
                                columns,
                                seq: true
                            }"
                        />
                    </template>
                    <template #operateRight>
                        <div>
                            已选
                            <span class="cheack">{{ selectedRowInfo.selectedRowKeys.length }}</span>
                            位用户
                        </div>
                    </template>
                </TpfTableLayout>
            </template>
        </TpfLayout>
        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="submitUserManagement"
                >保存</a-button
            >
        </template>
    </TpfModal>
</template>

<script setup lang="ts" name="addUserManagement">
    import TpfModal from '@/components/TpfModal/index.vue';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, unref, defineAsyncComponent } from 'vue';
    import type { TpfColumnType } from '@/types';
    import { useAntdTable, useRef } from '@/hooks';
    import { useUserApi } from '@/api';
    import { cloneDeep, sortBy } from 'lodash-es';

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));
    // const [selectedRowKeys, setSelectedRowKeys] = useRef<string[]>([]);
    // const [selectedRow, setSelectedRow] = useRef<any[]>([]);
    const userApi = useUserApi();

    const emit = defineEmits(['uploadTable']);
    const userIds = ref([]) as any;

    const [visible, setVisible] = useRef(false);

    const formState = ref({
        userAccount: '',
        userName: '',
        departmentName: ''
    });

    const open = (val: string[]) => {
        formState.value = {
            userAccount: '',
            userName: '',
            departmentName: ''
        };
        unref(pagination).current = 1;

        getDataList();
        setVisible(!visible.value);
        userIds.value = cloneDeep(val);
        // setSelectedRowKeys(val);
        selectedRowInfo.value.selectedRowKeys = val;
    };

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
        },
        {
            title: '职位',
            dataIndex: 'position',
            key: 'position',
            align: 'center',
            width: 150
        }
    ]);

    const { tableInfo, pagination, loading, getDataList, selectedRowInfo } = useAntdTable({
        api: async pagination => {
            const { pageSize = 20, current = 1 } = unref(pagination);
            const res = await userApi.queryUserPageByParam({
                ...unref(formState),
                pageSize,
                systemFlag: 1,
                lockFlag: 1,
                page: current
            });
            const list = res.data.object.list;
            const sortByList = sortBy(list, function (o) {
                return o.userAccount;
            });
            res.data.object.list = sortByList;

            return res.data.object;
        },
        rowKey: 'userId',
        isPageAble: true,
        hasRowSelection: true
    });
    const handleFinish = () => {
        unref(pagination).current = 1;

        getDataList();
    };
    const submitUserManagement = () => {
        const data = ref([]) as any;
        unref(selectedRowInfo).selectedRows.forEach((e: any) => {
            if (!unref(userIds).includes(e.userId)) {
                data.value.push(e);
            }
        });
        emit('uploadTable', unref(data));
        setVisible(!visible.value);
    };

    defineExpose({ open });
</script>

<style scoped lang="less">
    :deep(.tpf-layout-content) {
        margin-top: 0 !important;
    }

    .cheack {
        color: var(--ant-primary-color);
    }
</style>
