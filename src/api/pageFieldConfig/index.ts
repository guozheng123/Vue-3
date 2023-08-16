export * from './useHandleFormOps';

import { useNetworkApi, proxyEnum } from '@/api';
import { PageCodeEnum } from '@/config';
import { useRef } from '@/hooks';
import { TpfColumnType } from '@/types';
import { ResTpfObject, ResTpfList } from '@/types/axios';
import http from '@/utils/http';
import { watch, unref, ref } from 'vue';
import { SizeType } from 'ant-design-vue/lib/config-provider';
import { cloneDeep, debounce, isArray } from 'lodash-es';
import { useStore } from '@/store/index';
import { useHandleFormOps } from './useHandleFormOps';
// import { isDev } from '@/utils';

const networkApi = useNetworkApi(proxyEnum.tmgc2Mgt);

type PageJsonList = { displayOrdinal: number; fieldCode: string; showName: string };

export const usePageFieldConfigApi = () => {
    return {
        /**
         * 获取页面字段配置详细信息
         * @param pageCode
         * @returns
         */
        getInfo: (pageCode?: PageCodeEnum) => {
            return http.get<ResTpfObject<{ pageCode: PageCodeEnum; pageJson: string }>>(
                `${networkApi}/pageTableConfig/getInfo`,
                { params: { pageCode } }
            );
        },
        /**
         * 保存配置列
         * @param params
         * @returns
         */
        save: (params: { pageCode?: string; pageJson?: any; queryTermsJson?: any }) => {
            return http.post(`${networkApi}/pageTableConfig/save`, params);
        },
        /**
         * 获取页面字段配置列信息
         * @param pageCode
         * @returns
         */
        queryPageField: (pageCode?: PageCodeEnum) => {
            return http.get<ResTpfList<PageJsonList[]>>(
                `${networkApi}/pageFieldConfig/queryPageField`,
                {
                    params: { pageCode }
                }
            );
        },
        /**
         *获取搜索条件配置项
         * @param pageCode
         * @returns
         */
        queryPageQueryTermsList: (pageCode?: PageCodeEnum) => {
            return http.post<ResTpfObject<{ pageCode: PageCodeEnum; pageJson?: string }>>(
                `${networkApi}/pageQueryTerms/queryPageQueryTermsList`,
                { pageCode }
            );
        }
    };
};

type IColumnsRender = {
    pageCode: PageCodeEnum;
    beforeRender?: (list: TpfColumnType[]) => TpfColumnType[];
    defaultVal?: TpfColumnType[];
    noUseInit?: boolean;
};

/**
 *
 * @param pageCode 表单的唯一id
 * @param beforeRender 需要对返回的数据进行处理的方法
 * @param defaultVal 默认配置项
 * @returns
 */
export const initTableColumnsConfig = ({
    pageCode,
    beforeRender,
    defaultVal = [],
    noUseInit = false
}: IColumnsRender) => {
    const { cacheSearchStore } = useStore();

    const [loading, setLoading] = useRef(false);
    const pageFieldConfigApi = usePageFieldConfigApi();
    const [columns, setColumns] = useRef<TpfColumnType[]>(defaultVal || []);
    const [size, setSize] = useRef<SizeType>('small');
    const [fontSize, setFontSize] = useRef<14 | 18>(14);

    const handelList = ([res1, res2]: any) => {
        const pageInfoJSon = JSON.parse(
            res1.data.object.pageJson || '{"fontSize":14,"size":"small","columnList":[]}'
        );
        const { size = 'small', fontSize = 14 } = pageInfoJSon;

        let columnList = pageInfoJSon.columnList as TpfColumnType[];
        if (!isArray(columnList) || columnList.length === 0) {
            columnList = unref(columns);
        }

        setSize(size);
        setFontSize(fontSize);
        const tableHeaderList = res2.data.list;
        let res = [] as TpfColumnType[];

        if (columnList.length === 0) {
            res = tableHeaderList.map((item: any) => ({
                ...item,
                title: item.showName,
                dataIndex: item.fieldCode
                // ...tableResizable()
            }));
        } else {
            res = tableHeaderList
                .map((item: PageJsonList) => {
                    const getTitleItem = columnList.find(
                        (it: TpfColumnType) => it.dataIndex === item.fieldCode
                    ) as any;
                    if (getTitleItem) {
                        return {
                            ...item,
                            ...getTitleItem,
                            title: getTitleItem ? item.showName : getTitleItem.title
                        };
                    } else {
                        return {
                            ...item,
                            title: item.showName,
                            dataIndex: item.fieldCode
                            // ...tableResizable()
                        };
                    }
                })
                .sort((a: any, b: any) => a.displayOrdinal - b.displayOrdinal);
        }

        if (typeof beforeRender === 'function') {
            if (res.length) {
                setColumns(beforeRender(res));
            }
        } else {
            if (res.length) {
                setColumns(res);
            }
        }
    };

    const fetchColumn = () => {
        // if (!isDev() && !cacheSearchStore.pageJsonIsEmpty(pageCode)) return;
        setLoading(true);
        Promise.all([
            pageFieldConfigApi.getInfo(pageCode),
            pageFieldConfigApi.queryPageField(pageCode)
        ])
            .then(handelList)
            .finally(() => {
                cacheSearchStore.setPageJson(pageCode, {
                    size: unref(size),
                    fontSize: unref(fontSize),
                    columnList: unref(columns)
                });
                setLoading(false);
            });
    };
    if (!noUseInit) {
        fetchColumn();
    }

    return {
        loading,
        fetchColumn
    };
};

