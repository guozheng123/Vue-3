import type { ColumnType } from 'ant-design-vue/lib/table';
import type { UploadFile } from 'ant-design-vue';
import type { RuleObject } from 'ant-design-vue/lib/form';

export interface TpfColumnType<T = any> extends ColumnType<T> {
    displayOrdinal?: number;
    check?: boolean;
    visible?: boolean;
}

export interface TpfUploadFile extends UploadFile {
    fileCode: string;
    fileName: string;
    fileSaveName: string;
    fileSavePath: string;
    fileSize: string;
    fileType: string;
}

export type TpfAnchorList = {
    href: string;
    title: string;
    visible?: boolean;
};

export type TpfDescColumnType = {
    label?: string;
    // filed?: string;
    field?: string | ((val: Record<string, any>) => any);
    description?: string;
    customRender?: (record: { record: Record<string, any>; text: any }) => void;
    slots?: {
        default?: (record: { record: Record<string, any>; text: any }) => JSX.Element;
    };
};

export type TpfDelInfo = {
    message: string;
    reason: string;
    result: string;
};

export type ExportTableHeaderConfig = Pick<TpfColumnType, 'title' | 'dataIndex'>[];

export type OperateBtnClick<T = Record<string, any>> = {
    value: any;
    text: any;
    record: T;
    index: number;
    renderIndex: number;
    column: ColumnType<T>;
};

export interface TpfOperateBtn<T = Record<string, any>> {
    key?: any;
    title: string | (() => Element);
    onClick: (opt: OperateBtnClick<T>, title: string | Element) => void;
    permission?: string[] | null;
    visible?: boolean;
    hidden?: boolean;
    disabled?: boolean;
}

export interface TpfValidateRule {
    [k: string]: RuleObject | RuleObject[];
}
