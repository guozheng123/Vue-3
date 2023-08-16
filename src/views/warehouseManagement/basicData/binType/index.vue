<template>
    <div style="height: 100%">
        <TpfLayout>
            <template #content>
                <LoadingSkeleton>
                    <TpfTableLayout
                        showChangeTableFontSize
                        showChangeTableGap
                        showChangeTableColumnFileds
                    >
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
                                <SvgIcon type="icon-insert" />
                                新增
                            </a-button>
                        </template>
                    </TpfTableLayout>
                </LoadingSkeleton>
            </template>
        </TpfLayout>
        <BinTypeModel
            :editData="editData"
            @upload-table="upload"
            ref="binTypeModel"
            :type="type"
            :isEdit="isEdit"
        />
    </div>
</template>

<script setup lang="tsx" name="binType">
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { message } from 'ant-design-vue';
    import { ref, unref, defineAsyncComponent, onMounted } from 'vue';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import type { TpfColumnType } from '@/types';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import { useWarehouseApi } from '@/api';
    import { tableResizable } from '@/config';
    import dayjs from 'dayjs';

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const BinTypeModel = defineAsyncComponent(() => import('./binTypeModel/index.vue'));

    const [binTypeModel, openBinTypeModel] = useOpenAntdModal();
    const warehouseApi = useWarehouseApi();

    const type = ref('');
    const isEdit = ref(false);
    const editData = ref();

    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 150,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });
    const columns = ref<TpfColumnType[]>([
        {
            title: '仓位类型代码',
            dataIndex: 'code',
            ...tableResizable()
        },
        {
            title: '仓位类型',
            dataIndex: 'name',
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
                openBinTypeModel();
                type.value = '编辑仓位类型';
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
                const res = await warehouseApi.deletePositionType({
                    positionTypeId: row.value.id,
                    positionTypeCode: row.value.code
                });
                if (res.data.value) {
                    message.success('删除成功');
                } else {
                    message.error(res.data.object.message);
                }
                getDataList();
            }
        }
    ];

    const { tableInfo, pagination, loading, getDataList } = useAntdTable({
        api: async pageInfo => {
            const { current, pageSize } = unref(pageInfo);
            const res = await warehouseApi.queryPositionTypeByParam({
                page: current,
                pageSize
            });
            return res.data.object;
        },
        rowKey: 'id',
        isPageAble: true
    });
    const onAdd = () => {
        openBinTypeModel();
        type.value = '新增仓位类型';
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
