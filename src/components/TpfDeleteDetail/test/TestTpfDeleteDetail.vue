<template>
    <TpfCollapse :title="`${index}-删除的详细详情 - TpfDeleteDetail`" isHidden>
        <a-button @click="openDelModalDOm">删除的详细详情</a-button>
        <TpfDeleteDetail ref="delModalDom" v-if="showDelModalDom" />
        <pre>{{ html }}</pre>

        <a-table :data-source="dataSource" :columns="getColumns()" :pagination="false" />
    </TpfCollapse>
</template>

<script setup lang="tsx" name="TestTpfDeleteDetail">
    import { defineAsyncComponent, ref } from 'vue';
    import { getColumns } from '@/components/config';
    import { useTpfDeleteDetail } from '@/components/TpfDeleteDetail';

    const TpfCollapse = defineAsyncComponent(() => import('@/components/TpfCollapse/index.vue'));

    const { delModalDom, openDelModalDom, showDelModalDom, TpfDeleteDetail } = useTpfDeleteDetail();

    const openDelModalDOm = () => {
        openDelModalDom([{}, {}]);
    };

    defineProps<{ index?: number }>();

    const dataSource = ref([
        {
            params: 'columns',
            introduce: '展示的列配置',
            type: '[]',
            defaultValue: '{}[]'
        },
        {
            params: 'rowKey',
            introduce: 'key',
            type: 'string',
            defaultValue: 'message'
        },
        {
            params: '其他属性跟插槽',
            introduce: '支持官方antd-modal 的所有属性跟插槽',
            type: '',
            defaultValue: 'https://www.antdv.com/components/modal-cn/#API'
        }
    ]);

    const html = `
            <a-button @click="openDelModalDOm">删除的详细详情</a-button>
            <TpfDeleteDetail ref="delModalDom" />

            import { useTpfDeleteDetail } from '@/components/TpfDeleteDetail';

            const { delModalDom, openDelModalDom, showDelModalDom, TpfDeleteDetail } = useTpfDeleteDetail();

            const openDelModalDOm = () => {
                openDelModalDom([{}, {}]);
            };
        `;
</script>
