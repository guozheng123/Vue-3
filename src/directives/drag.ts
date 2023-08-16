import type { DirectiveBinding } from 'vue';

/**
 * @author bulei
 * 拖拽
 */

const drag = (el: HTMLElement, params: DirectiveBinding<number>) => {
    const oDiv = el; // 当前元素
    // let self = this // 上下文
    // 禁止选择网页上的文字
    // document.onselectstart = function () {
    //     return false;
    // };
    oDiv.onmousedown = function (e) {
        const disY = e.clientY - oDiv.offsetTop;
        document.onmousemove = function (e) {
            // 通过事件委托，计算移动的距离
            // let l = e.clientX - disX;
            const t = e.clientY - disY;
            // 移动当前元素
            if (t < 0 + 78 || t + params.value > document.body.clientHeight) {
                return;
            } else {
                oDiv.style.top = t + 'px';
            }
        };
        document.onmouseup = function (e) {
            document.onmousemove = null;
            document.onmouseup = null;
        };
        return false;
    };
};
export default {
    mounted: drag,
    updated: drag
};
