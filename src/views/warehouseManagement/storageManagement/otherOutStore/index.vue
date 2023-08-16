<template>
    <div class="other-out-store">
        <a-tabs v-model:activeKey="activeKey" class="order-tab">
            <a-tab-pane key="OutStoreOrder" tab="出库单" />
            <a-tab-pane key="OutStoreOrderOrderDetail" tab="出库单明细" />
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
    </div>
</template>

<script setup lang="tsx" name="otherOutStorage">
    import { ref, computed, unref } from 'vue';
    import OutStoreOrder from './outStoreOrder/index.vue';
    import OutStoreOrderOrderDetail from './outStoreOrderOrderDetail/index.vue';
    const componentList = { OutStoreOrder, OutStoreOrderOrderDetail };
    const activeKey = ref('OutStoreOrder');
    const currentCom = computed(() => {
        return componentList[unref(activeKey)];
    });
</script>

<style lang="less" scoped>
    .other-out-store {
        height: 100%;
        display: flex;
        flex-direction: column;

        :deep(.tab-content-com) {
            flex: 1 0 0;
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
