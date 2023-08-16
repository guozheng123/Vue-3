import { defineAsyncComponent } from 'vue';

export const useTpfInput = () => {
    const TpfInput = defineAsyncComponent(() => import('./index.vue'));
    return { TpfInput };
};
