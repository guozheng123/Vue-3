<template>
    <div>
        <div id="printProcessFlowCard">
            <div class="fromBox">
                <div class="fromBox_left">
                    <a-form ref="formRef">
                        <a-row>
                            <template v-for="(item, index) in fromItem" :key="index">
                                <a-col :span="6">
                                    <a-form-item :name="item.filedName" :label="item.label">
                                        <span>{{ item.value }}</span>
                                    </a-form-item>
                                </a-col>
                            </template>
                        </a-row>
                    </a-form>
                </div>
                <div class="fromBox_right">
                    <TpfQrcode :width="100" :text="JSON.stringify(qrPrint)" />
                </div>
            </div>
            <div class="tableBox">
                <a-table :columns="columns" :data-source="data" :pagination="false" size="small" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    // import print from 'vue3-print-nb';
    import TpfQrcode from '@/components/TpfQrcode/index.vue';
    import { TpfColumnType } from '@/types';
    const visible = ref<boolean>(false);
    const fromItem = ref([
        { label: '作业工单号：', value: '111111111', filedName: 'zuoyegongdan' },
        { label: '生产订单号：', value: '111111111', filedName: 'shengchandingdan' },
        { label: '物料编号：', value: '111111111', filedName: 'wuliaobianhao' },
        { label: '物料名称：', value: '111111111', filedName: 'wuliaomingcheng' },
        { label: '项目编号：', value: '111111111', filedName: 'xiangmubianhao' },
        { label: '项目名称：', value: '111111111', filedName: 'xiangmumingcheng' },
        { label: '计划开始时间：', value: '111111111', filedName: 'jihuakaishishijian' },
        { label: '计划结束时间：', value: '111111111', filedName: 'jihuajieshushijian' },
        { label: '客户简称：', value: '111111111', filedName: 'kehujiancheng' },
        { label: '工艺名称：', value: '111111111', filedName: 'gongyimingcheng' },
        { label: '计划数：', value: '111111111', filedName: 'jihuashu' },
        { label: '总工时（分钟）：', value: '111111111', filedName: 'zonggongshi' }
    ]);
    const columns = ref([
        {
            title: '序号',
            dataIndex: 'seq',
            customRender: ({ index }) => index + 1
        },
        {
            title: '工单编号',
            dataIndex: 'gongdanbianhao'
        },
        {
            title: '工序名称',
            dataIndex: 'gongxumingcheng'
        },
        {
            title: '工序类型',
            dataIndex: 'gongxuleixing'
        },
        {
            title: '作业单元类型',
            dataIndex: 'zuoyedanyuanleixing'
        },
        {
            title: '工序报工数',
            dataIndex: 'gongxubaogongshu'
        },
        {
            title: '单位计划工时',
            dataIndex: 'danweijihuagongshi'
        },
        {
            title: '工序计划工时(小时)',
            dataIndex: 'gongxujihuagongshi'
        },
        {
            title: '计件单价(元)',
            dataIndex: 'jijiadanjia'
        },
        {
            title: '计时单价',
            dataIndex: 'jishidanjia'
        },
        {
            title: '计时单位',
            dataIndex: 'jishidanwei'
        },
        {
            title: '作业单元编号',
            dataIndex: 'zuoyedanyuanbianhao'
        },
        {
            title: '作业单元名称',
            dataIndex: 'zuoyedanyuanmingcheng'
        },
        {
            title: '责任人',
            dataIndex: 'zerenren'
        },
        {
            title: '备注',
            dataIndex: 'beizhu'
        }
    ] as TpfColumnType[]);
    const data = ref([
        {
            id: '1',
            gongdanbianhao: '11111111',
            gongdanmingcheng: '1111111',
            zerenren: '11111'
        },
        { id: '2', gongdanbianhao: '111111', gongdanmingcheng: '1111111', zerenren: '11111' },
        { id: '3', gongdanbianhao: '111111', gongdanmingcheng: '1111111', zerenren: '11111' },
        { id: '4', gongdanbianhao: '111111', gongdanmingcheng: '1111111', zerenren: '11111' },
        { id: '5', gongdanbianhao: '111111', gongdanmingcheng: '1111111', zerenren: '11111' }
    ] as any[]);
    const qrPrint = ref({
        label: '总工时（分钟）：',
        value: '111111111',
        filedName: 'zonggongshi'
    });
    const open = () => {
        visible.value = true;
    };

    defineExpose({
        open
    });
</script>

<style lang="less">
    #printProcessFlowCard {
        width: 100%;

        .fromBox {
            height: 150px;

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

            .tpf-qrcode {
                margin-left: 35px;

                canvas {
                    width: 100px;
                    height: 100px;
                }
            }
        }

        .tableBox {
            padding: 0 1px;

            table {
                width: 100%;
                border-top: 1px solid #000 !important;
                border-right: 1px solid #000 !important;
                font-size: 12px;
            }
        }

        .ant-table-thead > tr > th {
            border-left: 1px solid #000 !important;
            border-bottom: 1px solid #000 !important;
        }

        .ant-table-tbody > tr > td {
            border-left: 1px solid #000 !important;
            border-bottom: 1px solid #000 !important;
        }
    }
</style>
