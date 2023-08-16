<template>
    <TpfModal class="Model" v-model:visible="visible" title="选择用户" height="400px" width="800px">
        <a-form class="tpf-form" layout="inline" :model="formState" @finish="handleFinish">
            <a-row style="width: 100%">
                <a-col :span="11">
                    <a-form-item label="用户账号">
                        <a-input v-model:value="formState.userAccount" />
                    </a-form-item>
                </a-col>
                <a-col :span="11">
                    <a-form-item label="用户姓名">
                        <a-input v-model:value="formState.userName" />
                    </a-form-item>
                </a-col>

                <a-col :span="2">
                    <a-form-item>
                        <a-button type="primary" html-type="submit">查询</a-button>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <TpfLayout style="height: 320px">
            <template #content>
                <TpfTableLayout>
                    <template #default="args">
                        <TpfTable
                            :scroll="{ y: 350, x: 700 }"
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
                </TpfTableLayout>
            </template>
        </TpfLayout>
        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="onSave">保存</a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="ts" name="WorknModel">
    import TpfModal from '@/components/TpfModal/index.vue';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, unref, defineAsyncComponent, onMounted } from 'vue';
    import type { TpfColumnType } from '@/types';
    import { useAntdTable, useRef } from '@/hooks';
    import { userReportManage, QueryUserWorkshopOperationList } from '@/api';
    import { tableResizable } from '@/config';
    const userReportManageAPi = userReportManage();

    const [visible, setVisible] = useRef(false);
    const emit = defineEmits(['getData']);
    const open = () => {
        setVisible(!visible.value);
        getDataList();
    };
    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const formState = ref({
        userAccount: '',
        userName: ''
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
        }
        // { title: '岗位描述', dataIndex: 'createUser', ...tableResizable() }
    ]);

    const { tableInfo, pagination, loading, getDataList, selectedRowInfo } = useAntdTable({
        api: async pageInfo => {
            const { current = 1, pageSize } = unref(pageInfo);
            const params = {
                page: current,
                pageSize,
                ...unref(formState)
            };
            const res = await userReportManageAPi.queryManageUserList(unref(params));
            return res.data.object;
        },
        rowKey: 'userId',
        isPageAble: true,
        hasRowSelection: true
    });
    const onSave = () => {
        const params = selectedRowInfo.value.selectedRows.map(
            (e: QueryUserWorkshopOperationList) => {
                const list = {
                    userId: e.userId,
                    workshopId: e.workshopId,
                    workshopManageId: e.workshopManageId
                };
                return list;
            }
        );
        emit('getData', params);
        setVisible(false);
    };
    const handleFinish = () => {
        unref(pagination).current = 1;
        getDataList();
    };

    defineExpose({ open });

    onMounted(() => {
        getDataList();
    });
</script>

<style scoped lang="less">
    :deep(.tpf-layout-content) {
        margin-top: 0 !important;

        .operate-line {
            height: 0 !important;
        }
    }
</style>
