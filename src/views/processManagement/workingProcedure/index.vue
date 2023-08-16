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
                            :disabled="!selectedRowInfo.selectedRowKeys.length"
                            @click="deleteFun"
                        >
                            <SvgIcon type="icon-shanchu" /> 删除
                        </a-button>

                        <a-button @click="exportTable" class="tpf-button" type="primary" ghost>
                            <SvgIcon type="icon-daochu" /> 导出
                        </a-button>
                        <!-- <a-button class="tpf-button" type="primary" @click="startExport" ghost>
                            <SvgIcon type="icon-daoru" /> 导入
                        </a-button> -->

                        <TpfTableImportBtn
                            :uploadAction="uploadAction"
                            :multiple="false"
                            @upload-table="getDataList"
                            downLoadTemplate="operationTemplate"
                        />
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
        <!-- <TpfExport
            ref="exportModal"
            :uploadAction="uploadAction"
            :multiple="false"
            @upload-table="getDataList"
            downLoadTemplate="operationTemplate"
        /> -->
        <TpfDeleteDetail ref="delModalDom" :columns="delColumns" v-if="showDelModalDom" />
    </TpfLayout>
</template>

<script setup lang="tsx" name="WorkingProcedure">
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, computed, unref, defineAsyncComponent, onMounted } from 'vue';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import { TpfColumnType, TpfUploadFile } from '@/types';
    import { Badge } from 'ant-design-vue';
    import { useWorkingProcedure, useFilesystemApi } from '@/api';
    import { PageCodeEnum, getTpfOptionEnum } from '@/config';
    import router from '@/router';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { useStore } from '@/store';
    import { useTpfDeleteDetail } from '@/components/TpfDeleteDetail';

    const TpfTableImportBtn = defineAsyncComponent(
        () => import('@/components/TpfTable/TpfTableImportBtn.vue')
    );

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    // const TpfExport = defineAsyncComponent(() => import('@/components/TpfExport/index.vue'));

    const { delModalDom, openDelModalDom, showDelModalDom, TpfDeleteDetail } = useTpfDeleteDetail();

    const { operationTypeNameListOptions, statusOptionStr, getLabel } = getTpfOptionEnum();
    const { cacheSearchStore } = useStore();
    const pageCode = PageCodeEnum.processManagementWorkingProcedureTable;
    const filesystemApi = useFilesystemApi();
    // const [exportModal, onOpenExportModal] = useOpenAntdModal();
    const workingProcedure = useWorkingProcedure();
    const factoryCodetOptions: any = ref([]);
    const searchInfo = ref<{ [k: string]: any }>({});
    const exportfileParams = ref();
    const delColumns = [
        { title: '工序编号', dataIndex: 'message', width: 150 },

        {
            title: '结果',
            width: 100,
            dataIndex: 'result',
            customRender: (text: any) => {
                if (text.value === '0') {
                    return <Badge color="#f00" text="失败" />;
                }
                return <Badge color="#0f0" text="成功" />;
            }
        },
        { title: '原因', dataIndex: 'reason' }
    ];

    const defaultBtn = [
        {
            title: '编辑',
            onClick: (row: any) => {
                router.push({
                    path: '/processManagement/workingProcedure/editWorkingProcedure',
                    query: { type: '1', operationId: row.value.operationId }
                });
            }
        },
        {
            title: '复制',
            onClick: (row: any) => {
                router.push({
                    path: '/processManagement/workingProcedure/editWorkingProcedure',
                    query: { type: '3', operationId: row.value.operationId }
                });
            }
        }
    ];
    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 150,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });

    const beforeRender = (list: TpfColumnType[]) => {
        return unref(list).map(item => {
            if (item.dataIndex === 'operationCode') {
                item.customRender = ({ text, record }) => {
                    return (
                        <a
                            onClick={to => {
                                router.push({
                                    path: '/processManagement/workingProcedure/workingProcedureDetail',
                                    query: {
                                        type: '2',
                                        operationId: unref(record).operationId
                                    }
                                });
                            }}
                        >
                            {text}
                        </a>
                    );
                };
            }
            if (item.dataIndex === 'forbidden') {
                item.customRender = ({ text }) => getLabel(text, statusOptionStr);
            }
            if (item.dataIndex === 'operationTypeCode') {
                item.customRender = ({ text }) => getLabel(text, operationTypeNameListOptions);
            }
            if (item.dataIndex === 'operationCode') {
                item.sorter = {
                    compare: (a: any, b: any) => {
                        return a.operationCode - b.operationCode;
                    }
                };
            }
            if (item.dataIndex === 'createDatetime') {
                item.sorter = {
                    compare: (a: any, b: any) => {
                        return a.createDatetime > b.createDatetime ? 1 : -1;
                    }
                };
            }
            return item;
        });
    };

    const formList = computed(() => {
        return [
            {
                type: 'Input',
                field: 'operationCode',
                label: '工序编号',
                placeholder: '',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'operationName',
                label: '工序名称',
                placeholder: '',
                allowClear: true
            },
            {
                type: 'Select',
                field: 'operationTypeCode',
                showDefaultValue: '',
                label: '工序类型',
                placeholder: '',
                allowClear: true,
                options: operationTypeNameListOptions
            },
            {
                type: 'Select',
                field: 'factoryCode',
                label: '工厂',
                placeholder: '',
                allowClear: true,
                options: factoryCodetOptions,
                fieldNames: {
                    label: 'factoryName',
                    value: 'factoryCode'
                }
            },
            {
                type: 'RangePicker',
                field: 'createDateStart@_@createDateEnd',
                valueFormat: 'YYYY-MM-DD',
                label: '创建日期',
                placeholder: ['开始日期', '结束日期'],
                showDefaultValue: [],
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
            exportfileParams.value = {
                page: current,
                pageSize,
                ...unref(searchInfo)
            };
            const res = await workingProcedure.queryOperationInfoListByPage(
                unref(exportfileParams)
            );
            return res.data.object;
        },
        rowKey: 'operationId',
        isPageAble: true,
        hasRowSelection: true
    });
    const onAdd = () => {
        router.push({
            path: '/processManagement/workingProcedure/addWorkingProcedure',
            query: { type: '0' }
        });
    };

    const deleteFun = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定删除选中的工序信息吗?' });
        const params = {
            ids: unref(selectedRowInfo.value.selectedRowKeys)
        };
        const res = await workingProcedure.deleteOperationInfoById(params);

        openDelModalDom(res.data.list);
        getDataList();
    };

    // const startExport = () => {
    //     onOpenExportModal();
    // };
    const exportTable = async () => {
        const params = {
            ids: unref(selectedRowInfo.value.selectedRowKeys),
            ...unref(exportfileParams)
        };
        filesystemApi.exportFileList(() =>
            workingProcedure.exportOperationInfoExcelFile({
                ...params,
                tableHeaderConfig: cacheSearchStore.getUploadLoadSortColumns(pageCode)
            })
        );
    };
    const load = async () => {
        const res = await workingProcedure.getFactoryList();
        factoryCodetOptions.value = res.data.list;
    };
    onMounted(() => {
        load();
    });
</script>
