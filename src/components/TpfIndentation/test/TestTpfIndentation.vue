<template>
    <TpfCollapse :title="`${index}-左右分栏 - TpfIndentation`" isHidden>
        <TpfIndentation style="height: 300px">
            <template #left>
                <div>左边的插槽</div>
            </template>
            <template #right>
                <div>右边的插槽</div>
            </template>
        </TpfIndentation>
        <pre>{{ html }}</pre>

        <a-table :data-source="dataSource" :columns="getColumns()" :pagination="false" />
    </TpfCollapse>
</template>

<script setup lang="tsx" name="TestTpfIndentation">
    import { defineAsyncComponent, ref } from 'vue';
    import { getColumns } from '@/components/config';
    const TpfCollapse = defineAsyncComponent(() => import('@/components/TpfCollapse/index.vue'));
    const TpfIndentation = defineAsyncComponent(
        () => import('@/components/TpfIndentation/index.vue')
    );
    defineProps<{ index?: number }>();

    const dataSource = ref([
        {
            params: 'hiddenMove',
            introduce: '隐藏拖拽icon',
            type: 'boolean',
            defaultValue: ''
        },
        {
            params: 'width',
            introduce: '中间拖拽栏的宽度',
            type: 'string',
            defaultValue: '240px'
        },
        {
            params: 'minWidth',
            introduce: '左侧最小宽度',
            type: 'string',
            defaultValue: '240px'
        },
        {
            params: 'maxWidth',
            introduce: '左侧最大宽度',
            type: 'string',
            defaultValue: '520px'
        },
        {
            params: 'left',
            introduce: '左边插槽',
            type: 'slot',
            defaultValue: ''
        },
        {
            params: 'right',
            introduce: '右边插槽',
            type: 'slot',
            defaultValue: ''
        }
    ]);

    const html = `
            <TpfIndentation style="height: 300px">
                <template #left>
                    <div>左边的插槽</div>
                </template>
                <template #right>
                    <div>右边的插槽</div>
                </template>
            </TpfIndentation>

            const TpfIndentation = defineAsyncComponent(
                () => import('@/components/TpfIndentation/index.vue')
            );
        `;
</script>
