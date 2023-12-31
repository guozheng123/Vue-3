// 默认参数
import { px2Vw } from './pxToVw';
const defaultsProp = px2Vw();
function toFixed(number, precision) {
    const multiplier = Math.pow(10, precision + 1),
        wholeNumber = Math.floor(number * multiplier);
    return (Math.round(wholeNumber / 10) * 10) / multiplier;
}

function createPxReplace(viewportSize, minPixelValue, unitPrecision, viewportUnit) {
    return function ($0, $1) {
        if (!$1) return;
        const pixels = parseFloat($1);
        if (pixels <= minPixelValue) return;
        return toFixed((pixels / viewportSize) * 100, unitPrecision) + viewportUnit;
    };
}
const templateReg = /<template>([\s\S]+)<\/template>/gi;
const pxGlobalReg = /(\d+)px/gi;

// 生成插件的工厂方法
const pluginGenerator = (customOptions = defaultsProp) => {
    // 返回插件
    return {
        // 插件名称
        name: 'style-px-to-vw',

        // transform 钩子
        async transform(code, id) {
            const _source = '';
            if (/.vue$/.test(id)) {
                let _source = '';
                if (templateReg.test(code)) {
                    _source = code.match(templateReg)[0];
                }
                if (pxGlobalReg.test(_source)) {
                    const $_source = _source.replace(
                        pxGlobalReg,
                        createPxReplace(
                            customOptions.viewportWidth,
                            customOptions.minPixelValue,
                            customOptions.unitPrecision,
                            customOptions.viewportUnit
                        )
                    );

                    code = code.replace(_source, $_source);
                }
            }
            return { code };
        }
    };
};

export default pluginGenerator;
