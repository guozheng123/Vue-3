<template>
    <a-dropdown
        v-model:visible="visible"
        :trigger="['click']"
        destroyPopupOnHide
        @visibleChange="open"
        overlayClassName="operateDropdown"
    >
        <SvgIcon type="icon-coloumn" cursor shadow size="24" style="color: #1d2129" />
        <template #overlay>
            <a-menu>
                <a-menu-item key="3">筛选条件</a-menu-item>
                <a-menu-divider />
                <a-menu-item key="3">
                    <a-checkbox v-model:checked="checkAll" :indeterminate="indeterminate">
                        全选
                    </a-checkbox>
                </a-menu-item>

                <a-menu-item class="content">
                    <div class="col-right-content" ref="columnListRef" :key="columnListRefKey">
                        <div v-for="(item, inx) in searchFromList" :key="inx" class="column-item">
                            <a-space class="column-item-space">
                                <a-checkbox v-model:checked="item.visible">
                                    {{ item.label }}
                                </a-checkbox>
                                <div>
                                    <SvgIcon
                                        size="24"
                                        type="icon-Frame"
                                        class="icon-Frame"
                                        cursor
                                        shadow
                                        @click="setRowToTop(item, inx)"
                                    />
                                    <SvgIcon
                                        size="24"
                                        type="icon-move1"
                                        class="icon-move1"
                                        move
                                        shadow
                                    />
                                </div>
                            </a-space>
                        </div>
                    </div>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item class="footer-btn">
                    <a-space>
                        <a-button class="tpf-button" @click="cancelShow">取消</a-button>
                        <a-button type="primary" class="tpf-button" @click="onSave">保存</a-button>
                    </a-space>
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
</template>

<script setup lang="ts" name="TpfChangeFiled">
    import { ref, nextTick, unref, watchEffect, computed } from 'vue';
    import { useSortable } from '@/hooks';
    import { isNullAndUnDef } from '@/utils/is';

    import SvgIcon from '@/components/SvgIcon/index.vue';

    import { useCheckAllBox } from '@/hooks';
    import { PageCodeEnum } from '@/config';
    import { cloneDeep } from 'lodash-es';
    import { useStore } from '@/store';
    import { storeToRefs } from 'pinia';

    const { cacheSearchStore } = useStore();
    const { cacheList } = storeToRefs(cacheSearchStore);

    type Props = {
        pageCode: PageCodeEnum;
    };

    const props = defineProps<Props>();

    const storeCacheList = computed(() => {
        if (!unref(cacheList)[props.pageCode]) return [];
        const resList = unref(cacheList)[props.pageCode].queryTermsJson || [];
        return resList.filter((item: any) => item.type && item.field);
    });

    const columnListRef = ref<HTMLDivElement>();

    const visible = ref(false);
    const columnListRefKey = ref(0);

    const searchFromList = ref<any[]>([]);

    watchEffect(() => {
        if (unref(searchFromList).length) {
            handleVisibleChange();
        }
    });

    const { indeterminate, checkAll } = useCheckAllBox(searchFromList, 'visible');

    const open = async (val: boolean) => {
        if (!val) return;
        visible.value = true;
        searchFromList.value = cloneDeep(unref(storeCacheList));
        columnListRefKey.value += 1;
    };

    const cancelShow = () => {
        visible.value = false;
    };

    const setRowToTop = (row: any, oldIndex: number) => {
        const columns = searchFromList.value;
        columns.splice(0, 0, columns.splice(oldIndex, 1)[0]);
        columnListRefKey.value += 1;
    };

    const onSave = () => {
        const res = unref(searchFromList).map((item, inx) => ({
            ...item,
            displayOrdinal: inx
        }));
        cacheSearchStore.saveQueryTermsJson(props.pageCode, res);
        cancelShow();
    };

    const handleVisibleChange = async () => {
        await nextTick();

        const columnListEl = unref(columnListRef);
        if (!columnListEl) return;

        // Drag and drop sort
        const { initSortable } = useSortable(columnListEl, {
            handle: '.icon-move1',
            onEnd: evt => {
                const { oldIndex, newIndex } = evt;

                if (isNullAndUnDef(oldIndex) || isNullAndUnDef(newIndex) || oldIndex === newIndex) {
                    return;
                }
                // Sort column
                const columns = searchFromList.value;
                columns.splice(newIndex, 0, columns.splice(oldIndex, 1)[0]);
                columnListRefKey.value += 1;
            }
        });
        initSortable();
    };
    // watch(
    //     () => columnListRefKey.value,
    //     () => {
    //         // handleVisibleChange();
    //     },
    //     {
    //         immediate: true
    //     }
    // );
    defineExpose({ open });
</script>

<style lang="less">
    .operateDropdown {
        &.ant-dropdown {
            .col-right-content {
                max-height: 50vh;
                overflow: auto;
            }

            .ant-dropdown-menu-item.content {
                padding: 0;

                &:hover {
                    background-color: transparent;
                }

                .column-item {
                    padding: 2px 12px;

                    .column-item-space {
                        display: flex;
                        justify-content: space-between;
                    }

                    &:hover {
                        .icon-Frame {
                            opacity: 1;
                        }
                    }

                    .icon-Frame {
                        opacity: 0;
                    }
                }
            }

            .footer-btn {
                text-align: right;
            }
        }
    }
</style>
