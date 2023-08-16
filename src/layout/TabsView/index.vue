<template>
    <div class="tabs-view">
        <a-tabs
            :active-key="activeKey"
            hide-add
            type="editable-card"
            class="tabs"
            @change="changePage"
            @edit="editTabItem"
        >
            <a-tab-pane
                :closable="pageItem.meta && pageItem.meta.closable !== false"
                v-for="pageItem in tabsList"
                :key="pageItem.fullPath"
            >
                <template #tab>
                    <a-dropdown :trigger="['contextmenu']">
                        <div style="display: inline-block">
                            <TpfTitleI18n
                                :title="pageItem.meta?.title"
                                v-if="/[a-z]/.test(pageItem.meta?.title)"
                            />
                            <span v-else>{{ pageItem.meta?.title }}</span>
                        </div>
                        <template #overlay>
                            <a-menu style="user-select: none">
                                <a-menu-item
                                    key="1"
                                    :disabled="activeKey !== pageItem.fullPath"
                                    @click="reloadPage"
                                >
                                    <reload-outlined />
                                    {{ t('layout.multipleTab.reload') }}
                                </a-menu-item>
                                <a-menu-item
                                    key="2"
                                    @click="removeTab(pageItem)"
                                    :disabled="pageItem.meta.closable === false"
                                >
                                    <close-outlined />
                                    {{ t('layout.multipleTab.close') }}
                                </a-menu-item>
                                <Menu.Divider />
                                <a-menu-item
                                    key="3"
                                    @click="closeLeft(pageItem)"
                                    :disabled="pageItem.meta.closable === false"
                                >
                                    <vertical-right-outlined />
                                    {{ t('layout.multipleTab.closeLeft') }}
                                </a-menu-item>
                                <a-menu-item key="4" @click="closeRight(pageItem)">
                                    <vertical-left-outlined />
                                    {{ t('layout.multipleTab.closeRight') }}
                                </a-menu-item>
                                <Menu.Divider />
                                <a-menu-item key="5" @click="closeOther(pageItem)">
                                    <column-width-outlined />
                                    {{ t('layout.multipleTab.closeOther') }}
                                </a-menu-item>
                                <a-menu-item key="6" @click="closeAll">
                                    <minus-outlined />
                                    {{ t('layout.multipleTab.closeAll') }}
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </template>
            </a-tab-pane>

            <template #rightExtra>
                <a-space :size="8" class="rightExtra">
                    <SvgIcon
                        type="icon-shuaxin"
                        @click="reloadPage"
                        :size="24"
                        cursor
                        shadow
                        style="color: #1d2129"
                    />
                    <SvgIcon
                        type="icon-guanbi1"
                        @click="closeAll"
                        :size="24"
                        cursor
                        shadow
                        style="color: #1d2129"
                    />
                </a-space>
            </template>
        </a-tabs>
        <div class="tabs-view-content">
            <LoadingSkeleton>
                <router-view v-slot="{ Component }">
                    <template v-if="Component">
                        <keep-alive>
                            <component
                                :is="Component"
                                :key="route.fullPath"
                                v-if="route.meta.doCache"
                            />
                        </keep-alive>
                        <component
                            :is="Component"
                            :key="route.fullPath"
                            v-if="!route.meta.doCache"
                        />
                    </template>
                </router-view>
            </LoadingSkeleton>
        </div>
    </div>
</template>

