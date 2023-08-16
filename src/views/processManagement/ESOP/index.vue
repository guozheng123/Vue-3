<template>
    <TpfLayout>
        <template #header>
            <LoadingSkeleton>
                <TpfForm
                    @onSubmit="onSubmit"
                    :pageCode="pageCode"
                    :labelCol="{ style: { width: '126px' } }"
                    is-config
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
                                seq: true,
                                operateColumn,
                                beforeRender
                            }"
                        />
                    </template>
                    <template #operateLeft>
                        <OperateBtnAction
                            :selectedRowInfo="selectedRowInfo"
                            :getDataList="getDataList"
                            :getExportParams="getExportParams"
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
    import { useQueryAPi } from '@/api';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import { PageCodeEnum, getTpfOptionEnum } from '@/config';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { useRouter } from 'vue-router';
    import { Badge } from 'ant-design-vue';
    import { useStore } from '@/store';
    import OperateBtnAction from './OperateBtnAction.vue';
    const useQuery = useQueryAPi();

    const { statusNameColor, getLabel, isStart, publishOption } = getTpfOptionEnum();

    const { encodeParams } = useRouteBase64();

    const pageCode = PageCodeEnum.guidebook;

    const router = useRouter();

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const { cacheSearchStore } = useStore();

    const searchInfo = ref({});

    const beforeRender = (list: TpfColumnType[]) => {
        const res = unref(list).map(item => {
            if (['create_datetime'].includes(item.dataIndex as string)) {
                item.sorter = true;
            }

            if (item.dataIndex === 'guidebook_code') {
                item.sorter = true;

                item.customRender = ({ text, record }) => (
                    <span class="tpf-link" onClick={() => getMerchantManagementInfo(record)}>
                        {text}
                    </span>
                );
            }
            if (['default_flag', 'enable'].includes(item.dataIndex as string)) {
                item.customRender = ({ text }) => getLabel(text, isStart.slice(1));
            }
            if (item.dataIndex === 'version') {
                item.customRender = ({ text }) => {
                    return [null, undefined, ''].includes(text) ? '' : `V${text}`;
                };
            }
            if (item.dataIndex === 'release_flag') {
                item.customRender = ({ text }: { text: string }) => {
                    const showName = getLabel(text, publishOption);
                    return <Badge color={getLabel(showName, statusNameColor)} text={showName} />;
                };
            }

            return item;
        });
        return res;
    };

    const defaultBtn = [
        { title: '编辑', onClick: ({ record }) => onEdit(record) },
        { title: '复制', onClick: ({ record }) => onCopy(record) },
        { title: '升版', onClick: ({ record }) => onUPGRADES(record) }
    ] as TpfOperateBtn[];

    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 150,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });

    const { tableInfo, pagination, getDataList, selectedRowInfo, sortFieldInfo } = useAntdTable({
        api: async pagination => {
            const { pageSize, current, sortByAsc, sortedField } = unref(pagination);
            const res = await useQuery.execute({
                ...unref(searchInfo),
                page: current,
                pageSize,
                sortByAsc,
                sortedField: sortedField || 'create_datetime'
            });
            return res.data.object;
        },
        rowKey: 'guidebook_id',
        isPageAble: true,
        hasRowSelection: true,
        useSorter: true,
        isConfig: true
    });

    //查看详情
    const getMerchantManagementInfo = (row: any) => {
        router.push({
            path: '/processManagement/ESOP/detailESOP',
            query: encodeParams({ guidebookId: row.guidebook_id })
        });
    };

    //编辑
    const onEdit = async (row: any) => {
        console.log(row, 'row');
        if (row.release_flag === '1') {
            const { message } = await import('ant-design-vue');
            message.error('已发布，不可编辑');
            return;
        }

        router.push({
            path: '/processManagement/ESOP/editESOP',
            query: encodeParams({ guidebookId: row.guidebook_id, type: 'DETAIL' })
        });
    };

    // 复制
    const onCopy = (row: any) => {
        router.push({
            path: '/processManagement/ESOP/copyESOP',
            query: encodeParams({ guidebookId: row.guidebook_id, type: 'COPY' })
        });
    };

    // 升级
    const onUPGRADES = async (row: any) => {
        if (row.release_flag !== '1') {
            const { message } = await import('ant-design-vue');
            message.error('只允许发布的ESOP进行升级操作 ');
            return;
        }
        router.push({
            path: '/processManagement/ESOP/upgradesESOP',
            query: encodeParams({ guidebookId: row.guidebook_id, type: 'UPGRADES' })
        });
    };

    const onSubmit = (val: Record<string, any>) => {
        searchInfo.value = unref(val);
        unref(pagination).current = 1;
        getDataList();
    };

    const getExportParams = () => ({
        ...unref(searchInfo),
        ...unref(sortFieldInfo),
        sortedField: unref(sortFieldInfo).sortedField || 'create_datetime',
        tableHeaderConfig: cacheSearchStore.getUploadLoadSortColumns(pageCode)
    });
</script>
