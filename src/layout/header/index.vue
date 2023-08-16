<template>
    <a-layout-header :style="headerStyle" class="layout-header">
        <a-space :size="16">
            <Logo />
            <FoldMenu :collapsed="collapsed" />
            <UserComponents />
        </a-space>
        <a-space :size="10">
            <ErWeiCode />
            <FullScreen />
            <Upload />
            <Message />
            <OperateMenu />
            <userList />
            <div></div>
        </a-space>
    </a-layout-header>
</template>

<script lang="tsx" setup>
    import { computed, type CSSProperties } from 'vue';
    // import { RouteRecordRaw } from 'vue-router';
    import {
        FullScreen,
        Upload,
        Message,
        userList,
        UserComponents,
        ErWeiCode,
        OperateMenu,
        FoldMenu
    } from './components/index';
    import { useThemeStore } from '@/store/modules/projectConfig';
    import Logo from './components/Logo/index.vue';

    type Props = {
        collapsed: boolean;
    };

    defineProps<Props>();
    // const emit = defineEmits(['update:collapsed']);

    const themeStore = useThemeStore();

    const headerStyle = computed<CSSProperties>(() => {
        const { navTheme, layout } = themeStore;
        const isDark = navTheme === 'dark' && layout === 'topmenu';
        return {
            backgroundColor: navTheme === 'realDark' || isDark ? '' : 'rgba(255, 255, 255, 0.85)',
            color: isDark ? 'rgba(255, 255, 255, 0.85)' : ''
        };
    });

    // const findLastChild = (route?: RouteRecordRaw): any => {
    //     if (typeof route?.redirect === 'object') {
    //         const redirectValues = Object.values(route!.redirect);
    //         if (route?.children?.length) {
    //             const target = route.children.find(n =>
    //                 redirectValues.some(m => [n.name, n.path, n.meta?.fullPath].some(v => v === m))
    //             );
    //             return findLastChild(target);
    //         }
    //         return redirectValues.find(n => typeof n === 'string');
    //     }
    //     if (typeof route?.redirect === 'string') {
    //         if (route?.children?.length) {
    //             const target = route.children.find(n =>
    //                 [n.name, n.path, n.meta?.fullPath].some(m => m === route?.redirect)
    //             );
    //             return findLastChild(target);
    //         }
    //         return route?.redirect;
    //     }
    //     return route;
    // };
</script>

<style lang="less" scoped>
    @header-height: 48px;

    .menu-fold:hover {
        background-color: #f2f3f5;
        border-radius: 4px;
    }

    :deep(.ant-select-selector) {
        position: relative;
        background-color: #fff;
        border: 0 !important;
        // border-radius: 0.10417vw;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    }

    .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
        color: rgba(0, 0, 0, 0.85);
        font-weight: 600;
        background-color: #a2458f !important;
    }

    .ant-layout-header {
        padding: 0 !important;
        background-color: white !important;
        line-height: 48px;

        :deep(.icon) {
            vertical-align: -0.5em;
        }
    }

    .layout-header {
        position: sticky;
        top: 0;
        z-index: 10;
        display: flex;
        height: @header-height;
        padding: 0 20px;
        justify-content: space-between;
        align-items: center;
        background-color: white !important;

        * {
            cursor: pointer;
        }
    }

    :deep(.ant-popover-message-title) {
        padding: 0 !important;
        /* padding-left: 22px; */
    }
</style>
