import XEUtils from 'xe-utils';

declare global {
    interface ImportMetaEnv {
        // 打包目录
        VITE_APP_BUILD_DIR: string;
        // token名称
        VITE_APP_TOKEN_NAME: string;
        // api地址
        VITE_APP_API_ROOT: string;
        // 是否开启mock
        VITE_APP_USE_MOCK: 0 | 1;
        // 登录地址
        VITE_APP_LOGIN_URL: string;
        // 登录回跳地址
        VITE_APP_LOGIN_RETURN_URL: string;
        // 用户中心地址
        VITE_APP_UCENTER_URL: string;
    }

    interface Window {
        XEUtils: typeof XEUtils;
        APP_ENV: ImportMetaEnv;
    }

    declare type Nullable<T> = T | null;
    declare type NonNullable<T> = T extends null | undefined ? never : T;
    declare type PropType<T> = VuePropType<T>;
    declare type VueNode = VNodeChild | JSX.Element;

    export type Writable<T> = {
        -readonly [P in keyof T]: T[P];
    };

    declare type Recordable<T = any> = Record<string, T>;
    declare type ReadonlyRecordable<T = any> = {
        readonly [key: string]: T;
    };
    declare type Indexable<T = any> = {
        [key: string]: T;
    };
    declare type DeepPartial<T> = {
        [P in keyof T]?: DeepPartial<T[P]>;
    };
    declare type TimeoutHandle = ReturnType<typeof setTimeout>;
    declare type IntervalHandle = ReturnType<typeof setInterval>;

    declare interface ChangeEvent extends Event {
        target: HTMLInputElement;
    }

    declare interface WheelEvent {
        path?: EventTarget[];
    }
}

declare module 'vue' {
    export type JSXComponent<Props = any> =
        | { new(): ComponentPublicInstance<Props> }
        | FunctionalComponent<Props>;
}
