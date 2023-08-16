<template>
    <a-layout>
        <PageHeader v-model:collapsed="collapsed" :theme="getTheme" />

        <a-layout class="layout">
            <a-layout-sider
                :collapsedWidth="collapsedWidth"
                :width="collapsed ? 0 : 180"
                v-if="themeStore.layout === 'sidemenu'"
                v-model:collapsed="collapsed"
                :trigger="null"
                collapsible
                :theme="getTheme"
                class="layout-sider"
            >
                <AsideMenu :collapsed="collapsed" :theme="getTheme" />
            </a-layout-sider>
            <a-layout>
                <Layout.Content class="layout-content">
                    <TabsView />
                </Layout.Content>
            </a-layout>
        </a-layout>
    </a-layout>
</template>

<script lang="ts" setup>
    import { ref, computed, provide } from 'vue';
    import { Layout } from 'ant-design-vue';
    import TabsView from './TabsView/index.vue';
    import AsideMenu from './menu/index.vue';
    import PageHeader from './header/index.vue';
    import { useThemeStore } from '@/store/modules/projectConfig';

    const themeStore = useThemeStore();

    const collapsedWidth = ref(80);
    const collapsed = ref<boolean>(false);
    // 自定义侧边栏菜单收缩和展开时的宽度
    // const asiderWidth = computed(() => (collapsed.value ? 60 : 180));
    const getTheme = computed(() => (themeStore.navTheme === 'light' ? 'light' : 'dark'));
    // userStore.afterLogin();

    const changeCollapsedWidth = (val: number) => {
        collapsedWidth.value = val;
    };
    const changeCollapsed = (val: boolean) => {
        collapsed.value = val;
    };
    provide('changeCollapsedWidth', changeCollapsedWidth);
    provide('changeCollapsed', changeCollapsed);
</script>

<style>
    #components-layout-demo-top-side-2 .logo {
        float: left;
        width: 120px;
        height: 31px;
        margin: 16px 24px 16px 0;
        background: rgba(255, 255, 255, 0.3);
    }

    .ant-row-rtl #components-layout-demo-top-side-2 .logo {
        float: right;
        margin: 16px 0 16px 24px;
    }

    .ant-layout-header {
        padding: 0 !important;
        background-color: white !important;
    }

    .site-layout-background {
        background: #fff;
    }
</style>
