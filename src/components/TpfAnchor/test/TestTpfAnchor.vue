<template>
    <TpfCollapse :title="`${index}-锚点定位 - TpfAnchor`" isHidden>
        <TpfAnchor :anchorList="anchorList" />

        <div class="TestTpfAnchor">
            <div id="a">基础信息</div>
            <div id="b">生产信息</div>
            <div id="c">质量信息</div>
        </div>
        <pre>{{ html }}</pre>

        <a-table :data-source="dataSource" :columns="getColumns()" :pagination="false" />
    </TpfCollapse>
</template>

<script setup lang="tsx" name="TestTpfAnchor">
    import { defineAsyncComponent, ref } from 'vue';
    import { getColumns } from '@/components/config';
    const TpfCollapse = defineAsyncComponent(() => import('@/components/TpfCollapse/index.vue'));
    const TpfAnchor = defineAsyncComponent(() => import('@/components/TpfAnchor/index.vue'));
    defineProps<{ index?: number }>();

    const anchorList = ref([
        { href: 'a', title: '基础信息', visible: true },
        { href: 'b', title: '生产信息', visible: true },
        { href: 'c', title: '质量信息', visible: true }
    ]);

    const dataSource = ref([
        {
            params: 'anchorList',
            introduce: '渲染锚点列表',
            type: '{href:string , title:string , visible:boolean}[]',
            defaultValue: '[]'
        }
    ]);

    const html = `
        <div class="TestTpfAnchor">
        <TpfAnchor :anchorList="anchorList" />

            <div id="a">基础信息</div>
            <div id="b">生产信息</div>
            <div id="c">质量信息</div>
        </div>

        const TpfAnchor = defineAsyncComponent(() => import('@/components/TpfAnchor/index.vue'));
        const anchorList = ref([
        { href: 'a', title: '基础信息', visible: true },
        { href: 'b', title: '生产信息', visible: true },
        { href: 'c', title: '质量信息', visible: true },
        { href: 'd', title: '导入文件', visible: true }
    ]);

        `;
</script>

<style lang="less" scoped>
    .TestTpfAnchor {
        height: 100vh;

        > div {
            height: 50vh;
        }
    }
</style>
