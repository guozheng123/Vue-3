<template>
    <TpfModal v-model:visible="visible" title="添加物料" height="345px" width="800px">
        <a-form layout="inline" :model="formState" class="tpf-form">
            <a-row style="width: 100%">
                <a-col :span="8">
                    <a-form-item label="BOM层级" name="level">
                        <a-input-number
                            :precision="0"
                            :controls="false"
                            :min="0"
                            v-model:value="formState.level"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="14" />
                <a-col :span="2">
                    <a-button type="primary" @click="getDataList">查询</a-button>
                </a-col>
            </a-row>
        </a-form>
        <TpfTable v-bind="{ ...tableInfo, loading, pagination, columns }" />
        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">取消</a-button>
            <a-button
                class="tpf-button"
                type="primary"
                @click="saveProcess"
                :disabled="isEmpty(selectedRowInfo.selectedRowKeys)"
            >
                保存
            </a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="tsx" name="AddProcessFromBomModal">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useAntdTable, useRef } from '@/hooks';
    import TpfTable from '@/components/TpfTable/index.vue';
    import { ref, computed, unref } from 'vue';
    import { useMaterialApi } from '@/api';
    import { TpfColumnType } from '@/types';
    import { isEmpty } from 'lodash-es';

    const props = defineProps<{
        bomAccId?: string;
    }>();

    const emit = defineEmits<{
        (e: 'getMaterialCode', val: any): void;
    }>();

    const currentMaterialList = ref<any[]>([]);

    const materialApi = useMaterialApi();

    const [visible, setVisible] = useRef(false);

    const formState = ref<{ level: number }>({
        level: 0
    });

    const columns = computed(() => {
        return [
            { title: '物料编号', dataIndex: 'materialCode' },
            { title: '物料名称', dataIndex: 'materialName' },
            { title: '基本单位', dataIndex: 'materialUnitName' },
            { title: '单套比', dataIndex: 'bomRatio' },
            { title: '批号', dataIndex: 'batchNumber' },
            { title: '生产管理方式', dataIndex: 'supervisorModeName' }
        ] as TpfColumnType[];
    });

    const { tableInfo, pagination, loading, getDataList, selectedRowInfo } = useAntdTable({
        api: async () => {
            const { level } = unref(formState);
            const res = await materialApi.getAccBomInfoList({
                level: Number(level),
                bomAccId: props.bomAccId,
                filterIds: unref(currentMaterialList).map(item => item.id)
            });
            return res.data.object;
        },
        rowKey: 'id',
        hasRowSelection: true
    });

    const saveProcess = () => {
        if (unref(selectedRowInfo).selectedRows.length) {
            emit('getMaterialCode', unref(selectedRowInfo).selectedRows);
        }
        setVisible(false);
    };

    const open = (list: any[]) => {
        setVisible(true);
        currentMaterialList.value = list;

        getDataList();
    };

    defineExpose({ open });
</script>
