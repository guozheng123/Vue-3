<template>
    <div class="messageMail">
        <a-tabs @change="changeTabs(activeKey)" v-model:activeKey="activeKey">
            <a-tab-pane key="Unread" tab="未读">
                <LoadingSkeleton>
                    <Unread v-if="activeKey === 'Unread'" />
                </LoadingSkeleton>
            </a-tab-pane>

            <a-tab-pane key="Read" tab="已读" force-render>
                <LoadingSkeleton>
                    <Read v-if="activeKey === 'Read'" />
                </LoadingSkeleton>
            </a-tab-pane>

            <a-tab-pane key="Whole" tab="全部" force-render>
                <LoadingSkeleton>
                    <Whole v-if="activeKey === 'Whole'" />
                </LoadingSkeleton>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script setup lang="tsx" name="messageMail">
    import { ref, defineAsyncComponent } from 'vue';

    const Unread = defineAsyncComponent(() => import('./component/Unread.vue'));
    const Read = defineAsyncComponent(() => import('./component/Read.vue'));
    const Whole = defineAsyncComponent(() => import('./component/Whole.vue'));

    const activeKey = ref('Unread');
    const changeTabs = (key: string) => {
        activeKey.value = key;
    };
</script>

<style lang="less">
    .messageMail {
        padding: 10px 12px;
        height: 100%;
        background-color: #f7f8fa;

        .ant-tabs {
            background-color: #fff;
            display: flex;
            height: 100%;
            flex-direction: column;

            .ant-tabs-content-holder {
                flex: 1;

                .ant-tabs-content {
                    height: 100%;
                }
            }

            .ant-tabs-nav {
                margin: 0;
                padding-left: 31px;
            }

            .ant-layout {
                padding-top: 10px;
                padding-right: 0;
                padding-bottom: 0;
                height: 100%;
                background-color: #f7f8fa;
            }
        }
    }
</style>
