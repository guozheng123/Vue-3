import { MaybeElement, MaybeElementRef, useIntersectionObserver } from '@vueuse/core';
import type { DirectiveBinding, ObjectDirective } from 'vue';

type Pager = {
    current: number;
    pageSize: number;
    total: number;
    totalPage: number;
};

const Intersection = (
    target: MaybeElementRef<MaybeElement>,
    pager: Pager,
    fetAPi: () => Promise<any>
) => {
    const { stop } = useIntersectionObserver(target, async ([{ isIntersecting }]) => {
        if (isIntersecting) {
            if (pager.current > Math.ceil(pager.total / pager.pageSize)) {
                stop();
                return;
            }
            stop();
            await fetAPi();
        }
    });
};

/**
 * @author wangkang
 *  下拉加载只能用于antd的table V 指令
 */
export default {
    mounted: async (
        el: HTMLElement,
        params: DirectiveBinding<{
            api: (params?: { h5?: boolean }) => Promise<any>;
            pager: Pager;
        }>
    ) => {
        const { api, pager } = params.value;
        let lastTr = {} as any;
        let trList = [] as Element[];

        const fetAPi = async () => {
            await api({ h5: true });
            trList = [...el.querySelectorAll('.ant-table-tbody .ant-table-row')];
            lastTr = trList.at(-1) as MaybeElementRef<MaybeElement>;
            Intersection(lastTr, pager, fetAPi);
        };
        await fetAPi();
    }
} as ObjectDirective;
