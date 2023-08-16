<template>
    <TpfCollapse :title="`${index}-二维码组件 - TpfQrcode`" isHidden>
        <a-space>
            <TpfQrcode
                text="123"
                logo="https://img0.baidu.com/it/u=981218435,2998857702&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1677603600&t=455d091ed3eb38bf61a72df4b1285a9d"
                :options="{
                    color: {
                        dark: '#ff0000',
                        light: '#fff'
                    }
                }"
            />
            <TpfQrcode
                text="123"
                logo="https://img0.baidu.com/it/u=981218435,2998857702&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1677603600&t=455d091ed3eb38bf61a72df4b1285a9d"
            />
            <TpfQrcode text="123" />
        </a-space>
        <pre>{{ html }}</pre>

        <a-table :data-source="dataSource" :columns="getColumns()" :pagination="false" />
    </TpfCollapse>
</template>

<script setup lang="tsx" name="TestTpfQrCode">
    import { defineAsyncComponent, ref } from 'vue';
    import { getColumns } from '@/components/config';
    const TpfCollapse = defineAsyncComponent(() => import('@/components/TpfCollapse/index.vue'));
    const TpfQrcode = defineAsyncComponent(() => import('@/components/TpfQrcode/index.vue'));
    defineProps<{ index?: number }>();

    const dataSource = ref([
        {
            params: 'tag',
            introduce: '渲染二维码使用的标签',
            type: 'canvas | img',
            defaultValue: 'canvas'
        },
        {
            params: 'text',
            introduce: '渲染二维码的内容',
            type: 'string',
            defaultValue: ''
        },
        {
            params: 'width',
            introduce: '渲染二维码的大小',
            type: 'number',
            defaultValue: '200'
        },
        {
            params: 'logo',
            introduce: 'logo图片',
            type: 'string',
            defaultValue: ''
        },
        {
            params: 'options',
            introduce: '样式',
            type: 'QRCodeRenderersOptions',
            defaultValue: ''
        }
    ]);

    const html = `
            <TpfQrcode
                text="123"
                logo="https://img0.baidu.com/it/u=981218435,2998857702&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1677603600&t=455d091ed3eb38bf61a72df4b1285a9d"
                :options="{
                    color: {
                        dark: '#ff0000',
                        light: '#fff'
                    }
                }"
            />

            <TpfQrcode
                text="123"
                logo="https://img0.baidu.com/it/u=981218435,2998857702&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1677603600&t=455d091ed3eb38bf61a72df4b1285a9d"
            />

            <TpfQrcode text="123" />

        const TpfQrcode = defineAsyncComponent(() => import('@/components/TpfQrcode/index.vue'));
        `;
</script>
