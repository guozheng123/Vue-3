import type { PaginationProps, TableProps } from 'ant-design-vue';
import { ref, computed, UnwrapRef, unref, Ref } from 'vue';
import type { Key } from 'ant-design-vue/es/vc-tree-select/interface';
import { useStore } from '@/store';
import { storeToRefs } from 'pinia';
import { ResSysParameterByTenantId } from '@/api';
import { findListItem } from '@/utils';
import { isArray, isObject } from 'lodash-es';

type TypeRowSelection<T> = boolean | TableProps<T>['rowSelection'];

type TableParams<T extends { list: any[]; total?: number }> = {
    api: (
        pagination: PaginationProps & { sortedField: string; sortByAsc: boolean } & {
            [k: string]: any;
        }
    ) => Promise<T>; //调接口使用的方法
    isPageAble?: boolean; // 是否使用分页
    rowKey?: string; // table 的key
    dataCallBack?: (data: T['list']) => T['list']; // 处理数据的方法
    colorRow?: boolean; //鼠标点击这一行高亮
    hasRowSelection?: TypeRowSelection<T['list'][number]>; //左侧复选框
    preserveSelectedRowKeys?: boolean; //分页缓存
    useSorter?: boolean; //是否需要排序
    isConfig?: boolean; //是否新的配置项
};
/**
 * @author wangkang
 * @param {Function}  params.api 表单接口api
 * @param {boolean}  params.isPageAble 表单是否需要分页
 * @param {strings}  params.rowKey 表单的row-key属性= 唯一表示
 * @param {Function}  params.dataCallBack 对接口返回值进行处理的方法
 * @returns {object} tableInfo 绑定到a-table上的属性
 * @returns {object} pagination 绑定到a-table上的分页信息
 * @returns {boolean} loading 加载loading
 * @returns {Function} getDataList 触发接口的方法
 * @returns {object} selectRow 当前高亮行信息
 * @returns {object} selectedRowInfo 复选框选中的数据信息
 */
export const useAntdTable = <
    T extends {
        list: any[];
        total?: number;
        names?: string[];
        displayNames?: string[];
        values?: any[];
    }
