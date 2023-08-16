<template>
    <TpfCollapse :title="`${index}-折叠面板 - TpfCollapse`" isHidden>
        <pre>{{ html }}</pre>
        <template #right> <a-button type="link">这里是右插槽</a-button> </template>

        <a-table :data-source="dataSource" :columns="getColumns()" :pagination="false" />
    </TpfCollapse>
</template>

<script setup lang="tsx" name="TestTpfCollapse">
    import { defineAsyncComponent, ref } from 'vue';
    import { getColumns } from '@/components/config';

    const TpfCollapse = defineAsyncComponent(() => import('@/components/TpfCollapse/index.vue'));
    defineProps<{ index?: number }>();

    const dataSource = ref([
        { params: 'title', introduce: '标题', type: 'string', defaultValue: '这里是标题' },
        {
            params: 'collapseIcon',
            introduce: '折叠状态的icon',
            type: 'string',
            defaultValue: 'icon-xiangshang'
        },
        {
            params: 'unCollapseIcon',
            introduce: '展开状态的icon',
            type: 'string',
            defaultValue: 'icon-xiangxia'
        },
        {
            params: 'gap',
            introduce: '折叠面板底部的margin',
            type: 'string',
            defaultValue: '0px'
        },
        {
            params: 'right',
            introduce: '标题栏右边插槽',
            type: 'slot',
            defaultValue: ''
        }
    ]);

    const html = `
        <TpfCollapse title="1-折叠面板 - TpfCollapse">
            这里是内容
            <template #right> 这里是右插槽 </template>
        </TpfCollapse>

        const TpfCollapse = defineAsyncComponent(() => import('@/components/TpfCollapse/index.vue'))
        `;
</script>

<style lang="less" scoped></style>
