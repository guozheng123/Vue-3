import { encode, decode } from 'js-base64';
import { isEmpty } from 'lodash-es';

/**
 *
 * @returns  js-base64 加密地址栏参数
 */
export const useRouteBase64 = () => {
    /**
     *
     * @param params 加密参数
     * @returns
     */
    const encodeParams = (params: Record<string, any> = {}) => {
        return {
            sign: encode(JSON.stringify({ ...params }))
        };
    };

    /**
     *
     * @param str 解密参数
     * @returns
     */
    const decodeParams = <T>(str: { sign: string }): T => {
        if (isEmpty(str)) return {} as T;
        return JSON.parse(decode(str.sign));
    };

    return {
        encodeParams,
        decodeParams
    };
};
