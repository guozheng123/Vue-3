import { useNetworkApi, proxyEnum } from '@/api/useNetworkApi';
import { defineStore } from 'pinia';
import { RouteRecordRaw } from 'vue-router';
import { store } from '@/store';
import { USER_INFO_KEY } from './storeName';
import router, { resetRouter } from '@/router';
import MainLayout from '@/layout/MainLayout.vue';
import http from '@/utils/http';
import { shallowRef, unref } from 'vue';
import { ResTpfObject } from '@/types/axios';
import { useSysParameterApi, ResSysParameterByTenantId, useUserApi } from '@/api';
import routerJson from './router.json';
import { useTabsViewStore } from './tabsView';
import { findListItem, getAppRoot } from '@/utils';
import { user1, user2, user3, user4 } from './mockRouter';

import { useThemeStore } from '@/store/modules/projectConfig';

import userInfoList from './mock.json';

const modules = import.meta.glob('@/views/**/*.vue');
interface UserState {
    getMenusStatus: boolean;
    loginInfo: {
        tokenId: string; // token
        tenantId: string; //租户ID
        userId: string; // 用户ID
        tenantIdList: string[];
    };
    avatar: string;
    // like [ 'sys:user:add', 'sys:user:update' ]
    perms: string[];
    menus: RouteRecordRaw[];
    adminMenus: RouteRecordRaw[];
    userInfo: { tpfUser: { [k: string]: any } }; // Partial<API.AdminUserInfo>;
    sysParameterList: ResSysParameterByTenantId[];
}

