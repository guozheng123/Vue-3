import { defineAsyncComponent } from 'vue';

export const useBomProtectTable = () => {
    const BomProtectTable = defineAsyncComponent(() => import('./index.vue'));
    return {
        BomProtectTable
    };
};
