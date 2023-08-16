<template>
    <TpfIndentation class="t-px-[12px] t-py-[10px] !t-bg-[#f7f8fa]" :hiddenMove="true" width="75%">
        <template #left>
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
                        <SvgIcon type="icon-insert" />
                        新增
                    </a-button>
                    <a-button
                        class="tpf-button"
                        type="primary"
                        :disabled="!selectedRowInfo.selectedRowKeys.length"
                        @click="onDelete"
                    >
                        <SvgIcon type="icon-shanchu" /> 删除
                    </a-button>
                    <a-button
                        class="tpf-button"
                        type="primary"
                        @click="userManagementFun"
                        :disabled="selectedRowInfo.selectedRowKeys.length !== 1"
                    >
                        <SvgIcon type="icon-yonghuguanligu" />
                        用户管理
                    </a-button>
                </template>
            </TpfTableLayout>
        </template>

        <template #right>
            <LoadingSkeleton>
                <GroupTree
                    :treeData="treeData"
                    @checkedTree="checkedTree"
                    :checked="true"
                    :fieldNames="fieldNames"
                    ref="groupTreeFunction"
                >
                    <template #otherBtn>
                        <div>
                            <a-tooltip placement="bottom" color="black" title="清空">
                                <SvgIcon
                                    @click="clear"
                                    type="icon-qingkong"
                                    cursor
                                    shadow
                                    :size="24"
                                />
                            </a-tooltip>
                        </div>
                        <div>
                            <a-tooltip
                                @click="onSave"
                                placement="bottom"
                                color="black"
                                title="保存"
                            >
                                <SvgIcon type="icon-baocun" cursor shadow :size="24" />
                            </a-tooltip>
                        </div>
                        <div>
                            <a-checkbox v-model:checked="checked" @change="allCheckedFun">
                                全选
                            </a-checkbox>
                        </div>
                    </template>
                </GroupTree>
            </LoadingSkeleton>
        </template>
        <AddRolePermissions
            @submitAdd="submitAdd"
            @submitUpdata="submitUpdata"
            ref="rolePermissions"
        />
        <TpfDeleteDetail ref="delModalDom" :columns="delColumns" v-if="showDelModalDom" />
        <UserManagement ref="userManagement" />
    </TpfIndentation>
</template>

