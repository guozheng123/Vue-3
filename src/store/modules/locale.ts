import { defineStore } from 'pinia';
import type { LocaleType } from '@/locales/config';
import { LOCALE_KEY } from './storeName';

interface LocaleState {
    locale: LocaleType;
}

export const useLocaleStore = defineStore({
    id: LOCALE_KEY,
    persist: {
        enabled: true,
        strategies: [
            {
                key: LOCALE_KEY,
                storage: localStorage
            }
        ]
    },
    state: (): LocaleState => ({
        locale: 'zh-CN' as LocaleType
    }),
    getters: {
        getLocale(): LocaleType {
            return this.locale ?? 'zh-CN';
        }
    },
    actions: {
        setLocale(locale: LocaleType) {
            this.locale = locale;
        }
    }
});

// Need to be used outside the setup
// export function useLocaleStoreWithOut() {
//     return useLocaleStore(store);
// }
