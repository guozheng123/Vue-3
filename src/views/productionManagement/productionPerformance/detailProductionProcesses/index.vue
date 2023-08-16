<template>
    <div>
        <TpfDetailLayout @onSave="onSave" :isShow="false">
            <template #header>
                <TpfDetailTitle title="工序BOM详情" />
            </template>
            <template #content>
                <div class="main">
                    <div class="contents">
                        <div>
                            <LoadingSkeleton>
                                <Information v-if="data" :data="data" ref="informationRef" />
                            </LoadingSkeleton>
                        </div>
                        <div>
                            <LoadingSkeleton>
                                <ProductionProcessesBOM
                                    v-if="data"
                                    :data="data"
                                    ref="productionProcessesBOM"
                                />
                            </LoadingSkeleton>
                        </div>
                    </div>
                </div>
            </template>
        </TpfDetailLayout>
    </div>
</template>

<script setup lang="ts" name="DetailProductionProcesses">
    import { ref, defineAsyncComponent, onMounted } from 'vue';
    import { useRouteQuery } from '@/hooks';
    import { useExecReportApi } from '@/api';

    const TpfDetailLayout = defineAsyncComponent(
        () => import('@/components/TpfDetailLayout/index.vue')
    );
    const ProductionProcessesBOM = defineAsyncComponent(
        () => import('./ProductionProcessesBOM.vue')
    );
    const Information = defineAsyncComponent(() => import('./Information.vue'));
    const TpfDetailTitle = defineAsyncComponent(
        () => import('@/components/TpfDetailTitle/index.vue')
    );
    const data = ref<{ [k: string]: any } | null>(null);

    const execReportApi = useExecReportApi();

    const informationRef: any = ref(null);
    const productionProcessesBOM: any = ref(null);

    const onSave = () => {};

    const { reportProgressId } = useRouteQuery<{ reportProgressId: string }>();

    const load = async () => {
        const res = await execReportApi.getUpdateReportProgressDetail({
            reportProgressId: reportProgressId
        });
        data.value = res.data.object;
    };
    onMounted(() => {
        load();
    });
</script>

<style scoped lang="less">
    .main {
        position: relative;

        :deep(.ant-card) {
            border-radius: 8px;

            .ant-card-body {
                padding: 8px 12px 8px 12px;

                .title_name {
                    padding-left: 16px !important;
                    color: #1d2129;
                    font-size: 16px;
                }
            }
        }
    }
</style>
