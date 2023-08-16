<template>
    <div class="group">
        <GroupModal ref="groupAdd" @submitAdd="submitAdd" @submitUpdata="submitUpdata" />
        <DelModal ref="delDetail" />
        <TpfTableLayout showChangeTableFontSize showChangeTableGap :pageCode="pageCode">
            <template #default="args">
                <TpfTable
                    :loading="loading"
                    :pagination="pagination"
                    v-bind="{
                        ...tableInfo,
                        ...args,
                        seq: true,
                        operateColumn,
                        beforeRender
                    }"
                />
            </template>
            <template #operateLeft>
                <a-button class="tpf-button" type="primary" @click="addGroup">
                    <SvgIcon type="icon-insert" />新增
                </a-button>
                <a-button
                    class="tpf-button"
                    type="primary"
                    :disabled="isEmpty(selectedRowInfo.selectedRowKeys)"
                    @click="removeGroup"
                >
                    <SvgIcon type="icon-shanchu" :size="16" />删除
                </a-button>
                <a-button class="tpf-button" type="primary" ghost @click="exportGroup">
                    <SvgIcon type="icon-daochu" :size="16" />导出
                </a-button>
            </template>
        </TpfTableLayout>
    </div>
</template>

<script setup lang="tsx" name="Group">
    import { defineAsyncComponent, ref, onMounted, unref } from 'vue';
    import { message, Textarea } from 'ant-design-vue';
    import { useAntdTable, useOpenAntdModal, useRef } from '@/hooks';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { withTpfTableOperateColumn } from '@/components/TpfTable';
    import { useGroupAPi, GroupCreateObj, useFilesystemApi } from '@/api';
    import { getTpfOptionEnum, PageCodeEnum } from '@/config';
    import type { TpfColumnType } from '@/types';
    import { useStore } from '@/store';
    import { isEmpty } from 'lodash-es';
    const { cacheSearchStore } = useStore();

    const pageCode = PageCodeEnum.systemManageBuildBusinessGroup;

    const { statusOption, getLabel } = getTpfOptionEnum();
    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));
    const GroupModal = defineAsyncComponent(() => import('./components/GroupModal.vue'));
    const DelModal = defineAsyncComponent(() => import('./components/DelModal.vue'));

    const [groupAdd, onOpenModal] = useOpenAntdModal();

    const [delDetail, onOpenDel] = useOpenAntdModal();

    const filesystemApi = useFilesystemApi();

    const groupAPi = useGroupAPi();

    // const selectData = ref<any>([]);

    const defaultBtn = [{ title: '编辑', onClick: (row: any) => editGroup(row) }];

    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 100,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });

    const { tableInfo, pagination, loading, getDataList, selectedRowInfo } = useAntdTable({
        api: async () => {
            const res = await groupAPi.getGroupList();
            return res.data;
        },
        rowKey: 'groupId',
        isPageAble: false,
        hasRowSelection: true
    });

    //新增
    const addGroup = () => {
        onOpenModal('add');
    };
    const submitAdd = async (v: GroupCreateObj) => {
        const res = await groupAPi.createGroup(v);
        if (res.data.value) {
            message.success('集团信息保存成功！');
            onOpenModal('close');
            getDataList();
        } else {
            message.error(res.errorMessage);
        }
    };
    //编辑
    const editGroup = (v: any) => {
        onOpenModal('edit', v.value);
    };
    const submitUpdata = async (v: GroupCreateObj) => {
        const res = await groupAPi.updateGroup(v);
        if (res.data.value) {
            message.success('集团信息保存成功！');
            onOpenModal('close');
            getDataList();
        } else {
            message.error(res.errorMessage);
        }
    };
    //删除
    const removeGroup = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定删除选中的集团信息吗？' });
        del();
    };
    const del = async () => {
        const arr: Array<number> = [];
        unref(selectedRowInfo).selectedRows.forEach((item: any) => {
            arr.push(item.groupId);
        });
        const res = await groupAPi.deleteGroup(arr);
        onOpenDel(res.data.list);
        // setSelectedRowKeys([]);
        getDataList();
    };

    const beforeRender = (list: TpfColumnType[]) => {
        return unref(list).map(item => {
            if (item.dataIndex === 'remarks') {
                item.customRender = ({ text }) => <Textarea value={text} rows={1} />;
            }
            if (item.dataIndex === 'status') {
                item.customRender = ({ text }) => getLabel(text, statusOption);
            }
            return item;
        });
    };

    //导出
    const exportGroup = async () => {
        filesystemApi.exportFileList(() =>
            groupAPi.groupListExport({
                tableHeaderConfig: cacheSearchStore.getUploadLoadSortColumns(pageCode)
            })
        );
    };

    onMounted(() => {
        getDataList();
    });
</script>

<style scoped>
    .group {
        background-color: #fff;
        height: 100%;
    }
</style>
