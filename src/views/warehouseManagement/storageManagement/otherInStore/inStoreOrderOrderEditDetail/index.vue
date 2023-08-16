<template>
    <TpfAddInfoLayout :title="getTitle" class="inStoreOrderOrderEditDetail">
        <!-- 基本信息 -->
        <LoadingSkeleton>
            <OtherInStoreInfo
                ref="otherInStoreInfoRef"
                :isEdit="unref(getPageType)"
                :originalInfo="originData"
            />
        </LoadingSkeleton>

        <!-- 入库明细 -->
        <LoadingSkeleton>
            <OtherInStoreDetail
                ref="otherInStoreDetailRef"
                :isEdit="unref(getPageType)"
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
    import { ref, computed, unref, defineAsyncComponent } from 'vue';
    import { onMounted } from 'vue';
    import { cloneDeep } from 'lodash-es';

    const OtherInStoreDetail = defineAsyncComponent(
        () => import('./components/OtherInStoreDetail.vue')
    );
    const OtherInStoreInfo = defineAsyncComponent(
        () => import('./components/OtherInStoreInfo.vue')
    );

    const originData = ref<Record<string, any>>({});
    const originDataTable = ref<any[]>([]);

    const { id } = useRouteQuery<{ id: string; type: string }>();
    const useOtherInStore = useOtherInStoreApi();
    const { routeBackTab } = useRouteBackTab();
    const otherInStoreInfoRef = ref<InstanceType<typeof OtherInStoreInfo> | null>(null);
    const otherInStoreDetailRef = ref<InstanceType<typeof OtherInStoreDetail> | null>(null);
    const loading = ref(false);
    const onSave = async () => {
        const params = {
            ...(await otherInStoreInfoRef.value?.submit()),
            otherInStoreDetailList: await otherInStoreDetailRef.value?.submit()
        };
        const res = await useOtherInStore.addOtherInStore(params);
        if (res.data.value) {
            message.success('保存成功');
            back();
        }
    };

    const onGetInStoreDetailApi = async () => {
        try {
            if (id) {
                const res = await useOtherInStore.queryOtherDetailData({ id: id });
                originData.value = cloneDeep(res.data.object);
                originDataTable.value = cloneDeep(res.data.object.otherInStoreDetailList);
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
