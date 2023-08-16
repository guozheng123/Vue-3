import http from '@/utils/http';
import type { ResTpfObject, ResTpfValue } from '@/types/axios';
import { useNetworkApi, proxyEnum } from '@/api';
import { RootObject } from './index.d';

// 工段管理
export const useWorkshopApi = () => {
    const tmgc2Process = useNetworkApi(proxyEnum.tmgc2Process);
    return {
        /**
         * 新增工序列表
         * @returns
         */
        addWorkshopSection: (params?: Partial<RootObject>) => {
            return http.post<ResTpfValue>(
                `${tmgc2Process}/workshopSection/addWorkshopSection`,
                params
            );
        },
        /**
         *校验是否通过true唯一的，校验通过，false 不唯一，校验不通过
         * @returns
         */
        WorkshopSectionIdCode: (params: { workshopSectionCode: string }) => {
            return http.get<ResTpfValue<boolean>>(
                `${tmgc2Process}/workshopSection/checkWorkshopSectionCode`,
                {
                    params
                }
            );
        },
        /**
         * 编辑工段管理界面
         * @returns
         */
        editWorkshopSection: (params?: Partial<RootObject>) => {
            return http.put(`${tmgc2Process}/workshopSection/editWorkshopSection`, {
                ...params
            });
        },
        /**
         * 查询单条数据/回显数据
         * @returns
         */
        getWorkshopSectionById: (params: { WorkshopSectionId: string }) => {
            return http.get<ResTpfObject<RootObject>>(
                `${tmgc2Process}/workshopSection/getWorkshopSectionById`,
                {
                    params
                }
            );
        },
        /**
         * 批量删除数据
         * @returns
         */
        deleteWorkshopSectionByIds: (params: { ids: any[] }) => {
            return http.post(`${tmgc2Process}/workshopSection/deleteWorkshopSectionByIds`, params);
        }
    };
};
