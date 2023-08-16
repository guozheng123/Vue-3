import type { RouteRecordRaw } from 'vue-router';
import { t } from '@/hooks/useI18n';
import MainLayout from '@/layout/MainLayout.vue';
import { defineAsyncComponent } from 'vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/dashboard',
        name: '/dashboard',
        component: MainLayout,
        redirect: '/dashboard/home',
        meta: {
            title: t('routes.dashboard.dashboard'),
            icon: 'icon-wodecaidan'
        },
        children: [
            {
                path: 'test',
                name: `test`,
                meta: {
                    title: 'test',
                    icon: 'icon-guanxi-dian'
                },
                component: defineAsyncComponent(() => import('@/views/dashboard/test/index.vue'))
            },
            {
                path: 'home',
                name: `dashboardhome`,
                meta: {
                    title: '首页',
                    icon: 'icon-guanxi-dian',
                    closable: false
                },
                component: defineAsyncComponent(() => import('@/views/dashboard/home/index.vue'))
            },
            {
                path: 'flow',
                name: `dashboardflow`,
                meta: {
                    title: 'flow antv x6',
                    icon: 'icon-guanxi-dian'
                },
                component: defineAsyncComponent(() => import('@/views/dashboard/flow/index.vue'))
            },

            {
                path: 'test',
                name: `dashboardtest`,
                component: MainLayout,
                meta: {
                    title: '测试页面路由'
                },
                children: [
                    {
                        path: '/dashboard/test/Validate',
                        name: '/dashboard/test/Validate',
                        component: () => import('@/views/validateForm/index.vue'),
                        meta: {
                            title: '测试页面'
                        }
                    }
                ]
            }
        ]
    },
    {
        path: '/dashboard',
        component: MainLayout,
        name: 'dashboard1',
        meta: {
            title: '基础数据',
            icon: 'icon-jichushuju'
        },
        children: []
    },
    {
        path: '/dashboard',
        component: MainLayout,
        name: 'dashboard2',
        meta: {
            title: '销售管理',
            icon: 'icon-xiaoshouguanli'
        }
    }
];

export default routes;
