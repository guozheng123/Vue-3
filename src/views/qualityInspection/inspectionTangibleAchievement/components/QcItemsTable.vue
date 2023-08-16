<template>
    <div class="qcItemsTable">
        <TpfTable :columns="columns" :dataSource="tableData" :pagination="false" :rowKey="'id'" />
        <ImagePreviewModel ref="imagePreviewRef" v-if="onloadImagePreview" />
    </div>
</template>

<script setup lang="tsx" name="QcItemsTable">
    import { useOpenAntdModal } from '@/hooks';
    import { getTpfOptionEnum } from '@/config';
    import { computed, defineAsyncComponent } from 'vue';
    import ImagePreviewModel from './ImagePreviewModel.vue';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    type Props = {
        qcColumns: any[];
        qcTableData: any[];
    };
    const props = withDefaults(defineProps<Props>(), {
        qcColumns: () => [],
        qcTableData: () => []
    });
    const [imagePreviewRef, onOpenImagePreview, onloadImagePreview] = useOpenAntdModal();

    const onViewPhoto = ({ files }: { files: any[] }) => {
        if (files.length) onOpenImagePreview(files);
    };
    const columns = computed(() => {
        return props.qcColumns.map(item => {
            if (item.dataIndex === 'files') {
                item.customRender = ({ text, record }: { text: string; record: any }) => {
                    return (
                        <span
                            class={'photo-color'}
                            onClick={() => onViewPhoto(record)}
                            v-show={record.files?.length}
                        >
                            <SvgIcon type="icon-kejian" class={'t-mr-1'} />
                            预览 ({record.files?.length})
                        </span>
                    );
                };
            }
            return item;
        });
    });
    const tableData = computed(() => {
        return props.qcTableData;
    });
</script>

<style scoped lang="less">
    .ant-form {
        padding: 14px 10px 0 10px;
    }

    :deep(.photo-color) {
        cursor: pointer;
        color: var(--ant-primary-color);
    }

    .tpf-table {
        height: 250px;
    }
</style>
