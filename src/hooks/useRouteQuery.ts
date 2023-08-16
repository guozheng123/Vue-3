import { useRoute, useRouter } from 'vue-router';
import { useRouteBase64 } from '@/hooks';
import { useStore } from '@/store/index';
import { locat } from 'xe-utils';
import { isEmpty } from 'lodash-es';

/**
 * 获取路由上的查询参数
 * @returns
 */
export const useRouteQuery = <T extends Record<string, any>>() => {
    const route = useRoute();
    const routeQuery = (isEmpty(route.query) ? locat().searchQuery || {} : route.query) as T & {
        sign: string;
    };
    // 根据 sign 去判断是否为加密
    if (typeof routeQuery.sign === 'string') {
        const { decodeParams } = useRouteBase64();
        const res = decodeParams<T>(routeQuery as { sign: string });
        console.log('解密后的路由参数', res);
        return res;
    }
    console.log('正常的路由参数', routeQuery);
    return routeQuery;
};

/**
 * 获取路由上的路径参数
 * @returns
 */
export const useRouteParams = <T extends Record<string, string>>() => {
    const route = useRoute();
    const routeParams = route.params as T;
    return routeParams;
};

/**
 * 关闭当前Tab页面并且返回上一页
 * @returns
 */
export const useRouteBackTab = () => {
    const { tabsViewStore } = useStore();
    const route = useRoute();
    const router = useRouter();
    const routeBackTab = () => {
        tabsViewStore.closeCurrentTab(route, router.back);
    };
    return { routeBackTab };
};
