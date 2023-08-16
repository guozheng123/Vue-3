import { createI18n } from 'vue-i18n';
import type { App } from 'vue';
import { localeMap, LocaleType } from './config';
import { setHtmlPageLang, setLoadLocalePool } from './helper';
import { Storage } from '@/utils/Storage';

import zh_CN from './lang/zh-CN';
import en_US from './lang/en-US';
import { LOCALE_KEY } from '@/store/modules/storeName';

function createI18nOptions() {
    const locale = Storage.get<{ locale: LocaleType }>(LOCALE_KEY, 'zh-CN').locale || 'zh-CN';

    // const defaultLocal = await import(`./lang/${locale}.ts`);
    const defaultLocal = locale === 'zh-CN' ? zh_CN : en_US;
    const message = defaultLocal?.message ?? {};

    setHtmlPageLang(locale);
    setLoadLocalePool(loadLocalePool => {
        loadLocalePool.push(locale);
    });

    return {
        locale,
        legacy: false,
        fallbackLocale: localeMap.zh_CN, // set fallback locale
        messages: {
            [locale]: message
        },
        globalInjection: true,
        silentTranslationWarn: true, // true - warning off
        missingWarn: false,
        silentFallbackWarn: true
    };
}

export const i18n = createI18n(createI18nOptions());

// setup i18n instance with global
export async function setupI18n(app: App) {
    app.use(i18n);
}
