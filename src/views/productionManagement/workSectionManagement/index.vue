<template>
    <TpfLayout>
        <template #header>
            <LoadingSkeleton>
                <TpfForm
                    :pageCode="pageCode"
                    @onSubmit="onSubmit"
                    :labelCol="{ style: { width: '126px' } }"
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

                        <a-button
                            class="tpf-button"
                            type="primary"
                            :disabled="isEmpty(selectedRowInfo.selectedRowKeys)"
                            @click="deleteFun"
                        >
                            <SvgIcon type="icon-shanchu" /> 删除
                        </a-button>
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
        <TpfDeleteDetail ref="delModalDom" v-if="showDelModalDom" />
    </TpfLayout>
</template>

<script setup lang="tsx" name="workSectionManagement">
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { message } from 'ant-design-vue';
    import { ref, unref, defineAsyncComponent } from 'vue';
    import { useAntdTable, useRouteBase64 } from '@/hooks';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import type { TpfColumnType, OperateBtnClick } from '@/types';
    import { useQueryAPi, useWorkshopApi } from '@/api';
    import { PageCodeEnum, getTpfOptionEnum } from '@/config';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { isEmpty } from 'lodash-es';
    import { useTpfDeleteDetail } from '@/components/TpfDeleteDetail';
    // 路由
    import router from '@/router';
    // 加密参数
    const { encodeParams } = useRouteBase64();
    // 使用query接口获取主列表数据
    const useQuery = useQueryAPi();
    // 工段管理接口
    const WorkshopApi = useWorkshopApi();

    const { delModalDom, openDelModalDom, showDelModalDom, TpfDeleteDetail } = useTpfDeleteDetail();

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const searchInfo = ref<{ [k: string]: any }>({});

    const pageCode = PageCodeEnum.workSectionManagement;

    const defaultBtn = [{ title: '编辑', onClick: (row: OperateBtnClick) => onEdit(row) }];
    // 自定义表格字段
    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 100,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });

    const { getLabel, isStart } = getTpfOptionEnum();
    const beforeRender = (list: TpfColumnType[]) => {
        return unref(list).map(item => {
            if (['create_datetime'].includes(item.dataIndex as string)) {
                item.sorter = true;
            }
            if (item.dataIndex === 'workshop_section_code') {
                item.sorter = true;
                item.customRender = ({ text, record }) => (
                    <span class="tpf-link" onClick={() => getMerchantManagementInfo(record)}>
                        {text}
                    </span>
                );
            }
            if (item.dataIndex === 'enabled') {
                item.customRender = ({ text }) => getLabel(text, isStart);
            }

            return item;
        });
    };

    const onSubmit = (res: any) => {
        res.mainEntityCode = 'workshop_section_info';
        unref(pagination).current = 1;
        searchInfo.value = unref(res) || {};
        getDataList();
    };

    const { tableInfo, pagination, getDataList, selectedRowInfo } = useAntdTable({
        api: async pageInfo => {
            const { current, pageSize, sortByAsc, sortedField } = unref(pageInfo);
            const res = await useQuery.execute({
                page: current,
                pageSize,
                sortByAsc,
                sortedField: sortedField || 'create_datetime',
                ...unref(searchInfo)
            });
            return res.data.object;
        },
        rowKey: 'workshop_section_id',
        isPageAble: true,
        isConfig: true,
        hasRowSelection: true,
        useSorter: true
    });
    //新增
    const onAdd = () => {
        router.push({
            path: '/productionManagement/workSectionManagement/workSectionManagementModel'
        });
    };
    //编辑
    const onEdit = async ({ record }: OperateBtnClick) => {
        router.push({
            path: '/productionManagement/workSectionManagement/editWorkshopSection',
            query: encodeParams({ WorkshopSectionId: record.workshop_section_id, type: 'DETAIL' })
        });
    };
    //查看详情
    const getMerchantManagementInfo = (row: any) => {
        console.log(row);
        router.push({
            path: '/productionManagement/workSectionManagement/detailWorkshopSection',
            query: encodeParams({ WorkshopSectionId: row.workshop_section_id })
        });
    };

    // 删除
    const deleteFun = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定要删除该工段管理?删除不可恢复' });
        const params = {
            ids: unref(selectedRowInfo).selectedRowKeys
        };
        const res = await WorkshopApi.deleteWorkshopSectionByIds(params);
        console.log(res.data.object.list.length, '删除');
        if (res.data.object.list.length) {
            openDelModalDom(res.data.object.list);
        } else {
            message.success('工段管理删除成功！');
            getDataList();
        }
    };
</script>
