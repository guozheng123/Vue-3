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

                        <a-button @click="exportTable" class="tpf-button" type="primary" ghost>
                            <SvgIcon type="icon-daochu" /> 导出
                        </a-button>

                        <!-- 导入 -->
                        <TpfTableImportBtn
                            :uploadAction="uploadAction"
                            :multiple="false"
                            @upload-table="getDataList"
                            downLoadTemplate="workUnitTypeTemplat"
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
                downLoadTemplate="workUnitTypeTemplat"
            /> -->

        <TpfDeleteDetail ref="delModalDom" v-if="showDelModalDom" />

        <AddActivityTypeModel
            @uploadTable="getDataList"
            ref="addActivityTypeModel"
            :type="type"
            :title="title"
        />
    </TpfLayout>
</template>

<script setup lang="tsx" name="Activity">
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { message } from 'ant-design-vue';
    import { ref, unref, defineAsyncComponent, computed } from 'vue';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import { TpfColumnType, TpfUploadFile } from '@/types';
    import { useWorkingProcedure, useFilesystemApi } from '@/api';
    import { PageCodeEnum, getTpfOptionEnum } from '@/config';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { useStore } from '@/store';
    import router from '@/router';
    import { isEmpty } from 'lodash-es';
    import { useTpfDeleteDetail } from '@/components/TpfDeleteDetail';

    const { delModalDom, openDelModalDom, showDelModalDom, TpfDeleteDetail } = useTpfDeleteDetail();

    const TpfTableImportBtn = defineAsyncComponent(
        () => import('@/components/TpfTable/TpfTableImportBtn.vue')
    );

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const AddActivityTypeModel = defineAsyncComponent(
        () => import('./model/AddActivityTypeModel.vue')
    );

    const formList = computed(() => {
        return [
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
                valueFormat: 'YYYY-MM-DD',
                label: '创建日期',
                placeholder: ['开始日期', '结束日期'],
                showDefaultValue: [],
                allowClear: true
            }
        ];
    });
    const { statusOptionStr, getLabel } = getTpfOptionEnum();

    const pageCode = PageCodeEnum.processManagementActivityTypeTable;

    const filesystemApi = useFilesystemApi();

    const workingProcedure = useWorkingProcedure();

    const searchInfo = ref<{ [k: string]: any }>({});

    const exportfileParams = ref();

    const [addActivityTypeModel, openAddActivityTypeModel] = useOpenAntdModal();

    const { cacheSearchStore } = useStore();

    const type = ref('');

    const title = ref('');

    const defaultBtn = [
        {
            title: '编辑',
            onClick: (row: any) => {
                type.value = 'edit';
                title.value = '编辑作业单元类型';

                router.push({
                    path: '/processManagement/activityType/editActivityTypeDetail',
                    query: { type: 'edit', workUnitTypeId: row.value.workUnitTypeId }
                });
                // openAddActivityTypeModel({
                //     type: 'edit',
                //     workUnitTypeId: row.value.workUnitTypeId
                // });
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
            if (item.dataIndex === 'workUnitTypeCode') {
                item.customRender = ({ text, record }) => {
                    return (
                        <a
                            onClick={() => {
                                router.push({
                                    path: '/processManagement/activityType/activityTypeDetail',
                                    query: {
                                        type: 'detail',
                                        workUnitTypeId: record.workUnitTypeId
                                    }
                                });
                            }}
                        >
                            {text}
                        </a>
                    );
                };
            }
            if (item.dataIndex === 'status') {
                item.customRender = ({ text }) => getLabel(text, statusOptionStr);
            }

            return item;
        });
    };

    const onSubmit = (res: any) => {
        searchInfo.value = unref(res) || {};
        unref(pagination).current = 1;

        getDataList();
    };
    const uploadAction = async (fileInfo: { list: TpfUploadFile[]; overrideFlag: boolean }) => {
        const { list, overrideFlag } = unref(fileInfo);
        const [{ fileCode }] = list;
        return await workingProcedure.importWorkUnitType({ overrideFlag, fileCode });
    };

    const { tableInfo, pagination, getDataList, selectedRowInfo } = useAntdTable({
        api: async pageInfo => {
            const { current = 1, pageSize } = unref(pageInfo);
            exportfileParams.value = {
                page: current,
                pageSize,
                ...unref(searchInfo)
            };
            const res = await workingProcedure.queryWorkUnitTypeListByPage(unref(exportfileParams));
            return res.data.object;
        },
        rowKey: 'workUnitTypeId',
        isPageAble: true,
        hasRowSelection: true
    });

    const onAdd = () => {
        // type.value = 'add';
        // title.value = '新增作业单元类型';
        // openAddActivityTypeModel({ type: 'add' });
        router.push({
            path: '/processManagement/activityType/addActivityTypeDetail',
            query: { type: 'add' }
        });
    };

    const deleteFun = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定要删除该作业单元类型?删除不可恢复' });
        const params = {
            ids: unref(selectedRowInfo).selectedRowKeys //unref(selectedRowKeys)
        };
        const res = await workingProcedure.deleteWorkUnitTypeByIds(params);
        if (res.data.list.length) {
            openDelModalDom(res.data.list);
        } else {
            message.success('作业单元类型删除成功！');
            getDataList();
        }
    };

    const exportTable = async () => {
        const params = {
            ...unref(exportfileParams),
            ids: unref(selectedRowInfo).selectedRowKeys
        };
        filesystemApi.exportFileList(() =>
            workingProcedure.exportWorkUnitTypeExcelFile({
                ...params,
                tableHeaderConfig: cacheSearchStore.getUploadLoadSortColumns(pageCode)
            })
        );
    };
</script>
