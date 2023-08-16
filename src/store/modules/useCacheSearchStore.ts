import { defineStore } from 'pinia';
import { PageCodeEnum } from '@/config';
import { unref } from 'vue';
import type { TpfColumnType } from '@/types/TpfType';
import type { SizeType } from 'ant-design-vue/lib/config-provider';
import { usePageFieldConfigApi } from '@/api';
import { cloneDeep, isEmpty } from 'lodash-es';
import { CACHE_SEARCH } from './storeName';

type TypePageJson = { size: SizeType; fontSize: 14 | 18; columnList: TpfColumnType[] } | null;

export const useCacheSearchStore = defineStore({
    id: CACHE_SEARCH,
    // persist:
    //     import.meta.env.VITE_NODE_ENV === 'development'
    //         ? { enabled: true, strategies: [{ key: CACHE_SEARCH, storage: sessionStorage }] }
    //         : undefined,
    state: () => ({
        cacheList: {} as {
            // eslint-disable-next-line no-unused-vars
            [key in PageCodeEnum]: {
                pageJson: Partial<TypePageJson>;
                queryTermsJson: any[];
            };
        }
    }),
    getters: {},
    actions: {
        /**
         * 清除本地某一个pageCode缓存
         * @param pageCode
         */
        clearPageCodeCache(pageCode: PageCodeEnum) {
            this.cacheList[pageCode] = {
                pageJson: { size: 'small', fontSize: 14, columnList: [] },
                queryTermsJson: []
            };
        },

        /**
         * 判断 pageJson 是否有数据
         * @param pageCode
         * @returns
         */
        pageJsonIsEmpty(pageCode: PageCodeEnum) {
            const res = isEmpty(this.cacheList[pageCode]?.pageJson?.columnList);
            // console.log('pageJsonIsEmpty: ', res);
            return res;
        },

        /**
         * 判断 queryTermsJson 是否有数据
         * @param pageCode
         * @returns
         */
        queryTermsJsonIsEmpty(pageCode: PageCodeEnum) {
            const res = isEmpty(this.cacheList[pageCode]?.queryTermsJson);
            console.log('queryTermsJsonIsEmpty: ', res);
            return res;
        },

        /**
         * queryTermsJson
         * @param pageCode
         * @returns
         */
        getQueryTermsJson(pageCode: PageCodeEnum) {
            return this.cacheList[pageCode]?.queryTermsJson || [];
        },

        /**
         * 设置 queryTermsJson
         * @param pageCode
         * @param list
         */
        setQueryTermsJson(pageCode: PageCodeEnum, list: any[]) {
            if (!this.cacheList[pageCode]) {
                this.cacheList[pageCode] = {
                    pageJson: { size: 'small', fontSize: 14, columnList: [] },
                    queryTermsJson: []
                };
            }
            this.cacheList[pageCode].queryTermsJson = unref(list);
        },

        /**
         * 获取pageCode
         * @param pageCode
         * @returns
         */
        getPageJson(pageCode: PageCodeEnum): TypePageJson {
            return (this.cacheList[pageCode]?.pageJson || {}) as TypePageJson;
        },

        /**
         * 设置 pageJson
         * @param pageCode
         * @param info
         */
        setPageJson(pageCode: PageCodeEnum, info: TypePageJson) {
            if (!this.cacheList[pageCode]) {
                this.cacheList[pageCode] = {
                    pageJson: { size: 'small', fontSize: 14, columnList: [] },
                    queryTermsJson: []
                };
            }
            this.cacheList[pageCode].pageJson = unref(info);
        },

        /**
         * 保存 pageJson
         * @param pageCode
         * @param pageJson
         */
        savePageJson(pageCode: PageCodeEnum, pageJson?: Partial<TypePageJson>) {
            this.cacheList[pageCode].pageJson = pageJson || null;
            this.saveConfig(pageCode);
        },

        /**
         * 保存 queryTermsJson
         * @param pageCode
         * @param queryTermsJson
         */
        saveQueryTermsJson(pageCode: PageCodeEnum, queryTermsJson?: any) {
            this.cacheList[pageCode].queryTermsJson = queryTermsJson || null;
            this.saveConfig(pageCode);
        },

        /**
         * 保存配置
         * @param pageCode
         */
        saveConfig(pageCode: PageCodeEnum) {
            const pageFieldConfigApi = usePageFieldConfigApi();

            const { pageJson = null, queryTermsJson = null } = this.cacheList[pageCode] || {};

            pageFieldConfigApi.save({
                pageCode,
                pageJson: pageJson && JSON.stringify(pageJson),
                queryTermsJson: queryTermsJson && JSON.stringify(queryTermsJson)
            });
        },

        /**
         * 重置配置
         * @param pageCode
         */
        restPageJson(pageCode: PageCodeEnum) {
            const pageFieldConfigApi = usePageFieldConfigApi();

            pageFieldConfigApi.save({
                pageCode,
                pageJson: null,
                queryTermsJson: null
            });
        },

        /**
         * 获取当前pageCode 的表头配置
         * @param pageCode
         * @returns
         */
        getUploadLoadSortColumns(pageCode: PageCodeEnum) {
            const columns = this.cacheList[pageCode]?.pageJson?.columnList || [];
            const res = cloneDeep(unref(columns))
                .filter(item => item.visible)
                .reduce(
                    (t, v) => {
                        if (v.fixed === 'right') {
                            t.right = [...t.right, { dataIndex: v.dataIndex, title: v.title }];
                        } else if (v.fixed === 'left') {
                            t.left = [...t.left, { dataIndex: v.dataIndex, title: v.title }];
                        } else {
                            t.center = [...t.center, { dataIndex: v.dataIndex, title: v.title }];
                        }
                        return t;
                    },
                    {
                        left: [] as TpfColumnType[],
                        center: [] as TpfColumnType[],
                        right: [] as TpfColumnType[]
                    }
                );
            return [...res.left, ...res.center, ...res.right].map(item => ({
                title: item.title,
                dataIndex: item.dataIndex
            }));
        }
    }
});
