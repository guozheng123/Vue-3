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
                <LoadingSkeleton>
                    <BomProtectTable
                        rowKey="materialCode"
                        :bomAccId="bomAccId"
                        :currentSelect="currentSelect"
                        ref="BomProtectTableDom"
                        :getMaterialList="jobOrderAPi.getMaterialList"
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

<script setup lang="tsx">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { defineAsyncComponent, unref, ref } from 'vue';
    import { useRef } from '@/hooks';
    import { useJobOrderAPi } from '@/api';
    import { isEmpty } from 'lodash-es';
    import { useBomTree, useBomProtectTable } from '@/components';

    const { BomTree } = useBomTree();

    const { BomProtectTable } = useBomProtectTable();

    const jobOrderAPi = useJobOrderAPi();

    const TpfIndentation = defineAsyncComponent(
        () => import('@/components/TpfIndentation/index.vue')
    );

    const emit = defineEmits<{
        (e: 'updateTable'): void;
    }>();

    const BomProtectTableDom = ref<InstanceType<typeof BomProtectTable> | null>(null);

    const loading = ref(false);

    const treeData = ref<any[]>([]);

    const bomAccId = ref('');

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

        const list = await getDataSource().then(res =>
            res.map((item: any) => ({
                materialCode: item.materialCode,
                num: item.num
            }))
        );
        const params = {
            workOrderCode: unref(currentRow).workOrderCode,
            bomId,
            operationId,
            operationCode,
            bomVersion,
            list
        };
        try {
            loading.value = true;
            await jobOrderAPi.saveWorkOrderOperationBomInfo(params);
            const { message } = await import('ant-design-vue');
            message.success('保存成功');
            await getBomTree();
        } catch (error) {
            console.log('error: ', error);
        } finally {
            loading.value = false;
        }
    };

    const currentRow = ref<any>({});

    const open = (row: any) => {
        currentRow.value = row;
        treeData.value = [];
        currentSelect.value = {} as CurrentSelect;
        setVisible(true);
        getBomTree();
    };

    const getBomTree = async () => {
        const { processVersion, workOrderCode: businessCode, processCode } = unref(currentRow);
        const res = await jobOrderAPi.getOperationBomTree({
            processVersion,
            businessCode,
            processCode
        });

        const { processName, items = [] } = res.data.object;

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
        const { workOrderCode = '' } = unref(currentRow);
        if (val.operationId === 0) {
            currentSelect.value = {} as CurrentSelect;
            return;
        }
        val.workOrderCode = workOrderCode;
        currentSelect.value = val;
    };

    defineExpose({ open });
</script>
