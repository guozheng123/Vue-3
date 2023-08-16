<template> <VNode /> </template>

<script setup lang="tsx">
    import type { ImageProps } from 'ant-design-vue';
    import { Image, Space, Button } from 'ant-design-vue';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import LoadingError from '@/assets/images/loadingError.png';
    import LoadingImg from '@/assets/images/LoadingImg.png';
    import { useCssModule } from 'vue';
    import { useFileDialog } from '@vueuse/core';
    import { useFilesystemApi } from '@/api';
    import { TpfUploadFile } from '@/types';

    const filesystemApi = useFilesystemApi();

    const styles = useCssModule('root');

    interface ImageListType extends ImageProps {
        fileCode: string;
    }

    type Props = {
        imgList?: ImageListType[];
        allowClear?: boolean;
        width?: number;
        height?: number;
        size?: number;
        useClose?: boolean;
        showMaxNum?: number;
        accept?: string;
        multiple?: boolean;
        businessType?: string;
    };

    const props = withDefaults(defineProps<Props>(), {
        imgList: () => [],
        width: 200,
        height: 200,
        size: 20,
        useClose: true,
        showMaxNum: 3,
        accept: '.jpg,.png,.jpeg',
        multiple: false,
        businessType: 'pic'
    });

    const emit = defineEmits<{
        (e: 'addFile', val: TpfUploadFile): void;
    }>();

    const { open, reset, onChange } = useFileDialog({
        accept: props.accept,
        multiple: props.multiple
    });

    onChange(async files => {
        const [file] = [...(files || [])];
        const fileName = file.name;
        const fieldTypesArr = props.accept.split(',');
        const fieldTypes = fileName.slice(fileName.lastIndexOf('.'));
        const { message } = await import('ant-design-vue');
        if (!fieldTypesArr.includes(fieldTypes)) {
            return message.error(`目前仅支持${props.accept}格式的文件`);
        }
        const res = await filesystemApi.uploadFileObject({
            businessType: props.businessType,
            file
        });
        emit('addFile', res.data.object);
    });

    const renderList = (list: ImageListType[] = []) => {
        return list.map((item, inx) => {
            const { width, height, ...args } = item;
            if (props.imgList.length > props.showMaxNum && inx === list.length - 1) {
                return (
                    <div
                        key={inx}
                        style={{
                            height: `${height || props.height}px`,
                            width: `${width || props.width}px`
                        }}
                        class="renderNum"
                    >
                        +{props.imgList.length - props.showMaxNum + 1}
                    </div>
                );
            }
            return (
                <span v-lazyImg={item}>
                    <Image
                        fallback={LoadingError}
                        preview={{ visible: false }}
                        key={inx}
                        width={width || props.width}
                        height={height || props.height}
                        src={LoadingImg}
                        {...args}
                    />
                </span>
            );
        });
    };

    const VNode = () => {
        const showImgList = props.imgList.slice(0, props.showMaxNum);
        return (
            <div class={[styles['tpf-thumbnail']]}>
                <Space>
                    {renderList(showImgList)}
                    <Button
                        type="primary"
                        shape="circle"
                        size="small"
                        onClick={() => {
                            reset();
                            open();
                        }}
                    >
                        <SvgIcon type="icon-insert" />
                    </Button>
                </Space>
            </div>
        );
    };
</script>

<style lang="less" module="root">
    .tpf-thumbnail {
        :global {
            .ant-image {
                > .ant-image-img {
                    height: 100%;
                    border-radius: 4px;
                }

                .ant-image-mask {
                    display: none;
                }
            }

            .renderNum {
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #f5f5f5;
                border-radius: 4px;
                border: 1px dashed #e5e5e5;
            }
        }
    }
</style>
