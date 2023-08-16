<template> <VNode /> </template>

<script setup lang="tsx">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useAntdForm, useRef } from '@/hooks';
    import TpfTable from '@/components/TpfTable/index.vue';
    import { ref, computed, unref, useCssModule } from 'vue';
    import { tableResizable, PageCodeEnum } from '@/config';
    import type { TpfColumnType, TpfValidateRule } from '@/types';
    import { checkRequired } from '@/formRuleConfig/Tpfrules';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { useSysPageFieldDiyApi } from '@/api';
    import { useStore } from '@/store';
    import type { ResDiyPageQuery, ResGetDiyFieldType, ReqCreateDiyField } from '@/api';
    import type { Rule } from 'ant-design-vue/lib/form';
    import { isEmpty } from 'lodash-es';
    import { useTpfInput } from '@/components';

    import {
        Form,
        FormItem,
        FormItemRest,
        Input,
        Checkbox,
        Button,
        Row,
        Col,
        InputNumber,
        Select,
        TableSummary,
        TableSummaryCell,
        Switch,
        Textarea
    } from 'ant-design-vue';

    const { TpfInput } = useTpfInput();

    const { cacheSearchStore } = useStore();

    type Props = {
        pageCode: PageCodeEnum;
    };

    const props = defineProps<Props>();

    const emit = defineEmits<{
        (e: 'updateTable'): void;
    }>();

    const sysPageFieldDiyApi = useSysPageFieldDiyApi();

    const { formRef, validateFields } = useAntdForm<FormTypes>();

    const rowInfo = ref({} as ResDiyPageQuery);

    const { formRef: TableForm, validateFields: validateTable } = useAntdForm();

    const readOnlyStatus = ref(false);

    const [visible, setVisible] = useRef(false);

    const [loading, setLoading] = useRef(false);

    type FormTypes = {
        fieldName: string; // 字段1名称
        displayOrdinal: number; //排序
        required: number; //是否必填
        search: number;
        fieldType: string; //字段类型
        accuracy: number;
        selections: { value: string; label: string }[]; //字段属性
        enable: string; //启用
        description: string; //提示说明
        showDefaultValue: any;
    };

    const initFormState = () => {
        return {
            fieldName: '', // 字段名称
            displayOrdinal: 0, //排序
            required: 0,
            search: 0,
            fieldType: '', //字段类型
            selections: [], //字段属性
            accuracy: 0,
            enable: '1', //启用
            description: '', //提示说明
            showDefaultValue: null
        };
    };

    const formState = ref<FormTypes>(initFormState());

    const useNumber = ref(false);

    const rules = computed(() => {
        return {
            fieldName: [checkRequired()],
            fieldType: [checkRequired()],
            selections: [
                checkRequired({
                    required: ['SelectDIY', 'SelectMultipleDIY'].includes(
                        unref(formState).fieldType
                    )
                })
            ]
        } as TpfValidateRule;
    });

    const tableRules = [
        checkRequired(),
        {
            validator: async (_rule: Rule, value: string) => {
                if (['', null, undefined].includes(value)) {
                    return Promise.resolve();
                }
                const sameNum = unref(formState).selections.reduce((t, v) => {
                    if (v.label === value) {
                        t += 1;
                    }
                    return t;
                }, 0);
                if (sameNum > 1) {
                    return Promise.reject('不可有重读的可选范围');
                }

                return Promise.resolve();
            },
            trigger: ['change', 'blur']
        }
    ] as TpfValidateRule[];

    const columns = computed(() => {
        return [
            {
                title: '可选范围',
                dataIndex: 'label',
                ...tableResizable(),
                width: 300,
                customRender: ({ record, index }) => (
                    <FormItem name={['selections', index, 'label']} rules={tableRules}>
                        <Input
                            v-model={[record.label, 'value']}
                            disabled={readOnlyStatus.value}
                            onChange={() => validateTable()}
                        />
                    </FormItem>
                )
            } as TpfColumnType,
            ['SelectDIY'].includes(unref(formState).fieldType) &&
                ({
                    title: '默认值',
                    dataIndex: 'default',
                    ...tableResizable(),
                    customRender: ({ record, index }) => (
                        <FormItem name={['selections', index, 'default']}>
                            <Checkbox
                                disabled={readOnlyStatus.value || !record.label}
                                checked={formState.value.showDefaultValue === record.label}
                                onChange={() => {
                                    if (record.label === formState.value.showDefaultValue) {
                                        formState.value.showDefaultValue = '';
                                    } else {
                                        formState.value.showDefaultValue = record.label;
                                    }
                                }}
                                class="radio-check"
                            />
                        </FormItem>
                    )
                } as TpfColumnType),
            {
                title: '操作',
                dataIndex: 'operate',
                ...tableResizable(),
                fixed: 'right',
                customRender: ({ index }) => {
                    if (readOnlyStatus.value) {
                        return null;
                    }
                    return (
                        <div
                            class="tpf-link"
                            onClick={() => unref(formState).selections.splice(index, 1)}
                        >
                            删除
                        </div>
                    );
                }
            } as TpfColumnType
        ].filter(o => o) as TpfColumnType[];
    });

    const diyFieldType = ref<ResGetDiyFieldType[]>([]);

    const getDiyFieldType = async () => {
        diyFieldType.value = await sysPageFieldDiyApi.getDiyFieldType().then(res => res.data.list);
    };
    const getSysPageFieldDiyById = async () => {
        const sysPageFieldDiyId = unref(rowInfo).sysPageFieldDiyId?.toString();
        if (!sysPageFieldDiyId) return;
        formState.value = (await sysPageFieldDiyApi
            .getSysPageFieldDiyById({
                sysPageFieldDiyId
            })
            .then(res => res.data.object)) as FormTypes;
        if (readOnlyStatus.value) {
            Object.keys(unref(formState)).forEach(k => {
                if ([null, undefined, ''].includes(unref(formState)[k])) {
                    unref(formState)[k] = '--';
                }
            });
        }
        useNumber.value = Boolean(unref(formState).accuracy);
    };

    const open = async (row: ResDiyPageQuery, isReadOnly = false) => {
        readOnlyStatus.value = Boolean(isReadOnly);
        setVisible(true);
        setLoading(true);
        formState.value = initFormState();
        await getDiyFieldType();
        rowInfo.value = row || {};
        await getSysPageFieldDiyById();
        setLoading(false);
    };

    const getSelections = (list: { value: string; label: string }[]) => {
        return list.map(item => ({
            label: item.label,
            value: item.label
        }));
    };

    const addSelections = () => {
        formState.value.selections = [
            ...(unref(formState).selections || []),
            { value: '', label: '' }
        ];
        validateFields('selections');
    };

    const getParams = () => {
        const {
            fieldName,
            fieldType,
            accuracy,
            showDefaultValue,
            displayOrdinal,
            enable,
            description,
            required,
            search,
            selections
        } = unref(formState);
        const hasSelect = ['SelectDIY', 'SelectMultipleDIY'].includes(fieldType);
        const params = {
            entityCode: props.pageCode,
            fieldName,
            required,
            search,
            enable,
            // accuracy: accuracy || 0,
            fieldType,
            displayOrdinal: displayOrdinal || 0,
            description,
            selections: hasSelect ? getSelections(selections) : null,
            showDefaultValue: showDefaultValue || ''
        } as ReqCreateDiyField;
        if (['InputNumberDIY'].includes(fieldType)) {
            params.accuracy = accuracy || 0;
        }
        if (!unref(useNumber)) {
            params.accuracy = 0;
        }
        if (['SelectMultipleDIY'].includes(fieldType)) {
            params.showDefaultValue = '';
        }
        return params;
    };

    const saveInfo = async () => {
        if (!props.pageCode) return;
        setLoading(true);
        try {
            await validateTable();
            await validateFields();
            const params = getParams();
            const sysPageFieldDiyId = unref(rowInfo).sysPageFieldDiyId?.toString();
            if (sysPageFieldDiyId) {
                params.sysPageFieldDiyId = sysPageFieldDiyId;
                params.dictType = unref(rowInfo).dictType;
                await sysPageFieldDiyApi.update(params);
            } else {
                await sysPageFieldDiyApi.create(params);
            }
            const { message } = await import('ant-design-vue');
            message.success('保存成功');
            cacheSearchStore.clearPageCodeCache(props.pageCode);
            setVisible(false);
            emit('updateTable');
        } catch (error) {
            console.log('error: ', error);
        } finally {
            setLoading(false);
        }
    };

    const showTitle = computed(() => {
        const sysPageFieldDiyId = unref(rowInfo).sysPageFieldDiyId?.toString();
        if (readOnlyStatus.value) return '查看自定义字段';
        if (sysPageFieldDiyId) return '编辑自定义字段';
        return '新增自定义字段';
    });

    const renderSelectList = () => {
        if (!['SelectDIY', 'SelectMultipleDIY'].includes(unref(formState).fieldType)) return null;
        return (
            <Col span={24}>
                <FormItem label="设置可选范围" name="selections">
                    <FormItemRest>
                        <Form model={formState.value} ref={TableForm}>
                            <TpfTable
                                class="tpf-table-form"
                                columns={unref(columns)}
                                dataSource={unref(formState).selections}
                                pagination={false}
                                v-slots={{
                                    summary: () => (
                                        <TableSummary>
                                            {!readOnlyStatus.value && (
                                                <TableSummaryCell colSpan={unref(columns).length}>
                                                    <div onClick={addSelections} class="summaryBtn">
                                                        <SvgIcon type="icon-insert" />
                                                        添加
                                                    </div>
                                                </TableSummaryCell>
                                            )}
                                        </TableSummary>
                                    )
                                }}
                            />
                        </Form>
                    </FormItemRest>
                </FormItem>
            </Col>
        );
    };

    const renderInputNumber = () => {
        if (!['InputNumberDIY'].includes(unref(formState).fieldType)) return null;
        return (
            <Checkbox v-model={[useNumber.value, 'checked']}>
                小数位数
                {unref(useNumber) && (
                    <InputNumber
                        disabled={readOnlyStatus.value}
                        class="t-ml-[5px]"
                        min={0}
                        max={8}
                        precision={0}
                        controls={false}
                        size="small"
                        v-model={[formState.value.accuracy, 'value']}
                    />
                )}
            </Checkbox>
        );
    };

    defineExpose({ open });

    const styles = useCssModule('root');

    const VNode = () => {
        return (
            <TpfModal
                v-model={[visible.value, 'visible']}
                visible={unref(visible)}
                title={showTitle.value}
                height="500px"
                width="800px"
                class={styles.editDiyFiledModal}
                v-slots={{
                    footerRight: () => (
                        <>
                            <Button class="tpf-button" onClick={() => setVisible(false)}>
                                取消
                            </Button>
                            {!readOnlyStatus.value && (
                                <Button
                                    class="tpf-button"
                                    type="primary"
                                    onClick={saveInfo}
                                    loading={loading.value}
                                >
                                    保存
                                </Button>
                            )}
                        </>
                    )
                }}
            >
                <Form
                    v-loading={loading.value}
                    ref={formRef}
                    rules={rules.value}
                    layout="inline"
                    model={formState.value}
                    class={['tpf-form', readOnlyStatus.value ? 'readonly' : '']}
                    labelCol={{ style: { width: '120px' } }}
                >
                    <Row style="width: 100%">
                        <Col span={12}>
                            <FormItem label="字段名称" name="fieldName">
                                <TpfInput
                                    v-model={[formState.value.fieldName, 'value', ['trim']]}
                                    showText={readOnlyStatus.value}
                                />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="排序" name="displayOrdinal">
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={0}
                                    max={99}
                                    precision={0}
                                    controls={false}
                                    disabled={readOnlyStatus.value}
                                    v-model={[formState.value.displayOrdinal, 'value']}
                                />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="字段类型" name="fieldType">
                                <Select
                                    disabled={readOnlyStatus.value || !isEmpty(unref(rowInfo))}
                                    v-model={[formState.value.fieldType, 'value']}
                                    fieldNames={{
                                        value: 'componentCode',
                                        label: 'label',
                                        options: 'options'
                                    }}
                                    options={diyFieldType.value}
                                />
                            </FormItem>
                        </Col>
                        {!!unref(formState).fieldType && (
                            <>
                                <Col span={24}>
                                    <FormItem label="字段属性">
                                        <FormItemRest>
                                            <Checkbox
                                                disabled={readOnlyStatus.value}
                                                checked={Number(formState.value.required) === 1}
                                                onChange={e => {
                                                    formState.value.required = Number(
                                                        e.target.checked
                                                    );
                                                }}
                                            >
                                                必填
                                            </Checkbox>
                                            <Checkbox
                                                disabled={readOnlyStatus.value}
                                                checked={Number(formState.value.search) === 1}
                                                onChange={e => {
                                                    formState.value.search = Number(
                                                        e.target.checked
                                                    );
                                                }}
                                            >
                                                查询
                                            </Checkbox>
                                            {renderInputNumber()}
                                        </FormItemRest>
                                    </FormItem>
                                </Col>
                                {renderSelectList()}
                                <Col span={24}>
                                    <FormItem label="启用" name="enable">
                                        <Switch
                                            disabled={readOnlyStatus.value}
                                            v-model={[formState.value.enable, 'checked']}
                                            checkedValue="1"
                                            unCheckedValue="0"
                                        />
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="提示说明" name="description">
                                        <Textarea
                                            disabled={readOnlyStatus.value}
                                            rows={2}
                                            showCount
                                            maxlength={200}
                                            v-model={[formState.value.description, 'value']}
                                        />
                                    </FormItem>
                                </Col>
                            </>
                        )}
                    </Row>
                </Form>
            </TpfModal>
        );
    };
</script>

<style lang="less" module="root">
    .editDiyFiledModal {
        :global {
            .ant-modal-body {
                .tpf-table {
                    height: 250px;
                    .ant-table-placeholder {
                        display: none;
                    }
                    .ant-table-row {
                        border: 2px solid red !important;
                    }

                    .ant-table-summary {
                        cursor: pointer;
                        &:hover {
                            background-color: var(--ant-primary-2);
                        }
                        .ant-table-cell {
                            text-align: center;
                            padding: 10px;
                            box-sizing: border-box;
                            border-bottom: 1px solid #eee;

                            .summaryBtn {
                                width: 100%;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
