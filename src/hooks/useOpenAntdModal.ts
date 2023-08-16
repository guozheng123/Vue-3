import { ref, Ref, UnwrapRef, watchEffect } from 'vue';
import NProgress from 'nprogress';

export const useOpenAntdModal = <T extends { open: (val?: any) => void }>(): [
    Ref<UnwrapRef<T> | null>,
    (...args: any) => void,
    Ref<boolean>
] => {
    const modalShow = ref<boolean>(false);
    const load = ref<boolean>(false);
    const target = ref<T | null>(null);
    const arg = ref<any[]>([]);
    const onOpenModal = (...args: any[]) => {
        if (!modalShow.value) {
            modalShow.value = true;
            NProgress.start();
            arg.value = args;
        }
        if (typeof target.value?.open === 'function') {
            load.value = true;
            target.value!.open(...args);
        }
    };
    const stop = watchEffect(() => {
        if (modalShow.value && typeof target.value?.open === 'function' && !load.value) {
            target.value!.open(...arg.value);
            NProgress.done();
            stop();
        }
    });
    return [target, onOpenModal, modalShow];
};