<script setup lang="tsx" name="Department">
    import { ref, defineAsyncComponent, unref, watch } from 'vue';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import { TpfColumnType } from '@/types';
    import { useRoleApi, useMenuApi } from '@/api';
    import { withTpfTableOperateColumn } from '@/components/TpfTable';
    import { message, Badge } from 'ant-design-vue';
    import { getLabel, getTpfOptionEnum, PageCodeEnum } from '@/config';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { useTpfDeleteDetail } from '@/components/TpfDeleteDetail';
    import dayjs from 'dayjs';
    import { getTreeCheckedIds } from '@/utils';

    const TpfIndentation = defineAsyncComponent(
        () => import('@/components/TpfIndentation/index.vue')
    );
    const AddRolePermissions = defineAsyncComponent(
        () => import('../rolePermissions/model/addRole.vue')
    );
    const UserManagement = defineAsyncComponent(
        () => import('../rolePermissions/model/userManagement.vue')
    );
    const GroupTree = defineAsyncComponent(
        () => import('@/views/systemManage/buildBusiness/components/GroupTree.vue')
    );

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const { delModalDom, openDelModalDom, showDelModalDom, TpfDeleteDetail } = useTpfDeleteDetail();

    const { statusOption } = getTpfOptionEnum();

    const menuApi = useMenuApi();

    const roleApi = useRoleApi();
    const pageCode = PageCodeEnum.systemManageBuildBusinessRole;
    const treeData = ref([]);
    const treeLoading = ref(false);
    const [rolePermissions, onOpenRolePermissions] = useOpenAntdModal();
    const [userManagement, onOpenUserManagement] = useOpenAntdModal();

    const fieldNames = { children: 'children', title: 'label', key: 'id' };
    const delColumns = [
        { title: '角色名称', dataIndex: 'roleName' },
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
    const currentSelectTree = ref();

    const selectData = ref<any>([]);

    const searchInfo = ref<any>({});

    const groupTreeFunction = ref();

    const checked = ref(false);

    const formList = [
        { type: 'Input', field: 'roleName', label: '角色名称', placeholder: '', allowClear: true },
        { type: 'Input', field: 'roleCode', label: '角色编号', placeholder: '', allowClear: true },
        { type: 'Input', field: 'userName', label: '用户名称', placeholder: '', allowClear: true },
        {
            type: 'Input',
            field: 'userAccount',
            label: '用户账号',
            placeholder: '',
            allowClear: true
        }
    ];

    const defaultBtn = [{ title: '编辑', onClick: (row: any) => onEdit(row) }];

    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 100,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });

    const beforeRender = (list: TpfColumnType[]) => {
        unref(tableInfo).loading = true;
        const res = unref(list).map(item => {
            if (item.dataIndex === 'lockFlag') {
                item.customRender = ({ text }) => getLabel(text, statusOption);
            }
            if (item.dataIndex === 'modifyDateTime') {
                item.customRender = ({ text }) => {
                    if (text) {
                        return dayjs(text).format('YYYY-MM-DD');
                    }
                };
            }

            return item;
        });
        unref(tableInfo).loading = false;
        return res;
    };

    const { tableInfo, pagination, getDataList, selectedRowInfo, selectRow, customRow } =
        useAntdTable({
            api: async pagination => {
                const { pageSize = 20, current = 1 } = unref(pagination);
                const res = await roleApi.queryRolePageByParam({
                    ...unref(searchInfo),
                    pageSize,
                    page: current
                });
                customRow(res.data.object.list[0]).onClick();
                return res.data.object;
            },
            rowKey: 'roleId',
            isPageAble: true,
            hasRowSelection: true,
            colorRow: true
        });

    watch(
        () => selectRow,
        async (val: any) => {
            if (val.value.roleId !== undefined) {
                treeLoading.value = true;
                const res = await menuApi.queryMenuTreeSelectByCondition({
                    roleId: val.value.roleId
                });
                treeData.value = res.data.list;
                const ids = getAllIds(res.data.list, []);
                selectData.value = ids;
                groupTreeFunction.value?.setCheck(ids);
                treeLoading.value = false;
            }
        },
        {
            deep: true,
            immediate: true
        }
    );

    const getAllIds = (data: any, expandIds: string[], idAllCheack?: true) => {
        data.map((e: any) => {
            if (e.children) {
                getAllIds(e.children, expandIds, idAllCheack);
            } else {
                if (idAllCheack) {
                    expandIds.push(e.id);
                } else {
                    if (e.checked === true) {
                        expandIds.push(e.id);
                    }
                }
            }
        });
        return expandIds;
    };

    const checkedTree = (select: { ids: (string | number)[]; e: any }) => {
        if (select.e.checked === false) {
            checked.value = false;
        }
        selectData.value = select.ids;
    };

    const allCheckedFun = () => {
        groupTreeFunction.value?.allCheckedFun(unref(checked));
        const ids = getAllIds(unref(treeData), [], true);
        selectData.value = unref(ids);
    };

    const clear = () => {
        checked.value = false;
        groupTreeFunction.value?.allCheckedFun(false);
        selectData.value = [];
    };

    const onSave = async () => {
        if (unref(selectRow).lockFlag === 0) {
            message.warning('所选角色为禁用状态');
            return false;
        }
        if (selectData.value.length === 0) {
            message.warning('请至少选择一个菜单节点');
            return false;
        }

        selectData.value = selectData.value.filter((e: string) => e !== null);
        const { roleId, tenantId } = unref(selectRow);

        const permissionCodes = getTreeCheckedIds({
            list: unref(treeData),
            checkedIds: unref(selectData),
            fieldNames
        });
        const params = {
            tenantId: tenantId,
            roleId: roleId,
            permissionCodes
        };
        await roleApi.updateRolePermission(params);
        message.success('保存成功');
    };

    // 新增
    const onAdd = () => {
        onOpenRolePermissions('add', unref(currentSelectTree));
    };
    const userManagementFun = () => {
        if (selectedRowInfo.value.selectedRows[0].lockFlag === 0) {
            message.warning('所选角色为禁用状态');
        } else {
            const tenantId = unref(selectedRowInfo).selectedRows[0].tenantId;
            const roleId = unref(selectedRowInfo).selectedRows[0].roleId;
            onOpenUserManagement({ roleId: roleId, tenantId: tenantId });
        }
    };

    const submitAdd = async (data: any) => {
        const res = await roleApi.createUpdateRole(data);
        if (res.data.value) {
            message.success('角色信息保存成功！');
            onOpenRolePermissions('close');
            getDataList();
        }
    };

    const submitUpdata = async (data: any) => {
        const res = await roleApi.createUpdateRole(data);
        if (res.data.value) {
            message.success('角色信息编辑成功！');
            onOpenRolePermissions('close');
            getDataList();
        }
    };

    //编辑
    const onEdit = (data: any) => {
        onOpenRolePermissions('edit', data.value);
    };

    const onSubmit = (val: any) => {
        searchInfo.value = unref(val);
        unref(pagination).current = 1;

        getDataList();
    };

    const onDelete = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定删除选中的用户信息吗?' });
        const params = {
            id: unref(selectedRowInfo).selectedRowKeys
        };
        const res = await roleApi.deleteRole(params);
        getDataList();

        openDelModalDom(res.data.list);
    };
</script>
