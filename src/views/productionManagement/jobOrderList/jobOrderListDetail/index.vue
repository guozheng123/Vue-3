<template>
    <TpfAddInfoLayout title="作业工单详情" class="jobOrderListDetail">
        <a-tabs v-model:activeKey="activeKey" class="order-tab">
            <a-tab-pane key="jobOrderListDetail" tab="作业工单详情" />
            <a-tab-pane key="workOrderInfo" tab="加工进度" />
            <a-tab-pane key="processBomInfo" tab="工序BOM" />
        </a-tabs>
        <div class="tab-content-com scrollbarColor">
            <LoadingSkeleton>
                <Transition
                    mode="out-in"
                    appear
                    enter-active-class="animate__animated animate__fadeIn animate__faster"
                    leave-active-class="animate__animated animate__fadeOut animate__faster"
                >
                    <component :is="currentCom" :key="activeKey" :detailData="detailData" />
                </Transition>
            </LoadingSkeleton>
        </div>
        <template #footerRight="{ goBack }">
            <a-button class="tpf-button" @click="goBack"> 关闭 </a-button>
        </template>
    </TpfAddInfoLayout>
</template>

<script setup lang="ts" name="OrderDetail">
    import TpfAddInfoLayout from '@/components/TpfAddInfoLayout/index.vue';
    import { useJobOrderAPi } from '@/api';
    import { ref, defineAsyncComponent, computed, unref, onMounted } from 'vue';
    import { useRouteQuery } from '@/hooks';

    const { workOrderId, workOrderCode } = useRouteQuery<{
        workOrderId: string;
        workOrderCode: string;
    }>();

    const jobOrderListDetail = defineAsyncComponent(
        () => import('./components/jobOrderListDetail.vue')
    );

    const processBomInfo = defineAsyncComponent(() => import('./components/processBomInfo.vue'));

    const workOrderInfo = defineAsyncComponent(() => import('./components/workOrderInfo.vue'));

    const jobOrderAPi = useJobOrderAPi();

    const componentList = { jobOrderListDetail, processBomInfo, workOrderInfo };

    const activeKey = ref('jobOrderListDetail');

    const loading = ref(false);

    const detailData = ref<Record<string, any>>({});

    const getMaterialByIdInfo = async () => {
        try {
            loading.value = true;
            detailData.value = await jobOrderAPi
                .getWorkOrderDetails({ workOrderId, workOrderCode })
                .then(res => res.data.object || {});
        } catch (error) {
            console.log('作业工单：详情' + error);
        } finally {
            loading.value = false;
        }
    };

    const currentCom = computed(() => {
        return componentList[unref(activeKey)];
    });

    onMounted(() => {
        getMaterialByIdInfo();
    });
</script>

<style lang="less" scoped>
    .jobOrderListDetail {
        :deep(.addInfoLayout-content) {
            padding: 10px 12px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
        }

        :deep(.tpf-collapse) {
            .tpf-collapse-content {
                background: #fff;
            }
        }

        height: 100%;
        background-color: #f7f8fa;
        display: flex;
        flex-direction: column;

        .tab-content-com {
            flex: 1;
            overflow: auto;
            background-color: #fff;
            box-sizing: border-box;
        }

        :deep(.ant-tabs).order-tab {
            background-color: #fff;

            .ant-tabs-nav {
                margin-bottom: 0;
            }

            .ant-tabs-nav-wrap {
                padding-left: 46px;

                .ant-tabs-tab {
                    padding-left: 13px;
                    padding-right: 13px;
                }
            }
        }
    }
</style>
