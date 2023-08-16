import PrintCore from './index.vue';

export default PrintCore;

declare module 'vue' {
    export interface GlobalComponents {
        PrintCore: typeof PrintCore;
    }
}
