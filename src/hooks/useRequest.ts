import { reactive } from 'vue';
import type { UnwrapNestedRefs, Ref } from 'vue';
import { useLoading } from '@/hooks/useLoading';
import type { AxiosResponse } from 'axios';
import type { TpfAxiosRes } from '@/types/axios';

// use to fetch list
// Don't use async function. It doesn't work in async function.
// Use the bind function to add parameters
// example: useRequest(api.bind(string;, {}))

export function useRequest<T extends TpfAxiosRes<any>>(
    api: () => Promise<T>
): Promise<[UnwrapNestedRefs<T>, AxiosResponse, Ref<boolean>]> {
    return new Promise(resolve => {
        const { loading, setLoading } = useLoading();
        const response = reactive<T>({} as T);
        let err: AxiosResponse;
        setLoading(true);
        api()
            .then(res => {
                Object.assign(response, res);
            })
            .catch(error => {
                err = error;
            })
            .finally(() => {
                setLoading(false);
                resolve([response, err, loading]);
            });
    });
}
