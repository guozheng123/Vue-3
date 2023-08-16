<template>
    <TpfCollapse :title="`${index}-弹窗-基本使用 - TpfModal`" isHidden>
        <a-button @click="visible = true">打开弹窗</a-button>
        <TpfModal v-model:visible="visible" title="标题">
            内容
            <template #footerLeft>
                <a-button type="primary">底部左插槽</a-button>
            </template>
            <template #footerRight>
                <a-button type="primary">底部右插槽</a-button>
            </template>
        </TpfModal>
        <pre>{{ html }}</pre>

        <a-table :data-source="dataSource" :columns="getColumns()" :pagination="false" />
    </TpfCollapse>
</template>

<script setup lang="tsx" name="TestTpfModal">
    import { defineAsyncComponent, ref } from 'vue';
    import { getColumns } from '@/components/config';
    const TpfCollapse = defineAsyncComponent(() => import('@/components/TpfCollapse/index.vue'));
    const TpfModal = defineAsyncComponent(() => import('@/components/TpfModal/index.vue'));
    const visible = ref(false);
    defineProps<{ index?: number }>();

    const dataSource = ref([
        {
            params: 'v-model:visible /:visible',
            introduce: '是否显示',
            type: 'boolean',
            defaultValue: 'false'
        },
        {
            params: 'useFull',
            introduce: '显示切换全屏按钮',
            type: 'boolean',
            defaultValue: 'false'
        },
        {
            params: 'width',
            introduce: '宽度',
            type: 'string',
            defaultValue: '600px'
        },
        {
            params: 'height',
            introduce: '内容部分高度',
            type: 'string',
            defaultValue: '440px'
        },
        {
            params: 'getContainer',
            introduce: '放置弹窗的容器',
            type: 'Function',
            defaultValue: '() => document.body'
        },
        {
            params: 'bodyStyle',
            introduce: '内容部分样式',
            type: 'CSSProperties',
            defaultValue: ''
        },
        {
            params: 'footerLeft',
            introduce: '底部左插槽',
            type: 'slot',
            defaultValue: ''
        },
        {
            params: 'footerRight',
            introduce: '底部右插槽',
            type: 'slot',
            defaultValue: ''
        },
        {
            params: '其他属性 跟其他插槽',
            introduce: '支持所有的官方的属性跟插槽',
            type: '',
            defaultValue: 'https://www.antdv.com/components/modal-cn'
        }
    ]);

    const html = `
            <a-button @click="visible = true">打开弹窗</a-button>
            <TpfModal v-model:visible="visible" title="标题">
                内容
                <template #footerLeft>
                    <a-button type="primary">底部左插槽</a-button>
                </template>
                <template #footerRight>
                    <a-button type="primary">底部右插槽</a-button>
                </template>
            </TpfModal>

            const TpfModal = defineAsyncComponent(() => import('@/components/TpfModal/index.vue'));
            const visible = ref(false);
        `;
</script>
