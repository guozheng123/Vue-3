<template>
    <TpfAddInfoLayout title="消息发送日志详情" class="detail">
        <LoadingSkeleton>
            <!-- 接收人 -->
            <Inspection readOnly :list="messageLog.msgDetialList" />
        </LoadingSkeleton>
        <LoadingSkeleton>
            <!-- 消息内容 -->
            <Base :data="messageLog" />
        </LoadingSkeleton>

        <template #footerRight>
            <a-button @click="back" class="tpf-button"> 关闭 </a-button>
        </template>
    </TpfAddInfoLayout>
</template>

<script setup lang="ts" name="activityTypeDetail">
    import { ref, defineAsyncComponent, onMounted } from 'vue';
    import { useMessageApi } from '@/api';
    import { useRouteBackTab, useRouteQuery } from '@/hooks';
    import TpfAddInfoLayout from '@/components/TpfAddInfoLayout/index.vue';

    const { routeBackTab } = useRouteBackTab();
    const messageLog = ref<any>({});
    const messageApi = useMessageApi();

    const { eventNo } = useRouteQuery<{ eventNo: any }>();

    // 接收人
    const Inspection = defineAsyncComponent(() => import('./component/Inspection.vue'));
    // 消息内容
    const Base = defineAsyncComponent(() => import('./component/Base.vue'));

    // 关闭
    const back = () => {
        routeBackTab();
    };

    const getGuidebookInfo = async () => {
        try {
            messageLog.value = await messageApi
                .detailMessageLog({
                    eventNo
                })
                .then(res => res.data.object || {});
        } finally {
            // loading.value = false;
        }
    };

    onMounted(async () => {
        getGuidebookInfo();
    });
</script>

<style scoped lang="less">
    .detail {
        :deep(.addInfoLayout-content) {
            box-sizing: border-box;
        }

        :deep(.tpf-collapse) {
            .tpf-collapse-content {
                background: #fff;
            }
        }
    }
</style>
