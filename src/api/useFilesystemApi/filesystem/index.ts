import http from '@/utils/http';
import { saveAs } from 'file-saver';
import { ResTpfObject, ResTpfValue, TpfAxiosRes } from '@/types/axios';
import { useNetworkApi, proxyEnum } from '@/api';
import { AxiosResponse } from 'axios';
import { UploadFile } from 'ant-design-vue';
import type { ExportTableHeaderConfig, TpfUploadFile } from '@/types';
import { PageCodeEnum } from '@/config';
import { useStore } from '@/store';

export const useFilesystemApi = () => {
    const tmgc2Filesystem = useNetworkApi(proxyEnum.tmgc2Filesystem);

    /* 下载文件 */
    const downloadFileObjectApi = async (params: { fileCode: string }) => {
        const response = (await http.get(`${tmgc2Filesystem}/fileObject/downloadFileObject`, {
            params,
            responseType: 'blob'
        })) as unknown as AxiosResponse<any>;

        const fileName = window.decodeURI(response.headers['filename']);
        saveAs(new Blob([response.data], { type: 'application/vnd.ms-excel;' }), fileName);
    };

    return {
        /**
         *
         * @param api 获取下载文件code的接口
         */
        exportFileList: async (
            api: ({
                tableHeaderConfig
            }: {
                tableHeaderConfig: ExportTableHeaderConfig;
            }) => Promise<TpfAxiosRes<ResTpfValue>>,
            pageCode?: PageCodeEnum
        ) => {
            let tableHeaderConfig = [] as ExportTableHeaderConfig;
            if (pageCode) {
                const { cacheSearchStore } = useStore();
                tableHeaderConfig = cacheSearchStore.getUploadLoadSortColumns(pageCode);
            }
            const res = await api({ tableHeaderConfig });
            await downloadFileObjectApi({ fileCode: res.data.value });
        },

        /**
         * 上传文件获取 fileCode
         */
        uploadFileObject: (params: { file: File | UploadFile<any>; businessType: string }) => {
            return http.postForm<ResTpfObject<TpfUploadFile>>(
                `${tmgc2Filesystem}/fileObject/uploadFileObject`,
                params
            );
        },
        /**
         * 根据 fileCode下载文件
         */
        downloadFileObject: downloadFileObjectApi,

        /**
         * 下载模版
         */
        downloadTemplateObject: async (params: { fileCode: string }) => {
            const response = (await http.get(
                `${tmgc2Filesystem}/fileObject/downloadTemplateObject`,
                {
                    params,
                    responseType: 'blob'
                }
            )) as unknown as AxiosResponse<any>;

            const fileName = window.decodeURI(response.headers['filename']);
            saveAs(new Blob([response.data], { type: 'application/vnd.ms-excel;' }), fileName);
        },

        /**
         * 展示文件
         * @param params
         * @returns
         */
        getPreviewFileUrl: (params: { fileCode: string }) => {
            return http.get<ResTpfValue>(`${tmgc2Filesystem}/fileObject/getPreviewFileUrl`, {
                params
            });
        }
    };
};
