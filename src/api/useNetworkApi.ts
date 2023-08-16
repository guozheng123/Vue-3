/* eslint-disable no-unused-vars */
export enum proxyEnum {
    tmgc2Org = 'tmgc2-org',
    tmgc2Mgt = 'tmgc2-mgt',
    tmgc2Process = 'tmgc2-process',
    tmgc2Filesystem = 'tmgc2-filesystem',
    tmgc2Qc = 'tmgc2-qc',
    tmgc2Warehouse = 'tmgc2-warehouse',
    tmgc2Production = 'tmgc2-production',
    tmgc2Material = 'tmgc2-material',
    tmgc2OExec = 'tmgc2-exec',
    tmgc2Query = 'tmgc2-query',
    tmgc2Notice = 'tmgc2-notice'
}

/**
 *
 * @param url 网关地址
 * @returns
 */

export const useNetworkApi = (url = '', target = '/api') => {
    const { VITE_APP_API_ROOT = '', VITE_APP_USE_GATEWAY = '' } = import.meta.env;

    if (VITE_APP_API_ROOT.startsWith('http:')) {
        if (VITE_APP_USE_GATEWAY === 'true') {
            // 连接的是gateWay、走网关
            return `${target}/${url}`;
        }
        //如果是本地连接后端同事服务，直接 走代理
        return target;
    } else {
        //如果是本地连接运维环境需要走网关
        return `${target}/${url}`;
    }
};
