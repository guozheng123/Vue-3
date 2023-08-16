<template>
    <div class="TeamGroup">
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
                    <TpfForm
                        class="teamGroup-searchForm"
                        ref="TpfFormDom"
                        :formList="formList"
                        @onSubmit="onSubmit"
                    />
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
                                    beforeRender,
                                    dataSource
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
                            :disabled="isEmpty(selectedRowInfo.selectedRowKeys)"
                            @click="onDelete"
                        >
                            <SvgIcon type="icon-shanchu" /> 删除
                        </a-button>

                        <!--导入 -->
                        <TpfTableImportBtn
                            :uploadAction="uploadAction"
                            :downLoadTemplate="downLoadTemplate"
                            @upload-table="onSubmit"
                        />

                        <a-button class="tpf-button" type="primary" @click="exportFile" ghost>
                            <SvgIcon type="icon-daochu" />导出
                        </a-button>
                    </template>
                </TpfTableLayout>
            </template>
        </TpfIndentation>
        <TeamGroupModal ref="target" @submitAdd="submitAdd" @submitUpdata="submitUpdata" />
    </div>
</template>

<script setup lang="tsx" name="TeamGroup">
    import { ref, defineAsyncComponent, unref, computed } from 'vue';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import type { TpfColumnType, TpfUploadFile } from '@/types';
    import {
        useWorkingTeamAPi,
        useFilesystemApi,
        IReqGetWorkingTeamList,
        getWorkshopWorkingTeamTreeList
    } from '@/api';
    import { withTpfTableOperateColumn } from '@/components/TpfTable';
    import { message, Textarea } from 'ant-design-vue';
    import { PageCodeEnum, getTpfOptionEnum } from '@/config';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { useStore } from '@/store';
    import { useI18n } from '@/hooks/useI18n';
    import { isEmpty, cloneDeep } from 'lodash-es';
    import { isArray } from '../../../utils/is/index';

    const { t } = useI18n();

    const { cacheSearchStore } = useStore();

    const pageCode = PageCodeEnum.systemManageTeamGroupTable;

    const { statusOption, getLabel } = getTpfOptionEnum();

    const workingTeamAPi = useWorkingTeamAPi();

    const filesystemApi = useFilesystemApi();

    const TpfTableImportBtn = defineAsyncComponent(
        () => import('@/components/TpfTable/TpfTableImportBtn.vue')
    );

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

    const TeamGroupModal = defineAsyncComponent(
        () => import('@/views/systemManage/teamGroup/components/TeamGroupModal.vue')
    );

    const [target, onOpenModal] = useOpenAntdModal();

    const searchInfo = ref<any>({});

    const TpfFormDom = ref<InstanceType<typeof TpfForm> | null>(null);

    const formList = computed(() => {
        return [
            {
                type: 'Input',
                field: 'factoryCode',
                showDefaultValue: '',
                label: '工厂编号',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'factoryName',
                showDefaultValue: '',
                label: '工厂名称',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'workshopCode',
                showDefaultValue: '',
                label: '车间编号',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'workshopName',
                showDefaultValue: '',
                label: '车间名称',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'workingTeamCode',
                showDefaultValue: '',
                label: '班组编号',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'workingTeamName',
                showDefaultValue: '',
                label: '班组名称',
                allowClear: true
            },
            {
                type: 'Select',
                showDefaultValue: '',
                field: 'status',
                label: '是否启用',
                options: statusOption
            }
        ];
    });

    const defaultBtn = [{ title: '编辑', onClick: (row: any) => onEdit(row) }];

    const operateColumn = ref<TpfColumnType>({
        title: t('component.tpfTable.operate'),
        align: 'center',
        width: 100,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });

    const { treeData, fetchApi, treeLoading } = getWorkshopWorkingTeamTreeList();

    const currentSelectTree = ref<Record<string, any>>({});

    const dataSource = ref<any[]>([]);

    const selectTreeInfo = ref({});

    const { tableInfo, pagination, getDataList, selectedRowInfo, getTableList } = useAntdTable({
        api: async pagination => {
            const { pageSize = 20, current = 1 } = unref(pagination);
            const res = await workingTeamAPi.getWorkingTeamList({
                ...unref(searchInfo),
                ...unref(selectTreeInfo),
                pageSize,
                page: current
            });
            dataSource.value = cloneDeep(res.data.object.list);
            selectTreeInfo.value = {};

            return res.data.object;
        },
        rowKey: 'workingTeamId',
        isPageAble: true,
        hasRowSelection: true
    });

    const getFactoryInfo = () => {
        return unref(treeData).find(it1 => {
            if (isArray(it1.branchTree)) {
                return it1.branchTree.find(it2 => {
                    if (isArray(it2.branchTree)) {
                        return it2.branchTree.find(
                            it3 => it3.rootId === unref(currentSelectTree).rootId
                        );
                    }
                    return false;
                });
            }
            return false;
        });
    };

    const selectTree = async (select: Record<string, any> = {}) => {
        currentSelectTree.value = select;
        if (isEmpty(select)) {
            TpfFormDom.value?.setNewState({
                factoryCode: '',
                factoryName: ''
            });
        }

        if (select.rootCode && !select.fatherCode) {
            console.log('一级', select);
            selectTreeInfo.value = {
                factoryCode: select.rootCode,
                factoryName: select.rootName
            };
            // 一级
            // TpfFormDom.value?.setNewState({
            //     factoryCode: select.rootCode,
            //     factoryName: select.rootName
            // });
        }
        if (select.fatherCode && select.rootCode) {
            console.log('二级', select);
            selectTreeInfo.value = {
                factoryCode: select.fatherCode,
                factoryName: select.fatherName
            };

            // 二级
            // TpfFormDom.value?.setNewState({
            //     factoryCode: select.fatherCode,
            //     factoryName: select.fatherName
            // });
        }
        if (!isEmpty(select) && !select.fatherId && !select.rootCode && !select.branchTree) {
            // 三级
            console.log('三级', select);

            const info = getFactoryInfo() as { rootCode: string; rootName: string };
            selectTreeInfo.value = {
                factoryCode: info.rootCode,
                factoryName: info.rootName
            };
            // TpfFormDom.value?.setNewState({
            //     factoryCode: info.rootCode,
            //     factoryName: info.rootName
            // });
        }
        unref(pagination).current = 1;
        await TpfFormDom.value?.onSubmit();
    };

    const filterData = () => {
        if (isEmpty(unref(currentSelectTree))) {
            dataSource.value = unref(getTableList());
            return;
        }

        if (unref(currentSelectTree).rootCode && !unref(currentSelectTree).fatherCode) {
            dataSource.value = unref(getTableList()).filter(
                item => item.factoryCode === unref(currentSelectTree).rootCode
            );
            return;
        }

        if (unref(currentSelectTree).fatherCode && unref(currentSelectTree).rootCode) {
            dataSource.value = unref(getTableList()).filter(
                item => item.workshopId === unref(currentSelectTree).rootId
            );
            return;
        }
        if (
            !isEmpty(unref(currentSelectTree)) &&
            !unref(currentSelectTree).fatherId &&
            !unref(currentSelectTree).rootCode &&
            !unref(currentSelectTree).branchTree
        ) {
            dataSource.value = unref(getTableList()).filter(
                item => item.workingTeamId === unref(currentSelectTree).rootId
            );
        }
    };

    const currentSelectTreeIsFirstLevel = computed(() => {
        if (!unref(currentSelectTree)) return false;
        return unref(treeData).some(item => {
            if (item.branchTree) {
                return item.branchTree.some(
                    item2 => item2.rootCode === currentSelectTree.value.rootCode
                );
            }
        });
    });

    const beforeOpenAdd = () => {
        if (!unref(treeData).length) {
            message.error('请先新建【工厂车间信息】！');
            return false;
        }
        if (!unref(currentSelectTreeIsFirstLevel)) {
            message.error('请选中车间,才能新增！');
            return false;
        }
        return true;
    };

    // 新增
    const onAdd = () => {
        if (!beforeOpenAdd()) return;
        if (!unref(currentSelectTree)) {
            return;
        }
        onOpenModal('add', unref(currentSelectTree));
    };

    const submitAdd = async (v: IReqGetWorkingTeamList) => {
        const res = await workingTeamAPi.createWorkingTeam(v);
        if (res.data.value) {
            message.success('班组信息保存成功！');
            getDataList();
            fetchApi();
            onOpenModal('close');
        }
    };

    //编辑
    const onEdit = (v: any) => {
        onOpenModal('edit', v.value);
    };

    const submitUpdata = async (v: IReqGetWorkingTeamList) => {
        const res = await workingTeamAPi.updateWorkingTeam(v);
        if (res.data.value) {
            message.success('班组信息保存成功！');
            getDataList();
            fetchApi();
            onOpenModal('close');
        }
    };

    const onSubmit = async (val: any) => {
        searchInfo.value = val;
        unref(pagination).current = 1;

        await getDataList();
        filterData();
    };

    const uploadAction = async (fileInfo: { list: TpfUploadFile[]; overrideFlag: boolean }) => {
        const { list, overrideFlag } = unref(fileInfo);

        const [{ fileCode }] = list;

        return await workingTeamAPi.workingTeamListImport({ overrideFlag, fileCode });
    };

    const onDelete = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定删除选中的班组信息吗？' });
        del();
    };

    const del = async () => {
        const arr: Array<number> = [];
        unref(selectedRowInfo).selectedRows.forEach((item: any) => {
            arr.push(item.workingTeamId);
        });
        const res = await workingTeamAPi.deleteWorkingTeam(arr);
        if (res.data.value) {
            message.success('删除成功');
            getDataList();
        } else {
            message.error(res.errorMessage);
        }
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

    const exportFile = () => {
        filesystemApi.exportFileList(() =>
            workingTeamAPi.workingTeamListDerive({
                ...unref(unref(searchInfo)),
                tableHeaderConfig: cacheSearchStore.getUploadLoadSortColumns(pageCode)
            })
        );
    };

    const downLoadTemplate = () => {
        filesystemApi.exportFileList(workingTeamAPi.workingTeamTemplate);
    };
</script>

<style lang="less" scoped>
    .TeamGroup {
        padding: 10px 12px;
        height: 100%;
        background-color: #f7f8fa;

        .teamGroup-searchForm {
            padding: 15px;
            padding-bottom: 0;
            box-sizing: border-box;
        }
    }
</style>
