<!-- 缺陷原因 -->
<template>
    <TpfLayout>
        <template #header>
            <LoadingSkeleton>
                <TpfForm
                    :formList="formList"
                    @onSubmit="onSubmit"
                    :labelCol="{ style: { width: '98px' } }"
                />
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
                                pagination,
                                operateColumn,
                                seq: true,
                                columns
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
                            @click="onDelete"
                        >
                            <SvgIcon type="icon-shanchu" /> 删除
                        </a-button>
                        <a-button ghost @click="exportTable" class="tpf-button" type="primary">
                            <SvgIcon type="icon-daochu" /> 导出
                        </a-button>

                        <!-- 导入 -->
                        <TpfTableImportBtn
                            :uploadAction="uploadAction"
                            :multiple="false"
                            @upload-table="getDataList()"
                            downLoadTemplate="defectCauseTemplat"
                        />
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
        <DefectDialog
            @upload-table="upload"
            ref="moveTypeModel"
            :type="type"
            :isEdit="isEdit"
            :editData="editData"
        />
        <TpfDeleteDetail ref="delModalDom" v-if="showDelModalDom" />
    </TpfLayout>
</template>

<script setup lang="tsx" name="Station">
    import { fmtDayjsTime } from '@/utils';
    import { tableResizable } from '@/config';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, computed, unref, defineAsyncComponent } from 'vue';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import type { TpfColumnType, TpfUploadFile } from '@/types';
    import DefectDialog from './DefectDialog/index.vue';
    import { useFilesystemApi, getUploadLoadSortColumns } from '@/api';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { useQualityApi } from '@/api';
    import { isEmpty } from 'lodash-es';
    import { useTpfDeleteDetail } from '@/components/TpfDeleteDetail';

    const TpfTableImportBtn = defineAsyncComponent(
        () => import('@/components/TpfTable/TpfTableImportBtn.vue')
    );

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const { delModalDom, openDelModalDom, showDelModalDom, TpfDeleteDetail } = useTpfDeleteDetail();

    const qualityApi = useQualityApi();

    const filesystemApi = useFilesystemApi();

    const [moveTypeModel, openMoveTypeModel] = useOpenAntdModal();

    const type = ref('');

    const searchInfo = ref<{ [k: string]: any }>({});
    const editData = ref();
    const isEdit = ref(0);
    // 1 是编辑 0是新增 3是详情
    const defaultSelectedRowKeys = ref([] as any);
    const defaultBtn = [
        {
            title: '编辑',
            onClick: (row: any) => {
                openMoveTypeModel();
                type.value = '编辑缺陷原因';
                isEdit.value = 1;
                const rows = { ...row.value };
                editData.value = rows;
            }
        }
    ];

    const uploadAction = async (fileInfo: { list: TpfUploadFile[]; overrideFlag: boolean }) => {
        const { list, overrideFlag } = unref(fileInfo);
        const [{ fileCode }] = list;
        return await qualityApi.importDefectCause({ overrideFlag, fileCode });
    };

    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 100,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });
    const handelColumns = (list: TpfColumnType[]) => {
        return unref(list).map((item: any) => {
            if (['iqcFlag', 'ipqcFlag', 'fqcFlag', 'oqcFlag'].includes(item.dataIndex)) {
                item.customRender = ({ text, record }: any) => {
                    if (text === '1') {
                        return <span>√</span>;
                    } else {
                        return <span>×</span>;
                    }
                };
            }
            if (item.dataIndex === 'defectCauseCode') {
                item.customRender = ({ text, record }: any) => {
                    return (
                        <a
                            onClick={() => {
                                openMoveTypeModel();
                                type.value = '缺陷类型详情';
                                isEdit.value = 3;
                                const rows = { ...record };
                                editData.value = rows;
                            }}
                        >
                            {text}
                        </a>
                    );
                };
            }
            return item;
        });
    };

    const formList = computed(() => {
        return [
            {
                type: 'Input',
                field: 'defectCauseCode',
                label: '缺陷原因编号',
                placeholder: '',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'defectCauseName',
                label: '缺陷原因名称',
                placeholder: '',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'createUser',
                label: '创建人',
                placeholder: '',
                allowClear: true
            },
            {
                type: 'RangePicker',
                field: 'createDateStart@_@createDateEnd',
                label: '创建日期',
                valueFormat: 'YYYY-MM-DD',
                placeholder: ['开始日期', '结束日期'],
                showDefaultValue: [],
                allowClear: true
            },

            {
                type: 'Input',
                field: 'modifyUser',
                label: '修改人',
                allowClear: true
            },

            {
                type: 'RangePicker',
                field: 'modifyDateStart@_@modifyDateEnd',
                label: '修改日期',
                valueFormat: 'YYYY-MM-DD',
                placeholder: ['开始日期', '结束日期'],
                showDefaultValue: [],
                allowClear: true
            },
            {
                type: 'Input',
                field: 'defectCauseClassifyName',
                label: '缺陷类型名称',
                placeholder: '',
                allowClear: true
            },
            {
                type: 'Select',
                field: 'inspectionMethod',
                label: '检验方法',
                mode: 'multiple',
                showDefaultValue: [],
                allowClear: true,
                maxTagCount: 3,
                options: [
                    { value: '', label: '所有' },
                    { value: 'iqcFlag', label: 'IQC' },
                    { value: 'ipqcFlag', label: 'IPQC' },
                    { value: 'fqcFlag', label: 'FQC' },
                    { value: 'oqcFlag', label: 'OQC' }
                ]
            }
        ];
    });

    const onSubmit = (res: any) => {
        searchInfo.value = unref(res);
        const [startDatetime = '', endDatetime = ''] = unref(searchInfo).createData || [];
        unref(searchInfo).createDatetimeStart = fmtDayjsTime(startDatetime, 'YYYY-MM-DD 00:00:00');
        unref(searchInfo).createDatetimeEnd = fmtDayjsTime(endDatetime, 'YYYY-MM-DD 23:59:59');
        if (res.inspectionMethod.length) {
            res.inspectionMethod.map((item: any) => {
                res[item] = 1;
            });
            console.log(res);
        }
        searchInfo.value = unref(res);
        unref(pagination).current = 1;

        getDataList();
    };

    const { tableInfo, pagination, getDataList, selectedRowInfo } = useAntdTable({
        api: async pageInfo => {
            const { current, pageSize } = unref(pageInfo);
            const info = { page: current, pageSize: pageSize, ...unref(searchInfo) };
            const res = await qualityApi.queryDefectCauseListByPage(info);
            defaultSelectedRowKeys.value = res.data.object.list.map((e: any) => {
                return e.operationId;
            });
            return res.data.object;
        },
        rowKey: 'defectCauseId',
        isPageAble: true,
        hasRowSelection: true
    });

    // 删除
    const onDelete = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定要删除吗?删除不可恢复' });
        const params = {
            ids: unref(selectedRowInfo).selectedRowKeys //selectedRowKeys.value
        };
        const res = await qualityApi.deleteDefectCauseByIds(params);
        if (res.data.list.length) {
            openDelModalDom(res.data.list);
        } else {
            const { message } = await import('ant-design-vue');
            message.success('删除成功！');
            getDataList();
        }
    };

    const addDialog = () => {
        openMoveTypeModel();
        type.value = '新增缺陷原因';
        isEdit.value = 0;
        editData.value = {};
    };

    const exportTable = async () => {
        const params = {
            ...searchInfo.value
        };
        const ids = {
            ids: unref(selectedRowInfo).selectedRowKeys
        };
        filesystemApi.exportFileList(() =>
            qualityApi.exportDefectCauseExcelFile({
                ...params,
                ...ids,
                tableHeaderConfig: getUploadLoadSortColumns(columns)
            })
        );
    };

    const upload = () => {
        getDataList();
    };

    const columnsDemo = () => {
        const columns = [
            { title: '缺陷原因编号', dataIndex: 'defectCauseCode', ...tableResizable() },
            { title: '缺陷原因名称', dataIndex: 'defectCauseName', ...tableResizable() },
            { title: '缺陷类型编号', dataIndex: 'defectCauseClassifyCode', ...tableResizable() },
            { title: '缺陷类型名称', dataIndex: 'defectCauseClassifyName', ...tableResizable() },
            { title: 'IQC', dataIndex: 'iqcFlag', ...tableResizable() },
            { title: 'IPQC', dataIndex: 'ipqcFlag', ...tableResizable() },
            { title: 'FQC', dataIndex: 'fqcFlag', ...tableResizable() },
            { title: 'OQC', dataIndex: 'oqcFlag', ...tableResizable() },
            { title: '创建人', dataIndex: 'createUser', ...tableResizable() },
            { title: '创建日期', dataIndex: 'createDatetime', ...tableResizable() },
            { title: '修改日期', dataIndex: 'modifyDatetime', ...tableResizable() }
        ] as TpfColumnType[];
        return columns;
    };

    const columns = handelColumns(columnsDemo());
</script>
