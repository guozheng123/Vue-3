import { tableResizable } from '@/config';
import { TpfColumnType } from '@/types';

/**
 *
 * @returns 系统设置-用户管理-岗位
 */
export const getSystemManageUserManagementStation = () => {
    const columns = [
        { title: '岗位编号', dataIndex: 'postCode', ...tableResizable() },
        { title: '岗位名称', dataIndex: 'postName', ...tableResizable() },
        { title: '岗位描述', dataIndex: 'postText', ...tableResizable() },
        { title: '是否启用', dataIndex: 'lockFlag', ...tableResizable() },
        { title: '创建人', dataIndex: 'createUser', ...tableResizable() },
        { title: '创建日期', dataIndex: 'createDateTime', ...tableResizable() },
        { title: '修改人', dataIndex: 'modifyUser', ...tableResizable() },
        { title: '修改日期', dataIndex: 'modifyDateTime', ...tableResizable() }
    ] as TpfColumnType[];
    return columns;
};
