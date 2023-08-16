import BigNumber from 'bignumber.js';

export const useBigNumber = () => {
    /**
     * 加
     * @param a
     * @param b
     * @returns
     */
    const plus = (a: any, b: any) => {
        if (isNaN(a) || isNaN(b)) {
            throw new Error('NAN 不可进行运算');
        }
        return new BigNumber(a).plus(b).toNumber();
    };

    /**
     * 减
     * @param a
     * @param b
     * @returns
     */
    const minus = (a: any, b: any) => {
        if (isNaN(a) || isNaN(b)) {
            throw new Error('NAN 不可进行运算');
        }
        return new BigNumber(a).minus(b).toNumber();
    };

    /**
     * 乘
     * @param a
     * @param b
     * @returns
     */
    const multipliedBy = (a: any, b: any) => {
        if (isNaN(a) || isNaN(b)) {
            throw new Error('NAN 不可进行运算');
        }
        return new BigNumber(a).multipliedBy(b).toNumber();
    };

    /**
     * 除
     * @param a
     * @param b
     * @returns
     */
    const dividedBy = (a: any, b: any) => {
        if (isNaN(a) || isNaN(b)) {
            throw new Error('NAN 不可进行运算');
        }
        return new BigNumber(a).dividedBy(b).toNumber();
    };

    return { plus, minus, multipliedBy, dividedBy };
};
