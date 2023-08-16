import { defineStore } from 'pinia';
// import darkThemeCss from 'ant-design-vue/dist/antd.dark.css?raw';
import { useMutationObserver } from '@vueuse/core';
import { ConfigProvider } from 'ant-design-vue';
import type { Theme } from 'ant-design-vue/es/config-provider/';
import { THEME_KEY } from './storeName';
import { Storage } from '@/utils/Storage';

const styleDom = document.createElement('style');
styleDom.dataset.type = 'theme-dark';
// styleDom.textContent = darkThemeCss;
document.head.appendChild(styleDom);

useMutationObserver(
    document.head,
    mutations => {
        const hasCustomStyleEl = mutations.some(n => Array.from(n.addedNodes).includes(styleDom));
        if (!hasCustomStyleEl) {
            document.head.appendChild(styleDom);
            styleDom.disabled = !document.documentElement.classList.contains('dark');
        }
    },
    {
        childList: true
    }
);

/**
 * 项目默认配置项
 * primaryColor - 默认主题色, 如果修改颜色不生效，请清理 localStorage
 * navTheme - sidebar theme ['dark', 'light'] 两种主题
 * colorWeak - 色盲模式
 * layout - 整体布局方式 ['sidemenu', 'topmenu'] 两种布局
 * fixedHeader - 固定 Header : boolean
 * fixSiderbar - 固定左侧菜单栏 ： boolean
 * contentWidth - 内容区布局： 流式 |  固定
 */

/** 主题色 */
export type ThemeName = 'light' | 'dark' | 'realDark';
export type { Theme };

export type ThemeState = {
    navTheme: ThemeName; // theme for nav menu
    primaryColor: string; // '#F5222D', // primary color of ant design
    layout: 'sidemenu' | 'topmenu'; // nav menu position: `sidemenu` or `topmenu`
    //  contentWidth: 'Fluid' | 'Fixed'; // layout of content: `Fluid` or `Fixed`, only works when layout is topmenu
    //  fixedHeader: false; // sticky header
    // fixSiderbar: false; // sticky siderbar
    // colorWeak: false;
    // menu: {
    //     locale: true;
    // };
};

export const defaultConfig: ThemeState = {
    navTheme: 'dark', // theme for nav menu
    primaryColor: '#7FB92D', // primary color of ant design
    layout: 'sidemenu' // nav menu position: `sidemenu` or `topmenu`
    //   contentWidth: 'Fluid' // layout of content: `Fluid` or `Fixed`, only works when layout is topmenu
    //  fixedHeader: false, // sticky header
    // fixSiderbar: false // sticky siderbar
    // colorWeak: false
    // menu: {
    //     locale: true
    // }
};

const getLocalThemeConfig = (): Partial<ThemeState> => {
    try {
        return JSON.parse(Storage.get(THEME_KEY, '{}'));
    } catch {
        return {};
    }
};

const localThemeConfig = getLocalThemeConfig();

const { primaryColor } = localThemeConfig;

primaryColor &&
    ConfigProvider.config({
        theme: {
            primaryColor
        }
    });

export const useThemeStore = defineStore({
    id: THEME_KEY,
    persist: {
        enabled: true,
        strategies: [
            {
                key: THEME_KEY,
                storage: localStorage
            }
        ]
    },
    state: (): ThemeState => ({
        ...defaultConfig,
        ...localThemeConfig
    }),
    getters: {
        getNavTheme(): ThemeName {
            return this.navTheme;
        }
    },
    actions: {
        // setTheme(theme: Partial<ThemeState>) {
        //     // eslint-disable-next-line no-restricted-syntax
        //     for (const key in theme) {
        //         this[key] = theme[key];
        //     }
        //     // document.documentElement.style.setProperty(key, nextTheme[key]);
        //     // theme.navTheme && setRealDarkTheme(theme.navTheme);
        //     Storage.set(THEME_KEY, JSON.stringify(this.$state));
        // },

        /** antdv自带的改变主题颜色方法，但可以配置的颜色很有限，仅6种 */
        fillColor(theme: Theme) {
            console.log('theme: ', theme);
            this.primaryColor = theme.primaryColor ?? this.primaryColor;
            ConfigProvider.config({
                theme
            });
            // Storage.set(THEME_KEY, JSON.stringify(this.$state));
        }
    }
});

// export function useThemeStoreWithOut() {
//     return useThemeStore(store);
// }
