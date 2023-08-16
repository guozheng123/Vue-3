import { defineAsyncComponent } from 'vue';

export const useBomTree = () => {
    const BomTree = defineAsyncComponent(() => import('./index.vue'));
    return {
        BomTree
    };
};
