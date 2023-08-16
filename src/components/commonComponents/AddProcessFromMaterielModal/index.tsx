import { useOpenAntdModal } from '@/hooks';
import { defineAsyncComponent } from 'vue';

export const useAddProcessFromMaterielModal = () => {
    const AddProcessFromMaterielModal = defineAsyncComponent(() => import('./index.vue'));
    const [
        addProcessFromMaterielModalDom,
        openAddProcessFromMaterielModalDom,
        showAddProcessFromMaterielModalDom
    ] = useOpenAntdModal();

    return {
        AddProcessFromMaterielModal,
        addProcessFromMaterielModalDom,
        openAddProcessFromMaterielModalDom,
        showAddProcessFromMaterielModalDom
    };
};
