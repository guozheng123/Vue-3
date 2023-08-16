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
                            pagination,
                            operateColumn,
                            seq: true,
                            beforeRender,
                            dataSource
                        }"
                    />
                </template>
                <template #operateLeft>
                    <a-button class="tpf-button" type="primary" @click="onAdd">
                        <SvgIcon type="icon-insert" />新增
                    </a-button>
                    <a-button
                        class="tpf-button"
                        type="primary"
                        @click="onDel"
                        :disabled="selectedRowInfo.selectedRowKeys.length < 1"
                    >
                        <SvgIcon type="icon-shanchu" :size="16" />删除
                    </a-button>
                    <a-button class="tpf-button" type="primary" @click="onExport" ghost>
                        <SvgIcon type="icon-daochu" :size="16" />导出
                    </a-button>
                </template>
            </TpfTableLayout>
        </template>
        <CompanyModal
            ref="target"
            @submitAdd="submitAdd"
            @submitUpdata="submitUpdata"
            v-if="showTarget"
        />
        <DelModal ref="delDetail" v-if="showDelDetail" />
    </TpfIndentation>
</template>

<script setup lang="tsx" name="Company">
    import TpfIndentation from '@/components/TpfIndentation/index.vue';
    import { ref, defineAsyncComponent, onMounted, unref, computed } from 'vue';
    import { message, Textarea } from 'ant-design-vue';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import { withTpfTableOperateColumn } from '@/components/TpfTable';
    import {
        useCompanyAPi,
        CompanyCreateObj,
        IResGetCompanyFactoryTreeList,
        useFilesystemApi,
        getGroupCompanyTreeList
    } from '@/api';
    import { PageCodeEnum, getTpfOptionEnum } from '@/config';
    import type { TpfColumnType } from '@/types';
    import { useStore } from '@/store';
    import { cloneDeep, isEmpty } from 'lodash-es';

    const { cacheSearchStore } = useStore();
    const pageCode = PageCodeEnum.systemManageBuildBusinessCompany;

    const { statusOption, getLabel } = getTpfOptionEnum();
    const GroupTree = defineAsyncComponent(() => import('../components/GroupTree.vue'));

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const CompanyModal = defineAsyncComponent(() => import('./components/CompanyModal.vue'));

    const DelModal = defineAsyncComponent(() => import('./components/DelModal.vue'));
    const [delDetail, onOpenDel, showDelDetail] = useOpenAntdModal();
    const [target, onOpenModal, showTarget] = useOpenAntdModal();
    const companyAPi = useCompanyAPi();
    const filesystemApi = useFilesystemApi();

    const selectTreeData = ref<Record<string, any>>({});

    const { treeData, fetchApi, treeLoading } = getGroupCompanyTreeList();

    const dataSource = ref<any[]>([]);

    const defaultBtn = [{ title: '编辑', onClick: (row: any) => onEdit(row) }];

    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 100,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });

    const { tableInfo, pagination, getDataList, selectedRowInfo, getTableList } = useAntdTable({
        api: async () => {
            const res = await companyAPi.getCompanyList();
            dataSource.value = cloneDeep(res.data.list);

            return res.data;
        },
        rowKey: 'companyId',
        isPageAble: false,
        hasRowSelection: true
    });

    const selectTree = (select: IResGetCompanyFactoryTreeList) => {
        selectedRowInfo.value = {
            selectedRowKeys: [],
            selectedRows: []
        };
        selectTreeData.value = select;
        filterData();
    };

    const filterData = () => {
        if (!unref(selectTreeData)) {
            dataSource.value = unref(getTableList());
            return;
        }
        if (unref(selectTreeData)?.fatherCode) {
            dataSource.value = unref(getTableList()).filter(
                item => item.companyCode === unref(selectTreeData).rootCode
            );
        } else {
            dataSource.value = unref(getTableList()).filter(
                item => item.groupCode === unref(selectTreeData)?.rootCode
            );
        }
    };

    const currentSelectTreeIsFirstLevel = computed(() => {
        if (isEmpty(unref(selectTreeData))) return false;
        return !unref(selectTreeData)?.fatherCode;
    });
    const beforeOpenAdd = () => {
        if (!unref(treeData).length) {
            message.error('请先新建【集团信息】！');
            return false;
        }
        if (!unref(currentSelectTreeIsFirstLevel)) {
            message.error('请选中顶级节点,才能新增！');
            return false;
        }
        return true;
    };
    const updateList = () => {
        fetchApi();
    };
    //新增
    const onAdd = () => {
        if (!beforeOpenAdd()) return;
        // let val = selectTreeData.value;
        onOpenModal('add', unref(selectTreeData));
    };
    const submitAdd = async (v: CompanyCreateObj) => {
        const res = await companyAPi.createCompany(v);
        if (res.data.value) {
            message.success('公司信息保存成功！');
            updateList();
            onOpenModal('close');
        }
    };
    //编辑
    const onEdit = (v: any) => {
        onOpenModal('edit', v.value);
    };
    const submitUpdata = async (v: CompanyCreateObj) => {
        const res = await companyAPi.updateCompany(v);
        if (res.data.value) {
            message.success('公司信息保存成功！');
            updateList();
            onOpenModal('close');
        }
    };
    //删除
    const onDel = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定要删除选中的公司信息吗?' });
        del();
    };
    const del = async () => {
        const arr: Array<number> = [];
        unref(selectedRowInfo).selectedRows.forEach((item: any) => {
            arr.push(item.companyId);
        });
        const res = await companyAPi.deleteCompany(arr);
        onOpenDel(res.data.list);
        selectedRowInfo.value.selectedRowKeys = [];
        updateList();
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
    const onExport = () => {
        filesystemApi.exportFileList(() =>
            companyAPi.companyListExport({
                tableHeaderConfig: cacheSearchStore.getUploadLoadSortColumns(pageCode)
            })
        );
    };

    onMounted(() => {
        getDataList();
    });
</script>
