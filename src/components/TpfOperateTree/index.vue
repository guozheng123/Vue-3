<template> <vNode /> </template>

<script setup lang="tsx" name="TpfOperateTree">
    import { Tree, TreeProps, Input, Space } from 'ant-design-vue';
    import { TreeDataItem } from 'ant-design-vue/es/tree';
    import { Key } from 'ant-design-vue/es/vc-tree-select/interface';
    import { ref, watch, unref, watchEffect, useSlots, useAttrs } from 'vue';
    import { DownOutlined, SearchOutlined } from '@ant-design/icons-vue';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { isArray, cloneDeep, isEmpty, debounce } from 'lodash-es';
    import { v4 } from 'uuid';

    const editValue = ref('');

    type Props = {
        treeData: any[];
        hiddenAdd?: boolean;
        hiddenDel?: boolean;
        hiddenEdit?: boolean;
        hiddenSearch?: boolean;
        fieldNames?: {
            children: string;
            title: string;
            key: string;
            rootCode: string;
        };
    };
    const props = withDefaults(defineProps<Props>(), {
        fieldNames: () => ({
            children: 'branchTree',
            title: 'rootName',
            key: 'rootNum',
            rootCode: 'rootCode'
        })
    });

    const emit = defineEmits<{
        (e: 'selectTree', val: any): void;
        (e: 'onAdd', iptValue: string, selectNode: any): void;
        (e: 'onDel', node: any): void;
        (e: 'onEditTree', iptValue: string, selectNode: any): void;
    }>();

    const slots = useSlots();
    const attrs = useAttrs();

    const addLevelList = ref<any[]>([]);

    const selectedNodes = ref<{ [k: string]: any }>({});

    const dataList = ref<any[]>([]);

    const addLevel = (list: any[], level = 1) => {
        return list.map(item => {
            item.level = level;
            if (item[props.fieldNames.children] && isArray(item[props.fieldNames.children])) {
                item[props.fieldNames.children] = addLevel(
                    item[props.fieldNames.children],
                    level + 1
                );
                item.isAdd = false;
            }
            return item;
        });
    };

    const generateList = (data: TreeProps['treeData']) => {
        data &&
            data.forEach(node => {
                unref(dataList).push({ ...node });
                if (node[props.fieldNames.children]) {
                    generateList(node[props.fieldNames.children]);
                }
            });
    };

    const expandedKeys = ref<(string | number)[]>([]);
    const searchValue = ref('');
    const autoExpandParent = ref<boolean>(true);

    const initTree = () => {
        editValue.value = '';
        addLevelList.value = [];
        searchValue.value = '';
        autoExpandParent.value = true;
        dataList.value = [];
        expandedKeys.value = props.treeData.map(item => item[props.fieldNames.key]);
        generateList(cloneDeep(props.treeData));
        addLevelList.value = addLevel(cloneDeep(props.treeData));
    };

    watchEffect(() => {
        if (!props.treeData.length) return;
        initTree();
    });

    const onExpand = (keys: Key[]) => {
        expandedKeys.value = keys;
        autoExpandParent.value = false;
    };

    const newGetParentKey = (list: any[] = [], parent: any) => {
        return list.reduce((t, v) => {
            const flag = v[props.fieldNames.title].indexOf(unref(searchValue)) > -1;
            if (flag) {
                t = [...t, v[props.fieldNames.key], parent[props.fieldNames.key]];
            }
            if (v[props.fieldNames.children]) {
                const res = newGetParentKey(v[props.fieldNames.children], v);
                t = [...t, ...res];
            }
            if (t.length) {
                t = [...t, parent[props.fieldNames.key]];
            }
            return t;
        }, []);
    };

    watch(searchValue, value => {
        if (!value) {
            expandedKeys.value = props.treeData.map(item => item[props.fieldNames.key]);

            return;
        }
        let expanded = [] as any[];
        const list = unref(dataList).filter(item => item[props.fieldNames.title].includes(value));
        list.forEach((item: TreeDataItem) => {
            const res = newGetParentKey(props.treeData, item);
            expanded = [...res, ...expanded];
        });
        expanded = [...new Set(expanded)];

        expandedKeys.value = isEmpty(expanded)
            ? props.treeData.map(item => item[props.fieldNames.key])
            : expanded;
        autoExpandParent.value = true;
    });

    const editNode = ref<{ [k: string]: any }>({});

    const changeEditState = (editObj: any, list: any[]) => {
        unref(list).forEach(item => {
            const hasFlag = item[props.fieldNames.key] === editObj[props.fieldNames.key];
            if (hasFlag) {
                item.isEdit = true;
                editValue.value = item[props.fieldNames.title];
            } else {
                if (
                    isArray(item[props.fieldNames.children]) &&
                    item[props.fieldNames.children].length
                ) {
                    changeEditState(editObj, item[props.fieldNames.children]);
                }
            }
        });
    };

    const addEdit = (addObj: any, list: any[]) => {
        const findItemParent = unref(list).find(item => {
            const hasFlag = item[props.fieldNames.key] === addObj[props.fieldNames.key];
            if (hasFlag) {
                return true;
            }
            if (item[props.fieldNames.children]) {
                return addEdit(addObj, unref(item[props.fieldNames.children]));
            }

            return false;
        });
        if (findItemParent) {
            expandedKeys.value = [
                ...new Set([...unref(expandedKeys), findItemParent[props.fieldNames.key]])
            ];
            editNode.value = {
                [props.fieldNames.key]: v4(),
                isAdd: true,
                addValue: 'addValue',
                fatherCode: findItemParent[props.fieldNames.rootCode],
                label: findItemParent[props.fieldNames.title]
            };

            if (isArray(findItemParent[props.fieldNames.children])) {
                findItemParent[props.fieldNames.children] = [
                    ...findItemParent[props.fieldNames.children],
                    unref(editNode)
                ];
            } else {
                findItemParent[props.fieldNames.children] = [unref(editNode)];
            }
        }
    };

    const onSelect = (e: any) => {
        selectedNodes.value = e;
        emit('selectTree', unref(selectedNodes));
    };

    const addInputDom = ref<InstanceType<typeof Input> | null>(null);

    const renderTitle = (obj: any) => {
        const { isAdd, isEdit } = obj;
        const title = obj[props.fieldNames.title] || '';
        const flag = title.indexOf(unref(searchValue)) > -1;
        if (flag) {
            if (isAdd) {
                return (
                    <Input
                        ref={addInputDom}
                        size="small"
                        maxlength={10}
                        onBlur={(e: any) => {
                            if ([null, '', undefined].includes(e.target.value)) {
                                initTree();
                                return;
                            }
                            emit('onAdd', e.target.value, obj.data);
                        }}
                    />
                );
            }
            if (isEdit) {
                return (
                    <Input
                        size="small"
                        v-focus={true}
                        v-model={[editValue.value, 'value', ['trim']]}
                        onBlur={(e: any) => {
                            if ([null, '', undefined].includes(e.target.value)) {
                                initTree();
                                return;
                            }
                            if (e.target.value === obj.label) {
                                initTree();
                                return;
                            }
                            emit('onEditTree', e.target.value, obj.data);
                        }}
                    />
                );
            }
            return (
                <>
                    <span class="line-title" onClick={() => onSelect(obj)}>
                        {title.substr(0, title.indexOf(unref(searchValue)))}
                        <span style={{ color: 'var(--ant-primary-color)' }}>
                            {unref(searchValue)}
                        </span>
                        {title.substr(
                            title.indexOf(unref(searchValue)) + unref(searchValue).length
                        )}
                    </span>
                    {[1, 2, 3].includes(obj.dataRef.level) && (
                        <Space size={5} class="operate-icon">
                            {[1, 2].includes(obj.dataRef.level) && !props.hiddenAdd && (
                                <SvgIcon
                                    type="icon-shu_xinzeng"
                                    cursor
                                    shadow
                                    size={18}
                                    activeBackGround="#E4E9DE"
                                    onClick={(e: MouseEvent) => {
                                        onSelect(obj.data);

                                        e.stopPropagation();
                                        e.preventDefault();
                                        addEdit(obj, unref(addLevelList));
                                    }}
                                />
                            )}
                            {!props.hiddenDel && (
                                <SvgIcon
                                    type="icon-shu_shanchu"
                                    cursor
                                    shadow
                                    activeBackGround="#E4E9DE"
                                    size={18}
                                    onClick={(e: MouseEvent) => {
                                        onSelect(obj.data);
                                        e.stopPropagation();
                                        e.preventDefault();
                                        emit('onDel', obj.data);
                                    }}
                                />
                            )}
                            {!props.hiddenEdit && (
                                <SvgIcon
                                    type="icon-shu_bianji"
                                    cursor
                                    shadow
                                    size={18}
                                    activeBackGround="#E4E9DE"
                                    onClick={(e: MouseEvent) => {
                                        onSelect(obj.data);
                                        e.stopPropagation();
                                        e.preventDefault();
                                        obj.isEdit = true;
                                        changeEditState(obj, unref(addLevelList));
                                    }}
                                />
                            )}
                        </Space>
                    )}
                </>
            );
        } else {
            return <span>{title}</span>;
        }
    };

    const vNode = () => {
        return (
            <div class="tpf-operateTree">
                {!props.hiddenSearch && (
                    <div class="rowBtn">
                        <Input
                            v-model:value={searchValue.value}
                            placeholder="请搜索"
                            enter-button
                            allow-clear
                            prefix={<SearchOutlined />}
                        />
                    </div>
                )}
                <Tree
                    onExpand={onExpand}
                    expandedKeys={unref(expandedKeys)}
                    treeData={unref(addLevelList)}
                    showLine
                    blockNode
                    fieldNames={props.fieldNames}
                    switcherIcon={({ switcherCls }: any) => <DownOutlined class={switcherCls} />}
                    icon={() => <DownOutlined />}
                    onVnodeUpdated={debounce(() => {
                        (addInputDom.value as any)?.focus();
                    }, 300)}
                    {...attrs}
                    v-slots={{
                        ...slots,
                        title: renderTitle
                    }}
                />
            </div>
        );
    };
</script>
