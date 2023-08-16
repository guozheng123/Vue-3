<template>
    <TpfModal
        class="printModal"
        v-model:visible="visible"
        title="工序流转卡打印"
        height="600px"
        width="1100px"
    >
        <div id="ProcessFlowCard" class="print">
            <div v-for="(item, index) in detailData" :key="index" class="print-item">
                <div class="fromBox">
                    <div class="fromBox_left">
                        <a-form ref="formRef">
                            <a-row :gutter="[8, 8]">
                                <template v-for="(v, ind) in item.fromItem" :key="ind">
                                    <a-col :span="6">
                                        <a-form-item :name="v.filedName" :label="v.label">
                                            <span>{{ item[v.filedName] }}</span>
                                        </a-form-item>
                                    </a-col>
                                </template>
                            </a-row>
                        </a-form>
                    </div>
                    <div class="fromBox_right">
                        <TpfQrcode
                            :width="100"
                            :text="JSON.stringify({ workOrderCode: item.workOrderCode })"
                        />
                    </div>
                </div>
                <div class="tableBox scrollbarColor" :id="loading ? 'print-table' : ''">
                    <a-table
                        :columns="columns"
                        :data-source="item.list"
                        bordered
                        :pagination="false"
                        size="small"
                        height="250px"
                    />
                </div>
            </div>
        </div>
        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="onSave">打印</a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="ts">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useRef } from '@/hooks';
    import printJS from 'print-js';
    import { useJobOrderAPi } from '@/api';
    import { message } from 'ant-design-vue';
    import TpfQrcode from '@/components/TpfQrcode/index.vue';
    import { ref, nextTick } from 'vue';
    import { TpfColumnType } from '@/types';
    import { getTpfOptionEnum } from '@/config';
    import BigNumber from 'bignumber.js';

    const [visible, setVisible] = useRef(false);

    const jobOrderAPi = useJobOrderAPi();
    const { getLabel, timeUnitOption, operationTypeNameListOptions } = getTpfOptionEnum();
    const loading = ref(false);
    const detailData = ref<any[]>();
    const fromItem = ref([
        { label: '作业工单号：', value: '', filedName: 'workOrderCode' },
        { label: '生产订单号：', value: '', filedName: 'productionOrderCode' },
        { label: '物料编号：', value: '', filedName: 'materialCode' },
        { label: '物料名称：', value: '', filedName: 'materialName' },
        { label: '项目编号：', value: '', filedName: 'projectCode' },
        { label: '项目名称：', value: '', filedName: 'projectName' },
        { label: '计划开始时间：', value: '', filedName: 'plannedStartDate' },
        { label: '计划结束时间：', value: '', filedName: 'plannedEndDate' },
        { label: '客户简称：', value: '', filedName: 'customerSupplierName' },
        { label: '工艺名称：', value: '', filedName: 'processName' },
        { label: '计划数：', value: '', filedName: 'plannedNumber' },
        { label: '总工时（分钟）：', value: '', filedName: 'allTime' }
    ]);
    const columns = ref([
        {
            title: '序号',
            dataIndex: 'seq',
            customRender: ({ index }) => index + 1
        },
        {
            title: '工序编号',
            dataIndex: 'operationCode'
        },
        {
            title: '工序名称',
            dataIndex: 'operationName'
        },
        {
            title: '工序类型',
            dataIndex: 'operationTypeCode',
            customRender: ({ text }) => {
                return getLabel(text, operationTypeNameListOptions);
            }
        },
        {
            title: '作业单元类型',
            dataIndex: 'workUnitTypeName'
        },
        {
            title: '工序报工数',
            dataIndex: ''
        },
        {
            title: '单件计划工时',
            dataIndex: 'singlePlanHours'
        },
        {
            title: '工序计划工时(小时)',
            dataIndex: 'operationPlanHours'
        },
        {
            title: '计件单价(元)',
            dataIndex: 'pricePerQuantity'
        },
        {
            title: '计时单价',
            dataIndex: 'pricePerTime'
        },
        {
            title: '计时单位',
            dataIndex: 'pricePerTimeUnit',
            customRender: ({ text }) => {
                return getLabel(text, timeUnitOption);
            }
        },
        {
            title: '作业单元编号',
            dataIndex: 'workUnitCode'
        },
        {
            title: '作业单元名称',
            dataIndex: 'workUnitName'
        },
        {
            title: '责任人',
            dataIndex: 'userName'
        },
        {
            title: '备注',
            dataIndex: 'remark'
        }
    ] as TpfColumnType[]);

    const open = (ids: number[]) => {
        getDetailData(ids);
    };
    const getDetailData = async (ids: number[]) => {
        try {
            if (ids.length === 0) {
                message.warning('请选择数据!');
                return;
            }
            loading.value = true;
            const { data } = await jobOrderAPi.printProcessFlowCard({
                workOrderId: ids
            });
            const object = data.object;
            if (object.status === false) {
                message.error(object.message);
                return false;
            } else {
                setVisible(!visible.value);
                detailData.value = object.list;
                structuralData();
            }
        } catch (error) {
            console.log(error);
        } finally {
            loading.value = false;
        }
    };

    const structuralData = () => {
        if (detailData.value?.length) {
            const unitList = {
                SECOND: '1/60',
                MINUTE: 1,
                HOUR: 1 * 60,
                DAY: 1 * 60 * 24
            };

            detailData.value.forEach(item => {
                let perTotalTime: any;
                if (Array.isArray(item.list)) {
                    perTotalTime = item.list.reduce((t: any, v: any) => {
                        const scale = Number(eval(unitList[v.pricePerTimeUnit]));
                        const time = Number(v.singlePlanHours) * scale * item.plannedNumber;
                        t += time;
                        return t;
                    }, 0);
                    perTotalTime = new BigNumber(perTotalTime).toFixed(2);
                }
                item.allTime = perTotalTime;
                item.fromItem = fromItem.value.slice();
                item.fromItem.forEach((v: any) => (v.value = item[v.filedName]));
            });
            nextTick();
        }
    };
    const time: any = null;
    const onSave = async () => {
        loading.value = true;
        clearTimeout(time);
        setTimeout(() => onPrint(), 500);
    };
    const onPrint = () => {
        printJS({
            printable: 'ProcessFlowCard',
            maxWidth: 2000,
            targetStyles: [
                '*',
                '.ant-table-wrapper { table-layout: fixed !important;}',
                '.ant-table-thead > tr > th',
                '.ant-table-tbody > tr > td'
            ],
            style: `@page {size: A4 landscape;}`,
            type: 'html',
            onLoadingEnd: () => (loading.value = false)
        });
    };
    defineExpose({
        open
    });
</script>

<style lang="less" scoped>
    #ProcessFlowCard {
        :deep(.ant-row) {
            row-gap: 0 !important;
        }

        .ant-form .ant-form-item {
            margin-bottom: 10px;
        }

        .print-item {
            padding: 20px 10px 20px 10px;
        }

        .fromBox {
            height: 130px;

            .fromBox_left {
                float: left;
                width: 950px;
                height: 100%;
            }

            .fromBox_right {
                float: left;
                width: 100px;
                height: 100%;
            }

            .tpf-qrcode {
                canvas {
                    width: 100px;
                    height: 100px;
                }
            }
        }

        .tableBox {
            width: 100%;
            overflow-x: auto;
            white-space: nowrap;
        }
    }

    #print-table {
        overflow-x: unset !important;
        transform: scale(0.68, 0.7);
        transform-origin: left top;
        margin-top: 10px;
    }
</style>
