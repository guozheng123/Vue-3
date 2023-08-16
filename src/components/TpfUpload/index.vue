<template> <vNode /> </template>

<script setup lang="tsx" name="TpfUpload">
    import { Upload, Space, Button, Row, Col } from 'ant-design-vue';
    import { ref, unref, useAttrs, useSlots, computed, watchEffect } from 'vue';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { useFilesystemApi } from '@/api';
    import { TpfUploadFile } from '@/types';
    import { isArray } from 'lodash-es';

    const filesystemApi = useFilesystemApi();

    type Props = {
        isReadonly?: boolean; //是否为只读状态
        businessType?: string; //该资源放置的远程文件目录
        downLoadTemplate?: (() => void) | string;
        multiple?: boolean;
        accept?: string;
        maxSize?: number; //单位M
        customText?: string;
        fileList?: TpfUploadFile[];
    };

    const props = withDefaults(defineProps<Props>(), {
        isReadonly: false,
        businessType: 'operation',
        multiple: false,
        accept: '.xlsx,.xls',
        maxSize: 10,
        customText: ''
    });
    const fileList = ref<any[]>(props.fileList || []);

    watchEffect(() => {
        if (props.fileList && props.fileList.length) {
            setFileList(props.fileList, true);
        }
    });

    const showFileList = (list: any[]) => {
        if (!isArray(unref(list))) return [];
        const res = unref(list).map((item: any, uid: number) => ({
            ...item,
            name: item.fileName,
            uid
        }));
        return res;
    };

    const getFileList = () => unref(fileList);

    const setFileList = (list: any[], isOrigin = false) => {
        fileList.value = isOrigin ? showFileList(list) : list;
    };

    const customRequest = async (upload: any) => {
        const fileName = upload.file.name;
        const fieldTypesArr = props.accept.split(',');
        const fieldTypes = fileName.slice(fileName.lastIndexOf('.'));
        const { message } = await import('ant-design-vue');

        if (!fieldTypesArr.includes(fieldTypes)) {
            return message.error(`目前仅支持${props.accept}格式的文件`);
        }

        if (props.maxSize && upload.file.size > props.maxSize * 1024 * 1024) {
            message.error(`文件大小不能超过${props.maxSize}M`);
            return;
        }

        const res = await filesystemApi.uploadFileObject({
            businessType: props.businessType,
            file: upload.file as File
        });
        const { fileName: name } = res.data.object;
        if (props.multiple) {
            const findIndex = fileList.value.findIndex(item => item.name === name);
            if (findIndex > -1) {
                fileList.value.splice(findIndex, 1);
            }
            fileList.value.push({ ...res.data.object, name });
        } else {
            fileList.value = [{ ...res.data.object, name }];
        }
    };

    const getTemplate = () => {
        if (typeof props.downLoadTemplate === 'function') {
            props.downLoadTemplate();
        } else {
            props.downLoadTemplate &&
                filesystemApi.downloadTemplateObject({ fileCode: props.downLoadTemplate });
        }
    };

    const attrs = useAttrs();
    const slots = useSlots();

    const getTemplateCol = () => (
        <>
            下载
            <span
                class="tpf-link"
                onClick={(e: MouseEvent) => {
                    e.stopPropagation();
                    getTemplate();
                }}
            >
                《 导入模版》
            </span>
        </>
    );
    const getAcceptCol = () => <>支持扩展名:{props.accept}</>;
    const getMaxSizeCol = () => <>支持文件大小{props.maxSize}M以内 </>;
    const getCustomTextCol = () => <>{props.customText} </>;
    const descCol = computed(() => {
        const list = [];
        if (props.downLoadTemplate) {
            list.push(getTemplateCol());
        }
        if (props.accept) {
            list.push(getAcceptCol());
        }
        if (props.maxSize) {
            list.push(getMaxSizeCol());
        }
        if (props.customText) {
            list.push(getCustomTextCol());
        }
        return list;
    });

    const removeFile = (file: any) => {
        const findInx = fileList.value.findIndex(item => item.uid === file.uid);
        fileList.value.splice(findInx, 1);
    };

    const onPreview = (file: any) => {
        filesystemApi.downloadFileObject({ fileCode: file.fileCode });
    };

    const vNode = () => {
        const { multiple, accept, isReadonly } = props;
        return (
            <Upload
                class={`tpf-upload ${isReadonly ? 'isReadonly' : ''}`}
                multiple={multiple}
                accept={accept}
                fileList={fileList.value}
                customRequest={customRequest}
                onRemove={removeFile}
                onPreview={onPreview}
                v-slots={slots}
                {...attrs}
            >
                <Space size={10}>
                    <Button class="tpf-button" type="primary">
                        <SvgIcon type="icon-daochu" style="margin-right: 5px" />
                        上传文件
                    </Button>
                    <Row
                        gutter={20}
                        {...{
                            onClick: (e: MouseEvent) => {
                                e.stopPropagation();
                            }
                        }}
                    >
                        {descCol.value.map((item, inx) => (
                            <Col key={inx} span={24}>
                                {descCol.value.length > 1 ? (
                                    <span>
                                        {inx + 1}、{item}
                                    </span>
                                ) : (
                                    <span>{item}</span>
                                )}
                            </Col>
                        ))}
                    </Row>
                </Space>
            </Upload>
        );
    };

    defineExpose({ getFileList, setFileList });
</script>

<style lang="less">
    .tpf-upload {
        .ant-upload-list {
            width: 450px;

            .ant-upload-list-item-info {
                cursor: pointer;
            }
        }

        .ant-col-24 {
            font-weight: 400;
            color: #b0b4b7;
            font-size: 12px;
        }

        &.isReadonly {
            .ant-upload {
                display: none;
            }

            .ant-upload-list {
                .ant-upload-list-item {
                    margin-top: 0;
                }

                .ant-upload-list-item-card-actions-btn {
                    display: none;
                }
            }
        }
    }
</style>
