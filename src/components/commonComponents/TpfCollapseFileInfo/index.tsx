import { defineAsyncComponent } from 'vue';

export const useTpfCollapseFileInfo = () => {
    const TpfCollapseFileInfo = defineAsyncComponent(() => import('./index.vue'));
    return {
        TpfCollapseFileInfo
    };
};
