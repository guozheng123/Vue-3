import { ObjectDirective, nextTick } from 'vue';
/**
 * @author wangkang
 * @description 此指令只能用于antd 的 modal组件使用
 */
export default {
    async mounted(el: HTMLDivElement, bindings, vnode) {
        if (!bindings.value) return;
        await nextTick();
        let left = 0;
        let top = 0;
        const modal = vnode.el.querySelector('.ant-modal') as HTMLElement;
        const header = modal.querySelector('.ant-modal-header') as HTMLElement;
        const { offsetHeight, offsetWidth } = modal;

        header.style.cursor = 'move';
        const innerWidth = window.innerWidth;
        const innerHeight = window.innerHeight;
        const maxMoveX = innerWidth - offsetWidth;
        const maxMoveY = innerHeight - offsetHeight;

        header.onmousedown = (e: MouseEvent) => {
            top = modal.offsetTop;
            left = modal.offsetLeft;
            const startX = e.clientX;
            const startY = e.clientY;
            modal.style.position = 'fixed';
            modal.style.left = left + 'px';
            modal.style.top = top + 'px';
            el.onmousemove = (event: MouseEvent) => {
                const endX = event.clientX;
                const endY = event.clientY;
                let moveX = left + (endX - startX);
                let moveY = top + (endY - startY);
                if (moveX < 0) {
                    moveX = 0;
                }
                if (moveX > maxMoveX) {
                    moveX = maxMoveX;
                }
                if (moveY < 0) {
                    moveY = 0;
                }
                if (moveY > maxMoveY) {
                    moveY = maxMoveY;
                }

                modal.style.left = moveX + 'px';
                modal.style.top = moveY + 'px';
            };
            el.onmouseup = (event: MouseEvent) => {
                el.onmousemove = null;
                el.onmouseup = null;
            };
        };
    }
} as ObjectDirective;
