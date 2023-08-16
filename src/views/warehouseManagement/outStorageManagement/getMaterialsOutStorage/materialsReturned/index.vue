<template>
    <TpfAddInfoLayout title="生成退料单" class="materialsReturned">
        <!-- 基本信息 -->
        <LoadingSkeleton>
            <MaterialsReturnedInfo :originalInfo="originData" />
        </LoadingSkeleton>

        <!-- 退料单明细 -->
        <LoadingSkeleton>
            <MaterialsReturnedDetail
                ref="MaterialsReturnedDetailRef"
                :originalInfo="originDataTable"
            />
        </LoadingSkeleton>

        <template #footerRight>
            <a-button class="tpf-button" @click="back"> 取消 </a-button>
            <a-button type="primary" class="tpf-button" :disabled="loading" @click="onSave">
                确认
            </a-button>
        </template>
    </TpfAddInfoLayout>
</template>

<script setup lang="tsx" name="materialsReturned">
    import { useOutStorageApi } from '@/api';
    import type { ResGetMaterialOutStorageByIdList } from '@/api';
    import { useRouteBackTab, useRouteQuery } from '@/hooks';
    import { message } from 'ant-design-vue';
    import TpfAddInfoLayout from '@/components/TpfAddInfoLayout/index.vue';
    import { ref, computed, unref, defineAsyncComponent, onMounted } from 'vue';
    const MaterialsReturnedDetail = defineAsyncComponent(
        () => import('./components/MaterialsReturnedDetail.vue')
    );
    const MaterialsReturnedInfo = defineAsyncComponent(
        () => import('./components/MaterialsReturnedInfo.vue')
    );
    const originData = ref<Record<string, any>>({});
    const originDataTable = ref<ResGetMaterialOutStorageByIdList[]>([]);
    const { id } = useRouteQuery<{ id: string; type: string }>();
    const outStorageApi = useOutStorageApi();
    const { routeBackTab } = useRouteBackTab();
    const MaterialsReturnedDetailRef = ref<InstanceType<typeof MaterialsReturnedDetail> | null>(
        null
    );
    const loading = ref(false);
    const onSave = async () => {
        try {
            const detailsData = await MaterialsReturnedDetailRef.value?.submit();
            loading.value = true;
            const { data } = await outStorageApi.createReturnMaterial({
                list:
                    detailsData?.map(item => {
                        return {
                            ...item,
                            ...unref(originData),
                            list: undefined,
                            outStorageOrderId: +id
                        };
                    }) || []
            });
            if (data.value) {
                message.success('退料操作成功！');
                back();
            }
        } catch (error) {
            console.log(error);
        } finally {
            loading.value = false;
        }
    };

    const onGetInfoDetailApi = async () => {
        try {
            if (!id) return;
            const { data } = await outStorageApi.getMaterialOutStorageById({
                outStorageOrderId: +id
            });
            originData.value = data.object;
            originDataTable.value = data.object.list || [];
        } catch (error) {
            console.log(error);
        }
    };

    const back = () => {
        routeBackTab();
    };

    onMounted(() => {
        onGetInfoDetailApi();
    });
</script>
