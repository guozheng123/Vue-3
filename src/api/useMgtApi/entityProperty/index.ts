import { ResTpfObject } from '@/types/axios';
import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';
export interface ReqEntityPropertyQuery {
    currentTenantId: number;
    page: number;
    pageSize: number;
    entityCode: string; //实体编码
    entityPropertyCode: string; //实体属性编码
    enabled: boolean; //启用标识
    entityPropertyName: string; //实体属性名称
    storageType: string; //存储类型
    valueType: string; //值类型
    valueTypeLength: string; //值类型长度
    valueSourceType: string; //值来源类型
    valueSource: string; //值来源
    storageName: string; //存储名
}
export interface ResEntityPropertyQuery {
    entityPropertyId: number; //实体属性ID
    tenantId: number;
    entityCode: string; //实体编码
    entityPropertyCode: string; //实体编码
    entityPropertyName: string; //实体属性名称（默认名称）
    entityPropertyI18nName: any; //实体属性名称（国际化名称）
    storageType: string; //存储类型
    valueType: string; //值类型
    valueTypeLength: string; //值类型长度
    valueSourceType: string; //值来源类型
    valueSource: string; //值来源
    storageName: string; //存储名
    enabled: boolean; //启用
    description: string; //描述
    createUser: number; //创建人
    createDatetime: string; //创建时间
    modifyUser: number; //修改人
    modifyDatetime: string; //修改时间
    deleted: boolean;
    displayName: string; //显示名称
    storageTypeName: string; //存储类型名
    valueSourceTypeName: string; //值来源类型名
    valueTypeName: string; //值类型名
}
//实体属性
export const useEntityPropertyApi = () => {
    const networkApi = useNetworkApi(proxyEnum.tmgc2Mgt);

    return {
        /**
         * @returns 获取列表
         */
        query: (params: Partial<ReqEntityPropertyQuery>) => {
            return http.post<ResTpfObject<{ list: ResEntityPropertyQuery[] }>>(
                `${networkApi}/entityProperty/query`,
                params
            );
        },
        /**
         * @returns 增删改
         */
        addOrUpdate: (params: Partial<ReqEntityPropertyQuery>) => {
            return http.post<ResTpfObject<{ list: ResEntityPropertyQuery[] }>>(
                `${networkApi}/entityProperty/addOrUpdate`,
                params
            );
        }
    };
};
