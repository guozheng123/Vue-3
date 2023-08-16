import SvgIcon from '@/components/SvgIcon/index.vue';
import { Modal } from 'ant-design-vue';
import type { ModalFuncProps } from 'ant-design-vue/es/modal/Modal';

const TpfDelConfirm = (ops?: ModalFuncProps | string) => {
    const option = typeof ops === 'string' ? {} : ops;
    return new Promise((resolve, reject) => {
        Modal.confirm({
            class: 'tpf-model-confirm',
            centered: true,
            icon: (
                <span class="anticon anticon-exclamation-circle">
                    <SvgIcon type="error-circle" size={22} />
                </span>
            ),
            title: '确认删除',
            content: `确定删除选中的${ops}吗？`,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                resolve('confirm');
            },
            onCancel: () => {
                reject('cancel');
            },
            ...option
        });
    });
};
export default TpfDelConfirm;
