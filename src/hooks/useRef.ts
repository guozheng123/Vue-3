import { ref, unref } from 'vue';
import type { UnwrapRef, Ref } from 'vue';

/**
 * @author wangkang
 * @param {any} initVal  初始值
 * @returns {any} state ref值
 * @returns {Function} setState 修改ref的方法
 */
export const useRef = <T>(initVal: T): [Ref<UnwrapRef<T>>, (newVal: UnwrapRef<T>) => void] => {
    const state = ref(unref(initVal));
    if (typeof initVal === 'function') {
        state.value = initVal();
    }
    const setState = (newVal: UnwrapRef<typeof initVal>) => {
        state.value = unref(newVal);
    };
    return [state, setState];
};
