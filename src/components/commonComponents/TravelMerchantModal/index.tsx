import { useOpenAntdModal } from '@/hooks';
import { defineAsyncComponent } from 'vue';

export const useTravelMerchantModal = () => {
    const TravelMerchantModal = defineAsyncComponent(() => import('./index.vue'));
    const [travelMerchantModalDom, openTravelMerchantModal, showTravelMerchantModal] =
        useOpenAntdModal();
    return {
        TravelMerchantModal,
        travelMerchantModalDom,
        openTravelMerchantModal,
        showTravelMerchantModal
    };
};
