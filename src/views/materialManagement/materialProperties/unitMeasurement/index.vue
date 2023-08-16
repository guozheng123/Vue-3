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
                <TpfTableLayout showChangeTableFontSize showChangeTableGap :pageCode="pageCode">
                    <template #default="args">
                        <TpfTable
                            seq
                            v-bind="{
                                ...tableInfo,
                                ...args,
                                beforeRender,
                                pagination,
                                operateColumn
                            }"
                        />
                    </template>
                    <template #operateLeft>
                        <a-button type="primary" class="tpf-button" @click="openNewDetails">
                            <SvgIcon type="icon-insert" /> 新增
                        </a-button>
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
        <addDialog ref="dialog" @ongetDataList="getDataList" />
        <TpfDeleteDetail ref="delModalDom" v-if="showDelModalDom" />
    </TpfLayout>
</template>

<script lang="tsx" setup>
    import type { TpfColumnType } from '@/types';
    import { message } from 'ant-design-vue';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, computed, unref, defineAsyncComponent } from 'vue';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { useAntdTable } from '@/hooks';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import { fmtDayjsTime } from '@/utils';
    import { useMaterialUnitApi } from '@/api';
    import { PageCodeEnum } from '@/config';
    import { useTpfDeleteDetail } from '@/components/TpfDeleteDetail';

    const pageCode = PageCodeEnum.unitMeasurement;

    const addDialog = defineAsyncComponent(() => import('./components/addDialog/index.vue'));

    const materialUnitApi = useMaterialUnitApi();

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const { delModalDom, showDelModalDom, TpfDeleteDetail } = useTpfDeleteDetail();

    const searchInfo = ref<{ [k: string]: any }>({});

    const dialog = ref<any>(null);

    const filterParameters = ref<any>(['否', '是']);

    const formList = computed(() => {
        return [
            {
                type: 'Input',
                field: 'materialUnitCode',
                label: '计量单位编号',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'materialUnitName',
                label: '计量单位名称',
                allowClear: true
            },
            {
                type: 'Select',
                field: 'status',
                label: '是否启用',
                showDefaultValue: 1,
                options: [
                    { value: '', label: '所有' },
                    { value: 1, label: '是' },
                    { value: 0, label: '否' }
                ]
            },
            {
                type: 'Input',
                field: 'createUser',
                label: '创建人',
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
                field: 'createData',
                label: '创建日期',
                placeholder: ['开始日期', '结束日期'],
                allowClear: true
            },
            {
                type: 'RangePicker',
                field: 'modifyDatetime',
                label: '修改日期',
                placeholder: ['开始日期', '结束日期'],
                allowClear: true
            }
        ];
    });

    const openNewDetails = () => {
        dialog.value.openAddDialogView(1);
    };

    const onSubmit = (val: any) => {
        searchInfo.value = unref(val);
        const [createDatetimeStart = '', createDatetimeEnd = ''] =
            unref(searchInfo).createData || [];

        const [modifyDatetimeStart = '', modifyDatetimeEnd = ''] =
            unref(searchInfo).modifyDatetime || [];

        unref(searchInfo).createDatetimeStart = fmtDayjsTime(
            createDatetimeStart,
            'YYYY-MM-DD 00:00:00'
        );
        unref(searchInfo).createDatetimeEnd = fmtDayjsTime(
            createDatetimeEnd,
            'YYYY-MM-DD 23:59:59'
        );
        unref(searchInfo).modifyDatetimeStart = fmtDayjsTime(
            modifyDatetimeStart,
            'YYYY-MM-DD 00:00:00'
        );
        unref(searchInfo).modifyDatetimeEnd = fmtDayjsTime(
            modifyDatetimeEnd,
            'YYYY-MM-DD 23:59:59'
        );
        unref(pagination).current = 1;

        getDataList();
    };

    const beforeRender = (list: TpfColumnType[]) => {
        const res = unref(list).map(item => {
            if (item.dataIndex === 'status') {
                item.customRender = ({ text, record }) => (
                    <span>{filterParameters.value[Number(text)]}</span>
                );
            }
            if (item.dataIndex === 'defaultFlag') {
                item.customRender = ({ text, record }) => (
                    <span>{filterParameters.value[Number(text)]}</span>
                );
            }
            return item;
        });
        return res;
    };

    const defaultBtn = [
        {
            title: '编辑',
            onClick: (row: any) => {
                const data = { ...row.value };
                dialog.value.openAddDialogView(2, data);
            }
        },
        {
            title: '删除',
            onClick: async (row: any) => {
                const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))[
                    'default'
                ];
                await TpfDelConfirm({ content: '确定删除选中的信息吗?' });
                const info = { ids: [row.value.materialUnitId] };
                const res = await materialUnitApi.deleteMaterialUnitByIds(info);
                if (!res.data.list.length) {
                    message.success('删除成功');
                } else {
                    message.error('删除失败' + res.data.list[0].reason);
                }
                getDataList();
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

    const { tableInfo, pagination, getDataList } = useAntdTable({
        api: async pageInfo => {
            const { current: page, pageSize } = unref(pageInfo);
            const info = { ...unref(searchInfo), page, pageSize };
            const res = await materialUnitApi.queryMaterialUnitListByPage(info);
            return res.data.object;
        },
        rowKey: 'inspectionTypeId',
        isPageAble: true
    });
</script>
