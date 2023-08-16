import { createRouter, createWebHistory } from 'vue-router';

import type { App } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { createRouterGuards } from './router-guards';
import { whiteNameList, whitePathList } from './constant';
import Login from '@/views/Login/index.vue';
import MainLayout from '@/layout/MainLayout.vue';
import { t } from '@/hooks/useI18n';
export const defaultMenu = () => [
    {
        path: '/home/index',
        fullPath: '/home/index',
        name: 'Home/index',
        meta: { title: t('routes.home.index'), closable: false },
        component: () => import('@/views/home/index.vue')
    },

    {
        path: '/home/tileMenu',
        fullPath: '/home/tileMenu',
        name: 'TileMenu/index',
        meta: { title: t('routes.home.tileMenu'), closable: false },
        component: () => import('@/views/home/tileMenu/index.vue')
    },
    {
        path: '/home/postBoard',
        fullPath: '/home/postBoard',
        name: 'Home/postBoard',
        meta: { title: '岗位看板', closable: true },
        component: () => import('@/views/home/postBoard.vue')
    }
];

export const loginRoute: RouteRecordRaw[] = [
    {
        path: '',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        hidden: true,
        meta: {
            title: '登录'
        },
        component: Login
    }
];

export const notFoundRoute: RouteRecordRaw = {
    path: '/notFound',
    name: 'notFound',
    hidden: true,
    component: () => import('@/views/notfound/index.vue'),
    meta: {
        title: '404'
    }
};
export const notFound404: RouteRecordRaw = {
    path: '/:pathMatch(.*)',
    name: 'notFound404',
    hidden: true,
    meta: {
        title: '404'
    },
    redirect: '/notFound'
    // component: () => import('@/views/notfound/index.vue')
    // redirect: to => {
    //     console.log('to: ', to);
    //     return {
    //         path: '/notFound',
    //         query: {
    //             returnUrl: to.fullPath
    //         }
    //     };
    // }
};

export const testRoute: RouteRecordRaw = {
    path: '/test',
    name: 'test',
    hidden: true,
    component: () => import('@/views/dashboard/home/index.vue'),
    meta: {
        title: '404'
    }
};
export const tpfCom: RouteRecordRaw = {
    path: '/tpfCom',
    name: 'tpfCom',
    hidden: true,
    component: () => import('@/components/TpfCom.vue'),
    meta: {
        title: '404'
    }
};

export const homeRoute: RouteRecordRaw = {
    path: '/home',
    hidden: true,
    component: MainLayout,
    meta: {
        title: t('routes.home.index'),
        closable: false
    },
    children: defaultMenu()
};

export const router = createRouter({
    // process.env.BASE_URL
    history: createWebHistory(''),
    routes: [...loginRoute, notFoundRoute, testRoute, homeRoute, tpfCom]
});

// reset router
export function resetRouter() {
    router.getRoutes().forEach(route => {
        const { name } = route;
        if (name && !whiteNameList.some(n => n === name)) {
            router.hasRoute(name) && router.removeRoute(name);
        }
    });
}

export async function setupRouter(app: App) {
    // 创建路由守卫
    createRouterGuards(router, whitePathList);

    app.use(router);

    // 路由准备就绪后挂载APP实例
    await router.isReady();
}
export default router;
