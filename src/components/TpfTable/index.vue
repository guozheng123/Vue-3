<template>
    <vNode />
</template>

<script setup lang="tsx" name="TpfTable">
    import { Table, Empty } from 'ant-design-vue';
    import { useSlots, useAttrs, computed, unref, ref } from 'vue';
    import type { TpfColumnType } from '@/types';
    import { debounce } from 'lodash-es';
    import { PageCodeEnum, tableResizable } from '@/config';
    import { useStore } from '@/store';
    import { storeToRefs } from 'pinia';
    import { initTableColumnsConfig } from '@/api';
    import { useI18n } from '@/hooks/useI18n';
    import type { SizeType } from 'ant-design-vue/lib/config-provider';
    import type { PaginationProps } from 'ant-design-vue';
    import { isEmpty } from 'lodash-es';
    import { filterHidden } from '@/utils';

    const { t } = useI18n();
    type Props = {
        seq?: boolean;
        fontSize?: 14 | 18 | string;
        columns?: TpfColumnType[];
        operateColumn?: TpfColumnType;
        striped?: boolean; //斑马纹
        selectedRowKeys?: any[];
        pageCode?: PageCodeEnum;
        beforeRender?: (list: TpfColumnType[]) => TpfColumnType[];
        headerPadding?: string;
        dataSource?: Record<string, any>[];
        pagination?: PaginationProps | false;
    };

    const props = withDefaults(defineProps<Props>(), {
        fontSize: 14,
        headerPadding: '8px 8px',
        dataSource: () => []
    });

    const headerPadding = computed(() => {
        return props.headerPadding;
    });

    const { cacheSearchStore } = useStore();
    const { cacheList } = storeToRefs(cacheSearchStore);

    const storeColumns = computed(() => {
        if (!props.pageCode) return [];
        return unref(cacheList)[props.pageCode]?.pageJson?.columnList;
    });

    const currentFontSize = computed(() => {
        let val = props.fontSize;
        if (typeof val === 'string') {
            val = val.replace('px', '');
        }
        return val + 'px';
    });

    const emit = defineEmits<{
        (e: 'update:columns', val: TpfColumnType[]): void;
        (e: 'updateColumns', val: any): void;
    }>();

    // 用于缓存没有走后台的列
    const innerCacheList = ref<TpfColumnType[]>([]);

    const columns = computed<TpfColumnType[]>({
        get() {
            if (!isEmpty(unref(innerCacheList))) {
                return innerCacheList.value || [];
            }
            if (props.pageCode) {
                //走后台缓存
                emit('updateColumns', unref(storeColumns));
                return unref(storeColumns) || [];
            }
            if (props.columns) {
                // 不走后台缓存
                return props.columns || [];
            }
            return [];
        },
        set(list) {
            const newList = list.filter(item => {
                if (['operate', '操作'].includes(item.title as string)) {
                    return false;
                }
                return true;
            });

            innerCacheList.value = newList;
        }
    });

    const renderColumnsList = computed(() => {
        if (!props.pageCode) {
            return [...columns.value];
        }
        if (!isEmpty(unref(innerCacheList))) {
            return innerCacheList.value;
        }
        const sortColumns = unref(columns)
            .filter(item => item.visible)
            .reduce(
                (t, v) => {
                    if (v.fixed === 'left') {
                        t.left = [...t.left, v];
                    } else if (v.fixed === 'right') {
                        t.right = [...t.right, v];
                    } else {
                        t.center = [...t.center, v];
                    }

                    return t;
                },
                {
                    left: [] as TpfColumnType[],
                    center: [] as TpfColumnType[],
                    right: [] as TpfColumnType[]
                }
            );
        return [...sortColumns.left, ...sortColumns.center, ...sortColumns.right];
    });

    const innerColumns = computed(() => {
        let columnsList = [...renderColumnsList.value];

        if (props.seq) {
            const hasSeq = columnsList.some(item => item.dataIndex === 'seq');
            if (!hasSeq) {
                columnsList.unshift({
                    title: t('component.tpfTable.No'),
                    dataIndex: 'seq',
                    width: 50,
                    align: 'left',
                    fixed: 'left',
                    customRender: ({ index }) => index + 1
                });
            }
        }

        if (props.operateColumn) {
            if (props.operateColumn.visible === false) {
                return columnsList;
            }
            columnsList = [...columnsList, props.operateColumn || {}];
        }
        return columnsList.map(item => ({ ...tableResizable(), ...item }));
    });

    const slots = useSlots();
    const attrs = useAttrs();

    const saveColumns = debounce(() => {
        if (!props.pageCode) return;
        const saveList = unref(columns).map(item => {
            const renderItem =
                unref(renderColumnsList).find(it => it.dataIndex === item.dataIndex) || {};
            return {
                ...item,
                ...renderItem
            };
        });
        cacheSearchStore.savePageJson(props.pageCode, {
            columnList: unref(saveList),
            fontSize: props.fontSize as 14 | 18,
            size: attrs.size as SizeType
        });
    }, 1000);

    if (props.pageCode) {
        initTableColumnsConfig({ pageCode: props.pageCode, beforeRender: props.beforeRender });
    }

    const vNode = () => (
        <Table
            pagination={props.pagination}
            dataSource={props.dataSource}
            scroll={{ y: 300, x: 300 }}
            class="tpf-table"
            rowClassName={
                (props.striped || '') &&
                ((record, index) => (index % 2 === 1 ? 'table-striped' : ''))
            }
            size="small"
            {...attrs}
            {...{
                onResizeColumn: (w: number, col: TpfColumnType) => {
                    col.width = w;
                    saveColumns();
                    columns.value = [...innerColumns.value];
                }
            }}
            columns={filterHidden(unref(innerColumns))}
            v-slots={{
                ...slots,
                emptyText: () => <Empty />
            }}
        />
    );
</script>

<style lang="less" scoped>
    .tpf-table {
        :deep(.ant-table) {
            .ant-table-thead > tr > th {
                padding: v-bind(headerPadding);
            }

            .ant-table-tbody {
                font-size: v-bind(currentFontSize);
            }
        }
    }
</style>
