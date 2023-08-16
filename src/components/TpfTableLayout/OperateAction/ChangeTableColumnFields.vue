<template>
    <SvgIcon @click="onClick" type="icon-weizhi" cursor shadow :size="24" style="color: #1d2129" />
</template>

<script setup lang="ts" name="ChangeTableColumnFileds">
    import { defineAsyncComponent } from 'vue';

    const SvgIcon = defineAsyncComponent(() => import('@/components/SvgIcon/index.vue'));
    const emit = defineEmits<{
        (e: 'click'): void;
    }>();

    const onClick = () => {
        emit('click');
    };
</script>

<style lang="less" scoped></style>
