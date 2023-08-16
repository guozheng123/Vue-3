<template>
    <TpfModal
        class="addWorkingProcedureModel"
        v-model:visible="visible"
        title="添加工序"
        height="600px"
        width="1200px"
    >
        <div class="content">
            <a-card class="title" style="width: 100%">
                <a-row :gutter="24">
                    <a-col :span="8">
                        <a-form-item label="工艺编号">
                            {{ paramsData.processCode }}
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="工艺名称">
                            {{ paramsData.processName }}
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="版本">
                            {{ paramsData.processVersion }}
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-card>
            <a-card class="main">
                <TpfLayout>
                    <template #header>
                        <LoadingSkeleton>
                            <TpfForm style="" :formList="formList" @onSubmit="onSubmit" />
                        </LoadingSkeleton>
                    </template>
                </TpfLayout>

                <TpfIndentation style="border-top: 1px solid #eee" width="400px">
                    <template #left>
                        <LoadingSkeleton>
                            <TpfTableLayout style="height: 445px">
                                <template #default="args">
                                    <LoadingSkeleton>
                                        <TpfTable
                                            v-bind="{
                                                ...args,
                                                ...tableInfo,
                                                loading,
                                                pagination,
                                                columns,
                                                seq: true
                                            }"
                                        />
                                    </LoadingSkeleton>
                                </template>
                                <template #operateLeft>
                                    <div class="header-title">工序库</div>
                                </template>
                            </TpfTableLayout>
                        </LoadingSkeleton>
                    </template>
                    <template #right>
                        <TpfTableLayout style="height: 400px">
                            <template #default="args">
                                <LoadingSkeleton>
                                    <TpfTable
                                        v-bind="{
                                            ...args,
                                            ...tableInfoRight,
                                            seq: true,
                                            operateColumn
                                        }"
                                        :columns="columnRight"
                                        :dataSource="dataSource"
                                        :pagination="false"
                                    />
                                </LoadingSkeleton>
                            </template>
                            <template #operateLeft>
                                <div class="header-title">
                                    已选择({{ selectedRowInfo.selectedRows.length }})
                                </div>
                            </template>
                        </TpfTableLayout>
                    </template>
                </TpfIndentation>
            </a-card>
        </div>

        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="onSave">保存</a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="tsx" name="AddWorkingProcedureModel">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { ref, unref, defineAsyncComponent, computed, watchEffect } from 'vue';
    import { useAntdTable, useRef } from '@/hooks';
    import { useWorkingProcedure } from '@/api';
    import { tableResizable, getTpfOptionEnum } from '@/config';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import TpfForm from '@/components/TpfForm/index.vue';
    import type { TpfColumnType } from '@/types';
    import mitts from '@/utils/bus';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import { useRouteQuery } from '@/hooks';

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const workingProcedure = useWorkingProcedure();
    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );

    const TpfIndentation = defineAsyncComponent(
        () => import('@/components/TpfIndentation/index.vue')
    );

    const emit = defineEmits(['getList']);

    const { type: routerType } = useRouteQuery<{ type: string }>();

    const { operationTypeNameListOptions, getLabel, timeUnitOption } = getTpfOptionEnum();
    const isAdd = ref(false);
    const dataSource = ref<any[]>();
    const [visible, setVisible] = useRef(false);

    const searchInfo = ref<any>({});
    const paramsData = ref({
        processName: '--',
        processCode: '--',
        processVersion: '--'
    });
    const columnRight = computed(() => {
        return [
            {
                title: '工序编号',
                dataIndex: 'operationCode',
                ...tableResizable()
            },
            {
                title: '工艺名称',
                dataIndex: 'operationName',
                ...tableResizable()
            },
            {
                title: '工艺类型',
                dataIndex: 'operationTypeCode',
                ...tableResizable(),
                customRender: ({ text }) => {
                    return getLabel(text, operationTypeNameListOptions);
                }
            },
            {
                title: '计件单价(元)',
                dataIndex: 'pricePerQuantity',
                ...tableResizable()
            },
            {
                title: '计时单价',
                dataIndex: 'pricePerTime',
                ...tableResizable()
            },
            {
                title: '计时单位',
                dataIndex: 'pricePerTimeUnit',
                ...tableResizable(),
                customRender: ({ text }) => {
                    return getLabel(text, timeUnitOption);
                }
            },
            {
                title: '作业单元类型编号',
                dataIndex: 'workUnitTypeCode',
                ...tableResizable()
            },
            {
                title: '作业单元类型名称',
                dataIndex: 'workUnitTypeName',
                ...tableResizable()
            },
            {
                title: '备注',
                dataIndex: 'remark',
                ...tableResizable()
            }
        ] as TpfColumnType[];
    });

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
            }
        ];
    });

    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 100,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });

    const columns = ref<TpfColumnType[]>([
        {
            title: '工序编号',
            dataIndex: 'operationCode',
            width: '80',
            ...tableResizable()
        },
        {
            title: '工序名称',
            dataIndex: 'operationName',
            width: '80',
            ...tableResizable()
        },
        {
            title: '工序类型',
            dataIndex: 'operationTypeCode',
            width: '80',
            ...tableResizable(),
            customRender: ({ text }) => getLabel(text, operationTypeNameListOptions)
        }
    ]);

    const defaultBtn = [
        {
            title: '删除',
            onClick: (row: any) => {
                dataSource.value = dataSource.value?.filter(
                    e => e.operationCode !== row.value.operationCode
                );
                const ids = dataSource.value?.map((e: any) => e.operationCode);
                selectedRowInfo.value.selectedRowKeys = ids as any;
                selectedRowInfo.value.selectedRows = dataSource.value as any;
            }
        }
    ];
    const { tableInfo, pagination, loading, getDataList, selectedRowInfo } = useAntdTable({
        api: async pageInfo => {
            const { current, pageSize } = unref(pageInfo);
            const params = {
                page: current,
                pageSize,
                ...unref(searchInfo),
                forbidden: '1'
            };
            const res = await workingProcedure.queryOperationInfoListByPage(params);
            return res.data.object;
        },
        rowKey: 'operationCode',
        isPageAble: true,
        hasRowSelection: true,
        preserveSelectedRowKeys: true
    });

    const { tableInfo: tableInfoRight } = useAntdTable({
        api: async () => {
            return { list: [] as Record<string, any>[] };
        },
        rowKey: 'operationCode',
        isPageAble: false,
        preserveSelectedRowKeys: true
    });

    watchEffect(() => {
        dataSource.value = unref(selectedRowInfo).selectedRows || [];
    });

    const open = async (val: any) => {
        setVisible(!visible.value);
        await getDataList();

        if (routerType === 'add') {
            isAdd.value = true;
        }
        paramsData.value.processCode = val.form.processCode || '--';
        paramsData.value.processName = val.form.processName || '--';
        paramsData.value.processVersion = val.form.processVersion || '--';

        const ids = val.list.map((e: any) => e.operationCode);
        selectedRowInfo.value = {
            selectedRows: unref(val).list || [],
            selectedRowKeys: ids
        };
        dataSource.value = val.list;
    };
    const onSubmit = (val: any) => {
        searchInfo.value = unref(val);
        unref(pagination).current = 1;
        getDataList();
    };
    const onSave = async () => {
        setVisible(!visible.value);

        mitts.emit('event', dataSource.value);
        emit('getList', dataSource.value);
    };

    defineExpose({ open });
</script>

<style scoped lang="less">
    .content {
        :deep(.title) {
            .ant-card-body {
                padding-top: 0 !important;
                padding-bottom: 0 !important;

                .ant-form-item {
                    margin-bottom: 10px;
                    margin-top: 10px;
                    margin-left: 70px;
                }
            }
        }

        :deep(.main) {
            .ant-card-body {
                padding: 0 !important;

                .tpf-layout .tpf-layout-content {
                    /* ; */
                    margin-top: 0 !important;
                    background-color: #fff;
                }
            }

            .tpf-layout {
                background-color: transparent;
                height: 100%;
                padding: 0 !important;

                /* padding: 10px 12px 10px 10px; */
            }
        }
    }

    .main {
        margin-top: 16px;

        :deep(.ant-form-item-label) {
            width: 75px !important;
        }

        .header-title {
            color: #1d2129;
            font-size: 16px;
            position: relative;
            padding-left: 16px;
            line-height: 24px;
            font-weight: 500;

            &::before {
                position: absolute;
                left: 0;
                top: 0;
                content: '';
                height: 20px;
                width: 4px;
                background-color: var(--ant-primary-color);
            }
        }
    }
</style>
