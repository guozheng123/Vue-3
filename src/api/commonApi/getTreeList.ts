import {
    useWorkshopAPi,
    useMenuApi,
    useDepartmentApi,
    useMaterialTypeApi,
    useCompanyAPi,
    useWorkingTeamAPi,
    useFactoryAPi
} from '@/api';
import type {
    IResGetFactoryWorkshopTreeList,
    ResGetMaterialTypeTree,
    IResGetCompanyFactoryTreeList,
    IResGetWorkshopWorkingTeamTreeList,
    IResFactoryTreeList
} from '@/api';

import { ref } from 'vue';

/**
 *
 * @returns  获取工厂-车间树型列表
 */
export const getFactoryWorkshopTreeList = () => {
    const workshopAPi = useWorkshopAPi();
    const treeLoading = ref(false);

    const treeData = ref<IResGetFactoryWorkshopTreeList[]>([]);
    const fetchApi = () => {
        treeLoading.value = true;
        workshopAPi
            .getFactoryWorkshopTreeList()
            .then(res => {
                treeData.value = res.data.list;
            })
            .finally(() => {
                treeLoading.value = false;
            });
    };
    fetchApi();
    return {
        treeData,
        fetchApi,
        treeLoading
    };
};

/**
 *
 * @returns 获取菜单树结构
 */
export const queryMenuTreeSelect = () => {
    const menuApi = useMenuApi();

    const treeLoading = ref(false);

    const treeData = ref<any[]>([]);
    const fetchApi = () => {
        treeLoading.value = true;
        return new Promise(res => {
            menuApi
                .queryMenuTreeSelect()
                .then(res => {
                    treeData.value = res.data.list;
                })
                .finally(() => {
                    treeLoading.value = false;
                    res({});
                });
        });
    };
    fetchApi();
    return {
        treeData,
        fetchApi,
        treeLoading
    };
};
/**
 *
 * @returns 查询树结构列表
 */
export const getMaterialTypeTree = () => {
    const materialTypeApi = useMaterialTypeApi();

    const treeLoading = ref(false);

    const treeData = ref<ResGetMaterialTypeTree[]>([]);
    const fetchApi = () => {
        treeLoading.value = true;
        materialTypeApi
            .getMaterialTypeTree()
            .then(res => {
                treeData.value = res.data.list;
            })
            .finally(() => {
                treeLoading.value = false;
            });
    };
    fetchApi();
    return {
        treeData,
        fetchApi,
        treeLoading
    };
};

/**
 *
 * @returns 查询树结构列表
 */
export const getDepartmentTreeList = () => {
    const departmentApi = useDepartmentApi();

    const treeLoading = ref(false);

    const treeData = ref<any[]>([]);
    const fetchApi = () => {
        treeLoading.value = true;
        departmentApi
            .getDepartmentTreeList()
            .then(res => {
                treeData.value = res.data.list;
            })
            .finally(() => {
                treeLoading.value = false;
            });
    };
    fetchApi();
    const ops = {
        allowClear: true,
        dropdownStyle: { maxHeight: '400px', overflow: 'auto' },
        fieldNames: { children: 'branchTree', label: 'rootName', value: 'rootId' },
        dropdownMatchSelectWidth: false
    };
    return {
        treeData,
        fetchApi,
        treeLoading,
        ops
    };
};
/**
 *
 * @returns 获取集团-公司树型结构
 */
export const getGroupCompanyTreeList = () => {
    const companyAPi = useCompanyAPi();

    const treeLoading = ref(false);

    const treeData = ref<IResGetCompanyFactoryTreeList[]>([]);
    const fetchApi = () => {
        treeLoading.value = true;
        companyAPi
            .getGroupCompanyTreeList()
            .then(res => {
                treeData.value = res.data.list;
            })
            .finally(() => {
                treeLoading.value = false;
            });
    };
    fetchApi();
    return {
        treeData,
        fetchApi,
        treeLoading
    };
};

/**
 *
 * @returns 获取集团-公司树型结构
 */
export const getWorkshopWorkingTeamTreeList = () => {
    const workingTeamAPi = useWorkingTeamAPi();

    const treeLoading = ref(false);

    const treeData = ref<IResGetWorkshopWorkingTeamTreeList[]>([]);
    const fetchApi = () => {
        treeLoading.value = true;
        workingTeamAPi
            .getWorkshopWorkingTeamTreeList()
            .then(res => {
                treeData.value = res.data.list;
            })
            .finally(() => {
                treeLoading.value = false;
            });
    };
    fetchApi();
    return {
        treeData,
        fetchApi,
        treeLoading
    };
};

/**
 *
 * @returns 获取公司-工厂树型列表
 */
export const getCompanyFactoryTreeList = () => {
    const factoryAPi = useFactoryAPi();

    const treeLoading = ref(false);

    const treeData = ref<IResFactoryTreeList[]>([]);
    const fetchApi = () => {
        treeLoading.value = true;
        factoryAPi
            .getCompanyFactoryTreeList()
            .then(res => {
                treeData.value = res.data.list;
            })
            .finally(() => {
                treeLoading.value = false;
            });
    };
    fetchApi();
    return {
        treeData,
        fetchApi,
        treeLoading
    };
};

/**
 *
 * @returns 获取角色菜单树结构
 */
export const queryMenuTreeSelectByCondition = (roleId: string) => {
    const menuApi = useMenuApi();

    const treeLoading = ref(false);

    const treeData = ref<any[]>([]);
    const fetchApi = () => {
        treeLoading.value = true;
        menuApi
            .queryMenuTreeSelectByCondition({ roleId: roleId })
            .then(res => {
                treeData.value = res.data.list;
            })
            .finally(() => {
                treeLoading.value = false;
            });
    };
    fetchApi();
    return {
        treeData,
        fetchApi,
        treeLoading
    };
};
