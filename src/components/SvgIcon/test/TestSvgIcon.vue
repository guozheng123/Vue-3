<template>
    <TpfCollapse :title="`${index}-icon图标 - SvgIcon`" isHidden>
        <a-space>
            <SvgIcon type="icon-daoru" cursor />
            <SvgIcon type="icon-daochu" :size="22" shadow />
            <SvgIcon type="icon-daochu" :size="22" shadow active activeBackGround="#f00" />
            <SvgIcon
                type="icon-daochu"
                :size="22"
                cursor
                shadow
                active
                activeBackGround="#f00"
                rotate
            />
        </a-space>
        <pre>{{ html }}</pre>

        <a-table :data-source="dataSource" :columns="getColumns()" :pagination="false" />
    </TpfCollapse>
</template>

<script setup lang="tsx" name="TestSvgIcon">
    import { defineAsyncComponent, ref } from 'vue';
    import { getColumns } from '@/components/config';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    const TpfCollapse = defineAsyncComponent(() => import('@/components/TpfCollapse/index.vue'));
    defineProps<{ index?: number }>();

    const dataSource = ref([
        { params: 'type', introduce: 'icon名称', type: 'string', defaultValue: '' },
        { params: 'size', introduce: 'icon大小', type: 'string | number', defaultValue: '16px' },
        {
            params: 'cursor',
            introduce: '是否显示鼠标小手',
            type: 'boolean',
            defaultValue: 'false'
        },
        {
            params: 'shadow',
            introduce: '鼠标移入阴影',
            type: 'boolean',
            defaultValue: 'false'
        },
        {
            params: 'active',
            introduce: '是否是当前选择',
            type: 'boolean',
            defaultValue: 'false'
        },
        {
            params: 'move',
            introduce: '鼠标移入拖拽状态',
            type: 'boolean',
            defaultValue: 'false'
        },
        {
            params: 'activeBackGround',
            introduce: '当前高亮的选择色',
            type: 'string',
            defaultValue: '#e8e9e9'
        },
        {
            params: 'hoverColor',
            introduce: '鼠标移入显示主题色',
            type: 'boolean',
            defaultValue: 'false'
        },
        {
            params: 'rotate',
            introduce: 'icon旋转180度',
            type: 'boolean',
            defaultValue: 'false'
        }
    ]);

    const html = `
        <SvgIcon type="icon-daoru" cursor/>
        <SvgIcon type="icon-xiangshang" shadow/>
        <SvgIcon type="icon-daochu" :size="22" shadow active activeBackGround="#f00" />
        <SvgIcon type="icon-daochu" :size="22" cursor shadow active  activeBackGround="#f00" rotate  />


        import SvgIcon from '@/components/SvgIcon/index.vue';

        `;
</script>

<style lang="less" scoped></style>
