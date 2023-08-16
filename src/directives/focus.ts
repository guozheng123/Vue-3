import type { DirectiveBinding, ObjectDirective } from 'vue';
import { nextTick } from 'vue';

/**
 * @author wangkang
 *  自动获取焦点 V 指令
 */
export default {
    mounted: async (el: HTMLInputElement, params: DirectiveBinding<any>) => {
        const value = typeof params.value === 'function' ? params.value() : params.value;
        await nextTick();
        if (value) {
            if (el.nodeName === 'INPUT') {
                el.focus();
            } else {
                const _ipt = el.querySelector('input');
                _ipt && _ipt.focus();
            }
        }
    }
} as ObjectDirective;
