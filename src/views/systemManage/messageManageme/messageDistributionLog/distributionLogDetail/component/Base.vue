<template>
    <div>
        <TpfCollapse title="消息内容" id="productionOrder">
            <div class="box">
                <p class="mb-1">【生产{{ info.object }}】 {{ info.noticeCondition }}</p>
                <p class="mb-2">{{ info.msgInfo }}</p>
            </div>
        </TpfCollapse>
    </div>
</template>

<script setup lang="ts" name="Base">
    import { watchEffect, ref } from 'vue';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import { getTpfOptionEnum } from '@/config';

    type Props = {
        data?: any;
    };
    const props = withDefaults(defineProps<Props>(), {
        data: () => ({})
    });
    const info = ref({
        msgInfo: '',
        noticeCondition: '',
        object: ''
    });

    const { getLabel, materialCodeMaterialMold } = getTpfOptionEnum();

    watchEffect(() => {
        if (props.data) {
            info.value = props.data;
        }
    });
</script>

<style scoped lang="less">
    .box {
        .mb-1 {
            margin-top: 5px;
            font-weight: bold;
            font-size: 23px;
        }

        .mb-2 {
            margin: 10px 20px;
        }
    }

    :deep(.ant-card) {
        .ant-card-body {
            padding: 8px 12px 8px 12px;

            .title_name {
                padding-left: 16px !important;
                color: #1d2129;
                font-size: 16px;
            }
        }
    }
</style>
