import { useUserStore } from './modules/user';
import { useTabsViewStore } from './modules/tabsView';
import { createPinia } from 'pinia';
import type { App } from 'vue';
// import useTabBarStore from './modules/TabBar';
import { useKeepAliveStore } from './modules/keepAlive';
import { useLocaleStore } from './modules/locale';
import { useThemeStore } from './modules/projectConfig';
import { useCacheSearchStore } from './modules/useCacheSearchStore';
import { useCancelAxiosStore } from './modules/useCancelAxiosStore';
import { useSaveRowDataStore } from './modules/useSaveRowDataStore';
// import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import piniaPluginPersistedstate from 'pinia-plugin-persist';

export * from './modules/cacheKeyList';

// export { useTabBarStore };

const store = createPinia();
store.use(piniaPluginPersistedstate);

export function setupStore(app: App) {
    app.use(store);
}

// 全部的store
export const useStore = () => {
    return {
        // tabBarStore: useTabBarStore(),
        keepAliveStore: useKeepAliveStore(),
        localeStore: useLocaleStore(),
        themeStore: useThemeStore(),
        tabsViewStore: useTabsViewStore(),
        userStore: useUserStore(),
        cacheSearchStore: useCacheSearchStore(),
        cancelAxiosStore: useCancelAxiosStore(),
        saveRowDataStore: useSaveRowDataStore()
    };
};

export { store };
