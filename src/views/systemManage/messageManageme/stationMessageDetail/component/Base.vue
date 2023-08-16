<template>
    <div>
        <TpfCollapse title="消息内容" id="productionOrder">
            <div class="box">
                <div class="title_message">
                    <p class="mb-1">{{ info.templateTitle }}</p>
                    <p class="mb-2">{{ info.createDateTime }}</p></div
                >
                <div class="main-message">
                    <p class="mb-3">{{ info.sendInfo }}</p>
                </div>
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
        templateTitle: '',
        createDateTime: '',
        sendInfo: ''
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
        // margin: 10px;
        .title_message {
            margin: 10px;
            border-bottom: 1px solid #e8e8e8;
        }

        .mb-1 {
            margin-top: 5px;
            font-weight: bold;
            font-size: 23px;
        }

        .mb-2 {
            margin: 10px 0;
        }

        .main-message {
            margin: 20px 10px;
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
