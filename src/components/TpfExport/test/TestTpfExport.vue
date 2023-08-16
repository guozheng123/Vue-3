<template>
    <TpfCollapse :title="`${index}-上传弹窗 - TpfExport`" isHidden>
        <a-button @click="onOpenExportModal">上传</a-button>
        <TpfExport ref="exportModalDom" :upload-action="uploadAction" downLoadTemplate="xx" />
        <pre>{{ html }}</pre>

        <a-table :data-source="dataSource" :columns="getColumns()" :pagination="false" />
    </TpfCollapse>
</template>

<script setup lang="tsx" name="TestTpfExport">
    import { defineAsyncComponent, ref } from 'vue';
    import { getColumns } from '@/components/config';
    import { useOpenAntdModal } from '@/hooks';
    const TpfCollapse = defineAsyncComponent(() => import('@/components/TpfCollapse/index.vue'));
    const TpfExport = defineAsyncComponent(() => import('@/components/TpfExport/index.vue'));

    defineProps<{ index?: number }>();
    const [exportModalDom, onOpenExportModal] = useOpenAntdModal();

    const uploadAction = () => {};

    const dataSource = ref([
        {
            params: 'uploadAction',
            introduce: '上传按钮的接口',
            type: '({list: TpfUploadFile[]; overrideFlag: boolean;}) => Promise<TpfAxiosRes<ResTpfValue>> | any;',
            defaultValue: ''
        },
        {
            params: '其他属性 与 TpfUpload 组件相同 ',
            introduce: '',
            type: '',
            defaultValue: ''
        }
    ]);

    const html = `
            <a-button @click="onOpenExportModal">上传</a-button>
            <TpfExport ref="exportModalDom" :upload-action="uploadAction" downLoadTemplate="xx" />

            const TpfExport = defineAsyncComponent(() => import('@/components/TpfExport/index.vue'));
            const [exportModalDom, onOpenExportModal] = useOpenAntdModal();
            const uploadAction = ({list: TpfUploadFile[]; overrideFlag: boolean;}) => {...};
        `;
</script>
