<template>
    <div class="buildBusiness">
        <a-tabs v-model:activeKey="activeKey" class="buildBusiness-tab">
            <a-tab-pane key="Group" tab="集团" />
            <a-tab-pane key="Company" tab="公司" />
            <a-tab-pane key="Factory" tab="工厂" />
            <a-tab-pane key="Workshop" tab="车间" />
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

<script setup lang="ts" name="BuildBusiness">
    import { ref, defineAsyncComponent, computed, unref } from 'vue';

    const Factory = defineAsyncComponent(() => import('./Factory/index.vue'));
    const Workshop = defineAsyncComponent(() => import('./Workshop/index.vue'));
    const Group = defineAsyncComponent(() => import('./Group/index.vue'));
    const Company = defineAsyncComponent(() => import('./Company/index.vue'));

    const componentList = { Factory, Workshop, Group, Company };
    const activeKey = ref('Group');

    const currentCom = computed(() => {
        return componentList[unref(activeKey)];
    });
</script>

<style lang="less" scoped>
    .buildBusiness {
        padding: 10px 12px;
        height: 100%;
        background-color: #f7f8fa;
        display: flex;
        flex-direction: column;

        .tab-content-com {
            flex: 1;
            overflow: auto;
            background-color: #fff;
        }

        :deep(.ant-tabs).buildBusiness-tab {
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
