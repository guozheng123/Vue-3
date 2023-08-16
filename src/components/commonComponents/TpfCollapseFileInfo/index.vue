<template>
    <TpfCollapse title="附件" class="fileInfo">
        <div class="uploadBtn" v-noData="readonly && renderFileList.length === 0">
            <TpfUpload
                :isReadonly="readonly"
                :maxSize="maxSize"
                :accept="accept"
                :multiple="multiple"
                ref="TpfUploadRef"
                :fileList="fileList"
            />
        </div>
    </TpfCollapse>
</template>

<script setup lang="tsx" name="fileInfo">
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import TpfUpload from '@/components/TpfUpload/index.vue';
    import { TpfUploadFile } from '@/types';
    import { ref, watchEffect } from 'vue';
    import { isArray } from 'lodash-es';

    type Props = {
        fileList?: TpfUploadFile[];
        maxSize?: number;
        multiple?: boolean;
        accept?: string;
        fieldName?: string;
        readonly?: boolean;
    };

    const props = withDefaults(defineProps<Props>(), {
        multiple: true,
        maxSize: 10,
        accept: '.xlsx,.xls',
        fieldName: 'productionOrderFileVoList'
    });

    const renderFileList = ref<TpfUploadFile[]>([]);

    const TpfUploadRef = ref<InstanceType<typeof TpfUpload> | null>(null);

    watchEffect(() => {
        if (!props.fileList || !isArray(props.fileList)) return;
        renderFileList.value = props.fileList.map((item: any, uid: number) => ({
            ...item,
            name: item.fileName,
            uid
        }));
        TpfUploadRef.value?.setFileList(renderFileList.value);
    });

    const submit = () => {
        return { [props.fieldName]: TpfUploadRef.value?.getFileList() };
    };

    defineExpose({ submit });
</script>

<style lang="less" scoped>
    .fileInfo {
        .uploadBtn {
            background-color: #fff;
            padding: 20px;
            box-sizing: border-box;
        }
    }
</style>
