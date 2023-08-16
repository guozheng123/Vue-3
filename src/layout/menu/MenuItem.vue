<template>
    <!-- 目录 -->
    <template v-if="isShowSubMenu && !hiddenChildren">
        <Menu.SubMenu :key="props.menuInfo?.name" v-bind="$attrs">
            <template #title>
                <a-space class="menu-space">
                    <template v-if="props.menuInfo?.meta?.icon">
                        <SvgIcon
                            v-if="!hiddenIcon"
                            :type="props.menuInfo?.meta?.icon || ''"
                            :size="collapsed ? 24 : 24"
                        />
                    </template>

                    <template v-if="/[a-z]/.test(props.menuInfo?.meta?.title || '')">
                        <TpfTitleI18n v-if="!collapsed" :title="props.menuInfo?.meta?.title" />
                    </template>
                    <template v-else>
                        <span v-if="!collapsed">{{ props.menuInfo?.meta?.title }}</span>
                    </template>
                </a-space>
            </template>
            <template v-for="item in menuChildren" :key="item.name || item.fullPath">
                <!-- 递归生成菜单 -->
                <MyMenuItem :menu-info="item" hiddenIcon />
            </template>
        </Menu.SubMenu>
    </template>

    <!-- 菜单 -->
    <template v-else>
        <Menu.Item
            :key="props.menuInfo?.name"
            @mouseenter="onMouseenter(props.menuInfo, $event)"
            v-if="!props.menuInfo?.meta?.hidden"
        >
            <a-space class="menu-space">
                <SvgIcon
                    v-if="hiddenChildren"
                    :type="props.menuInfo?.meta?.icon || ''"
                    :size="collapsed ? 24 : 24"
                />

                <template v-if="/[a-z]/.test(props.menuInfo?.meta?.title || '')">
                    <TpfTitleI18n :title="props.menuInfo?.meta?.title" v-if="!collapsed" />
                </template>

                <template v-else>
                    <span v-if="!collapsed">{{ props.menuInfo?.meta?.title }} </span>
                </template>
            </a-space>
        </Menu.Item>
    </template>
</template>

<script setup lang="ts" name="MyMenuItem">
    import { computed, defineAsyncComponent } from 'vue';
    import { Menu } from 'ant-design-vue';
    import type { RouteRecordRaw } from 'vue-router';

    import SvgIcon from '@/components/SvgIcon/index.vue';
    const TpfTitleI18n = defineAsyncComponent(() => import('@/components/TpfTitleI18n/index.vue'));

    type Prop = {
        collapsed?: boolean;
        menuInfo: RouteRecordRaw;
        hiddenChildren?: boolean; // 隐藏 子菜单
        hiddenIcon?: boolean; // 隐藏icon
    };

    const props = defineProps<Prop>();
    const emit = defineEmits<{
        (e: 'mouseenter', val: any, event: any): void;
    }>();

    const menuChildren = computed(() => {
        // console.log([...(props.menuInfo?.children || [])]);

        return [...(props.menuInfo?.children || [])];
        // .filter(n => !n.meta?.hideInMenu)
        // .sort((a, b) => (a?.meta?.orderNum || 0) - (b?.meta?.orderNum || 0));
    });

    const isShowSubMenu = computed(() => {
        const { menuInfo } = props;
        return (
            menuInfo?.meta?.type === 0 ||
            (!Object.is(menuInfo?.meta?.hideChildrenInMenu, true) && menuInfo?.children?.length)
        );
    });

    const onMouseenter = (row: any, $event: any) => {
        emit('mouseenter', row, $event);
    };
</script>

<style lang="less">
    .menu-space {
        &.ant-space {
            .ant-space-item {
                display: flex;
            }
        }
    }
</style>
