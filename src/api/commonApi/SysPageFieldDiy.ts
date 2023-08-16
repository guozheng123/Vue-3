import {
    ResQueryPageFieldDiyListForInsertOrUpdate,
    useHandleFormOps,
    useSysPageFieldDiyApi
} from '@/api';
import { checkMaxLength, checkRequired } from '@/formRuleConfig/Tpfrules';
import type { TpfValidateRule } from '@/types';
import { computed } from 'vue';
import { ref, unref } from 'vue';

export const getQueryPageFieldDiyListForInsertOrUpdate = (entityCode: any) => {
    const sysPageFieldDiyApi = useSysPageFieldDiyApi();
    const { handleSearchList } = useHandleFormOps();

    const fieldList = ref<ResQueryPageFieldDiyListForInsertOrUpdate[]>([]);
    const rules = ref<TpfValidateRule>({});

    sysPageFieldDiyApi.queryPageFieldDiyListForInsertOrUpdate({ entityCode }).then(res => {
        fieldList.value = handleSearchList(res.data.list).filter(item => item.visible);
        rules.value = getRules(unref(fieldList));
    });

    const getRules = (list: ResQueryPageFieldDiyListForInsertOrUpdate[]): TpfValidateRule => {
        const res = unref(list).reduce((t, v) => {
            if (Boolean(Number(v.required))) {
                t[v.field] = [checkRequired()];
            }
            if (v.type === 'Input') {
                t[v.field] = [...(t[v.field] || []), checkMaxLength(100)];
            }
            if (v.type === 'Textarea') {
                t[v.field] = [...(t[v.field] || []), checkMaxLength(200)];
            }
            return t;
        }, {});
        return res;
    };

    const DIYFieldList = computed(() => {
        return unref(fieldList).map(item => {
            const newItem = { ...item } as any;
            delete newItem.required;
            return newItem;
        });
    });

    return { DIYFieldList, rules };
};
