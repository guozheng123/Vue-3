<template>
    <TpfLayout>
        <template #header>
            <LoadingSkeleton>
                <TpfForm
                    @onSubmit="onSubmit"
                    :labelCol="{ style: { width: '126px' } }"
                    :pageCode="pageCode"
                    isConfig
                />
            </LoadingSkeleton>
        </template>
        <template #content>
            <LoadingSkeleton>
                <TpfTableLayout showChangeTableFontSize showChangeTableGap :pageCode="pageCode">
                    <template #default="args">
                        <TpfTable
                            v-bind="{
                                ...args,
                                ...tableInfo,
                                pagination,
                                operateColumn,
                                seq: true,
                                beforeRender
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

        <AddModel
            @upload-table="getDataList"
            ref="addModel"
            :type="type"
            :templateNo="templateNo"
            :is-edit="isEdit"
        />
    </TpfLayout>
</template>

<script setup lang="tsx" name="Activity">
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { message } from 'ant-design-vue';
    import { ref, unref, defineAsyncComponent } from 'vue';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import type { TpfColumnType } from '@/types';
    import { useWorkingProcedure, useQueryAPi } from '@/api';
    import { PageCodeEnum, getTpfOptionEnum } from '@/config';
    import TpfForm from '@/components/TpfForm/index.vue';

    const pageCode = PageCodeEnum.noticeMsgTemplate;
    const useQuery = useQueryAPi();

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const AddModel = defineAsyncComponent(() => import('./activityModel/addModel.vue'));

    const { statusOptionStr, getLabel, timeUnitOption, isStart } = getTpfOptionEnum();

    const [addModel, onOpenAddModel] = useOpenAntdModal();

    const workingProcedure = useWorkingProcedure();

    const searchInfo = ref<{ [k: string]: any }>({});

    const exportfileParams = ref();

    const type = ref('');

    const isEdit = ref(false);

    const templateNo = ref(0);

    const defaultBtn = [
        {
            title: '编辑',
            onClick: ({ record }: any) => {
                type.value = '编辑消息模板';
                // workUnitId.value = row.value.workUnitId;
                isEdit.value = true;
                onOpenAddModel('edit', record);
            }
        }
    ];
    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 100,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });

    const beforeRender = (list: TpfColumnType[]) => {
        return unref(list).map(item => {
            if (item.dataIndex === 'template_code') {
                item.customRender = ({ text, record }) => {
                    return (
                        <span
                            class="tpf-link"
                            onClick={() => {
                                goDetail(record);
                            }}
                        >
                            {text}
                        </span>
                    );
                };
            }
            if (item.dataIndex === 'enable') {
                item.customRender = ({ text }) => getLabel(text, isStart);
            }
            if (item.dataIndex === 'timeUnit') {
                item.customRender = ({ text }) => getLabel(text, timeUnitOption);
            }

            return item;
        });
    };

    const goDetail = (record: any) => {
        type.value = '消息模板详情';
        templateNo.value = record.template_no;
        onOpenAddModel('detail', record);
        console.log(templateNo, '123');
    };
    const onSubmit = (res: any) => {
        res.mainEntityCode = 't_msg_template';
        searchInfo.value = unref(res);
        unref(pagination).current = 1;
        getDataList();
    };

    const { tableInfo, pagination, getDataList } = useAntdTable({
        api: async pageInfo => {
            const { current, pageSize, sortByAsc, sortedField } = unref(pageInfo);
            const res = await useQuery.execute({
                page: current,
                pageSize,
                sortByAsc,
                sortedField: sortedField || 'create_date_time',
                ...unref(searchInfo)
            });
            return res.data.object;
        },
        rowKey: 'template_code',
        isPageAble: true,
        isConfig: true,
        useSorter: true
    });

    const onAdd = () => {
        onOpenAddModel('add');
        type.value = '新增消息模板';
        isEdit.value = false;
    };
</script>
