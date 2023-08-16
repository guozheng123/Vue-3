import { getUserInfo } from '@/utils';
import { isNavigationFailure } from 'vue-router';
import NProgress from 'nprogress';
import type { Router, RouteLocationNormalized } from 'vue-router';
import { REDIRECT_NAME } from './constant';
import type { WhitePathList } from './constant';
import { useUserStore } from '@/store/modules/user';
import { useCancelAxiosStore } from '@/store/modules/useCancelAxiosStore';
import { useKeepAliveStore } from '@/store/modules/keepAlive';
import { to as _to } from '@/utils/awaitTo';
import { storeToRefs } from 'pinia';
import { unref } from 'vue';
import { closeGlobalLoading } from '@/hooks';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

export function createRouterGuards(router: Router, whitePathList: WhitePathList) {
    router.beforeEach(async (to, _, next) => {
        NProgress.start(); // start progress bar
        const userStore = useUserStore();
        const cancelAxiosStore = useCancelAxiosStore();
        // 取消所有的请求
        cancelAxiosStore.clearPending();
        // const { loginInfo } = storeToRefs(userStore);
        const userInfo = getUserInfo();
        const userRouter = userStore.menus;
        let tokenId = userInfo?.loginInfo?.tokenId;
        const { VITE_APP_USE_GATEWAY = '' } = import.meta.env;
        if (VITE_APP_USE_GATEWAY === 'true') {
            tokenId = '123';
        }
        console.log('to.path: ', to, userInfo);
        if (
            [24401489362945, 24401449517057, 24401405476865, 24401359339521].includes(
                userInfo.userInfo?.tpfUser?.userId
            )
        ) {
            userStore.mockAfterLogin();
            next();
            return;
        }

        if (tokenId) {
            if (userStore.sysParameterList.length === 0 && !userStore.getMenusStatus) {
                await userStore.getSysParameterByTenantId();
            }
            if (to.fullPath.includes('/admin')) {
                // TODO 进入的是中台

                if (userStore.adminMenus.length) {
                    next();
                    return;
                } else {
                    await userStore.getAdminMenus();
                    return next({ ...to, replace: true });
                }
            } else if (!userRouter.length) {
                if (userStore.getMenusStatus) {
                    //已经请求过菜单了
                    // TODO 当前用户没有任何菜单权限---默认展示首页
                    return next({ path: '/home/index' });
                }
                //如果当前没有路由，及刚刚初始化，则去请求路由地址
                // 从后台获取菜单
                const [err] = await _to(userStore.afterLogin());
                if (err) {
                    //TODO 获取菜单失败 或者渲染菜单出错了
                    const { message } = await import('ant-design-vue');
                    await message.error('渲染菜单报错了-请联系开发', 3, () => {
                        userStore.logout();
                    });
                    return;
                    // userStore.logout();
                    // return next({ path: '/login', replace: true });
                }
                // TODO 获取菜单后重新进入
                console.log('重新进入');
                return next({ ...to, replace: true });
            } else {
                if (to.path === '/login') {
                    next({ path: '/home/index', replace: true });
                    return;
                }
                if (to.path === '/home/index') {
                    next();
                    return;
                }

                // TODO 有菜单
                const hasRoute = router.hasRoute(to.name!);
                console.log('hasRoute: ', hasRoute);

                //TODO  没有要进入的菜单- 去404
                if (!hasRoute) {
                    // return next();
                    return next({ path: '/notFound', replace: true });
                } else {
                    if (to.meta.doCache && !to.query._t) {
                        next({
                            ...to,
                            query: {
                                ...(to.query || {}),
                                _t: Date.now()
                            }
                            // replace: true
                        });
                    } else {
                        next();
                    }
                }
            }
        } else {
            // router.addRoute(loginRoute);
            // 没有token
            console.log('to.path: ', to.path);
            if (whitePathList.includes(to.path as never)) {
                //白名单地址直接进
                next();
            } else {
                // 不是白名单地址需要去登录
                // TODO
                next({
                    path: '/login',
                    replace: true,
                    query: {
                        returnUrl: to.fullPath
                    }
                });
            }
        }
    });

    /** 获取路由对应的组件名称 */
    const getComponentName = (route: RouteLocationNormalized) => {
        return route.matched.find(item => item.name === route.name)?.components?.default.name;
    };

    router.afterEach((to, from, failure) => {
        const keepAliveStore = useKeepAliveStore();

        const userStore = useUserStore();

        const { loginInfo } = storeToRefs(userStore);

        if (isNavigationFailure(failure)) {
            console.error('failed navigation', failure);
        }
        // 在这里设置需要缓存的组件名称
        const toCompName = getComponentName(to);
        // 判断当前页面是否开启缓存，如果开启，则将当前页面的 componentName 信息存入 keep-alive 全局状态
        if (to.meta?.keepAlive) {
            // 需要缓存的组件
            if (toCompName) {
                keepAliveStore.add(toCompName);
            } else {
                console.warn(
                    `${to.fullPath}页面组件的keepAlive为true但未设置组件名，会导致缓存失效，请检查`
                );
            }
        } else {
            // 不需要缓存的组件
            if (toCompName) {
                keepAliveStore.remove(toCompName);
            }
        }
        // 如果进入的是 Redirect 页面，则也将离开页面的缓存清空(刷新页面的操作)
        if (to.name === REDIRECT_NAME) {
            const fromCompName = getComponentName(from);
            fromCompName && keepAliveStore.remove(fromCompName);
        }
        // 如果用户已登出，则清空所有缓存的组件
        if (!unref(loginInfo).tokenId) {
            keepAliveStore.clear();
        }

        closeGlobalLoading();
        NProgress.done(); // finish progress bar
    });

    router.onError(error => {
        const userStore = useUserStore();
        // userStore.logout();
        console.log(error, '路由错误');
        userStore.getVisionInfo();
        // router.go(0);
    });
}
