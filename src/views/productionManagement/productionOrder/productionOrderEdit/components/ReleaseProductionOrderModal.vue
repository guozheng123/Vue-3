<template>
    <TpfModal
        v-model:visible="visible"
        title="下达"
        height="480px"
        width="1000px"
        class="releaseProductionOrderModal"
    >
        <a-form
            ref="productionOrderDom"
            :labelCol="{ style: { width: '120px' } }"
            layout="inline"
            :model="selectInfos"
            :rules="rules"
            @finish="handleFinish"
            class="tpf-form"
        >
            <a-row style="width: 100%">
                <a-col :span="8">
                    <a-form-item label="生产订单号" name="productionOrderCode">
                        <a-input v-model:value="formState.productionOrderCode" disabled />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item label="物料名称" name="materialName">
                        <a-input v-model:value="formState.materialName" disabled />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item label="计划数" name="plannedQuantity">
                        <a-input v-model:value="formState.plannedQuantity" disabled />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item label="已下达数" name="releasedQuantity">
                        <a-input v-model:value="formState.releasedQuantity" disabled />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item label="未下达数">
                        <a-input :value="unReleasedQuantity" disabled />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item label="计划开始日期" name="plannedStartDate">
                        <a-input v-model:value="formState.plannedStartDate" disabled />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item label="计划结束日期" name="plannedEndDate">
                        <a-input v-model:value="formState.plannedEndDate" disabled />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item label="车间" name="workshopCode">
                        <a-select
                            v-model:value="selectInfos.workshopCode"
                            @change="changeSelectInfos"
                            :options="workShopList"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item label="工艺" name="processCode">
                        <a-select
                            @change="changeSelectInfos"
                            v-model:value="selectInfos.processCode"
                            :options="formState.productionOrderProcessVoList"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <LoadingSkeleton>
            <TpfTableLayout>
                <a-form ref="formRef" :model="tableForm" class="table-form">
                    <TpfTable
                        ref="tableInstance"
                        class="tpf-table-form"
                        seq
                        :dataSource="dataSource"
                        :pagination="false"
                        :columns="columns"
                        :operateColumn="operateColumn"
                    />
                </a-form>
                <template #operateRight>
                    <a-form-item label="分解数量" class="iptBase">
                        <a-input-number
                            :min="0"
                            :precision="0"
                            :controls="false"
                            v-model:value="baseVal"
                        />
                    </a-form-item>
                    <a-button class="tpf-button" @click="getDataSource" ghost type="primary">
                        <SvgIcon type="icon-fenjie" />
                        分解
                    </a-button>
                    <a-button class="tpf-button" @click="clearDateSource" ghost type="primary">
                        <SvgIcon type="icon-shanchu" />
                        清空
                    </a-button>
                </template>
            </TpfTableLayout>
        </LoadingSkeleton>
        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">取消</a-button>
            <a-button
                class="tpf-button"
                type="primary"
                @click="saveRelease"
                :disabled="!dataSource.length"
            >
                下达
            </a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="tsx" name="ReleaseProductionOrderModal">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useRef, useAntdForm, useKeyDownArrow } from '@/hooks';
    import TpfTable from '@/components/TpfTable/index.vue';
    import { ref, computed, unref, defineAsyncComponent, nextTick, reactive, toRefs } from 'vue';
    import { tableResizable } from '@/config';
    import type { TpfColumnType } from '@/types';
    import { useProductionOrderApi, useWorkshopAPi } from '@/api';
    import type { IProductionOrderInfo, IResGetWorkshopList } from '@/api';
    import { Select, DatePicker, FormItem, type FormInstance } from 'ant-design-vue';
    import { withTpfTableOperateColumn } from '@/components/TpfTable';
    import dayjs from 'dayjs';
    import { checkRequired } from '@/formRuleConfig/Tpfrules';
    import type { Rule } from 'ant-design-vue/es/form/interface';
    import BigNumber from 'bignumber.js';
    import TpfInputNumber from '@/components/TpfInputNumber/index.vue';

    import { fmtDayjsTime } from '@/utils';

    const rules = {
        workshopCode: [checkRequired()],
        processCode: [checkRequired()]
    } as any;

    const allQs = [
        'workshopCodeRef',
        'processCodeRef',
        'plannedQuantityRef',
        'plannedStartDateRef',
        'plannedEndDateRef'
    ];

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );

    const emit = defineEmits<{
        (e: 'updateTable'): void;
    }>();

    const { formRef, submitForm } = useAntdForm();

    const { allIptList, openComIndex, getAllIptList, keydownAction, tableInstance } =
        useKeyDownArrow(allQs);
    const productionOrderApi = useProductionOrderApi();

    const workshopAPi = useWorkshopAPi();

    const productionOrderId = ref('');

    const productionOrderDom = ref<FormInstance | null>(null);

    const baseVal = ref<number>(0);

    const selectInfos = ref({ workshopCode: '', processCode: '' });

    const [visible, setVisible] = useRef(false);

    const formState = ref<IProductionOrderInfo>({} as IProductionOrderInfo);

    const tableForm = reactive<{ dataSource: { [k: string]: any }[] }>({
        dataSource: []
    });

    const { dataSource } = toRefs(tableForm);

    const unReleasedQuantity = computed(() => {
        const { plannedQuantity, releasedQuantity } = unref(formState);
        const res = new BigNumber(plannedQuantity).minus(releasedQuantity).toNumber();
        return res;
    });

    const defaultBtn = [
        {
            title: '删除',
            onClick: ({ index }: any) => {
                dataSource.value.splice(index, 1);
                openComIndex.value = '';
                getAllIptList(unref(dataSource).length);
            }
        }
    ];

    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 50,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });

    const columns = computed(() => {
        return [
            {
                title: () => <span class="required">车间</span>,
                dataIndex: 'workshopCode',
                ...tableResizable(),
                width: 120,
                customRender: ({ record, text, index }) => {
                    return (
                        <FormItem
                            name={['dataSource', index, 'workshopCode']}
                            rules={[checkRequired()] as any}
                        >
                            <Select
                                class={['workshopCodeRef']}
                                open={openComIndex.value === `0-${index}`}
                                value={text}
                                style={{ width: '90%' }}
                                options={unref(workShopList)}
                                onChange={val => {
                                    openComIndex.value = '';
                                    record.workshopCode = val;
                                }}
                                onKeydown={(e: KeyboardEvent) => {
                                    keydownAction(e.key, 0, index, unref(dataSource).length, 4);
                                }}
                                onFocus={() => {
                                    openComIndex.value = `0-${index}`;
                                }}
                            />
                        </FormItem>
                    );
                }
            },
            {
                title: () => <span class="required">工艺</span>,
                dataIndex: 'processCode',
                ...tableResizable(),
                width: 160,
                customRender: ({ record, text, index }) => {
                    return (
                        <FormItem
                            name={['dataSource', index, 'processCode']}
                            rules={[checkRequired()] as any}
                        >
                            <Select
                                class={['processCodeRef']}
                                open={openComIndex.value === `1-${index}`}
                                value={text}
                                style={{ width: '90%' }}
                                options={unref(formState).productionOrderProcessVoList}
                                onChange={val => {
                                    openComIndex.value = '';
                                    record.processCode = val;
                                }}
                                onKeydown={(e: KeyboardEvent) => {
                                    keydownAction(e.key, 1, index, unref(dataSource).length, 4);
                                }}
                                onFocus={() => {
                                    openComIndex.value = `1-${index}`;
                                }}
                            />
                        </FormItem>
                    );
                }
            },
            {
                title: () => <span class="required"> 计划数</span>,
                dataIndex: 'plannedQuantity',
                ...tableResizable(),
                width: 100,
                customRender: ({ record, text, index }) => {
                    return (
                        <FormItem
                            name={['dataSource', index, 'plannedQuantity']}
                            rules={
                                [
                                    checkRequired(),
                                    {
                                        validator: validateAllPlannedQuantity,
                                        trigger: ['change', 'blur']
                                    }
                                ] as any
                            }
                        >
                            <TpfInputNumber
                                class={['plannedQuantityRef']}
                                min={0}
                                style={{ width: '90%' }}
                                v-model={[record.plannedQuantity, 'value']}
                                {...{
                                    onKeydown: (e: KeyboardEvent) => {
                                        e.stopPropagation();
                                        keydownAction(e.key, 2, index, unref(dataSource).length, 4);
                                    },
                                    onFocus: () => {
                                        openComIndex.value = `2-${index}`;
                                    },
                                    onChange: () => {
                                        openComIndex.value = '';
                                    }
                                }}
                            />
                        </FormItem>
                    );
                }
            },
            {
                title: () => <span class="required"> 计划开始日期</span>,
                dataIndex: 'plannedStartDate',
                ...tableResizable(),
                width: 200,
                customRender: ({ record, text, index }) => {
                    return (
                        <FormItem
                            name={['dataSource', index, 'plannedStartDate']}
                            rules={
                                [
                                    checkRequired(),
                                    {
                                        validator: (_rule: Rule, value: string) =>
                                            validatePlannedDate(_rule, value, record),
                                        trigger: ['change', 'blur']
                                    }
                                ] as any
                            }
                        >
                            <DatePicker
                                class={['plannedStartDateRef']}
                                style={{ width: '90%' }}
                                value={text}
                                valueFormat="YYYY-MM-DD"
                                format="YYYY-MM-DD"
                                open={openComIndex.value === `3-${index}`}
                                onChange={val => {
                                    openComIndex.value = '';
                                    record.plannedStartDate = val;
                                    formRef.value?.validate([
                                        ['dataSource', index, 'plannedStartDate'],
                                        ['dataSource', index, 'plannedEndDate']
                                    ]);
                                }}
                                onBlur={() => {
                                    openComIndex.value = '';
                                }}
                                onKeydown={(e: KeyboardEvent) => {
                                    keydownAction(e.key, 3, index, unref(dataSource).length, 4);
                                }}
                                onMousedown={() => {
                                    openComIndex.value = `3-${index}`;
                                }}
                                onFocus={() => {
                                    openComIndex.value = `3-${index}`;
                                }}
                            />
                        </FormItem>
                    );
                }
            },
            {
                title: () => <span class="required"> 计划结束日期</span>,
                dataIndex: 'plannedEndDate',
                ...tableResizable(),
                width: 200,
                customRender: ({ record, text, index }) => {
                    return (
                        <FormItem
                            name={['dataSource', index, 'plannedEndDate']}
                            rules={
                                [
                                    checkRequired(),
                                    {
                                        validator: (_rule: Rule, value: string) =>
                                            validatePlannedDate(_rule, value, record),
                                        trigger: ['change', 'blur']
                                    }
                                ] as any
                            }
                        >
                            <DatePicker
                                class={['plannedEndDateRef']}
                                style={{ width: '90%' }}
                                value={text}
                                open={openComIndex.value === `4-${index}`}
                                onChange={val => {
                                    openComIndex.value = '';
                                    record.plannedEndDate = val;
                                    formRef.value?.validate([
                                        ['dataSource', index, 'plannedStartDate'],
                                        ['dataSource', index, 'plannedEndDate']
                                    ]);
                                }}
                                onBlur={() => {
                                    openComIndex.value = '';
                                }}
                                onKeydown={(e: KeyboardEvent) => {
                                    keydownAction(e.key, 4, index, unref(dataSource).length, 4);
                                }}
                                onMousedown={() => {
                                    openComIndex.value = `4-${index}`;
                                }}
                                onFocus={() => {
                                    openComIndex.value = `4-${index}`;
                                }}
                            />
                        </FormItem>
                    );
                }
            }
        ] as TpfColumnType[];
    });

    const workShopList = ref<IResGetWorkshopList[]>([]);

    const getWorkshopList = async (factoryCode: string) => {
        const res = await workshopAPi.getWorkshopList({ factoryCode });
        workShopList.value = res.data.list.map(item => ({
            ...item,
            value: item.workshopCode,
            label: item.workshopName
        }));
    };

    const changeSelectInfos = () => {
        const { workshopCode, processCode } = unref(selectInfos);
        dataSource.value.forEach(item => {
            item.workshopCode = workshopCode;
            item.processCode = processCode;
        });
    };

    const getProductionOrderViewById = async () => {
        if (!unref(productionOrderId)) return;
        const res = await productionOrderApi.getProductionOrderViewById(unref(productionOrderId));
        const productionOrderProcessVoList = res.data.object.productionOrderProcessVoList || [];
        formState.value = {
            ...res.data.object,
            productionOrderProcessVoList: productionOrderProcessVoList.map(item => ({
                ...item,
                value: item.processCode,
                label: item.processName
            }))
        };
        const defaultProcess = unref(formState).productionOrderProcessVoList.find(
            item => item.defaultFlag === '1'
        );
        if (defaultProcess) {
            selectInfos.value.processCode = defaultProcess.processCode;
        }
    };

    const handleFinish = (val: any) => {
        formState.value = unref(val);
    };

    const validateAllPlannedQuantity = (_rule: Rule, value: any) => {
        if ([null, undefined, ''].includes(value)) {
            return Promise.resolve();
        }
        if (Number(value) === 0) {
            return Promise.reject('下达的数不可为0');
        }
        // 校验计划数
        const allPlannedQuantity = unref(dataSource).reduce((t, v) => {
            t = new BigNumber(t).plus(v.plannedQuantity).toNumber();
            return t;
        }, 0);
        if (allPlannedQuantity > unref(unReleasedQuantity)) {
            return Promise.reject('下达的数不可超过订单未下达的数！');
        }
        return Promise.resolve();
    };

    const validatePlannedDate = (_rule: Rule, value: string, row: any) => {
        const validateTime = +new Date(row.plannedEndDate) < +new Date(row.plannedStartDate);
        if (validateTime) {
            return Promise.reject('计划结束时间不可早于计划开始时间');
        }
        return Promise.resolve();
    };

    const saveRelease = async () => {
        await submitForm();
        console.log('校验通过');
        const params = unref(dataSource).map(item => {
            const { processVersion } =
                unref(formState).productionOrderProcessVoList.find(
                    it2 => it2.processCode === item.processCode
                ) || {};
            return {
                ...item,
                processVersion,
                productionOrderId: unref(productionOrderId),
                plannedEndDate: fmtDayjsTime(item.plannedEndDate),
                plannedStartDate: fmtDayjsTime(item.plannedStartDate)
            };
        });
        try {
            await productionOrderApi.releaseProductionOrder(params);
            const { message } = await import('ant-design-vue');
            message.success('下达成功');
            emit('updateTable');
            setVisible(false);
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const clearDateSource = () => {
        dataSource.value = [];
    };
    3;

    const getDataSource = async () => {
        await unref(productionOrderDom)?.validate();
        const val = unref(baseVal);

        if (!val) {
            dataSource.value = [];
            allIptList.value = [];
            return;
        }
        const { workshopCode, processCode } = unref(selectInfos);

        const { plannedStartDate, plannedEndDate } = unref(formState);
        // 多少行数
        const lineNum = Math.ceil(unref(unReleasedQuantity) / val);

        dataSource.value = Array.from({ length: lineNum }, (_: any, inx: number) => {
            let plannedQuantity = val;
            if (inx === lineNum - 1) {
                const currentQuantity = new BigNumber(lineNum - 1).multipliedBy(val).toNumber();
                plannedQuantity = new BigNumber(unref(unReleasedQuantity))
                    .minus(currentQuantity)
                    .toNumber();
            }
            return {
                workshopCode,
                processCode,
                plannedQuantity,
                plannedStartDate: dayjs(plannedStartDate),
                plannedEndDate: dayjs(plannedEndDate)
            };
        });

        await nextTick();
        getAllIptList(unref(dataSource).length);
    };

    const init = () => {
        formState.value = {} as IProductionOrderInfo;
        selectInfos.value = { workshopCode: '', processCode: '' };
        dataSource.value = [];
        baseVal.value = 0;
    };

    const open = async (val: string) => {
        init();
        productionOrderId.value = unref(val);
        await getProductionOrderViewById();
        await getWorkshopList(unref(formState).factoryCode);
        setVisible(true);
    };

    defineExpose({ open });
</script>

<style lang="less">
    .releaseProductionOrderModal {
        .ant-modal-body {
            .iptBase {
                margin-bottom: 0;

                .ant-input-number {
                    width: unset;
                }

                .ant-form-item-control {
                    width: 78px;
                }
            }
        }
    }
</style>
