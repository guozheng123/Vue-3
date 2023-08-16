<template>
    <TpfModal v-model:visible="state" v-bind="$attrs" width="800px" destroyOnClose>
        <a-row :gutter="10">
            <a-col :span="17" class="col-left">
                <div class="col-left-title">
                    <div class="title">
                        <span>可选字段</span>
                        <span>（共{{ leftShowColumns.length }}个）</span>
                    </div>
                    <div class="search">
                        <a-input
                            placeholder="请搜索"
                            size="small"
                            allow-clear
                            v-model:value="searchKey"
                        >
                            <template #prefix>
                                <SearchOutlined />
                            </template>
                        </a-input>
                    </div>
                </div>
                <div class="col-left-content">
                    <a-checkbox
                        v-if="!!tableColumns.length"
                        v-model:checked="checkAll"
                        @change="changeCheckAll"
                        :indeterminate="indeterminate"
                    >
                        全选
                    </a-checkbox>
                    <a-row :gutter="[10, 10]" class="checkbox-row">
                        <a-col v-for="item in leftShowColumns" :key="item.key" :span="6">
                            <a-checkbox
                                v-model:checked="item.visible"
                                @change="onchangeCheck(item)"
                            >
                                <a-tooltip :title="item.title">
                                    {{ item.title }}
                                </a-tooltip>
                            </a-checkbox>
                        </a-col>
                    </a-row>
                </div>
            </a-col>
            <a-col :span="7" class="col-right">
                <div class="col-right-title">
                    <div class="title">
                        <span>已选字段</span>
                        <span>（共{{ rightShowColumns.length }}个）</span>
                    </div>
                </div>
                <div class="col-right-content" :key="columnListRefKey">
                    <div
                        v-for="(item, inx) in rightShowColumns"
                        :key="item.key"
                        class="col-right-content-item"
                    >
                        <div class="col-right-content-item-left">
                            <SvgIcon size="24" type="icon-move1" class="icon-move1" move shadow />

                            <span class="title">
                                {{ item.title }}
                            </span>
                            <SvgIcon
                                size="24"
                                type="icon-ding"
                                :class="['icon-ding', item.fixed === 'left' && 'showIcon']"
                                :active="!!item.fixed"
                                cursor
                                shadow
                                :activeBackGround="item.fixed === 'left' ? '' : '#e8e9e9'"
                                @click="setRowToTop(item)"
                                :style="`color:${
                                    item.fixed === 'left' ? 'var(--ant-primary-color)' : '#b0b4b7'
                                }`"
                            />
                            <SvgIcon
                                size="24"
                                type="icon-guanbi"
                                cursor
                                shadow
                                @click="cancelSelect(item, inx)"
                            />
                        </div>
                    </div>
                </div>
            </a-col>
        </a-row>
        <template #footerLeft>
            <a-button @click="restColum">重置</a-button>
        </template>
        <template #footerRight>
            <a-button @click="onCancel">取消 </a-button>
            <a-button type="primary" @click="handleOk">确定</a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="ts" name="TpfColumnDialog">
    import { ref, nextTick, unref, computed, watch, onMounted } from 'vue';
    import { SearchOutlined } from '@ant-design/icons-vue';
    import { useCheckAllBox, useSortable } from '@/hooks';
    import { isNullAndUnDef } from '@/utils/is';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import TpfModal from '@/components/TpfModal/index.vue';
    import { TpfColumnType } from '@/types';
    import { CheckboxChangeEvent } from 'ant-design-vue/es/checkbox/interface';
    import { useVModel } from '@vueuse/core';
    import { cloneDeep } from 'lodash-es';
    import { SizeType } from 'ant-design-vue/lib/config-provider';
    import { useStore } from '@/store';

    import { storeToRefs } from 'pinia';

    const { cacheSearchStore } = useStore();

    const { cacheList } = storeToRefs(cacheSearchStore);

    type Props = {
        pageCode?: any;
        visible: boolean;
        fontSize?: 14 | 18;
        size?: SizeType;
    };

    const props = withDefaults(defineProps<Props>(), {
        size: 'small',
        fontSize: 14,
        pageCode: 'systemManage_teamGroup_table'
    });
    const emit = defineEmits<{
        (e: 'update:visible', val: boolean): void;
        (e: 'updateTableColumn'): void;
    }>();
    const state = useVModel(props, 'visible', emit);

    const columnListRefKey = ref(0);

    const initColumn = ref<TpfColumnType[]>([]);
    const tableColumns = ref<TpfColumnType[]>([]);

    const searchKey = ref('');

    const rightShowColumns = ref<TpfColumnType[]>([]);

    const leftShowColumns = computed(() => {
        if (!searchKey.value) return tableColumns.value;
        return tableColumns.value.filter((item: any) => {
            if (item.title) {
                return item.title.includes(searchKey.value);
            }
            return false;
        });
    });

    const sortRightColumns = () => {
        const renderColumnsList = unref(rightShowColumns).reduce(
            (t, v) => {
                if (v.fixed === 'left') {
                    t.top = [...t.top, v];
                } else {
                    t.bottom = [...t.bottom, v];
                }
                return t;
            },
            {
                top: [] as TpfColumnType[],
                bottom: [] as TpfColumnType[]
            }
        );
        return [...renderColumnsList.top, ...renderColumnsList.bottom];
    };

    const getRightShowColumns = () => {
        tableColumns.value.forEach(item => {
            if (item.visible) {
                if (!rightShowColumns.value.some(it => it.dataIndex === item.dataIndex)) {
                    rightShowColumns.value.push(item);
                }
            }
        });
        rightShowColumns.value = sortRightColumns();
    };

    const restColum = () => {
        tableColumns.value = cloneDeep(unref(initColumn));
        getRightShowColumns();
        columnListRefKey.value += 1;
    };

    const mergeColumns = () => {
        const selectList = unref(rightShowColumns);
        const unSelectList = [] as TpfColumnType[];

        unref(initColumn).forEach(item => {
            const flag = unref(selectList).some(it => it.dataIndex === item.dataIndex);
            if (!flag) {
                unSelectList.push({ ...item, visible: false });
            }
        });
        return [...unref(selectList), ...unref(unSelectList)].map((item, inx) => {
            item.displayOrdinal = inx;
            return item;
        });
    };

    const handleOk = (e: MouseEvent) => {
        saveTableColumn();
    };

    const onCancel = () => {
        state.value = false;
    };

    const saveTableColumn = async () => {
        const pageJson = {
            size: props.size,
            fontSize: props.fontSize,
            columnList: mergeColumns()
        };
        cacheSearchStore.savePageJson(props.pageCode, pageJson);

        state.value = false;
    };

    const { indeterminate, checkAll } = useCheckAllBox<TpfColumnType>(leftShowColumns, 'visible');

    const setRowToTop = (row: TpfColumnType) => {
        if (row.fixed !== 'left') {
            row.fixed = 'left';
        } else {
            delete row.fixed;
        }
        rightShowColumns.value = sortRightColumns();
        columnListRefKey.value += 1;
    };

    const handleVisibleChange = async () => {
        await nextTick();
        const columnListEl = document.querySelector('.col-right-content') as HTMLElement; //unref(columnListRef);
        if (!columnListEl) return;

        // Drag and drop sort
        const { initSortable } = useSortable(columnListEl, {
            handle: '.icon-move1',
            onEnd: async evt => {
                const { oldIndex, newIndex } = evt;

                if (isNullAndUnDef(oldIndex) || isNullAndUnDef(newIndex) || oldIndex === newIndex) {
                    return;
                }
                // Sort column
                const columns = rightShowColumns.value;
                columns.splice(newIndex, 0, columns.splice(oldIndex, 1)[0]);
                // rightShowColumns.value = columns;
                columnListRefKey.value += 1;
            }
        });
        initSortable();
    };

    const onchangeCheck = (row: TpfColumnType) => {
        const findIndex = unref(rightShowColumns).findIndex(
            item => item.dataIndex === row.dataIndex
        );
        if (findIndex > -1) {
            unref(rightShowColumns).splice(findIndex, 1);
        } else {
            unref(rightShowColumns).push(row);
        }
        columnListRefKey.value += 1;
    };
    const cancelSelect = (row: TpfColumnType, inx: number) => {
        tableColumns.value.forEach(item => {
            if (item.title === row.title) {
                item.visible = false;
                delete item.fixed;
            }
        });
        rightShowColumns.value = rightShowColumns.value.filter(
            item => item.dataIndex !== row.dataIndex
        );
    };

    const changeCheckAll = (val: CheckboxChangeEvent) => {
        if (val.target.checked) {
            getRightShowColumns();
        } else {
            rightShowColumns.value = [];
        }
    };

    const allTableColumns = computed<TpfColumnType[]>(() => {
        if (!unref(cacheList)[props.pageCode]) return [];
        return unref(cacheList)[props.pageCode].pageJson.columnList;
    });

    onMounted(() => {
        tableColumns.value = cloneDeep(unref(allTableColumns));
        initColumn.value = cloneDeep(unref(allTableColumns));
        rightShowColumns.value = [];
        if (unref(initColumn).length) {
            getRightShowColumns();
            handleVisibleChange();
        }
    });

    watch(
        () => columnListRefKey.value,
        () => {
            handleVisibleChange();
        }
    );
</script>

<style lang="less">
    .ant-modal-body > .ant-row {
        height: 100%;

        .col-left {
            padding-left: 20px !important;
            padding-right: 10px !important;
            border-right: 1px solid #f0f0f0;
        }

        .col-right {
            padding-left: 10px !important;
        }

        .col-left,
        .col-right {
            display: flex;
            flex-direction: column;
        }

        .col-left-title,
        .col-right-title {
            display: flex;
            justify-content: space-between;

            .title,
            .search {
                height: 36px;
                line-height: 36px;
                margin-right: 10px;
            }
        }

        .col-left-content,
        .col-right-content {
            flex: 1 0 0;
            overflow-y: auto;
            overflow-x: hidden;

            .checkbox-row {
                margin-top: 10px;

                .ant-checkbox + span {
                    .line(1);
                }
            }
        }

        .col-right-content-item {
            margin-right: 5px;
            height: 32px;
            display: flex;
            align-items: center;

            .col-right-content-item-left {
                flex: 1 0 0;
                display: flex;
                align-items: center;

                .title {
                    flex: 1 0 0;
                    .line(1);
                }

                &:hover {
                    .icon-ding {
                        opacity: 1;
                    }
                }

                .icon-ding {
                    opacity: 0;

                    &.showIcon {
                        opacity: 1;
                    }
                }
            }

            .col-right-content-item-right {
                flex: 1 0 0;
                display: flex;
                justify-content: flex-end;
                padding-right: 10px;
            }
        }
    }
</style>
