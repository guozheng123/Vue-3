<template>
    <TpfAddInfoLayout title="入库" class="materialInStorageOrderEdit">
        <!-- 基本信息 -->
        <LoadingSkeleton> <InStorageInfo :inStorageInfo="getInStorageInfo" /> </LoadingSkeleton>
        <!-- 合格品入库明细 -->
        <LoadingSkeleton>
            <InStorageDetail ref="qualifiedRef" :inStorageList="qualifiedList" type="qualified" />
        </LoadingSkeleton>

        <!-- 不合格品入库明细 -->
        <LoadingSkeleton>
            <InStorageDetail
                ref="notQualifiedRef"
                :inStorageList="notQualifiedList"
                type="notQualified"
            />
        </LoadingSkeleton>
        <TpfAnchor :anchorList="anchorList" />

        <template #footerRight>
            <a-button class="tpf-button" @click="back"> 取消 </a-button>
            <a-button type="primary" class="tpf-button" :disabled="loading" @click="onInStorage">
                入库
            </a-button>
        </template>
    </TpfAddInfoLayout>
</template>

<script setup lang="tsx" name="materialInStorageOrderEdit">
    import { useStore, cacheKeyEnum } from '@/store';
    import TpfAddInfoLayout from '@/components/TpfAddInfoLayout/index.vue';
    import { ref, computed, unref, defineAsyncComponent, onMounted } from 'vue';
    const InStorageDetail = defineAsyncComponent(() => import('./components/InStorageDetail.vue'));
    const InStorageInfo = defineAsyncComponent(() => import('./components/InStorageInfo.vue'));
    const TpfAnchor = defineAsyncComponent(() => import('@/components/TpfAnchor/index.vue'));
    const { saveRowDataStore } = useStore();
    import { useWarehouseApi } from '@/api';
    import { useRouteBackTab } from '@/hooks';
    import { message } from 'ant-design-vue';

    const anchorList = [
        { href: 'InStorageInfo', title: '基本信息', visible: true },
        { href: 'InStorageDetail', title: '合格品入库明细', visible: true },
        { href: 'processInfo', title: '不合格品入库明细', visible: true }
    ];
    const warehouseApi = useWarehouseApi();
    const { routeBackTab } = useRouteBackTab();
    const inStorageList = saveRowDataStore.getRowData(cacheKeyEnum.inStorageList);
    const qualifiedRef = ref<InstanceType<typeof InStorageDetail> | null>(null);
    const notQualifiedRef = ref<InstanceType<typeof InStorageDetail> | null>(null);
    const qualifiedList = ref<any[]>([]);
    const notQualifiedList = ref<any[]>([]);
    const loading = ref(false);
    const refList = computed(() => [qualifiedRef, notQualifiedRef]);
    const onInStorage = async () => {
        const allData = await Promise.all(unref(refList).map(item => item.value?.submit()));
        onSetInStorageApi(allData);
    };
    const onSetInStorageApi = async (allData: any[]) => {
        try {
            loading.value = true;
            console.log(JSON.stringify(onGetInStoreData(allData)));
            const res = await warehouseApi.confirmMaterialInStore({
                ...onGetInStoreData(allData)
            });
            message.success('入库操作成功！');
            back();
        } catch (error) {
            console.log(error);
        } finally {
            loading.value = false;
        }
    };
    const back = () => {
        routeBackTab();
    };
    const onGetInStoreData = (allData: any[]) => {
        const dtoList = allData.reduce((pre, cur) => [...pre, ...(cur.tableList?.list || [])], []);
        return {
            supplierCode: unref(getInStorageInfo).supplier_code,
            moveTypeCode: unref(getInStorageInfo).move_type_code,
            dtoList: dtoList.map((item: any) => ({
                noId: item.id,
                arrivalNo: item.arrival_no,
                projectCode: item.project_code,
                materialCode: item.material_code,
                batchNo: item.batch_no,
                arrivalNum: item.arrival_num,
                arrivalUnit: item.arrival_unit,
                isQualified: item.isQualified,
                positionCode: item.positionCode,
                storeLocationCode: item.storeLocationCode,
                inNum: item.isQualified === 'y' ? item.qualified_num : item.no_qualified_num
            }))
        };
    };
    const onFilterInStorageList = () => {
        if (Array.isArray(inStorageList)) {
            inStorageList.forEach(item => {
                if (item['qualified_num'] > 0) {
                    if (
                        item['material_code-qn_warehouse_code-name'] &&
                        item['material_code-qn_warehouse_code']
                    ) {
                        item.selectPositionList = [
                            {
                                name: item['material_code-qn_warehouse_code-name'],
                                code: item['material_code-qn_warehouse_code']
                            }
                        ];
                        item.positionCode = item['material_code-qn_warehouse_code'];
                    }
                    qualifiedList.value.push({ ...item, isQualified: 'y' });
                }
                if (item['no_qualified_num'] > 0) {
                    if (
                        item['material_code-no_warehouse_code-name'] &&
                        item['material_code-no_warehouse_code']
                    ) {
                        item.selectPositionList = [
                            {
                                name: item['material_code-no_warehouse_code-name'],
                                code: item['material_code-no_warehouse_code']
                            }
                        ];
                        item.positionCode = item['material_code-no_warehouse_code'];
                    }

                    notQualifiedList.value.push({ ...item, isQualified: 'n' });
                }
            });
        }
        console.log(qualifiedList.value, 99);
    };
    const getInStorageInfo = computed(() => {
        if (unref(qualifiedList).length) return unref(qualifiedList)[0];
        if (unref(notQualifiedList).length) return unref(notQualifiedList)[0];
        return {};
    });
    onMounted(() => {
        onFilterInStorageList();
    });
</script>
