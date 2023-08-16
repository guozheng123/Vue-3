import type { DirectiveBinding, ObjectDirective } from 'vue';
import { useFilesystemApi } from '@/api';
import LoadingError from '@/assets/images/loadingError.png';

const filesystemApi = useFilesystemApi();

/**
 * @author wangkang
 *  图片懒加载 V 指令
 */
export default {
    mounted: (
        el: HTMLImageElement,
        { value }: DirectiveBinding<{ fileCode: string; src: string }>
    ) => {
        const _img =
            el.nodeName.toLowerCase() === 'img'
                ? el
                : (el.querySelector('img') as HTMLImageElement);

        const observe = new IntersectionObserver(
            async ([{ isIntersecting }]) => {
                if (isIntersecting) {
                    observe.unobserve(_img);
                    _img.onerror = () => {
                        _img.src = LoadingError;
                    };

                    if (value.src) {
                        _img.src = value.src;
                        return;
                    }
                    const _src = await filesystemApi
                        .getPreviewFileUrl({ fileCode: value.fileCode })
                        .then(res => res.data.value)
                        .catch(() => {
                            _img.src = LoadingError;
                        });
                    _img.src = _src || '';
                }
            },
            {
                threshold: 0
            }
        );
        _img && observe.observe(_img);
    }
} as ObjectDirective;
