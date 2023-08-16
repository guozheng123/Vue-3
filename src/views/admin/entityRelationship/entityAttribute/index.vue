<template>
    <TpfLayout>
        <template #header>
            <LoadingSkeleton>
                <TpfForm
                    @onSubmit="onSubmit"
                    :formList="formList"
                    :labelCol="{ style: { width: '96px' } }"
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
        <AddEntityAttributeModal
            ref="AddEntityAttributeModalDom"
            v-if="showAddEntityAttributeModal"
            @updateTable="updateTable"
        />
    </TpfLayout>
</template>

<script setup lang="tsx">
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, defineAsyncComponent, unref } from 'vue';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import type { TpfColumnType, TpfOperateBtn } from '@/types';
    import { useEntityPropertyApi } from '@/api';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { Switch } from 'ant-design-vue';
    import { getTpfOptionEnum } from '@/config';
    const {
        entityTypeList,
        statusOption,
        storageTypeOption,
        valueTypeOption,
        valueSourceTypeOptions
    } = getTpfOptionEnum();

    const entityPropertyApi = useEntityPropertyApi();

    const [
        AddEntityAttributeModalDom,
        openAddEntityAttributeModalDom,
        showAddEntityAttributeModal
    ] = useOpenAntdModal();

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));
    const AddEntityAttributeModal = defineAsyncComponent(
        () => import('./components/AddEntityAttributeModal.vue')
    );

    const searchInfo = ref({});
    const formList = [
        { type: 'Input', field: 'entityCode', label: '实体编码', allowClear: true },
        {
            type: 'Input',
            field: 'entityPropertyCode',
            label: '实体属性编码',
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
        { type: 'Input', field: 'entityPropertyName', label: '实体属性名称', allowClear: true },
        {
            type: 'Select',
            field: 'storageType',
            label: '存储类型',
            allowClear: true,
            options: storageTypeOption
        },
        {
            type: 'Select',
            field: 'valueType',
            label: '值类型',
            allowClear: true,
            options: valueTypeOption
        },
        { type: 'Input', field: 'valueTypeLength', label: '值类型长度', allowClear: true },
        {
            type: 'Select',
            field: 'valueSourceType',
            label: '值来源类型',
            allowClear: true,
            options: valueSourceTypeOptions
        },
        { type: 'Input', field: 'valueSource', label: '值来源', allowClear: true },
        { type: 'Input', field: 'storageName', label: '存储名', allowClear: true }
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
        { title: '实体属性ID', dataIndex: 'entityPropertyId' },
        { title: '租户ID', dataIndex: 'tenantId' },
        { title: '实体编码', dataIndex: 'entityCode' },
        { title: '实体编码', dataIndex: 'entityPropertyCode' },
        { title: '实体属性名称（默认名称）', dataIndex: 'entityPropertyName' },
        { title: '实体属性名称（国际化名称）', dataIndex: 'entityPropertyI18nName' },
        { title: '存储类型', dataIndex: 'storageType' },
        { title: '值类型', dataIndex: 'valueType' },
        { title: '值类型长度', dataIndex: 'valueTypeLength' },
        { title: '值来源类型', dataIndex: 'valueSourceType' },
        { title: '值来源类型', dataIndex: 'valueSource' },
        { title: '存储名', dataIndex: 'storageName' },
        {
            title: '启用标识',
            dataIndex: 'enabled',
            customRender: ({ text }) => <Switch checked={text}></Switch>
        },
        { title: '描述', dataIndex: 'description' },
        { title: '创建人', dataIndex: 'createUser' },
        { title: '创建时间', dataIndex: 'createDatetime' },
        { title: '修改人', dataIndex: 'modifyUser' },
        { title: '修改时间', dataIndex: 'modifyDatetime' },
        { title: '值类型名', dataIndex: 'valueTypeName' },
        { title: '值来源类型名', dataIndex: 'valueSourceTypeName' },
        { title: '存储类型名', dataIndex: 'storageTypeName' }
    ] as TpfColumnType[];

    const { tableInfo, pagination, getDataList } = useAntdTable({
        api: async pagination => {
            const { pageSize = 20, current = 1 } = unref(pagination);
            const params = { ...unref(searchInfo), pageSize, page: current };
            return await entityPropertyApi.query(params).then(res => res.data.object);
        },
        rowKey: 'entityPropertyId',
        isPageAble: true,
        hasRowSelection: false
    });

    const updateTable = () => {
        getDataList();
    };

    const onAdd = () => {
        openAddEntityAttributeModalDom();
    };
    //编辑
    const onEdit = async (row: any) => {
        openAddEntityAttributeModalDom(row);
    };

    // 删除
    const onDel = async (row: any) => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定要删除该数据吗?' });
        await entityPropertyApi.addOrUpdate({ ...row, deleted: true });
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
