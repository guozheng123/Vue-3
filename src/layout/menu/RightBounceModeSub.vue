<template>
    <a-menu
        ref="menuRef"
        v-model:selected-keys="state.selectedKeys"
        :open-keys="isSideMenu ? openKeys : []"
        theme="dark"
        :collapsed="false"
        collapsible
        :mode="menuLayout"
        class="RightBounceModeSub"
        @click="clickMenuItem"
    >
        <template v-for="item in currentChildren" :key="item.name">
            <MenuItem :menu-info="item" :collapsed="false" hiddenIcon />
        </template>
    </a-menu>
</template>

<script setup lang="ts" name="RightBounceModeSub">
    import { reactive, computed, ref, watchEffect } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { Menu, MenuMode } from 'ant-design-vue';
    import MenuItem from './MenuItem.vue';
    import { useThemeStore } from '@/store/modules/projectConfig';
    // import { isArray } from 'lodash-es';

    type Prop = {
        currentChildren: any[];
        currentParentKey?: string;
    };

    const props = defineProps<Prop>();

    const emit = defineEmits<{
        (e: 'update:currentParentKey', val: string): void;
        (e: 'getOffsetHeight', val: string): void;
    }>();
    const menuRef = ref<InstanceType<typeof Menu> | null>(null);
    const themeStore = useThemeStore();
    // 当前路由
    const currentRoute = useRoute();
    const router = useRouter();
    const state = reactive({
        openKeys: ['userManageme'] as string[],
        selectedKeys: [currentRoute.name] as string[]
    });

    const openKeys = computed(() => {
        return props.currentChildren.map(item => item.name);
    });
    const menuLayout = ref<MenuMode>('inline');

    /** 侧边栏布局 */
    const isSideMenu = computed(() => themeStore.layout === 'sidemenu');

    // 点击菜单
    const clickMenuItem = ({ key }: any) => {
        console.log('key: ', key);
        emit('update:currentParentKey', '');
        if (key === currentRoute.name) return;
        if (/http(s)?:/.test(key)) {
            window.open(key);
        } else {
            router.push({ name: key });
        }
    };

    const getOffsetHeight = computed(() => menuRef.value?.$el.offsetHeight);
    watchEffect(() => {
        if (getOffsetHeight.value) {
            emit('getOffsetHeight', getOffsetHeight.value);
        }
    });
</script>

<style lang="less" scoped>
    .RightBounceModeSub {
        &.ant-menu {
            :deep(.ant-menu-item).ant-menu-item-selected {
                &::after {
                    background-color: var(--ant-primary-color);
                }
            }

            .ant-menu-item {
                background-color: #323960 !important;
            }
        }
    }
</style>

<style lang="less">
    .RightBounceModeSub {
        .ant-menu-inline.ant-menu-sub {
            background-color: #192148 !important;
        }

        &.ant-menu {
            .ant-menu-item {
                background-color: transparent;
            }

            .ant-menu-submenu-title,
            .ant-menu-submenu-title:hover {
                background-color: #3b436d;
            }
        }
    }
</style>
