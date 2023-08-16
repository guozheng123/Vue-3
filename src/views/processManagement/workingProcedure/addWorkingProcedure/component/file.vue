<template>
    <TpfCollapse title="导入文件" gap="0">
        <a-card style="width: 100%">
            <a-row :gutter="24">
                <a-col :span="4">
                    <a-upload
                        :file-list="fileList"
                        name="file"
                        accept=".doc,.docx,.xlsx,.xls,.ppt,.pptx,.dwg,.jpg,.png,.pdf"
                        :customRequest="customRequest"
                        @remove="removeFile"
                    >
                        <a-button type="primary" class="tpf-button">
                            <SvgIcon type="icon-daochu" style="margin-right: 5px" />
                            上传文件
                        </a-button>
                    </a-upload>
                </a-col>
                <a-col class="upload_title" :span="14">
                    <div>1、支持扩展名:.doc,.docx,.xlsx,.xls,.ppt,.pptx,.dwg,.jpg,.png,.pdf</div>
                    <div>2、支持文件大小10M以内</div>
                </a-col>
            </a-row>
        </a-card>
    </TpfCollapse>
</template>

<script setup lang="ts">
    import { ref, unref, computed, onMounted } from 'vue';
    import { UploadFile, message } from 'ant-design-vue';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import { useFilesystemApi } from '@/api';
    import { useRouter } from 'vue-router';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    const filesystemApi = useFilesystemApi();

    const $router = useRouter();

    type Props = {
        data: any;
    };
    const props = withDefaults(defineProps<Props>(), {
        data: () => ({})
    });

    const fileList = ref<UploadFile<any>[]>([]);

    const allFileList = ref([]);

    const fieldTypesArr = ['doc', 'docx', 'xlsx', 'xls', 'ppt', 'pptx', 'dwg', 'jpg', 'png', 'pdf'];
    const operationFileList = ref();
    const routerType = computed(() => $router.currentRoute.value.query.type);

    const customRequest = async (upload: any) => {
        if ((upload.file as File).size > 10 * 1024 * 1024) {
            message.error('文件大小不能超过10M');
            return;
        }
        const fieldTypes = upload.file.name.substring(upload.file.name.lastIndexOf('.') + 1);
        if (fieldTypesArr.includes(fieldTypes)) {
            const res = await filesystemApi.uploadFileObject({
                businessType: 'operation',
                file: upload.file
            });
            const { fileCode, fileName, fileSaveName, fileSavePath, fileSize, fileType } =
                res.data.object;
            fileList.value.push(upload.file as UploadFile<any>);
            const data = {
                fileCode,
                fileName,
                fileSaveName,
                fileSavePath,
                fileSize,
                fileType
            } as never;
            allFileList.value.push({
                params: data,
                uploadInfo: upload.file as UploadFile<any>
            } as never);
        } else {
            console.log(2);
        }
    };
    // watch(
    //     () => routerType,
    //     val => {
    //         if (val !== '0') {
    //             if (props.data.operationFileList?.length) {
    //                 for (let i = 0; i < props.data.operationFileList.length; i++) {
    //                     const e = props.data.operationFileList[i];
    //                     e.name = e.fileName;
    //                     e.uid = e.id;
    //                     fileList.value.push(e);
    //                     allFileList.value.push({ params: e, uploadInfo: e } as never);
    //                 }
    //             }
    //         }
    //     },
    //     {
    //         deep: true,
    //         immediate: true
    //     }
    // );
    const save = () => {
        operationFileList.value = allFileList.value.map((e: any) => {
            return e.params;
        });
        return unref(operationFileList);
    };
    const removeFile = async (info: UploadFile) => {
        allFileList.value = allFileList.value.filter((e: any) => {
            if (e.uploadInfo.uid !== info.uid) {
                return e;
            }
        });
        fileList.value = allFileList.value.map((e: any) => {
            return e.uploadInfo;
        });
    };
    const load = () => {
        if (routerType.value !== '0') {
            if (props.data.operationFileList?.length) {
                for (let i = 0; i < props.data.operationFileList.length; i++) {
                    const e = props.data.operationFileList[i];
                    e.name = e.fileName;
                    e.uid = e.id;
                    fileList.value.push(e);
                    allFileList.value.push({ params: e, uploadInfo: e } as never);
                }
            }
        }
    };
    onMounted(async () => {
        load();
    });
    defineExpose({
        save
    });
</script>

<style scoped lang="less">
    :deep(.ant-upload-list-item-info) {
        width: 450px;
        border-radius: 4px;
    }

    .upload_title div {
        font-size: 8px;
        height: 16px;
        line-height: 16px;
        color: #b0b4b7;
    }

    .upload_title {
        height: 24px !important;
        left: 100px;
        position: absolute;
    }

    .upload_info {
        margin-top: 10px;
        width: 393px;
        padding: 10px;
        border-radius: 4px 4px 4px 4px;

        .delete {
            float: right;
        }
    }

    .upload_info:hover {
        background: #f7f8fa;
        border-radius: 4px 4px 4px 4px;
        opacity: 1;
    }

    .reason:hover {
        background: #f7f8fa;
        border-radius: 4px 4px 4px 4px;
        opacity: 1;
    }
</style>
