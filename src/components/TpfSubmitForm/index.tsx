import { defineAsyncComponent } from 'vue';

export const useTpfSubmitForm = () => {
    const TpfSubmitForm = defineAsyncComponent(() => import('./index.vue'));
    return { TpfSubmitForm };
};
