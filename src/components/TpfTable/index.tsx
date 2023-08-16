import TpfOperateColumn from './TpfTableOperateColumn.vue';
import BigNumber from 'bignumber.js';

export const withTpfTableOperateColumn =
    (...args: any[]) =>
    (defaultBtn: any[] = [], moreBtn: any[] = []) =>
        <TpfOperateColumn defaultBtn={defaultBtn} moreBtn={moreBtn} {...args[0]} />;

//数字+字母排序
export const withTpfTableSortColumn = (a: any, b: any) => (k: string) => {
    a[k] = a[k] || '';
    b[k] = b[k] || '';
    const a1 = a[k].replace(/\D/gi, ((val: string) => val.charCodeAt(0)) as any);
    const b1 = b[k].replace(/\D/gi, ((val: string) => val.charCodeAt(0)) as any);
    return new BigNumber(a1).minus(b1).toNumber();
};

//日期排序
export const withTpfTableSortDate = (a: any, b: any) => (k: string) => ({
    compare: (a: any, b: any) => +new Date(a[k]) - +new Date(b[k])
});
