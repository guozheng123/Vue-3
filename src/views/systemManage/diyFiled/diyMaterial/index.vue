<template>
    <DIYFiled :pageCode="pageCode" :deleteAction="deleteAction" />
</template>

<script setup lang="ts">
    import DIYFiled from '../index.vue';
    import { PageCodeEnum } from '@/config';
    import { useMaterialApi } from '@/api';

    const materialApi = useMaterialApi();

    const pageCode = PageCodeEnum.materialList;

    const deleteAction = (ids: number[]) => {
        return materialApi.deleteMaterialDiyFieldByIds({ ids });
    };
</script>
