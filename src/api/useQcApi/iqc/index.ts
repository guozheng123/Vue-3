import http from '@/utils/http';
import { ResTpfObject } from '@/types/axios';
import { useNetworkApi, proxyEnum } from '@/api';

interface getIqcParams {
    inspectOrderId: string;
    materialCode: string;
}

export interface getIqcRes {
    inspectOrderId: string; //检验单据ID
    inspectType: string; //检验类型
    businessCode: string; //到货单号
    projectCode: string; //项目编号
    batchNo: string; //批次号
    materialName: string; //物料名称
    materialCode: string; //物料编码
    productionQuantity: string; //到货数
    inspectionTypeCode: string; //检验类型
    pendingInspectNum: string; //检验数
    qualifiedQuantity: string; //合格数
    unqualifiedQuantity: string; //不合格数
    compromiseQuantity: string; //让步数
    qualifiedRate: string; //合格率
    inspectResult: string; //检验结果
    remark: string; //处理意见
    inspectProjectResultVos: {
        //质检项目
        inspectProjectCode: string; //质检项目编号
        inspectProjectName: string; //质检项目名称
        inspectStandard: string; // 质检标准
        qualityInspectionAttribute: string; //质检属性:1逻辑、2数值、3文本
        upValue: string; //上限
        standardValue: string; //标准值
        downValue: string; //下限
        actualValue: string; //实际值
        unqualifiedQuantity: string; //不合格数
    };
    inspectDefectCauseVos: {
        //缺陷原因
        defectCauseCode: string; //缺陷原因编号
        defectCauseName: string; //缺陷原因
        num: string; //缺陷数量
        remarks: string; //备注
        inspectDefectFileVos: {
            fileCode: string; //文件编号
            fileName: string; //文件名
        };
    };
}

export const useIqcAPi = () => {
    const tmgc2Qc = useNetworkApi(proxyEnum.tmgc2Qc);

    return {
        // 通过检验单查询质检详情
        getInspectDetailById: (params: getIqcParams) => {
            return http.get<ResTpfObject<getIqcRes>>(`${tmgc2Qc}/iqc/getInspectDetailById`, {
                params
            });
        }
    };
};
