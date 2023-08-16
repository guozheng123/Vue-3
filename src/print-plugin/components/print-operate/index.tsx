import PrintOperate from './index.vue';

export default PrintOperate;

declare module 'vue' {
    export interface GlobalComponents {
        PrintOperate: typeof PrintOperate;
    }
}
