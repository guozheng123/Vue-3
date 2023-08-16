import { toDateString } from 'xe-utils';
import { isArray, isEmpty, isPlainObject } from 'lodash-es';
import type { Dayjs } from 'dayjs';
import BigNumber from 'bignumber.js';
import { unref } from 'vue';

/**
 * 格式化 时间
 * @param key  key = 时间 ， value=想要的格式
 * @returns
 */
export const formatTime = (key: string, value = 'yyyy-MM-dd HH:mm:ss') => {
    return toDateString(key, value);
};

/**
 * 格式化 枚举
 * @param key  key = 枚举key ， enumList=枚举列表
 * @returns
 */
export const formateEnum = (key: string, enumList: any) => {
    return enumList[key];
};

/**
 * 格式化 枚举
 * @param key  key = 枚举key ， enumList=枚举列表
 * @returns
 */
export const formateBool = (value: number) => {
    return value ? '是' : '否';
};

/**
 * 将tree转义为汉字
 * @param codeList string[]
 * @param emblem 拼接符号
 * @returns
 */
export const formateTreeCode = (
    arr: any[] = [],
    codeList: string[] | null,
    fieldNames = { label: 'label', value: 'value', children: 'children' },
    emblem = '/'
) => {
    if (!codeList || codeList.length === 0) return;
    const res = getTreeName(arr, codeList, fieldNames);
    return res.join(emblem);
};

const getTreeName = (
    list: TpfCity[],
    val: string[],
    fieldNames = { label: 'label', value: 'value', children: 'children' }
) => {
    const nameList = [] as string[];
    list.forEach(item => {
        if (val.length === 0) return;
        if (item[fieldNames.value] === val[0]) {
            nameList.push(item[fieldNames.label]);
            if (isArray(item[fieldNames.children])) {
                const res = getTreeName(item[fieldNames.children], val.slice(1), fieldNames);
                nameList.push(...res);
            }
        }
    });
    return nameList;
};

/**
 * 格式化 时间
 * @param key  key = 时间 ， value=想要的格式
 * @returns
 */
export const fmtDayjsTime = (time: Dayjs | '', format = 'YYYY-MM-DD') => {
    if (!time) return time;
    if (typeof time.format === 'function') {
        return time.format(format);
    } else {
        return time;
    }
};

/**
 * 获取 对象中的某有一个属性值，并设置默认
 * @param row
 * @param k
 * @returns
 */
export const getDescText = (row: { [k: string]: any }, k: string) => {
    const res = row[k];
    return [null, undefined, ''].includes(res) ? '--' : res;
};

/**
 *  仅将null, undefined, '' 转为布尔值
 * @param val
 * @returns
 */
export const getBoolean = (val: any) => {
    return [null, undefined, ''].includes(val);
};

/**
 *
 * @param list  数组
 * @param findKey 查找的key
 * @param findVal 查找key 等于的值
 * @returns
 */
export const findListItem = (list: any[], findKey: string, findVal: string) => {
    return list.find(item => item[findKey] === findVal) || {};
};

/**
 * 将字符串转成数字
 * @param str
 * @returns
 */
export const strToCharCodeAt = (str: string) => {
    const res = str.replace(/\D/gi, ((val: string) => val.charCodeAt(0)) as any);
    return new BigNumber(res).toString();
};

/**
 * 将数组中隐藏的去除
 * @param list
 * @returns
 */
export const filterHidden = (list: Record<string, any>[]) => {
    const res = list.filter(item => item.visible !== false && item.hidden !== true);
    return checkPermission(res);
};

/**
 * 校验用户权限
 * @param list
 * @returns
 */
export const checkPermission = <T>(list: T[]) => {
    const permissionList = ['xxx'];
    return list.filter((item: any) => {
        let permission = item;
        if (isPlainObject(item)) {
            permission = item.permission;
        }
        if (!permission) return true;
        if (isArray(permission) && !isEmpty(permission)) {
            return permission.every(per => permissionList.includes(per));
        }
        return false;
    });
};

/**
 * 获取当前后端服务域名
 * @returns
 */
export const getAppRoot = () => {
    const origin = window.location.origin.toString();

    //正式
    if (origin.startsWith('https://tmgc2-tpf.imefuture.com')) {
        return 'https://tmgc2-gateway.imefuture.com';
    }
    // beta
    if (origin.startsWith('https://beta-ime-tpf-vue.imefuture.com')) {
        return `https://beta-tmgc2-gateway.imefuture.com`;
    }
    // dev
    if (origin.startsWith('https://dev-ime-tpf-vue.imefuture.com')) {
        return `https://dev-tmgc2-gateway.imefuture.com`;
    }
    // 本地
    const { VITE_APP_API_ROOT = '' } = import.meta.env;

    return VITE_APP_API_ROOT;
};

/**
 * 获取树的选中的节点- 包含半选的父节点
 * @param list
 * @param k
 * @returns
 */
export const getTreeCheckedIds = ({
    list = [],
    checkedIds = [] as any[],
    fieldNames = { children: 'children', title: 'label', key: 'id' }
}) => {
    let res = [] as string[];
    unref(list).forEach(item => {
        if (unref(checkedIds).includes(item[fieldNames.key])) {
            res = [...res, item[fieldNames.key]];
        }
        if (isArray(item[fieldNames.children]) && !isEmpty(item[fieldNames.children])) {
            let childRes = getTreeCheckedIds({
                list: item[fieldNames.children],
                checkedIds,
                fieldNames
            });
            if (childRes.length) {
                childRes = [...childRes, item[fieldNames.key]];
            }
            res = [...res, ...childRes];
        }
    });
    return [...new Set(res)];
};
