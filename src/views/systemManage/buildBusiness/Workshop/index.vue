<template>
    <TpfIndentation>
        <template #left>
            <LoadingSkeleton>
                <GroupTree :treeData="treeData" @selectTree="selectTree" v-loading="treeLoading" />
            </LoadingSkeleton>
        </template>

        <template #right>
            <TpfTableLayout showChangeTableFontSize showChangeTableGap :pageCode="pageCode">
                <template #default="args">
                    <TpfTable
                        v-bind="{
                            ...args,
                            ...tableInfo,
                            loading,
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
                        <SvgIcon type="icon-insert" /> 新增
                    </a-button>
                    <a-button
                        @click="onDelete"
                        class="tpf-button"
                        type="primary"
                        :disabled="isEmpty(selectedRowInfo.selectedRowKeys)"
                    >
                        <SvgIcon type="icon-shanchu" /> 删除
                    </a-button>
                    <a-button class="tpf-button" type="primary" @click="exportList" ghost>
                        <SvgIcon type="icon-daochu" /> 导出
                    </a-button>
                </template>
            </TpfTableLayout>
        </template>

        <WorkshopModal
            ref="workshopModalDom"
            @updateList="updateList"
            v-if="showWorkshopModalDom"
        />
        <DelModal ref="delDetail" v-if="showDelDetail" />
    </TpfIndentation>
</template>

<script lang="tsx" setup name="Workshop">
    import { ref, defineAsyncComponent, onMounted, unref, computed } from 'vue';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import type { TpfColumnType } from '@/types';
    import { useWorkshopAPi, useFilesystemApi, getFactoryWorkshopTreeList } from '@/api';
    import { message, Textarea } from 'ant-design-vue';
    import { getTpfOptionEnum, PageCodeEnum } from '@/config';
    import { useStore } from '@/store';
    import { cloneDeep, isEmpty } from 'lodash-es';
    import dayjs from 'dayjs';

    const { cacheSearchStore } = useStore();

    const pageCode = PageCodeEnum.systemManageBuildBusinessWorkshop;

    const { statusOption, getLabel } = getTpfOptionEnum();

    const workshopAPi = useWorkshopAPi();

    const filesystemApi = useFilesystemApi();

    const [workshopModalDom, openWorkshopModalDom, showWorkshopModalDom] = useOpenAntdModal();

    const TpfIndentation = defineAsyncComponent(
        () => import('@/components/TpfIndentation/index.vue')
    );

    const GroupTree = defineAsyncComponent(() => import('../components/GroupTree.vue'));

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const WorkshopModal = defineAsyncComponent(
        () => import('@/views/systemManage/buildBusiness/Workshop/components/WorkshopModal.vue')
    );
    const DelModal = defineAsyncComponent(() => import('./components/DelModal.vue'));

    const [delDetail, onOpenDel, showDelDetail] = useOpenAntdModal();

    const defaultBtn = [
        {
            title: '编辑',
            onClick: (row: any) => openWorkshopModalDom('edit', unref(row.record))
        }
    ];

    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 100,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });

    const { treeData, fetchApi, treeLoading } = getFactoryWorkshopTreeList();

    const dataSource = ref<any[]>([]);

    const currentSelectTree = ref<Record<string, any>>({});

    const currentSelectTreeIsFirstLevel = computed(() => {
        if (isEmpty(unref(currentSelectTree))) return false;
        return !unref(currentSelectTree).fatherCode;
    });

    const { tableInfo, pagination, loading, getDataList, selectedRowInfo, getTableList } =
        useAntdTable({
            api: async () => {
                const res = await workshopAPi.getWorkshopList();
                dataSource.value = cloneDeep(res.data.list);
                return res.data;
            },
            rowKey: 'workshopId',
            isPageAble: false,
            hasRowSelection: true
        });

    const selectTree = (select: any) => {
        selectedRowInfo.value = {
            selectedRowKeys: [],
            selectedRows: []
        };
        currentSelectTree.value = select;
        filterData();
    };

    const filterData = () => {
        if (!unref(currentSelectTree)) {
            dataSource.value = unref(getTableList());
            return;
        }
        if (unref(currentSelectTree)?.fatherCode) {
            dataSource.value = unref(getTableList()).filter(
                item => item.workshopCode === unref(currentSelectTree).rootCode
            );
        } else {
            dataSource.value = unref(getTableList()).filter(
                item => item.factoryCode === unref(currentSelectTree).rootCode
            );
        }
    };

    const onDelete = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定删除选中的车间信息吗？' });
        const res = await workshopAPi.deleteWorkshop({
            id: unref(selectedRowInfo).selectedRowKeys as string[]
        });
        onOpenDel(res.data.list);
        getDataList();
    };
    const beforeOpenAdd = () => {
        if (!unref(treeData).length) {
            message.error('请选新建【新增工厂信息】！');
            return false;
        }
        if (!unref(currentSelectTreeIsFirstLevel) || isEmpty(unref(currentSelectTree))) {
            message.error('请选中顶级节点,才能新增！');
            return false;
        }
        return true;
    };

    const onAdd = () => {
        if (!beforeOpenAdd()) return;
        openWorkshopModalDom('add', unref(currentSelectTree));
    };
    const updateList = () => {
        getDataList();
        fetchApi();
    };

    const beforeRender = (list: TpfColumnType[]) => {
        return unref(list).map(item => {
            if (item.dataIndex === 'remarks') {
                item.customRender = ({ text }) => <Textarea value={text} rows={1} />;
            }
            if (item.dataIndex === 'status') {
                item.customRender = ({ text }) => getLabel(text, statusOption);
            }
            if (item.dataIndex === 'createDatetime' || item.dataIndex === 'modifyDatetime') {
                item.customRender = ({ text }) => {
                    return dayjs(text).format('YYYY-MM-DD');
                };
            }
            return item;
        });
    };

    const exportList = async () => {
        filesystemApi.exportFileList(() =>
            workshopAPi.workshopListDerive({
                tableHeaderConfig: cacheSearchStore.getUploadLoadSortColumns(pageCode)
            })
        );
    };

    onMounted(() => {
        getDataList();
    });
</script>
