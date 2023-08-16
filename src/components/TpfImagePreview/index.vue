<template> <VNode /> </template>

<script setup lang="tsx">
    import { Image } from 'ant-design-vue';
    import type { ImageProps } from 'ant-design-vue';
    import { ref, useCssModule, useAttrs } from 'vue';
    import TpfImagePreviewGroup from './TpfImagePreviewGroup.vue';
    import TpfCloseImg from './TpfCloseImg.vue';
    import LoadingError from '@/assets/images/loadingError.png';
    import LoadingImg from '@/assets/images/LoadingImg.png';
    import { isArray } from 'lodash-es';

    interface ImageListType extends ImageProps {
        fileCode: string;
    }
    type Props = {
        imgList?: ImageListType[];
        allowClear?: boolean;
        width?: number | string;
        height?: number | string;
        size?: number;
        useClose?: boolean;
    };
    const props = withDefaults(defineProps<Props>(), {
        imgList: () => [],
        width: 200,
        height: 200,
        size: 10,
        useClose: true
    });

    const emit = defineEmits<{
        (e: 'delPic', val: string | ImageProps, inx: number): void;
    }>();

    const visible = ref(false);

    const current = ref(-1);

    const style = useCssModule('root');
    const addPx = (val: any) => {
        if (isNaN(val)) {
            return val;
        }
        return String(val).includes('px') ? val : `${val}px`;
    };

    const attrs = useAttrs();

    const VNode = () => {
        const { useClose } = props;
        return (
            <div class={[style['tpf-image-preview']]}>
                <div class="img-box">
                    {isArray(props.imgList) &&
                        props.imgList.map((item, inx) => {
                            const { width, height, ...args } = item;
                            return (
                                <TpfCloseImg
                                    key={inx}
                                    onClickDel={() => emit('delPic', item, inx)}
                                    useClose={useClose}
                                    v-lazyImg={item}
                                    style={{
                                        width: props.width ? addPx(props.width) : addPx(width),
                                        height: props.height ? addPx(props.height) : addPx(height),
                                        padding: props.size / 2 + 'px'
                                    }}
                                    {...args}
                                    {...attrs}
                                >
                                    <Image
                                        fallback={LoadingError}
                                        preview={{ visible: false }}
                                        key={inx}
                                        width="100%"
                                        height="100%"
                                        src={LoadingImg}
                                        onClick={() => {
                                            current.value = inx;
                                            visible.value = true;
                                        }}
                                    />
                                </TpfCloseImg>
                            );
                        })}
                </div>
                {visible.value && (
                    <TpfImagePreviewGroup
                        v-model={[visible.value, 'visible']}
                        previewList={props.imgList}
                        current={current.value}
                    />
                )}
            </div>
        );
    };
</script>

<style lang="less" module="root">
    .tpf-image-preview {
        :global {
            .img-box {
                display: flex;
                justify-content: flex-start;
                flex-wrap: wrap;
            }

            .image-box {
                position: relative;
            }

            .ant-image {
                > .ant-image-img {
                    height: 100%;
                }
            }
        }
    }
</style>
