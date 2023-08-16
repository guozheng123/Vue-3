<template>
    <TpfCollapse title="图纸">
        <TpfTable
            class="t-p-[10px] t-box-border t-h-[300px]"
            :columns="columns"
            :data-source="data"
            :pagination="false"
            v-bind="{ seq: true }"
            rowKey="drawingNumber"
        />
    </TpfCollapse>
</template>

<script setup lang="tsx">
    import { ref } from 'vue';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import { TpfColumnType } from '@/types';
    import TpfTable from '@/components/TpfTable/index.vue';
    const columns = [
        {
            title: '图号',
            dataIndex: 'drawingNumber',
            customRender: ({ text, record }) => (
                <span class="tpf-link" onClick={() => getDrawingDetails(record)}>
                    {text}
                </span>
            )
        },
        { title: '版本', dataIndex: 'drawingVersions' }
    ] as TpfColumnType[];

    const data = ref([
        { drawingNumber: '这是死数据', drawingVersions: '1' },
        { drawingNumber: '这是死数据', drawingVersions: '2' }
    ]);
    const getDrawingDetails = (v: any) => {};

    defineExpose({ data });
</script>
