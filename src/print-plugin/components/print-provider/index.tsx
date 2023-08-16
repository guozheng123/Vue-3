import PrintProvider from './index.vue';

export default PrintProvider;

declare module 'vue' {
    export interface GlobalComponents {
        PrintProvider: typeof PrintProvider;
    }
}
