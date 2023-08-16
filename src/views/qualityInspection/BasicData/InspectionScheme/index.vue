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
                <TpfTableLayout showChangeTableFontSize showChangeTableGap>
                    <template #default="args">
                        <TpfTable
                            seq
                            :operateColumn="operateColumn"
                            :columns="columns"
                            :pagination="pagination"
                            v-bind="{ ...tableInfo, ...args }"
                        />
                    </template>
                    <template #operateLeft>
                        <a-button type="primary" class="tpf-button" @click="openNewDetails">
                            <template #icon>
                                <SvgIcon type="icon-insert" />
                            </template>
                            新增
                        </a-button>
                        <a-button
                            class="tpf-button"
                            type="primary"
                            :disabled="isEmpty(selectedRowInfo.selectedRowKeys)"
                            @click="onDelete"
                        >
                            <template #icon>
                                <SvgIcon type="icon-shanchu" />
                            </template>
                            删除
                        </a-button>
                        <TpfDeleteDetail ref="delModalDom" v-if="showDelModalDom" />
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
    </TpfLayout>
</template>

<script lang="tsx" setup>
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, computed, unref, defineAsyncComponent } from 'vue';
    import type { TpfColumnType } from '@/types';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { useAntdTable } from '@/hooks';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import { useQualityApi, ReqGetQualityInspectionSchemeList } from '@/api';
    import { tableResizable } from '@/config';
    import router from '@/router';
    import { isEmpty } from 'lodash-es';
    import dayjs from 'dayjs';
    import { useTpfDeleteDetail } from '@/components/TpfDeleteDetail';

    const { delModalDom, openDelModalDom, showDelModalDom, TpfDeleteDetail } = useTpfDeleteDetail();

    const qualityApi = useQualityApi();

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const searchInfo = ref({} as ReqGetQualityInspectionSchemeList);

    const formList = computed(() => {
        return [
            {
                type: 'Input',
                field: 'inspectionSchemeCode',
                label: '质检方案编号',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'inspectionSchemeName',
                label: '质检方案名称',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'createUser',
                label: '创建人',
                allowClear: true
            },
            {
                type: 'RangePicker',
                field: 'createDateStart@_@createDateEnd',
                label: '创建日期',
                valueFormat: 'YYYY-MM-DD',
                placeholder: ['开始日期', '结束日期'],
                showDefaultValue: [],
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
                field: 'modifyDateStart@_@modifyDateEnd',
                label: '修改日期',
                valueFormat: 'YYYY-MM-DD',
                placeholder: ['开始日期', '结束日期'],
                showDefaultValue: [],
                allowClear: true
            }
        ];
    });

    const onSubmit = (val: any) => {
        searchInfo.value = unref(val);

        unref(pagination).current = 1;

        getDataList();
    };
    const columns = ref<TpfColumnType[]>([
        {
            title: '质检方案编号',
            dataIndex: 'inspectionSchemeCode',
            key: 'inspectionSchemeCode',
            ...tableResizable(),
            sorter: {
                compare: (a, b) => a.inspectionSchemeCode - b.inspectionSchemeCode
            },
            customRender: (val: any) => {
                return (
                    <a
                        onClick={() => {
                            const data = { ...val.record };
                            router.push({
                                path: '/qualityInspection/BasicData/InspectionScheme/components/newDetails'
                            });
                            localStorage.setItem('newDetailsInfo', JSON.stringify(data));
                        }}
                    >
                        {val.value}
                    </a>
                );
            }
        },
        {
            title: '质检方案名称',
            dataIndex: 'inspectionSchemeName',
            key: 'inspectionSchemeName',
            ...tableResizable(),
            resizable: true
        },
        {
            title: '创建人',
            dataIndex: 'createUser',
            key: 'createUser',
            ...tableResizable(),
            resizable: true
        },
        {
            title: '创建日期',
            dataIndex: 'createDatetime',
            key: 'createDatetime',
            ...tableResizable(),
            sorter: {
                compare: (a, b) => {
                    return a.createDatetime > b.createDatetime ? 1 : -1;
                }
            },
            customRender: ({ text }) => {
                return dayjs(text).format('YYYY-MM-DD');
            }
        },
        {
            title: '修改人',
            dataIndex: 'modifyUser',
            key: 'modifyUser',
            ...tableResizable()
        },
        {
            title: '修改日期',
            dataIndex: 'modifyDatetime',
            key: 'modifyDatetime',
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
                console.log('编辑', row);
                const data = { ...row };
                localStorage.setItem('schemeEditing', JSON.stringify(data));
                router.push({
                    path: '/qualityInspection/BasicData/InspectionScheme/components/schemeEditing'
                });
            }
        }
    ];

    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 80,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });
    // 新增
    const openNewDetails = () => {
        router.push({ path: '/qualityInspection/BasicData/InspectionScheme/components/newScheme' });
    };
    const { tableInfo, pagination, getDataList, selectedRowInfo } = useAntdTable({
        api: async pageInfo => {
            const { current: page, pageSize } = unref(pageInfo);
            const info = { ...unref(searchInfo), page, pageSize };
            const res = await qualityApi.getQualityInspectionSchemeList(info);
            return res.data.object;
        },
        rowKey: 'inspectionSchemeId',
        isPageAble: true,
        hasRowSelection: true
    });

    // 删除
    const onDelete = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定要删除吗?删除不可恢复' });
        const params = {
            ids: unref(selectedRowInfo).selectedRowKeys
        };
        const res = await qualityApi.deleteQualityInspectionScheme(params);
        if (res.data.list.length) {
            openDelModalDom(res.data.list);
        } else {
            const { message } = await import('ant-design-vue');
            message.success('删除成功！');
            getDataList();
        }
    };
</script>
