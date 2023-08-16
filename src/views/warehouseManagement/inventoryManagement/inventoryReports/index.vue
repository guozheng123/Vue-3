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
                                loading,
                                pagination,
                                seq: true,
                                beforeRender
                            }"
                            @updateColumns="updateColumns"
                        />
                    </template>
                    <template #operateLeft>
                        <a-button type="primary" class="tpf-button" ghost @click="onStorageWarning">
                            <SvgIcon type="icon-kucunyujing" />库存预警
                        </a-button>
                        <a-button @click="exportTable" class="tpf-button" type="primary" ghost>
                            <SvgIcon type="icon-daochu" /> 导出
                        </a-button>
                    </template>
                    <template #operateRightLeft>
                        <a-checkbox-group v-model:value="checkedValue" @change="onChangeMerge">
                            <a-checkbox
                                v-for="(item, index) in checkedList"
                                :key="index"
                                :value="item.key"
                                :disabled="checkedValue.includes(3) && item.key === 4"
                            >
                                {{ item.label }}
                            </a-checkbox>
                        </a-checkbox-group>
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
        <StorageWarningModal v-if="onloadModal" ref="storageWarningRef" />
    </TpfLayout>
</template>

<script setup lang="tsx" name="inventoryReports">
    import { useStore } from '@/store';
    import type { ReqGetStoreInfoPageByParamList } from '@/api';
    import { useWarehouseApi, useFilesystemApi } from '@/api';
    import type { TpfColumnType } from '@/types';
    import { PageCodeEnum } from '@/config';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import StorageWarningModal from './components/StorageWarningModal.vue';
    import { ref, computed, unref, defineAsyncComponent, onMounted } from 'vue';
    import TpfForm from '@/components/TpfForm/index.vue';
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));
    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );

    const pageCode = PageCodeEnum.warehouseManagementInventoryReports;
    const warehouseApi = useWarehouseApi();
    const filesystemApi = useFilesystemApi();
    const { cacheSearchStore } = useStore();

    const searchInfo = ref<ReqGetStoreInfoPageByParamList>();
    const [storageWarningRef, onOpenConfirmStorage, onloadModal] = useOpenAntdModal();
    const checkedValue = ref<number[]>([1, 2, 4]);
    const mergeDataIndex = {
        1: 'projectCode',
        2: 'batchNo',
        3: 'positionName',
        4: 'storeLocationName'
    };
    const checkedList = computed(() => {
        return [
            {
                label: '合并项目',
                key: 1
            },
            {
                label: '合并批次号',
                key: 2
            },
            {
                label: '合并仓位',
                key: 3
            },
            {
                label: '合并库位',
                key: 4
            }
        ];
    });
    const onSubmit = (val: ReqGetStoreInfoPageByParamList) => {
        searchInfo.value = unref(val);
        setSearchInfo();
        onGetInitData();
    };
    const onStorageWarning = () => {
        onOpenConfirmStorage({
            ...unref(searchInfo),
            ...unref(getMergeValues)
        });
    };
    const onGetInitData = () => {
        unref(pagination).current = 1;
        getDataList();
    };
    const updateColumns = (data: any) => {
        onSetChangeMerge();
    };
    const setSearchInfo = () => {
        const { materialType } = unref(searchInfo) || {};
        if (Array.isArray(materialType) && materialType.length && searchInfo.value) {
            searchInfo.value.materialType = materialType[materialType.length - 1];
        }
    };
    const onSetChangeMerge = async () => {
        // 合并保存多选框数据
        const storePageJson = cacheSearchStore.getPageJson(pageCode);
        if (storePageJson && storePageJson.columnList) {
            // let showTitle = false;
            storePageJson.columnList.forEach(item => {
                if (unref(getMergeKey).includes(item.dataIndex as string)) {
                    // if (item.visible) {
                    //     showTitle = true;
                    // }
                    item.visible = false;
                } else {
                    item.visible = true;
                }
            });
            cacheSearchStore.setPageJson(pageCode, storePageJson);
            // if (showTitle) mergeMessage();
        }
    };
    const onChangeMerge = async () => {
        if (checkedValue.value.includes(3) && !checkedValue.value.includes(4)) {
            checkedValue.value.push(4);
        }
        onGetInitData();
        onSetChangeMerge();
    };
    const beforeRender = (list: TpfColumnType[]) => {
        return unref(list).map(item => {
            if (item.dataIndex === 'materialCode') {
                item.sorter = true;
            }
            return item;
        });
    };

    const { tableInfo, pagination, loading, getDataList } = useAntdTable({
        api: async pageInfo => {
            const { current, pageSize, sortByAsc, sortedField } = unref(pageInfo);
            const res = await warehouseApi.getQueryStoreInfoPageByParam({
                ...unref(searchInfo),
                page: current,
                pageSize,
                sortByAsc,
                sortedField,
                ...unref(getMergeValues)
            });
            return res.data.object;
        },
        rowKey: 'id',
        isPageAble: true,
        useSorter: true
    });
    const exportTable = async () => {
        filesystemApi.exportFileList(() =>
            warehouseApi.exportStoreInfo({
                ...unref(searchInfo),
                ...unref(getMergeValues),
                tableHeaderConfig: cacheSearchStore.getUploadLoadSortColumns(pageCode)
            })
        );
    };
    const onGetMergeValue = (type: number) => {
        return checkedValue.value.includes(type) ? 1 : 0;
    };
    const getMergeValues = computed(() => {
        return {
            mergeProject: onGetMergeValue(1),
            mergeBatchNo: onGetMergeValue(2),
            mergePosition: onGetMergeValue(3),
            mergeStoreLocation: onGetMergeValue(4)
        };
    });
    const getMergeKey = computed(() => {
        return unref(checkedValue).reduce((prev, cur) => {
            prev.push(mergeDataIndex[cur]);
            return prev;
        }, [] as string[]);
    });
    onMounted(() => {
        getDataList();
        onSetChangeMerge();
    });
</script>
