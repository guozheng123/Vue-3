<template>
    <TpfCollapse :title="`${index}-表格 - TpfTable`" isHidden>
        <TpfTable
            :operateColumn="operateColumn"
            :dataSource="TpfTableList"
            :columns="getColumns()"
            style="height: 300px"
            seq
            :pagination="false"
        />

        <pre>{{ html }}</pre>

        <a-table :data-source="dataSource" :columns="getColumns()" :pagination="false" />
    </TpfCollapse>
</template>

<script setup lang="tsx" name="TestTpfTable">
    import { defineAsyncComponent, ref } from 'vue';
    import { getColumns } from '@/components/config';
    import type { TpfColumnType } from '@/types';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    const TpfCollapse = defineAsyncComponent(() => import('@/components/TpfCollapse/index.vue'));

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    defineProps<{ index?: number }>();
    const TpfTableList = ref([{}, {}, {}]);
    const defaultBtn = [
        { title: '编辑', onClick: (row: any) => console.log('编辑', row) },
        { title: '编辑2', onClick: () => console.log('编辑2') },
        { title: '编辑3', onClick: () => console.log('编辑3') }
    ];
    const moreBtn = [
        { title: '更多1', onClick: () => console.log('更多1') },
        { title: '更多2', onClick: () => console.log('更多2') },
        { title: '更多3', onClick: () => console.log('更多3') }
    ];
    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 300,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn, moreBtn)
    });

    const dataSource = ref([
        {
            params: 'seq',
            introduce: '展示序号',
            type: 'boolean',
            defaultValue: ''
        },
        {
            params: 'operateColumn',
            introduce: '操作栏',
            type: 'boolean',
            defaultValue: ''
        },
        {
            params: 'striped',
            introduce: '斑马纹',
            type: 'boolean',
            defaultValue: ''
        },
        {
            params: 'pageCode',
            introduce: '后端配置项',
            type: 'string',
            defaultValue: ''
        },
        {
            params: 'beforeRender',
            introduce: '渲染列前的处理',
            type: '(list: TpfColumnType[]) => TpfColumnType[]',
            defaultValue: ''
        },
        {
            params: 'fontSize',
            introduce: '表格字体大小',
            type: 'number',
            defaultValue: ''
        },
        {
            params: '其他属性跟插槽',
            introduce: '支持官方antd 的所有属性跟插槽',
            type: '',
            defaultValue: 'https://www.antdv.com/components/table-cn/#API'
        }
    ]);

    const html = `
            <TpfTable 
                :operateColumn="operateColumn"
                :dataSource="TpfTableList"
                :columns="getColumns()"
                style="height: 300px" // 如果渲染不出来请检查表格高度
                seq
                :pagination="false"
            />

            const TpfTableLayout = defineAsyncComponent(
                () => import('@/components/TpfTableLayout/index.vue')
            );
        `;
</script>
