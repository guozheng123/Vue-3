<template>
    <TpfLayout>
        <template #header>
            <LoadingSkeleton>
                <TpfForm
                    @onSubmit="onSubmit"
                    :formList="formList"
                    :labelCol="{ style: { width: '90px' } }"
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
        <AddEntityManageModal
            ref="AddEntityManageModalDom"
            v-if="showAddEntityManageModal"
            @updateTable="updateTable"
        />
    </TpfLayout>
</template>

<script setup lang="tsx">
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, defineAsyncComponent, unref } from 'vue';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import type { TpfColumnType, TpfOperateBtn } from '@/types';
    import { useEntityApi } from '@/api';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { Switch } from 'ant-design-vue';
    import { getTpfOptionEnum } from '@/config';
    const { entityTypeList, statusOption } = getTpfOptionEnum();

    const entityApi = useEntityApi();

    const [AddEntityManageModalDom, openAddEntityManageModalDom, showAddEntityManageModal] =
        useOpenAntdModal();

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const AddEntityManageModal = defineAsyncComponent(
        () => import('./components/AddEntityManageModal.vue')
    );

    const searchInfo = ref({});
    const formList = [
        { type: 'Input', field: 'entityCode', label: '实体编码', allowClear: true },
        {
            type: 'Select',
            field: 'entityType',
            label: '实体类型',
            allowClear: true,
            options: entityTypeList
        },
        {
            type: 'Select',
            field: 'enabled',
            label: '启用标识',
            allowClear: true,
            options: statusOption
        },
        { type: 'Input', field: 'serviceName', label: '服务名', allowClear: true },
        { type: 'Input', field: 'storageName', label: '服务名', allowClear: true },
        { type: 'Input', field: 'entityType', label: '实体类型', allowClear: true }
    ];

    const defaultBtn = [
        { title: '编辑', onClick: ({ record }) => onEdit(record) },
        { title: '删除', onClick: ({ record }) => onDel(record) }
    ] as TpfOperateBtn[];

    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 150,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });
    const columns = [
        { title: '实体ID', dataIndex: 'entityId' },
        { title: '租户ID', dataIndex: 'tenantId' },
        { title: '实体编码', dataIndex: 'entityCode' },
        { title: '实体类型', dataIndex: 'entityType' },
        { title: '实体类型名称', dataIndex: 'entityTypeName' },
        { title: '服务名', dataIndex: 'serviceName' },
        { title: '存储名', dataIndex: 'storageName' },
        {
            title: '启用标识',
            dataIndex: 'enabled',
            customRender: ({ text }) => <Switch checked={text}></Switch>
        },
        { title: '创建人', dataIndex: 'createUser' },
        { title: '创建时间', dataIndex: 'createDatetime' },
        { title: '修改人', dataIndex: 'modifyUser' },
        { title: '修改时间', dataIndex: 'modifyDatetime' },
        { title: '描述', dataIndex: 'description' }
    ] as TpfColumnType[];

    const { tableInfo, pagination, getDataList } = useAntdTable({
        api: async pagination => {
            const { pageSize = 20, current = 1 } = unref(pagination);
            const params = { ...unref(searchInfo), pageSize, page: current };
            return await entityApi.query(params).then(res => res.data.object);
        },
        rowKey: 'entityId',
        isPageAble: true,
        hasRowSelection: false
    });

    const updateTable = () => {
        getDataList();
    };

    const onAdd = () => {
        openAddEntityManageModalDom();
    };
    //编辑
    const onEdit = async (row: any) => {
        openAddEntityManageModalDom(row);
    };

    // 删除
    const onDel = async (row: any) => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定要删除该数据吗?' });
        await entityApi.addOrUpdate({ ...row, deleted: true });
        const { message } = await import('ant-design-vue');
        message.success('删除成功');
        updateTable();
    };

    const onSubmit = (val: Record<string, any>) => {
        console.log('val: ', val);
        searchInfo.value = unref(val);
        unref(pagination).current = 1;
        getDataList();
    };
</script>
