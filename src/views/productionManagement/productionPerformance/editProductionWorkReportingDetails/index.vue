<template>
    <div>
        <TpfDetailLayout @onSave="onSave">
            <template #header>
                <TpfDetailTitle title="修改-生产报工明细" />
            </template>
            <template #content>
                <div class="main">
                    <div class="content">
                        <Information v-if="data" :data="data" ref="informationRef" />
                        <ReportingTime v-if="data" :data="data" ref="reportingTimeRef" />
                    </div>
                </div>
            </template>
        </TpfDetailLayout>
    </div>
</template>

<script setup lang="ts" name="AddWorkingProcedure">
    import { ref, defineAsyncComponent, onMounted } from 'vue';
    import { useExecReportApi } from '@/api';
    import { useRouteQuery } from '@/hooks';
    import { message } from 'ant-design-vue';
    import { useRouteBackTab } from '@/hooks';

    const TpfDetailLayout = defineAsyncComponent(
        () => import('@/components/TpfDetailLayout/index.vue')
    );
    const ReportingTime = defineAsyncComponent(() => import('./ReportingTime.vue'));
    const Information = defineAsyncComponent(() => import('./Information.vue'));
    const TpfDetailTitle = defineAsyncComponent(
        () => import('@/components/TpfDetailTitle/index.vue')
    );
    const execReportApi = useExecReportApi();
    const { reportProgressId } = useRouteQuery<{ reportProgressId: string }>();

    const { routeBackTab } = useRouteBackTab();
    const data = ref<{ [k: string]: any } | null>(null);
    const informationRef: any = ref(null);
    const reportingTimeRef: any = ref(null);

    const onSave = () => {
        Promise.all([reportingTimeRef.value?.reportingTimeRef?.validate()]).then(async function () {
            const params = {
                reportProgressId: reportProgressId,
                ...reportingTimeRef.value?.formState
            };
            const res = await execReportApi.updateReportProgressData(params);
            if (res.data.value === true) {
                message.success('保存成功');
                back();
            }
        });
    };
    const back = () => {
        routeBackTab();
    };

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
