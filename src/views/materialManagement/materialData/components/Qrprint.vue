<template>
    <TpfModal
        class="InfoModal"
        v-model:visible="visible"
        height="300px"
        width="600px"
        :title="title"
    >
        <div id="printBox">
            <template v-for="item in printList" :key="item.materialsCode">
                <div class="print_item">
                    <div class="t-flex-1">
                        <span>物料编号:</span><span>{{ item.materialCode }}</span>
                    </div>
                    <div class="t-flex-1">
                        <span>物料名称:</span><span>{{ item.materialName }}</span>
                    </div>
                    <div>
                        <TpfQrcode
                            style="width: 100%"
                            :width="80"
                            :text="JSON.stringify(item.qrPrint)"
                        />
                    </div>
                </div>
            </template>
        </div>
        <template #footerRight>
            <a-button class="tpf-button" @click="setVisible(false)">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="onSave">打印</a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { useRef } from '@/hooks';
    import printJS from 'print-js';
    import TpfModal from '@/components/TpfModal/index.vue';
    import TpfQrcode from '@/components/TpfQrcode/index.vue';
    type printListType = {
        id: number;
        materialCode: string;
        materialName: string;
        qrPrint: any;
    };
    const [visible, setVisible] = useRef(false);
    const title = ref('打印');
    const printList = ref<printListType[]>([]);
    const open = (v: any) => {
        setVisible(!visible.value);
        printList.value = v;
    };
    const onSave = async () => {
        printJS({
            printable: 'printBox',
            type: 'html',
            header: '物料数据',
            style: `@page {margin-top:1mm;margin-bottom:1mm;}
                    .print_item{
                        width: 100%;
                        height: 100px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 8px 8px 8px 8px;
                        opacity: 1;
                        border: 1px solid #e1e2e3;
                        margin-bottom: 10px;
                    }
                    .fl{
                        float:left;
                    }`,
            font_size: '14px'
        });
    };
    defineExpose({
        open
    });
</script>

<style scoped lang="less">
    #printBox {
        .print_item {
            display: flex;
            align-items: center;
            width: 100%;
            padding: 10px 12px;
            border-radius: 8px 8px 8px 8px;
            opacity: 1;
            border: 1px solid #e1e2e3;
            margin-bottom: 10px;
        }
    }
</style>
