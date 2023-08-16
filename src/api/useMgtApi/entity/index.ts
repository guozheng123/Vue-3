import { ResTpfObject } from '@/types/axios';
import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';
export interface ReqEntityQuery {
    currentTenantId: number;
    page: number;
    pageSize: number;
    entityCode: string; //实体编码
    enabled: boolean; //启用标识
    serviceName: string; //服务名
    storageName: string; //存储名
    entityType: string; //实体类型
    needPage: boolean;
}
export interface ResEntityQuery {
    entityId: number; //实体ID
    tenantId: number; //租户ID
    entityCode: string; //实体编码
    entityType: string; //实体类型
    serviceName: string; //服务名
    storageName: string; //存储名
    enabled: boolean; //启用标识
    description: string; //描述
    createUser: number; //创建人
    createDatetime: string; //创建时间
    modifyUser: number; //修改人
    modifyDatetime: string; //修改时间
    deleted: boolean;
    entityProperties: any;
    entityTypeName: string; //实体类型名称
}
//班组
export const useEntityApi = () => {
    const networkApi = useNetworkApi(proxyEnum.tmgc2Mgt);

    return {
        /**
         * @returns 获取列表
         */
        query: (params?: Partial<ReqEntityQuery>) => {
            return http.post<ResTpfObject<{ list: ResEntityQuery[] }>>(
                `${networkApi}/entity/query`,
                params
            );
        },
        /**
         * @returns 增删改
         */
        addOrUpdate: (params: Partial<ReqEntityQuery>) => {
            return http.post<ResTpfObject<{ list: ResEntityQuery[] }>>(
                `${networkApi}/entity/addOrUpdate`,
                params
            );
        }
    };
};
