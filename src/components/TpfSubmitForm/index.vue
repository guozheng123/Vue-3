<template> <vNode /> </template>

<script setup lang="tsx">
    import { h, useSlots, unref, ref, watchEffect, CSSProperties } from 'vue';
    import * as antd from 'ant-design-vue';
    import { useAntdForm, useGetSysCom } from '@/hooks';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { filterHidden, fmtDayjsTime } from '@/utils';
    import { fmtTpfForm } from './fmtTpfForm';
    import type { TpfValidateRule } from '@/types';
    import dayjs from 'dayjs';
    import { isArray, isEmpty } from 'lodash-es';

    const { handleFormJson } = fmtTpfForm();

    type Props = {
        formList?: any[];
        formProps?: antd.FormProps;
        rowProps?: antd.RowProps;
        colProps?: antd.ColProps;
        formItemProps?: antd.FormItemProps;
        rules?: any | TpfValidateRule;
        labelCol?: { style: CSSProperties };
    };

    const props = withDefaults(defineProps<Props>(), {
        formList: () => [],
        colProps: () => ({ span: 6 }), //2,3,4,6,8,12,24//必须被24整除
        labelCol: () => ({ style: { width: '90px' } })
    });
    const emit = defineEmits<{
        (e: 'onSubmit', val: any): void;
        (e: 'enter'): void;
    }>();

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
    // const allDefaultValue = ref<any[]>([]);

    /**
     * 获取默认值
     */
    // const getAllDefaultValue = () => {
    //     if (props.formList.length) {
    //         // 获得默认值
    //         allDefaultValue.value = props.formList.map(item => {
    //             let showDefaultValue = null as any;
    //             if (item.mode === 'multiple') {
    //                 if (item.showDefaultValue) {
    //                     showDefaultValue = item.showDefaultValue;
    //                 } else {
    //                     showDefaultValue = [];
    //                 }
    //             }
    //             return { field: item.field, showDefaultValue };
    //         });
    //     }
    // };

    /**
     * 重置默认值
     */
    // const resetAllFiled = () => {
    //     unref(allDefaultValue).forEach(item => {
    //         newState.value[item.field] = item.showDefaultValue;
    //     });
    // };

    const slots = useSlots();

    const getShowFormList = () => {
        // 走传入的 list
        showFormList.value = handleFormJson(filterHidden(props.formList));
    };
    /**
     * 获取所有的字段
     */
    const getAllFiled = () => {
        allFiled.value = unref(showFormList).map(item => item.field);
    };

    const renderNewState = () => {
        if (!isEmpty(unref(newState))) return;
        // 从 showFormList 中获得
        newState.value = unref(showFormList).reduce((t, v) => {
            let value = null;
            value = v.showDefaultValue;
            t[v.field] = value === undefined ? null : v.showDefaultValue;
            if (v.mode === 'multiple') {
                v.maxTagCount = 'responsive';
                t[v.field] = v.showDefaultValue ? v.showDefaultValue : [];
            }
            return t;
        }, {} as any);
    };

    watchEffect(() => {
        getShowFormList();
        getAllFiled();
        renderNewState();
        // getAllDefaultValue();
    });

    const { formRef, validateFields, clearValidate } = useAntdForm();

    const onSubmit = async () => {
        const res = (await validateFields(unref(allFiled))) || {};
        // console.log('TpfForm所有的字段', res, unref(allFiled));
        const submitForm = Object.keys(res).reduce((t, v) => {
            let row = res[v];
            const thatForm = unref(showFormList).find(i => i.field === v);
            if (!thatForm) return t;
            const format = thatForm.format || (thatForm.props || {}).format;
            if (v.includes('@_@')) {
                row = row || [];
                const fieldList = v.split('@_@') || [];
                fieldList.forEach((o, inx) => {
                    t[o] = format ? fmtDayjsTime(row[inx], format) : row[inx];
                });
            } else {
                if (format) {
                    t[v] = row ? fmtDayjsTime(row, format) : row;
                } else {
                    t[v] = row;
                }
            }
            return t;
        }, {});

        console.log('onSubmit的参数', submitForm);
        emit('onSubmit', submitForm || {});
        return submitForm;
    };

    // const FormListLayout = computed(() => {
    //     return unref(showFormList);
    // });

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

    const renderRow = (list: any[]) => {
        return (
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
                                                        <antd.Tooltip
                                                            class="line1"
                                                            title={description}
                                                        >
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
                                            useGetSysCom(type),
                                            {
                                                [bindValue]: newState.value[field],
                                                [`onUpdate:${bindValue}`]: (val: any) => {
                                                    newState.value[field] = val;
                                                },
                                                style: { width: '100%', ...style },
                                                onKeydown: (e: KeyboardEvent) => {
                                                    if (e.keyCode === 13) {
                                                        emit('enter');
                                                    }
                                                },
                                                allowClear: true,
                                                ...itemProps,
                                                ...args
                                            },
                                            {
                                                ...slots
                                            }
                                        )}
                                </antd.FormItem>
                            )}
                        </antd.Col>
                    );
                })}
            </antd.Row>
        );
    };

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
            {!!unref(showFormList).length && renderRow(unref(showFormList))}
        </antd.Form>
    );
</script>

<style lang="less">
    .tpf-form {
        padding: 10px 12px 0;
        box-sizing: border-box;

        // .last-content {
        //     .ant-form-item-control-input-content {
        //         display: flex;
        //         justify-content: flex-end;
        //     }
        // }

        // .icon-position {
        //     display: flex;
        //     align-items: center;
        // }
    }
</style>
