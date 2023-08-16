import { ResTpfObject, ResTpfValue } from '@/types/axios';
import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';
import {
    ReqQueryPopCustomerSupplierListByPageList,
    QueryPopCustomerSupplierListByPageList
} from './index.d';
export type IReqGetCustomerSupplierList = {
    customerSupplierCode: string;
    customerSupplierName: string;
    customerSupplierShortName: string;
    customerSupplierType: string;
    deliveryType: string;
    forbidden: string;
    pageSize: number;
    page: number;
    contacts: string;
    telephone: string;
    province: string;
    address: string;
    createUser: string;
    createDatetime: Array<any>;
    createDatetimeStart: string;
    createDatetimeEnd: string;
    modifyUser: string;
    modifyDatetime: Array<any>;
    modifyDatetimeStart: string;
    modifyDatetimeEnd: string;
};

//班组
export const useCustomerSupplierAPi = () => {
    const networkApi = useNetworkApi(proxyEnum.tmgc2Production);

    return {
        /**
         * @returns 获取列表
         */
        queryCustomerSupplierListByPage: (params: Partial<IReqGetCustomerSupplierList>) => {
            return http.post<ResTpfObject<{ list: IReqGetCustomerSupplierList[] }>>(
                `${networkApi}/customerSupplier/queryCustomerSupplierListByPage`,
                params
            );
        },
        /**
         * @returns 编辑
         */
        editCustomerSupplier: (entity: IReqGetCustomerSupplierList) => {
            return http.put(`${networkApi}/customerSupplier/editCustomerSupplier`, entity);
        },
        /**
         * @returns 新增
         */
        addCustomerSupplier: (entity: IReqGetCustomerSupplierList) => {
            return http.post(`${networkApi}/customerSupplier/addCustomerSupplier`, entity);
        },
        /**
         * @returns 检查code是否重复
         */
        checkCustomerSupplierCode: (entity: any) => {
            return http.get(`${networkApi}/customerSupplier/checkCustomerSupplierCode`, {
                params: entity
            });
        },
        /**
         * @returns 删除
         */
        deleteCustomerSupplierByIds: (entity: Array<number>) => {
            return http.post(`${networkApi}/customerSupplier/deleteCustomerSupplierByIds`, {
                ids: entity
            });
        },
        /**
         * @returns 导入
         */
        importCustomerSupplier: (params: { overrideFlag: boolean; fileCode: string }) => {
            return http.get<ResTpfValue>(`${networkApi}/customerSupplier/importCustomerSupplier`, {
                params: params
            });
        },
        /**
         * @returns 查询单条数据
         */
        getCustomerSupplierById: (params: { customerSupplierId: string }) => {
            return http.get<ResTpfObject<{ list: IReqGetCustomerSupplierList[] }>>(
                `${networkApi}/customerSupplier/getCustomerSupplierById`,
                { params: params }
            );
        },
        /**
         * @returns 查询供应商
         */
        queryPopCustomerSupplierListByPage: (params: ReqQueryPopCustomerSupplierListByPageList) => {
            return http.post<ResTpfObject<{ list: QueryPopCustomerSupplierListByPageList[] }>>(
                `${networkApi}/customerSupplier/queryPopCustomerSupplierListByPage`,
                params
            );
        }
    };
};
