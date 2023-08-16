<template><VNode /> </template>

<script setup lang="tsx">
    import { Image, ImagePreviewGroup } from 'ant-design-vue';
    import type { ImageProps } from 'ant-design-vue';

    import { computed, watchEffect, ref } from 'vue';

    import LoadingError from '@/assets/images/loadingError.png';
    import { useFilesystemApi } from '@/api';
    import { isEmpty } from 'lodash-es';

    const filesystemApi = useFilesystemApi();

    interface ImageListType extends ImageProps {
        fileCode: string;
    }

    type Props = {
        visible?: boolean;
        current?: number;
        previewList?: ImageListType[];
    };

    const props = withDefaults(defineProps<Props>(), {
        current: -1,
        previewList: () => []
    });

    const emit = defineEmits<{
        (e: 'update:visible', val: boolean): void;
    }>();

    const visible = computed({
        get() {
            return props.visible;
        },
        set(val) {
            emit('update:visible', val);
        }
    });

    const showAllImageList = ref<ImageListType[]>([]);

    const getAllImageList = () => {
        if (isEmpty(props.previewList)) return;
        Promise.allSettled(
            props.previewList.map(item =>
                filesystemApi.getPreviewFileUrl({ fileCode: item.fileCode })
            )
        ).then((res: any) => {
            // @ts-ignore
            showAllImageList.value = props.previewList.map((item, inx) => {
                let src;
                if (res[inx].status === 'rejected') {
                    src = LoadingError;
                } else {
                    src = res[inx].value.data.value;
                }
                return {
                    ...item,
                    src
                };
            });
        });
    };
    watchEffect(() => {
        getAllImageList();
    });

    const VNode = () => {
        return (
            <div style="display: none">
                <ImagePreviewGroup
                    {...({
                        preview: {
                            current: props.current,
                            visible: visible.value,
                            onVisibleChange: (vis: boolean) => (visible.value = vis)
                        }
                    } as any)}
                >
                    {/* @ts-ignore  */}
                    {showAllImageList.value.map((item, inx) => (
                        <Image
                            fallback={LoadingError}
                            src={item.src}
                            key={inx}
                            onError={() => {
                                const _img = document.querySelector(
                                    '.ant-image-preview-root .ant-image-preview-img-wrapper img'
                                ) as HTMLImageElement;
                                _img && (_img.src = LoadingError);
                            }}
                        />
                    ))}
                </ImagePreviewGroup>
            </div>
        );
    };
</script>
