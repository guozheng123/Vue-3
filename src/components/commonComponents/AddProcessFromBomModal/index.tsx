import { useOpenAntdModal } from '@/hooks';
import { defineAsyncComponent } from 'vue';

export const useAddProcessFromBomModal = () => {
    const AddProcessFromBomModal = defineAsyncComponent(() => import('./index.vue'));
    const [
        addProcessFromBomModalDom,
        openAddProcessFromBomModalDom,
        showAddProcessFromBomModalDom
    ] = useOpenAntdModal();
    return {
        AddProcessFromBomModal,
        addProcessFromBomModalDom,
        openAddProcessFromBomModalDom,
        showAddProcessFromBomModalDom
    };
};
