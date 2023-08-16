import useDirectives from '@/directives';
import { App, createApp, defineAsyncComponent } from 'vue';

export const showModal = (options: any = {}) => {
    const Modal = defineAsyncComponent(() => import('@/components/TpfModal/index.vue'));
    const div = document.createElement('div');
    document.body.appendChild(div);
    const { onCancel, onConfirm } = options;
    const hide = (modal: App<Element>) => {
        modal.unmount();
        div.parentNode?.removeChild(div);
    };
    const modal = createApp(Modal, {
        ...options,
        visible: true,
        draggable: true,
        onCancel: () => {
            console.log('cancel');
            hide(modal);
            onCancel && onCancel();
        },
        onConfirm() {
            onConfirm && onConfirm(() => hide(modal));
        }
    });
    useDirectives(modal);
    modal.mount(div);
};
