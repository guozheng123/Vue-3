<template>
    <TpfLayout>
        <template #header>
            <LoadingSkeleton>
                <TpfForm @onSubmit="onSubmit" :formList="formList" />
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
                                seq: true,
                                operateColumn,
                                columns
                            }"
                        />
                    </template>
                    <template #operateLeft>
                        <a-button type="primary" class="tpf-button" @click="onAdd">
                            <SvgIcon type="icon-insert" /> 新增
                        </a-button>
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
        <TpfDIYFiledModal
            ref="diyFiledModalDom"
            v-if="showDiyFiledModalDom"
            :pageCode="pageCode"
            @updateTable="updateTable"
        />
        <TpfDeleteDetail ref="delModalDom" v-if="showDelModalDom" />
    </TpfLayout>
</template>

<script setup lang="tsx" name="DIYProductOrder">
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, defineAsyncComponent, unref, computed } from 'vue';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import type { TpfColumnType } from '@/types';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import { getTpfOptionEnum, tableResizable, PageCodeEnum } from '@/config';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { useSysPageFieldDiyApi } from '@/api';
    import type { ReqDiyPageQuery, ResDiyPageQuery } from '@/api';
    import type { TpfOperateBtn, TpfDelInfo, ResTpfList, TpfAxiosRes } from '@/types';
    import { useTpfDeleteDetail } from '@/components/TpfDeleteDetail/index';

    type Props = {
        pageCode: PageCodeEnum;
        deleteAction: (ids: number[]) => Promise<TpfAxiosRes<ResTpfList<TpfDelInfo[]>>>;
    };

    const props = defineProps<Props>();

    const TpfDIYFiledModal = defineAsyncComponent(
        () => import('@/components/TpfDIYFiledModal/index.vue')
    );

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const { statusOption, getLabel } = getTpfOptionEnum();

    const sysPageFieldDiyApi = useSysPageFieldDiyApi();

    const { delModalDom, openDelModalDom, showDelModalDom, TpfDeleteDetail } = useTpfDeleteDetail();

    const [diyFiledModalDom, openDiyFiledModalDom, showDiyFiledModalDom] = useOpenAntdModal();

    const searchInfo = ref({} as ReqDiyPageQuery);

    const formList = computed(() => {
        return [
            {
                type: 'Input',
                field: 'fieldName',
                label: '字段名称',
                placeholder: ''
            },
            {
                type: 'Select',
                field: 'enable',
                label: '是否启用',
                placeholder: '',
                showDefaultValue: '',
                options: statusOption
            },
            {
                type: 'Input',
                field: 'createUserName',
                label: '创建人',
                placeholder: ''
            },
            {
                type: 'DatePicker',
                valueFormat: 'YYYY-MM-DD',
                field: 'createDatetime',
                label: '创建日期'
            }
        ];
    });

    const columns = computed(() => {
        return [
            { title: '字段名称', dataIndex: 'fieldName', ...tableResizable() },
            { title: '字段类型', dataIndex: 'fieldText', ...tableResizable() },
            { title: '顺序', dataIndex: 'displayOrdinal', ...tableResizable() },
            {
                title: '是否启用',
                dataIndex: 'enable',
                ...tableResizable(),
                customRender: ({ record }) => getLabel(Number(record.enable), statusOption)
            },
            { title: '创建人', dataIndex: 'createUser', ...tableResizable() },
            { title: '创建日期', dataIndex: 'createDatetime', ...tableResizable(), sorter: true },
            { title: '修改人', dataIndex: 'modifyUser', ...tableResizable() },
            { title: '修改日期', dataIndex: 'modifyDatetime', ...tableResizable(), sorter: true }
        ] as TpfColumnType<ResDiyPageQuery>[];
    });

    const onDeleteField = async (record: ResDiyPageQuery) => {
        try {
            const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
            await TpfDelConfirm({ content: '确定要删除该字段吗?' });
            const res = await props.deleteAction([record.sysPageFieldDiyId]);
            if (res.data.list.length) {
                openDelModalDom(res.data.list);
            } else {
                const { message } = await import('ant-design-vue');
                message.success('删除成功');
            }
            updateTable();
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const defaultBtn = [
        { title: '编辑', onClick: ({ record }) => openDiyFiledModalDom(record) },
        { title: '详情', onClick: ({ record }) => openDiyFiledModalDom(record, true) },
        { title: '删除', onClick: ({ record }) => onDeleteField(record) }
    ] as TpfOperateBtn<ResDiyPageQuery>[];

    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 180,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });

    const { tableInfo, pagination, getDataList } = useAntdTable({
        api: async pagination => {
            const { pageSize, current: page, sortByAsc, sortedField } = unref(pagination);
            const res = await sysPageFieldDiyApi.pageQuery({
                ...unref(searchInfo),
                pageSize,
                page,
                entityCode: props.pageCode,
                sortByAsc,
                sortedField
            });
            return res.data.object;
        },
        rowKey: 'sysPageFieldDiyId',
        isPageAble: true,
        useSorter: true
    });

    // 新增
    const onAdd = () => {
        openDiyFiledModalDom();
    };

    const updateTable = () => {
        getDataList();
    };

    const onSubmit = (val: ReqDiyPageQuery) => {
        searchInfo.value = unref(val);
        unref(pagination).current = 1;
        getDataList();
    };
</script>
