<template>
    <TpfModal
        class="printModal"
        :class="loading ? 'isShowModal' : ''"
        v-model:visible="visible"
        title="工序交接单"
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
                            :text="
                                JSON.stringify({
                                    handoverOrderCode: item.handoverOrderCode
                                })
                            "
                        />
                    </div>
                </div>
                <div class="tableBox print-table">
                    <a-table
                        :columns="columns"
                        :data-source="item.detailList"
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
    import { useHandoverAPi } from '@/api';
    import TpfQrcode from '@/components/TpfQrcode/index.vue';
    import { ref, nextTick } from 'vue';
    import { TpfColumnType } from '@/types';

    const [visible, setVisible] = useRef(false);

    const useHandover = useHandoverAPi();
    const loading = ref(false);
    const detailData = ref<any>();
    const fromItem = ref<any>([
        { label: '交接单号', value: '', filedName: 'handoverOrderCode' },
        { label: '交接总数', value: '', filedName: 'totalRecipientNumber' },
        { label: '工序', value: '', filedName: 'operationName' },
        { label: '创建人', value: '', filedName: 'createUserName' },
        { label: '创建时间', value: '', filedName: 'createDatetime' }
    ]);
    const columns = ref([
        {
            title: '序号',
            dataIndex: 'seq',
            customRender: ({ index }) => index + 1
        },
        {
            title: '项目编号',
            dataIndex: 'projectCode'
        },
        {
            title: '物料编码',
            dataIndex: 'materialCode'
        },
        {
            title: '物料名称',
            dataIndex: 'materialName'
        },
        {
            title: '交接数量',
            dataIndex: 'handoverNumber'
        },
        {
            title: '作业工单编号',
            dataIndex: 'workOrderCode'
        }
    ] as TpfColumnType[]);

    const open = async (val: string[]) => {
        setVisible(!visible.value);
        const res = await useHandover.handoverDetail(val);
        detailData.value = res.data.list;
        structuralData();
    };

    const structuralData = () => {
        if (detailData.value?.length) {
            detailData.value.forEach((item: any) => {
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
