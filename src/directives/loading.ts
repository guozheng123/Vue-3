import type { DirectiveBinding, ObjectDirective } from 'vue';
import { h, render } from 'vue';
import { Spin } from 'ant-design-vue';

const useLoadingDir = (el: HTMLElement, params: DirectiveBinding<boolean>) => {
    const parentNode = el.parentNode as HTMLElement;
    let _div = parentNode && (parentNode.querySelector('.tpf-loading') as HTMLElement);
    if (params.value) {
        if (!_div) {
            _div = document.createElement('div');
            _div.setAttribute('class', 'tpf-loading');
        }

        parentNode && parentNode.classList.add('tpf-relative');
        parentNode && parentNode.appendChild(_div);
        render(h(Spin), _div);
    } else {
        parentNode.classList.remove('tpf-relative');
        _div && parentNode && parentNode.removeChild(_div);
    }
};

/**
 * @author wangkang
 *  loading V 指令
 *  传入 boolean
 */
export default {
    mounted: useLoadingDir,
    updated: useLoadingDir
} as ObjectDirective;
