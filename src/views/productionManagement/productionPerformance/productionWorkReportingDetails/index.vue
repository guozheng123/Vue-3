<template>
    <TpfLayout>
        <template #header>
            <LoadingSkeleton>
                <TpfForm
                    isConfig
                    @onSubmit="onSubmit"
                    :pageCode="pageCode"
                    :labelCol="{ style: { width: '126px' } }"
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
                        <a-button
                            class="tpf-button"
                            type="primary"
                            :disabled="!selectedRowInfo.selectedRowKeys.length"
                            @click="deleteFun"
                        >
                            <SvgIcon type="icon-shanchu" /> 删除
                        </a-button>

                        <a-button @click="exportTable" class="tpf-button" type="primary" ghost>
                            <SvgIcon type="icon-daochu" /> 导出
                        </a-button>
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
        <TpfDeleteDetail ref="delModalDom" v-if="showDelModalDom" />
        <ImagePreviewModel ref="imagePreviewModel" v-if="showImagePreviewModel" />
    </TpfLayout>
</template>

<script setup lang="tsx" name="ProductionWorkReportingDetails">
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, unref, defineAsyncComponent } from 'vue';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import {
        useQueryAPi,
        useFilesystemApi,
        useProductionOrderApi,
        useProductionInspectOrderInfoApi
    } from '@/api';
    import type { ResQueryReportProgressListByPage } from '@/api';
    import { PageCodeEnum } from '@/config';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { useStore } from '@/store';
    import { useTpfDeleteDetail } from '@/components/TpfDeleteDetail';
    import { tableBeforeRenderMethod } from './tableBeforeRenderMethod';

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const ImagePreviewModel = defineAsyncComponent(
        () => import('./components/ImagePreviewModel.vue')
    );

    const { beforeRender, operateColumn } =
        tableBeforeRenderMethod<ResQueryReportProgressListByPage>();

    const { delModalDom, openDelModalDom, showDelModalDom, TpfDeleteDetail } = useTpfDeleteDetail();

    const productionOrderApi = useProductionOrderApi();

    const productionInspectOrderInfoApi = useProductionInspectOrderInfoApi();

    const { cacheSearchStore } = useStore();

    const pageCode = PageCodeEnum.reportProgress;

    const queryApi = useQueryAPi();

    const filesystemApi = useFilesystemApi();

    const [imagePreviewModel, onOpenImagePreviewModel, showImagePreviewModel] = useOpenAntdModal();

    const searchInfo = ref<{ [k: string]: any }>({});

    const exportFileParams = ref();

    const onPicture = async (data: ResQueryReportProgressListByPage) => {
        const res = await productionInspectOrderInfoApi.getInspectFilesByReportProgressId({
            reportProgressId: data.report_progress_id
        });
        onOpenImagePreviewModel(res.data.list);
    };

    const onSubmit = (res: any) => {
        searchInfo.value = unref(res) || {};
        unref(pagination).current = 1;

        getDataList();
    };

    const { tableInfo, pagination, getDataList, selectedRowInfo } = useAntdTable({
        api: async pageInfo => {
            const { current, pageSize } = unref(pageInfo);
            exportFileParams.value = {
                ...unref(searchInfo),
                page: current,
                pageSize,
                sortedField: 'create_datetime',
                sortByAsc: false
            };
            const res = await queryApi.execute(unref(exportFileParams));
            return res.data.object;
        },
        rowKey: 'report_progress_id',
        isPageAble: true,
        hasRowSelection: true,
        isConfig: true
    });

    const deleteFun = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定删除选中的信息吗?' });
        const res = await productionOrderApi.deleteReportProgress({
            ids: unref(selectedRowInfo).selectedRowKeys as string[]
        });
        getDataList();

        if (res.data.list.length) {
            openDelModalDom(res.data.list);
            return;
        }
        const { message } = await import('ant-design-vue');
        message.success('删除成功！');
    };

    const exportTable = async () => {
        // unref(exportFileParams).queryFields['ids'] = unref(selectedRowInfo).selectedRowKeys;
        const params = {
            ...unref(exportFileParams)
        };
        filesystemApi.exportFileList(() =>
            queryApi.exportListExcelFile({
                ...params,
                tableHeaderConfig: cacheSearchStore.getUploadLoadSortColumns(pageCode)
            })
        );
    };
    defineExpose({ onPicture });
</script>
