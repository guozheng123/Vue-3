<template>
    <DIYFiled :pageCode="pageCode" :deleteAction="deleteAction" />
</template>

<script setup lang="ts">
    import DIYFiled from '../index.vue';
    import { PageCodeEnum } from '@/config';
    import { useProductionOrderApi } from '@/api';

    const productionOrderApi = useProductionOrderApi();
    const pageCode = PageCodeEnum.productionOrder;

    const deleteAction = (ids: number[]) => {
        return productionOrderApi.deleteProductionOrderDiyFieldByIds({ ids });
    };
</script>
