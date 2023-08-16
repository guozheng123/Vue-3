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
                                seq: true,
                                operateColumn
                            }"
                        />
                    </template>
                    <template #operateLeft>
                        <a-button type="primary" class="tpf-button" @click="onAdd">
                            <SvgIcon type="icon-insert" /> 新增
                        </a-button>
                        <a-button ghost class="tpf-button" @click="exportTable" type="primary">
                            <SvgIcon type="icon-daochu" /> 导出
                        </a-button>
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
        <BinSettingsModel
            ref="binSettingsModel"
            :editData="editData"
            @upload-table="upload"
            :type="type"
            :isEdit="isEdit"
        />
    </TpfLayout>
</template>

<script setup lang="tsx" name="binSettings">
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import type { TreeSelectProps } from 'ant-design-vue';
    import { ref, computed, unref, defineAsyncComponent, onMounted } from 'vue';
    import type { TpfColumnType } from '@/types';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import { useWarehouseApi, useFilesystemApi, useWorkingTeamAPi } from '@/api';
    import { storePosition, isStart, tableResizable, getTpfOptionEnum } from '@/config';
    import TpfForm from '@/components/TpfForm/index.vue';
    import dayjs from 'dayjs';

    const { statusOption, getLabel } = getTpfOptionEnum();

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const BinSettingsModel = defineAsyncComponent(() => import('./binSettingsModel/index.vue'));
    const [binSettingsModel, openBinSettingsModel] = useOpenAntdModal();

    const warehouseApi = useWarehouseApi();

    const filesystemApi = useFilesystemApi();

    const workingTeamAPi = useWorkingTeamAPi();

    const searchInfo = ref<{ [k: string]: any }>({});
    const type = ref('');
    const formSelectType = ref<any[]>([]);
    const isEdit = ref(false);
    const treeData = ref<TreeSelectProps['treeData']>([]);
    const editData = ref();

    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 150,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });
    const formList = computed(() => {
        return [
            {
                type: 'TreeSelect',
                field: 'orgName',
                label: '所属组织名称',
                placeholder: '',
                allowClear: true,
                fieldNames: {
                    children: 'branchTree',
                    label: 'rootName',
                    value: 'rootName'
                },
                treeData: treeData.value
            },
            {
                type: 'Input',
                field: 'code',
                label: '仓位代码',
                placeholder: '',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'name',
                label: '仓位名称',
                placeholder: '',
                allowClear: true
            },
            {
                type: 'Select',
                field: 'type',
                label: '仓位类型',
                showDefaultValue: '',
                options: unref(formSelectType)
            },
            {
                type: 'Select',
                field: 'attribute',
                label: '仓位属性',
                placeholder: '',
                allowClear: true,
                options: storePosition
            },
            {
                type: 'Input',
                field: 'address',
                label: '仓位地址',
                placeholder: ''
            },
            {
                type: 'Select',
                field: 'isUsed',
                label: '是否启用',
                showDefaultValue: '',
                placeholder: '',
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
            dataIndex: 'code',
            ...tableResizable()
        },
        {
            title: '仓位名称',
            dataIndex: 'name',
            ...tableResizable()
        },
        { title: '仓位类型', dataIndex: 'type', ...tableResizable() },
        {
            title: '仓位属性',
            dataIndex: 'attribute',
            ...tableResizable(),
            customRender: val => {
                return getLabel(val.value, storePosition);
            }
        },
        {
            title: '仓位地址',
            dataIndex: 'address',
            ...tableResizable()
        },
        {
            title: '默认合格仓',
            dataIndex: 'defaultQualified',
            ...tableResizable(),
            customRender: val => {
                return getLabel(val.value, statusOption);
            }
        },
        {
            title: '默认不合格仓',
            dataIndex: 'defaultDisqualified',
            ...tableResizable(),
            customRender: val => {
                return getLabel(val.value, statusOption);
            }
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
                openBinSettingsModel();
                type.value = '编辑仓位设置';
                isEdit.value = true;
                editData.value = row.value;
            }
        },
        {
            title: '删除',
            onClick: async (row: any) => {
                const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))[
                    'default'
                ];
                await TpfDelConfirm({ content: '确定是否删除该数据?' });
                const res = await warehouseApi.deletePosition({
                    positionId: row.value.id,
                    positionCode: row.value.code
                });
                const { message } = await import('ant-design-vue');
                if (res.data.value) {
                    message.success('删除成功');
                } else {
                    message.error(res.data.object.message);
                }
                getDataList();
            }
        }
    ];

    const { tableInfo, pagination, getDataList } = useAntdTable({
        api: async pageInfo => {
            const { current, pageSize } = unref(pageInfo);
            const res = await warehouseApi.queryPositionByParam({
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

    const onAdd = () => {
        openBinSettingsModel();
        type.value = '新增仓位设置';
        isEdit.value = false;
        editData.value = {};
    };
    const exportTable = async () => {
        const { current, pageSize, total } = unref(pagination);
        const params = {
            ...unref(searchInfo),
            page: current,
            pageSize,
            total
        };
        filesystemApi.exportFileList(() => warehouseApi.exportPosition(params));
    };
    const renterTree = async () => {
        const res = await workingTeamAPi.getWorkshopWorkingTeamTreeList();
        treeData.value = res.data.list;
    };
    const upload = () => {
        getDataList();
    };
    onMounted(async () => {
        const res = await warehouseApi.queryPositionTypeByParam({});
        formSelectType.value = res.data.object.list.map((e: any) => {
            e.value = e.code;
            e.label = e.name;
            return e;
        });
        renterTree();
    });
</script>
