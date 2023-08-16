// import { ResTpfList, ResTpfObject, ResTpfValue } from '@/types/axios';
import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';

export const usePostApi = () => {
    const tmgc2Org = useNetworkApi(proxyEnum.tmgc2Org);
    return {
        /**
         * @returns 岗位查询列表
         */
        getPostList: (params: any) => {
            return http.post(`${tmgc2Org}/post/getPostList`, params);
        },
        /**
         * @returns 导出岗位列表
         */
        postListDerive: (params: any) => {
            return http.post(`${tmgc2Org}/post/postListDerive`, params);
        },
        /**
         * @returns 编辑岗位列表
         */
        updatePost: (params: any) => {
            return http.put(`${tmgc2Org}/post/updatePost`, params);
        },
        /**
         * @returns 删除岗位列表
         */
        deletePost: (params: any) => {
            return http.post(`${tmgc2Org}/post/deletePost`, params);
        },
        /**
         * @returns 新增岗位列表
         */
        createPost: (params: any) => {
            return http.post(`${tmgc2Org}/post/createPost`, params);
        },
        /**
         * @returns 获取岗位信息详情重复
         */
        getPostDetails: (params: any) => {
            return http.get(`${tmgc2Org}/post/getPostDetails`, params);
        },
        /**
         * @returns 检查岗位名称是否重复
         */
        checkPostNameUnique: (params: any) => {
            return http.post(`${tmgc2Org}/post/checkPostNameUnique`, params);
        },
        /**
         * @returns 检查编码名称是否重复
         */
        checkPostCodeUnique: (params: any) => {
            return http.post(`${tmgc2Org}/post/checkPostCodeUnique`, params);
        }
    };
};
