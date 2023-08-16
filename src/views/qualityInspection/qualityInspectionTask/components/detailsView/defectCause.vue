<template>
    <TpfTable
        class="defect-cause-table"
        v-bind="{
            columns,
            dataSource: props.tableData,
            pagination: false,
            seq: true
        }"
    />
</template>

<script setup lang="tsx" name="processInfo">
    import TpfTable from '@/components/TpfTable/index.vue';

    import { ref, computed } from 'vue';
    type Props = {
        columns: any[];
        tableData: any[];
    };

    const props = withDefaults(defineProps<Props>(), {
        columns: () => [],
        tableData: () => []
    });
    const columns = computed(() => {
        return props.columns;
    });
</script>

<style lang="less" scoped>
    .defect-cause-table {
        height: 300px;
    }
</style>
