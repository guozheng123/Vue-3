import { getCurrentInstance, ref, unref } from 'vue';

// 下拉框查询
export const useSearchSelect = (api: any, field: string, returnKey?: string) => {
    const options = ref<any[]>([]);
    const proxy = getCurrentInstance();
    let requestId = 0;
    const filterOption = () => true;
    const onSearch = async (name?: string) => {
        try {
            requestId++;
            const responseId = requestId;
            const { data } = await api({ value: name });
            if (requestId !== responseId) return;
            options.value = returnKey === 'object' ? data?.object?.list : data?.list || [];
        } catch (error) {
            console.log(error);
        }
    };
    const onChange = (...args: any[]) => {
        const [val, obj] = args;
        proxy?.exposed?.setMap(field, obj, val);
    };
    const onFocus = () => {
        if (!unref(options).length) onSearch();
    };
    return {
        onSearch,
        options,
        filterOption,
        allowClear: true,
        showSearch: true,
        onChange,
        onFocus
    };
};
