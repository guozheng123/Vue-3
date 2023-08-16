<template>
    <div class="material-in-storage-order">
        <a-tabs v-model:activeKey="activeKey" class="order-tab">
            <a-tab-pane key="NotInStorageOrder" tab="待入库" />
            <a-tab-pane key="InStoragedOrder" tab="已入库" />
            <a-tab-pane key="InStoragedOrderDetail" tab="已入库明细" />
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

<script setup lang="tsx" name="materialInStorageOrder">
    import { ref, computed, unref } from 'vue';
    import NotInStorageOrder from './notInStorageOrder/index.vue';
    import InStoragedOrder from './inStoragedOrder/index.vue';
    import InStoragedOrderDetail from './inStoragedOrderDetail/index.vue';
    const componentList = { NotInStorageOrder, InStoragedOrder, InStoragedOrderDetail };
    const activeKey = ref('NotInStorageOrder');
    const currentCom = computed(() => {
        return componentList[unref(activeKey)];
    });
</script>

<style lang="less" scoped>
    .material-in-storage-order {
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
