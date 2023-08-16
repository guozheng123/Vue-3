<template>
    <TpfAddInfoLayout title="盘点单详情">
        <TpfCollapse title="基本信息" id="ESOPBaseInfo">
            <TpfDescriptions
                :originalDate="inventorySheet.storeCheckDto || {}"
                :renderList="productionOrderList"
            />
        </TpfCollapse>

        <!-- 物料明细 -->
        <LoadingSkeleton>
            <MaterialDetailList readOnly :list="inventorySheet.detailDtoList" />
        </LoadingSkeleton>

        <template #footerRight="{ goBack }">
            <a-button class="tpf-button" @click="goBack"> 关闭 </a-button>
        </template>
    </TpfAddInfoLayout>
</template>

<script setup lang="tsx">
    import TpfAddInfoLayout from '@/components/TpfAddInfoLayout/index.vue';
    import { ref, unref, defineAsyncComponent, onMounted } from 'vue';
    import { useWarehouseApi } from '@/api';
    import { useRouteQuery } from '@/hooks';
    import TpfDescriptions from '@/components/TpfDescriptions/index.vue';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';

    const warehouseApi = useWarehouseApi();

    //物料明细
    const MaterialDetailList = defineAsyncComponent(
        () => import('../editTakeStock/components/MaterialDetailList.vue')
    );
    const inventorySheet = ref<any>({});

    const { id } = useRouteQuery<{ id: any }>();

    const productionOrderList = [
        { label: '盘点单编号', field: 'checkNo' },
        { label: '盘点单状态', field: 'checkStatus' },
        { label: '所属组织', field: 'orgName' },
        { label: '备注', field: 'remark' }
    ];

    const getGuidebookInfo = async () => {
        if (!unref(id)) return;
        try {
            inventorySheet.value = await warehouseApi
                .queryStoreCheckById({
                    id
                })
                .then(res => res.data.object || {});
        } finally {
            // loading.value = false;
        }
    };

    onMounted(() => {
        getGuidebookInfo();
    });
</script>
