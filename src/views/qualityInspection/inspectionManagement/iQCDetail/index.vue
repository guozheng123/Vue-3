<template>
    <TpfAddInfoLayout title="检验详情" class="detail">
        <LoadingSkeleton>
            <Base v-if="baseDataVal" :baseDataVal="baseDataVal" />
        </LoadingSkeleton>
        <LoadingSkeleton>
            <Result v-if="paramsData" :paramsData="paramsData" />
        </LoadingSkeleton>
        <LoadingSkeleton>
            <Inspection v-if="paramsData" :paramsData="paramsData" />
        </LoadingSkeleton>
        <LoadingSkeleton>
            <CauseDefect v-if="paramsData" :paramsData="paramsData" />
        </LoadingSkeleton>

        <template #footerRight>
            <a-button @click="back" class="tpf-button"> 关闭 </a-button>
        </template>
    </TpfAddInfoLayout>
</template>

<script setup lang="ts" name="activityTypeDetail">
    import { ref, defineAsyncComponent, onMounted } from 'vue';
    import { useIqcAPi } from '@/api';
    import { useRouteBackTab, useRouteQuery } from '@/hooks';
    import TpfAddInfoLayout from '@/components/TpfAddInfoLayout/index.vue';

    const { routeBackTab } = useRouteBackTab();

    const useIqc = useIqcAPi();

    const Base = defineAsyncComponent(() => import('./component/Base.vue'));
    const Result = defineAsyncComponent(() => import('./component/Result.vue'));
    const Inspection = defineAsyncComponent(() => import('./component/Inspection.vue'));
    const CauseDefect = defineAsyncComponent(() => import('./component/CauseDefect.vue'));

    const { baseData, inspectOrderId, materialCode } = useRouteQuery<{
        baseData: any;
        inspectOrderId: string;
        materialCode: string;
    }>();
    const baseDataVal = ref<{ [k: string]: any } | null>({});
    const paramsData = ref<{ [k: string]: any } | null>(null);

    const back = () => {
        routeBackTab();
    };

    const load = async () => {
        baseDataVal.value = JSON.parse(baseData);

        const res = await useIqc.getInspectDetailById({
            inspectOrderId: inspectOrderId,
            materialCode: materialCode
        });
        paramsData.value = res.data.object;
    };

    onMounted(async () => {
        load();
    });
</script>

<style scoped lang="less">
    .detail {
        :deep(.addInfoLayout-content) {
            // padding: 0 12px;
            box-sizing: border-box;
        }

        :deep(.tpf-collapse) {
            .tpf-collapse-content {
                background: #fff;
            }
        }
    }
</style>
