import { message } from 'ant-design-vue';
import NProgress from 'nprogress';
import { Router } from 'vue-router';
import { locat } from 'xe-utils';

const { VITE_APP_TOKEN_NAME } = import.meta.env;
const { VITE_APP_LOGIN_URL } = import.meta.env;
const { VITE_APP_LOGIN_RETURN_URL } = import.meta.env;

/* 跳转登录 */
export function goToLogin() {
    const { sa } = locat().searchQuery;
    const url = VITE_APP_LOGIN_URL + encodeURIComponent(VITE_APP_LOGIN_RETURN_URL);
    // const agentId = store.state.userModule.userInfo?.enterpriseInfo?.agentId || '';
    const agentId = '';
    window.localStorage.removeItem(VITE_APP_TOKEN_NAME);
    if (agentId) {
        window.location.href = `${url}&sa=${agentId}`;
    } else if (sa) {
        window.location.href = `${url}&sa=${sa}`;
    } else {
        window.location.href = url;
    }
}

const getLocalToken = () => {
    return window.localStorage.getItem(VITE_APP_TOKEN_NAME);
};
const getLocalCode = () => {
    return window.localStorage.getItem(`${VITE_APP_TOKEN_NAME}code`);
};

// 初始化用户信息
let loginLock = false;
const initUserInfo = async () => {
    // const token = getLocalToken();
    const { code, type } = locat().searchQuery;
    if (code) {
        if (getLocalCode() !== code) {
            // 设置来源
            // store.commit('userModule/SET_LOGIN_CODES', { code, type });
            console.log({ type });

            // await store.dispatch('userModule/GET_USER_TOKEN');
        }
    }
};

export default async (router: Router) => {
    router.beforeEach(async (to, form, next) => {
        const title = (to.meta?.title || '透明工厂') as string;
        if (title) {
            document.title = title;
        }
        NProgress.start(); // 进度条开始
        try {
            const isRequireAuth = to.matched.some(record => record.meta.isRequireAuth);
            if (isRequireAuth) {
                const { code } = to.query;
                const token = getLocalToken();

                if (!loginLock) {
                    await initUserInfo();
                    loginLock = true;
                }

                /* 进入权限验证 */
                if (token) {
                    // 有token直接调取用户信息
                    // if (!store.state.userModule.userInfo) {
                    //     await store.dispatch('userModule/GET_USER_INFO');
                    // }
                    next();
                } else if (code) {
                    // 设置来源
                    // store.commit('userModule/SET_LOGIN_CODES', { code, type });
                    // await store.dispatch('userModule/GET_USER_TOKEN');
                    // await store.dispatch('userModule/GET_USER_INFO');
                    next();
                } else {
                    goToLogin();
                }
            } else {
                next();
            }
        } catch (e) {
            console.log(e);
            message.error('系统错误！');
        }
        next();
    });

    router.afterEach(() => {
        NProgress.done(); // 进度条结束
    });
};
