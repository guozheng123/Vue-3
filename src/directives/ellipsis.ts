import type { DirectiveBinding, ObjectDirective } from 'vue';

/**
 * @author wangkang
 *  文字省略 V 指令
 */
export default {
    mounted: (el, params: DirectiveBinding<string>) => {
        let width = '50px';
        if (params.value) {
            width = params.value; // parseFloat(params.value.toString());
        }

        el.style.width = width; //+ 'px';
        el.style.whiteSpace = 'nowrap';
        el.style.overflow = 'hidden';
        el.style.textOverflow = 'ellipsis';
        el.style.textAlign = 'left';
        el.style.wordBreak = 'keep-all';
    }
    // updated: (el, params: DirectiveBinding<string | number>) => {
    //     let width = 50;
    //     if (params.value) {
    //         width = parseFloat(params.value.toString());
    //     }
    //     el.style.width = width + 'px';
    //     el.style.whiteSpace = 'nowrap';
    //     el.style.overflow = 'hidden';
    //     el.style.textOverflow = 'ellipsis';
    //     el.style.textAlign = 'center';
    //     el.style.wordBreak = 'keep-all';
    // }
} as ObjectDirective;
