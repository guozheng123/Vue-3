<template>
    <TpfAddInfoLayout :title="'编辑盘点单'">
        <!-- 基本信息 -->
        <LoadingSkeleton>
            <TakeStockBaseInfo
                fieldName="storeCheckDto"
                :info="inventorySheet.storeCheckDto"
                ref="StoreCheckDtoDom"
                :id="id"
            />
        </LoadingSkeleton>

        <!-- 物料明细 -->
        <LoadingSkeleton>
            <MaterialDetailList
                fieldName="detailDtoList"
                :list="inventorySheet.detailDtoList"
                :info="inventorySheet.storeCheckDto"
                ref="MaterialDetailListDom"
            />
        </LoadingSkeleton>
        <!-- 底部按钮区域 -->
        <template #footerRight>
            <a-button class="tpf-button" @click="cancelEdit"> 取消 </a-button>
            <a-button type="primary" class="tpf-button" @click="withdrawReleaseOrder">
                保存并执行
            </a-button>
            <a-button type="primary" class="tpf-button" @click="saveInfo"> 保存 </a-button>
        </template>
    </TpfAddInfoLayout>
</template>

<script setup lang="tsx">
    import TpfAddInfoLayout from '@/components/TpfAddInfoLayout/index.vue';
    import { ref, computed, unref, defineAsyncComponent, onMounted } from 'vue';
    import { useWarehouseApi } from '@/api';
    import { useRouteQuery, useRouteBackTab } from '@/hooks';

    const warehouseApi = useWarehouseApi();
    const StoreCheckDtoDom = ref<InstanceType<typeof TakeStockBaseInfo> | null>(null);
    const MaterialDetailListDom = ref<InstanceType<typeof MaterialDetailList> | null>(null);

    const comList = computed(() => [StoreCheckDtoDom, MaterialDetailListDom]);

    // 基本信息
    const TakeStockBaseInfo = defineAsyncComponent(
        () => import('./components/TakeStockBaseInfo.vue')
    );
    // 物料明细
    const MaterialDetailList = defineAsyncComponent(
        () => import('./components/MaterialDetailList.vue')
    );

    const { routeBackTab } = useRouteBackTab();

    const { id } = useRouteQuery<{ id: any }>();

    const inventorySheet = ref<any>({});
    const getGuidebookInfo = async () => {
        try {
            const res = await warehouseApi.queryStoreCheckById({
                id
            });
            inventorySheet.value = res.data.object;
        } finally {
            // loading.value = false;
        }
    };

    const cancelEdit = () => {
        routeBackTab();
    };
    const acquiesce = 0;
    // 保存按钮
    const saveInfo = async () => {
        await saveParams(acquiesce);
        const { message } = await import('ant-design-vue');
        message.success('保存成功');
        cancelEdit();
    };
    // 保存并执行
    const withdrawReleaseOrder = async () => {
        await saveParams();
        const { message } = await import('ant-design-vue');
        message.success('保存并执行成功');
        cancelEdit();
    };
    const saveParams = async (acquiesce?: number) => {
        const allRes = await Promise.all(unref(comList).map(item => item.value?.submit()));
        console.log('allRes: ', allRes);
        const params = allRes.reduce((t, v) => ({ ...t, ...v }), {} as any);
        console.log('收集到的参数', params);
        if (acquiesce === 0) {
            await warehouseApi.saveStoreCheck(params);
        } else {
            await warehouseApi.saveExecuteStoreCheck(params);
        }
    };
    onMounted(() => {
        getGuidebookInfo();
    });
</script>
