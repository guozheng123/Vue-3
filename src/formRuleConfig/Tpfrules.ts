import { Rule } from 'ant-design-vue/lib/form';
import dayjs from 'dayjs';

//校验必填
export const checkRequired = (ops: { message?: string; required?: boolean } = {}) => {
    const { message = '必填字段！', required = true } = ops;

    return {
        required,
        message,
        trigger: ['change', 'blur']
    };
};
// 校验特殊字符
export const checkSpecial = (message = '不能含特殊字符') => {
    return {
        validator: async (_rule: Rule, value: string) => {
            if (!value) {
                return Promise.resolve();
            }
            // if (/['|"|&|/|\n|\r|\t|\b|\f|\\]/.test(value)) {
            //     return Promise.reject(message);
            // }
            return Promise.resolve();
        },
        trigger: ['change', 'blur']
    };
};
// 不能包含汉字
export const checkNoChinese = (message = '不能包含汉字') => {
    return {
        validator: async (_rule: any, value: string) => {
            if (/[\u4e00-\u9fa5]/.test(value)) {
                return Promise.reject(message);
            }
            return Promise.resolve();
        },
        trigger: ['change', 'blur']
    };
};
// 校验最大长度
export const checkMaxLength = (max = 12, message = '') => {
    return {
        max,
        message: message || `最大长度为${max}个字符`,
        trigger: ['change', 'blur']
    };
};

//校验非数字+字母组合
export const checkNumLetter = (ops: { message?: string; required?: boolean } = {}) => {
    const { message = '只允许数字字母组合!', required = false } = ops;
    return {
        validator: async (_rule: Rule, value: string) => {
            if (!value) {
                return Promise.resolve();
            }
            // if (!/^[A-Za-z0-9]+$/.test(value)) {
            //     return Promise.reject(message);
            // }
            return Promise.resolve();
        },
        required,
        trigger: ['change', 'blur']
    };
};
//校验非英文
export const checkLetter = (message = '只允许英文', required = false) => {
    return {
        validator: async (_rule: Rule, value: string) => {
            // if (/[\u4e00-\u9fa5]|[0-9]/.test(value)) {
            //     return Promise.reject(message);
            // }
            return Promise.resolve();
        },
        required,
        trigger: ['change', 'blur']
    };
};

//校验大于0的数字
export const checkGreaterThan = (message = '只允许大于0的数字') => {
    return {
        validator: async (_rule: Rule, value: number | string) => {
            if (value || value === 0) {
                if (!/^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/.test(String(value))) {
                    return Promise.reject(message);
                }
                return Promise.resolve();
            }
        },
        trigger: ['change']
    };
};

//校验邮箱

export const checkEmail = (message = '请输入正确邮箱格式') => {
    return {
        validator: async (_rule: Rule, value: number | string) => {
            if (value || value === 0) {
                if (
                    !/^[a-zA-Z0-9]+([-_.][A-Za-zd]+)*@([a-zA-Z0-9]+[-.])+[A-Za-zd]{2,5}$/.test(
                        String(value)
                    )
                ) {
                    return Promise.reject(message);
                }
                return Promise.resolve();
            }
        },
        trigger: ['change']
    };
};

//校验手机号
export const checkPhoneNumber = (message = '手机号码格式不对,请重新输入') => {
    return {
        validator: async (_rule: Rule, value: number | string) => {
            console.log(value);

            if (value || value === 0) {
                if (
                    !/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/.test(
                        String(value)
                    )
                ) {
                    return Promise.reject(message);
                }
                return Promise.resolve();
            }
        },
        trigger: ['blur']
    };
};

//校验字母数字 + 非特殊字符组合
/* eslint-disable no-useless-escape */

export const checkNumberAndLetter = (message = '不能含特殊字符') => {
    return {
        validator: async (_rule: Rule, value: string) => {
            if (!value) {
                return Promise.resolve();
            }

            // if (!/^[A-Za-z0-9\s'!@#$%^*_()\-+={}\[\]:;,<.>\?]+$/.test(value)) {
            //     return Promise.reject(message);
            // }
            return Promise.resolve();
        },
        trigger: ['change', 'blur']
    };
};

//开始时间不得大于结束时间

export const checkIsAfterTime = (
    row: Record<string, any>,
    message = '开始日期不得大于结束日期'
) => {
    return {
        validator: async (_rule: Rule, value: string) => {
            if (value && row.plannedEndDate) {
                if (dayjs(value).isAfter(dayjs(row.plannedEndDate))) {
                    return Promise.reject(message);
                }
                return Promise.resolve();
            }
        },
        trigger: ['change', 'blur']
    };
};

//结束时间不得小于开始时间
export const checkIsBeforeTime = (startTime = '', message = '结束日期不得小于开始日期') => {
    return {
        validator: async (_rule: Rule, value: string) => {
            if (value && startTime) {
                if (dayjs(value).isBefore(dayjs(startTime))) {
                    return Promise.reject(message);
                }
                return Promise.resolve();
            }
        },
        trigger: ['blur']
    };
};

// 不能包含空格
export const checkNoSpace = (message = '不能包含空格') => {
    return {
        validator: async (_rule: any, value: string) => {
            if (!/^[^\s]*$/.test(value)) {
                return Promise.reject(message);
            }
            return Promise.resolve();
        },
        trigger: ['change', 'blur']
    };
};

/**
 *  大于0
 * @param _rule
 * @param value
 * @returns
 */
export const checkMoreZero = (message = '必须大于0') => {
    return {
        validator: async (_rule: any, value: string) => {
            if ([null, undefined, ''].includes(value)) {
                return Promise.resolve();
            }
            if (Number(value) === 0) {
                return Promise.reject(message);
            }

            return Promise.resolve();
        },
        trigger: ['change', 'blur']
    };
};
