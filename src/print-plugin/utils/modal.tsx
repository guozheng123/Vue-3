import { App, createApp } from 'vue';

const Modal = {
    props: {
        title: {
            type: String,
            required: true
        },
        bodyStyle: {
            type: String,
            default: ''
        },
        headerStyle: {
            type: String,
            default: ''
        },
        footerStyle: {
            type: String,
            default: 'padding:10px'
        }
    },
    render(ctx: Record<string, any>) {
        const { $props, $emit } = ctx;
        const cancel = (e: MouseEvent) => {
            e.stopPropagation();
            $emit('cancel');
        };
        const confirm = (e: MouseEvent) => {
            e.stopPropagation();
            $emit('confirm');
        };
        const stopPropagation = (e: MouseEvent) => {
            e.stopPropagation();
        };
        return (
            <div class="modal">
                <div class="wrap" onClick={cancel}>
                    <div class="box" onClick={stopPropagation} style={$props.bodyStyle}>
                        <div class="modal-box__header" style={$props.headerStyle}>
                            {$props.title}
                        </div>
                        <div class="modal-box__footer" style={$props.footerStyle}>
                            <button class="info" onClick={cancel}>
                                取消
                            </button>
                            <button class="primary" onClick={confirm}>
                                确定
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export function showModal(options: Record<string, any>) {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const { title, bodyStyle, headerStyle, footerStyle } = options;
    const { onCancel, onConfirm } = options;
    const hide = (modal: App<Element>) => {
        modal.unmount();
        div.remove();
    };
    const modal = createApp(Modal, {
        title: title,
        bodyStyle: bodyStyle,
        headerStyle: headerStyle,
        footerStyle: footerStyle,
        onCancel: () => {
            hide(modal);
            onCancel && onCancel();
        },
        onConfirm: () => {
            onConfirm && onConfirm(() => hide(modal));
        }
    });
    modal.mount(div);
}
