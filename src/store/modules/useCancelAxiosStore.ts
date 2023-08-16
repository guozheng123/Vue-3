import { defineStore } from 'pinia';
import { CANCEL_AXIOS } from './storeName';
import type { Canceler, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';

export const useCancelAxiosStore = defineStore({
    id: CANCEL_AXIOS,
    state: () => ({
        pendingMap: new Map<string, Canceler>(),
        whitelist: ['/pageTableConfig/getInfo', '/fileObject/getPreviewFileUrl'] //白名单不需要添加cancel的
    }),
    getters: {},
    actions: {
        /**
         * 生成每个请求唯一的键
         * @param {*} config
         * @returns string
         */
        getPendingKey(config: InternalAxiosRequestConfig<any>) {
            const { url, method, params } = config;
            let data = config.data;
            if (typeof data === 'string') {
                data = JSON.parse(data); // response里面返回的config.data是个字符串对象
            }
            return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&');
            // return [url, method, JSON.stringify(params)].join('&');
        },

        /**
         * 储存每个请求唯一值, 也就是cancel()方法, 用于取消请求
         * @param {*} config
         */
        addPending(config: InternalAxiosRequestConfig) {
            const pendingKey = this.getPendingKey(config);
            const isWhitelist = this.whitelist.some(item => pendingKey.includes(item));
            if (isWhitelist) return;
            config.cancelToken =
                config.cancelToken ||
                new axios.CancelToken(cancel => {
                    if (!this.pendingMap.has(pendingKey)) {
                        this.pendingMap.set(pendingKey, cancel);
                    }
                });
        },
        /**
         * 删除重复的请求
         * @param {*} config
         */
        removePending(config: InternalAxiosRequestConfig) {
            const pendingKey = this.getPendingKey(config);
            if (this.pendingMap.has(pendingKey)) {
                const cancelToken = this.pendingMap.get(pendingKey) as Canceler;
                cancelToken(pendingKey);
                this.pendingMap.delete(pendingKey);
            }
        },
        deletePending(pendingKey: string) {
            if (this.pendingMap.has(pendingKey)) {
                const cancelToken = this.pendingMap.get(pendingKey) as Canceler;
                cancelToken(pendingKey);
                this.pendingMap.delete(pendingKey);
            }
        },

        /**
         * 清空所有的请求
         * @param {*}
         */
        clearPending() {
            this.pendingMap.forEach((cancelToken, pendingKey) => {
                cancelToken(pendingKey);
                this.pendingMap.delete(pendingKey);
            });
            this.pendingMap.clear();
        }
    }
});
