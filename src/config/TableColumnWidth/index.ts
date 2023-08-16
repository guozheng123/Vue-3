import { TpfColumnType } from '@/types';
import { AlignType } from 'ant-design-vue/es/vc-table/interface';

//表单列宽自由拖拽
export const tableResizable = (
    width = 150,
    resizable = true,
    minWidth = 50,
    maxWidth = 500,
    align = 'left' as AlignType
): TpfColumnType => {
    return {
        showSorterTooltip: false,
        ellipsis: true,
        // visible: true,
        width,
        resizable,
        minWidth,
        maxWidth,
        align
    };
};
