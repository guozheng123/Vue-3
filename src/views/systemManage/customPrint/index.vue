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
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
    </TpfLayout>
</template>

<script setup lang="tsx">
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, defineAsyncComponent, unref } from 'vue';
    import { useAntdTable, useRouteBase64 } from '@/hooks';
    import type { TpfColumnType, TpfOperateBtn } from '@/types';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { useRouter } from 'vue-router';
    import { useCustomPrintApi } from '@/api';
    import { getTpfOptionEnum } from '@/config';

    const customPrintApi = useCustomPrintApi();
    const { printTemplateType, getLabel } = getTpfOptionEnum();

    const { encodeParams } = useRouteBase64();
    const router = useRouter();

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const searchInfo = ref<any>({});

    const formList = [
        { type: 'Input', field: 'printTemplateName', label: '模板名称', allowClear: true },
        {
            type: 'Select',
            field: 'templateTypeCode',
            label: '目标表单名称',
            allowClear: true,
            options: printTemplateType
        }
    ];

    const defaultBtn = [
        { title: '编辑', onClick: ({ record }) => onEdit(record) }
    ] as TpfOperateBtn[];

    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 150,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });
    const columns = [
        { title: '打印模版代码', dataIndex: 'printTemplateCode' },
        {
            title: '目标表单名称',
            dataIndex: 'templateTypeCode',
            customRender: ({ text }) => getLabel(text, printTemplateType)
        },
        { title: '模板名称', dataIndex: 'printTemplateName' }
    ] as TpfColumnType[];

    const { tableInfo, pagination, getDataList } = useAntdTable({
        api: async () => {
            const params = { ...unref(searchInfo) };
            const res = await customPrintApi.getPrintTemplate(params);
            return res.data.object;
        },
        rowKey: 'id',
        isPageAble: false,
        hasRowSelection: false
    });

    //编辑

    const onEdit = ({ templateTypeCode }: any) => {
        router.push({
            path: '/systemManage/customPrint/customPrintEdit',
            query: encodeParams({ type: 'edit', templateTypeCode })
        });
    };

    const onSubmit = (val: Record<string, any>) => {
        searchInfo.value = unref(val);
        getDataList();
    };
</script>
