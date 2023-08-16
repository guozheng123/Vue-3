<template>
    <div class="Factory">
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
                <TpfTableLayout showChangeTableFontSize showChangeTableGap :pageCode="pageCode">
                    <template #default="args">
                        <TpfTable
                            v-bind="{
                                ...args,
                                ...tableInfo,
                                pagination,
                                operateColumn,
                                seq: true,
                                beforeRender,
                                dataSource
                            }"
                        />
                    </template>
                    <template #operateLeft>
                        <a-button type="primary" class="tpf-button" @click="onAdd">
                            <SvgIcon type="icon-insert" />新增
                        </a-button>
                        <a-button
                            class="tpf-button"
                            type="primary"
                            :disabled="isEmpty(selectedRowInfo.selectedRowKeys)"
                            @click="onDelete"
                        >
                            <SvgIcon type="icon-shanchu" />删除
                        </a-button>
                        <a-button class="tpf-button" type="primary" @click="exportList" ghost>
                            <SvgIcon type="icon-daochu" />导出
                        </a-button>
                    </template>
                </TpfTableLayout>
            </template>
        </TpfIndentation>
        <FactoryModal ref="target" @updateList="updateList" />
        <DelModal ref="delDetail" />
    </div>
</template>

<script setup lang="tsx" name="Factory">
    import { ref, defineAsyncComponent, computed, onMounted, unref } from 'vue';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import type { TpfColumnType } from '@/types';
    import { useFactoryAPi, useFilesystemApi, getCompanyFactoryTreeList } from '@/api';
    import { withTpfTableOperateColumn } from '@/components/TpfTable';
    import { message, Textarea } from 'ant-design-vue';
    import { getTpfOptionEnum, PageCodeEnum } from '@/config';
    import { useStore } from '@/store';
    import { cloneDeep, isEmpty } from 'lodash-es';

    const { cacheSearchStore } = useStore();

    const pageCode = PageCodeEnum.systemManageBuildBusinessFactory;

    const { statusOption, getLabel } = getTpfOptionEnum();
    const factoryAPi = useFactoryAPi();
    const filesystemApi = useFilesystemApi();

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

    const FactoryModal = defineAsyncComponent(
        () => import('@/views/systemManage/buildBusiness/Factory/components/FactoryModal.vue')
    );
    const DelModal = defineAsyncComponent(() => import('./components/DelModal.vue'));
    const [delDetail, onOpenDel] = useOpenAntdModal();
    const [target, onOpenModal] = useOpenAntdModal();

    const { treeData, fetchApi, treeLoading } = getCompanyFactoryTreeList();

    const defaultBtn = [
        { title: '编辑', onClick: ({ record }: any) => onOpenModal('edit', unref(record)) }
    ];

    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 100,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });

    const currentSelectTree = ref<Record<string, any>>({});

    const dataSource = ref<any[]>([]);
    const { tableInfo, pagination, getDataList, selectedRowInfo, getTableList } = useAntdTable({
        api: async () => {
            const res = await factoryAPi.getFactoryList({
                companyId: unref(currentSelectTree)?.rootId
            });
            dataSource.value = cloneDeep(res.data.list);
            return res.data;
        },
        rowKey: 'factoryId',
        isPageAble: false,
        hasRowSelection: true
    });

    const selectTree = (select: (typeof treeData.value)[number]) => {
        currentSelectTree.value = select;
        selectedRowInfo.value = {
            selectedRowKeys: [],
            selectedRows: []
        };
        filterData();
    };

    const filterData = () => {
        if (!unref(currentSelectTree)) {
            dataSource.value = unref(getTableList());
            return;
        }

        if (unref(currentSelectTree)?.fatherCode) {
            dataSource.value = unref(getTableList()).filter(
                item => item.factoryCode === unref(currentSelectTree)?.rootCode
            );
        } else {
            dataSource.value = unref(getTableList()).filter(
                item => item.companyId === unref(currentSelectTree)?.rootId
            );
        }
    };

    const currentSelectTreeIsFirstLevel = computed(() => {
        if (isEmpty(unref(currentSelectTree))) return false;
        return !unref(currentSelectTree)?.fatherCode;
    });

    const beforeOpenAdd = () => {
        if (!unref(treeData).length) {
            message.error('请选新建【公司信息】！');
            return false;
        }
        if (!unref(currentSelectTreeIsFirstLevel)) {
            message.error('请选中顶级节点,才能新增！');
            return false;
        }

        return true;
    };

    const onAdd = () => {
        if (!beforeOpenAdd()) return;
        onOpenModal('add', unref(currentSelectTree));
    };

    const updateList = () => {
        getDataList();
        fetchApi();
    };

    const onDelete = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定删除选中的工厂信息吗？' });
        const res = await factoryAPi.deleteFactory({
            id: unref(selectedRowInfo).selectedRowKeys as string[]
        });
        onOpenDel(res.data.list);
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

    const exportList = () => {
        filesystemApi.exportFileList(() =>
            factoryAPi.factoryListExport({
                tableHeaderConfig: cacheSearchStore.getUploadLoadSortColumns(pageCode)
            })
        );
    };
    onMounted(() => {
        getDataList();
    });
</script>

<style lang="less" scoped>
    .Factory {
        background-color: #fff;
        height: 100%;
    }
</style>
