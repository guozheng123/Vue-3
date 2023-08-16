import { useOpenAntdModal } from '@/hooks';
import { defineAsyncComponent } from 'vue';

export const useRevisionHistoryModal = () => {
    const RevisionHistoryModal = defineAsyncComponent(() => import('./index.vue'));
    const [revisionHistoryModalDom, openRevisionHistoryModal, showRevisionHistoryModal] =
        useOpenAntdModal();
    return {
        RevisionHistoryModal,
        revisionHistoryModalDom,
        openRevisionHistoryModal,
        showRevisionHistoryModal
    };
};
