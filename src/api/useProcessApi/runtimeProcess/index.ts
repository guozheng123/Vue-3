import { useNetworkApi, proxyEnum } from '@/api';
import { ResTpfObject } from '@/types/axios';
import http from '@/utils/http';

export interface ResGetRuntimeProcessAndOperationsById {
    runtimeProcessId: number;
    runtimeProcessCode: string;
    runtimeProcessName: string;
    processVersion: number;
    companyCode: any;
    factoryCode: string;
    releaseFlag: string;
    defaultFlag: any;
    createUser: string;
    createDatetime: string;
    modifyUser: string;
    modifyDatetime: string;
    versions: any;
    operationInfos: OperationInfo[];
}

interface OperationInfo {
    id: number;
    tenantId: number;
    factoryCode: string;
    operationCode: string;
    operationName: string;
    operationTypeCode: string;
    operationTypeName: any;
    remark: string;
    forbidden: string;
    workUnitTypeCode: string;
    standardCapacity: number;
    standardTime: number;
    standardTimeUnit: string;
    minCapacity: any;
    maxCapacity: any;
    auxiliaryTime: any;
    auxiliaryTimeUnit: string;
    pricePerTime: any;
    pricePerTimeUnit: string;
    singlePlanHours: number;
    singlePlanHoursUnit: string;
    pricePerQuantity: any;
    workUnitCode: any;
    workUnitName: any;
    userId: any;
    userName: any;
    deleted: string;
    createUser: string;
    createDatetime: string;
    modifyUser: string;
    modifyDatetime: string;
    version: number;
    rowNum: number;
    plannedStartTime: any;
    plannedEndTime: any;
    operationInspectionList: any;
    operationDefectList: any;
    operationFileList: any;
}

//公司
export const useRuntimeProcessApi = () => {
    const tmgc2Process = useNetworkApi(proxyEnum.tmgc2Process);

    return {
        /**
         * @returns 通过id查询运行时工艺及工序详情
         */
        getRuntimeProcessAndOperationsById: (params: { id: string }) => {
            return http.get<ResTpfObject<ResGetRuntimeProcessAndOperationsById>>(
                `${tmgc2Process}/runtimeProcess/getRuntimeProcessAndOperationsById`,
                {
                    params
                }
            );
        }
    };
};
