import { ResTpfObject } from '@/types/axios';
import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';
export interface ReqEntityRelationQuery {
    currentTenantId: number;
    page: number;
    pageSize: number;
    entityRelationId: string; //实体关系ID
    leftEntityCode: string; //左实体编码
    rightEntityCode: string; //右实体编码
    enabled: boolean; //启用标识
    mapType: string; //映射类型
    mapRuleType: string; //映射规则类型
    mapRuleValue: string; //映射规则值
    needPage: boolean;
}

export interface ResEntityRelationQuery {
    entityRelationId: number; //实实体关系ID
    tenantId: number; //租户ID
    leftEntityCode: string; //左实体编码
    rightEntityCode: string; //右实体编码
    mapType: string; //映射类型
    mapRuleType: string; //映射规则类型
    mapRuleValue: string; //映射规则值
    enabled: boolean; //启用
    createUser: number; //创建人
    createDatetime: string; //创建时间
    modifyUser: number; //修改人
    modifyDatetime: string; //修改时间
    deleted: boolean;
    reverse: any;
    leftEntityRelationPropertyList: LeftEntityRelationPropertyList[];
    rightEntityRelationPropertyList: LeftEntityRelationPropertyList[];
    mapTypeName: string;
    mapRuleTypeName: string;
}

interface LeftEntityRelationPropertyList {
    entityRelationPropertyId: number; //实体关系属性ID
    entityRelationId: number; //实体关系ID
    entityCode: string; //实体编号
    ordinal: number; //序号
    entityPropertyCode: string; //实体属性编号
    entityPropertyValue: any; //实体属性值
    entityPropertyName: string; //实体属性名（默认）
    entityPropertyI18nName: any; //实体属性名（国际化）
    displayName: string; //显示名称
}
//班组
export const useEntityRelationApi = () => {
    const networkApi = useNetworkApi(proxyEnum.tmgc2Mgt);

    return {
        /**
         * @returns 获取列表
         */
        query: (params?: Partial<ReqEntityRelationQuery>) => {
            return http.post<ResTpfObject<{ list: ResEntityRelationQuery[] }>>(
                `${networkApi}/entityRelation/query`,
                params
            );
        },
        /**
         * @returns 增删改
         */
        addOrUpdate: (params: Partial<ReqEntityRelationQuery>) => {
            return http.post<ResTpfObject<{ list: ResEntityRelationQuery[] }>>(
                `${networkApi}/entityRelation/addOrUpdate`,
                params
            );
        }
    };
};
