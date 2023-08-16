<template>
    <TpfModal
        v-model:visible="visible"
        title="工序内容维护"
        height="500px"
        width="1000px"
        class="ProcessContentModal"
    >
        <TpfDescriptions
            :original-date="originalDate"
            :renderList="renderList"
            :descriptionsProps="{
                labelStyle: { width: '130px' }
            }"
        />

        <a-form :model="tableForm">
            <a-form-item name="dataSource">
                <TpfTable
                    ref="tableInstance"
                    class="tpf-table-form"
                    :dataSource="dataSource"
                    :pagination="false"
                    :columns="columns"
                    :loading="loading"
                />
            </a-form-item>
        </a-form>
        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="saveRelease">保存</a-button>
        </template>
    </TpfModal>
    <SelectWorkUnitModel
        v-if="showSelectWorkUnitModelDom"
        ref="selectWorkUnitModelDom"
        @getWorkUnit="getWorkUnit"
    />
    <SelectUserModel
        v-if="showSelectUserModelDom"
        ref="selectUserModelDom"
        @getCustomerInfo="getCustomerInfo"
    />
</template>

<script setup lang="tsx" name="ProcessContentModal">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useRef, useOpenAntdModal } from '@/hooks';
    import TpfTable from '@/components/TpfTable/index.vue';
    import {
        computed,
        unref,
        nextTick,
        reactive,
        toRefs,
        defineAsyncComponent,
        watchEffect
    } from 'vue';
    import { tableResizable, getTpfOptionEnum } from '@/config';
    import type { TpfColumnType } from '@/types';
    import { Textarea, Select, FormItem, Input } from 'ant-design-vue';
    import { useKeyDownArrow } from '@/hooks';
    import TpfDescriptions from '@/components/TpfDescriptions/index.vue';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { useProductionOrderApi, type OperationInfoType } from '@/api';
    import { ref } from 'vue';
    import BigNumber from 'bignumber.js';

    import { isEmpty } from 'lodash-es';
    import TpfInputNumber from '@/components/TpfInputNumber/index.vue';

    const SelectWorkUnitModel = defineAsyncComponent(() => import('./SelectWorkUnitModel.vue'));
    const SelectUserModel = defineAsyncComponent(() => import('./SelectUserModel.vue'));

    const [selectWorkUnitModelDom, openSelectWorkUnitModelDom, showSelectWorkUnitModelDom] =
        useOpenAntdModal();
    const [selectUserModelDom, openSelectUserModelDom, showSelectUserModelDom] = useOpenAntdModal();

    const { timeUnitOption } = getTpfOptionEnum();

    const allQs = ['ADom', 'BDom', 'CDom', 'DDom', 'EDom', 'FDom', 'GDom', 'HDom'];

    type Props = {
        productionOrderId: number;
    };

    const props = defineProps<Props>();

    defineEmits<{
        (e: 'updateTable'): void;
    }>();
    const productionOrderApi = useProductionOrderApi();

    const loading = ref(false);

    const originalDate = ref<Record<string, any>>({});

    const renderList = [
        { label: '项目编号', field: 'projectCode' },
        { label: '项目名称', field: 'projectName' },
        { label: '物料编号', field: 'materialCode' },
        { label: '物料名称', field: 'materialName' },
        { label: '图号', field: 'figureNum' },
        { label: '计划数', field: 'plannedQuantity' },
        { label: '工序数', field: 'operationCount' },
        { label: '单件总工时(分钟)', field: 'perTotalTime' },
        { label: '总工时(分钟)', field: 'allTotalTime' }
    ];

    const { allIptList, openComIndex, getAllIptList, tableInstance, handleInputEvent } =
        useKeyDownArrow(allQs);

    const [visible, setVisible] = useRef(false);

    const tableForm = reactive<{ dataSource: OperationInfoType[] }>({
        dataSource: [] as OperationInfoType[]
    });

    const { dataSource } = toRefs(tableForm);
    const currentRow = ref<OperationInfoType>({} as OperationInfoType);

    const columns = computed(() => {
        return [
            {
                title: '工序编号',
                dataIndex: 'operationCode',
                ...tableResizable()
            },
            {
                title: '工序名称',
                dataIndex: 'operationName',
                ...tableResizable()
            },
            {
                title: '备注',
                dataIndex: 'remark',
                ...tableResizable(),
                customRender: ({ record, text, index }) => {
                    return (
                        <FormItem>
                            <Textarea
                                v-model={[record.remark, 'value']}
                                class="ADom"
                                rows={1}
                                {...handleInputEvent({
                                    index,
                                    listLen: unref(dataSource).length,
                                    colNum: 0,
                                    colLen: 7
                                })}
                            />
                        </FormItem>
                    );
                }
            },
            {
                title: '单件计划工时',
                dataIndex: 'singlePlanHours',
                ...tableResizable(),
                customRender: ({ record, text, index }) => {
                    return (
                        <FormItem name={['dataSource', index, 'singlePlanHours']}>
                            <TpfInputNumber
                                v-model={[record.singlePlanHours, 'value']}
                                class="BDom"
                                fromSys={false}
                                style={{ width: '90%' }}
                                {...{
                                    onChange: () => {
                                        openComIndex.value = '';
                                    }
                                }}
                                {...handleInputEvent({
                                    index,
                                    listLen: unref(dataSource).length,
                                    colNum: 1,
                                    colLen: 7
                                })}
                            />
                        </FormItem>
                    );
                }
            },
            {
                title: '计时单位',
                dataIndex: 'singlePlanHoursUnit',
                ...tableResizable(),
                width: 120,
                customRender: ({ record, text, index }) => {
                    return (
                        <FormItem name={['dataSource', index, 'singlePlanHoursUnit']}>
                            <Select
                                class="CDom"
                                open={openComIndex.value === `2-${index}`}
                                v-model={[record.singlePlanHoursUnit, 'value']}
                                style={{ width: '90%' }}
                                options={timeUnitOption}
                                onChange={() => {
                                    openComIndex.value = '';
                                }}
                                {...handleInputEvent({
                                    index,
                                    listLen: unref(dataSource).length,
                                    colNum: 2,
                                    colLen: 7
                                })}
                            />
                        </FormItem>
                    );
                }
            },
            {
                title: '计时单价(元/分钟)',
                dataIndex: 'pricePerTime',
                ...tableResizable(),
                customRender: ({ record, text, index }) => {
                    return (
                        <FormItem name={['dataSource', index, 'pricePerTime']}>
                            <TpfInputNumber
                                fromSys={false}
                                class="DDom"
                                v-model={[record.pricePerTime, 'value']}
                                style={{ width: '90%' }}
                                {...{
                                    onChange: () => {
                                        openComIndex.value = '';
                                    }
                                }}
                                {...handleInputEvent({
                                    index,
                                    listLen: unref(dataSource).length,
                                    colNum: 3,
                                    colLen: 7
                                })}
                            />
                        </FormItem>
                    );
                }
            },
            {
                title: '单件金额(元)',
                dataIndex: 'pricePerQuantity',
                ...tableResizable(),
                customRender: ({ record, text, index }) => {
                    return (
                        <FormItem name={['dataSource', index, 'pricePerQuantity']}>
                            <TpfInputNumber
                                fromSys={false}
                                class="EDom"
                                v-model={[record.pricePerQuantity, 'value']}
                                style={{ width: '90%' }}
                                {...{
                                    onChange: () => {
                                        openComIndex.value = '';
                                    }
                                }}
                                {...handleInputEvent({
                                    index,
                                    listLen: unref(dataSource).length,
                                    colNum: 4,
                                    colLen: 7
                                })}
                            />
                        </FormItem>
                    );
                }
            },
            {
                title: '辅助工时(分钟)',
                dataIndex: 'auxiliaryTime',
                ...tableResizable(),
                customRender: ({ record, text, index }) => {
                    return (
                        <FormItem name={['dataSource', index, 'auxiliaryTime']}>
                            <TpfInputNumber
                                fromSys={false}
                                class="FDom"
                                v-model={[record.auxiliaryTime, 'value']}
                                style={{ width: '90%' }}
                                {...{
                                    onChange: () => {
                                        openComIndex.value = '';
                                    }
                                }}
                                {...handleInputEvent({
                                    index,
                                    listLen: unref(dataSource).length,
                                    colNum: 5,
                                    colLen: 7
                                })}
                            />
                        </FormItem>
                    );
                }
            },
            {
                title: '作业单元',
                dataIndex: 'workUnitName',
                ...tableResizable(),
                customRender: ({ record, text, index }) => {
                    return (
                        <FormItem name={['dataSource', index, 'workUnitName']}>
                            <Input
                                readonly
                                class="GDom"
                                v-model={[record.workUnitName, 'value']}
                                style={{ width: '90%' }}
                                onChange={val => {
                                    openComIndex.value = '';
                                }}
                                addonAfter={
                                    <SvgIcon
                                        type="icon-sousuo"
                                        size="16"
                                        cursor
                                        onClick={() => {
                                            currentRow.value = record;
                                            openSelectWorkUnitModelDom();
                                        }}
                                    />
                                }
                                {...handleInputEvent({
                                    index,
                                    listLen: unref(dataSource).length,
                                    colNum: 6,
                                    colLen: 7
                                })}
                            />
                        </FormItem>
                    );
                }
            },
            {
                title: '责任人',
                dataIndex: 'userName',
                ...tableResizable(),
                customRender: ({ record, text, index }) => {
                    return (
                        <FormItem name={['dataSource', index, 'userName']}>
                            <Input
                                readonly
                                class="HDom"
                                v-model={[record.userName, 'value']}
                                style={{ width: '90%' }}
                                onChange={val => {
                                    openComIndex.value = '';
                                }}
                                addonAfter={
                                    <SvgIcon
                                        type="icon-sousuo"
                                        size="16"
                                        cursor
                                        onClick={() => {
                                            currentRow.value = record;
                                            openSelectUserModelDom();
                                        }}
                                    />
                                }
                                {...handleInputEvent({
                                    index,
                                    listLen: unref(dataSource).length,
                                    colNum: 7,
                                    colLen: 7
                                })}
                            />
                        </FormItem>
                    );
                }
            }
        ] as TpfColumnType[];
    });

    const getWorkUnit = (val: any) => {
        currentRow.value.workUnitName = val.workUnitName;
        currentRow.value.workUnitCode = val.workUnitCode;
    };

    const getCustomerInfo = (val: any) => {
        currentRow.value.userName = val.userName;
        currentRow.value.userId = val.userId;
    };

    const getProductionOrderProcessOperation = async () => {
        dataSource.value = [];
        loading.value = true;
        try {
            const res = await productionOrderApi.getProductionOrderProcessOperation({
                productionOrderId: props.productionOrderId
            });
            originalDate.value = res.data.object || {};
            dataSource.value = res.data.object.productionOrderProcessVoList.operationInfos || [];
        } catch (error) {
            console.log('error: ', error);
        } finally {
            loading.value = false;
        }
    };
    const unitList = {
        SECOND: '1/60',
        MINUTE: 1,
        HOUR: 1 * 60,
        DAY: 1 * 60 * 24
    };
    watchEffect(() => {
        if (isEmpty(unref(originalDate))) return;
        const perTotalTime = unref(dataSource).reduce((t, v) => {
            const scale = Number(eval(unitList[v.singlePlanHoursUnit] || 0));
            const time = Number(v.singlePlanHours) * scale;
            t += time;
            return t;
        }, 0);

        originalDate.value.perTotalTime = new BigNumber(perTotalTime).toFixed(2);

        const allTotalTime = new BigNumber(perTotalTime).multipliedBy(
            unref(originalDate).plannedQuantity
        );

        originalDate.value.allTotalTime = allTotalTime.toFixed(2);
    });

    const saveRelease = async () => {
        const params = { editVos: unref(dataSource) };
        loading.value = true;
        try {
            await productionOrderApi.saveProductionOrderProcessOperation(params);
            setVisible(false);
        } catch (error) {
            console.log('error: ', error);
        } finally {
            loading.value = false;
        }
    };

    const getDataSource = async () => {
        allIptList.value = [];
        await getProductionOrderProcessOperation();

        await nextTick();
        getAllIptList(unref(dataSource).length);
    };

    const open = () => {
        setVisible(true);
        getDataSource();
    };

    defineExpose({ open });
</script>

<style lang="less">
    .ProcessContentModal {
        .ant-modal-body {
            .ant-form {
                flex: 1 0 0;

                .ant-row,
                .ant-col,
                .ant-form-item-control-input,
                .ant-form-item-control-input-content,
                .tpf-table {
                    height: 100%;
                }
            }

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
