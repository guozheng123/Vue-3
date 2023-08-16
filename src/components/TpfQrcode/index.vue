<template> <vNode /></template>

<script lang="tsx" setup name="TpfQrcode">
    import { cloneDeep, isString } from 'lodash-es';
    import QRCode, { QRCodeRenderersOptions } from 'qrcode';
    import { computed, nextTick, ref, unref, watch } from 'vue';
    const { toCanvas, toDataURL } = QRCode;

    interface QrcodeLogo {
        src?: string;
        logoSize?: number;
        bgColor?: string;
        borderSize?: number;
        crossOrigin?: string;
        borderRadius?: number;
        logoRadius?: number;
    }
    type Props = {
        tag?: 'canvas' | 'img'; //img 或者 canvas,img不支持logo嵌套
        text?: string; //二维码内容
        options?: QRCodeRenderersOptions; //
        width?: number; // 二维码大小
        logo?: Partial<QrcodeLogo> | string; //logo
        // disabled?: boolean; //是否过期
        // disabledText?: string; //过期提示内容
    };

    const props = withDefaults(defineProps<Props>(), {
        tag: 'canvas',
        options: () => ({} as QRCodeRenderersOptions),
        width: 200,
        logo: () => '',
        text: ''
    });

    const emit = defineEmits(['done', 'click', 'disabledClick']);

    const loading = ref(false);

    const wrapRef = ref<HTMLCanvasElement | HTMLImageElement | null>(null);
    const renderText = computed(() => props.text);
    const wrapStyle = computed(() => {
        return {
            width: props.width + 'px',
            height: props.width + 'px'
        };
    });
    // 对于内容少的QrCode，增大容错率
    const getErrorCorrectionLevel = (content: string) => {
        if (content.length > 36) {
            return 'M';
        } else if (content.length > 16) {
            return 'Q';
        } else {
            return 'H';
        }
    };

    // 得到原QrCode的大小，以便缩放得到正确的QrCode大小
    const getOriginWidth = async (content: string, options: QRCodeRenderersOptions) => {
        const _canvas = document.createElement('canvas');
        await toCanvas(_canvas, content, options);
        return _canvas.width;
    };

    // 用于绘制圆角
    const canvasRoundRect = (ctx: CanvasRenderingContext2D) => {
        return (x: number, y: number, w: number, h: number, r: number) => {
            const minSize = Math.min(w, h);
            if (r > minSize / 2) {
                r = minSize / 2;
            }
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.arcTo(x + w, y, x + w, y + h, r);
            ctx.arcTo(x + w, y + h, x, y + h, r);
            ctx.arcTo(x, y + h, x, y, r);
            ctx.arcTo(x, y, x + w, y, r);
            ctx.closePath();
            return ctx;
        };
    };

    const createLogoCode = (canvasRef: HTMLCanvasElement) => {
        const canvasWidth = canvasRef.width;
        const logoOptions: QrcodeLogo = Object.assign(
            {
                logoSize: 0.15,
                bgColor: '#ffffff',
                borderSize: 0.05,
                crossOrigin: 'anonymous',
                borderRadius: 8,
                logoRadius: 0
            },
            isString(props.logo) ? {} : props.logo
        );
        const {
            logoSize = 0.15,
            bgColor = '#ffffff',
            borderSize = 0.05,
            crossOrigin = 'anonymous',
            borderRadius = 8,
            logoRadius = 0
        } = logoOptions;
        const logoSrc = isString(props.logo) ? props.logo : props.logo.src;
        const logoWidth = canvasWidth * logoSize;
        const logoXY = (canvasWidth * (1 - logoSize)) / 2;
        const logoBgWidth = canvasWidth * (logoSize + borderSize);
        const logoBgXY = (canvasWidth * (1 - logoSize - borderSize)) / 2;
        const ctx = canvasRef.getContext('2d');
        if (!ctx) return;
        // logo 底色
        canvasRoundRect(ctx)(logoBgXY, logoBgXY, logoBgWidth, logoBgWidth, borderRadius);
        ctx.fillStyle = bgColor;
        ctx.fill();
        // logo
        const image = new Image();
        if (crossOrigin || logoRadius) {
            image.setAttribute('crossOrigin', crossOrigin);
        }
        (image as any).src = logoSrc;
        // 使用image绘制可以避免某些跨域情况
        const drawLogoWithImage = (image: HTMLImageElement) => {
            ctx.drawImage(image, logoXY, logoXY, logoWidth, logoWidth);
        };
        // 使用canvas绘制以获得更多的功能
        const drawLogoWithCanvas = (image: HTMLImageElement) => {
            const canvasImage = document.createElement('canvas');
            canvasImage.width = logoXY + logoWidth;
            canvasImage.height = logoXY + logoWidth;
            const imageCanvas = canvasImage.getContext('2d');
            if (!imageCanvas || !ctx) return;
            imageCanvas.drawImage(image, logoXY, logoXY, logoWidth, logoWidth);
            canvasRoundRect(ctx)(logoXY, logoXY, logoWidth, logoWidth, logoRadius);
            if (!ctx) return;
            const fillStyle = ctx.createPattern(canvasImage, 'no-repeat');
            if (fillStyle) {
                ctx.fillStyle = fillStyle;
                ctx.fill();
            }
        };
        // 将 logo绘制到 canvas上
        return new Promise((resolve: any) => {
            image.onload = () => {
                logoRadius ? drawLogoWithCanvas(image) : drawLogoWithImage(image);
                resolve(canvasRef.toDataURL());
            };
        });
    };

    const initQrcode = async () => {
        loading.value = true;

        await nextTick();
        const options = cloneDeep(props.options || {});
        if (props.tag === 'canvas') {
            // 容错率，默认对内容少的二维码采用高容错率，内容多的二维码采用低容错率
            options.errorCorrectionLevel =
                options.errorCorrectionLevel || getErrorCorrectionLevel(unref(renderText));
            const _width: number = await getOriginWidth(unref(renderText), options);
            options.scale = props.width === 0 ? undefined : (props.width / _width) * 4;
            const canvasRef: any = await toCanvas(
                unref(wrapRef) as HTMLCanvasElement,
                unref(renderText),
                options
            );
            if (props.logo) {
                const url = await createLogoCode(canvasRef);
                emit('done', url);
                loading.value = false;
            } else {
                emit('done', canvasRef.toDataURL());
                loading.value = false;
            }
        } else {
            const url = await toDataURL(renderText.value, {
                errorCorrectionLevel: 'H',
                width: props.width,
                ...options
            });
            (unref(wrapRef) as HTMLImageElement).src = url;
            emit('done', url);
            loading.value = false;
        }
    };
    watch(
        () => renderText.value,
        val => {
            if (!val) return;
            initQrcode();
        },
        {
            deep: true,
            immediate: true
        }
    );
    const clickCode = () => {
        emit('click');
    };
    // const disabledClick = () => {
    //     emit('disabledClick');
    // };

    const vNode = () => {
        return (
            <div class="tpf-qrcode" style={unref(wrapStyle)} v-loading={unref(loading)}>
                {props.tag === 'canvas' ? (
                    <canvas ref={wrapRef} onClick={clickCode}></canvas>
                ) : (
                    <img ref={wrapRef} onClick={clickCode}></img>
                )}
                {/* {props.disabled && (
                    <div
                        class="absolute top-0 left-0 flex items-center justify-center w-full h-full qrcode--disabled"
                        onClick={disabledClick}
                    >
                        <div class="absolute top-[50%] left-[50%] font-bold">
                            <IconifyIconOffline
                                class="cursor-pointer"
                                icon="refreshRight"
                                width="30"
                                color="var(--el-color-primary)"
                            />
                            <div>{props.disabledText}</div>
                        </div>
                    </div>
                )} */}
            </div>
        );
    };
</script>

<style lang="less" scoped>
    .tpf-qrcode {
    }
</style>
