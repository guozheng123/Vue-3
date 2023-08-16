<template>
    <TpfAddInfoLayout title="编辑工艺" class="processEdit">
        <LoadingSkeleton>
            <ProcessInfo ref="processInfo" :processInfoData="processInfoData" />
        </LoadingSkeleton>
        <LoadingSkeleton>
            <WorkingProcedure
                ref="workingProcedure"
                :tableList="tableList"
                :processInfoData="processInfoData"
        /></LoadingSkeleton>

        <template #footerRight>
            <a-button @click="back" class="tpf-button"> 取消 </a-button>
            <a-button @click="onSave" type="primary" class="tpf-button"> 保存 </a-button>
        </template>
    </TpfAddInfoLayout>
</template>

<script setup lang="ts" name="processEdit">
    import { ref, unref, defineAsyncComponent, onMounted, computed } from 'vue';
    import { message } from 'ant-design-vue';
    import { useJobOrderAPi } from '@/api';
    import { useRouteBackTab, useRouteQuery } from '@/hooks';
    import TpfAddInfoLayout from '@/components/TpfAddInfoLayout/index.vue';

    const ProcessInfo = defineAsyncComponent(() => import('./components/ProcessInfo.vue'));

    const WorkingProcedure = defineAsyncComponent(
        () => import('./components/WorkingProcedure.vue')
    );

    const { routeBackTab } = useRouteBackTab();

    const getRouteQuery = useRouteQuery<{ workOrderId: string; processId: string }>();

    const jobOrderAPi = useJobOrderAPi();
    const loading = ref(false);
    const tableList = ref<any[]>([]);
    const processInfo = ref();
    const workingProcedure = ref();
    const processInfoData = ref({});
    let copyLastTable: any[] = [];
    const init = () => {
        getMaterialByIdInfo();
    };
    const back = () => {
        routeBackTab();
    };
    const getIsNext = () => {
        return new Promise((res, rej) => {
            const lastTable = tableList.value.filter((e, i) => i + 1 === tableList.value.length);
            if (
                lastTable[0]?.isIDisabled &&
                lastTable[0]?.operationCode !== copyLastTable[0].operationCode
            ) {
                message.warning('该已报工的工序不能为最后一道工序！');
                rej(false);
            }
            res(true);
        });
    };
    const onSave = async () => {
        try {
            if (!tableList.value.length) {
                message.warning('没有工序数据保存！');
                return;
            }
            await getIsNext();
            loading.value = true;
            const { data } = await jobOrderAPi.updateProcessInfo(unref(getParams));
            if (data.value) {
                message.success('保存成功');
                routeBackTab();
            } else {
                message.warning(data.errorMessage);
            }
        } catch (error) {
            console.log(error);
        } finally {
            loading.value = false;
        }
    };
    // 获取详情数据（编辑、详情）
    const getMaterialByIdInfo = async () => {
        try {
            loading.value = true;
            const { data } = await jobOrderAPi.getProcessEdit(unref(getRouteQuery));
            const { object = {} } = data;
            processInfoData.value = object;
            tableList.value = object.operationInfos || [];
            copyLastTable = tableList.value.filter((e, i) => i + 1 === tableList.value.length);
        } catch (error) {
            console.log('作业工单：编辑' + error);
        } finally {
            loading.value = false;
        }
    };
    const getParams = computed(() => {
        const { workOrderCode, processCode, processVersion } = processInfoData.value as {
            workOrderCode: string;
            processCode: string;
            processVersion: number;
        };
        unref(tableList).forEach((item, index) => (item.rowNum = index + 1));
        return {
            editVos: unref(tableList),
            workOrderCode,
            processCode,
            processVersion
        };
    });
    onMounted(() => {
        init();
    });
</script>

<style scoped lang="less">
    .processEdit {
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
