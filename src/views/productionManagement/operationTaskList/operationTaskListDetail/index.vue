<template>
    <TpfAddInfoLayout title="工序任务单详情" class="operationTaskListDetail">
        <a-tabs v-model:activeKey="activeKey" class="order-tab">
            <a-tab-pane key="OperationTaskListDetail" tab="工序任务单详情" />
            <a-tab-pane key="ProcessingProgress" tab="加工进度" />
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
        <template #footerRight>
            <a-button class="tpf-button" @click="cancelEdit"> 关闭 </a-button>
        </template>
    </TpfAddInfoLayout>
</template>

<script setup lang="ts" name="OrderDetail">
    import TpfAddInfoLayout from '@/components/TpfAddInfoLayout/index.vue';
    import { ref, defineAsyncComponent, computed, unref } from 'vue';
    import { useRouteBackTab } from '@/hooks';

    const OperationTaskListDetail = defineAsyncComponent(
        () => import('./components/OperationTaskListDetail.vue')
    );

    const ProcessingProgress = defineAsyncComponent(
        () => import('./components/ProcessingProgress.vue')
    );
    const { routeBackTab } = useRouteBackTab();

    const componentList = { OperationTaskListDetail, ProcessingProgress };

    const activeKey = ref('OperationTaskListDetail');

    const currentCom = computed(() => {
        return componentList[unref(activeKey)];
    });
    const cancelEdit = () => {
        routeBackTab();
    };
</script>

<style lang="less" scoped>
    .operationTaskListDetail {
        :deep(.addInfoLayout-content) {
            padding: 10px 12px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
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
