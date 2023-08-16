<template>
    <div class="content">
        <TpfLayout>
            <template #header>
                <LoadingSkeleton>
                    <TpfForm :pageCode="formPageCode" @onSubmit="onSubmit" isConfig />
                </LoadingSkeleton>
            </template>
            <template #content>
                <LoadingSkeleton>
                    <TpfTableLayout
                        showChangeTableFontSize
                        showChangeTableGap
                        :pageCode="formPageCode"
                    >
                        <template #default="args">
                            <TpfTable
                                v-bind="{
                                    ...args,
                                    ...tableInfo,
                                    loading,
                                    pagination,
                                    seq: true,
                                    beforeRender
                                }"
                            />
                        </template>
                        <template #operateLeft>
                            <a-button @click="exportTable" class="tpf-button" type="primary" ghost>
                                <template #icon>
                                    <SvgIcon type="icon-daochu" style="margin-right: 5px" />
                                </template>
                                导出
                            </a-button>
                        </template>
                    </TpfTableLayout>
                </LoadingSkeleton>
            </template>
        </TpfLayout>
    </div>
</template>

<script setup lang="tsx" name="OperationTaskList">
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, unref, defineAsyncComponent, onMounted } from 'vue';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { TpfColumnType } from '@/types';
    import { useFilesystemApi, useQueryAPi } from '@/api';
    import { PageCodeEnum, getTpfOptionEnum } from '@/config';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { useAntdTable, useRouteBase64 } from '@/hooks';
    import { useRouter } from 'vue-router';
    import { useStore } from '@/store';

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));
    const { encodeParams } = useRouteBase64();

    const router = useRouter();
    const filesystemApi = useFilesystemApi();
    const { cacheSearchStore } = useStore();

    const { IQCcheckType, getLabel, IQCCheckResult, materialCodeMaterialMold } = getTpfOptionEnum();
    const pageCode = PageCodeEnum.productionInspectOrderInfo;
    const formPageCode = PageCodeEnum.iqcPcInspectOrderInfo;
    const useQuery = useQueryAPi();

    const searchInfo = ref<{ [k: string]: any }>({});
    const exportFileParams = ref();
    const beforeRender = (list: TpfColumnType[]) => {
        return unref(list).map(item => {
            if (item.dataIndex === 'inspect_order_id') {
                item.customRender = ({ text, record }) => {
                    return (
                        <a
                            onClick={() => {
                                router.push({
                                    path: '/qualityInspection/inspectionManagement/iQCDetail',
                                    query: encodeParams({
                                        baseData: JSON.stringify(record),
                                        inspectOrderId: record.inspect_order_id,
                                        materialCode: record.material_code
                                    })
                                });
                            }}
                        >
                            {text}
                        </a>
                    );
                };
            }
            if (item.dataIndex === 'status') {
                item.customRender = ({ text }) => getLabel(text, IQCcheckType);
            }
            if (item.dataIndex === 'inspect_order_id-PZSQL_iqcinspect_result') {
                item.customRender = ({ text }) => getLabel(text, IQCCheckResult);
            }
            if (item.dataIndex === 'material_code-material_mold') {
                item.customRender = ({ text }) => getLabel(text, materialCodeMaterialMold);
            }
            if (item.dataIndex === 'inspect_order_id-PZSQL_iqcqualifiedRate') {
                item.customRender = ({ text }) => {
                    return text ? text + '%' : '';
                };
            }

            return item;
        });
    };

    const onSubmit = (res: any) => {
        searchInfo.value = unref(res) || {};
        getDataList();
    };

    const { tableInfo, pagination, loading, getDataList } = useAntdTable({
        api: async pageInfo => {
            const { current, pageSize } = unref(pageInfo);
            exportFileParams.value = {
                page: current,
                pageSize,
                ...unref(searchInfo),
                sortedField: 'create_date',
                sortByAsc: false
            };

            exportFileParams.value.conditions.push({
                conditionFieldName: 'inspect_type',
                value: 'IQC'
            });

            exportFileParams.value.mainEntityCode = pageCode;
            const res = await useQuery.execute(unref(exportFileParams));
            return res.data.object;
        },
        rowKey: 'result_entity_id',
        isPageAble: true,
        isConfig: true,
        hasRowSelection: true
    });

    const exportTable = async () => {
        const params = {
            ...unref(exportFileParams)
        };
        filesystemApi.exportFileList(() =>
            useQuery.exportListExcelFile({
                ...params,
                tableHeaderConfig: cacheSearchStore.getUploadLoadSortColumns(pageCode)
            })
        );
    };

    onMounted(async () => {});
</script>

<style lang="less" scoped>
    .content {
        height: 100%;
    }
</style>
