import { computed, Ref, unref } from 'vue';

export const useCheckAllBox = <T extends { [k: string]: any }>(
    list: Ref<T[]>,
    key: keyof T = 'check'
) => {
    const getCheckList = computed(() => unref(list).filter(item => !!item[key]));

    const indeterminate = computed(() => {
        if (getCheckList.value.length === unref(list).length) {
            return false;
        }
        if (getCheckList.value.length === 0) {
            return false;
        }
        return true;
    });

    const checkAll = computed({
        set(val: any) {
            unref(list).forEach(item => (item[key] = val));
        },
        get() {
            return unref(list).every(item => !!item[key]);
        }
    });

    return { indeterminate, checkAll, getCheckList };
};
