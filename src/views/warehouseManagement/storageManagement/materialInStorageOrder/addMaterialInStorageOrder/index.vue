<template>
    <TpfAddInfoLayout title="新增" class="addMaterialInStorageOrder">
        <!-- 基本信息 -->
        <LoadingSkeleton> <InStorageInfo ref="inStorageInfoRef" /> </LoadingSkeleton>

        <!-- 入库明细 -->
        <LoadingSkeleton>
            <InStorageDetail ref="inStorageDetailRef" :inStorageList="notQualifiedList" />
        </LoadingSkeleton>

        <!-- <TpfAnchor :anchorList="anchorList" /> -->

        <template #footerRight>
            <a-button class="tpf-button" @click="back"> 取消 </a-button>
            <a-button type="primary" class="tpf-button" @click="onInStorage"> 入库 </a-button>
        </template>
    </TpfAddInfoLayout>
</template>

<script setup lang="tsx" name="addMaterialInStorageOrder">
    import TpfAddInfoLayout from '@/components/TpfAddInfoLayout/index.vue';
    import { ref, computed, unref, defineAsyncComponent } from 'vue';
    const InStorageDetail = defineAsyncComponent(() => import('./components/InStorageDetail.vue'));
    const InStorageInfo = defineAsyncComponent(() => import('./components/InStorageInfo.vue'));
    // const TpfAnchor = defineAsyncComponent(() => import('@/components/TpfAnchor/index.vue'));
    import { useRouteParams, useRouteBackTab } from '@/hooks';
    import { useWarehouseApi } from '@/api';
    import { message } from 'ant-design-vue';

    // const anchorList = [
    //     { href: 'InStorageInfo', title: '基本信息', visible: true },
    //     { href: 'InStorageDetail', title: '入库明细', visible: true }
    // ];
    const warehouseApi = useWarehouseApi();
    const { routeBackTab } = useRouteBackTab();
    const { params } = useRouteParams<{ params: string }>();
    const inStorageDetailRef = ref<any>(null);
    const inStorageInfoRef = ref<any>();
    const notQualifiedList = ref([]);
    const loading = ref(false);
    const refList = computed(() => [inStorageDetailRef, inStorageInfoRef]);
    const onInStorage = async () => {
        const allData = await Promise.all(unref(refList).map(item => item.value?.submit()));
        onSetInStorageApi(allData);
    };
    const onSetInStorageApi = async (allData: any[]) => {
        try {
            loading.value = true;
            const res = await warehouseApi.confirmMaterialInStore({
                ...onGetInStoreData(allData)
            });
            message.success('入库操作成功！');
            back();
        } catch (error) {
            console.log(error);
        } finally {
            loading.value = false;
        }
    };
    const back = () => {
        routeBackTab();
    };
    const onGetInStoreData = (allData: any[]) => {
        const infoData = allData.reduce((pre, cur) => ({ ...pre, ...cur }), {});
        return {
            supplierCode: infoData.formData.supplierCode,
            moveTypeCode: infoData.formData.moveTypeCode,
            dtoList: infoData.tableList.map(
                ({
                    arrivalNo,
                    projectCode,
                    materialCode,
                    batchNo,
                    arrivalNum,
                    arrivalUnit,
                    positionCode,
                    basicNum,
                    inCWList = [],
                    storeLocationCode,
                    inNum,
                    materialUnitName
                }: {
                    [key: string]: any;
                }) => ({
                    arrivalNo,
                    projectCode,
                    materialCode,
                    batchNo,
                    arrivalNum,
                    arrivalUnit:
                        inCWList.filter((v: any) => v.materialAuxiliaryUnitCode === arrivalUnit)[0]
                            ?.materialAuxiliaryUnitCode || '',
                    isQualified: 'y',
                    basicNum,
                    positionCode,
                    storeLocationCode,
                    inNum,
                    basicUnit: materialUnitName
                })
            )
        };
    };
</script>
