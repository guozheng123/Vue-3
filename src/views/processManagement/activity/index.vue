<template>
    <TpfLayout>
        <template #header>
            <LoadingSkeleton>
                <TpfForm
                    :formList="formList"
                    @onSubmit="onSubmit"
                    :labelCol="{ style: { width: '126px' } }"
                />
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
                            :disabled="isEmpty(selectedRowInfo.selectedRowKeys)"
                            @click="deleteFun"
                        >
                            <SvgIcon type="icon-shanchu" /> 删除
                        </a-button>
                        <a-button
                            type="primary"
                            class="tpf-button"
                            :disabled="isEmpty(selectedRowInfo.selectedRowKeys)"
                            @click="onPrint"
                        >
                            <SvgIcon type="icon-dayin" /> 打印
                        </a-button>
                        <a-button @click="exportTable" class="tpf-button" type="primary" ghost>
                            <SvgIcon type="icon-daochu" /> 导出
                        </a-button>

                        <!-- 导入 -->
                        <TpfTableImportBtn
                            :uploadAction="uploadAction"
                            :multiple="false"
                            @upload-table="getDataList"
                            downLoadTemplate="workUnitTemplate"
                        />
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>

        <AddModel
            @upload-table="getDataList"
            ref="addModel"
            :type="type"
            :workUnitId="workUnitId"
            :is-edit="isEdit"
        />
        <TpfDeleteDetail ref="delModalDom" v-if="showDelModalDom" />
        <TpfQrprint ref="tpfQrprint" />
    </TpfLayout>
</template>

<script setup lang="tsx" name="Activity">
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { message } from 'ant-design-vue';
    import { ref, computed, unref, defineAsyncComponent } from 'vue';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import type { TpfColumnType, TpfUploadFile } from '@/types';
    import { useWorkingProcedure, useFilesystemApi } from '@/api';
    import { PageCodeEnum, getTpfOptionEnum } from '@/config';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { useStore } from '@/store';
    import { isEmpty } from 'lodash-es';
    import { useTpfDeleteDetail } from '@/components/TpfDeleteDetail';

    const { delModalDom, openDelModalDom, showDelModalDom, TpfDeleteDetail } = useTpfDeleteDetail();

    const TpfTableImportBtn = defineAsyncComponent(
        () => import('@/components/TpfTable/TpfTableImportBtn.vue')
    );

    const TpfQrprint = defineAsyncComponent(() => import('@/components/TpfQrprint/index.vue'));

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const AddModel = defineAsyncComponent(() => import('./activityModel/addModel.vue'));

    const { cacheSearchStore } = useStore();

    const { statusOptionStr, getLabel, timeUnitOption } = getTpfOptionEnum();

    const filesystemApi = useFilesystemApi();

    const [tpfQrprint, onOpenTpfQrprint] = useOpenAntdModal();

    const [addModel, onOpenAddModel] = useOpenAntdModal();

    const workingProcedure = useWorkingProcedure();

    const searchInfo = ref<{ [k: string]: any }>({});

    const exportfileParams = ref();

    const type = ref('');

    const isEdit = ref(false);

    const workUnitId = ref('');

    const pageCode = PageCodeEnum.processManagementActivityTable;

    const defaultBtn = [
        {
            title: '编辑',
            onClick: (row: any) => {
                type.value = '编辑作业单元';
                workUnitId.value = row.value.workUnitId;
                isEdit.value = true;
                onOpenAddModel('edit');
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

    const beforeRender = (list: TpfColumnType[]) => {
        return unref(list).map(item => {
            if (item.dataIndex === 'workUnitCode') {
                item.customRender = ({ text, record }) => {
                    return (
                        <span
                            class="tpf-link"
                            onClick={() => {
                                goDetail(record);
                            }}
                        >
                            {text}
                        </span>
                    );
                };
            }
            if (item.dataIndex === 'status') {
                item.customRender = ({ text }) => getLabel(text, statusOptionStr);
            }
            if (item.dataIndex === 'timeUnit') {
                item.customRender = ({ text }) => getLabel(text, timeUnitOption);
            }

            return item;
        });
    };

    const formList = computed(() => {
        return [
            {
                type: 'Input',
                field: 'workUnitCode',
                label: '作业单元编号',
                placeholder: '',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'workUnitName',
                label: '作业单元名称',
                placeholder: '',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'workUnitTypeCode',
                label: '作业单元类型编号',
                placeholder: '',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'workUnitTypeName',
                label: '作业单元类型名称',
                placeholder: '',
                allowClear: true
            },
            {
                type: 'Select',
                field: 'status',
                showDefaultValue: '',
                label: '是否启用',
                placeholder: '',
                allowClear: true,
                options: statusOptionStr
            },
            {
                type: 'RangePicker',
                field: 'createDatetimeStart@_@createDatetimeEnd',
                label: '创建日期',
                valueFormat: 'YYYY-MM-DD',
                placeholder: ['开始日期', '结束日期'],
                showDefaultValue: [],
                allowClear: true
            }
        ];
    });

    const goDetail = (record: any) => {
        type.value = '作业单元详情';
        workUnitId.value = record.workUnitId;
        onOpenAddModel('detail');
    };
    const onSubmit = (res: any) => {
        searchInfo.value = unref(res) || {};
        unref(pagination).current = 1;

        getDataList();
    };
    const uploadAction = async (fileInfo: { list: TpfUploadFile[]; overrideFlag: boolean }) => {
        const { list, overrideFlag } = unref(fileInfo);
        const [{ fileCode }] = list;
        return await workingProcedure.importWorkUnit({ overrideFlag, fileCode });
    };

    const { tableInfo, pagination, getDataList, selectedRowInfo } = useAntdTable({
        api: async pageInfo => {
            const { current = 1, pageSize } = unref(pageInfo);
            exportfileParams.value = {
                page: current,
                pageSize,
                ...unref(searchInfo)
            };
            const res = await workingProcedure.queryWorkUnitListByPage(unref(exportfileParams));
            return res.data.object;
        },
        rowKey: 'workUnitId',
        isPageAble: true,
        hasRowSelection: true
    });

    const onAdd = () => {
        onOpenAddModel('add');
        type.value = '新增作业单元';
        isEdit.value = false;
    };

    const deleteFun = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定要删除该作业单元?删除不可恢复' });
        const params = {
            ids: unref(selectedRowInfo).selectedRowKeys
        };
        const res = await workingProcedure.deleteWorkUnitByIds(params);
        if (res.data.list.length) {
            openDelModalDom(res.data.list);
        } else {
            message.success('作业单元删除成功！');
            getDataList();
        }
    };
    const onPrint = async () => {
        const params = {
            ids: unref(selectedRowInfo).selectedRowKeys
        };
        const res = await workingProcedure.getWorkUnitPrint(params);
        onOpenTpfQrprint({
            data: res.data.list,
            content: [
                { key: 'workUnitCode', label: '作业单元编号' },
                { key: 'workUnitName', label: '作业单元名称' }
            ],
            title: '作业单元'
        });
    };

    const exportTable = async () => {
        const params = {
            ...unref(exportfileParams),
            ids: unref(selectedRowInfo).selectedRowKeys
        };
        filesystemApi.exportFileList(() =>
            workingProcedure.exportWorkUnitExcelFile({
                ...params,
                tableHeaderConfig: cacheSearchStore.getUploadLoadSortColumns(pageCode)
            })
        );
    };
</script>
