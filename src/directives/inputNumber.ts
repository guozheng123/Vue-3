import type { ObjectDirective } from 'vue';
interface ElType extends HTMLInputElement {
    $inp?: Element;
    _event: string;
    handle: () => void;
}

const findEle = (parent: HTMLInputElement, type: string) => {
    return parent.tagName.toLowerCase() === type ? parent : parent.querySelector(type);
};
const trigger = (el: any, type: any) => {
    const e = document.createEvent('HTMLEvents');
    e.initEvent(type, true, true);
    el.dispatchEvent(e);
};
/**
 * @author wangkang
 *  正整数 V 指令
 */
export default {
    mounted: (el: ElType) => {
        // 正则规则可根据需求自定义
        const regRule = /[^0-9]/g;
        const $inp = findEle(el, 'input') as any;
        el.$inp = $inp;
        $inp.handle = () => {
            const val = $inp.value;
            $inp.value = val.replace(regRule, '');
            trigger($inp, 'input');
        };
        $inp.addEventListener('keyup', $inp.handle);
    },
    beforeUnmount: el => {
        el.$inp.removeEventListener('keyup', el.$inp.handle);
    }
} as ObjectDirective;