export const useUserStore = defineStore({
    id: USER_INFO_KEY,
    persist: {
        enabled: true,
        strategies: [
            {
                key: USER_INFO_KEY,
                storage: sessionStorage,
                paths: ['loginInfo', 'userInfo']
            }
        ]
    },
    state: (): UserState => ({
        getMenusStatus: false,
        loginInfo: {
            tokenId: '',
            tenantId: '',
            userId: '',
            tenantIdList: []
        },
        avatar: '',
        perms: [],
        menus: [] as RouteRecordRaw[],
        adminMenus: [] as RouteRecordRaw[],
        userInfo: {
            tpfUser: {}
        },
        sysParameterList: []
    }),
    getters: {
        getTokenId(): string {
            return this.loginInfo.tokenId;
        },
        getAvatar(): string {
            return this.avatar;
        },
        getPerms(): string[] {
            return this.perms;
        },
        decimalPlaces() {
            // 系统内保留小数的精度
            const res = findListItem(this.sysParameterList, 'parameterCode', 'decimalPlaces');
            return Number(res.defaultValue || 0);
        }
    },
    actions: {
        /**
         * tokenCode 换取 tokenId
         */
        async mockGetTokenAction(code: any) {
            try {
                this.setLoginInfo(userInfoList[code].loginInfo);
                // // 获取用户信息
                await this.mockGetUserInfo(code);
                router.replace('/home/index');
            } catch (error) {
                // this.logout();
            }
        },

        async mockGetUserInfo(code: any) {
            this.userInfo = userInfoList[code].userInfo;
        },

        /**
         * tokenCode 换取 tokenId
         */
        async getTokenAction(code: string) {
            try {
                //获取token
                const res = await http.get<ResTpfObject<UserState['loginInfo']>>(
                    `${useNetworkApi(proxyEnum.tmgc2Org)}/auth/getTokenByCode?code=${code}`
                );

                this.setLoginInfo(res.data.object);

                // 获取用户信息
                await this.getUserInfo();

                const returnUrl = router.currentRoute.value.query.returnUrl?.toString();
                if (returnUrl) {
                    router.replace(returnUrl);
                } else {
                    router.replace('/home/index');
                }
            } catch (error) {
                // this.logout();
            }
        },

        async getSysParameterByTenantId() {
            const sysParameterApi = useSysParameterApi();
            try {
                const res = await sysParameterApi.getSysParameterByTenantId();
                this.sysParameterList = res.data.object.parameterValues;
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * cookie 换取 tokenCode
         */
        async getTokenCodeAction() {
            const appRoot = getAppRoot();
            console.log('appRoot: ', appRoot);

            const currentHref = window.location.origin + '/login';
            const locationHref =
                appRoot +
                `/tmgc2-org/auth/doLoginByUid?returnUrl=` +
                encodeURIComponent(currentHref);

            window.location.href = locationHref;
        },

        async getUserInfo() {
            const userApi = useUserApi();
            const { userId } = this.loginInfo;
            const res = await userApi.getLoginUserById({ userId });
            this.userInfo = res.data.object;
        },

        /** 登录成功保存loginInfo */
        setLoginInfo(loginInfo: UserState['loginInfo']) {
            this.loginInfo = loginInfo;
        } /** 登录 */,

        async mockLogin(code: any) {
            this.mockGetTokenAction(code);
        },

        /** 登录 */
        async login() {
            const { VITE_APP_USE_GATEWAY = '' } = import.meta.env;
            if (VITE_APP_USE_GATEWAY === 'true') {
                router.replace('/home/index');
                return;
            }
            const code = router.currentRoute.value.query.code as string;

            if (code) {
                await this.getTokenAction(code);
            } else {
                await this.getTokenCodeAction();
            }
        },
        async getAdminMenus() {
            // try {
            //     this.menus = [];
            //     this.getMenusStatus = false;
            //     useTabsViewStore().tabsList = [];
            //     const res = (await import('@/views/admin/router.json'))['default'];
            //     this.adminMenus = [...filterMenus(res)];
            //     this.adminMenus.forEach(route => router.addRoute(route));
            //     this.menus = this.adminMenus[0].children as RouteRecordRaw[];
            //     console.log('admin:----菜单 ', res);
            //     return this.adminMenus;
            // } catch (error) {
            //     console.log('getAdminMenus: ', error);
            // }
        },
        /** 登录成功之后, 获取用户信息以及生成权限路由 */
        async afterLogin() {
            const { VITE_APP_USE_GATEWAY = '', VITE_APP_API_ROOT = '' } = import.meta.env;
            let data: any[] = [];
            if (VITE_APP_USE_GATEWAY === 'true') {
                data = routerJson;
            } else {
                if (VITE_APP_API_ROOT.startsWith('https:') || location.href.startsWith('https:')) {
                    const res = await http.get(
                        `${useNetworkApi(proxyEnum.tmgc2Mgt)}/menu/queryRouters`
                    );
                    data = res.data.list;
                    console.log('data:----菜单 ', data);
                    // debugger;
                } else {
                    data = [];
                }
            }

            this.menus = [...filterMenus(data)];
            this.menus.forEach(route => router.addRoute(route));
            this.getMenusStatus = true;
            return this.menus;
        },

        async mockAfterLogin() {
            const themeStore = useThemeStore();

            const userInfoList = [
                { userId: 24401489362945, list: user1, color: '#e42807' },
                { userId: 24401449517057, list: user2, color: '#cb7d25' },
                { userId: 24401405476865, list: user3, color: '#17d97e' },
                { userId: 24401359339521, list: user4, color: '#2309ec' }
            ];
            let data: any[] = [];
            const getUserInfo = () => {
                return (userInfoList.find(item => item.userId === this.userInfo.tpfUser.userId) ||
                    {}) as any;
            };
            data = getUserInfo().list || user1;
            themeStore.fillColor({ primaryColor: getUserInfo().color || '#e42807' });
            this.menus = [...filterMenus(data)];
            this.menus.forEach(route => router.addRoute(route));
            this.getMenusStatus = true;
            return this.menus;
        },

        /** 登出 */
        async logout(isLogout = true) {
            const { VITE_APP_UCENTER_URL = '' } = import.meta.env;

            useTabsViewStore().$reset();

            resetRouter();

            if (isLogout) {
                this.$reset();
                //回跳地址
                const currentHref = window.location.href;

                const locationHref =
                    VITE_APP_UCENTER_URL +
                    '/interface/logout.html?returnUrl=' +
                    encodeURIComponent(currentHref);
                window.location.href = locationHref;
            }
        }
    }
});

// 在组件setup函数外使用
export function useUserStoreWithOut() {
    return useUserStore(store);
}
function filterMenus(list: any, level = 1) {
    list = list.map((e: any) => {
        if (e.children) {
            filterMenus(e.children, level + 1);
            if (level === 1) {
                //一级路由
                e.component = shallowRef(unref(MainLayout));
            } else {
                // 二级以及二级以上
                // e.component = shallowRef({ render: () => h(RouterView) });
                e.component = ''; //shallowRef(unref(KeepAliveEmptyRouter));
            }
            e.redirect = e.children[0].path;
        } else {
            if (typeof e.component === 'string') {
                e.component = modules[`/src/views${e.component}/index.vue`];
            }
        }
        return e;
    });
    return list;
}
