import { isArray, isEmpty, isObject } from 'lodash-es';
import http from '@/utils/http';
import { unref } from 'vue';
import { TpfValidateRule } from '@/types';
import { checkRequired } from '@/formRuleConfig/Tpfrules';

export const treeToList = (list: any[], level = 0) => {
    let arr = [] as any[];
    list.forEach(item => {
        arr.push({ ...item, level });
        if (isArray(item.child) && item.child.length) {
            const res = treeToList(item.child, level + 1);
            arr = [...arr, ...res];
        }
    });

    return arr;
};

export const delNullKey = (list: any[]) => {
    return unref(list).map((item: any) => {
        Object.keys(item).forEach(k => {
            if ([undefined, null, ''].includes(item[k])) {
                delete item[k];
            }
        });
        return item;
    });
};

export const getRules = (list: any[]): TpfValidateRule => {
    return unref(list).reduce((t, v) => {
        if (Boolean(Number(v.required))) {
            t = { ...t, [v.field]: [checkRequired()] } as TpfValidateRule;
        }
        return t;
    }, {});
};

export const useHandleFormOps = () => {
    /**
     * 删除 required 属性
     * @param list
     * @returns
     */
    const removeRequired = (list: any[]) => {
        return unref(list).map(item => {
            delete item.required;
            return item;
        });
    };
    const handleOptions = (row: Record<string, any>) => {
        if (!row.options) return row;
        try {
            row.options = JSON.parse(row.options);
        } catch (error) {
            console.log('row.options---->error: ', error);
            row.options = [];
        }
        return row;
    };

    const handleMode = (row: Record<string, any>) => {
        if (row.mode !== 'multiple') return row;
        row.showArrow = true;
        row.maxTagCount = 'responsive';
        return row;
    };

    const handleInputNumber = (row: Record<string, any>) => {
        if (row.type !== 'InputNumber') return row;
        row.type = 'TpfInputNumber';
        row.fromSys = false;
        row.precision = Number(row.precision || 0);
        return row;
    };

    const handleCascader = (row: Record<string, any>, searchFromList: any[]) => {
        if (row.type !== 'Cascader') return row;
        const cascaderLoadData = async (selectedOptions: any) => {
            const targetOption = selectedOptions[selectedOptions.length - 1];

            targetOption.loading = true;

            const findApiItemChild = unref(searchFromList).find(
                item => item.field === targetOption.field
            ).child;
            const apiItem = findApiItemChild.find(
                (child: any) => child.level === targetOption.level
            );

            const fieldNames = isObject(apiItem?.fieldNames)
                ? apiItem?.fieldNames
                : JSON.parse(apiItem.fieldNames || '{"value":"value","label":"label"}');

            apiItem.fieldNames = fieldNames;

            const res = await http.get(`/api/${apiItem.address}`, {
                params: { [apiItem.parameter]: targetOption.value }
            });
            targetOption.children = res.data.list.map((item: any) => {
                return {
                    ...item,
                    level: targetOption.level + 1,
                    field: targetOption.field,
                    isLeaf: targetOption.level === findApiItemChild.length - 1,
                    value: item[fieldNames.value],
                    label: item[fieldNames.label]
                };
            });
            targetOption.loading = false;
        };
        if (!isEmpty(row.child)) {
            row.child = treeToList(row.child);
            row.changeOnSelect = true;
            row.loadData = cascaderLoadData;
        }
        return row;
    };

    const handleDateRangePicker = (row: Record<string, any>) => {
        if (!['DatePicker', 'RangePicker'].includes(row.type)) return row;

        if (row.showTime) {
            row.format = row.format || 'YYYY-MM-DD HH:mm:ss';
        } else {
            row.format = row.format || 'YYYY-MM-DD';
        }
        row.valueFormat = row.valueFormat || row.format;
        return row;
    };

    const handleAddress = (row: Record<string, any>) => {
        if (row.address && row.address.includes('/')) {
            const fieldNames = isObject(row.fieldNames)
                ? row.fieldNames
                : JSON.parse(row.fieldNames || '{"value":"value","label":"label"}');

            row.fieldNames = fieldNames;

            http.get(`/api/${row.address}`).then(optionList => {
                row.options = optionList.data.list.map((it2: any) => {
                    it2.isLeaf = false;
                    it2.level = 0;
                    it2.field = row.field;
                    it2.value = it2[fieldNames.value];
                    it2.label = it2[fieldNames.label];
                    return it2;
                });
            });
        }
    };

    const handleSearchList = <T = Record<string, any>>(searchFromList: T[]): T[] => {
        const list = delNullKey(unref(searchFromList));
        list.forEach((item: Record<string, any>) => {
            item = handleOptions(item);

            item = handleDateRangePicker(item);

            item = handleCascader(item, unref(searchFromList));

            item = handleMode(item);
            item = handleInputNumber(item);

            handleAddress(item);
        });
        return unref(list);
    };

    return {
        handleSearchList,
        handleOptions,
        handleMode,
        handleCascader,
        handleAddress,
        delNullKey,
        getRules,
        handleInputNumber,
        removeRequired
    };
};
