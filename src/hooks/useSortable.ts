import { nextTick, unref, ref } from 'vue';
import type { Ref } from 'vue';
import type { Options } from 'sortablejs';
import Sortable from 'sortablejs';

export function useSortable(el: HTMLElement | Ref<HTMLElement>, options?: Options) {
    const instance = ref<Sortable | null>(null);

    const initSortable = async () => {
        console.log('init');
        await nextTick();
        if (!el) return;
        const Sortable = (await import('sortablejs')).default;
        instance.value = Sortable.create(unref(el), {
            animation: 500,
            delay: 400,
            delayOnTouchOnly: true,
            ...options
        });
    };

    return { instance, initSortable };
}
