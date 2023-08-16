<template>
    <div class="menu-container" :class="{ 'is-side-menu': isSideMenu }">
        <div class="menu-mode">
            <Transition name="slide-fade" mode="out-in" appear>
                <component :is="currentMenuModeCom" :collapsed="collapsed" />
            </Transition>
        </div>
        <div class="menu-bottom" v-if="!collapsed">
            <ChangeMenuMode v-model:currenMenuTypeMode="currenMenuTypeMode" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, ref, provide } from 'vue';
    // import { useRoute } from 'vue-router';
    import { type MenuTheme } from 'ant-design-vue';
    // import { useUserStore } from '@/store/modules/user';
    import { useThemeStore } from '@/store/modules/projectConfig';
    // import { LOGIN_NAME } from '@/router/constant';
    import DropDownMode from './DropDownMode.vue';
    import TiledMode from './TiledMode.vue';
    import RightBounceMode from './RightBounceMode.vue';
    import ChangeMenuMode from './ChangeMenuMode.vue';

    type Props = { collapsed: boolean; theme: MenuTheme };
    type MenuTypeMode = 'DropDownMode' | 'TiledMode' | 'RightBounceMode';

    const allMenuModeList = { DropDownMode, TiledMode, RightBounceMode };

    defineProps<Props>();
    // const userStore = useUserStore();
    const themeStore = useThemeStore();
    // 当前路由
    // const currentRoute = useRoute();
    // const router = useRouter();
    const currenMenuTypeMode = ref<MenuTypeMode>('DropDownMode');

    // const state = reactive({
    //     openKeys: ['dashboard'] as string[],
    //     selectedKeys: [currentRoute.name] as string[]
    // });

    const currentMenuModeCom = computed(() => allMenuModeList[currenMenuTypeMode.value]);

    // const menus = computed(() => {
    //     return [...userStore.menus];
    //     // .filter(n => !n.meta?.hideInMenu)
    //     // .sort((a, b) => (a?.meta?.orderNum || 0) - (b?.meta?.orderNum || 0));
    // });
    // console.log('menus', menus.value);
    /** 侧边栏布局 */
    const isSideMenu = computed(() => themeStore.layout === 'sidemenu');

    // 根据activeMenu获取指定的menu
    // const getTargetMenuByActiveMenuName = (activeMenu: string) => {
    //     return router.getRoutes().find(n => [n.name, n.path].includes(activeMenu));
    // };

    // 获取当前打开的子菜单
    // const getOpenKeys = () => {
    //     const { meta } = currentRoute;

    //     // if (meta?.activeMenu) {
    //     //     const targetMenu = getTargetMenuByActiveMenuName(meta.activeMenu);
    //     //     return targetMenu?.meta?.namePath ?? [meta?.activeMenu];
    //     // }

    //     // return (
    //     //     meta?.hideInMenu
    //     //         ? state?.openKeys || []
    //     //         : currentRoute.meta?.namePath ?? currentRoute.matched.slice(1).map(n => n.name)
    //     // ) as string[];
    //     return ['dashboard']; // [currentRoute.name] as any[];
    // };

    // 监听菜单收缩状态
    // watch(
    //     () => props.collapsed,
    //     newVal => {
    //         // state.openKeys = newVal ? [] : getOpenKeys();
    //         state.selectedKeys = [currentRoute.name] as string[];
    //     },
    //     {
    //         immediate: true
    //     }
    // );

    // 跟随页面路由变化，切换菜单选中状态
    // watch(
    //     () => currentRoute.fullPath,
    //     () => {
    //         if (currentRoute.name === LOGIN_NAME || props.collapsed) return;
    //         //  state.openKeys = getOpenKeys();
    //         const { meta } = currentRoute;
    //         if (meta?.activeMenu) {
    //             const targetMenu = getTargetMenuByActiveMenuName(meta.activeMenu);
    //             state.selectedKeys = [targetMenu?.name ?? meta?.activeMenu] as string[];
    //         } else {
    //             state.selectedKeys = [
    //                 currentRoute.meta?.activeMenu ?? currentRoute.name
    //             ] as string[];
    //         }
    //     },
    //     {
    //         immediate: true
    //     }
    // );

    provide('currenMenuTypeMode', currenMenuTypeMode);
</script>

<style lang="less" scoped>
    .menu-container {
        opacity: 1;
        padding-top: 20px;
        box-sizing: border-box;

        .flex_column();

        .menu-mode {
            flex: 1 0 0;
            overflow-y: auto;
            scrollbar-width: none;
        }

        :deep(.ant-menu-submenu-title) {
            margin: 0;
        }

        &.is-side-menu {
            height: calc(100vh - 48px);
        }

        .menu-bottom {
            color: white;
            height: 66px;
            padding-top: 10px;
            padding-bottom: 20px;
            width: 100%;
            background: transparent;
        }

        ::-webkit-scrollbar {
            width: 0;
            height: 0;
        }
    }
</style>
