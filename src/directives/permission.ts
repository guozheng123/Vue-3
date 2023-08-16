import { checkPermission } from '@/utils';
import type { DirectiveBinding } from 'vue';

/**
 * @author wangkang
 *  权限校验 V 指令
 *  传入number 或者 number[]
 */
export default {
    mounted: (el: HTMLElement, params: DirectiveBinding<string[]>) => {
        const hasPermission = checkPermission(params.value).length === params.value.length;
        if (!hasPermission) {
            el.parentNode && el.parentNode.removeChild(el);
        }
    }
};
