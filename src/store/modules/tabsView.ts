import { defineStore } from 'pinia';
import { useKeepAliveStore } from './keepAlive';
import type { RouteLocationNormalized } from 'vue-router';
import router, { defaultMenu } from '@/router';

import { LOGIN_NAME, REDIRECT_NAME, PAGE_NOT_FOUND_NAME } from '@/router/constant';
import { TABS_VIEW } from './storeName';

interface TabsViewState {
    /** 标签页 */
    tabsList: RouteLocationNormalized[];
}

// 不需要出现在标签页中的路由
export const blackList = [REDIRECT_NAME, LOGIN_NAME, PAGE_NOT_FOUND_NAME] as const;

export const useTabsViewStore = defineStore({
    id: TABS_VIEW,
    state: (): TabsViewState => ({
        tabsList: defaultMenu() as any[]
    }),
    persist: {
        enabled: true,
        strategies: [
            {
                key: TABS_VIEW,
                storage: sessionStorage
            }
        ]
    },
    getters: {
        getTabsList: state => {
            return state.tabsList.filter(item => {
                return item;
                // return !item.meta?.hideInTabs && router.hasRoute(item.name!);
            });
        },
        /** 当前activity tab */
        getCurrentTab: state => {
            const currentRoute = router.currentRoute.value!;
            return state.tabsList.find(item => {
                return item.fullPath === currentRoute.fullPath;
            });
        }
    },
    actions: {
        filterRoute(list: any[]) {
            return list.reduce((t, v) => {
                const flag = t.some((item: any) => item.fullPath === v.fullPath);
                if (flag) return t;
                return [...t, v];
            }, [] as any[]);
        },
        /** 将已关闭的标签页的组件从keep-alive中移除 */
        delCompFromClosedTabs(closedTabs: RouteLocationNormalized[]) {
            const keepAliveStore = useKeepAliveStore();
            const routes = router.getRoutes();
            const compNames = closedTabs.reduce<string[]>((prev, curr) => {
                if (curr.name && router.hasRoute(curr.name)) {
                    const componentName = routes.find(n => n.name === curr.name)?.components
                        ?.default?.name;
                    componentName && prev.push(componentName);
                }
                return prev;
            }, []);
            keepAliveStore.remove(compNames);
        },
        /** 初始化标签页 */
        initTabs(routes: any) {
            this.tabsList = this.filterRoute([...this.tabsList, ...routes]);
        },
        /** 添加标签页 */
        addTabs(route: any): boolean {
            if (blackList.includes(route.name)) return false;
            const map = new Map();
            this.tabsList.forEach(item => {
                map.set(item.name, item);
            });
            map.set(route.name, route);
            // console.log('map', [...map.values()]);
            this.tabsList = this.filterRoute([...map.values()]);
            return true;
        },
        /** 关闭左侧 */
        closeLeftTabs(route: any) {
            const index = this.tabsList.findIndex(item => item.fullPath === route.fullPath);
            let removeList = [] as any[];
            if (index > 2) {
                const leftList = this.tabsList.splice(0, index);
                removeList = leftList.splice(2);
                this.tabsList = [...leftList, ...this.tabsList];
            }
            this.delCompFromClosedTabs(removeList);
        },
        /** 关闭右侧 */
        closeRightTabs(route: any) {
            const index = this.tabsList.findIndex(item => item.fullPath === route.fullPath);
            if (index <= 1) {
                this.delCompFromClosedTabs(this.tabsList.splice(2));
            } else {
                this.delCompFromClosedTabs(this.tabsList.splice(index + 1));
            }
        },
        /** 关闭其他 */
        closeOtherTabs(route: any) {
            const current = [...defaultMenu()] as any[];
            if (route.meta.closable !== false) {
                current.push(route);
            }
            const removeList = this.tabsList.filter(item => {
                return current.some(it => it.fullPath !== item.fullPath);
            });
            this.delCompFromClosedTabs(removeList);
            this.tabsList = current;

            // const targetIndex = this.tabsList.findIndex(item => item.fullPath === route.fullPath);
            // if (targetIndex !== -1) {
            //     const current = this.tabsList.splice(targetIndex, 1);
            //     this.delCompFromClosedTabs(this.tabsList);
            //     this.tabsList = current;
            // }
        },
        /** 关闭当前页 */
        closeCurrentTab(route: any, cb?: () => void) {
            const index = this.tabsList.findIndex(item => item.fullPath === route.fullPath);
            if (cb) {
                cb();
                setTimeout(() => {
                    this.delCompFromClosedTabs(this.tabsList.splice(index, 1));
                }, 500);
                return;
            }
            const isDelCurrentTab = Object.is(this.getCurrentTab, this.tabsList[index]);
            this.delCompFromClosedTabs(this.tabsList.splice(index, 1));
            // 如果关闭的tab就是当前激活的tab，则重定向页面
            if (isDelCurrentTab) {
                const currentRoute = this.tabsList[Math.max(0, this.tabsList.length - 1)];
                router.push(currentRoute);
            }
        },
        /** 关闭全部 */
        closeAllTabs() {
            this.delCompFromClosedTabs(this.tabsList.splice(2));
        },
        // 更新tab标题
        updateTabTitle(title: string) {
            const currentRoute = router.currentRoute.value;
            const upTarget = this.tabsList.find(item => item.fullPath === currentRoute.fullPath);
            if (upTarget) {
                upTarget.meta.title = title;
            }
        }
    }
});
