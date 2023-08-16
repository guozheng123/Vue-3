<template>
    <TpfModal
        class="reason"
        v-model:visible="visible"
        title="选择缺陷原因"
        height="400px"
        width="800px"
    >
        <a-form
            :label-col="{ span: 10, offset: 3 }"
            layout="inline"
            :model="formState"
            @finish="handleFinish"
        >
            <a-form-item label="缺陷原因编号">
                <a-input v-model:value="formState.defectCauseCode" />
            </a-form-item>
            <a-form-item label="缺陷原因名称">
                <a-input v-model:value="formState.defectCauseName" />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit"> 查询 </a-button>
            </a-form-item>
        </a-form>
        <TpfLayout style="height: 320px">
            <template #content>
                <TpfTableLayout>
                    <template #default="args">
                        <TpfTable
                            :scroll="{ y: 300, x: 700 }"
                            v-bind="{
                                ...args,
                                ...tableInfo,
                                loading,
                                pagination,
                                columns,
                                seq: true
                            }"
                        />
                    </template>
                </TpfTableLayout>
            </template>
        </TpfLayout>
        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="submitReasonModel">保存</a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="ts" name="ReasonModel">
    import { ref, unref, defineAsyncComponent } from 'vue';
    import type { TpfColumnType } from '@/types';
    import { useAntdTable, useRef } from '@/hooks';
    import { useQualityApi } from '@/api';

    import TpfModal from '@/components/TpfModal/index.vue';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));
    const qualityApi = useQualityApi();

    const emit = defineEmits(['getReason']);
    const [visible, setVisible] = useRef(false);

    const open = (val: any) => {
        unref(pagination).current = 1;

        getDataList();
        if (val) {
            // setSelectedRowKeys(val);
            selectedRowInfo.value.selectedRowKeys = val;
        }
        setVisible(!visible.value);
    };
    const formState = ref({
        defectCauseCode: '',
        defectCauseName: ''
    });

    const columns = ref<TpfColumnType[]>([
        {
            title: '缺陷原因编号',
            dataIndex: 'defectCauseCode',
            key: 'defectCauseCode',
            align: 'center',
            width: 150
        },
        {
            title: '缺陷原因名称',
            dataIndex: 'defectCauseName',
            key: 'defectCauseName',
            align: 'center',
            width: 150
        },
        { title: '创建人', dataIndex: 'createUser', key: 'address', align: 'center', width: 150 },
        {
            title: '创建时间',
            dataIndex: 'createDatetime',
            key: 'createDatetime',
            align: 'center',
            width: 150
        }
    ]);

    const { tableInfo, pagination, loading, getDataList, selectedRowInfo } = useAntdTable({
        api: async pageInfo => {
            const { current, pageSize } = unref(pageInfo);
            const res = await qualityApi.queryDefectCauseListByPage({
                page: current,
                pageSize,
                ...formState.value
            });
            return res.data.object;
        },
        rowKey: 'defectCauseId',
        isPageAble: true,
        hasRowSelection: true,
        preserveSelectedRowKeys: true
    });
    const handleFinish = () => {
        unref(pagination).current = 1;

        getDataList();
    };
    const submitReasonModel = () => {
        emit('getReason', selectedRowInfo.value.selectedRows);
        setVisible(!visible.value);
    };

    defineExpose({ open });
</script>

<style scoped lang="less">
    :deep(.tpf-layout-content) {
        margin-top: 0 !important;

        .operate-line {
            height: 0 !important;
        }
    }
</style>
