<template>
    <div>
        <TpfModal
            class="ProcessMaintenance"
            v-model:visible="visible"
            width="1000px"
            height="550px"
            title="设置计划工时"
        >
            <div class="modalBox" v-loading="loading">
                <div class="boxInfo">
                    <a-form ref="formRef" :model="formState">
                        <a-row>
                            <a-col v-for="item in formList" :key="item.filedName" :span="item.span">
                                <a-form-item :label="item.label" :name="item.filedName">
                                    <span>{{
                                        formState[item.filedName] ? formState[item.filedName] : '--'
                                    }}</span>
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </a-form>
                </div>
                <div class="boxTable" style="height: 300px">
                    <TpfTable
                        :columns="columns"
                        :data-source="tableData"
                        :pagination="false"
                        v-bind="{ seq: true }"
                        rowKey="id"
                    />
                </div>
            </div>
            <template #footerRight>
                <a-button class="tpf-button" @click="setVisible(false)">取消</a-button>
                <a-button
                    class="tpf-button"
                    type="primary"
                    @click="onSave"
                    :disabled="!tableData.length"
                    >保存</a-button
                >
            </template>
        </TpfModal>
        <AddWork ref="addWork" v-if="addWorkShow" @getData="addWorkData" />
        <AddUser ref="addUser" v-if="addUserShow" @getData="addUserData" />
    </div>
</template>

