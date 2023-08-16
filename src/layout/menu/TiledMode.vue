<template>
    <a-menu
        v-model:selected-keys="state.selectedKeys"
        :open-keys="isSideMenu ? state.openKeys : []"
        theme="dark"
        :collapsed="props.collapsed"
        collapsible
        :mode="menuLayout"
        class="tpf-menu TiledMode"
        @click="clickMenuItem"
    >
        <template v-for="item in menus" :key="item.name">
            <MenuItem :menu-info="item" :collapsed="props.collapsed" hiddenChildren />
        </template>
    </a-menu>
</template>

<script setup lang="ts" name="TiledMode">
    import { reactive, computed, ref, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { MenuMode } from 'ant-design-vue';
    import MenuItem from './MenuItem.vue';
    import { useUserStore } from '@/store/modules/user';
    import { useThemeStore } from '@/store/modules/projectConfig';
    import { storeToRefs } from 'pinia';
    type Prop = { collapsed: boolean };

    const props = defineProps<Prop>();
    const userStore = useUserStore();
    const themeStore = useThemeStore();
    // 当前路由
    const currentRoute = useRoute();
    const router = useRouter();
    const state = reactive({
        openKeys: [] as string[],
        selectedKeys: [currentRoute.name] as string[]
    });
    const menuLayout = ref<MenuMode>('inline');

    const { menus } = storeToRefs(userStore);

    // const menus = computed(() => {
    //     return [...userStore.menus];
    //     // return .map;
    //     // .filter(n => !n.meta?.hideInMenu)
    //     // .sort((a, b) => (a?.meta?.orderNum || 0) - (b?.meta?.orderNum || 0));
    // });
    /** 侧边栏布局 */
    const isSideMenu = computed(() => themeStore.layout === 'sidemenu');

    // 根据activeMenu获取指定的menu
    // const getTargetMenuByActiveMenuName = (activeMenu: string) => {
    //     return router.getRoutes().find(n => [n.name, n.path].includes(activeMenu));
    // };

    // 获取当前打开的子菜单
    // const getOpenKeys = () => {
    //     const { meta } = currentRoute;
    //     return [];

    // if (meta?.activeMenu) {
    //     const targetMenu = getTargetMenuByActiveMenuName(meta.activeMenu);
    //     return targetMenu?.meta?.namePath ?? [meta?.activeMenu];
    // }

    // return (
    //     meta?.hideInMenu
    //         ? state?.openKeys || []
    //         : currentRoute.meta?.namePath ?? currentRoute.matched.slice(1).map(n => n.name)
    // ) as string[];
    //  return ['dashboard']; // [currentRoute.name] as any[];
    // };

    // 监听菜单收缩状态
    // watch(
    //     () => props.collapsed,
    //     newVal => {
    //         state.openKeys = newVal ? [] : getOpenKeys();
    //         state.selectedKeys = [currentRoute.name] as string[];
    //     },
    //     {
    //         immediate: true
    //     }
    // );

    // 点击菜单
    const clickMenuItem = ({ key }: any) => {
        console.log('key: ', key);

        // if (key === currentRoute.name) return;
        // if (/http(s)?:/.test(key)) {
        //     window.open(key);
        // } else {
        //     router.push({ name: key });
        // }
    };
    onMounted(() => {
        if (currentRoute.path !== '/home/tileMenu') {
            router.push('/home/tileMenu');
        }
    });
</script>

<style lang="less">
    .tpf-menu {
        height: 100%;

        &.TiledMode {
            &.ant-menu {
                .ant-menu-item-selected {
                    &::after {
                        background-color: transparent;
                    }
                }
            }
        }
    }
</style>
