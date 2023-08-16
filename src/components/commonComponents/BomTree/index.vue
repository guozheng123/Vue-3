<template><VNode /> </template>

<script setup lang="tsx">
    import { useAttrs, unref, useSlots, useCssModule, ref } from 'vue';
    import { Tree, Empty } from 'ant-design-vue';
    import { DownOutlined } from '@ant-design/icons-vue';
    import { useRevisionHistoryModal } from '@/components';

    const {
        RevisionHistoryModal,
        revisionHistoryModalDom,
        openRevisionHistoryModal,
        showRevisionHistoryModal
    } = useRevisionHistoryModal();

    type Props = {
        bomType: string;
        treeData?: any[];
        fieldNames?: {
            children: string;
            title: string;
            key: string;
            rootCode: string;
        };
    };
    const props = withDefaults(defineProps<Props>(), {
        treeData: () => [],
        fieldNames: () => ({
            children: 'branchTree',
            title: 'rootName',
            key: 'rootNum',
            rootCode: 'rootCode'
        })
    });

    const emit = defineEmits<{
        (e: 'selectBom', val: any): void;
    }>();

    const attrs = useAttrs();
    const slots = useSlots();

    const style = useCssModule('root');

    const renderTitle = (obj: any) => {
        const title = obj[props.fieldNames.title] || '';
        return (
            <div
                class="tree-title"
                onClick={() => {
                    emit('selectBom', obj.data);
                }}
            >
                <div>{title}</div>
                <div
                    class="t-text-primary"
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (!obj.dataRef.operationId) return;
                        openRevisionHistoryModal(obj.dataRef);
                    }}
                >
                    {Number(obj.data.bomVersion) ? 'v' + obj.data.bomVersion : ''}
                </div>
            </div>
        );
    };
    const selectedKeys = ref(['0-0']);

    const VNode = () => {
        if (props.treeData.length === 0) {
            return <Empty style={{ marginTop: '10px' }} />;
        }
        return (
            <div class={[style['bom-tree'], 'tpf-operateTree']}>
                <Tree
                    treeData={unref(props.treeData)}
                    expandedKeys={selectedKeys.value}
                    v-model={[selectedKeys.value, 'expandedKeys']}
                    blockNode
                    showLine
                    switcherIcon={({ switcherCls }: any) => <DownOutlined class={switcherCls} />}
                    icon={() => <DownOutlined />}
                    {...attrs}
                    v-slots={{
                        ...slots,
                        title: renderTitle
                    }}
                />
                {unref(showRevisionHistoryModal) && (
                    <RevisionHistoryModal ref={revisionHistoryModalDom} bomType={props.bomType} />
                )}
            </div>
        );
    };
</script>

<style lang="less" module="root">
    .bom-tree {
        flex: 1;
        padding: 10px;
        box-sizing: border-box;
        :global {
            .ant-tree-list {
                .tree-title {
                    // width: 160px;
                    flex: 1;
                    // padding-right: 10px;
                    box-sizing: border-box;
                    display: flex;
                    justify-content: space-between;
                }
            }
        }
    }
</style>
