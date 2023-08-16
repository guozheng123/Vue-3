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
        <AddRelationshipModal
            ref="AddRelationshipModalDom"
            v-if="showAddRelationshipModal"
            @updateTable="updateTable"
        />
    </TpfLayout>
</template>

<script setup lang="tsx">
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, defineAsyncComponent, unref } from 'vue';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import type { TpfColumnType, TpfOperateBtn } from '@/types';
    import { useEntityRelationApi } from '@/api';
    import type { ReqEntityRelationQuery, ResEntityRelationQuery } from '@/api';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { Switch } from 'ant-design-vue';
    import { getTpfOptionEnum } from '@/config';

    const { statusOption, mapTypeList, mapRuleTypeList } = getTpfOptionEnum();

    const entityRelationApi = useEntityRelationApi();

    const [AddRelationshipModalDom, openAddRelationshipModalDom, showAddRelationshipModal] =
        useOpenAntdModal();

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));
    const AddRelationshipModal = defineAsyncComponent(
        () => import('./components/AddRelationshipModal.vue')
    );

    const searchInfo = ref({} as ReqEntityRelationQuery);

    const formList = [
        { type: 'Input', field: 'entityRelationId', label: '实体关系ID', allowClear: true },
        { type: 'Input', field: 'leftEntityCode', label: '左实体编码', allowClear: true },
        { type: 'Input', field: 'rightEntityCode', label: '右实体编码', allowClear: true },
        {
            type: 'Select',
            field: 'enabled',
            label: '启用标识',
            allowClear: true,
            options: statusOption
        },
        {
            type: 'Select',
            field: 'mapType',
            label: '映射类型',
            allowClear: true,
            options: mapTypeList
        },
        {
            type: 'Select',
            field: 'mapRuleType',
            label: '映射规则类型',
            allowClear: true,
            options: mapRuleTypeList
        },
        { type: 'Input', field: 'mapRuleValue', label: '映射规则值', allowClear: true }
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
        { title: '实实体关系ID', dataIndex: 'entityRelationId' },
        { title: '租户ID', dataIndex: 'tenantId' },
        { title: '左实体编码', dataIndex: 'leftEntityCode' },
        { title: '右实体编码', dataIndex: 'rightEntityCode' },
        // { title: '映射类型', dataIndex: 'mapType' },
        // { title: '映射规则类型', dataIndex: 'mapRuleType' },
        { title: '映射规则值', dataIndex: 'mapRuleValue' },
        {
            title: '启用标识',
            dataIndex: 'enabled',
            customRender: ({ text }) => <Switch checked={text}></Switch>
        },
        { title: '创建人', dataIndex: 'createUser' },
        { title: '创建时间', dataIndex: 'createDatetime' },
        { title: '修改人', dataIndex: 'modifyUser' },
        { title: '修改时间', dataIndex: 'modifyDatetime' },
        // { title: '描述', dataIndex: 'description' },
        {
            title: '左实体关联属性集合',
            dataIndex: 'leftEntityRelationPropertyList',
            customRender: ({ record: { leftEntityRelationPropertyList } }) =>
                leftEntityRelationPropertyList?.map((item: any) => item.entityPropertyCode).join()
        },
        {
            title: '右实体关联属性集合',
            dataIndex: 'rightEntityRelationPropertyList',
            customRender: ({ record: { rightEntityRelationPropertyList } }) =>
                rightEntityRelationPropertyList?.map(item => item.entityPropertyCode).join()
        },
        { title: '映射类型名', dataIndex: 'mapTypeName' },
        { title: '映射规则类型名', dataIndex: 'mapRuleTypeName' }
    ] as TpfColumnType<ResEntityRelationQuery>[];

    const { tableInfo, pagination, getDataList } = useAntdTable({
        api: async pagination => {
            const { pageSize = 20, current = 1 } = unref(pagination);
            const params = { ...unref(searchInfo), pageSize, page: current };
            return await entityRelationApi.query(params).then(res => res.data.object);
        },
        rowKey: 'entityRelationId',
        isPageAble: true,
        hasRowSelection: false
    });

    const updateTable = () => {
        getDataList();
    };

    const onAdd = () => {
        openAddRelationshipModalDom();
    };
    //编辑
    const onEdit = async (row: any) => {
        openAddRelationshipModalDom(row);
    };

    // 删除
    const onDel = async (row: any) => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定要删除该数据吗?' });
        await entityRelationApi.addOrUpdate({ ...row, deleted: true });
        const { message } = await import('ant-design-vue');
        message.success('删除成功');
        updateTable();
    };

    const onSubmit = (val: ReqEntityRelationQuery) => {
        searchInfo.value = unref(val);
        unref(pagination).current = 1;
        getDataList();
    };
</script>
