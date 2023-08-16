<template>
    <!-- <div class="WorkingProcedure"> -->
    <TpfCollapse class="list" title="工序列表">
        <div class="btnBox">
            <a-button
                class="tpf-button"
                type="primary"
                :disabled="canAddUp || !selectData?.id"
                @click="onAdd('up')"
            >
                <SvgIcon type="icon-insert" style="margin-right: 5px" />
                新增上一行
            </a-button>
            <a-button
                class="tpf-button"
                type="primary"
                :disabled="canAddDown || !selectData?.id"
                @click="onAdd('down')"
            >
                <SvgIcon type="icon-insert" style="margin-right: 5px" />
                新增下一行
            </a-button>
        </div>
        <a-card style="border-radius: 8px 8px 8px 8px; flex: 1">
            <TpfTable
                :columns="columns"
                :data-source="props.tableList"
                :loading="loading"
                :pagination="false"
                v-bind="{ operateColumn }"
                :customRow="handleClickRow"
                rowKey="id"
                :row-class-name="
                                (_record:any, index:any) => ((_record.id === selectData?.id) ? 'table-striped' : null)
                            "
            />
        </a-card>
        <AddWorkingProcedure ref="addWorkingProcedure" @submitAdd="submitAdd" />
    </TpfCollapse>
    <!-- </div> -->
</template>

