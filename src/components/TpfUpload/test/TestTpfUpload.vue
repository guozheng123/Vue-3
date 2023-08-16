<template>
    <TpfCollapse :title="`${index}-上传 - TpfUpload`" isHidden>
        <a-space>
            <TpfUpload downLoadTemplate="xx" />
            <TpfUpload />
            <TpfUpload :maxSize="0" />
            <TpfUpload isReadonly :fileList="fileList" />
        </a-space>
        <pre>{{ html }}</pre>

        <a-table :data-source="dataSource" :columns="getColumns()" :pagination="false" />
    </TpfCollapse>
</template>

<script setup lang="tsx" name="TestTpfUpload">
    import { defineAsyncComponent, ref } from 'vue';
    import { getColumns } from '@/components/config';
    import TpfUpload from '@/components/TpfUpload/index.vue';
    const TpfCollapse = defineAsyncComponent(() => import('@/components/TpfCollapse/index.vue'));

    defineProps<{ index?: number }>();
    const fileList = ref<any[]>([
        { name: '部门导入模板.xlsx', fileCode: '10409418604545', uid: 1 }
    ]);

    const dataSource = ref([
        {
            params: 'isReadonly',
            introduce: '是否为只读状态',
            type: 'boolean',
            defaultValue: 'false'
        },
        {
            params: 'downLoadTemplate',
            introduce: '下载模版方法',
            type: '(() => void) | string;',
            defaultValue: ''
        },
        {
            params: 'businessType',
            introduce: '该资源放置的远程文件目录',
            type: 'string',
            defaultValue: 'operation'
        },
        {
            params: 'multiple',
            introduce: '是否支持多选',
            type: 'boolean',
            defaultValue: 'false'
        },
        {
            params: 'accept',
            introduce: '可以选择的文件类型',
            type: 'string',
            defaultValue: '.xlsx,.xls'
        },
        {
            params: 'maxSize',
            introduce: '最大文件大小（单位M）',
            type: 'number',
            defaultValue: '10'
        },
        {
            params: 'fileList',
            introduce: '预览文件列表',
            type: 'UploadFile',
            defaultValue: ''
        },
        {
            params: '其他属性跟插槽',
            introduce: '支持所有的a-upload的属性跟插槽',
            type: '',
            defaultValue: 'https://www.antdv.com/components/upload-cn/#API'
        }
    ]);

    const html = `
            <a-space>
                <TpfUpload downLoadTemplate="xx" />
                <TpfUpload />
                <TpfUpload :maxSize="0" />
                <TpfUpload isReadonly :fileList="fileList" />
            </a-space>

            const TpfUpload = defineAsyncComponent(() => import('@/components/TpfUpload/index.vue'));

            const fileList = ref<any[]>([
                { name: '部门导入模板.xlsx', fileCode: '10409418604545', uid: 1 }
            ]);
        `;
</script>
