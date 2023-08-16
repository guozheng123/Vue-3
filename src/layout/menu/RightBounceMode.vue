<template>
    <a-menu
        ref="target"
        v-model:selected-keys="state.selectedKeys"
        :open-keys="isSideMenu ? state.openKeys : []"
        theme="dark"
        :collapsed="collapsed"
        collapsible
        mode="inline"
        class="RightBounceMode"
        @click="clickMenuItem"
    >
        <template v-for="item in showMenus" :key="item.path">
            <MenuItem
                :menu-info="item"
                :collapsed="collapsed"
                hiddenChildren
                @mouseenter="onMouseenter"
            />
        </template>
        <li
            class="menu-right"
            :style="menuRightPosition"
            :key="currentParentKey"
            v-if="currentChildren.length && !collapsed"
        >
            <RightBounceModeSub
                ref="menuRightRef"
                v-model:currentParentKey="currentParentKey"
                :currentChildren="currentChildren"
                @getOffsetHeight="getOffsetHeight"
            />
        </li>
    </a-menu>
</template>

<script setup lang="ts" name="RightBounceMode">
    import { reactive, computed, ref, type CSSProperties, unref } from 'vue';
    import { useRoute } from 'vue-router';
    import MenuItem from './MenuItem.vue';
    import { useUserStore } from '@/store/modules/user';
    import { useThemeStore } from '@/store/modules/projectConfig';
    import RightBounceModeSub from './RightBounceModeSub.vue';
    import { onClickOutside } from '@vueuse/core';
    import { storeToRefs } from 'pinia';
    const target = ref(null);
    const menuRightRef = ref<InstanceType<typeof RightBounceModeSub> | null>(null);
    const menuRightPosition = ref<CSSProperties>({});

    const positionTop = ref('0px');

    const currentParentKey = ref('');

    onClickOutside(target, () => (currentParentKey.value = ''));

    type Props = { collapsed: boolean };
    defineProps<Props>();

    const userStore = useUserStore();
    const themeStore = useThemeStore();
    // 当前路由
    const currentRoute = useRoute();
    // const router = useRouter();
    const state = reactive({
        openKeys: ['dashboard'] as string[],
        selectedKeys: [currentRoute.name] as string[]
    });
    const { menus } = storeToRefs(userStore);

    const showMenus = computed(() => {
        return unref(menus).filter(item => !item.hidden);
    });

    /** 侧边栏布局 */
    const isSideMenu = computed(() => themeStore.layout === 'sidemenu');

    // 根据activeMenu获取指定的menu
    // const getTargetMenuByActiveMenuName = (activeMenu: string) => {
    //     return router.getRoutes().find(n => [n.name, n.path].includes(activeMenu));
    // };

    const currentChildren = computed<any>(() => {
        const res = menus.value.find(item => item.name === currentParentKey.value) || ({} as any);
        return res.children || [];
    });

    // 点击菜单
    const clickMenuItem = (row: any) => {
        // currentParentKey.value = row.key;
        // positionTop.value = row.domEvent.target.offsetTop + 'px';
    };
    //鼠标移入
    const onMouseenter = async (selectMenu: any, e: any) => {
        currentParentKey.value = selectMenu.name;
        positionTop.value = e.target.offsetTop + 'px';
    };
    const getOffsetHeight = (val: string) => {
        const containHeight = (document.querySelector('.tabs-view') as HTMLElement).offsetHeight;
        if (containHeight < parseInt(val) + parseInt(positionTop.value) + 40) {
            menuRightPosition.value = {
                bottom: '66px'
            };
        } else {
            menuRightPosition.value = {
                top: positionTop.value
            };
        }
    };
</script>

<style lang="less" scoped>
    .RightBounceMode {
        :deep(.ant-menu-item).ant-menu-item-selected {
            &::after {
                background-color: transparent;
            }
        }
    }

    .menu-right {
        position: absolute;
        width: 180px;
        right: -100%;
        z-index: 999;
    }
</style>
