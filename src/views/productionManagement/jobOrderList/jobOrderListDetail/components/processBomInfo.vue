<template>
    <div class="processBomInfo">
        <TpfIndentation hiddenMove width="220px">
            <template #left>
                <LoadingSkeleton>
                    <BomTree
                        bomType="2"
                        @selectBom="selectBom"
                        :treeData="treeData"
                        :fieldNames="{
                            children: 'children',
                            title: 'operationName',
                            key: 'operationId',
                            rootCode: 'operationId'
                        }"
                    />
                </LoadingSkeleton>
            </template>
            <template #right>
                <TpfTable
                    v-if="!isEmpty(currentSelect)"
                    v-bind="{
                        ...tableInfo,
                        loading,
                        pagination,
                        columns
                    }"
                />
                <a-empty v-else>
                    <template #description> 请点击左侧树形菜单进行相关操作 </template>
                </a-empty>
            </template>
        </TpfIndentation>
    </div>
</template>

<script setup lang="tsx" name="processBomInfo">
    import TpfTable from '@/components/TpfTable/index.vue';
    import { computed, ref, defineAsyncComponent, unref, onMounted } from 'vue';
    import type { TpfColumnType } from '@/types';
    import { useJobOrderAPi } from '@/api';
    import { tableResizable } from '@/config';
    import { useAntdTable } from '@/hooks';
    import { isEmpty } from 'lodash-es';
    import { useStore } from '@/store';
    import { useBomTree } from '@/components';

    const { BomTree } = useBomTree();
    type Props = {
        detailData: any;
    };
    const props = defineProps<Props>();

    const { userStore } = useStore();

    const TpfIndentation = defineAsyncComponent(
        () => import('@/components/TpfIndentation/index.vue')
    );

    const jobOrderAPi = useJobOrderAPi();

    const currentSelect = ref<any>({});
    const columns = computed<TpfColumnType[]>(() => [
        { title: '物料编码', dataIndex: 'materialCode', ...tableResizable() },
        { title: '物料名称', dataIndex: 'materialName', ...tableResizable() },
        { title: '生产数量', dataIndex: 'num', ...tableResizable() },
        { title: '生产单位', dataIndex: 'productUnitCodeName', ...tableResizable() },
        {
            title: '基本数量',
            dataIndex: 'bomRatio',
            ...tableResizable(),
            customRender: ({ record }) => {
                let rate = 0;
                const { productUnitUsage, materialUnitUsage } = record;
                if (productUnitUsage && materialUnitUsage) {
                    rate = materialUnitUsage / productUnitUsage;
                }
                const res = +(Number(record.num || 0) * rate).toFixed(userStore.decimalPlaces);

                return res;
            }
        },
        { title: '基本单位', dataIndex: 'materialUnitName', ...tableResizable() },
        { title: '损耗率%', dataIndex: 'wasteRate', ...tableResizable() },
        { title: '生产管理方式', dataIndex: 'supervisorModeCode', ...tableResizable() }
    ]);

    const { tableInfo, pagination, loading, getDataList } = useAntdTable({
        api: async () => {
            const { bomId, bomVersion, operationId } = unref(currentSelect) || {};
            if (!operationId || !bomId) return { list: [] };
            const res = await jobOrderAPi.getMaterialList({
                bomId,
                bomVersion
            });
            return res.data;
        },
        rowKey: 'id',
        isPageAble: false
    });

    const treeData = ref<any[]>([]);

    const getBomTree = async () => {
        const {
            processVersion,
            workOrderCode: businessCode,
            processCode
        } = unref(props.detailData);
        const res = await jobOrderAPi.getOperationBomTree({
            processVersion,
            businessCode,
            processCode
        });

        const { processName, items = [] } = res.data.object;

        if (!isEmpty(unref(currentSelect))) {
            (items || []).forEach(item => {
                if (item.operationId === unref(currentSelect).operationId) {
                    currentSelect.value = { ...item };
                }
            });
        }

        treeData.value = [
            {
                operationName: processName,
                operationId: 0,
                bomVersion: processVersion,
                children: items || []
            }
        ];
    };

    const selectBom = async (val: any) => {
        if (val.operationId === 0) {
            currentSelect.value = {};
            return;
        }
        currentSelect.value = val;
        getDataList();
    };
    onMounted(() => {
        getBomTree();
    });
</script>

<style lang="less" scoped>
    .processBomInfo {
        height: 100%;
        box-sizing: border-box;

        :deep(.indentation-right) {
            padding: 10px !important;
            box-sizing: border-box;
        }

        :deep(.tpf-table) {
            height: 100%;
        }
    }
</style>
