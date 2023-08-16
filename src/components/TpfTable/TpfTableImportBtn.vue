<template>
    <a-button class="tpf-button" type="primary" @click="startImport" ghost>
        <SvgIcon type="icon-daoru" /> 导入
    </a-button>
    <TpfExport
        ref="exportModal"
        :uploadAction="uploadAction"
        :multiple="false"
        :customText="customText"
        :downLoadTemplate="downLoadTemplate"
        @uploadTable="getDataList"
        v-bind="$attrs"
        v-if="showExportModal"
    />
</template>

<script setup lang="tsx" name="TpfTableImportBtn">
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { useOpenAntdModal } from '@/hooks';
    import type { TpfUploadFile } from '@/types';
    import type { ResTpfValue, TpfAxiosRes } from '@/types/axios';
    import { defineAsyncComponent } from 'vue';

    const TpfExport = defineAsyncComponent(() => import('@/components/TpfExport/index.vue'));

    const [exportModal, onOpenExportModal, showExportModal] = useOpenAntdModal();

    type Props = {
        businessType?: string; //该资源放置的远程文件目录
        downLoadTemplate?: (() => void) | string;
        multiple?: boolean;
        accept?: string;
        maxSize?: number; //单位M
        customText?: string;
        uploadAction: (val: {
            list: TpfUploadFile[];
            overrideFlag: boolean;
        }) => Promise<TpfAxiosRes<ResTpfValue>> | any;
    };

    withDefaults(defineProps<Props>(), {
        businessType: 'operation',
        multiple: false,
        accept: '.xlsx,.xls',
        maxSize: 10,
        customText: ''
    });
    const emit = defineEmits<{
        (e: 'uploadTable'): void;
    }>();

    const getDataList = () => {
        emit('uploadTable');
    };

    const startImport = () => {
        onOpenExportModal();
    };
</script>

<style lang="less" scoped></style>
