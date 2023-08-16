/**
 * Multi-language related operations
 */
import { unref, computed } from 'vue';
import type { Locale } from 'ant-design-vue/es/locale-provider';
import { loadLocalePool, setHtmlPageLang } from './helper';
import { i18n } from './index';
import type { LocaleType } from './config';

import dayjs from 'dayjs';
import { useStore } from '@/store/index';

type Recordable<T = any> = Record<string, T>;

interface LangModule {
    message: Recordable;
    dateLocale: Recordable;
    dateLocaleName: string;
}

function setI18nLanguage(locale: LocaleType) {
    const { localeStore } = useStore();

    if (i18n.mode === 'legacy') {
        i18n.global.locale = locale;
    } else {
        (i18n.global.locale as any).value = locale;
    }
    localeStore.setLocale(locale);
    if (locale.startsWith('zh')) {
        dayjs.locale('zh-cn');
    } else {
        dayjs.locale('en-gb');
    }
    setHtmlPageLang(locale);
}

export function useLocale() {
    const { localeStore } = useStore();

    const getLocale = computed(() => localeStore.getLocale);

    const getAntdLocale = computed<Locale>((): any => {
        return i18n.global.getLocaleMessage<{ antdLocale: Locale }>(unref(getLocale)).antdLocale;
    });

    // Switching the language will change the locale of useI18n
    // And submit to configuration modification
    async function changeLocale(locale: LocaleType) {
        const globalI18n = i18n.global;
        const currentLocale = unref(globalI18n.locale);

        if (currentLocale === locale) {
            return locale;
        }

        if (loadLocalePool.includes(locale)) {
            setI18nLanguage(locale);
            return locale;
        }
        const langModule = ((await import(`./lang/${locale}.ts`)) as any).default as LangModule;
        console.log('langModule: ', langModule);

        if (!langModule) return;

        const { message } = langModule;

        globalI18n.setLocaleMessage(locale, message as { antdLocale: Locale });

        loadLocalePool.push(locale);

        setI18nLanguage(locale);
        return locale;
    }

    return {
        getLocale,
        changeLocale,
        getAntdLocale
    };
}
