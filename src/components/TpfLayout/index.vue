<template>
    <a-layout class="tpf-layout">
        <a-layout-header class="tpf-layout-header" v-if="$slots.header">
            <slot name="header"></slot>
        </a-layout-header>
        <a-layout-content class="tpf-layout-content" v-if="$slots.content">
            <slot name="content"></slot>
        </a-layout-content>
        <slot></slot>
    </a-layout>
</template>

<script setup lang="ts" name="TpfLayout">
    import { computed, useSlots } from 'vue';
    type Props = {
        contentTopmargin?: string;
    };
    const props = withDefaults(defineProps<Props>(), {
        contentTopmargin: '10px'
    });

    const slot = useSlots();

    const gap = computed(() => {
        if (slot.header) {
            return props.contentTopmargin;
        }
        return 0;
    });
</script>

<style lang="less" scoped>
    .tpf-layout {
        background-color: transparent;
        height: 100%;
        padding: 10px 12px 10px 10px;
        flex: 1 0 0;

        .tpf-layout-header {
            height: unset;
            line-height: unset;
        }

        .tpf-layout-content {
            margin-top: v-bind('gap');
            background-color: #fff;
        }
    }
</style>
