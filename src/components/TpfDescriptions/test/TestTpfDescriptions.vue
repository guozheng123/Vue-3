<template>
    <TpfCollapse :title="`${index}-详情 - TpfDescriptions`" isHidden>
        <TpfDescriptions :original-date="originalDate" :renderList="renderList" />
        <pre>{{ html }}</pre>

        <a-table :data-source="dataSource" :columns="getColumns()" :pagination="false" />
    </TpfCollapse>
</template>

<script setup lang="tsx" name="TestTpfDescriptions">
    import { defineAsyncComponent, ref } from 'vue';
    import { getColumns } from '@/components/config';
    import TpfDescriptions from '@/components/TpfDescriptions/index.vue';
    const TpfCollapse = defineAsyncComponent(() => import('@/components/TpfCollapse/index.vue'));

    const originalDate = ref({
        name: 'zs',
        age: 18
    });
    const renderList = [
        { label: '姓名', field: 'name' },
        { label: '年龄1', field: 'age' },
        { label: '年龄2', field: 'age' },
        { label: '年龄3', field: 'age' },
        { label: '年龄4', field: 'age' },
        { label: '年龄5', field: 'age' }
    ];

    defineProps<{ index?: number }>();

    const dataSource = ref([
        {
            params: 'descriptionsProps',
            introduce: '支持所有的 antd的 Descriptions 属性',
            type: 'DescriptionsProps',
            defaultValue: 'https://www.antdv.com/components/descriptions-cn#API'
        },
        {
            params: 'descriptionsItemProps',
            introduce: '支持所有的 antd的 DescriptionsItemProp 属性',
            type: 'DescriptionsItemProp',
            defaultValue: 'https://www.antdv.com/components/descriptions-cn#API'
        },
        {
            params: 'originalDate',
            introduce: '数据源',
            type: '{}',
            defaultValue: ''
        },
        {
            params: 'renderList',
            introduce: '渲染列表',
            type: '{ label: string; field: string }[]',
            defaultValue: '[]'
        }
    ]);

    const html = `
            <TpfDescriptions :original-date="originalDate" :renderList="renderList" />

            const TpfDescriptions = defineAsyncComponent(
                () => import('@/components/TpfDescriptions/index.vue')
            );
            const originalDate = ref({
                name: 'zs',
                age: 18
            });
            const renderList = [
                { label: '姓名', field: 'name' },
                { label: '年龄1', field: 'age' },
                { label: '年龄2', field: 'age' },
                { label: '年龄3', field: 'age' },
                { label: '年龄4', field: 'age' },
                { label: '年龄5', field: 'age' }
            ];
        `;
</script>
