<template>
    <TpfLayout>
        <template #header>
            <LoadingSkeleton>
                <TpfForm
                    @onSubmit="onSubmit"
                    :pageCode="pageCode"
                    :labelCol="{ style: { width: '98px' } }"
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
                                beforeRender
                            }"
                        />
                    </template>
                    <template #operateLeft>
                        <a-button
                            type="primary"
                            class="tpf-button"
                            @click="startHandle"
                            :disabled="isEmpty(selectedRowInfo.selectedRowKeys)"
                        >
                            <SvgIcon type="icon-kaishichuli" /> 开始处理
                        </a-button>

                        <a-button
                            type="primary"
                            class="tpf-button"
                            :disabled="isEmpty(selectedRowInfo.selectedRowKeys)"
                            @click="finishHandle"
                        >
                            <SvgIcon type="icon-jieshuchuli" /> 结束处理
                        </a-button>

                        <a-button class="tpf-button" type="primary" @click="exportTable" ghost>
                            <SvgIcon type="icon-daochu" /> 导出
                        </a-button>
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
        <HandleSuspensionModal
            ref="HandleSuspensionModalDom"
            v-if="showHandleSuspensionModalDom"
            :selectedRowKeys="selectedRowInfo.selectedRowKeys"
            @updateTable="updateTable"
        />
    </TpfLayout>
</template>

<script setup lang="tsx" name="productionSuspensionRecord">
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, defineAsyncComponent, unref } from 'vue';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import type { TpfColumnType } from '@/types';
    import { useFilesystemApi, useReportProgressPauseApi } from '@/api';
    import type { ReqPageQuery } from '@/api';
    import { PageCodeEnum } from '@/config';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { isEmpty } from 'lodash-es';
    import { useStore } from '@/store';

    const reportProgressPauseApi = useReportProgressPauseApi();

    const pageCode = PageCodeEnum.productionSuspensionRecord;

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const HandleSuspensionModal = defineAsyncComponent(
        () => import('./components/HandleSuspensionModal.vue')
    );

    const [HandleSuspensionModalDom, openHandleSuspensionModalDom, showHandleSuspensionModalDom] =
        useOpenAntdModal();

    const { cacheSearchStore } = useStore();

    const filesystemApi = useFilesystemApi();

    const searchInfo = ref<ReqPageQuery>({} as ReqPageQuery);

    const beforeRender = (list: TpfColumnType<ReqPageQuery>[]) => {
        const res = unref(list).map(item => {
            if (['endTime'].includes(item.dataIndex as string)) {
                item.sorter = true;
            }
            return item;
        });
        return res;
    };

    const validateStart = async () => {
        const { message } = await import('ant-design-vue');
        const { selectedRows } = unref(selectedRowInfo);
        const hasNoReport = selectedRows.some(item => item.isReport === '否');
        if (hasNoReport) {
            message.error('选择数据不需要处理');
            return false;
        }

        const hasResolveStartTime = selectedRows.some(item => !!item.resolveStartTime);
        if (hasResolveStartTime) {
            message.error('选择数据已处理');
            return false;
        }
        return true;
    };

    const validateFinish = async () => {
        const { message } = await import('ant-design-vue');

        const { selectedRows } = unref(selectedRowInfo);
        const hasNoReport = selectedRows.some(item => item.isReport === '否');
        if (hasNoReport) {
            message.error('选择数据不需要处理');
            return false;
        }
        const noResolveStartTime = selectedRows.some(item => !item.resolveStartTime);
        if (noResolveStartTime) {
            message.error('请先开始处理后再操作结束处理');
            return false;
        }

        const isEnd = selectedRows.some(item => !!item.resolveEndTime);
        if (isEnd) {
            message.error('处理数据已处理');
            return false;
        }

        return true;
    };

    const startHandle = async () => {
        (await validateStart()) && openHandleSuspensionModalDom('start');
    };
    const finishHandle = async () => {
        if (await validateFinish()) {
            const { selectedRows } = unref(selectedRowInfo);
            let [{ solution }] = selectedRows;
            if (selectedRows.length > 1) {
                solution = '';
            }
            openHandleSuspensionModalDom('finish', solution);
        }
    };

    const updateTable = () => {
        getDataList();
    };
    const { tableInfo, pagination, getDataList, selectedRowInfo, sortFieldInfo } = useAntdTable({
        api: async pagination => {
            const { pageSize, current, sortByAsc, sortedField } = unref(pagination);
            const res = await reportProgressPauseApi.pageQuery({
                ...unref(searchInfo),
                pageSize,
                page: current,
                sortByAsc,
                sortedField
            });
            return res.data.object;
        },
        rowKey: 'reportProgressPauseId',
        isPageAble: true,
        hasRowSelection: true,
        useSorter: true
    });

    const onSubmit = (val: ReqPageQuery) => {
        searchInfo.value = unref(val);
        unref(pagination).current = 1;
        getDataList();
    };

    const exportTable = () => {
        filesystemApi.exportFileList(() =>
            reportProgressPauseApi.exportReportProgressPauseFile({
                ...unref(searchInfo),
                ...unref(sortFieldInfo),
                tableHeaderConfig: cacheSearchStore.getUploadLoadSortColumns(pageCode)
            })
        );
    };
</script>
