<template>
    <TpfModal
        class="printModal"
        :class="loading ? 'isShowModal' : ''"
        v-model:visible="visible"
        title="工序任务单打印"
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
                                    <a-col
                                        :span="8"
                                        v-if="v.filedName === 'operationTaskOrderCode'"
                                    >
                                        <a-form-item :name="v.filedName" :label="v.label">
                                            <span>{{ item[v.filedName] }}</span>
                                        </a-form-item>
                                    </a-col>

                                    <a-col :span="4" v-if="v.filedName === 'plannedNumber'">
                                        <a-form-item :name="v.filedName" :label="v.label">
                                            <span>{{ item[v.filedName] }}</span>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="6" v-if="v.filedName === 'operationCode'">
                                        <a-form-item :name="v.filedName" :label="v.label">
                                            <span>{{ item[v.filedName] }}</span>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="6" v-if="v.filedName === 'operationName'">
                                        <a-form-item :name="v.filedName" :label="v.label">
                                            <span>{{ item[v.filedName] }}</span>
                                        </a-form-item>
                                    </a-col>
                                    <!-- <a-col :span="6">
                                        <a-form-item :name="v.filedName" :label="v.label">
                                            <span>{{ item[v.filedName] }}</span>
                                        </a-form-item>
                                    </a-col> -->
                                </template>
                            </a-row>
                        </a-form>
                    </div>
                    <div class="fromBox_right">
                        <TpfQrcode
                            :width="100"
                            :text="
                                JSON.stringify({
                                    operationTaskOrderCode: item.operationTaskOrderCode
                                })
                            "
                        />
                    </div>
                </div>
                <div class="tableBox print-table">
                    <a-table
                        :columns="columns"
                        :data-source="detailData"
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
    import { useOperationTaskListAPi } from '@/api';
    import TpfQrcode from '@/components/TpfQrcode/index.vue';
    import { ref, nextTick } from 'vue';
    import { TpfColumnType } from '@/types';

    const [visible, setVisible] = useRef(false);

    const operationTaskListAPi = useOperationTaskListAPi();
    const loading = ref(false);
    const detailData = ref<any[]>();
    const fromItem = ref<any>([
        { label: '工序任务单号', value: '', filedName: 'operationTaskOrderCode' },
        { label: '工序编号', value: '', filedName: 'operationCode' },
        { label: '工序名称', value: '', filedName: 'operationName' },
        { label: '计划数', value: '', filedName: 'plannedNumber' }
    ]);
    const columns = ref([
        {
            title: '序号',
            dataIndex: 'seq',
            customRender: ({ index }) => index + 1
        },
        {
            title: '作业工单号',
            dataIndex: 'workOrderCode'
        },
        {
            title: '生产订单号',
            dataIndex: 'productionOrderCode'
        },
        {
            title: '项目编号',
            dataIndex: 'projectCode'
        },
        {
            title: '项目名称',
            dataIndex: 'projectName'
        },
        {
            title: '物料编号',
            dataIndex: 'materialCode'
        },
        {
            title: '物料名称',
            dataIndex: 'materialName'
        },
        {
            title: '图号',
            dataIndex: 'figureNum'
        },
        {
            title: '工序计划数',
            dataIndex: ''
        },
        {
            title: '计划开始日期',
            dataIndex: 'plannedStartDate'
        },
        {
            title: '计划结束日期',
            dataIndex: 'plannedEndDate'
        },
        {
            title: '作业单元名称',
            dataIndex: 'workUnitName'
        },
        {
            title: '班组',
            dataIndex: 'workUnitName'
        },
        {
            title: '责任人',
            dataIndex: 'chargeUserName'
        }
    ] as TpfColumnType[]);

    const open = async (ids: any) => {
        setVisible(!visible.value);
        const res = await operationTaskListAPi.printOperationTaskOrder(ids);
        const object = res.data.object;
        detailData.value = object.list;
        console.log(detailData);

        structuralData();
    };

    const structuralData = () => {
        if (detailData.value?.length) {
            detailData.value.forEach(item => {
                item.fromItem = fromItem.value.slice();
                item.fromItem.forEach((v: any) => (v.value = item[v.filedName]));
            });
            nextTick();
        }
    };
    const onSave = () => {
        loading.value = true;

        setTimeout(() => {
            printJS({
                printable: 'ProcessFlowCard',
                type: 'html',
                maxWidth: 2000,
                targetStyles: [
                    '*',
                    '.ant-table-wrapper { table-layout: fixed !important;}',
                    '.ant-table-thead > tr > th',
                    '.ant-table-tbody > tr > td'
                ],
                style: `@page {size: A4 landscape;}
                    @media print {
                        html, body {
                            width: 297mm;
                        }

                        #printProcessFlowCard {
                            width: 100%;
                        }
                        .fromBox {
                            width: 100%;
                            height: 150px;
                        }
                        .fromBox_left {
                            float: left;
                            width: 80%;
                            height: 100%;
                        }

                        .fromBox_right {
                            float: left;
                            width: 20%;
                            height: 100%;
                        }
                        .ant-table-wrapper {
                            table-layout: fixed !important;
                        }
                    }
                    `
            });
            loading.value = false;
        }, 500);
    };
    defineExpose({
        open
    });
</script>

<style lang="less" scoped>
    #ProcessFlowCard {
        .print-item {
            padding: 20px 10px 20px 10px;
            // border-bottom: 1px dashed #ccc;
        }

        .fromBox {
            height: 100px;

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
                // margin-left: 35px;
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

    .isShowModal {
        overflow: unset;

        .print {
            .print-table {
                overflow-x: unset !important;
                transform: scale(0.68, 0.7);
                transform-origin: left top;
                margin-top: 10px;
            }
        }
    }
</style>
