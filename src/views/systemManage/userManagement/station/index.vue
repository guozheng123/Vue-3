<template>
    <div style="height: 100%">
        <TpfLayout>
            <template #header>
                <LoadingSkeleton>
                    <TpfForm :formList="formList" @onSubmit="onSubmit" />
                </LoadingSkeleton>
            </template>
            <template #content>
                <LoadingSkeleton>
                    <TpfTableLayout showChangeTableFontSize showChangeTableGap>
                        <template #default="args">
                            <TpfTable
                                v-bind="{
                                    ...args,
                                    ...tableInfo,
                                    columns,
                                    pagination,
                                    operateColumn,
                                    seq: true
                                }"
                            />
                        </template>
                        <template #operateLeft>
                            <a-button type="primary" class="tpf-button" @click="addDialog">
                                <SvgIcon type="icon-insert" /> 新增
                            </a-button>

                            <a-button
                                class="tpf-button"
                                type="primary"
                                :disabled="isEmpty(selectedRowInfo.selectedRowKeys)"
                                @click="deleteFun"
                            >
                                <SvgIcon type="icon-shanchu" /> 删除
                            </a-button>
                            <a-button ghost @click="exportTable" class="tpf-button" type="primary">
                                <SvgIcon type="icon-daochu" /> 导出
                            </a-button>
                        </template>
                    </TpfTableLayout>
                </LoadingSkeleton>
            </template>
        </TpfLayout>
        <MoveTypeModel
            @upload-table="upload"
            ref="moveTypeModel"
            :type="type"
            :isEdit="isEdit"
            :editData="editData"
        />
        <DelModal ref="delDetail" />
    </div>
</template>

<script setup lang="tsx" name="Station">
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { message } from 'ant-design-vue';
    import { ref, computed, unref, defineAsyncComponent } from 'vue';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import type { TpfColumnType } from '@/types';
    import MoveTypeModel from './stationDialog/index.vue';
    import { useFilesystemApi, getUploadLoadSortColumns, usePostApi } from '@/api';
    import { getSystemManageUserManagementStation, getTpfOptionEnum } from '@/config';
    import TpfForm from '@/components/TpfForm/index.vue';
    import DelModal from './components/DelModal.vue';
    import { isEmpty } from 'lodash-es';
    const filesystemApi = useFilesystemApi();
    const postApi = usePostApi();
    const { statusOption } = getTpfOptionEnum();
    const [moveTypeModel, openMoveTypeModel] = useOpenAntdModal();
    const [delDetail, onOpenDel] = useOpenAntdModal();
    const type = ref('');
    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    // const [selectedRowKeys, setSelectedRowKeys] = useRef<string[]>([]);

    const formState = ref<{ [k: string]: any }>({});

    const isDataIndex = ref<any>(['否', '是']);
    const searchInfo = ref<{ [k: string]: any }>({});
    const editData = ref();
    const isEdit = ref(false);
    const defaultSelectedRowKeys = ref([] as any);
    const defaultBtn = [
        {
            title: '编辑',
            onClick: (row: any) => {
                openMoveTypeModel();
                type.value = '编辑-岗位';
                isEdit.value = true;
                const rows = { ...row.value };
                editData.value = rows;
            }
        }
    ];
    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 100,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });
    const handelColumns = (list: TpfColumnType[]) => {
        return unref(list).map(item => {
            if (item.dataIndex === 'lockFlag') {
                item.customRender = ({ text, record }) => {
                    return <span>{isDataIndex.value[text]}</span>;
                };
            }
            return item;
        });
    };

    const formList = computed(() => {
        return [
            {
                type: 'Input',
                field: 'postCode',
                label: '岗位编号',
                placeholder: '',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'postName',
                label: '岗位名称',
                placeholder: '',
                allowClear: true
            },
            {
                type: 'Select',
                field: 'lockFlag',
                label: '是否启用',
                placeholder: '',
                showDefaultValue: '',
                allowClear: true,
                options: statusOption
            }
        ];
    });

    const onSubmit = (res: any) => {
        formState.value = unref(res);
        searchInfo.value = unref(res);
        unref(pagination).current = 1;

        getDataList();
    };

    const { tableInfo, pagination, getDataList, selectedRowInfo } = useAntdTable({
        api: async pageInfo => {
            const { current, pageSize } = unref(pageInfo);
            const info = { page: current, pageSize: pageSize, ...unref(searchInfo) };
            const res = await postApi.getPostList(info);
            defaultSelectedRowKeys.value = res.data.object.list.map((e: any) => {
                return e.operationId;
            });
            return res.data.object;
        },
        rowKey: 'postId',
        isPageAble: true,
        hasRowSelection: true
    });

    const deleteFun = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定删除选中的项目吗？?' });
        del();
    };

    const del = async () => {
        const params = {
            id: selectedRowInfo.value.selectedRowKeys //selectedRowKeys.value
        };
        const res = await postApi.deletePost(params);
        if (res.success) {
            if (res.data.list.length > 0) {
                onOpenDel(res.data.list);
            } else {
                message.success('删除成功！');
            }
        } else {
            message.error(res.errorMessage);
        }

        // setSelectedRowKeys([]);
        getDataList();
    };

    const addDialog = () => {
        openMoveTypeModel();
        type.value = '新增-岗位';
        isEdit.value = false;
        editData.value = {};
    };

    const exportTable = async () => {
        const params = {
            ...searchInfo.value
        };
        filesystemApi.exportFileList(() =>
            postApi.postListDerive({
                ...params,
                tableHeaderConfig: getUploadLoadSortColumns(columns)
            })
        );
    };

    const columns = handelColumns(getSystemManageUserManagementStation());
    const upload = () => {
        getDataList();
    };
</script>
