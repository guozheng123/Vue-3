<template>
    <TpfLayout>
        <template #header>
            <LoadingSkeleton>
                <TpfForm :formList="formList" @onSubmit="onSubmit" />
            </LoadingSkeleton>
        </template>
        <template #content>
            <LoadingSkeleton>
                <TpfTableLayout showChangeTableFontSize showChangeTableGap :pageCode="pageCode">
                    <template #default="args">
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
                    </template>
                    <template #operateLeft>
                        <a-button type="primary" class="tpf-button" @click="onAdd">
                            <SvgIcon type="icon-insert" /> 新增
                        </a-button>

                        <a-button
                            class="tpf-button"
                            type="primary"
                            :disabled="isEmpty(selectedRowInfo.selectedRows)"
                            @click="deleteFun"
                        >
                            <SvgIcon type="icon-shanchu" /> 删除
                        </a-button>

                        <a-button
                            class="tpf-button"
                            type="primary"
                            @click="publish"
                            :disabled="isEmpty(selectedRowInfo.selectedRows)"
                        >
                            <SvgIcon type="icon-fuzhi" /> 发布
                        </a-button>

                        <a-button
                            class="tpf-button"
                            type="primary"
                            @click="startUse"
                            :disabled="isEmpty(selectedRowInfo.selectedRows)"
                        >
                            <SvgIcon type="icon-fuzhi" /> 启用/禁用
                        </a-button>

                        <a-button @click="exportTable" class="tpf-button" type="primary" ghost>
                            <SvgIcon type="icon-daochu" /> 导出
                        </a-button>

                        <TpfTableImportBtn
                            :uploadAction="uploadAction"
                            :multiple="false"
                            @upload-table="getDataList"
                            downLoadTemplate="processTemplate"
                        />
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
    </TpfLayout>
</template>

