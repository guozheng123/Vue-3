import { tableResizable } from '@/config';

export const getColumns = () => {
    return [
        { title: '参数', dataIndex: 'params', ...tableResizable() },
        { title: '说明', dataIndex: 'introduce', ...tableResizable() },
        { title: '类型', dataIndex: 'type', ...tableResizable() },
        { title: '默认值', dataIndex: 'defaultValue', ...tableResizable() }
    ];
};
