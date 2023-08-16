<template>
    <TpfAddInfoLayout title="入库详情" class="materialInStorageOrderEdit">
        <!-- 基本信息 -->
        <LoadingSkeleton>
            <InStorageInfo :inStorageFromInfo="inStorageFromInfo" />
        </LoadingSkeleton>

        <!-- 入库明细 -->
        <LoadingSkeleton>
            <InStorageDetail :inStorageList="inStorageFromInfo?.detailDtoList" />
        </LoadingSkeleton>

        <TpfAnchor :anchorList="anchorList" />

        <template #footerRight>
            <a-button class="tpf-button" @click="back"> 关闭 </a-button>
        </template>
    </TpfAddInfoLayout>
</template>

<script setup lang="tsx" name="materialInStorageOrderEdit">
    import TpfAddInfoLayout from '@/components/TpfAddInfoLayout/index.vue';
    import { ref, computed, unref, defineAsyncComponent, onMounted } from 'vue';
    import { useRouteQuery, useRouteBackTab } from '@/hooks';
    import { useWarehouseApi } from '@/api';
    const InStorageDetail = defineAsyncComponent(() => import('./components/InStorageDetail.vue'));
    const InStorageInfo = defineAsyncComponent(() => import('./components/InStorageInfo.vue'));
    const TpfAnchor = defineAsyncComponent(() => import('@/components/TpfAnchor/index.vue'));
    const anchorList = [
        { href: 'InStorageInfo', title: '基本信息', visible: true },
        { href: 'InStorageDetail', title: '入库明细', visible: true }
    ];
    const { id } = useRouteQuery<{ id: string; type: string }>();
    const { routeBackTab } = useRouteBackTab();
    const warehouseApi = useWarehouseApi();
    const inStorageFromInfo = ref<any>();
    const back = () => {
        routeBackTab();
    };
    const onGetDetailData = async () => {
        try {
            const res = await warehouseApi.queryMaterialInStoreById({
                id
            });
            inStorageFromInfo.value = res.data.object;
        } catch (error) {
            console.log(error);
        } finally {
        }
    };
    onMounted(() => {
        onGetDetailData();
    });
</script>
