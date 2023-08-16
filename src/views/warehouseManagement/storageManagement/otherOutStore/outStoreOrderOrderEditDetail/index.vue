<template>
    <TpfAddInfoLayout :title="getTitle" class="inStoreOrderOrderEditDetail">
        <!-- 基本信息 -->
        <LoadingSkeleton>
            <OtherOutStoreInfo
                ref="OtherOutStoreInfoRef"
                :isAdd="unref(getPageType)"
                :originalInfo="originData"
            />
        </LoadingSkeleton>

        <!-- 出库明细 -->
        <LoadingSkeleton>
            <OtherOutStoreDetail
                ref="OtherOutStoreDetailRef"
                :isAdd="unref(getPageType)"
                :originalInfo="originDataTable"
            />
        </LoadingSkeleton>

        <template #footerRight>
            <a-button class="tpf-button" @click="back"> 关闭 </a-button>
            <a-button
                v-if="!unref(getPageType)"
                type="primary"
                class="tpf-button"
                :disabled="loading"
                @click="onSave"
            >
                保存
            </a-button>
        </template>
    </TpfAddInfoLayout>
</template>

<script setup lang="tsx" name="inStoreOrderOrderEditDetail">
    import { useOtherInStoreApi } from '@/api';
    import { useRouteBackTab, useRouteQuery } from '@/hooks';
    import { message } from 'ant-design-vue';
    import TpfAddInfoLayout from '@/components/TpfAddInfoLayout/index.vue';
    import { ref, computed, unref, defineAsyncComponent, onMounted } from 'vue';
    const OtherOutStoreDetail = defineAsyncComponent(
        () => import('./components/OtherOutStoreDetail.vue')
    );
    const OtherOutStoreInfo = defineAsyncComponent(
        () => import('./components/OtherOutStoreInfo.vue')
    );
    const originData = ref<Record<string, any>>({});
    const originDataTable = ref<any[]>([]);
    const { id } = useRouteQuery<{ id: string; type: string }>();
    const otherInStoreApi = useOtherInStoreApi();
    const { routeBackTab } = useRouteBackTab();
    const OtherOutStoreInfoRef = ref<InstanceType<typeof OtherOutStoreInfo> | null>(null);
    const OtherOutStoreDetailRef = ref<InstanceType<typeof OtherOutStoreDetail> | null>(null);
    const loading = ref(false);
    const refList = computed(() => [OtherOutStoreInfoRef, OtherOutStoreDetailRef]);
    const onSave = async () => {
        const allData = await Promise.all(unref(refList).map(item => item.value?.submit()));
        onSetOutStorageApi(allData);
    };
    const onSetOutStorageApi = async (allData: any[]) => {
        try {
            loading.value = true;
            const { data } = await otherInStoreApi.addOtherOutInStore({
                ...allData[0]?.formData,
                otherOutInStoreDetailList: allData[1]?.tableList.map(
                    (item: { [key: string]: any }) => ({
                        projectCode: item.projectCode,
                        batchNo: item.batchNo,
                        materialCode: item.materialCode,
                        materialName: item.materialName,
                        outNum: item.outNum,
                        basicUnit: item.basicUnit,
                        positionCode: item.positionCode,
                        storeLocationCode: item.storeLocationCode,
                        remarks: item.remarks
                    })
                )
            });
            message.success('新增成功！');
            back();
        } catch (error) {
            console.log(error);
        } finally {
            loading.value = false;
        }
    };
    const onGetInStoreDetailApi = async () => {
        try {
            if (id) {
                const res = await otherInStoreApi.queryOtherOutInDetailData({ id: id });
                originData.value = res.data.object;
                originDataTable.value = res.data.object.otherOutInStoreDetailList;
            }
        } catch (error) {
            console.log(error);
        }
    };
    const back = () => {
        routeBackTab();
    };
    const getPageType = computed(() => (id ? true : false));
    const getTitle = computed(() => (unref(getPageType) ? '详情' : '新增'));

    onMounted(() => {
        onGetInStoreDetailApi();
    });
</script>
