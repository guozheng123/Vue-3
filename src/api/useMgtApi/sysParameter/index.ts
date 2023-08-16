import type { ResTpfList, ResTpfObject, ResTpfValue } from '@/types/axios';
import http from '@/utils/http';
import { useNetworkApi, proxyEnum } from '@/api';

export interface ResSysParameterByTenantId {
    sysParameterId: number;
    tenantId: number;
    sysParameterFolderId: number;
    parameterCode: string;
    parameterName: string;
    parameterDescription: string;
    displayOrdinal: number;
    valueTypeEcode: string;
    defaultValue: string;
    createUser: string;
    createDatetime: string;
    modifyUser: string;
    modifyDatetime: string;
    parameterValues: ParameterValue[];
}

interface ParameterValue {
    sysParameterValueId: number;
    value: string;
    valueText: string;
}
export interface ResGetSysParameterFolderList {
    sysParameterFolderId: number; //配置项目录主键id
    tenantId: number; //租户ID
    folderCode: string; //配置项目录编号
    folderName: string; //配置项目录名称
    displayOrdinal: number; //显示顺序号
    createUser: string; //创建人
    createDatetime: string; //创建时间
    modifyUser: string; //修改人
    modifyDatetime: string; //修改时间
}

export interface ResGetSysParameterListByFolderId {
    sysParameterId: number; //配置项主键id
    tenantId: number; //租户ID
    sysParameterFolderId: number; //配置项目录表ID
    parameterCode: string; //配置项编号
    parameterName: string; //配置项名称
    parameterDescription: string; //配置项说明
    displayOrdinal: number; //显示顺序号
    valueTypeEcode: string; //参数值类型（1：boolean，2：字符串，3：静态枚举）
    defaultValue: string; //默认值
    createUser: string; //创建人
    createDatetime: string; //创建时间
    modifyUser: string; //修改人
    modifyDatetime: string; //修改时间
    parameterValues: ParameterValue[]; //配置项枚举表集合
}

interface ParameterValue {
    sysParameterValueId: number; //配置项枚举主键id
    value: string; //枚举值
    valueText: string; //枚举值描述
}

type ReqEditSysParameter = ResGetSysParameterListByFolderId[];

//系统配置
export const useSysParameterApi = () => {
    const networkApi = useNetworkApi(proxyEnum.tmgc2Mgt);

    return {
        /**
         * 查询左侧导航项目录
         * @returns
         */
        getSysParameterFolderList: () => {
            return http.post<ResTpfList<ResGetSysParameterFolderList[]>>(
                `${networkApi}/sysParameter/getSysParameterFolderList`
            );
        },
        /**
         * 查询左侧导航项目录
         * @returns
         */
        getSysParameterListByFolderId: (params: { sysParameterFolderId: number }) => {
            return http.get<ResTpfObject<{ parameterValues: ResGetSysParameterListByFolderId[] }>>(
                `${networkApi}/sysParameter/getSysParameterListByFolderId`,
                {
                    params
                }
            );
        },
        /**
         * 系统配置保存数据
         * @returns
         */
        editSysParameter: (params?: Partial<ReqEditSysParameter>) => {
            return http.put<ResTpfValue<boolean>>(
                `${networkApi}/sysParameter/editSysParameter`,
                params
            );
        },
        /**
         * 系统配置查询全部配置接口
         * @returns
         */
        getSysParameterByTenantId: () => {
            return http.get<ResTpfObject<{ parameterValues: ResSysParameterByTenantId[] }>>(
                `${networkApi}/sysParameter/getSysParameterByTenantId`
            );
        }
    };
};