>({
    api,
    isPageAble = true,
    rowKey = 'key',
    dataCallBack,
    colorRow = false,
    hasRowSelection = false,
    preserveSelectedRowKeys = false,
    useSorter = false,
    isConfig = false
}: TableParams<T>) => {
    const loading = ref(false);

    const sortFieldInfo = ref({
        sortedField: '',
        sortByAsc: false
    });

    type SelectedRowInfoType = { selectedRowKeys: Key[]; selectedRows: T['list'][number][] };

    const selectedRowInfo = ref<SelectedRowInfoType>({
        selectedRowKeys: [],
        selectedRows: []
    });

    const dataSource = ref<T['list']>([]);

    const changeDataSource = (cb: (list: UnwrapRef<T['list']>) => UnwrapRef<T['list']>) => {
        dataSource.value = cb(unref(dataSource));
    };
    const { userStore } = useStore();
    const { sysParameterList } = storeToRefs(userStore);
    const sysParameterPageSize = computed<ResSysParameterByTenantId>(() => {
        return findListItem(unref(sysParameterList), 'parameterCode', 'pageDisplayLine') || {};
    });

    const pageSizeOptions = computed<string[]>(() => {
        return unref(sysParameterPageSize).parameterValues?.map(item => `${item.value}`);
    });

    const pagination = ref<PaginationProps>({
        hideOnSinglePage: !isPageAble,
        size: 'small',
        pageSize: Number(unref(sysParameterPageSize).defaultValue) || 20,
        current: 1,
        total: 0,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: unref(pageSizeOptions),
        showTotal: total => `共 ${total} 条`,
        onChange: (page, pageSize) => {
            if (pageSize !== pagination.value.pageSize) {
                pagination.value.pageSize = pageSize;
                pagination.value.current = 1;
            } else {
                pagination.value.current = page;
            }
            getDataList();
        }
    });

    const setTableList = (list: UnwrapRef<T['list']>) => {
        dataSource.value = unref(list);
        if (preserveSelectedRowKeys) return;
        selectedRowInfo.value = {
            selectedRowKeys: [],
            selectedRows: []
        };
    };

    type IGetList = {
        h5?: boolean;
        [k: string]: any;
    };

    /**
     * 有分页参数则是下拉加载
     * @param h5 移动端 / pad
     * @returns
     */
    const getDataList = async (params: IGetList = {}) => {
        const { h5, ...args } = params;
        selectRow.value = {};
        if (loading.value) return;

        loading.value = true;
        if (!preserveSelectedRowKeys) {
            selectedRowInfo.value = {
                selectedRowKeys: [],
                selectedRows: []
            };
        }

        try {
            const res = await api({
                ...unref(pagination),
                ...unref(sortFieldInfo),
                ...args
            });
            if (isPageAble) {
                pagination.value.total = res.total || 0;
            }
            let list = [];
            //走新的系统配置--------------
            if (isConfig && isArray(res.names)) {
                const result = res.values?.map(item => {
                    const obj = {};
                    for (let i = 0; i < res.names!.length; i++) {
                        obj[res.names![i]] = item[i];
                    }
                    return obj;
                });
                list = result || [];
            } else {
                list = res.list || [];
            }

            //  const list = res.list || [];
            const newList = dataCallBack ? dataCallBack(list) : list;
            if (h5) {
                dataSource.value.push(...newList);
                pagination.value.current! += 1;
            } else {
                dataSource.value = newList as UnwrapRef<T['list']>;
            }
        } catch (error) {
            console.log('error: ', error);
        } finally {
            loading.value = false;
        }
    };
    const selectRow = ref({} as Ref<T['list'][number]>);

    const customRow = (record: T['list'][number]) => ({
        onClick: () => {
            selectRow.value = record;
        }
    });
    const rowClassName = (record: any) => {
        if (!colorRow) return '';
        return unref(selectRow)[rowKey] === record[rowKey] ? 'colorRowClassName' : '';
    };

    const rowSelection = computed<TableProps<T['list'][number]>['rowSelection']>(() => {
        if (!hasRowSelection) return undefined;
        const args = isObject(hasRowSelection) ? hasRowSelection : {};
        return {
            preserveSelectedRowKeys,
            fixed: true,
            selectedRowKeys: unref(selectedRowInfo).selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows: T['list']) => {
                selectedRowKeys = selectedRowKeys.filter(o => o);
                selectedRows = selectedRows.filter(o => o);
                selectedRowInfo.value = { selectedRowKeys, selectedRows };
            },
            ...args
        };
    });

    const tableInfo = computed<TableProps<T['list'][number]>>(() => ({
        dataSource: dataSource.value,
        loading: loading.value,
        rowKey: record => record[rowKey],
        customRow,
        rowClassName,
        rowSelection: unref(rowSelection),
        onChange: (page, filer, sorter) => {
            if (useSorter && !isArray(sorter)) {
                if (!sorter.order) {
                    sortFieldInfo.value = { sortedField: '', sortByAsc: false };
                } else {
                    sortFieldInfo.value.sortedField = sorter.field as string;
                    sortFieldInfo.value.sortByAsc = sorter.order === 'ascend';
                }
                getDataList();
            }
        }
    }));

    const getTableList = (): Ref<UnwrapRef<T['list']>> => {
        return dataSource;
    };

    /**
     * 删除已经选择中的
     */
    const delSelectRow = async (delKeys?: any[]) => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定删除选中的数据吗?' });
        delKeys = (delKeys || unref(selectedRowInfo).selectedRowKeys) as string[];
        const newList = unref(dataSource).filter(
            item => !delKeys?.includes(item[rowKey])
        ) as UnwrapRef<T['list']>;
        setTableList(newList);
    };

    return {
        tableInfo,
        pagination: (!!isPageAble && pagination) as Ref<PaginationProps>,
        loading,
        getDataList,
        changeDataSource,
        selectRow,
        selectedRowInfo,
        setTableList,
        customRow,
        sortFieldInfo,
        getTableList,
        delSelectRow
    };
};
