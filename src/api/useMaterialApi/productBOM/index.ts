//

import http from '@/utils/http';
import type { ResTpfObject, ResTpfValue } from '@/types/axios';
import { useNetworkApi, proxyEnum } from '@/api';

export interface queryProductBomMaterialByPageType {
    filterMaterialCodes?: string[]; //需要过滤的物料codes
    materialCode?: string; //物料编号
    materialMold?: string; //物料类型
    materialName?: string;
    page?: number;
    pageSize?: number;
    sortByAsc?: boolean;
    sortedField?: string;
}

export interface AddProductBomVo {
    bomTree?: BomTreeVo;
    childMaterials?: ChildMaterialVo[]; //子级物料
    parentMaterial?: ParentMaterialVo; //父级物料
    updateParentMaterialVoList?: ChildMaterialVo[]; //更新的物流
}

/**
 * bom tree
 */
export interface BomTreeVo {
    branchTree?: BomTreeVo[];
    fatherCode?: string;
    fatherId?: number;
    fatherName?: string;
    rootCode?: string;
    rootId?: number; //节点id
    rootName?: string; //节点名称
    rootNum?: number;
}
/**
 * 子集物料
 */
export interface ChildMaterialVo {
    bomId?: number; //bom id
    /**
     * bom 版本
     */
    bomVersion?: string;
    /**
     * 图号
     */
    figureNum?: string;
    id?: number;
    /**
     * 物料编号
     */
    materialCode?: string;
    /**
     * 物料类型
     */
    materialMold?: string;
    /**
     * 物料名称
     */
    materialName?: string;
    /**
     * 物料规格
     */
    materialSpec?: string;
    /**
     * 物料分类编号
     */
    materialTypeCode?: string;
    /**
     * 物料基本单位
     */
    materialUnitCode?: string;
    /**
     * 用量
     */
    num?: number;
    /**
     * 备注
     */
    remark?: string;
    /**
     * 损耗率
     */
    wasteRate?: number;
}

/**
 * 父级物料
 */
export interface ParentMaterialVo {
    /**
     * bom id
     */
    bomId?: number;
    /**
     * bom 版本
     */
    bomVersion?: string;
    /**
     * 物料编号
     */
    materialCode?: string;
    /**
     * 物料类型
     */
    materialMold?: string;
    /**
     * 物料名称
     */
    materialName?: string;
    /**
     * 物料规格
     */
    materialSpec?: string;
    /**
     * 物料分类编号
     */
    materialTypeCode?: string;
    /**
     * 物料基本单位
     */
    materialUnitCode?: string;
    /**
     * 用量
     */
    num?: number;
    /**
     * 是否发布 0否 1是
     */
    releaseFlag?: string;
    /**
     * 备注
     */
    remark?: string;
}

export const useMaterialProductBOMApi = () => {
    const tmgc2Material = useNetworkApi(proxyEnum.tmgc2Material);

    return {
        /**
         * 新增bom
         * @param params
         * @returns
         */
        add: (params: AddProductBomVo) => {
            return http.post<ResTpfValue>(`${tmgc2Material}/productBom/add`, params);
        },
        /**
         * 编辑bom
         * @param params
         * @returns
         */
        editProductBom: (params: AddProductBomVo) => {
            return http.post<ResTpfValue>(`${tmgc2Material}/productBom/editProductBom`, params);
        },
        /**
         * 复制bom
         * @param params
         * @returns
         */
        copyProductBom: (params: AddProductBomVo) => {
            return http.post<ResTpfValue>(`${tmgc2Material}/productBom/copyProductBom`, params);
        },
        /**
         * 升版bom
         * @param params
         * @returns
         */
        upgradeProductBom: (params: AddProductBomVo) => {
            return http.post<ResTpfValue>(`${tmgc2Material}/productBom/upgradeProductBom`, params);
        },
        /**
         * 校验数据重复
         * @param params
         * @returns
         */
        checkMaterialCode: (params: { materialCode: string }) => {
            return http.get<ResTpfValue>(`${tmgc2Material}/productBom/checkMaterialCode`, {
                params
            });
        },
        /**
         * 删除产品BOM
         * @param params
         * @returns
         */
        deleteBomByIds: (params: { productBomIds: string[] | any[] }) => {
            return http.post<ResTpfValue<boolean>>(
                `${tmgc2Material}/productBom/deleteBomByIds`,
                params
            );
        },
        /**
         * 发布产品BOM
         * @param params
         * @returns
         */
        releaseBomByIds: (params: { productBomIds: string[] | any[] }) => {
            return http.post<ResTpfValue<boolean>>(
                `${tmgc2Material}/productBom/releaseBomByIds`,
                params
            );
        },
        /**
         * 启用禁用
         * @param params
         * @returns
         */
        productBomIds: (params: { productBomIds: string[] | any[] }) => {
            return http.post<ResTpfValue<boolean>>(
                `${tmgc2Material}/productBom/enableStatusByIds`,
                params
            );
        },
        /**
         * 导入
         * @param params
         * @returns
         */
        importBom: (params: { fileCode: string; overrideFlag?: boolean }) => {
            return http.post(`${tmgc2Material}/productBom/importBom`, params);
        },
        /**
         * 导出
         * @param params
         * @returns
         */
        exportBom: (params: any) => {
            return http.post(`${tmgc2Material}/productBom/exportBom`, params);
        },
        /**
         * BOM详情
         * @param params
         * @returns
         */
        getByBomId: (params: { bomId: string; typeEnums?: string }) => {
            return http.get<ResTpfObject<AddProductBomVo>>(
                `${tmgc2Material}/productBom/getByBomId`,
                {
                    params
                }
            );
        },

        /**
         * 更新详情
         * @param params
         * @returns
         */
        updateDetail: (params: { bomId: string }) => {
            return http.get<ResTpfObject<AddProductBomVo>>(
                `${tmgc2Material}/productBom/updateDetail`,
                {
                    params
                }
            );
        },
        /**
         * 更新产品BOM
         * @param params
         * @returns
         */
        updateProductBom: (params: AddProductBomVo) => {
            return http.post<ResTpfValue<boolean>>(
                `${tmgc2Material}/productBom/updateProductBom`,
                params
            );
        },
        /**
         * BOM树
         * @param params
         * @returns
         */
        getBomTree: (params: { materialCode: string; bomVersion?: string }) => {
            return http.get<ResTpfObject<AddProductBomVo>>(
                `${tmgc2Material}/productBom/getBomTree`,
                {
                    params
                }
            );
        }
    };
};
