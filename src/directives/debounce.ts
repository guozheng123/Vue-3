import { debounce } from 'lodash-es';
import type { DirectiveBinding, ObjectDirective } from 'vue';
interface ElType extends HTMLInputElement {
    _timer?: number | null;
    _event: string;
    _handleFn: () => void;
}

/**
 * @author wangkang
 *  点击事件防抖 V 指令
 */
export default {
    mounted: async (
        el: ElType,
        params: DirectiveBinding<
            any | { fn: () => void; event: 'click' | 'keydown'; time: number } | any
        >
    ) => {
        const val = params.value;
        let fn: () => void;
        let _event = 'click';
        let _time = 300;

        if (typeof val === 'function') {
            fn = val;
        } else if (val.fn) {
            fn = val.fn;
            _event = val.event || _event;
            _time = val.time || _time;
        }

        // el._handleFn = () => {
        //     if (el._timer !== null) {
        //         clearTimeout(el._timer);
        //         el._timer = null;
        //     }

        //     el._timer = window.setTimeout(() => {
        //         fn();
        //         console.log(1111);
        //     }, _time);
        // };

        el._handleFn = debounce(() => fn(), _time);

        el._event = _event;
        el.addEventListener(el._event || 'click', el._handleFn);
    },
    beforeUnmount: (el: ElType) => {
        el.removeEventListener(el._event || 'click', el._handleFn);
    }
} as ObjectDirective;
