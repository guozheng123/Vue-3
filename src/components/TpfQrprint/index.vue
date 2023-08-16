<template>
    <div class="print">
        <TpfModal
            class="InfoModal"
            v-model:visible="visible"
            height="300px"
            :width="width"
            :title="title"
            v-bind="$attrs"
        >
            <div id="printBox">
                <template v-for="(item, index) in printList.data" :key="index">
                    <div class="print_item">
                        <div
                            class="fl w40"
                            v-for="(printListItem, printListKey) in printList.content"
                            :key="printListKey"
                        >
                            <span>{{ printListItem.label }}:</span
                            ><span>{{ item[printListItem.key] }}</span>
                        </div>
                        <div class="fl w20"
                            ><TpfQrcode :width="80" :text="JSON.stringify(item.qrPrint)"
                        /></div>
                    </div>
                </template>
            </div>
            <template #footerRight>
                <a-button class="tpf-button" @click="setVisible(false)">取消</a-button>
                <a-button class="tpf-button" type="primary" @click="onSave">打印</a-button>
            </template>
        </TpfModal>
    </div>
</template>

<script setup lang="ts">
    import { ref, unref } from 'vue';
    import { useRef } from '@/hooks';
    import printJS from 'print-js';
    import TpfModal from '@/components/TpfModal/index.vue';
    import TpfQrcode from '@/components/TpfQrcode/index.vue';

    const emits = defineEmits(['emitOnPrint']);

    type Props = {
        width?: string;
    };
    const props = withDefaults(defineProps<Props>(), {
        width: '600px'
    });

    const [visible, setVisible] = useRef(false);
    const title = ref('打印');
    const printTitle = ref('');
    const printList = ref<any>([]);
    const open = (v: any) => {
        setVisible(!visible.value);
        printList.value = v;
        console.log(v);

        printTitle.value = v.title;
    };
    const onSave = async () => {
        emits('emitOnPrint');
        printJS({
            printable: 'printBox',
            type: 'html',
            header: unref(printTitle),
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
            justify-content: center;
            width: 100%;
            height: 100px;
            padding: 10px 24px;
            border-radius: 8px 8px 8px 8px;
            opacity: 1;
            border: 1px solid #e1e2e3;
            margin-bottom: 10px;
        }
    }

    .fl {
        float: left;
    }

    .w40 {
        width: 40%;
    }

    .w20 {
        width: 20%;
    }
</style>
