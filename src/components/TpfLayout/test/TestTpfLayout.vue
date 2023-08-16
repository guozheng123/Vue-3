<template>
    <TpfCollapse :title="`${index}-上下布局 - TpfLayout`" isHidden>
        <TpfLayout>
            <template #header>
                <div style="height: 50px; background-color: aqua">header</div>
            </template>
            <template #content>
                <div style="height: 100px; background-color: #ddd">content</div>
            </template>
        </TpfLayout>
        <pre>{{ html }}</pre>

        <a-table :data-source="dataSource" :columns="getColumns()" :pagination="false" />
    </TpfCollapse>
</template>

<script setup lang="tsx" name="TestTpfLayout">
    import { defineAsyncComponent, ref } from 'vue';
    import { getColumns } from '@/components/config';
    const TpfCollapse = defineAsyncComponent(() => import('@/components/TpfCollapse/index.vue'));
    const TpfLayout = defineAsyncComponent(() => import('@/components/TpfLayout/index.vue'));
    defineProps<{ index?: number }>();

    const dataSource = ref([
        { params: 'contentTopmargin', introduce: '间隔', type: 'string', defaultValue: '10px' },
        {
            params: 'header',
            introduce: '上部分插槽',
            type: 'slot',
            defaultValue: ''
        },
        {
            params: 'content',
            introduce: '下部分插槽',
            type: 'slot',
            defaultValue: ''
        }
    ]);

    const html = `
            <TpfLayout>
                <template #header>
                    <div style="height: 50px">header</div>
                </template>
                <template #content>
                    <div style="height: 100px">content</div>
                </template>
            </TpfLayout>

            const TpfLayout = defineAsyncComponent(() => import('@/components/TpfLayout/index.vue'));
        `;
</script>
