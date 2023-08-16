<template> <vNode /> </template>

<script setup lang="tsx" name="TpfForm">
    import {
        h,
        useSlots,
        computed,
        defineAsyncComponent,
        unref,
        ref,
        watchEffect,
        nextTick,
        CSSProperties,
        resolveComponent
    } from 'vue';
    import * as antd from 'ant-design-vue';
    import { useAntdForm } from '@/hooks';
    import { SearchOutlined, SyncOutlined } from '@ant-design/icons-vue';
    import SvgIcon from '@/components/SvgIcon/index.vue';

    import { PageCodeEnum } from '@/config';
    import { useStore } from '@/store';
    import { storeToRefs } from 'pinia';
    import { filterHidden, fmtDayjsTime } from '@/utils';
    import { initSearchFormConfig } from '@/api';
    import { fmtTpfForm } from './fmtTpfForm';
    import type { TpfValidateRule } from '@/types';
    import dayjs from 'dayjs';
    import { isArray } from 'lodash-es';

    const { getNullArr, handleFormJson } = fmtTpfForm();
    const { cacheSearchStore } = useStore();
    const { cacheList } = storeToRefs(cacheSearchStore);
    const TpfChangeFiled = defineAsyncComponent(() => import('./OperateAction/TpfChangeFiled.vue'));

    type Props = {
        hiddenChangeFiled?: boolean;
        pageCode?: PageCodeEnum | any;
        noUseInit?: boolean;
        noUseCache?: boolean;
        hiddenCollapse?: boolean;
        hiddenSubmit?: boolean;
        formState?: { [k: string]: any };
        formList?: any[];
        formProps?: antd.FormProps;
        rowProps?: antd.RowProps;
        colProps?: antd.ColProps;
        formItemProps?: antd.FormItemProps;
        rules?: any | TpfValidateRule;
        labelCol?: { style: CSSProperties };
        beforeRender?: <T>(list: T[]) => T[];
        isConfig?: boolean; //是否为新配置接口
    };

    const props = withDefaults(defineProps<Props>(), {
        formList: () => [],
        colProps: () => ({ span: 6 }), //2,3,4,6,8,12,24//必须被24整除
        labelCol: () => ({ style: { width: '90px' } }),
        pageCode: ''
    });
    const emit = defineEmits<{
        (e: 'onSubmit', val: any): void;
    }>();

    /**
     * 折叠状态
     */
    const collapse = ref(true);

    /**
     * 收集到的表单数据
     */
    const newState = ref<{ [k: string]: any }>({});

    /**
     * 渲染的表单列表
     */
    const showFormList = ref<any[]>([]);

    /**
     * 所有的字段
     */
    const allFiled = ref<string[]>([]);

    /**
     * 所有的默认值
     */
    const allDefaultValue = ref<any[]>([]);

    /**
     * 获取默认值
     */
    const stopGetDefaultValue = watchEffect(() => {
        if (unref(showFormList).length) {
            allDefaultValue.value = unref(showFormList).map(item => {
                let showDefaultValue = null;
                if (item.mode === 'multiple') {
                    if (item.showDefaultValue) {
                        showDefaultValue = item.showDefaultValue;
                    } else {
                        showDefaultValue = [];
                    }
                }
                return { field: item.field, showDefaultValue };
            });
        }
        if (props.formList.length) {
            // 获得默认值
            allDefaultValue.value = props.formList.map(item => {
                let showDefaultValue = null;
                if (item.mode === 'multiple') {
                    if (item.showDefaultValue) {
                        showDefaultValue = item.showDefaultValue;
                    } else {
                        showDefaultValue = [];
                    }
                }
                return { field: item.field, showDefaultValue };
            });
        }
    });
    watchEffect(() => {
        if (unref(allDefaultValue).length) {
            stopGetDefaultValue();
        }
    });

    /**
     * 重置默认值
     */
    const resetAllFiled = () => {
        unref(allDefaultValue).forEach(item => {
            newState.value[item.field] = item.showDefaultValue;
        });
    };

    const slots = useSlots();

    const allQueryTermsJson = computed(() => {
        // 获得接口返回的配置信息
        if (!props.pageCode) return [];
        if (!unref(cacheList)[props.pageCode]) return [];
        return unref(cacheList)[props.pageCode].queryTermsJson;
    });

    const getShowFormList = () => {
        if (props.pageCode) {
            // 有pageCode 走接口缓存
            if (!unref(allQueryTermsJson).length) return [];
            const res = handleFormJson(unref(allQueryTermsJson));
            return res;
        }
        // 走传入的 list
        const res = handleFormJson(filterHidden(props.formList));

        return res;
    };

    watchEffect(() => {
        showFormList.value = getShowFormList();
        allFiled.value = unref(showFormList).map(item => item.field);
    });

    const showCollapse = computed(() => {
        if (props.hiddenCollapse) {
            return false;
        }
        if (unref(showFormList).length <= 3) {
            return false;
        }
        return true;
    });

    const stop = watchEffect(() => {
        if (!unref(showFormList).length) return;
        if (props.formState) {
            //传了 formState 直接使用
            newState.value = props.formState;
        } else {
            // 从 showFormList 中获得
            newState.value = unref(showFormList).reduce((t, v) => {
                let value = null;
                if (props.noUseCache) {
                    value = v.showDefaultValue;
                } else {
                    value = v.cacheValue || v.showDefaultValue;
                }
                t[v.field] = value === undefined ? null : v.showDefaultValue;
                if (v.mode === 'multiple') {
                    v.maxTagCount = 'responsive';
                    t[v.field] = v.showDefaultValue ? v.showDefaultValue : [];
                }
                return t;
            }, {} as any);
        }
    });

    watchEffect(() => {
        if (Object.keys(unref(newState)).length) {
            stop();
        }
    });

    if (props.pageCode) {
        initSearchFormConfig({ pageCode: props.pageCode, beforeRender: props.beforeRender });
    }

    const lineNum = computed(() => {
        const span = props.colProps.span;
        // 一行几个
        return 24 / Number(span);
    });

    const { formRef, validateFields, clearValidate } = useAntdForm();

    /**
     * 切换隐藏
     */
    const toggleCollapse = () => {
        clearValidate(unref(allFiled));
        collapse.value = !collapse.value;
    };

    watchEffect(() => {
        if (unref(allFiled).length < unref(lineNum)) {
            collapse.value = true;
        }
    });

    const onSubmit = async () => {
        isInit.value = true;
        const res = (await validateFields(unref(allFiled))) || {};
        // console.log('TpfForm所有的字段', res, unref(allFiled));
        const submitForm = Object.keys(res).reduce((t, v) => {
            let row = res[v];
            const thatForm = unref(showFormList).find(i => i.field === v);
            if (!thatForm) return t;
            if (v.includes('@_@')) {
                row = row || [];
                const fieldList = v.split('@_@') || [];
                fieldList.forEach((o, inx) => {
                    t[o] = thatForm.format ? fmtDayjsTime(row[inx], thatForm.format) : row[inx];
                });
            } else {
                if (thatForm.format) {
                    t[v] = row ? fmtDayjsTime(row, thatForm.format) : row;
                } else {
                    t[v] = row;
                }
            }
            return t;
        }, {});

        let params = submitForm;
        if (props.isConfig) {
            let requiredFields = [];
            const cacheTableHeaderList = cacheSearchStore.getUploadLoadSortColumns(props.pageCode);
            requiredFields = cacheTableHeaderList.map(e => e.dataIndex);
            const conditions = Object.keys(submitForm)
                .map(key => ({
                    conditionFieldName: key,
                    value: res[key]
                }))
                .filter(e => e.value !== null);
            params = {
                mainEntityCode: props.pageCode,
                requiredFields: requiredFields,
                conditions: conditions
            };
        }
        console.log('onSubmit的参数', params);
        emit('onSubmit', params || {});
        return params;
    };

    const FormListLayout = computed(() => {
        if (props.hiddenCollapse) {
            const lastItem = unref(showFormList).length % unref(lineNum);
            return {
                topLayout: unref(showFormList).slice(0, -lastItem),
                bottomLayout: [
                    ...unref(showFormList).slice(-lastItem),
                    ...getNullArr(unref(lineNum) - lastItem - 1)
                ]
            };
        }
        if (collapse.value) {
            if (unref(showFormList).length < unref(lineNum)) {
                return {
                    topLayout: [],
                    bottomLayout: [
                        ...unref(showFormList),
                        ...getNullArr(unref(lineNum) - unref(showFormList).length - 1)
                    ]
                };
            }
            if (unref(showFormList).length > 2 * unref(lineNum) - 1) {
                return {
                    topLayout: unref(showFormList).slice(0, unref(lineNum)),
                    bottomLayout: unref(showFormList).slice(unref(lineNum), 2 * unref(lineNum) - 1)
                };
            }
            if (unref(showFormList).length > unref(lineNum) - 1) {
                return {
                    topLayout: [],
                    bottomLayout: unref(showFormList).slice(0, unref(lineNum) - 1)
                };
            }
            return {
                topLayout: [],
                bottomLayout: unref(showFormList)
            };
        } else {
            const lastItem = unref(showFormList).length % unref(lineNum);
            return {
                topLayout: unref(showFormList).slice(0, -lastItem),
                bottomLayout: [
                    ...unref(showFormList).slice(-lastItem),
                    ...getNullArr(unref(lineNum) - lastItem - 1)
                ]
            };
        }
    });

    /**
     * 数据回填校验
     * @param field
     * @param info
     */
    const formatVal = (field: string, info: Record<string, any>) => {
        const findItem = unref(showFormList).find(item => item.field === field) || {};
        if (['DatePicker', 'RangePicker'].includes(findItem.type)) {
            if (isArray(info[field])) {
                return info[field].map((item: string) => dayjs(item));
            }
            return dayjs(info[field]);
        }
        if (['InputNumber'].includes(findItem.type)) {
            return null;
        }
        if (info[field]?._isBigNumber) {
            return info[field].toString();
        }
        return info[field];
    };
    const setNewState = (info = {}) => {
        // 只对显示的字段有效果
        Object.keys(info).forEach(k => {
            newState.value[k] = formatVal(k, info);
        });
    };

    defineExpose({ onSubmit, newState, formRef, setNewState, validateFields, clearValidate });

    const isInit = ref(false);

    watchEffect(async () => {
        if (!cacheSearchStore.pageJsonIsEmpty(props.pageCode)) {
            if (!props.noUseInit && !unref(isInit)) {
                await nextTick();
                onSubmit();
            }
        }
        if (!props.pageCode) {
            if (!props.noUseInit && !unref(isInit)) {
                await nextTick();
                onSubmit();
            }
        }
    });

    const renderRow = (list: any[], isBottom: boolean) => (
        <antd.Row gutter={10} {...(props.rowProps || {})}>
            {list.map((item, inx) => {
                const {
                    description,
                    field,
                    label,
                    type,
                    style = {},
                    bindValue = 'value',
                    slots = {},
                    props: itemProps = {},
                    ...args
                } = item;

                let renderType = type;
                if (typeof type === 'string') {
                    renderType = antd[type] ? antd[type] : resolveComponent(type);
                }

                return (
                    <antd.Col key={inx} {...(props.colProps || {})}>
                        {field && type && (
                            <antd.FormItem
                                {...(props.formItemProps || {})}
                                name={field}
                                v-slots={{
                                    label: () => (
                                        <div
                                            class="t-flex"
                                            onClick={e => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                            }}
                                        >
                                            <antd.Tooltip class="line1" title={label}>
                                                {label}
                                            </antd.Tooltip>
                                            {!!description && (
                                                <div style={{ marginLeft: '3px' }}>
                                                    <antd.Tooltip class="line1" title={description}>
                                                        <SvgIcon
                                                            type="icon-jieshishuoming"
                                                            size="16"
                                                            cursor
                                                        />
                                                    </antd.Tooltip>
                                                </div>
                                            )}
                                        </div>
                                    )
                                }}
                            >
                                {field &&
                                    h(
                                        renderType,
                                        {
                                            [bindValue]: newState.value[field],
                                            [`onUpdate:${bindValue}`]: (val: any) => {
                                                newState.value[field] = val;
                                            },
                                            style: { width: '100%', ...style },
                                            ...args,
                                            ...itemProps
                                        },
                                        { ...slots }
                                    )}
                            </antd.FormItem>
                        )}
                    </antd.Col>
                );
            })}
            {isBottom && !props.hiddenSubmit && (
                <antd.Col {...(props.colProps || {})}>
                    <antd.FormItem {...(props.formItemProps || {})} class="last-content">
                        <antd.Space size={10}>
                            <antd.Button
                                onClick={onSubmit}
                                type="primary"
                                class="tpf-button"
                                icon={<SearchOutlined />}
                                disabled={!unref(showFormList).length}
                            >
                                查询
                            </antd.Button>
                            <antd.Button
                                onClick={resetAllFiled}
                                class="tpf-button"
                                icon={<SyncOutlined />}
                                disabled={!unref(showFormList).length}
                            >
                                重置
                            </antd.Button>
                            {!!unref(showCollapse) && (
                                <div class="icon-position">
                                    <SvgIcon
                                        type={unref(collapse) ? 'icon-zhankai' : 'icon-zhedie'}
                                        cursor
                                        shadow
                                        size="24"
                                        style="color: #1d2129"
                                        onClick={toggleCollapse}
                                    />
                                </div>
                            )}
                            {!props.hiddenChangeFiled && !!unref(allQueryTermsJson).length && (
                                <TpfChangeFiled class="icon-position" pageCode={props.pageCode} />
                            )}
                        </antd.Space>
                    </antd.FormItem>
                </antd.Col>
            )}
        </antd.Row>
    );

    const vNode = () => (
        <antd.Form
            ref={formRef}
            class="tpf-form"
            model={unref(newState)}
            labelCol={props.labelCol}
            rules={props.rules || undefined}
            {...(props.formProps || {})}
            v-slots={slots}
        >
            {!!FormListLayout.value.topLayout.length &&
                renderRow(FormListLayout.value.topLayout, false)}
            {!!FormListLayout.value.bottomLayout.length &&
                renderRow(FormListLayout.value.bottomLayout, true)}
        </antd.Form>
    );
</script>

<style lang="less">
    .tpf-form {
        padding: 10px 12px 0;
        box-sizing: border-box;

        .last-content {
            .ant-form-item-control-input-content {
                display: flex;
                justify-content: flex-end;
            }
        }

        .icon-position {
            display: flex;
            align-items: center;
        }
    }
</style>
