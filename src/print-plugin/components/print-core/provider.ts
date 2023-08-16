import {
    ResQueryPrintTemplateFields,
    fillFieldList,
    getFields
} from '@/print-plugin/utils/template-helper';
import { hiprint } from 'vue-plugin-hiprint';

type Props = {
    renderName: string;
    allRenderPrintFields: ResQueryPrintTemplateFields;
};

export const provider1 = (ops: Props) => {
    const { renderName } = ops || {};
    const addElementTypes = (context: any) => {
        context.removePrintElementTypes(renderName);
        context.addPrintElementTypes(renderName, [
            new hiprint.PrintElementTypeGroup('常规字段', fillFieldList(ops))
        ]);
    };
    return {
        addElementTypes
    };
};

export const provider2 = (ops: Props) => {
    const { renderName = '_help', allRenderPrintFields } = ops || {};
    const addElementTypes = (context: any) => {
        context.removePrintElementTypes(renderName);
        const headerFields = getFields(allRenderPrintFields.headerList);

        const bodyFields = getFields(allRenderPrintFields.bodyList);

        context.addPrintElementTypes(renderName, [
            new hiprint.PrintElementTypeGroup('表格', [
                {
                    tid: `${renderName}.table`,
                    title: '列表数据',
                    type: 'table',
                    options: { field: 'table', fields: bodyFields },
                    columns: [bodyFields]
                }
            ]),
            new hiprint.PrintElementTypeGroup('其他', [
                {
                    tid: `${renderName}.qrcode`, //唯一的id
                    title: '二维码',
                    options: {
                        testData: '智造家',
                        height: 50,
                        width: 50,
                        fontSize: 50,
                        fontWeight: '400',
                        textAlign: 'center',
                        hideTitle: true,
                        textType: 'qrcode',
                        field: '', //当前字段
                        fields: headerFields
                    }
                },
                {
                    tid: `${renderName}.barcode`,
                    title: '条形码',
                    options: {
                        testData: '1234567890',
                        height: 34,
                        width: 175,
                        fontWeight: '400',
                        textAlign: 'center',
                        textType: 'barcode',
                        field: '', //当前字段
                        fields: headerFields
                    }
                },
                {
                    tid: `${renderName}.image`,
                    title: '图片',
                    type: 'image',
                    options: {
                        height: 50,
                        width: 90,
                        fontWeight: '400',
                        textAlign: 'center',
                        textType: 'image',
                        // field: 'gender', //当前字段
                        src: `${location.origin}/images/logo.png`,
                        field: '', //当前字段
                        fit: 'contain'
                    }
                },

                {
                    tid: `${renderName}.customText`,
                    title: '备注文本',
                    customText: '自定义文本',
                    custom: true,
                    type: 'text',
                    options: { testData: '自定义文本', field: '', fields: headerFields }
                },
                { tid: `${renderName}.hline`, title: '横线', type: 'hline' },
                { tid: `${renderName}.vline`, title: '竖线', type: 'vline' }
                // {
                //     tid: `${renderName}.longText`,
                //     title: '备注长文本',
                //     type: 'longText',
                //     options: {
                //         field: 'longText',
                //         width: 200,
                //         testData: '长文本',
                //         fields: headerFields
                //     }
                // }
            ])
            // new hiprint.PrintElementTypeGroup('辅助工具', [
            //     { tid: `${renderName}.hline`, title: '横线', type: 'hline' },
            //     { tid: `${renderName}.vline`, title: '竖线', type: 'vline' }
            // { tid: `${renderName}.rect`, title: '矩形', type: 'rect' },
            // { tid: `${renderName}.oval`, title: '椭圆', type: 'oval' }
            // ])
        ]);
    };
    return { addElementTypes };
};
