import { useOpenAntdModal } from '@/hooks';
import { defineAsyncComponent } from 'vue';

export const useTpfDeleteDetail = () => {
    const [delModalDom, openDelModalDom, showDelModalDom] = useOpenAntdModal();

    const TpfDeleteDetail = defineAsyncComponent(
        () => import('@/components/TpfDeleteDetail/index.vue')
    );

    return {
        TpfDeleteDetail,
        delModalDom,
        openDelModalDom,
        showDelModalDom
    };
};
