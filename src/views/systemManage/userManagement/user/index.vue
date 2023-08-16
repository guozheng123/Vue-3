<template>
    <div class="user">
        <TpfIndentation>
            <template #left>
                <LoadingSkeleton>
                    <GroupTree
                        :treeData="treeData"
                        v-loading="treeLoading"
                        :fieldNames="fieldNames"
                        @selectTree="selectTree"
                    />
                </LoadingSkeleton>
            </template>
            <template #right>
                <LoadingSkeleton>
                    <TpfForm :formList="formList" @onSubmit="onSubmit" />
                </LoadingSkeleton>
                <TpfTableLayout showChangeTableFontSize showChangeTableGap :pageCode="pageCode">
                    <template #default="args">
                        <LoadingSkeleton>
                            <TpfTable
                                v-bind="{
                                    ...args,
                                    ...tableInfo,
                                    loading,
                                    pagination,
                                    operateColumn,
                                    seq: true,
                                    beforeRender
                                }"
                            />
                        </LoadingSkeleton>
                    </template>
                    <template #operateLeft>
                        <a-button type="primary" class="tpf-button" @click="onAdd">
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
                        <a-button
                            class="tpf-button"
                            type="primary"
                            :disabled="!selectedRowInfo.selectedRowKeys.length"
                            @click="onPrint"
                        >
                            <SvgIcon type="icon-dayin" style="margin-right: 5px" /> 打印
                        </a-button>
                        <!-- <a-button class="tpf-button" type="primary" @click="startExport" ghost>
                            <SvgIcon type="icon-daoru" style="margin-right: 5px" />
                            导入
                        </a-button> -->

                        <!-- 导入 -->
                        <TpfTableImportBtn
                            :uploadAction="uploadAction"
                            downLoadTemplate="userTemplate"
                            @uploadTable="uploadTable"
                            @fetch-api="fetchApi()"
                        />
                        <a-button class="tpf-button" type="primary" @click="exportFile" ghost>
                            <SvgIcon type="icon-daochu" style="margin-right: 5px" />
                            导出
                        </a-button>
                    </template>
                </TpfTableLayout>
            </template>
        </TpfIndentation>
        <!-- <TpfExport
            ref="exportModal"
            :uploadAction="uploadAction"
            downLoadTemplate="userTemplate"
            @uploadTable="uploadTable"
            @fetch-api="fetchApi()"
        /> -->
        <TpfDeleteDetail ref="delModalDom" :columns="delColumns" v-if="showDelModalDom" />
        <TpfQrprint ref="tpfQrprint" />
    </div>
</template>

