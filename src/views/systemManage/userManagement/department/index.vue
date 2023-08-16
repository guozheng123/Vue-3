<template>
    <div class="departernt">
        <TpfIndentation>
            <template #left>
                <LoadingSkeleton>
                    <GroupTree
                        :treeData="treeData"
                        @selectTree="selectTree"
                        ref="groupTree"
                        v-loading="treeLoading"
                        :fieldNames="fieldNames"
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

                        <!-- 导入 -->
                        <TpfTableImportBtn
                            :uploadAction="uploadAction"
                            downLoadTemplate="departmentTemplate"
                            @uploadTable="uploadTable"
                            @fetch-api="fetchApi()"
                        />

                        <a-button class="tpf-button" type="primary" @click="exportFile" ghost>
                            <SvgIcon type="icon-daochu" />导出
                        </a-button>
                    </template>
                </TpfTableLayout>
            </template>
        </TpfIndentation>
        <AddDepartment ref="target" @submitAdd="submitAdd" @submitUpdata="submitUpdata" />

        <TpfDeleteDetail ref="delModalDom" v-if="showDelModalDom" />
    </div>
</template>

<script setup lang="tsx" name="Department">
    import { ref, defineAsyncComponent, unref, computed } from 'vue';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import { TpfColumnType, TpfUploadFile } from '@/types';
    import {
        useDepartmentApi,
        useFilesystemApi,
        AddGetDepartmentlist,
        getDepartmentTreeList
    } from '@/api';
    import { withTpfTableOperateColumn } from '@/components/TpfTable';
    import { message } from 'ant-design-vue';
    import { getLabel, getTpfOptionEnum, PageCodeEnum } from '@/config';
    import { PaginationProps } from 'ant-design-vue';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { useStore } from '@/store/index';
    import { isEmpty } from 'lodash-es';
    import { useTpfDeleteDetail } from '@/components/TpfDeleteDetail';

    const { cacheSearchStore } = useStore();

    const pageCode = PageCodeEnum.systemManageBuildBusinessDepartment;

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

    const AddDepartment = defineAsyncComponent(() => import('./model/addDepartment.vue'));

    const { delModalDom, openDelModalDom, showDelModalDom, TpfDeleteDetail } = useTpfDeleteDetail();

    const { statusOption } = getTpfOptionEnum();
    const departmentApi = useDepartmentApi();
    const filesystemApi = useFilesystemApi();
    const [target, onOpenModal] = useOpenAntdModal();

    const fieldNames = {
        children: 'branchTree',
        title: 'rootName',
        key: 'rootId'
    };
    const formList = computed(() => {
        return [
            {
                type: 'Input',
                field: 'departmentCode',
                label: '部门编号',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'departmentName',
                label: '部门名称',
                allowClear: true
            },
            {
                type: 'Select',
                field: 'lockFlag',
                label: '是否启用',
                options: statusOption
            }
        ];
    });

    const defaultBtn = [{ title: '编辑', onClick: (row: any) => onEdit(row) }];
    const searchInfo = ref<any>({});
    const currentSelectTree = ref('');
    const groupTree = ref();

    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 100,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });

    const { treeData, fetchApi, treeLoading } = getDepartmentTreeList();

    const { tableInfo, pagination, getDataList, selectedRowInfo } = useAntdTable({
        api: async pagination => {
            const { pageSize = 20, current = 1 } = unref(pagination);
            const res = await departmentApi.getDepartmentList({
                ...unref(searchInfo),
                pageSize,
                departmentId: unref(currentSelectTree),
                page: current
            });

            return res.data.object;
        },
        rowKey: 'departmentId',
        isPageAble: true,
        hasRowSelection: true
    });
    const beforeRender = (list: TpfColumnType[]) => {
        unref(tableInfo).loading = true;
        const res = unref(list).map(item => {
            if (item.dataIndex === 'lockFlag') {
                item.customRender = ({ text }) => getLabel(text, statusOption);
            }
            return item;
        });
        unref(tableInfo).loading = false;

        return res;
    };

    const selectTree = (select: any) => {
        currentSelectTree.value = select ? select.rootId : '';
        getDataList();
    };
    // 新增
    const onAdd = () => {
        onOpenModal('add', unref(currentSelectTree));
    };

    const submitAdd = async (v: AddGetDepartmentlist) => {
        const res = await departmentApi.createDepartment(v);
        if (res.data.value) {
            message.success('部门信息保存成功！');
            getDataList();
            fetchApi();
            onOpenModal('close');
        }
    };

    //编辑
    const onEdit = (v: any) => {
        onOpenModal('edit', v.value);
    };

    const submitUpdata = async (v: any) => {
        const res = await departmentApi.updateDepartment(v);
        if (res.data.value) {
            message.success('部门信息保存成功！');
            getDataList();
            fetchApi();
            onOpenModal('close');
        }
    };

    const onSubmit = (val: any) => {
        currentSelectTree.value = '';
        searchInfo.value = unref(val);
        unref(pagination).current = 1;

        getDataList();
    };

    const uploadAction = async (fileInfo: { list: TpfUploadFile[]; overrideFlag: boolean }) => {
        const { list, overrideFlag } = unref(fileInfo);
        const [{ fileCode }] = list;
        return await departmentApi.departmentListImport({ overrideFlag, fileCode });
    };

    const onDelete = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定删除选中的部门信息吗?' });
        del();
    };

    const del = async () => {
        const arr: Array<number> = [];
        unref(selectedRowInfo).selectedRows.forEach((item: any) => {
            arr.push(item.departmentId);
        });
        let hasChild = false;
        arr.forEach(e => {
            const obj = getObjById(treeData.value, e);
            if (obj?.branchTree) {
                hasChild = true;
            }
        });
        if (hasChild) {
            const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
            await TpfDelConfirm({ content: '所选部门有下级部门,确认一起删除吗?' });
            const res = await departmentApi.deleteDepartment({ id: arr });
            openDelModalDom(res.data.list);
            fetchApi();
            currentSelectTree.value = '';
            getDataList();
        } else {
            const res = await departmentApi.deleteDepartment({ id: arr });
            openDelModalDom(res.data.list);
            fetchApi();
            currentSelectTree.value = '';
            getDataList();
        }
    };

    /*
     *@param  需要遍历的数组
     *@param  查询所需要的id
     */
    function getObjById(list: any, rootId: any) {
        //遍历数组
        for (const i in list) {
            const item = list[i];
            if (item.rootId == rootId) {
                return item;
            } else {
                //查不到继续遍历
                if (item.branchTree) {
                    const value = getObjById(item.branchTree, rootId) as any;
                    //查询到直接返回
                    if (value) {
                        return value;
                    }
                }
            }
        }
    }

    const exportFile = () => {
        const { current, pageSize, total } = unref(pagination) as PaginationProps;
        filesystemApi.exportFileList(() =>
            departmentApi.departmentListDerive({
                ...unref(searchInfo),
                departmentId: unref(currentSelectTree),
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
    .departernt {
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
