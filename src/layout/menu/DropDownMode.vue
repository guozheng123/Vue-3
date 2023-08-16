<template>
    <a-menu
        v-model:selected-keys="state.selectedKeys"
        :open-keys="isSideMenu ? state.openKeys : []"
        theme="dark"
        :collapsed="props.collapsed"
        collapsible
        :mode="menuLayout"
        class="DropDownMenu"
        @click="clickMenuItem"
    >
        <template v-for="item in showMenus" :key="item.path">
            <MenuItem :menu-info="item" :collapsed="props.collapsed" />
        </template>
    </a-menu>
</template>

<script setup lang="ts" name="DropDownMode">
    import { reactive, computed, unref, ref, watchEffect } from 'vue';
    import { useRoute, useRouter, RouteRecordRaw } from 'vue-router';
    import { MenuMode } from 'ant-design-vue';
    import MenuItem from './MenuItem.vue';
    import { useUserStore } from '@/store/modules/user';
    import { useThemeStore } from '@/store/modules/projectConfig';
    import { storeToRefs } from 'pinia';
    import { isArray } from 'lodash-es';

    type Props = {
        collapsed?: boolean;
    };

    const props = defineProps<Props>();
    const userStore = useUserStore();

    const { menus } = storeToRefs(userStore);

    const showMenus = computed(() => {
        return unref(menus).filter(item => !item.meta?.hidden);
    });

    const themeStore = useThemeStore();

    const menuLayout = ref<MenuMode>('inline');

    // 当前路由
    const currentRoute = useRoute();

    const router = useRouter();

    const state = reactive({
        openKeys: [] as string[],
        selectedKeys: [currentRoute.name] as string[]
    });

    /** 侧边栏布局 */
    const isSideMenu = computed(() => themeStore.layout === 'sidemenu');

    // 根据activeMenu获取指定的menu
    // const getTargetMenuByActiveMenuName = (activeMenu: string) => {
    //     return router.getRoutes().find(n => [n.name, n.path].includes(activeMenu));
    // };

    // 获取当前打开的子菜单
    const getOpenKeys = (currentName: string, routerList?: RouteRecordRaw[]) => {
        routerList = routerList || router.getRoutes();
        const openList = [] as string[];
        routerList.forEach(item => {
            if (item.name === currentName) {
                openList.push(currentName);
            }
            if (isArray(item.children) && item.children.length) {
                const childrenOpenList = getOpenKeys(currentName, item.children);
                if (childrenOpenList.length) {
                    childrenOpenList.push(item.name as string);
                }
                openList.push(...childrenOpenList);
            }
        });
        return [...new Set(openList)];
    };

    // // 监听菜单收缩状态
    // watch(
    //     () => props.collapsed,
    //     newVal => {
    //         state.openKeys = newVal ? [] : getOpenKeys(currentRoute.name || '');
    //         state.selectedKeys = [currentRoute.name] as string[];
    //     },
    //     {
    //         immediate: true
    //     }
    // );
    watchEffect(() => {
        state.openKeys = props.collapsed ? [] : getOpenKeys((currentRoute.name || '') as string);
        state.selectedKeys = [currentRoute.name] as string[];
    });

    // 点击菜单
    const clickMenuItem = ({ key }: any) => {
        if (key === currentRoute.name) return;
        if (/http(s)?:/.test(key)) {
            window.open(key);
        } else {
            router.push({ name: key });
        }
    };
</script>

<style lang="less">
    .DropDownMenu {
        .ant-menu-submenu-title {
            background-color: #192148;
        }
    }
</style>
