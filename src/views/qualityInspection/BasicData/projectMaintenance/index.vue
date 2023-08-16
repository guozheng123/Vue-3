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
                            seq
                            :operateColumn="operateColumn"
                            :columns="columns"
                            :pagination="pagination"
                            v-bind="{ ...tableInfo, ...args }"
                        />
                    </template>
                    <template #operateLeft>
                        <a-button type="primary" class="tpf-button" @click="addDialogView">
                            <SvgIcon type="icon-insert" /> 新增
                        </a-button>

                        <a-button
                            class="tpf-button"
                            type="primary"
                            :disabled="isEmpty(selectedRowInfo.selectedRowKeys)"
                            @click="onDelete"
                        >
                            <SvgIcon type="icon-shanchu" />
                            删除
                        </a-button>
                        <a-button ghost class="tpf-button" type="primary" @click="exportTable">
                            <SvgIcon type="icon-daochu" /> 导出
                        </a-button>

                        <!-- 导入 -->
                        <TpfTableImportBtn
                            :uploadAction="uploadAction"
                            :multiple="false"
                            @upload-table="getDataList()"
                            downLoadTemplate="qualityInspection"
                        />

                        <addDialog ref="dialog" @ongetDataList="getDataList" />
                        <TpfDeleteDetail ref="delModalDom" v-if="showDelModalDom" />
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
    </TpfLayout>
</template>

<script lang="tsx" setup>
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { tableResizable } from '@/config';
    import { ref, computed, unref, defineAsyncComponent } from 'vue';
    import type { TpfColumnType } from '@/types';
    import { useAntdTable } from '@/hooks';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import { useQualityApi, useFilesystemApi } from '@/api';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { TpfUploadFile } from '@/types';
    import { isEmpty } from 'lodash-es';
    import dayjs from 'dayjs';
    import { useTpfDeleteDetail } from '@/components/TpfDeleteDetail';

    const TpfTableImportBtn = defineAsyncComponent(
        () => import('@/components/TpfTable/TpfTableImportBtn.vue')
    );

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const { delModalDom, openDelModalDom, showDelModalDom, TpfDeleteDetail } = useTpfDeleteDetail();

    const qualityApi = useQualityApi();

    const filesystemApi = useFilesystemApi();

    const uploadAction = async (fileInfo: { list: TpfUploadFile[]; overrideFlag: boolean }) => {
        const { list, overrideFlag } = unref(fileInfo);
        const [{ fileCode }] = list;
        return await qualityApi.importQualityInspectionFile({ overrideFlag, fileCode });
    };

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const addDialog = defineAsyncComponent(() => import('./components/addDialog/index.vue'));

    const searchInfo = ref<{ [k: string]: any }>({});

    const filterParameters = ref<any>(['', '逻辑', '数值', '文本']);

    const formList = computed(() => {
        return [
            {
                type: 'Input',
                field: 'qualityInspectionCode',
                label: '质检项目编号',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'qualityInspectionName',
                label: '质检项目名称',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'createUser',
                label: '创建人',
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
            }
        ];
    });
    const onSubmit = (val: any) => {
        searchInfo.value = unref(val);

        unref(pagination).current = 1;

        getDataList();
    };

    const dialog = ref<any>(null);

    const addDialogView = () => {
        dialog.value.openAddDialogView(1);
    };

    const columns = ref<TpfColumnType[]>([
        {
            title: '质检项目编号',
            dataIndex: 'qualityInspectionCode',
            ...tableResizable(),
            sorter: {
                compare: (a, b) => a.qualityInspectionCode - b.qualityInspectionCode
            },
            customRender: (val: any) => {
                return (
                    <a
                        onClick={() => {
                            const data = { ...val.record };
                            dialog.value.openAddDialogView(3, data);
                        }}
                    >
                        {val.value}
                    </a>
                );
            }
        },
        {
            title: '质检项目名称',
            dataIndex: 'qualityInspectionName',
            ...tableResizable()
        },
        {
            title: '质检标准',
            dataIndex: 'qualityInspectionStandard',
            ...tableResizable()
        },
        {
            title: '上限',
            dataIndex: 'upperlimitValue',
            ...tableResizable()
        },
        {
            title: '标准值',
            dataIndex: 'standardValue',
            key: 'standardValue',
            ...tableResizable()
        },
        {
            title: '下限',
            dataIndex: 'lowerlimitValue',
            ...tableResizable()
        },
        {
            title: '质检属性',
            dataIndex: 'qualityInspectionAttribute',
            ...tableResizable(),
            customRender: (val: any) => {
                return <span>{filterParameters.value[Number(val.value)]}</span>;
            }
        },
        {
            title: '创建人',
            dataIndex: 'createUser',
            ...tableResizable()
        },
        {
            title: '创建日期',
            dataIndex: 'createDatetime',
            ...tableResizable(),
            sorter: {
                compare: (a, b) => {
                    return a.createDatetime > b.createDatetime ? 1 : -1;
                }
            },
            customRender: ({ text }) => dayjs(text).format('YYYY-MM-DD')
        },
        {
            title: '修改人',
            dataIndex: 'modifyUser',
            key: 'modifyUser',
            ...tableResizable()
        },
        {
            title: '修改日期',
            dataIndex: 'modifyDatetime',
            key: 'modifyDatetime',
            ...tableResizable(),
            customRender: ({ text }) => dayjs(text).format('YYYY-MM-DD')
        }
    ]);

    const defaultBtn = [
        {
            title: '编辑',
            onClick: (row: any) => {
                const data = { ...row.value };
                dialog.value.openAddDialogView(2, data);
            }
        }
    ];

    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 80,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });

    const { tableInfo, pagination, getDataList, selectedRowInfo } = useAntdTable({
        api: async pageInfo => {
            const { current: page, pageSize } = unref(pageInfo);
            const info = { ...unref(searchInfo), page, pageSize: pageSize };
            const res = await qualityApi.getQualityInspectionList(info);
            return res.data.object;
        },
        rowKey: 'qualityInspectionId',
        isPageAble: true,
        hasRowSelection: true
    });

    const exportTable = async () => {
        filesystemApi.exportFileList(() =>
            qualityApi.exportQualityInspectionFileExcelFile(unref(searchInfo))
        );
    };

    // 删除
    const onDelete = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定要删除吗?删除不可恢复' });
        const params = {
            ids: unref(selectedRowInfo).selectedRowKeys
        };
        const res = await qualityApi.deleteQualityInspection(params);
        if (res.data.list.length) {
            openDelModalDom(res.data.list);
        } else {
            const { message } = await import('ant-design-vue');
            message.success('删除成功！');
            getDataList();
        }
    };
</script>
