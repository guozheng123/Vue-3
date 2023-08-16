<template>
    <TpfLayout>
        <template #header>
            <LoadingSkeleton>
                <TpfForm
                    :formList="formList"
                    @onSubmit="onSubmit"
                    :label-col="{ style: { width: '140px' } }"
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
                                columns,
                                operateColumn,
                                seq: true
                            }"
                            :showRowSelection="false"
                        />
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
        <InfoModal ref="infoModal" @submitUpdata="submitUpdata" />
    </TpfLayout>
</template>

<script setup lang="tsx" name="numberingRule">
    import { ref, defineAsyncComponent, unref } from 'vue';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import type { TpfColumnType } from '@/types';

    import { useFormCodeRuleApi } from '@/api';
    import { withTpfTableOperateColumn } from '@/components/TpfTable';
    import { message } from 'ant-design-vue';
    import { tableResizable } from '@/config';
    import dayjs from 'dayjs';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import TpfForm from '@/components/TpfForm/index.vue';
    import TpfTableLayout from '@/components/TpfTableLayout/index.vue';
    import TpfTable from '@/components/TpfTable/index.vue';

    const InfoModal = defineAsyncComponent(() => import('./components/InfoModal.vue'));
    const [infoModal, onOpenInfo] = useOpenAntdModal();
    const formCodeRuleApi = useFormCodeRuleApi();
    const formState = ref<{ [k: string]: any }>({});

    const formList = [
        {
            type: 'Input',
            field: 'numberRuleCode',
            label: '编号规则代码',
            allowClear: false
        },
        {
            type: 'Input',
            field: 'formName',
            label: '目标表单名称',
            allowClear: true
        },
        {
            type: 'Input',
            field: 'formNumberRule',
            label: '表单编号生成规则',
            allowClear: true
        }
    ];

    const columns = ref<TpfColumnType[]>([
        {
            title: '编号规则代码',
            dataIndex: 'numberRuleCode',
            ...tableResizable()
        },
        { title: '目标表单名称', dataIndex: 'formName', ...tableResizable() },
        { title: '表单编号生成规则', dataIndex: 'formNumberRule', ...tableResizable(), width: 250 },
        { title: '备注', dataIndex: 'remarks', ...tableResizable() },
        { title: '创建人', dataIndex: 'modifyUser', ...tableResizable() },
        {
            title: '创建日期',
            dataIndex: 'modifyDateTime',
            sorter: (a, b) => {
                const t1 = new Date(a.modifyDateTime).getTime();
                const t2 = new Date(b.modifyDateTime).getTime();
                return t1 - t2;
            },
            ...tableResizable(),
            customRender: ({ text }) => {
                return dayjs(text).format('YYYY-MM-DD');
            }
        }
    ]);
    const defaultBtn = [{ title: '编辑', onClick: (row: any) => onEdit(row) }];
    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 100,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });
    const { tableInfo, pagination, getDataList } = useAntdTable({
        api: async pagination => {
            const { pageSize = 20, current = 1 } = unref(pagination);
            const res = await formCodeRuleApi.getFormList({
                ...unref(formState),
                pageSize,
                page: current
            });
            return res.data.object;
        },
        rowKey: 'projectId'
    });
    //编辑
    const onEdit = async (v: any) => {
        const res = await formCodeRuleApi.getFormDetails({ id: v.text.id });
        if (res.success) {
            onOpenInfo('update', res.data.object);
        } else {
            message.error(res.errorMessage);
        }
    };
    const submitUpdata = async (v: any) => {
        const res = await formCodeRuleApi.updateFormTeam(v);
        if (res.success) {
            if (res.data.value) {
                message.success('信息保存成功！');
                onOpenInfo('close');
                getDataList();
            } else {
                message.error(res.errorMessage);
            }
        } else {
            message.error(res.errorMessage);
        }
    };
    // 查询
    const onSubmit = (val: any) => {
        formState.value = unref(val);
        unref(pagination).current = 1;

        getDataList();
    };
</script>
