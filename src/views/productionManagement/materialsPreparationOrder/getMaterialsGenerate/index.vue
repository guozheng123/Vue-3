<template>
    <TpfAddInfoLayout title="生成领料单" class="getMaterialsGenerate">
        <!-- 生成领料单明细 -->
        <LoadingSkeleton>
            <TpfCollapse title="生成领料单明细">
                <TpfTable
                    class="tpf-table-form"
                    v-bind="{
                        ...tableInfo,
                        columns,
                        seq: true,
                        dataSource
                    }"
                />
            </TpfCollapse>
        </LoadingSkeleton>

        <template #footerRight>
            <a-button class="tpf-button" @click="back"> 取消 </a-button>
            <a-button type="primary" class="tpf-button" :disabled="loading" @click="onSave">
                确定
            </a-button>
        </template>
    </TpfAddInfoLayout>
</template>

<script setup lang="tsx" name="inStoreOrderOrderEditDetail">
    import { useMaterialPreparationApi } from '@/api';
    import type { MaterialPreparationDetailsList, ResGetMaterialPreparationById } from '@/api';
    import { getTpfOptionEnum } from '@/config';
    import { useRouteBackTab, useRouteQuery, useAntdTable } from '@/hooks';
    import { message } from 'ant-design-vue';
    import TpfAddInfoLayout from '@/components/TpfAddInfoLayout/index.vue';
    import { ref, computed, onMounted } from 'vue';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import TpfTable from '@/components/TpfTable/index.vue';
    import { TpfColumnType } from '@/types';
    import { useRouter } from 'vue-router';
    import { unref } from 'vue';
    const { getLabel, overProductionEnum } = getTpfOptionEnum();
    const detailsData = ref<ResGetMaterialPreparationById>();
    const dataSource = ref<MaterialPreparationDetailsList[]>([]);
    const { id } = useRouteQuery<{ id: string }>();
    const materialPreparationApi = useMaterialPreparationApi();
    const { routeBackTab } = useRouteBackTab();
    const loading = ref(false);
    const router = useRouter();
    const columns = computed(() => {
        return [
            {
                title: '生产订单编号',
                dataIndex: 'businessCode'
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
                title: '物料编号',
                dataIndex: 'materialCode'
            },
            {
                title: '物料名称',
                dataIndex: 'materialName'
            },
            {
                title: '计划数量',
                dataIndex: 'planNum'
            },
            {
                title: '单位',
                dataIndex: 'materialUnitName'
            },
            {
                title: '工序编号',
                dataIndex: 'techCode'
            },
            {
                title: '是否保税',
                dataIndex: 'isBonded',
                customRender: ({ text }) => getLabel(text, overProductionEnum)
            },
            {
                title: '是否客供料',
                dataIndex: 'purchaserSupplyFlag',
                customRender: ({ text }) => getLabel(text, overProductionEnum)
            }
        ] as TpfColumnType[];
    });
    const { tableInfo } = useAntdTable({
        api: async () => {
            return { list: [] };
        },
        rowKey: 'id',
        isPageAble: false
    });
    const onSave = async () => {
        try {
            loading.value = true;
            const { data } = await materialPreparationApi.createMaterialRequisitionByMaterialPre({
                // ...unref(detailsData),
                materialPreparationId: unref(detailsData)?.materialPreparationId,
                materialPreparationCode: unref(detailsData)?.materialPreparationCode,
                materialPreparationDetails: unref(detailsData)?.materialPreparationDetails
            });
            if (data.value) {
                message.success('生成领料单确定操作成功！');
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
            const res = await materialPreparationApi.getMaterialPreparationById({
                materialPreparationId: id
            });
            dataSource.value = res.data?.object.materialPreparationDetails || [];
            detailsData.value = res.data?.object;
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
    .getMaterialsGenerate {
        .tpf-table-form {
            height: 400px;
        }
    }
</style>
