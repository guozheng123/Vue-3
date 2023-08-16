import type { DirectiveBinding, ObjectDirective } from 'vue';

const useNoDateDir = (el: HTMLElement, params: DirectiveBinding<boolean>) => {
    const flag = params.value;
    if (flag) {
        el.classList.add('noData');
    } else {
        el.classList.remove('noData');
    }
};

/**
 * @author wangkang
 *  没有数据 V 指令
 */
export default {
    // mounted: useNoDateDir,
    updated: useNoDateDir
} as ObjectDirective;
