import * as antd from 'ant-design-vue';
import { resolveComponent } from 'vue';

export const useGetSysCom = (type: any) => {
    let renderType = type;
    if (typeof type === 'string') {
        renderType = antd[type] ? antd[type] : resolveComponent(type);
    }
    return renderType;
};
export const renderTitle = (title: any) => {
    return typeof title === 'function' ? title() : title;
};
