<template>
    <div class="tpf-groupTree">
        <template v-if="treeData && treeData.length">
            <div :class="{ rowBtn: checked, noArowBtn: !checked }">
                <a-input v-model:value="searchValue" placeholder="请搜索" enter-button allow-clear>
                    <template #prefix>
                        <SearchOutlined />
                    </template>
                </a-input>
                <div>
                    <a-tooltip placement="bottom" color="black" title="展开/收回">
                        <SvgIcon :type="iconType" cursor shadow :size="24" @click="toggleOpen()" />
                    </a-tooltip>
                </div>

                <slot name="otherBtn" v-if="checked"> </slot>
            </div>
            <a-tree
                class="scrollbarColor"
                :expandedKeys="expandedKeys"
                :auto-expand-parent="autoExpandParent"
                :tree-data="treeData"
                :checkable="checked"
                v-model:checkedKeys="checkedKeys"
                @expand="onExpand"
                @select="selectTree"
                @check="checkedTree"
                :fieldNames="fieldNames"
                v-model:selectedKeys="selectedKeys"
            >
                <template #switcherIcon="{ switcherCls }">
                    <DownOutlined :class="switcherCls" />
                </template>
                <template #icon>
                    <DownOutlined />
                </template>
                <template #title="obj">
                    <span
                        v-if="
                            obj[fieldNames.title] && obj[fieldNames.title].indexOf(searchValue) > -1
                        "
                    >
                        {{
                            obj[fieldNames.title].substr(
                                0,
                                obj[fieldNames.title].indexOf(searchValue)
                            )
                        }}
                        <span style="color: var(--ant-primary-color)">{{ searchValue }}</span>
                        {{
                            obj[fieldNames.title].substr(
                                obj[fieldNames.title].indexOf(searchValue) + searchValue.length
                            )
                        }}
                    </span>
                    <span v-else>{{ obj[fieldNames.title] }}</span>
                </template>
            </a-tree>
        </template>

        <a-empty style="margin-top: 20px" v-else />
    </div>
</template>

<script setup lang="ts" name="TpfGroupTree">
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { ref, watch, computed, watchEffect, unref } from 'vue';
    import { TreeDataItem } from 'ant-design-vue/es/tree/Tree';
    import type { TreeProps } from 'ant-design-vue';
    import { useRef } from '@/hooks';

    import { SearchOutlined, DownOutlined } from '@ant-design/icons-vue';

    const emit = defineEmits<{
        (e: 'selectTree', val: any): void;
        (e: 'checkedTree', val: any): void;
        (e: 'onAdd'): void;
    }>();
    const selectedKeys = ref<any>([]);
    const [isOpen, setOpen] = useRef(false);
    const checkedKeys = ref<number[]>([]);
    type Props = {
        treeData: any[];
        fieldNames?: {
            children: string;
            title: string;
            key: string;
        };
        checked?: boolean;
        isChangeFirst?: boolean;
        selectedKeysArr?: any;
    };
    const props = withDefaults(defineProps<Props>(), {
        fieldNames: () => ({
            children: 'branchTree',
            title: 'rootName',
            key: 'rootNum'
        }),
        checked: false,
        isChangeFirst: false,
        selectedKeysArr: []
    });

    const expandedKeys = ref<(string | number)[]>([]);

    const searchValue = ref<string>('');

    const autoExpandParent = ref<boolean>(true);

    const dataList: any[] = [];
    const iconType = computed(() => {
        return unref(isOpen) ? 'icon-shuxingshouhui' : 'icon-shuxingzhankai';
    });

    const generateList = (data: TreeProps['treeData']) => {
        data &&
            data.forEach(node => {
                dataList.push({ ...node });
                if (node[props.fieldNames.children]) {
                    generateList(node[props.fieldNames.children]);
                }
            });
    };
    watchEffect(() => {
        generateList(props.treeData);
        //菜单默认选择第一个
        if (props.isChangeFirst) {
            selectedKeys.value = props.selectedKeysArr;
        }
    });

    const getParentKey = (key: string, tree: TreeDataItem[]): string | number | undefined => {
        let parentKey;
        tree.forEach(node => {
            if (node[props.fieldNames.children]) {
                if (
                    node[props.fieldNames.children].some(
                        (item: any) => item[props.fieldNames.key] === key
                    )
                ) {
                    parentKey = node[props.fieldNames.key];
                } else if (getParentKey(key, node[props.fieldNames.children])) {
                    parentKey = getParentKey(key, node[props.fieldNames.children]);
                }
            }
        });

        return parentKey;
    };

    const onExpand = (keys: any[]) => {
        expandedKeys.value = keys;
        autoExpandParent.value = false;
    };
    const getAllParentKey = computed(() => {
        return getAllIds(props.treeData, []);
    });

    const getAllIds = (data: any, expandIds: any) => {
        data.map((e: any) => {
            if (e[props.fieldNames.children]) {
                getAllIds(e[props.fieldNames.children], expandIds);
            } else {
                if (e[props.fieldNames.key]) {
                    expandIds.push(e[props.fieldNames.key]);
                }
            }
        });
        return expandIds;
    };

    const toggleOpen = (val?: boolean) => {
        setOpen(!isOpen.value);
        if (isOpen.value || val === true) {
            autoExpandParent.value = true;
            expandedKeys.value = getAllParentKey.value;
        } else {
            expandedKeys.value = [];
        }
    };

    watch(searchValue, value => {
        const expanded = dataList
            .map((item: TreeDataItem) => {
                if (item[props.fieldNames.title].indexOf(value) > -1) {
                    return getParentKey(item[props.fieldNames.key], props.treeData);
                }
                return '';
            })
            .filter((item, i, self) => item !== undefined && self.indexOf(item) === i);
        expandedKeys.value = expanded as string[];
        searchValue.value = value;
        autoExpandParent.value = true;
    });

    const selectTree = (selectedKeys: any, e: any) => {
        const { selectedNodes } = e;
        emit('selectTree', selectedNodes[0]);
    };
    const checkedTree = (checkedKeys: any, e: any) => {
        e.checkedNodes = e.checkedNodes.filter((item: any) => item[props.fieldNames.key] !== null);
        const ids = e.checkedNodes.map((e: any) => {
            return e[props.fieldNames.key];
        });
        emit('checkedTree', { ids, e });
    };
    const allCheckedFun = (isChecked: boolean) => {
        if (isChecked) {
            checkedKeys.value = getAllIds(props.treeData, []);
        } else {
            checkedKeys.value = [];
        }
    };
    const setCheck = (checked: number[]) => {
        checkedKeys.value = checked;
    };

    defineExpose({
        allCheckedFun,
        toggleOpen,
        setCheck,
        onExpand
    });
</script>

<style lang="less" scoped>
    .tpf-groupTree {
        height: 100%;
        padding: 4px 10px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;

        .noArowBtn {
            margin: 12px 0 16px;
            display: flex;
            justify-content: space-between;
            gap: 12px;
            align-items: center;
        }

        .rowBtn {
            margin: 12px 0 16px;
            display: flex;
            justify-content: space-between;
            gap: 12px;
            align-items: center;

            :deep(.ant-checkbox-wrapper) {
                width: 68px;
            }
        }

        :deep(.ant-tree) {
            flex: 1;
            overflow: auto;
        }

        .defaultRotate {
            transform: rotate(270deg);

            &.isOpen {
                transform: rotate(90deg);
            }
        }
    }
</style>
