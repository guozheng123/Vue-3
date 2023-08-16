<template>
    <TpfAddInfoLayout title="消息详情" class="detail">
        <LoadingSkeleton>
            <!-- 消息内容 -->
            <Base :data="Stationmessage" />
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
    const Stationmessage = ref<any>({});
    const messageApi = useMessageApi();

    const { sendDetailNo } = useRouteQuery<{ sendDetailNo: any }>();

    // 消息内容
    const Base = defineAsyncComponent(() => import('./component/Base.vue'));

    // 关闭
    const back = () => {
        routeBackTab();
    };

    const getGuidebookInfo = async () => {
        try {
            Stationmessage.value = await messageApi
                .detailStationMessage({
                    sendDetailNo
                })
                .then((res: any) => res.data.object || {});
            // console.log(res, 'res');
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
