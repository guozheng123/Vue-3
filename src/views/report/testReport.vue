<template>
    <div id="reportLayout" ref="appRef"></div>
</template>

<script lang="ts" setup>
    import { onBeforeUnmount, onMounted } from 'vue';
    import useDraw from '@/hooks/useDraw';

    // * 适配处理
    const { appRef, calcRate, windowDraw, unWindowDraw } = useDraw();

    onMounted(() => {
        // todo 屏幕适应
        windowDraw();
        calcRate();
    });

    onBeforeUnmount(() => {
        unWindowDraw();
    });
</script>

<style lang="less" scoped>
    #reportLayout {
        width: 1920px;
        height: 1080px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transform-origin: left top;
        background: #eee;
    }
</style>
