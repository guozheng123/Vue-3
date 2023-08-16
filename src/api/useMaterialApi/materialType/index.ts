import { ResTpfList } from '@/types/axios';
import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';

export * from './index.d';
import { IReqGetTreeList, ReqEditMaterialType, ResGetMaterialTypeTree } from './index.d';

//物料数据
export const useMaterialTypeApi = () => {
    const tmgc2Material = useNetworkApi(proxyEnum.tmgc2Material);

    return {
        /**
         * @returns 查询树结构列表
         */
        getMaterialTypeTree: () => {
            return http.get<ResTpfList<ResGetMaterialTypeTree[]>>(
                `${tmgc2Material}/materialType/getMaterialTypeTree`
            );
        },
        /**
         * @returns 新增树结构
         */
        addMaterialType: (data: IReqGetTreeList) => {
            return http.post(`${tmgc2Material}/materialType/addMaterialType`, data);
        },
        /**
         * @returns 编辑树结构
         */
        editMaterialType: (data: Partial<ReqEditMaterialType>) => {
            return http.put(`${tmgc2Material}/materialType/editMaterialType`, data);
        },
        /**
         * @returns 删除树结构
         */
        deleteMaterialTypeByCode: (params: { code: string }) => {
            return http.delete(`${tmgc2Material}/materialType/deleteMaterialTypeByCode`, {
                params
            });
        }
    };
};
