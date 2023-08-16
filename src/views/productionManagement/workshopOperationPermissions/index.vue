<template>
    <div class="workshopOperationPermissions">
        <TpfIndentation>
            <template #left>
                <LoadingSkeleton>
                    <GroupTree
                        :treeData="treeData"
                        @selectTree="selectTree"
                        v-loading="treeLoading"
                    />
                </LoadingSkeleton>
            </template>
            <template #right>
                <LoadingSkeleton>
                    <TpfForm :formList="formList" @onSubmit="onSubmit" />
                </LoadingSkeleton>
                <TpfTableLayout showChangeTableFontSize showChangeTableGap>
                    <template #default="args">
                        <LoadingSkeleton>
                            <TpfTable
                                v-bind="{
                                    ...args,
                                    ...tableInfo,
                                    pagination,
                                    seq: true,
                                    columns
                                }"
                            />
                        </LoadingSkeleton>
                    </template>
                    <template #operateLeft>
                        <a-button type="primary" class="tpf-button" @click="onAdd">
                            <SvgIcon type="icon-insert" /> 新增
                        </a-button>
                        <a-button
                            class="tpf-button"
                            type="primary"
                            :disabled="!selectedRowInfo.selectedRows.length"
                            @click="onDelete"
                        >
                            <SvgIcon type="icon-shanchu" /> 删除
                        </a-button>
                    </template>
                </TpfTableLayout>
            </template>
        </TpfIndentation>
        <Model ref="target" @get-data="getRowKey" v-if="showModel" />
    </div>
</template>

<script setup lang="tsx" name="workshopOperationPermissions">
    import { ref, defineAsyncComponent, unref, computed } from 'vue';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import type { TpfColumnType } from '@/types';
    import { message } from 'ant-design-vue';
    import { tableResizable } from '@/config';
    import {
        userReportManage,
        QueryUserWorkshopOperationList,
        getFactoryWorkshopTreeList
    } from '@/api';

    import TpfForm from '@/components/TpfForm/index.vue';
    const userReportManageAPi = userReportManage();

    const TpfIndentation = defineAsyncComponent(
        () => import('@/components/TpfIndentation/index.vue')
    );

    const GroupTree = defineAsyncComponent(
        () => import('@/views/systemManage/buildBusiness/components/GroupTree.vue')
    );

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const Model = defineAsyncComponent(() => import('./Mode.vue'));

    const [target, onOpenModal, showModel] = useOpenAntdModal();

    const formList = computed(() => {
        return [
            {
                type: 'Input',
                field: 'userAccount',
                label: '用户账号',
                placeholder: '',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'userName',
                label: '用户姓名',
                placeholder: '',
                allowClear: true
            }
        ];
    });

    const searchInfo = ref<any>({});

    const { treeData, treeLoading } = getFactoryWorkshopTreeList();

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
    ]);
    const currentSelectTree = ref('');
    const isWorkshop = ref(false);
    const { tableInfo, pagination, getDataList, selectedRowInfo } = useAntdTable({
        api: async pagination => {
            const { pageSize = 20, current = 1 } = unref(pagination);
            const res = await userReportManageAPi.queryUserWorkshopOperationList({
                ...unref(searchInfo),
                pageSize,
                workshopId: currentSelectTree.value,
                page: current
            });
            return res.data.object;
        },
        rowKey: 'userId',
        isPageAble: true,
        hasRowSelection: true
    });

    const selectTree = (select: any) => {
        if (select) {
            if (!select.branchTree) {
                currentSelectTree.value = select.rootId;
                isWorkshop.value = true;
            } else {
                isWorkshop.value = false;
                currentSelectTree.value = '';
            }
        } else {
            isWorkshop.value = false;
            currentSelectTree.value = '';
        }
        getDataList();
    };

    // 新增
    const onAdd = () => {
        if (!isWorkshop.value) {
            message.warning('请先选择车间!');
            return false;
        }

        onOpenModal(unref(currentSelectTree));
    };

    const onSubmit = (val: QueryUserWorkshopOperationList) => {
        searchInfo.value = unref(val);
        unref(pagination).current = 1;
        getDataList();
    };

    const onDelete = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定是否删除该数据?' });
        del();
    };

    const del = async () => {
        const data = selectedRowInfo.value.selectedRows.map((e: QueryUserWorkshopOperationList) => {
            const list = {
                userId: e.userId,
                workshopId: e.workshopId,
                workshopManageId: e.workshopManageId,
                workshopOperationId: e.workshopOperationId
            };
            return list;
        });
        const params = {
            list: data
        };
        const res = await userReportManageAPi.deleteUserWorkshopOperation(params);
        if (res.data.object.success === false) {
            message.error(res.data.object.message);
        } else {
            message.success('删除成功');
        }
        getDataList();
    };

    const getRowKey = async (getRow: QueryUserWorkshopOperationList[]) => {
        getRow = getRow.map((e: QueryUserWorkshopOperationList) => {
            e.workshopId = currentSelectTree.value;
            return e;
        });

        const params = {
            list: getRow
        };
        const res = await userReportManageAPi.createUserWorkshopOperation(params);
        if (res.data.object.success) {
            message.success('保存成功');
        } else {
            message.error(res.data.object.message);
        }
        getDataList();

        // const params = getRow.value.map((e: any) => {
        //     const list = {} as any;
        //     // list.tenantId = e.tenantId;
        //     list.userId = e.userId;
        //     list.workshopId = e.workshopId;
        //     list.workshopManageId = e.workshopManageId;
        //     console.log(list);

        //     return list;
        //     //         "tenantId": 0,
        //     //   "userId": 0,
        //     //   "workshopId": 0,
        //     //   "workshopManageId": 0
        // });

        // console.log(params);
    };
</script>

<style lang="less" scoped>
    .workshopOperationPermissions {
        padding: 10px 12px 12px;
        height: 100%;
        background-color: #f7f8fa;

        .teamGroup-searchForm {
            padding: 15px;
            padding-bottom: 0;
            box-sizing: border-box;
        }

        :deep(.tpf-indentation) {
            .indentation-right {
                display: flex;
                flex-direction: column;
            }
        }
    }
</style>