<script setup lang="tsx">
    import { ref, defineAsyncComponent, onMounted, unref, watch, computed } from 'vue';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import { getTpfOptionEnum, tableResizable } from '@/config';
    import { TpfColumnType } from '@/types';
    import TpfTable from '@/components/TpfTable/index.vue';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { useOpenAntdModal } from '@/hooks';
    import { Input, message, Select } from 'ant-design-vue';
    import { withTpfTableOperateColumn } from '@/components/TpfTable';
    import router from '@/router';
    import { useJobOrderAPi } from '@/api';
    import TpfInputNumber from '@/components/TpfInputNumber/index.vue';

    const AddWorkingProcedure = defineAsyncComponent(() => import('./AddWorkingProcedure.vue'));
    const jobOrderAPi = useJobOrderAPi();

    type Props = {
        tableList: any[];
        processInfoData: any;
    };
    const props = withDefaults(defineProps<Props>(), {
        tableList: () => {
            return [];
        },
        processInfoData: () => ({})
    });
    const { getLabel, timeUnitOption, operationTypeNameListOptions } = getTpfOptionEnum();

    const [addWorkingProcedure, onOpenAddWorkingProcedure] = useOpenAntdModal();

    const precision = ref(0);
    const selectIndex = ref(-1);
    const loading = ref(false);
    const columns = computed(
        () =>
            [
                {
                    title: '顺序号',
                    dataIndex: 'index',
                    customRender: (row: any) => {
                        return (row.index += 1);
                    }
                },
                {
                    title: '工序编号',
                    dataIndex: 'operationCode',
                    customRender: ({ text, record }) => {
                        return (
                            <a
                                onClick={() => {
                                    {
                                        router.push({
                                            path: '/processManagement/workingProcedure/workingProcedureDetail',
                                            query: {
                                                type: 'route',
                                                operationId: record.id
                                            }
                                        });
                                    }
                                }}
                            >
                                {text}
                            </a>
                        );
                    },
                    ...tableResizable()
                },
                { title: '工序名称', dataIndex: 'operationName', ...tableResizable() },
                {
                    title: '工序类型',
                    dataIndex: 'operationTypeCode',
                    customRender: ({ text }) => {
                        return getLabel(text, operationTypeNameListOptions);
                    },
                    ...tableResizable()
                },
                {
                    title: '计件单价（元）',
                    dataIndex: 'pricePerQuantity',
                    customRender: ({ record }) => {
                        return (
                            <TpfInputNumber
                                min={0}
                                disabled={!canEditTable.value || record.isIDisabled}
                                v-model={[record.pricePerQuantity, 'value']}
                            />
                        );
                    },
                    ...tableResizable()
                },
                {
                    title: '计时单价',
                    dataIndex: 'pricePerTime',
                    customRender: ({ record }) => {
                        return (
                            <TpfInputNumber
                                min={0}
                                disabled={!canEditTable.value || record.isIDisabled}
                                v-model={[record.pricePerTime, 'value']}
                            />
                        );
                    },
                    ...tableResizable()
                },
                {
                    title: '计时单位',
                    dataIndex: 'pricePerTimeUnit',
                    customRender: ({ record }) => {
                        return (
                            <Select
                                disabled={!canEditTable.value || record.isIDisabled}
                                v-model={[record.pricePerTimeUnit, 'value']}
                                options={timeUnitOption}
                            />
                        );
                    },
                    ...tableResizable()
                },
                { title: '作业单元类型编号', dataIndex: 'workUnitTypeCode', ...tableResizable() },
                {
                    title: '备注',
                    dataIndex: 'remark',
                    customRender: ({ record }) => {
                        return (
                            <Input
                                disabled={!canEditTable.value || record.isIDisabled}
                                v-model={[record.remark, 'value']}
                            />
                        );
                    },
                    ...tableResizable()
                }
            ] as TpfColumnType[]
    );
    const selectData = ref();
    const addType = ref<string>();
    const data = ref<any[]>([]);
    const canAddUp = ref(true);
    const canAddDown = ref(true);
    const canEditTable = ref(true);
    const defaultBtn = [
        {
            title: () => {
                return <span style="margin-right: 5px">删除</span>;
            },
            onClick: (row: any) => onDel(row)
        }
    ];
    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 64,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });

    watch(
        () => props.tableList,
        val => {
            // const reportInOrder = props.processInfoData.reportInOrder === 1; // 是否顺序报工0 0否 1是
            // const completionsNumber = props.processInfoData.completionsNumber; // 完工数
            //  'FOCLOSE' 强制关闭:
            //  'FINISH' 完工:
            //  'FOFINISH' 强制完工:
            //  'START' 投产:
            //  'UNSTART 未投产':
            //  'REPORT' 报工:

            const workOrderStatus = props.processInfoData.workOrderStatus; // 工单状态
            console.log(workOrderStatus);

            if (['FINISH', 'FOFINISH', 'FOCLOSE'].includes(workOrderStatus)) {
                canEditTable.value = false;
            }
        },
        {
            deep: true,
            immediate: true
        }
    );

    const init = () => {
        selectData.value = null;
    };
    const onAdd = (t: string) => {
        addType.value = t;
        onOpenAddWorkingProcedure(selectData.value, props.tableList.slice());
    };
    const submitAdd = (selectedList: any) => {
        if (!Array.isArray(selectedList)) return;
        const list = unref(props.tableList).slice();
        let isRepetition = false;
        selectedList.forEach((v: any) => {
            const i = list.findIndex(item => item.id === v.operationId);
            if (i === -1) {
                v.id = v.operationId;
                unref(props.tableList).splice(
                    unref(addType) === 'up' ? selectIndex.value : selectIndex.value + 1,
                    0,
                    v
                );
            } else {
                isRepetition = true;
            }
        });
        if (isRepetition) {
            message.warning('存在重复的数据，已自动过滤！');
        }
        selectIndex.value = -1;
        selectData.value = null;
    };
    const handleClickRow = (record: any, index: number) => {
        return {
            onClick: (e: any) => {
                if (
                    e.srcElement.nodeName !== 'svg' &&
                    e.srcElement.className !== 'tpf-operateColumn-item'
                ) {
                    // canEditTable false 全部不能操作
                    if (canEditTable.value) {
                        // 工单状态
                        const { workOrderStatus, reportInOrder } = props.processInfoData;
                        const last = props.tableList.length - 1;
                        canAddUp.value = true;
                        canAddDown.value = true;
                        selectData.value = record;
                        selectIndex.value = index;
                        // 投产 || 未投产
                        if (['UNSTART', 'START'].includes(workOrderStatus)) {
                            canAddDown.value = false;
                            canAddUp.value = false;
                        }
                        // 报工
                        if (workOrderStatus === 'REPORT') {
                            //  最后一道工序 &&  顺序报工 && 有报工记录
                            if (index === last && reportInOrder === '1' && record.isIDisabled) {
                                canAddDown.value = false;
                            }
                            // 顺序报工 && 没有有报工记录
                            if (reportInOrder === '1' && !record.isIDisabled) {
                                canAddDown.value = false;
                                canAddUp.value = false;
                            }

                            //  最后一道工序 &&  非顺序报工 && 有报工记录
                            if (index === last && reportInOrder === '0' && record.isIDisabled) {
                                canAddUp.value = false;
                            }
                            //  非最后一道工序 &&  非顺序报工
                            if (index !== last && reportInOrder === '0') {
                                canAddDown.value = false;
                                canAddUp.value = false;
                            }
                            //  最后一道工序 &&  非顺序报工 && 没有报工记录
                            if (index === last && reportInOrder === '0' && !record.isIDisabled) {
                                canAddDown.value = false;
                                canAddUp.value = false;
                            }
                        }
                    }
                }
            }
        };
    };

    const onDel = async (row: any) => {
        if (
            !unref(canEditTable) ||
            row.record.isIDisabled ||
            unref(props.tableList).length === 1 ||
            row.record.isRequisitionOrder
        ) {
            message.warning('该工序不能删除！');
            return false;
        }
        const params = {
            workOrderCode: unref(props.processInfoData)?.workOrderCode,
            operationCode: unref(row.record)?.operationCode
        };
        const { data } = await jobOrderAPi.getCheckProcessAllowDelete(params);
        if (data.value) {
            unref(props.tableList).splice(row.index, 1);
            selectData.value = null;
        } else {
            message.warning('该工序不能删除！');
        }
    };

    onMounted(() => {
        init();
    });
    defineExpose({
        data
    });
</script>

<style lang="less" scoped>
    .list {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: auto;

        :deep(.tpf-collapse-content) {
            display: flex;
            flex: 1;
            flex-direction: column;
            overflow: auto;
            // padding: 12px;
            .ant-card {
                padding: 0 12px 12px 12px;
            }
        }
    }

    // .WorkingProcedure {
    :deep(.tpf-table) {
        height: 100%;

        :deep(.ant-table-placeholder) {
            :deep(.ant-table-cell) {
                border: none;
            }
        }
    }

    :deep(.ant-card-body) {
        padding: 0;
        height: 100%;
    }

    :deep(.tpf-table) .table-striped td {
        background-color: #ecf5df !important;
    }

    .ant-table-tbody :deep(.table-striped) td {
        background-color: #ecf5df !important;
    }

    :deep(.table-striped) td {
        background-color: #ecf5df !important;
    }
    // }
</style>

<style lang="less">
    // .WorkingProcedure {
    .btnBox {
        margin: 10px 0;
        margin-left: 12px;

        .ant-btn {
            margin-right: 15px;
        }
    }

    .tpf-table {
        .ant-table-placeholder {
            .ant-table-cell {
                border: none;
            }
        }
    }

    .ant-input-number-handler-wrap {
        display: none;
    }
    // }
</style>
