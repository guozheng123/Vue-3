export * from './index.d';

import { ResTpfObject, ResTpfValue } from '@/types/axios';
import http from '@/utils/http';

import { ResGetMaterialPreparationById, ReqEditMaterialPreparation } from './index.d';
import { proxyEnum, useNetworkApi } from '@/api/useNetworkApi';

//班组
export const useMaterialPreparationApi = () => {
    const tmgc2Production = useNetworkApi(proxyEnum.tmgc2Production);

    return {
        /**
         * @returns 获取单条信息
         */
        getMaterialPreparationById: (params: { materialPreparationId: number | string }) => {
            return http.get<ResTpfObject<ResGetMaterialPreparationById>>(
                `${tmgc2Production}/materialPreparation/getMaterialPreparationById`,
                { params }
            );
        },
        /**
         * @returns 编辑
         */
        editMaterialPreparation: (params: Partial<ReqEditMaterialPreparation>) => {
            return http.put<ResTpfValue>(
                `${tmgc2Production}/materialPreparation/editMaterialPreparation`,
                params
            );
        },
        /**
         * @returns 生成领料单
         */
        createMaterialRequisitionByMaterialPre: (params: Partial<ReqEditMaterialPreparation>) => {
            return http.post<ResTpfValue>(
                `${tmgc2Production}/materialPreparation/createMaterialRequisitionByMaterialPre`,
                params
            );
        }
    };
};