type ISearchRender = {
    pageCode: PageCodeEnum;
    beforeRender?: (list: TpfColumnType[]) => TpfColumnType[];
    defaultVal?: any[];
    noUseInit?: boolean;
};

export const initSearchFormConfig = ({
    pageCode,
    beforeRender,
    defaultVal = [],
    noUseInit = false
}: ISearchRender) => {
    if (!pageCode) return;
    const {
        // handleOptions,
        // handleMode,
        // handleCascader,
        // handleAddress,
        removeRequired,
        delNullKey,
        handleSearchList
    } = useHandleFormOps();

    const pageFieldConfigApi = usePageFieldConfigApi();

    const { cacheSearchStore } = useStore();

    const searchLoading = ref(false);

    const searchFromList = ref<any[]>(defaultVal || []);

    const handelQueryTermsJson = (queryTermsJson: any[] = [], defaultVal: any[] = []) => {
        if (queryTermsJson.length === 0) {
            cacheSearchStore.setQueryTermsJson(pageCode, delNullKey(defaultVal));
        } else {
            const res = defaultVal
                .map((item: any) => {
                    // delete item.showDefaultValue;
                    const getTitleItem = queryTermsJson.find((it: any) => it.field === item.field);
                    if (getTitleItem) {
                        const { displayOrdinal, visible } = getTitleItem;
                        // delete getTitleItem.showDefaultValue;
                        return {
                            ...getTitleItem,
                            ...item,
                            displayOrdinal,
                            visible
                        };
                    } else {
                        return item;
                    }
                })
                .sort((a, b) => a.displayOrdinal - b.displayOrdinal);
            cacheSearchStore.setQueryTermsJson(pageCode, delNullKey(res));
        }
    };

    const beforeHandleHandelQueryTermsJson = ref<any[]>([]);

    const handelListSearch = ([res1, res2]: any) => {
        const showList = removeRequired(delNullKey(res1.data.list));
        beforeHandleHandelQueryTermsJson.value = JSON.parse(
            res2.data.object.queryTermsJson || '[]'
        );

        if (typeof beforeRender === 'function') {
            searchFromList.value = beforeRender(showList);
        } else {
            searchFromList.value = showList;
        }

        searchFromList.value = handleSearchList(unref(searchFromList));
        // searchFromList.value.forEach((item: any) => {
        //     item = handleOptions(item);

        //     item = handleMode(item);

        //     item = handleCascader(item, unref(searchFromList));

        //     handleAddress(item);
        // });
    };

    const updateSearchFormList = () => {
        // if (!isDev() && !cacheSearchStore.queryTermsJsonIsEmpty(pageCode)) return;

        searchLoading.value = true;
        Promise.all([
            pageFieldConfigApi.queryPageQueryTermsList(pageCode),
            pageFieldConfigApi.getInfo(pageCode)
        ])
            .then(handelListSearch)
            .finally(() => {
                searchLoading.value = false;
            });
    };
    watch(
        () => searchFromList,
        debounce(() => {
            handelQueryTermsJson(unref(beforeHandleHandelQueryTermsJson), unref(searchFromList));
        }, 1000),
        {
            deep: true
        }
    );

    if (!noUseInit) {
        updateSearchFormList();
    }

    return {
        searchLoading,
        searchFromList,
        updateSearchFormList
    };
};

export const getUploadLoadSortColumns = (list: TpfColumnType[]) => {
    const res = cloneDeep(unref(list))
        .filter(item => item.visible !== false)
        .reduce(
            (t, v) => {
                if (v.fixed === 'right') {
                    t.right = [...t.right, { dataIndex: v.dataIndex, title: v.title }];
                } else if (v.fixed === 'left') {
                    t.left = [...t.left, { dataIndex: v.dataIndex, title: v.title }];
                } else {
                    t.center = [...t.center, { dataIndex: v.dataIndex, title: v.title }];
                }
                return t;
            },
            {
                left: [] as TpfColumnType[],
                center: [] as TpfColumnType[],
                right: [] as TpfColumnType[]
            }
        );
    return [...res.left, ...res.center, ...res.right];
};
