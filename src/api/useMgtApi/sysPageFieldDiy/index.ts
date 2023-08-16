import type { ResTpfList, ResTpfObject } from '@/types/axios';
import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';
export interface ResGetDiyFieldType {
    tenantId: number;
    componentCode: string;
    componentType: string;
    componentMode: string;
    componentBindvalue: string;
    componentFormat?: string;
    componentOptions?: string;
    componentInterfaceAddress?: any;
    componentInterfaceParameter: string;
    componentFieldNames?: any;
    remark: string;
    createUser: string;
    createDatetime: string;
}

export interface ReqCreateDiyField {
    sysPageFieldDiyId: string; //页面自定义字段id
    entityCode: string; //实体编号
    fieldCode: string; //字段Code
    fieldName: string; //字段名
    fieldType: string; //字段类型：文本、多行文本、数字、日期（年月日）、时间（年月日时分秒）、下拉单选、下拉复选字段类型：文本、多行文本、数字、日期（年月日）、时间（年月日时分秒）、下拉单选、下拉复选
    required: number; //是否必填
    search: number;
    accuracy: number; //精度
    dictType: string; //数据字典类型
    showDefaultValue: string; //默认值
    displayOrdinal: number; //显示顺序
    enable: string; //是否启用（0不启用 1启用）
    description: string; //提示说明
    componentCode: string; //组件编号(待定字段)
    deleted: string; //是否删除（0未删除 1已删除）
    systemFlag: string; //是否系统内置（0否 1是）内置不允许删除
    selections: { value?: string; label?: string }[] | null;
}
export interface ReqDiyPageQuery {
    sortByAsc: boolean;
    sortedField: string;
    pageSize: number;
    page: number;
    entityCode: string; //实体编号
    fieldName: string; //字段名
    enable: number; //是否启用（0不启用 1启用）
    createUser: string; //创建人
    createDatetime: string; //创建时间
}
export interface ResDiyPageQuery {
    sysPageFieldDiyId: number;
    tenantId: number;
    entityCode: string;
    fieldCode: string;
    fieldName: string;
    fieldType: string;
    required: string;
    search: string;
    precision?: any;
    dictType: string;
    showDefaultValue?: any;
    displayOrdinal: number;
    enable: string;
    description: string;
    componentCode?: any;
    deleted: string;
    systemFlag: string;
    createUser: string;
    createDatetime: string;
    modifyUser?: any;
    modifyDatetime?: any;
    selections?: any;
}

interface ResGetSysPageFieldDiyById {
    sysPageFieldDiyId: number;
    tenantId: number;
    entityCode: string;
    fieldCode: string;
    fieldName: string;
    fieldType: string;
    required: string;
    search: string;
    precision: any;
    dictType: string;
    showDefaultValue: any;
    displayOrdinal: number;
    enable: string;
    description: string;
    componentCode: any;
    deleted: string;
    systemFlag: string;
    createUser: number;
    createDatetime: string;
    modifyUser: any;
    modifyDatetime: string;
    selections: any;
}

type ReqUpdateDiyField = ReqCreateDiyField;

export interface ResQueryPageFieldDiyListForInsertOrUpdate {
    showDefaultValue: string;
    description: string;
    required: string;
    field: string;
    label: string;
    displayOrdinal: number;
    visible: boolean;
    allowClear: boolean;
    type: string;
    mode: string;
    bindValue: string;
    format: string;
    options: string;
    address: string;
    parameter: any;
    fieldNames: string;
    precision: number;
    rows: number;
    showTime: boolean;
    child: any[];
}

//自定义配置
export const useSysPageFieldDiyApi = () => {
    const tmgc2Mgt = useNetworkApi(proxyEnum.tmgc2Mgt);

    return {
        /**
         *
         * @returns 获取自定义列类型
         */
        getDiyFieldType: () => {
            return http.get<ResTpfList<ResGetDiyFieldType[]>>(
                `${tmgc2Mgt}/sysPageFieldDiy/getDiyFieldType`
            );
        },
        /**
         *
         * @returns 新建自定义列
         */
        create: (data?: Partial<ReqCreateDiyField>) => {
            return http.post(`${tmgc2Mgt}/sysPageFieldDiy/create`, data);
        },
        /**
         *
         * @returns 查询
         */
        pageQuery: (data?: Partial<ReqDiyPageQuery>) => {
            return http.post<ResTpfObject<{ list: ResDiyPageQuery[] }>>(
                `${tmgc2Mgt}/sysPageFieldDiy/pageQuery`,
                data
            );
        },
        /**
         *
         * @returns 通过主键查询单条数据
         */
        getSysPageFieldDiyById: (params: { sysPageFieldDiyId: string }) => {
            return http.get<ResTpfObject<ResGetSysPageFieldDiyById>>(
                `${tmgc2Mgt}/sysPageFieldDiy/getSysPageFieldDiyById`,
                { params }
            );
        },
        /**
         *
         * @returns 更新自定义字段
         */
        update: (data?: Partial<ReqUpdateDiyField>) => {
            return http.post<ResTpfObject<ResGetSysPageFieldDiyById>>(
                `${tmgc2Mgt}/sysPageFieldDiy/update`,
                data
            );
        },
        /**
         *
         * @returns 更新自定义字段
         */
        delete: (params: { sysPageFieldDiyId: string }) => {
            return http.delete(`${tmgc2Mgt}/sysPageFieldDiy/delete`, { params });
        },

        /**
         *
         * @returns 查询多条数据用于新增和更新的表单
         */
        queryPageFieldDiyListForInsertOrUpdate: (params: { entityCode: string }) => {
            return http.get<ResTpfList<ResQueryPageFieldDiyListForInsertOrUpdate[]>>(
                `${tmgc2Mgt}/sysPageFieldDiy/queryPageFieldDiyListForInsertOrUpdate`,
                {
                    params
                }
            );
        },

        /**
         *
         * @returns 查询物料分类
         */
        getSysDictType: (params: { dictType: string }) => {
            return http.get<any>(`${tmgc2Mgt}/sysDictType/getSysDictType`, {
                params
            });
        }
    };
};
