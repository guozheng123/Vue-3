<template>
    <TpfModal
        v-model:visible="visible"
        title="工序BOM维护"
        height="500px"
        width="1000px"
        :body-style="{ padding: 0 }"
    >
        <TpfIndentation hiddenMove width="220px" v-loading="loading">
            <template #left>
                <LoadingSkeleton>
                    <BomTree
                        bomType="1"
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
                <LoadingSkeleton>
                    <BomProtectTable
                        :bomAccId="bomAccId"
                        :currentSelect="currentSelect"
                        ref="BomProtectTableDom"
                        :getMaterialList="productionOrderApi.getProductionOrderOperationBomDetail"
                    />
                </LoadingSkeleton>
            </template>
        </TpfIndentation>
        <template #footerRight>
            <a-button class="tpf-button" @click="close">取消</a-button>
            <a-button
                class="tpf-button"
                type="primary"
                @click="saveProcess"
                :loading="loading"
                :disabled="isEmpty(currentSelect)"
            >
                保存
            </a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="tsx" name="ProcessBomProtectModal">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { defineAsyncComponent, unref, ref } from 'vue';
    import { useRef } from '@/hooks';
    import { useProductionOrderApi } from '@/api';

    import { isEmpty } from 'lodash-es';
    import { useBomTree, useBomProtectTable } from '@/components';

    const { BomTree } = useBomTree();

    const { BomProtectTable } = useBomProtectTable();

    const productionOrderApi = useProductionOrderApi();

    const TpfIndentation = defineAsyncComponent(
        () => import('@/components/TpfIndentation/index.vue')
    );

    // const BomTree = defineAsyncComponent(() => import('./BomTree.vue'));

    // const BomProtectTable = defineAsyncComponent(() => import('./BomProtectTable.vue'));

    const emit = defineEmits<{
        (e: 'updateTable'): void;
    }>();

    const BomProtectTableDom = ref<InstanceType<typeof BomProtectTable> | null>(null);

    const loading = ref(false);

    const productionOrderId = ref(0);

    type CurrentSelect = {
        bomId: number;
        operationId: number;
        operationCode: string;
        bomVersion: string;
    };

    const currentSelect = ref<CurrentSelect>({} as CurrentSelect);

    const [visible, setVisible] = useRef(false);

    const close = () => {
        emit('updateTable');
        setVisible(false);
    };

    const saveProcess = async () => {
        const { bomId, operationId, operationCode, bomVersion } = unref(currentSelect);

        const { getDataSource } = unref(BomProtectTableDom)!;

        const bomDetailEditVoList = await getDataSource().then(res =>
            res.map((item: any) => ({
                materialCode: item.materialCode,
                num: item.num
            }))
        );
        const params = {
            productionOrderId: unref(productionOrderId),
            bomId,
            operationId,
            operationCode,
            bomVersion,
            bomDetailEditVoList
        };
        try {
            loading.value = true;
            await productionOrderApi.saveProductionOrderOperationBomDetail(params);
            const { message } = await import('ant-design-vue');
            message.success('保存成功');
            await getBomTree();
        } catch (error) {
            console.log('error: ', error);
        } finally {
            loading.value = false;
        }
    };

    const open = (orderId: number) => {
        treeData.value = [];
        productionOrderId.value = orderId;
        currentSelect.value = {} as CurrentSelect;
        setVisible(true);
        getBomTree();
    };

    const treeData = ref<any[]>([]);

    const bomAccId = ref('');

    const getBomTree = async () => {
        const res = await productionOrderApi.getProductionOrderOperationBomList({
            productionOrderId: unref(productionOrderId)
        });

        const { processName, items = [], processVersion } = res.data.object;

        bomAccId.value = res.data.object.bomAccId;

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
            currentSelect.value = {} as CurrentSelect;
            return;
        }
        currentSelect.value = val;
    };

    defineExpose({ open });
</script>
