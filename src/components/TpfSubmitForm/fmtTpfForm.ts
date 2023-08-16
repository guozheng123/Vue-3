import { unref } from 'vue';

export const fmtTpfForm = () => {
    const getNullArr = (length: number) => Array.from({ length }, (it, inx) => ({ field: '' }));

    const handleFormJson = (list: any[]) => {
        return unref(list).filter((item: any) => item.visible !== false && item.type && item.field);
    };

    return { getNullArr, handleFormJson };
};
