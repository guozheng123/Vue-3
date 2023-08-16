<template>
    <div class="tile-menu">
        <LoadingSkeleton>
            <div class="menu-body">
                <div class="menu-content scrollbarColor">
                    <Menu :menusList="menusList" />
                </div>
            </div>
        </LoadingSkeleton>
    </div>
</template>

<script setup lang="ts">
    import { unref, computed } from 'vue';
    import { storeToRefs } from 'pinia';
    import { useUserStore } from '@/store/modules/user';
    import Menu from '../components/Menu.vue';

    const userStore = useUserStore();
    const { menus } = storeToRefs(userStore);
    const menusList = computed(() => {
        return unref(menus).filter(item => !item.meta?.hidden);
    });
</script>

<style lang="less" scoped>
    .tile-menu {
        height: 100%;

        .menu-body {
            width: 100%;
            height: 100%;
            padding: 10px;
            box-sizing: border-box;

            .menu-content {
                padding: 10px;
                box-sizing: border-box;
                background: #fff;
                overflow: auto;
                height: 100%;
            }
        }
    }
</style>
