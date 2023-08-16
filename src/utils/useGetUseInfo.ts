import { USER_INFO_KEY } from '@/store/modules/storeName';

export const getUserInfo = () => {
    const userInfo = JSON.parse(sessionStorage.getItem(USER_INFO_KEY) || '{}');
    return userInfo;
};

/**
 * 判断是否为开发环境
 * @returns
 */
export const isDev = () => {
    return import.meta.env.VITE_NODE_ENV === 'development';
};

/**
 * 判断是否为生产环境
 * @returns
 */
export const isProd = () => {
    return import.meta.env.VITE_NODE_ENV === 'production';
};
