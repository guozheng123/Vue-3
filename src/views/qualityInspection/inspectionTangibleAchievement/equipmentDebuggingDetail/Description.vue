<template>
    <TpfTable
        class="description"
        v-bind="{
            columns: columns,
            pagination: false,
            rowKey: 'id',
            dataSource: props.departmentData
        }"
    />
</template>

<script setup lang="tsx">
    import { defineAsyncComponent } from 'vue';
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    type Props = {
        departmentData: any[];
    };
    const props = withDefaults(defineProps<Props>(), {
        departmentData: () => []
    });
    const columns = [
        { title: '问题描述', dataIndex: 'description' },
        { title: '责任部门', dataIndex: 'departmentName' },
        { title: '责任人', dataIndex: 'userName' }
    ];
</script>

<style lang="less" scoped>
    .description {
        height: 300px;
    }
</style>