<script setup lang="tsx">
    import { useOpenAntdModal, useRef } from '@/hooks';
    import { defineAsyncComponent, ref, unref, computed } from 'vue';
    import TpfModal from '@/components/TpfModal/index.vue';
    import TpfTable from '@/components/TpfTable/index.vue';
    import { TpfColumnType } from '@/types';
    import { useJobOrderAPi } from '@/api';
    import type { ResQueryWorkOrderList } from '@/api';
    import { getTpfOptionEnum } from '@/config';
    import BigNumber from 'bignumber.js';
    import { Dayjs } from 'dayjs';
    import { DatePicker, Input, InputSearch, Select, message, InputNumber } from 'ant-design-vue';
    const AddWork = defineAsyncComponent(() => import('./AddWork.vue'));
    const AddUser = defineAsyncComponent(() => import('./AddUser.vue'));
    const [addWork, onOpenAddWork, addWorkShow] = useOpenAntdModal();
    const [addUser, onOpenAddUser, addUserShow] = useOpenAntdModal();
    const { getLabel, timeUnitOption, operationTypeNameListOptions } = getTpfOptionEnum();

    const [visible, setVisible] = useRef(false);
    const jobOrderAPi = useJobOrderAPi();
    const loading = ref(false);
    let copyRowData: ResQueryWorkOrderList;
    const formState = ref<{ [k: string]: any }>({});
    const formList = ref([
        {
            filedName: 'workOrderCode',
            label: '作业工单号',
            span: 6
        },
        {
            filedName: 'productionOrderCode',
            label: '生产订单号',
            span: 6
        },
        {
            filedName: 'materialCode',
            label: '物料编号',
            span: 6
        },
        {
            filedName: 'materialName',
            label: '物料名称',
            span: 6
        },
        {
            filedName: 'projectCode',
            label: '项目编号',
            span: 6
        },
        {
            filedName: 'projectName',
            label: '项目名称',
            span: 6
        },
        {
            filedName: 'plannedStartDate',
            label: '计划开始时间',
            span: 6
        },
        {
            filedName: 'plannedEndDate',
            label: '计划结束时间',
            span: 6
        },
        {
            filedName: 'workshopName',
            label: '车间',
            span: 6
        },
        {
            filedName: 'customerSupplierName',
            label: '客户简称',
            span: 6
        },
        {
            filedName: 'plannedNumber',
            label: '计划数',
            span: 6
        },
        {
            filedName: 'singlePlanHours',
            label: '单件计划工时（分钟）',
            span: 6
        },
        {
            filedName: 'sumHours',
            label: '总工时（分钟）',
            span: 6
        }
    ]);

    const columns = [
        { title: '工序编号', dataIndex: 'operationCode', width: 100 },
        { title: '工序名称', dataIndex: 'operationName', width: 100 },
        {
            title: '工序类型',
            dataIndex: 'operationTypeCode',
            width: 100,
            customRender: ({ text }) => {
                return getLabel(text, operationTypeNameListOptions);
            }
        },
        { title: '作业单元类型', dataIndex: 'workUnitTypeName', width: 100 },
        {
            title: '工序计划数',
            dataIndex: 'operationPlanNumber',
            width: 100,
            customRender: ({ record, text, index }) => {
                return (
                    <InputNumber
                        controls={false}
                        disabled={getWorkOrderNum(index)}
                        class="DDom"
                        min={0}
                        precision={0}
                        value={text}
                        style={{ width: '90%' }}
                        onChange={val => {
                            record.operationPlanNumber = val;
                        }}
                        onBlur={val => {
                            onPlanHoursSum();
                        }}
                    />
                );
            }
        },
        {
            title: '单件计划工时',
            dataIndex: 'singlePlanHours',
            width: 100,
            customRender: ({ record, text, index }) => {
                return (
                    <InputNumber
                        controls={false}
                        class="DDom"
                        min={0}
                        precision={2}
                        value={text}
                        style={{ width: '90%' }}
                        onChange={val => {
                            record.singlePlanHours = val;
                        }}
                        onBlur={val => {
                            onPlanHoursSum();
                        }}
                    />
                );
            }
        },
        {
            title: '计时单位',
            dataIndex: 'singlePlanHoursUnit',
            width: 100,
            customRender: ({ record, text, index }) => {
                return (
                    <Select
                        v-model={[record.singlePlanHoursUnit, 'value']}
                        options={timeUnitOption}
                        onChange={val => {
                            onPlanHoursSum();
                        }}
                        style={{ width: '90px' }}
                    />
                );
            }
        },
        {
            title: '计件单价（元）',
            dataIndex: 'pricePerQuantity',
            width: 130,
            customRender: ({ record, text }) => {
                return (
                    <InputNumber
                        controls={false}
                        class="DDom"
                        min={0}
                        precision={2}
                        value={text}
                        style={{ width: '90%' }}
                        onChange={val => {
                            record.pricePerQuantity = val;
                        }}
                    />
                );
            }
        },
        {
            title: '计时单价（元/分钟）',
            dataIndex: 'pricePerTime',
            width: 150,
            customRender: ({ record, text }) => {
                return (
                    <InputNumber
                        controls={false}
                        class="DDom"
                        min={0}
                        precision={2}
                        value={text}
                        style={{ width: '90%' }}
                        onChange={val => {
                            record.pricePerTime = val;
                        }}
                    />
                );
            }
        },
        {
            title: '辅助工时',
            dataIndex: 'auxiliaryTime',
            width: 100,
            customRender: ({ record, text }) => {
                return (
                    <InputNumber
                        controls={false}
                        class="DDom"
                        min={0}
                        precision={2}
                        value={text}
                        style={{ width: '90%' }}
                        onChange={val => {
                            record.auxiliaryTime = val;
                        }}
                    />
                );
            }
        },
        {
            title: '作业单元编号',
            dataIndex: 'workUnitCode',
            width: 140,
            customRender: ({ record, index }) => {
                return (
                    <InputSearch
                        readonly
                        enterButton
                        onSearch={() => {
                            onSearchZydy(index, record.workUnitTypeCode);
                        }}
                        v-model={[record.workUnitCode, 'value']}
                    />
                );
            }
        },
        {
            title: '作业单元名称',
            dataIndex: 'workUnitName',
            width: 140,
            customRender: ({ record }) => {
                return <Input disabled={true} v-model={[record.workUnitName, 'value']} />;
            }
        },
        {
            title: '计划开始时间',
            dataIndex: 'plannedStartTime',
            width: 210,
            customRender: ({ record }) => {
                return (
                    <DatePicker
                        valueFormat="YYYY-MM-DD hh:mm:ss"
                        format="YYYY-MM-DD hh:mm:ss"
                        show-time
                        v-model={[record.plannedStartTime, 'value']}
                        onChange={(date: Dayjs | string) => {
                            onCheckDate(date, record, 'start');
                        }}
                    />
                );
            }
        },
        {
            title: '计划结束时间',
            dataIndex: 'plannedEndTime',
            width: 210,
            customRender: ({ record }) => {
                return (
                    <DatePicker
                        format="YYYY-MM-DD hh:mm:ss"
                        valueFormat="YYYY-MM-DD hh:mm:ss"
                        show-time
                        v-model={[record.plannedEndTime, 'value']}
                        onChange={(date: Dayjs | string) => {
                            onCheckDate(date, record, 'end');
                        }}
                    />
                );
            }
        },
        {
            title: '责任人',
            dataIndex: 'userName',
            width: 160,
            customRender: ({ record, index }) => {
                return (
                    <InputSearch
                        readonly
                        onSearch={() => {
                            onSearchZrr(index);
                        }}
                        enterButton
                        v-model={[record.userName, 'value']}
                    />
                );
            }
        },
        {
            title: '备注',
            dataIndex: 'remark',
            width: 100,
            customRender: ({ record }) => {
                return <Input v-model={[record.remark, 'value']} />;
            }
        }
    ] as TpfColumnType[];
    const tableData = ref([] as any[]);
    const open = (row: any) => {
        const { workOrderId, workOrderCode } = row.value;
        if (!workOrderId || !workOrderCode) {
            console.log('参数为空: workOrderId | workOrderCode！');
            return;
        }
        copyRowData = row.value;
        getProcessBomTable({ workOrderId, workOrderCode });
        setVisible(!visible.value);
    };
    const getProcessBomTable = async (query: any) => {
        try {
            setLoading(true);
            tableData.value = [];
            const { data } = await jobOrderAPi.getWorkOrderDetails(query);
            formState.value = data.object;
            if (
                data.object &&
                data.object.operationInfos &&
                Array.isArray(data.object.operationInfos)
            ) {
                tableData.value = data.object.operationInfos;
                onPlanHoursSum();
            }
        } catch (error) {
            console.log('工序内容维护弹框：' + error);
        } finally {
            setLoading(false);
        }
    };
    const unitList = {
        SECOND: '1/60',
        MINUTE: 1,
        HOUR: 1 * 60,
        DAY: 1 * 60 * 24
    };
    const onPlanHoursSum = () => {
        const perTotalTime = unref(tableData).reduce((t, v) => {
            const num = v.operationPlanNumber || 0;
            const scale = Number(eval(unitList[v.singlePlanHoursUnit] || 0));
            const time = Number(v.singlePlanHours) * scale * num;
            t += time;
            return t;
        }, 0);
        const singlePlanHours = unref(tableData).reduce((t, v) => {
            const scale = Number(eval(unitList[v.singlePlanHoursUnit] || 0));
            const time = Number(v.singlePlanHours) * scale;
            t += time;
            return t;
        }, 0);
        formState.value.singlePlanHours = new BigNumber(singlePlanHours).toFixed(2);

        formState.value.sumHours = new BigNumber(perTotalTime).toFixed(2);
    };
    const onCheckDate = (date: string | Dayjs, row: any, type: string) => {
        const start = row.plannedStartTime ? new Date(row.plannedStartTime) : 0;
        const end = row.plannedEndTime ? new Date(row.plannedEndTime) : 0;
        if (start > end && end) {
            message.warning('计划开始时间不能大于计划结束时间！');
            if (type === 'start') {
                row.plannedEndTime = '';
            } else {
                row.plannedStartTime = '';
            }
        }
    };
    //保存
    const onSave = async () => {
        try {
            setLoading(true);
            const { data } = await jobOrderAPi.updateProcessInfo(unref(getParams));
            if (data.value) {
                message.success('保存成功！');
                setVisible(!visible.value);
            } else {
                message.warning('保存失败！');
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    const setLoading = (value: boolean) => {
        loading.value = value;
    };
    //作业单元编号
    const onSearchZydy = (i: number, workUnitTypeCode: string) => {
        onOpenAddWork(i, workUnitTypeCode);
    };
    const addWorkData = (v: any, i: number) => {
        tableData.value[i].workUnitCode = v.workUnitCode;
        tableData.value[i].workUnitName = v.workUnitName;
    };
    //责任人
    const onSearchZrr = (i: number) => {
        onOpenAddUser(i, formState.value.workshopId);
    };
    const addUserData = (v: any, i: number) => {
        tableData.value[i].userId = v.userId;
        tableData.value[i].userName = v.userName;
    };
    const getWorkOrderNum = (index: number) => {
        // 报工计算逻辑 1主零件，2子零件
        const confirmLogic = formState.value.confirmLogic;
        if (confirmLogic === '主零件') return true;
        if (tableData.value.length - 1 === index) return true;
        return false;
    };
    const getParams = computed(() => {
        const { workOrderCode, processCode, processVersion } = copyRowData;
        unref(tableData).forEach(item => (item.plannedQuantity = item.operationPlanNumber));
        return {
            editVos: unref(tableData),
            workOrderCode,
            processCode,
            processVersion
        };
    });
    defineExpose({
        open
    });
</script>

<style lang="less">
    .ProcessMaintenance {
        .modalBox {
            .boxInfo {
                border-bottom: 1px dashed #bbb9b9;
                margin-bottom: 15px;
                padding: 10px;
            }

            .boxTable {
                padding: 10px;

                .tpf-table {
                    height: 100%;
                }

                .ant-btn-primary {
                    border-color: #d9d9d9;
                    background: #fafafa;
                    color: #666;
                }
            }
        }
    }
</style>
