import { useNetworkApi, proxyEnum } from '@/api';
import { ResTpfValue, ResTpfObject } from '@/types/axios';
import http from '@/utils/http';
import { ReqAddGuidebook } from './index.d';

export * from './index.d';

//公司
export const useGuidebookApi = () => {
    const tmgc2Process = useNetworkApi(proxyEnum.tmgc2Process);

    return {
        /**
         * @returns 新增数据
         */
        addGuidebook: (params: Partial<ReqAddGuidebook>) => {
            return http.post(`${tmgc2Process}/guidebook/addGuidebook`, params);
        },
        /**
         * @returns 编辑数据
         */
        editGuidebook: (params: Partial<ReqAddGuidebook>) => {
            return http.post(`${tmgc2Process}/guidebook/editGuidebook`, params);
        },
        /**
         * @returns 通过主键查询单条数据
         */
        getGuidebookById: (params: { guidebookId: string; type?: string }) => {
            return http.get<ResTpfObject<ReqAddGuidebook>>(
                `${tmgc2Process}/guidebook/getGuidebookById`,
                { params }
            );
        },
        /**
         * @returns 校验是否通过 ture 唯一的，校验通过，false 不唯一，校验不通过
         */
        checkGuidebookCode: (params: { guidebookCode: string }) => {
            return http.get<ResTpfValue<boolean>>(`${tmgc2Process}/guidebook/checkGuidebookCode`, {
                params
            });
        },
        /**
         * @returns 通过主键删除数据
         */
        deleteGuidebookByIds: (params: { guidebookIds: any[] }) => {
            return http.post<ResTpfValue<boolean>>(
                `${tmgc2Process}/guidebook/deleteGuidebookByIds`,
                params
            );
        },
        /**
         * @returns 通过主键发布ESOP
         */
        releaseGuidebookByIds: (params: { guidebookIds: any[] }) => {
            return http.post<ResTpfValue<boolean>>(
                `${tmgc2Process}/guidebook/releaseGuidebookByIds`,
                params
            );
        },
        /**
         * @returns 通过主键设置默认ESOP
         */
        defaultGuidebookByIds: (params: { guidebookIds: any[] }) => {
            return http.post<ResTpfValue<boolean>>(
                `${tmgc2Process}/guidebook/defaultGuidebookByIds`,
                params
            );
        },
        /**
         * @returns 通过主键启用禁用ESOP
         */
        enableGuidebookByIds: (params: { guidebookIds: any[] }) => {
            return http.post<ResTpfValue<boolean>>(
                `${tmgc2Process}/guidebook/enableGuidebookByIds`,
                params
            );
        },
        /**
         * @returns 传入导入的文件Code导入数据
         */
        importGuidebook: (params: { fileCode: string; overrideFlag: boolean }) => {
            return http.post<ResTpfValue<boolean>>(
                `${tmgc2Process}/guidebook/importGuidebook`,
                params
            );
        },
        /**
         * @returns 导出
         */
        exportGuideBook: (params: any) => {
            return http.post<ResTpfValue<string>>(
                `${tmgc2Process}/guidebook/exportGuideBook`,
                params
            );
        }
    };
};