<script setup lang="tsx" name="WorkmanshipRoute">
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, computed, unref, defineAsyncComponent, onMounted } from 'vue';
    import { useAntdTable } from '@/hooks';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import { TpfColumnType, TpfUploadFile } from '@/types';
    import { PaginationProps, message, Badge } from 'ant-design-vue';
    import { useWorkingProcedure, useFilesystemApi } from '@/api';
    import { PageCodeEnum, getTpfOptionEnum } from '@/config';
    import router from '@/router';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { useStore } from '@/store';
    import { isEmpty } from 'lodash-es';

    const { cacheSearchStore } = useStore();

    const TpfTableImportBtn = defineAsyncComponent(
        () => import('@/components/TpfTable/TpfTableImportBtn.vue')
    );

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const { statusOptionStr, publishOption, getLabel, statusNameColor } = getTpfOptionEnum();

    const pageCode = PageCodeEnum.processManagementWorkmanshipRouteTable;

    const filesystemApi = useFilesystemApi();

    const workingProcedure = useWorkingProcedure();

    const searchInfo = ref<{ [k: string]: any }>({});

    const title = ref('');
    const exportFileParams = ref();

    const defaultBtn = [
        {
            title: '编辑',
            onClick: (row: any) => {
                if (row.value.releaseFlag === '1') {
                    message.warning('发布的工艺,不允许编辑');
                    return false;
                }
                title.value = '编辑工艺';
                router.push({
                    path: '/processManagement/workmanshipRoute/editWorkmanshipRouteDetail',
                    query: {
                        type: 'edit',
                        processId: row.value.processId
                    }
                });
            }
        },
        {
            title: '复制',
            onClick: (row: any) => {
                router.push({
                    path: '/processManagement/workmanshipRoute/copyWorkmanshipRouteDetail',
                    query: { type: 'copy', processId: row.value.processId }
                });
            }
        },
        {
            title: '升版',
            onClick: (row: any) => {
                if (row.value.releaseFlag === '0') {
                    message.warning('未发布的工艺,不允许升版');
                    return false;
                }
                title.value = '升版工艺';
                router.push({
                    path: '/processManagement/workmanshipRoute/upgradeWorkmanshipRouteDetail',
                    query: {
                        type: 'upgrade',
                        processId: row.value.processId
                    }
                });
            }
        }
    ];
    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 200,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });

    const beforeRender = (list: TpfColumnType[]) => {
        return unref(list).map(item => {
            if (item.dataIndex === 'processCode') {
                item.customRender = ({ text, record }) => {
                    return (
                        <a
                            onClick={to => {
                                router.push({
                                    path: '/processManagement/workmanshipRoute/detailWorkmanshipRouteDetail',
                                    query: {
                                        type: 'detail',
                                        processId: unref(record).processId
                                    }
                                });
                            }}
                        >
                            {text}
                        </a>
                    );
                };
            }
            if (item.dataIndex === 'createDatetime') {
                item.sorter = {
                    compare: (a: any, b: any) => {
                        return a.createDatetime > b.createDatetime ? 1 : -1;
                    }
                };
            }

            if (item.dataIndex === 'releaseFlag') {
                item.customRender = ({ text }) => {
                    const showText = getLabel(text, publishOption) || '发布';
                    return <Badge color={getLabel(showText, statusNameColor)} text={showText} />;
                };
            }
            if (item.dataIndex === 'enable') {
                item.customRender = ({ text }) => {
                    const showText = getLabel(text, statusOptionStr);
                    return <Badge color={getLabel(showText, statusNameColor)} text={showText} />;
                };
                // const showText = getLabel(text, publishOption) || '发布';
                //     return <Badge color={getLabel(showText, statusNameColor)} text={showText} />;
                // item.customRender = ({ text }) => getLabel(text, statusOptionStr);
            }
            if (item.dataIndex === 'processVersion') {
                item.customRender = ({ text }) => 'v' + text;
            }
            return item;
        });
    };

    const formList = computed(() => {
        return [
            {
                type: 'Input',
                field: 'processCode',
                label: '工艺编号',
                placeholder: '',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'processName',
                label: '工艺名称',
                placeholder: '',
                allowClear: true
            },
            {
                type: 'Select',
                field: 'enable',
                showDefaultValue: '',
                label: '是否启用',
                placeholder: '',
                allowClear: true,
                options: statusOptionStr
            },
            {
                type: 'Select',
                field: 'releaseFlag',
                showDefaultValue: '',
                label: '是否发布',
                placeholder: '',
                allowClear: true,
                options: publishOption
            },
            {
                type: 'Checkbox',
                field: 'latestVersionFlag',
                label: '最新版本',
                bindValue: 'checked',
                showDefaultValue: false
            },
            {
                type: 'RangePicker',
                label: '创建日期',
                valueFormat: 'YYYY-MM-DD',
                field: 'createDateStart@_@createDateEnd',
                placeholder: ['开始日期', '结束日期'],
                allowClear: true
            }
        ];
    });

    const onSubmit = (res: any) => {
        searchInfo.value = unref(res) || {};
        unref(pagination).current = 1;
        getDataList();
    };
    const uploadAction = async (fileInfo: { list: TpfUploadFile[]; overrideFlag: boolean }) => {
        const { list, overrideFlag } = unref(fileInfo);
        const [{ fileCode }] = list;
        return await workingProcedure.importOperationInfo({ overrideFlag, fileCode });
    };

    const { tableInfo, pagination, getDataList, selectedRowInfo } = useAntdTable({
        api: async pageInfo => {
            const { current, pageSize } = unref(pageInfo);
            searchInfo.value.latestVersionFlag = Number(searchInfo.value.latestVersionFlag);
            exportFileParams.value = {
                page: current,
                pageSize,
                ...unref(searchInfo)
            };
            const res = await workingProcedure.queryProcessListByPage(unref(exportFileParams));
            return res.data.object;
        },
        rowKey: 'processId',
        isPageAble: true,
        hasRowSelection: true
    });

    const onAdd = () => {
        title.value = '新增工艺';
        router.push({
            path: '/processManagement/workmanshipRoute/addWorkmanshipRouteDetail',
            query: { type: 'add' }
        });
    };

    const deleteFun = async () => {
        let releaseFlag = false;
        unref(selectedRowInfo).selectedRows.forEach((element: any) => {
            if (element.releaseFlag === '1') {
                releaseFlag = true;
            }
        });
        if (releaseFlag) {
            message.warning('发布的工艺无法删除');
            return false;
        }
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定删除选中的工艺信息吗？删除不可恢复' });
        const params = {
            ids: unref(selectedRowInfo).selectedRowKeys
        };
        const res = await workingProcedure.deleteProcessByIds(params);
        if (res.success === true) {
            message.success('删除成功');
            getDataList();
        }
    };

    const publish = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定发布选中的工艺信息吗', title: '发布' });
        const params = {
            ids: unref(selectedRowInfo).selectedRowKeys
        };
        const res = await workingProcedure.releaseProcessByIds(params as any);
        if (res.success === true) {
            message.success('发布成功');
            getDataList();
        }
    };
    const startUse = async () => {
        let releaseFlag = false;
        unref(selectedRowInfo).selectedRows.forEach((element: any) => {
            if (element.releaseFlag === '0') {
                releaseFlag = true;
            }
        });
        if (releaseFlag) {
            message.warning('不可选择未发布的工艺进行操作');
            return false;
        }
        const enableArr = unref(selectedRowInfo).selectedRows.map((value: any) => value.enable);
        // 通过Set去除数组重复项
        const idsSet = new Set(enableArr);
        if (idsSet.size === 2) {
            message.warning('部分工艺的是否启用状态不一样,无法操作');
            return false;
        }
        const params = {
            ids: unref(selectedRowInfo).selectedRowKeys,
            enable: enableArr[0] === '1' ? '0' : '1'
        };
        const res = await workingProcedure.disableEnableProcessByIds(params as any);
        if (res.success === true) {
            message.success(enableArr[0] === '1' ? '禁用成功' : '开启成功');
            getDataList();
        }
    };

    const exportTable = async () => {
        const { current, pageSize, total } = unref(pagination) as PaginationProps;

        filesystemApi.exportFileList(() =>
            workingProcedure.exportProcessExcelFile({
                ...unref(searchInfo),
                ids: unref(selectedRowInfo).selectedRowKeys,
                current,
                pageSize,
                total,
                tableHeaderConfig: cacheSearchStore.getUploadLoadSortColumns(pageCode)
            })
        );
    };
    onMounted(() => {
        localStorage.removeItem('processOperationCode');
        localStorage.removeItem('processTableList');
        localStorage.removeItem('processList');
        localStorage.removeItem('isLocalStorage');
    });
</script>
