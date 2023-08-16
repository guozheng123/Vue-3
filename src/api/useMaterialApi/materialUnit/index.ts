import { ResTpfList } from '@/types/axios';
import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';
export * from './index.d';
import {
    ReqEditMaterialUnit,
    ReqAddMaterialUnit,
    ReqGetMaterialUnitByTenantId,
    ReqQueryMaterialUnitListByPage
} from './index.d';

export const useMaterialUnitApi = () => {
    const tmgc2Material = useNetworkApi(proxyEnum.tmgc2Material);

    return {
        /**
         * @returns 检验名称是否重复-编辑
         */
        checkMaterialUnitEditName: (params: {
            materialUnitId: string;
            materialUnitName: string;
        }) => {
            return http.get(`${tmgc2Material}/materialUnit/checkMaterialUnitEditName`, { params });
        },
        /**
         * @returns 检验编号重复
         */
        checkMaterialUnitCode: (params: { materialUnitCode: string }) => {
            return http.get(`${tmgc2Material}/materialUnit/checkMaterialUnitCode`, { params });
        },
        /**
         * @returns 检验名称重复
         */
        checkMaterialUnitName: (params: { materialUnitName: string }) => {
            return http.get(`${tmgc2Material}/materialUnit/checkMaterialUnitName`, { params });
        },
        /**
         * @returns 删除数据
         */
        deleteMaterialUnitByIds: (params: { ids: number[] }) => {
            return http.post<ResTpfList<Record<string, any>[]>>(
                `${tmgc2Material}/materialUnit/deleteMaterialUnitByIds`,
                params
            );
        },
        /**
         * @returns 编辑数据
         */
        editMaterialUnit: (params: Partial<ReqEditMaterialUnit>) => {
            return http.put(`${tmgc2Material}/materialUnit/editMaterialUnit`, params);
        },
        /**
         * @returns 新增数据
         */
        addMaterialUnit: (params: Partial<ReqAddMaterialUnit>) => {
            return http.post(`${tmgc2Material}/materialUnit/addMaterialUnit`, params);
        },
        /**
         * @returns 下拉查询单位
         */
        getMaterialUnitByTenantId: (params: Partial<ReqGetMaterialUnitByTenantId>) => {
            return http.post(`${tmgc2Material}/materialUnit/getMaterialUnitByTenantId`, params);
        },
        /**
         * @returns 列表查询
         */
        queryMaterialUnitListByPage: (params: Partial<ReqQueryMaterialUnitListByPage>) => {
            return http.post(`${tmgc2Material}/materialUnit/queryMaterialUnitListByPage`, params);
        },
        /**
         * @returns 查询物料生产单位列表数据
         */
        getMaterialProductUnitList: (params: { materialCode: string }) => {
            return http.get(`${tmgc2Material}/material/getMaterialProductUnitList`, { params });
        }
    };
};
