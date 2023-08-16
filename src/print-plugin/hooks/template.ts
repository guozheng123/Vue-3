import { getFields } from '../utils/template-helper';

export const initDefaultTemplate = (allRenderPrintFields?: any) => {
    const fields = getFields(allRenderPrintFields.headerList);

    return {
        panels: [
            {
                index: 0,
                height: 297,
                width: 210,
                paperHeader: 49.5,
                paperFooter: 780,
                printElements: [
                    {
                        options: {
                            left: 175.5,
                            top: 10.5,
                            height: 27,
                            width: 259,
                            title: '自定义名称',
                            fontSize: 19,
                            fontWeight: '600',
                            textAlign: 'center',
                            lineHeight: 26,
                            coordinateSync: true,
                            widthHeightSync: true,
                            fields
                        },
                        printElementType: { title: '自定义文本', type: 'text' }
                    },
                    {
                        options: {
                            left: 60,
                            top: 27,
                            height: 13,
                            width: 52,
                            title: '页眉线',
                            textAlign: 'center'
                        },
                        printElementType: { title: '自定义文本', type: 'text' }
                    },
                    {
                        options: {
                            left: 25.5,
                            top: 57,
                            height: 705,
                            width: 9,
                            fixed: true,
                            borderStyle: 'dotted'
                        },
                        printElementType: { type: 'vline' }
                    },
                    {
                        options: {
                            left: 21,
                            top: 346.5,
                            height: 61.5,
                            width: 15,
                            title: '装订线',
                            lineHeight: 18,
                            fixed: true,
                            contentPaddingTop: 3.75,
                            backgroundColor: '#ffffff'
                        },
                        printElementType: { type: 'text' }
                    },
                    {
                        options: {
                            left: 525,
                            top: 784.5,
                            height: 13,
                            width: 63,
                            title: '页尾线',
                            textAlign: 'center'
                        },
                        printElementType: { title: '自定义文本', type: 'text' }
                    },
                    {
                        options: {
                            left: 334.5,
                            top: 810,
                            height: 13,
                            width: 205,
                            title: '页眉线已上。页尾下以下每页都会重复打印',
                            textAlign: 'center'
                        },
                        printElementType: { title: '自定义文本', type: 'text' }
                    }
                ],
                paperNumberLeft: 565.5,
                paperNumberTop: 819
            }
        ]
    };
};
