<template>
    <div class="content">
        <TpfLayout>
            <template #header>
                <LoadingSkeleton>
                    <TpfForm :pageCode="pageCode" @onSubmit="onSubmit" isConfig />
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
                                    loading,
                                    pagination,
                                    seq: true,
                                    beforeRender
                                }"
                            />
                        </template>
                        <template #operateLeft>
                            <a-button class="tpf-button" type="primary" @click="onPrint">
                                <SvgIcon type="icon-dayin" style="margin-right: 5px" /> 打印
                            </a-button>
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
        <Detail ref="detail" />
        <Print ref="print" />
    </div>
</template>

<script setup lang="tsx" name="ProcessHandoverForm">
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, unref, defineAsyncComponent } from 'vue';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { TpfColumnType } from '@/types';
    import { useFilesystemApi, useQueryAPi, useHandoverAPi } from '@/api';
    import { PageCodeEnum, getTpfOptionEnum } from '@/config';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import { useStore } from '@/store';
    import { message } from 'ant-design-vue';

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const Detail = defineAsyncComponent(() => import('./component/Detail.vue'));
    const Print = defineAsyncComponent(() => import('./component/Print.vue'));

    const [detail, onOpenDetail] = useOpenAntdModal();
    const [print, onOpenPrint] = useOpenAntdModal();

    const filesystemApi = useFilesystemApi();
    const useHandover = useHandoverAPi();
    const { cacheSearchStore } = useStore();

    const { getLabel, handoverStatus } = getTpfOptionEnum();
    const pageCode = PageCodeEnum.handoverOrder;
    const useQuery = useQueryAPi();

    const searchInfo = ref<{ [k: string]: any }>({});
    const exportFileParams = ref();
    const beforeRender = (list: TpfColumnType[]) => {
        return unref(list).map(item => {
            if (item.dataIndex === 'handover_order_code') {
                item.customRender = ({ text, record }) => {
                    return (
                        <a
                            onClick={() => {
                                onOpenDetail(record.handover_order_code);
                            }}
                        >
                            {text}
                        </a>
                    );
                };
            }
            if (item.dataIndex === 'status') {
                item.customRender = ({ text }) => getLabel(text, handoverStatus);
            }

            return item;
        });
    };
    const onPrint = () => {
        if (selectedRowInfo.value.selectedRows.length === 0) {
            return message.warning('请勾选数据 !');
        }
        const ids = selectedRowInfo.value.selectedRows.map(e => e.handover_order_code);
        onOpenPrint(ids);
    };
    const onSubmit = (res: any) => {
        searchInfo.value = unref(res) || {};
        unref(pagination).current = 1;
        getDataList();
    };

    const { tableInfo, pagination, loading, getDataList, selectedRowInfo } = useAntdTable({
        api: async pageInfo => {
            const { current, pageSize } = unref(pageInfo);
            exportFileParams.value = {
                page: current,
                pageSize,
                ...unref(searchInfo),
                sortedField: 'create_datetime',
                sortByAsc: false
            };
            const res = await useQuery.execute(unref(exportFileParams));
            return res.data.object;
        },
        rowKey: 'result_entity_id',
        isPageAble: true,
        isConfig: true,
        hasRowSelection: true
    });

    const exportTable = async () => {
        const handoverOrderCode = selectedRowInfo.value.selectedRows.map(
            e => e.handover_order_code
        );
        const params = {
            ...unref(exportFileParams)
        };
        if (handoverOrderCode.length > 0) {
            params.conditions = [
                {
                    conditionFieldName: 'handover_order_code',
                    values: handoverOrderCode,
                    type: 'contain',
                    valueType: 'CHAR'
                }
            ];
        }
        filesystemApi.exportFileList(() =>
            useHandover.download({
                ...params,
                tableHeaderConfig: cacheSearchStore.getUploadLoadSortColumns(pageCode)
            })
        );
    };

    /**
     * MaterialProductBomQueryVo
     */
</script>

<style lang="less" scoped>
    .content {
        height: 100%;
    }
</style>
