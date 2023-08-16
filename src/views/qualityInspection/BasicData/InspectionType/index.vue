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
                <TpfTableLayout
                    showChangeTableFontSize
                    showChangeTableGap
                    showChangeTableColumnFileds
                >
                    <template #default="args">
                        <TpfTable
                            seq
                            :operateColumn="operateColumn"
                            :columns="columns"
                            :loading="loading"
                            :pagination="pagination"
                            v-bind="{ ...tableInfo, ...args }"
                        />
                    </template>
                    <template #operateLeft>
                        <a-button type="primary" class="tpf-button" @click="openNewDetails">
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
                        <addDialog ref="dialog" @ongetDataList="getDataList" />
                        <TpfDeleteDetail ref="delModalDom" v-if="showDelModalDom" />
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
    </TpfLayout>
</template>

<script lang="tsx" setup>
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, computed, unref, defineAsyncComponent } from 'vue';
    import type { TpfColumnType } from '@/types';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { useAntdTable } from '@/hooks';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import { tableResizable } from '@/config';
    import { useQualityApi } from '@/api';
    import { isEmpty } from 'lodash-es';
    import dayjs from 'dayjs';
    import { useTpfDeleteDetail } from '@/components/TpfDeleteDetail';

    const addDialog = defineAsyncComponent(() => import('./components/addDialog/index.vue'));
    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const { delModalDom, openDelModalDom, showDelModalDom, TpfDeleteDetail } = useTpfDeleteDetail();

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const qualityApi = useQualityApi();
    const searchInfo = ref<{ [k: string]: any }>({});
    const dialog = ref<any>(null);
    const filterParameters = ref<any>(['', '全检', '抽检', '首检', '末检']);

    const formList = computed(() => {
        return [
            {
                type: 'Input',
                field: 'inspectionTypeCode',
                label: '检验类型编号',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'inspectionTypeName',
                label: '检验类型名称',
                allowClear: true
            },
            {
                type: 'Select',
                field: 'inspectionMethod',
                label: '检验方法',
                showDefaultValue: 1,
                options: [{ value: 1, label: '全检' }]
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

    const openNewDetails = () => {
        dialog.value.openAddDialogView(1);
    };

    const onSubmit = (val: any) => {
        searchInfo.value = unref(val);
        unref(pagination).current = 1;

        getDataList();
    };
    const columns = ref<TpfColumnType[]>([
        {
            title: '检验类型编号',
            dataIndex: 'inspectionTypeCode',
            key: 'inspectionTypeCode',
            ...tableResizable(),
            fixed: 'left',
            sorter: {
                compare: (a, b) => a.inspectionTypeCode - b.inspectionTypeCode
            },
            customRender: (val: any) => {
                return (
                    <a
                        onClick={() => {
                            const data = { ...val.record };
                            console.log(data);
                            dialog.value.openAddDialogView(3, data);
                        }}
                    >
                        {val.value}
                    </a>
                );
            }
        },
        {
            title: '检验类型名称',
            dataIndex: 'inspectionTypeName',
            key: 'inspectionTypeName',
            ...tableResizable(),
            resizable: true
        },
        {
            title: '检验方法',
            dataIndex: 'inspectionMethod',
            key: 'inspectionMethod',
            ...tableResizable(),
            resizable: true,
            customRender: (val: any) => {
                return <span>{filterParameters.value[Number(val.value)]}</span>;
            }
        },

        {
            title: '创建人',
            dataIndex: 'createUser',
            key: 'createUser',
            ...tableResizable()
        },
        {
            title: '创建日期',
            dataIndex: 'createDatetime',
            key: 'createDatetime',
            ...tableResizable(),
            sorter: {
                compare: (a, b) => {
                    return a.createDatetime > b.createDatetime ? 1 : -1;
                }
            },
            customRender: ({ text }) => {
                return dayjs(text).format('YYYY-MM-DD');
            }
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
            customRender: ({ text }) => {
                return dayjs(text).format('YYYY-MM-DD');
            }
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

    // 删除
    const onDelete = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定要删除吗?删除不可恢复' });
        const params = {
            ids: unref(selectedRowInfo).selectedRowKeys //selectedRowKeys.value
        };
        const res = await qualityApi.deleteQualityInspectionType(params);
        if (res.data.list.length) {
            openDelModalDom(res.data.list);
        } else {
            const { message } = await import('ant-design-vue');
            message.success('删除成功！');
            getDataList();
        }
    };

    const { tableInfo, pagination, loading, getDataList, selectedRowInfo } = useAntdTable({
        api: async pageInfo => {
            const { current: page, pageSize } = unref(pageInfo);
            const info = { ...unref(searchInfo), page, pageSize };
            const res = await qualityApi.getQualityInspectionTypeList(info);
            return res.data.object;
        },
        rowKey: 'inspectionTypeId',
        isPageAble: true,
        hasRowSelection: true
    });
</script>
