import { message } from 'ant-design-vue';
import type { AxiosResponse } from 'axios';
import router from '@/router';
import { useStore } from '@/store';

export const handleErrorStatus = {
    401: (data: AxiosResponse) => {
        //无权限
        message.error(data.statusText);
        const { userStore, tabsViewStore, cacheSearchStore, keepAliveStore } = useStore();

        //token过期
        const returnUrl = window.location.href.toString(); //router.currentRoute.value.fullPath.toString();
        // if (path === '/login') {
        console.log('登录态失效去login页面');

        // userStore.logout();
        // } else {
        [userStore, tabsViewStore, cacheSearchStore, keepAliveStore].forEach(store =>
            store.$reset()
        );

        router.replace({ path: '/login', query: { returnUrl } });
        // }
    },
    403: (data: AxiosResponse) => {
        message.error(data.statusText);
    },
    404: (data: AxiosResponse) => {
        message.error(data.statusText);
    },
    418: (data: AxiosResponse) => {
        // 平台错误
        message.error(data.statusText);
    },
    429: (data: AxiosResponse) => {
        // 频率过快
        message.error(data.statusText);
    },
    500: (data: AxiosResponse) => {
        // 未定义错误
        message.error('网络繁忙');
    },
    510: (data: AxiosResponse) => {
        // 未定义错误
        message.error(data.data.errorMessage || data.statusText);
    },
    599: (data: AxiosResponse) => {
        // 未定义错误
        message.error(data.data.errorMessage);
    }
};
