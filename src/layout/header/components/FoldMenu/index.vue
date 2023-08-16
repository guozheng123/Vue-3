<template>
    <a-tooltip placement="bottom" color="black" title="缩进">
        <span class="menu-fold" @click="changeCollapsed(!collapsed)">
            <SvgIcon :type="collapsed ? 'icon-zhankai1' : 'icon-suojin'" :size="20" />
            <!-- <component :is="collapsed ? MenuUnfoldOutlined : MenuFoldOutlined" /> -->
        </span>
    </a-tooltip>
</template>

<script setup lang="ts" name="foldMenu">
    import SvgIcon from '@/components/SvgIcon/index.vue';

    // import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue';
    import { inject } from 'vue';
    type Props = {
        collapsed: boolean;
    };
    defineProps<Props>();

    const changeCollapsed = inject<(e: boolean) => void>('changeCollapsed')!;
</script>

<style lang="less" scoped></style>
