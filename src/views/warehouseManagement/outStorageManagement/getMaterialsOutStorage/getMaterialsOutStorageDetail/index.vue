<template>
    <TpfAddInfoLayout title="详情" class="getMaterialsOutStorageDetail">
        <!-- 基本信息 -->
        <LoadingSkeleton>
            <TpfCollapse title="领料单出库明细">
                <TpfTable
                    class="tpf-table-form"
                    v-bind="{
                        columns,
                        seq: true,
                        dataSource
                    }"
                />
            </TpfCollapse>
        </LoadingSkeleton>

        <template #footerRight>
            <a-button class="tpf-button" @click="back"> 关闭 </a-button>
        </template>
    </TpfAddInfoLayout>
</template>

<script setup lang="tsx" name="getMaterialsOutStorageDetail">
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import TpfTable from '@/components/TpfTable/index.vue';

    import { useOutStorageApi } from '@/api';
    import type { ResGetMaterialOutStorageByIdList } from '@/api';
    import { useRouteBackTab, useRouteQuery, useAntdTable } from '@/hooks';
    import { TpfColumnType } from '@/types';
    import TpfAddInfoLayout from '@/components/TpfAddInfoLayout/index.vue';
    import { ref, computed, unref, defineAsyncComponent, onMounted } from 'vue';
    const { id } = useRouteQuery<{ id: string }>();
    const { routeBackTab } = useRouteBackTab();
    const outStorageApi = useOutStorageApi();
    const dataSource = ref<ResGetMaterialOutStorageByIdList[]>([]);
    const columns = computed(() => {
        return [
            {
                title: '物料编号',
                dataIndex: 'materialCode'
            },
            {
                title: '物料名称',
                dataIndex: 'materialName'
            },
            {
                title: '规格',
                dataIndex: 'materialSpec'
            },
            {
                title: '项目编号',
                dataIndex: 'projectCode'
            },
            {
                title: '项目名称',
                dataIndex: 'projectName'
            },
            {
                title: '作业工单编号',
                dataIndex: 'workOrderCode'
            },
            {
                title: '工序编号',
                dataIndex: 'operationCode'
            },
            {
                title: '工序名称',
                dataIndex: 'operationName'
            },
            {
                title: '单位',
                dataIndex: 'productUnitCode'
            },
            {
                title: '领料数',
                dataIndex: 'requisitionNumber'
            },
            {
                title: '出库数',
                dataIndex: 'outStorageNumber'
            },
            {
                title: '替代料编号',
                dataIndex: 'replaceMaterialCode'
            },
            {
                title: '替代料名称',
                dataIndex: 'replaceMaterialName'
            },
            {
                title: '替代料现存量',
                dataIndex: 'replaceMaterialStorageNumber'
            },
            {
                title: '基本数量',
                dataIndex: ''
            },
            {
                title: '基本单位',
                dataIndex: 'materialUnitName'
            },
            {
                title: '批次',
                dataIndex: 'batchNo'
            },
            {
                title: '现存量',
                dataIndex: 'storageNumber'
            },
            {
                title: '已退料数',
                dataIndex: 'returnFinishNumber'
            },
            {
                title: '收料数',
                dataIndex: 'harvestNumber'
            },
            {
                title: '仓位名称',
                dataIndex: 'positionName'
            },
            {
                title: '库位名称',
                dataIndex: 'storeLocationName'
            },
            {
                title: '备注',
                dataIndex: 'remark'
            }
        ] as TpfColumnType[];
    });
    const onGetInfoDetailApi = async () => {
        try {
            if (!id) return;
            const { data } = await outStorageApi.getMaterialOutStorageById({
                outStorageOrderId: +id
            });
            console.log(data, 998);
            dataSource.value = data.object.list || [];
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

<style lang="less" scoped>
    .getMaterialsOutStorageDetail {
        .tpf-table-form {
            height: 400px;
        }
    }
</style>
