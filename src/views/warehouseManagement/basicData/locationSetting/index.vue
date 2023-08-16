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
                                columns,
                                seq: true
                            }"
                            :operateColumn="operateColumn"
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
                        <!-- <a-button @click="importTable" class="tpf-button" type="primary" ghost>
                            <SvgIcon type="icon-daoru" /> 导入
                        </a-button> -->
                        <!-- 导入 -->
                        <TpfTableImportBtn
                            @upload-table="getDataList()"
                            :uploadAction="uploadAction"
                            :multiple="false"
                            downLoadTemplate="storeLocationTemplate"
                        />
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
        <LocationSettingModel
            :editData="editData"
            @upload-table="upload"
            ref="locationSettingModel"
            :type="type"
            :isEdit="isEdit"
        />
        <!-- <TpfExport
            @upload-table="getDataList()"
            ref="exportModal"
            :uploadAction="uploadAction"
            :multiple="false"
            downLoadTemplate="storeLocationTemplate"
        /> -->
    </TpfLayout>
</template>

<script setup lang="tsx" name="locationSetting">
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { message } from 'ant-design-vue';
    import { TpfUploadFile } from '@/types';
    import { ref, computed, unref, defineAsyncComponent, onMounted } from 'vue';
    import type { TpfColumnType } from '@/types';
    import type { TreeSelectProps } from 'ant-design-vue';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import { useWarehouseApi, useFilesystemApi, useFactoryAPi } from '@/api';
    import { getTpfOptionEnum, tableResizable } from '@/config';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { isEmpty } from 'lodash-es';
    import dayjs from 'dayjs';

    // const TpfExport = defineAsyncComponent(() => import('@/components/TpfExport/index.vue'));

    const TpfTableImportBtn = defineAsyncComponent(
        () => import('@/components/TpfTable/TpfTableImportBtn.vue')
    );

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const LocationSettingModel = defineAsyncComponent(
        () => import('./locationSettingModel/index.vue')
    );
    const { isStart } = getTpfOptionEnum();
    const [locationSettingModel, openLocationSettingModel] = useOpenAntdModal();
    const warehouseApi = useWarehouseApi();
    const filesystemApi = useFilesystemApi();
    const factoryAPi = useFactoryAPi();

    const searchInfo = ref<{ [k: string]: any }>({});
    const type = ref('');
    const editData = ref();
    const treeData = ref<TreeSelectProps['treeData']>([]);
    const isEdit = ref(false);

    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 80,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });
    const formList = computed(() => {
        return [
            {
                type: 'Select',
                field: 'orgCode',
                label: '所属组织名称',
                placeholder: '',
                allowClear: true,
                fieldNames: {
                    label: 'factoryName',
                    value: 'factoryCode'
                },
                options: unref(treeData)
            },
            {
                type: 'Input',
                field: 'positionCode',
                label: '仓位代码',
                placeholder: '',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'positionName',
                label: '仓位名称',
                placeholder: '',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'storeLocationCode',
                label: '库位代码',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'storeLocationName',
                label: '库位名称',
                placeholder: '',
                allowClear: true
            },
            {
                type: 'Select',
                field: 'isUsed',
                label: '是否启用',
                placeholder: '',
                showDefaultValue: '',
                options: isStart
            }
        ];
    });

    const onSubmit = (res: any) => {
        searchInfo.value = unref(res);
        unref(pagination).current = 1;

        getDataList();
    };
    const columns = ref<TpfColumnType[]>([
        {
            title: '所属组织名称',
            dataIndex: 'orgName',
            ...tableResizable()
        },
        {
            title: '仓位代码',
            dataIndex: 'positionCode',
            ...tableResizable()
        },
        {
            title: '仓位名称',
            dataIndex: 'positionName',
            ...tableResizable()
        },
        {
            title: '库位代码',
            dataIndex: 'storeLocationCode',
            ...tableResizable()
        },
        {
            title: '库位名称',
            dataIndex: 'storeLocationName',
            ...tableResizable()
        },
        {
            title: '是否启用',
            dataIndex: 'isUsed',
            ...tableResizable(),
            customRender: val => {
                return val.value === 0 ? '否' : '是';
            }
        },

        { title: '备注', dataIndex: 'remark', ...tableResizable() },
        {
            title: '创建人',
            dataIndex: 'createUserName',
            ...tableResizable()
        },
        {
            title: '创建日期',
            dataIndex: 'createDateTime',
            ...tableResizable(),
            customRender: ({ text }) => {
                return dayjs(text).format('YYYY-MM-DD');
            }
        }
    ]);

    const defaultBtn = [
        {
            title: '编辑',
            onClick: (row: any) => {
                openLocationSettingModel();
                type.value = '编辑库位设置';
                isEdit.value = true;
                const info = { ...row.value };
                editData.value = info;
            }
        }
    ];

    const uploadAction = async (fileInfo: { list: TpfUploadFile[]; overrideFlag: boolean }) => {
        const { list, overrideFlag } = unref(fileInfo);

        const [{ fileCode }] = list;
        return await warehouseApi.importStoreLocation({ overrideFlag, fileCode });
    };

    const { tableInfo, pagination, getDataList, selectedRowInfo } = useAntdTable({
        api: async pageInfo => {
            const { current, pageSize } = unref(pageInfo);
            const res = await warehouseApi.queryStoreLocationByParam({
                page: current,
                pageSize,
                ...unref(searchInfo)
            });
            return res.data.object;
        },
        rowKey: 'id',
        isPageAble: true,
        hasRowSelection: true
    });

    const deleteFun = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定是否删除该数据?' });
        const res = await warehouseApi.deleteStoreLocation({
            storeLocationIds: unref(selectedRowInfo).selectedRowKeys.join(',')
        });
        if (res.success === true) {
            message.success('删除成功');
            getDataList();
        }
    };

    const onAdd = () => {
        openLocationSettingModel();
        type.value = '新增库位设置';
        isEdit.value = false;
        editData.value = {};
    };
    // const importTable = async () => {
    //     onOpenExportModal();
    // };
    const exportTable = async () => {
        const { current, pageSize, total } = unref(pagination);
        filesystemApi.exportFileList(() =>
            warehouseApi.exportStoreLocation({
                ...unref(searchInfo),
                page: current,
                pageSize,
                total
            })
        );
    };
    const renterTree = async () => {
        const res = await factoryAPi.getFactoryList();
        treeData.value = res.data.list;
    };
    const upload = () => {
        getDataList();
    };
    onMounted(() => {
        renterTree();
    });
</script>
