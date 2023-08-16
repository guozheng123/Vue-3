import { useStore } from '@/store';

/**
 * 转成系统配置的小数精度的格式
 * @param val
 * @returns
 */
export const toSysNumber = (val: any) => {
    if ([null, undefined, ''].includes(val)) {
        return '';
    }
    if (isNaN(Number(val))) return val;
    const { userStore } = useStore();
    return Number(val).toFixed(userStore.decimalPlaces);
};

/**
 * 计算基本数量
 * @param record
 * @returns
 */
export const useCalcBasicQuantity = (record: any, k: string) => {
    let rate = 0;
    const { productUnitUsage, materialUnitUsage } = record;
    if (productUnitUsage && materialUnitUsage) {
        rate = materialUnitUsage / productUnitUsage;
    }
    const res = toSysNumber(Number(record[Number(k)] || 0) * rate);

    return res;
};
