import { defineStore } from 'pinia';
import { SAVE_ROW_DATA } from './storeName';
import { cacheKeyEnum } from './cacheKeyList';

export const useSaveRowDataStore = defineStore({
    id: SAVE_ROW_DATA,
    persist: { enabled: true, strategies: [{ key: SAVE_ROW_DATA, storage: sessionStorage }] },
    state: () => ({
        rowData: {} as {
            // eslint-disable-next-line no-unused-vars
            [key in cacheKeyEnum]: any;
        }
    }),
    actions: {
        /**
         * 设置缓存
         * @param k
         * @param info
         */
        setRowData(k: cacheKeyEnum, info: any) {
            this.rowData[k] = info;
        },
        /**
         * 获取缓存
         * @param k
         * @returns
         */
        getRowData(k: cacheKeyEnum) {
            return this.rowData[k] || {};
        }
    }
});
