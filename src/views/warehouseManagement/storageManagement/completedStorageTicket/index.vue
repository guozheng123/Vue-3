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
                            ghost
                            type="primary"
                            class="tpf-button"
                            @click="onStorage"
                            :disabled="isEmpty(selectedRowInfo.selectedRows)"
                        >
                            <SvgIcon type="icon-querenruku" /> 确认入库
                        </a-button>
                        <a-button @click="exportTable" class="tpf-button" type="primary" ghost>
                            <SvgIcon type="icon-daochu" /> 导出
                        </a-button>
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
        <ConfirmStorageModal
            v-if="onloadConfirmStorageModal"
            ref="confirmStorageRef"
            @onGetTableList="getDataList"
        />
    </TpfLayout>
</template>

<script setup lang="tsx" name="completedStorageTicket">
    import { useStore } from '@/store';
    import { useInStoreAPi, useFilesystemApi } from '@/api';
    import type { ReqGetTableList } from '@/api';
    import { PageCodeEnum, getTpfOptionEnum } from '@/config';
    import type { TpfColumnType } from '@/types';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, unref, defineAsyncComponent } from 'vue';
    import { Badge } from 'ant-design-vue';
    import { isEmpty } from 'lodash-es';
    import TpfForm from '@/components/TpfForm/index.vue';

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const ConfirmStorageModal = defineAsyncComponent(
        () => import('./components/ConfirmStorageModal.vue')
    );

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );

    const pageCode = PageCodeEnum.warehouseManagementCompletedStorageTicket;

    const filesystemApi = useFilesystemApi();

    const { getLabel, inStatus, statusNameColor } = getTpfOptionEnum();

    const searchInfo = ref<ReqGetTableList>({} as ReqGetTableList);

    const inStoreAPi = useInStoreAPi();

    const { cacheSearchStore } = useStore();

    const [confirmStorageRef, onOpenConfirmStorage, onloadConfirmStorageModal] = useOpenAntdModal();

    const onStorage = async () => {
        onOpenConfirmStorage(unref(selectedRowInfo).selectedRowKeys);
    };

    const onSubmit = (val: ReqGetTableList) => {
        searchInfo.value = unref(val);
        unref(pagination).current = 1;
        getDataList();
    };
    const { tableInfo, pagination, loading, getDataList, selectedRowInfo, sortFieldInfo } =
        useAntdTable({
            api: async pageInfo => {
                loading.value = true;
                const { current, pageSize, sortByAsc, sortedField } = unref(pageInfo);
                const res = await inStoreAPi.queryCompleteInStorePageByParam({
                    ...unref(searchInfo),
                    page: current,
                    pageSize,
                    sortByAsc,
                    sortedField
                });
                loading.value = false;
                return res.data.object;
            },
            rowKey: 'id',
            isPageAble: true,
            hasRowSelection: {
                getCheckboxProps: record => ({
                    disabled: record.inStatus === 1
                })
            },
            useSorter: true
        });

    const exportTable = async () => {
        filesystemApi.exportFileList(() =>
            inStoreAPi.exportCompleteInStore({
                ...unref(searchInfo),
                ...unref(sortFieldInfo),
                tableHeaderConfig: cacheSearchStore.getUploadLoadSortColumns(pageCode)
            })
        );
    };

    const beforeRender = (list: TpfColumnType[]) => {
        return unref(list).map(item => {
            if (item.dataIndex === 'inStatus') {
                item.customRender = ({ text }: { text: number }) => {
                    if (text === null) return text;
                    const showText = getLabel(text, inStatus);
                    return <Badge color={getLabel(showText, statusNameColor)} text={showText} />;
                };
            }
            if (item.dataIndex === 'workDateTime') {
                item.sorter = true;
            }
            return item;
        });
    };
</script>
