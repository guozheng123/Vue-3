import { hiprint } from 'vue-plugin-hiprint';

const templateMap = {};

export function newHiprintPrintTemplate(key: string, options: any) {
    const template = new hiprint.PrintTemplate(options);
    templateMap[key] = template;
    return template;
}

export function getHiprintPrintTemplate(key: string) {
    return templateMap[key];
}

export interface ResQueryPrintTemplateFields {
    headerList: ResPrint[];
    bodyList: ResPrint[];
}

export interface ResPrint {
    id: number;
    displayOrdinal: number;
    fieldCode: string;
    showName: string;
    fieldType: string;
}
/**
 * 获取字段list
 * @author wangkang
 * @param list
 * @returns
 */
export const getFields = (list: ResPrint[]) =>
    list.map(item => {
        const res = {
            text: item.showName,
            field: item.fieldCode,
            title: item.showName,
            width: 100
        } as any;
        if (item.fieldCode === 'serialNumber') {
            res.tableTextType = 'sequence';
        }
        return res;
    });

type Props = {
    renderName: string;
    allRenderPrintFields: ResQueryPrintTemplateFields;
};

/** 填充常规的拖拽字段
 * @author wangkang
 * @param ops
 * @returns
 */
export const fillFieldList = (ops: Props) => {
    const { allRenderPrintFields, renderName } = ops || {};
    const fields = getFields(allRenderPrintFields.headerList);
    return allRenderPrintFields.headerList.map(item => ({
        tid: `${renderName}.${item.fieldCode}`,
        title: item.showName,
        type: 'text',
        options: {
            testData: '测试数据', //item.showName,
            height: 16,
            fontSize: 6.75,
            fontWeight: '400',
            textAlign: 'center',
            textContentVerticalAlign: 'middle',
            hideTitle: false,
            field: item.fieldCode,
            fields
        }
    }));
};
