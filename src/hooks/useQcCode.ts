import { ref, h, render, unref, onBeforeUnmount } from 'vue';
import { message } from 'ant-design-vue';

export const useQcCode = () => {
    const audio = ref({} as HTMLAudioElement);
    const video = ref({} as HTMLMediaElement);

    const canvas = ref({} as CanvasRenderingContext2D);

    const cvsele = ref({} as HTMLCanvasElement);

    const canvasContainer = ref({} as HTMLDivElement);

    const imgUrl = ref({} as ImageData);

    const isAnimation = ref(false);

    const timer = ref(-1);

    const init = async () => {
        const _canvasContainer = document.createElement('div');
        _canvasContainer.setAttribute(
            'style',
            'z-index:999;position: fixed; top: 0; right: 0; left: 0;bottom: 0;overflow: hidden;'
        );
        const _QCcanvas = document.createElement('canvas');
        _QCcanvas.setAttribute('style', 'height:100%;width: 100%;display: block;');
        _canvasContainer.appendChild(_QCcanvas);
        canvasContainer.value = _canvasContainer;
        const Tone = (await import('@/assets/mp3/tone.mp3')).default;

        audio.value = new Audio(Tone);
        video.value = document.createElement('video');
        document.body.appendChild(_canvasContainer);
        cvsele.value = _QCcanvas;
        canvas.value = cvsele.value.getContext('2d')!;
    };

    //扫描后的红线
    const draw = (begin: { x: number; y: number }, end: { x: number; y: number }) => {
        unref(canvas).beginPath();
        unref(canvas).moveTo(begin.x, begin.y);
        unref(canvas).lineTo(end.x, end.y);
        unref(canvas).lineWidth = 3;
        unref(canvas).strokeStyle = 'red';
        unref(canvas).stroke();
    };

    const closeCanvas = () => {
        (unref(video).srcObject as MediaStream)?.getTracks()?.forEach(track => track.stop());
        isAnimation.value = false;

        unref(canvasContainer)?.parentNode?.removeChild(unref(canvasContainer));
    };

    //添加canvas窗口关闭按钮
    const addCloseIcon = async () => {
        const _icon = document.createElement('div');
        _icon.setAttribute('style', 'position: absolute ; top: 20px ; right: 20px');
        unref(canvasContainer).appendChild(_icon);
        const SvgIcon = (await import('@/components/SvgIcon/index.vue')).default;
        render(
            h(SvgIcon, {
                type: 'icon-guanbi2',
                size: 24,
                cursor: true,
                style: { color: 'var(--ant-primary-color)' },
                onClick: closeCanvas
            }),
            _icon
        );
    };

    const openScan = async (): Promise<string> => {
        await init();
        return new Promise((resolve, reject) => {
            isAnimation.value = true;
            (navigator as any).getUserMedia =
                (navigator as any).getUserMedia ||
                (navigator as any).webkitGetUserMedia ||
                (navigator as any).mozGetUserMedia ||
                (navigator as any).msGetUserMedia;

            if (navigator.mediaDevices) {
                navigator.mediaDevices
                    .getUserMedia({
                        video: { facingMode: 'environment' }
                    })
                    .then(stream => {
                        unref(video).srcObject = stream;
                        unref(video).setAttribute('playsinline', 'true');
                        unref(video).setAttribute('webkit-playsinline', 'true');
                        unref(video).addEventListener('loadedmetadata', () => {
                            unref(video).play();
                            addCloseIcon();
                            sweep(resolve, reject);
                        });
                    });
            } else if ((navigator as any).getUserMedia) {
                (navigator as any).getUserMedia(
                    { video: { facingMode: 'environment' } },
                    (stream: any) => {
                        video.value.srcObject = stream;
                        video.value.setAttribute('playsinline', 'true');
                        video.value.setAttribute('webkit-playsinline', 'true');
                        video.value.addEventListener('loadedmetadata', () => {
                            video.value.play();
                            sweep(resolve, reject);
                        });
                    },
                    (error: any) => {
                        closeCanvas();
                        console.error(error.name + '：' + error.message + '，' + error.constraint);
                    }
                );
            } else {
                if (
                    navigator.userAgent.toLowerCase().match(/chrome/) &&
                    location.origin.indexOf('https://') < 0
                ) {
                    closeCanvas();
                    console.error(
                        '获取浏览器录音功能，因安全性问题，需要在localhost 或 127.0.0.1 或 https 下才能获取权限！'
                    );
                    message.error(
                        '获取浏览器录音功能，因安全性问题，需要在localhost 或 127.0.0.1 或 https 下才能获取权限！'
                    );

                    reject(
                        '获取浏览器录音功能，因安全性问题，需要在localhost 或 127.0.0.1 或 https 下才能获取权限！'
                    );
                } else {
                    console.log('对不起：未识别到扫描设备!');
                    message.error('对不起：未识别到扫描设备!');

                    reject('对不起：未识别到扫描设备!');
                }
            }
        });
    };

    //扫描过程
    const sweep = async (resolve: (value: string) => void, reject: (reason?: any) => void) => {
        if (unref(video).readyState === unref(video).HAVE_ENOUGH_DATA) {
            const { videoWidth, videoHeight } = unref(video) as any;
            unref(cvsele).width = videoWidth;
            unref(cvsele).height = videoHeight;
            unref(canvas).drawImage(
                unref(video) as CanvasImageSource,
                0,
                0,
                videoWidth,
                videoHeight
            );
            try {
                const img = unref(canvas).getImageData(0, 0, videoWidth, videoHeight);
                imgUrl.value = img;

                const jsQR = (await import('jsqr')).default;
                const obj = jsQR(img.data, img.width, img.height, {
                    inversionAttempts: 'dontInvert'
                });
                if (obj) {
                    const loc = obj.location;
                    draw(loc.topLeftCorner, loc.topRightCorner);
                    draw(loc.topRightCorner, loc.bottomRightCorner);
                    draw(loc.bottomRightCorner, loc.bottomLeftCorner);
                    draw(loc.bottomLeftCorner, loc.topLeftCorner);
                    unref(audio).play();
                    isAnimation.value = false;
                    cancelAnimationFrame(unref(timer));
                    console.info('识别结果：', obj.data);
                    if (!obj.data) {
                        message.error('识别失败，请检查二维码是否正确！');

                        reject && reject('识别失败，请检查二维码是否正确！');
                    }
                    resolve && resolve(obj.data);
                    closeCanvas();
                } else {
                    console.error('识别失败，请检查二维码是否正确！');
                }
            } catch (err) {
                console.error('识别失败，请检查二维码是否正确！', err);
                message.error('识别失败，请检查二维码是否正确！');
                reject && reject('识别失败，请检查二维码是否正确！');
            }
        }
        if (isAnimation.value) {
            timer.value = requestAnimationFrame(async () => {
                await sweep(resolve, reject);
            });
        }
    };

    onBeforeUnmount(() => {
        closeCanvas();
    });

    return { openScan };
};
