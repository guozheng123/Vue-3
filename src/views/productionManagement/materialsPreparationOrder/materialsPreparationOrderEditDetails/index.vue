<template>
    <TpfAddInfoLayout :title="getTitle" class="materialsPreparationOrderEdit">
        <!-- 基本信息 -->
        <LoadingSkeleton>
            <MaterialsSearchInfo ref="materialsSearchInfoRef" @onSearch="onSearch" />
        </LoadingSkeleton>

        <!-- 出库明细 -->
        <LoadingSkeleton>
            <MaterialsTableDetail
                ref="MaterialsTableDetailRef"
                :isEdit="unref(getPageType)"
                :originalInfo="dataSource"
            />
        </LoadingSkeleton>

        <template #footerRight>
            <a-button class="tpf-button" @click="back"> 关闭 </a-button>
            <a-button
                v-if="unref(getPageType)"
                type="primary"
                class="tpf-button"
                :disabled="loading"
                @click="onSave('create')"
            >
                生成领料单
            </a-button>
            <a-button
                v-if="unref(getPageType)"
                type="primary"
                class="tpf-button"
                :disabled="loading"
                @click="onSave('save')"
            >
                保存
            </a-button>
        </template>
    </TpfAddInfoLayout>
</template>

<script setup lang="tsx" name="inStoreOrderOrderEditDetail">
    import { useMaterialPreparationApi } from '@/api';
    import type { MaterialPreparationDetailsList } from '@/api';
    import { useRouteBackTab, useRouteQuery } from '@/hooks';
    import { message } from 'ant-design-vue';
    import TpfAddInfoLayout from '@/components/TpfAddInfoLayout/index.vue';
    import { ref, computed, unref, defineAsyncComponent, onMounted } from 'vue';
    import { cloneDeep } from 'lodash-es';
    import { useRouter } from 'vue-router';

    const MaterialsTableDetail = defineAsyncComponent(
        () => import('./components/MaterialsTableDetail.vue')
    );
    const MaterialsSearchInfo = defineAsyncComponent(
        () => import('./components/MaterialsSearchInfo.vue')
    );
    const router = useRouter();
    const detailsData = ref<{ [key: string]: any }>({});
    const dataSource = ref<MaterialPreparationDetailsList[]>([]);
    const { id, isEdit } = useRouteQuery<{ id: string; isEdit: string }>();
    const materialPreparationApi = useMaterialPreparationApi();
    const { routeBackTab } = useRouteBackTab();
    const loading = ref(false);
    const onSearch = (val: Record<string, any>) => {
        dataSource.value = detailsData.value?.materialPreparationDetails?.filter((item: any) => {
            if (
                item.materialCode?.includes(val.materialCode || '') &&
                item.materialName?.includes(val.materialName || '')
            ) {
                return item;
            }
        });
    };
    const onGetInfoDetailApi = async () => {
        try {
            if (!id) return;
            const res = await materialPreparationApi.getMaterialPreparationById({
                materialPreparationId: id
            });
            detailsData.value = cloneDeep(res.data?.object);
            dataSource.value = detailsData.value.materialPreparationDetails || [];
        } catch (error) {
            console.log(error);
        }
    };
    const onSave = async (type: string) => {
        try {
            loading.value = true;
            const { data } = await materialPreparationApi[
                type === 'create'
                    ? 'createMaterialRequisitionByMaterialPre'
                    : 'editMaterialPreparation'
            ]({
                ...unref(detailsData)
            });
            if (data.value) {
                message.success('操作成功！');
                back();
            }
        } catch (error) {
            console.log(error);
        } finally {
            loading.value = false;
        }
    };
    const back = () => {
        routeBackTab();
    };
    const getPageType = computed(() => (isEdit ? true : false));
    const getTitle = computed(() => (unref(getPageType) ? '编辑' : '详情'));

    onMounted(() => {
        onGetInfoDetailApi();
    });
</script>
