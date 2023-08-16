import { useOpenAntdModal } from '@/hooks';
import { defineAsyncComponent } from 'vue';

export const useQCMultipleValuesModal = () => {
    const QCMultipleValuesModal = defineAsyncComponent(() => import('./index.vue'));
    const [QCMultipleValuesDom, openQCMultipleValuesModal, showQCMultipleValuesModal] =
        useOpenAntdModal();
    return {
        QCMultipleValuesModal,
        QCMultipleValuesDom,
        openQCMultipleValuesModal,
        showQCMultipleValuesModal
    };
};
