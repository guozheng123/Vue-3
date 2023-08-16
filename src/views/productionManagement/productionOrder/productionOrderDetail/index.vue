<template>
    <TpfAddInfoLayout title="生产订单详情" class="productionOrderDetail">
        <a-tabs v-model:activeKey="activeKey" class="order-tab">
            <a-tab-pane key="ProductionOrderInfo" tab="生产订单详情" />
            <a-tab-pane key="WorkOrderInfo" tab="作业工单详情" />
            <a-tab-pane key="ProcessBomInfo" tab="工序BOM" />
        </a-tabs>
        <div class="tab-content-com">
            <LoadingSkeleton>
                <Transition
                    mode="out-in"
                    appear
                    enter-active-class="animate__animated animate__fadeIn animate__faster"
                    leave-active-class="animate__animated animate__fadeOut animate__faster"
                >
                    <component :is="currentCom" :key="activeKey" />
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

    import { ref, defineAsyncComponent, computed, unref } from 'vue';

    const ProductionOrderInfo = defineAsyncComponent(
        () => import('./components/ProductionOrderInfo.vue')
    );

    const ProcessBomInfo = defineAsyncComponent(() => import('./components/ProcessBomInfo.vue'));

    const WorkOrderInfo = defineAsyncComponent(() => import('./components/WorkOrderInfo.vue'));

    const componentList = { ProductionOrderInfo, WorkOrderInfo, ProcessBomInfo };

    const activeKey = ref('ProductionOrderInfo');

    const currentCom = computed(() => {
        return componentList[unref(activeKey)];
    });
</script>

<style lang="less" scoped>
    .productionOrderDetail {
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
            // padding: 0 12px;
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
