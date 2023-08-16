import { findListItem } from '@/utils';
import { storeToRefs } from 'pinia';
import { unref } from 'vue';
import { useStore } from '@/store/index';

/**
 * 获取系统配置是否集团化管理
 */
export const getSysGroupManagement = () => {
    const { userStore } = useStore();
    const { sysParameterList } = storeToRefs(userStore);

    return (
        findListItem(unref(sysParameterList), 'parameterCode', 'groupManagement').defaultValue ===
        'true'
    );
};

/**
 * 获取系统配置小数
 */
export const getSysDecimalPlaces = () => {
    const { userStore } = useStore();
    const { sysParameterList } = storeToRefs(userStore);

    return Number(
        findListItem(unref(sysParameterList), 'parameterCode', 'decimalPlaces').defaultValue
    );
};

/**
 * 获取系统配置初始化密码
 */
export const getSysInitializePass = () => {
    const { userStore } = useStore();
    const { sysParameterList } = storeToRefs(userStore);

    return Number(
        findListItem(unref(sysParameterList), 'parameterCode', 'initializePass').defaultValue
    );
};