<script setup lang="ts" name="TabsView">
    import { computed, watch, defineAsyncComponent } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import {
        ReloadOutlined,
        CloseOutlined,
        VerticalRightOutlined,
        VerticalLeftOutlined,
        ColumnWidthOutlined,
        MinusOutlined
    } from '@ant-design/icons-vue';
    import { message, Menu } from 'ant-design-vue';
    import type { RouteLocation } from 'vue-router';
    import { useTabsViewStore, blackList } from '@/store/modules/tabsView';
    import { storeToRefs } from 'pinia';
    import { useI18n } from '@/hooks/useI18n';
    import SvgIcon from '@/components/SvgIcon/index.vue';

    const { t } = useI18n();

    const TpfTitleI18n = defineAsyncComponent(() => import('@/components/TpfTitleI18n/index.vue'));

    type RouteItem = Omit<RouteLocation, 'matched' | 'redirectedFrom'>;

    const route = useRoute();

    const router = useRouter();

    const tabsViewStore = useTabsViewStore();

    // const keepAliveStore = useKeepAliveStore();

    const activeKey = computed(() => tabsViewStore.getCurrentTab?.fullPath);

    // 标签页列表
    const { getTabsList: tabsList } = storeToRefs(tabsViewStore);

    // 缓存的路由组件列表
    // const keepAliveComponents = computed(() => keepAliveStore.list);

    // 获取简易的路由对象
    const getSimpleRoute = (route: any): RouteItem => {
        const { fullPath, hash, meta, name, params, path, query } = route;
        return { fullPath, hash, meta, name, params, path, query };
    };

    // 初始化标签页
    tabsViewStore.initTabs([getSimpleRoute(route)]);

    // tabsViewMutations.initTabs(routes)

    watch(
        () => route.fullPath,
        () => {
            // console.log(route.fullPath, 'route.fullPath');
            if (blackList.some(n => n === route.name)) return;
            tabsViewStore.addTabs(getSimpleRoute(route));
        },
        { immediate: true }
    );

    // 在页面关闭或刷新之前，保存数据
    window.addEventListener('beforeunload', () => {
        // Storage.set(TABS_ROUTES, JSON.stringify(tabsList.value));
    });

    // 目标路由是否等于当前路由
    const isCurrentRoute = (route: any) => {
        return router.currentRoute.value.matched.some(item => item.name === route.name);
    };

    // 关闭当前页面
    const removeTab = (route: any) => {
        if (tabsList.value.length === 1) {
            return message.warning('这已经是最后一页，不能再关闭了！');
        }
        // tabsViewMutations.closeCurrentTabs(route)
        tabsViewStore.closeCurrentTab(route);
    };
    // tabs 编辑（remove || add）
    const editTabItem = (targetKey: any, action: string) => {
        if (action === 'remove') {
            removeTab(tabsList.value.find(item => item.fullPath === targetKey));
        }
    };
    // 切换页面
    const changePage = (key: any) => {
        Object.is(route.fullPath, key) || router.push(key);
    };

    // 刷新页面
    const reloadPage = () => {
        router.go(0);
    };

    // 关闭左侧
    const closeLeft = (route: any) => {
        // tabsViewMutations.closeLeftTabs(route)
        tabsViewStore.closeLeftTabs(route);
        !isCurrentRoute(route) && router.replace(route.fullPath);
    };

    // 关闭右侧
    const closeRight = (route: any) => {
        // tabsViewMutations.closeRightTabs(route)
        tabsViewStore.closeRightTabs(route);
        !isCurrentRoute(route) && router.replace(route.fullPath);
    };

    // 关闭其他
    const closeOther = (route: any) => {
        // tabsViewMutations.closeOtherTabs(route)
        tabsViewStore.closeOtherTabs(route);
        !isCurrentRoute(route) && router.replace(route.fullPath);
    };

    // 关闭全部
    const closeAll = () => {
        // tabsViewMutations.closeAllTabs()
        tabsViewStore.closeAllTabs();
        router.replace('/home/index');
    };
</script>

<style lang="less" scoped>
    .tabs-view {
        border-top: 1px solid #eee;
        display: flex;
        flex-direction: column;
        height: calc(100vh - 48px);

        :deep(.tabs) {
            .ant-tabs-nav {
                --tw-bg-opacity: 1;

                background-color: rgba(255, 255, 255, var(--tw-bg-opacity));
                margin: 0;
                user-select: none;
                display: flex;
                border: 1px solid #eee;
                border-top-width: 0;
                box-sizing: border-box;

                .ant-tabs-extra-content,
                .ant-tabs-extra-content {
                    border-width: 0;
                    height: 30px;
                    line-height: 30px;
                    padding: 0 8px;
                    background-color: #fff;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                }

                .ant-tabs-extra-content {
                    border-left: 1px solid #eee;
                }

                .ant-tabs-extra-content {
                    border-right: 1px solid #eee;
                }

                .ant-tabs-tab {
                    background-color: #fff;
                    border-width: 0;
                    font-size: 13px;
                    line-height: 16px;
                    box-sizing: border-box;
                    height: 30px;
                    border-right-width: 1px;
                    .text();

                    .ant-tabs-tab-btn,
                    .ant-tabs-tab-remove {
                        transition: all 0s;
                    }

                    &.ant-tabs-tab-active {
                        background-color: var(--ant-primary-color);

                        .ant-tabs-tab-remove,
                        .ant-tabs-tab-btn {
                            color: #fff;
                        }
                    }
                }

                .ant-tabs-tab + .ant-tabs-tab {
                    margin: 0;
                    // border-width: 0;
                    border-radius: 0;
                }

                .ant-tabs-tab:hover {
                    .ant-tabs-tab-btn:focus,
                    .ant-tabs-tab-btn:active {
                        color: #fff;
                    }
                }
            }

            .ant-tabs-nav-operations {
                // display: none;
                .ant-tabs-nav-more {
                    padding: 4px 16px;
                }
            }

            .ant-tabs-tabpane {
                display: none;
            }

            .ant-tabs-tab-remove {
                display: flex;
                padding: 0;
                margin: 0;

                .anticon-close {
                    padding-left: 6px;
                }
            }
        }

        .tabs-view-content {
            /* height: calc(100vh - #{$header-height}); */
            flex: 1 0 0;
            box-sizing: border-box;
            // padding: 20px 20px 12px;
            overflow-x: hidden;
            overflow-y: auto;
            background-color: #f7f8fa;
        }
        .rightExtra {
            :deep(.ant-space-item) {
                display: flex;
                align-items: center;
            }
        }
    }
</style>
