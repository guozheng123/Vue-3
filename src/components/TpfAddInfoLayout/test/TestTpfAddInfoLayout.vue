<template>
    <TpfCollapse :title="`${index}-新增-编辑页面 - TpfAddInfoLayout`" isHidden>
        <TpfAddInfoLayout style="height: 300px">
            内容区域
            <template #headerRight>
                <a-button type="primary">头部右插槽</a-button>
            </template>
            <template #footerLeft>
                <a-button type="primary">左边的插槽</a-button>
            </template>
            <template #footerRight>
                <a-button type="primary">右边的插槽</a-button>
            </template>
        </TpfAddInfoLayout>
        <pre>{{ html }}</pre>

        <a-table :data-source="dataSource" :columns="getColumns()" :pagination="false" />
    </TpfCollapse>
</template>

<script setup lang="tsx" name="TestTpfAddInfoLayout">
    import { defineAsyncComponent, ref } from 'vue';
    import { getColumns } from '@/components/config';
    const TpfCollapse = defineAsyncComponent(() => import('@/components/TpfCollapse/index.vue'));
    const TpfAddInfoLayout = defineAsyncComponent(
        () => import('@/components/TpfAddInfoLayout/index.vue')
    );
    defineProps<{ index?: number }>();

    const dataSource = ref([
        {
            params: 'title',
            introduce: '标题',
            type: 'string',
            defaultValue: 'title'
        },
        {
            params: 'backAction',
            introduce: '返回按钮事件',
            type: 'Function',
            defaultValue: 'router.back()'
        },
        {
            params: 'headerRight',
            introduce: '头部右插槽',
            type: 'slot',
            defaultValue: ''
        },
        {
            params: 'default',
            introduce: '默认插槽',
            type: 'slot',
            defaultValue: ''
        },
        {
            params: 'footerLeft',
            introduce: '左边插槽',
            type: 'slot',
            defaultValue: ''
        },
        {
            params: 'footerRight',
            introduce: '右边插槽',
            type: 'slot',
            defaultValue: ''
        }
    ]);

    const html = `
                <TpfAddInfoLayout style="height: 300px">
                    内容区域
                    <template #headerRight>
                        <a-button type="primary">头部右插槽</a-button>
                    </template>
                    <template #footerLeft>
                        <a-button type="primary">左边的插槽</a-button>
                    </template>
                    <template #footerRight>
                        <a-button type="primary">右边的插槽</a-button>
                    </template>
                </TpfAddInfoLayout>

            const TpfAddInfoLayout = defineAsyncComponent(
                () => import('@/components/TpfAddInfoLayout/index.vue')
            );
        `;
</script>
