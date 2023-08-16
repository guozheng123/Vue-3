<template>
    <TpfLayout>
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
                            <SvgIcon type="icon-insert" style="margin-right: 5px" />新增
                        </a-button>
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
        <MoveTypeModel
            @upload-table="upload"
            ref="moveTypeModel"
            :type="type"
            :isEdit="isEdit"
            :editData="editData"
        />
    </TpfLayout>
</template>

<script setup lang="tsx">
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, unref, defineAsyncComponent, onMounted } from 'vue';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import type { TpfColumnType } from '@/types';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import { useWarehouseApi } from '@/api';
    import { receiptIssueType, tableResizable, getLabel } from '@/config';
    import dayjs from 'dayjs';
    import { cloneDeep } from 'lodash-es';

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const MoveTypeModel = defineAsyncComponent(() => import('./moveTypeModel/index.vue'));

    const [moveTypeModel, openMoveTypeModel] = useOpenAntdModal();

    const warehouseApi = useWarehouseApi();

    const type = ref('');

    const isEdit = ref(false);

    const editData = ref({});

    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 150,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });

    const columns = ref<TpfColumnType[]>([
        { title: '移动类型代码', dataIndex: 'code', ...tableResizable() },
        { title: '移动类型名称', dataIndex: 'name', ...tableResizable() },
        {
            title: '出入库类型',
            dataIndex: 'outInStockType',
            ...tableResizable(),
            customRender: val => getLabel(val.value, receiptIssueType)
        },
        {
            title: '是否启用',
            dataIndex: 'isUsed',
            ...tableResizable(),
            customRender: val => (val.value === 0 ? '否' : '是')
        },
        { title: '备注', dataIndex: 'remark', ...tableResizable() },
        {
            title: '是否内置',
            dataIndex: 'isInternal',
            ...tableResizable(),
            customRender: val => (val.value === '0' ? '否' : '是')
        },
        { title: '创建人', dataIndex: 'createUserName', ...tableResizable() },
        {
            title: '创建日期',
            dataIndex: 'createDateTime',
            ...tableResizable(),
            customRender: ({ text }) => dayjs(text).format('YYYY-MM-DD')
        }
    ]);

    const defaultBtn = [
        {
            title: '编辑',
            onClick: async ({ record }: any) => {
                if (record.isInternal === '1') {
                    const { message } = await import('ant-design-vue');
                    message.error('内置类型不可编辑');
                    return;
                }
                openMoveTypeModel();
                type.value = '编辑移动类型';
                isEdit.value = true;
                editData.value = cloneDeep(record);
            }
        },
        {
            title: '删除',
            onClick: async ({ record }: any) => {
                const { message } = await import('ant-design-vue');
                if (record.isInternal === '1') {
                    message.error('内置类型不可删除');
                    return;
                }
                const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))[
                    'default'
                ];
                await TpfDelConfirm({ content: '确定是否删除该数据?' });
                const res = await warehouseApi.deleteMoveType({
                    moveTypeId: record.id
                });
                if (res.success === true) {
                    message.success('删除成功');
                    getDataList();
                }
            }
        }
    ];

    const { tableInfo, pagination, getDataList } = useAntdTable({
        api: async pageInfo => {
            const { current, pageSize } = unref(pageInfo);
            const res = await warehouseApi.queryMoveTypeByParam({
                page: current,
                pageSize
            });
            return res.data.object;
        },
        rowKey: 'id',
        isPageAble: true
    });

    const onAdd = () => {
        openMoveTypeModel();
        type.value = '新增移动类型';
        isEdit.value = false;
        editData.value = {};
    };

    const upload = () => {
        getDataList();
    };

    onMounted(() => {
        getDataList();
    });
</script>