<script setup lang="tsx" name="User">
    import { ref, defineAsyncComponent, unref, computed } from 'vue';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import type { TpfColumnType, TpfUploadFile } from '@/types';
    import { useFilesystemApi, getDepartmentTreeList, useUserApi } from '@/api';
    import { withTpfTableOperateColumn } from '@/components/TpfTable';
    import { message, Badge } from 'ant-design-vue';
    import { getLabel, getTpfOptionEnum, PageCodeEnum } from '@/config';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { useRouter } from 'vue-router';
    import { PaginationProps } from 'ant-design-vue';
    import { useStore } from '@/store';
    import { useTpfDeleteDetail } from '@/components/TpfDeleteDetail';

    const [tpfQrprint, onOpenTpfQrprint] = useOpenAntdModal();

    const pageCode = PageCodeEnum.systemManageBuildBusinessUser;

    const TpfTableImportBtn = defineAsyncComponent(
        () => import('@/components/TpfTable/TpfTableImportBtn.vue')
    );

    // const TpfExport = defineAsyncComponent(() => import('@/components/TpfExport/index.vue'));

    const TpfIndentation = defineAsyncComponent(
        () => import('@/components/TpfIndentation/index.vue')
    );
    const TpfQrprint = defineAsyncComponent(() => import('@/components/TpfQrprint/index.vue'));

    const GroupTree = defineAsyncComponent(
        () => import('@/views/systemManage/buildBusiness/components/GroupTree.vue')
    );

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const { delModalDom, openDelModalDom, showDelModalDom, TpfDeleteDetail } = useTpfDeleteDetail();

    // const [exportModal, onOpenExportModal] = useOpenAntdModal();
    const { userStatusOption, informatioSources, statusNumberOption, exceedTheTimeLimit } =
        getTpfOptionEnum();
    const userApi = useUserApi();

    const $router = useRouter();
    const filesystemApi = useFilesystemApi();
    const { cacheSearchStore } = useStore();

    const fieldNames = {
        children: 'branchTree',
        title: 'rootName',
        key: 'rootId'
    };

    const delColumns = [
        { title: '用户名称', dataIndex: 'userName' },
        {
            title: '结果',
            dataIndex: 'deleteType',
            customRender: (text: any) => {
                if (text.value === 0) {
                    return <Badge color="#f00" text="失败" />;
                }
                return <Badge color="#0f0" text="成功" />;
            }
        },
        { title: '原因', dataIndex: 'message' }
    ];
    const formList = computed(() => {
        return [
            {
                type: 'Input',
                field: 'userAccount',
                label: '用户账号',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'userName',
                label: '用户姓名',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'employeeNo',
                label: '员工工号',
                allowClear: true
            },
            {
                type: 'Select',
                field: 'lockFlag',
                label: '是否启用',
                allowClear: true,
                options: userStatusOption
            },
            {
                type: 'Select',
                field: 'sourceFlag',
                label: '信息来源',
                allowClear: true,
                options: informatioSources
            },
            {
                type: 'TreeSelect',
                field: 'departmentId',
                dropdownMatchSelectWidth: false,
                label: '部门',
                placeholder: '',
                allowClear: true,
                fieldNames: {
                    children: 'branchTree',
                    label: 'rootName',
                    value: 'rootId'
                },
                treeData: unref(treeData)
            },
            {
                type: 'Select',
                field: 'limitStatus',
                label: '超期状态',
                allowClear: true,
                options: userStatusOption
            }
        ];
    });

    const defaultBtn = [
        { title: '编辑', onClick: (row: any) => onEdit(row.value.userId) },
        { title: '重置密码', onClick: (row: any) => resetPassword(row) }
    ];
    const searchInfo = ref<{ [val: string]: any }>({});
    const groupTree = ref();

    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 160,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });

    const { treeData, fetchApi, treeLoading } = getDepartmentTreeList();

    const selectTree = (select: any) => {
        searchInfo.value.departmentId = select ? select.rootId : '';
        getDataList();
    };

    const { tableInfo, pagination, loading, getDataList, selectedRowInfo } = useAntdTable({
        api: async pagination => {
            const { pageSize = 20, current = 1 } = unref(pagination);
            const res = await userApi.queryUserPageByParam({
                ...unref(searchInfo),
                pageSize,
                page: current
            });
            return res.data.object;
        },
        rowKey: 'userId',
        isPageAble: true,
        hasRowSelection: true
    });
    const beforeRender = (list: TpfColumnType[]) => {
        unref(tableInfo).loading = true;
        const res = unref(list).map(item => {
            if (item.dataIndex === 'userAccount' || item.dataIndex === 'employeeNo') {
                item.customRender = ({ text, record }) => {
                    return (
                        <a
                            onClick={() => {
                                $router.push({
                                    path: '/systemManage/userManagement/user/userDetail',
                                    query: {
                                        type: 'detail',
                                        userId: unref(record).userId
                                    }
                                });
                            }}
                        >
                            {text}
                        </a>
                    );
                };
            }

            if (item.dataIndex === 'systemFlag') {
                item.customRender = ({ text }) => getLabel(text, statusNumberOption);
            }
            if (item.dataIndex === 'lockFlag') {
                item.customRender = ({ text }) => getLabel(text, statusNumberOption);
            }
            if (item.dataIndex === 'limitStatus') {
                item.customRender = ({ text }) => getLabel(text, exceedTheTimeLimit);
            }
            if (item.dataIndex === 'sourceFlag') {
                item.customRender = ({ text }) => {
                    return getLabel(text, informatioSources);
                };
            }
            if (item.dataIndex === 'roleNames') {
                item.customRender = ({ text, record }) => {
                    const val = record.roleList?.map((e: any) => {
                        return e.roleName;
                    });
                    const data = val.join('/');
                    return data;
                };
            }
            return item;
        });
        unref(tableInfo).loading = false;

        return res;
    };
    const onPrint = async () => {
        // userAccount
        const { selectedRows, selectedRowKeys } = unref(selectedRowInfo);

        let hasUserAccount = false;

        selectedRows.forEach(e => {
            if (!e.userAccount) {
                hasUserAccount = true;
                return;
            }
        });

        if (hasUserAccount) {
            message.warning('用户账号不能为空');
            return;
        }
        const params = {
            id: selectedRowKeys
        };
        const res = await userApi.queryPrintUserList(params);
        onOpenTpfQrprint({
            data: res.data.list,
            content: [
                { key: 'user_account', label: '用户账号' },
                { key: 'user_name', label: '用户名称' }
            ],
            title: '用户'
        });
    };
    // 新增
    const onAdd = () => {
        $router.push({
            path: '/systemManage/userManagement/user/addUser',
            query: {
                type: 'add'
            }
        });
    };

    //编辑
    const onEdit = (val: string) => {
        $router.push({
            path: '/systemManage/userManagement/user/editUser',
            query: {
                type: 'edit',
                userId: val
            }
        });
    };

    const resetPassword = async (row: any) => {
        console.log(row.value);
        if (row.value.sourceFlag === 1) {
            message.warning('用户中心的用户不允许重置密码');
        } else {
            const res = await userApi.resetPassword({ userId: row.value.userId });
            if (res.data.value === true) {
                message.success('用户密码重置密码成功');
            } else {
                message.error('用户密码重置密码失败');
            }
        }
    };
    const onSubmit = (val: any) => {
        searchInfo.value = unref(val);
        unref(pagination).current = 1;

        getDataList();
    };

    const uploadAction = async (fileInfo: { list: TpfUploadFile[]; overrideFlag: boolean }) => {
        const { list, overrideFlag } = unref(fileInfo);
        const [{ fileCode }] = list;
        return await userApi.importUser({ overrideFlag, fileCode });
    };

    // const startExport = () => {
    //     onOpenExportModal();
    // };

    const onDelete = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定删除选中的信息吗?' });
        const params = {
            id: unref(selectedRowInfo.value.selectedRowKeys)
        };
        const res = await userApi.deleteUser(params);
        openDelModalDom(res.data.list);
        getDataList();
    };

    const exportFile = () => {
        const { current, pageSize, total } = unref(pagination) as PaginationProps;

        filesystemApi.exportFileList(() =>
            userApi.exportUser({
                ...unref(searchInfo),
                userIdList: selectedRowInfo.value.selectedRowKeys,
                current,
                pageSize,
                total,
                tableHeaderConfig: cacheSearchStore.getUploadLoadSortColumns(pageCode)
            })
        );
    };
    const uploadTable = () => {
        getDataList();
        groupTree.value.toggleOpen(true);
    };
</script>

<style lang="less" scoped>
    .user {
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

                .tpf-table-layout {
                }
            }
        }
    }
</style>
