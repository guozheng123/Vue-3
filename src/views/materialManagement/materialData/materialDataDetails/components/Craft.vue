<template>
    <div class="Craft">
        <TpfCollapse title="工艺">
            <template #right>
                <a-button
                    v-if="routerType !== '2'"
                    class="tpf-button"
                    @click="onAddCraft"
                    ghost
                    type="primary"
                >
                    <SvgIcon type="icon-insert" /> 添加
                </a-button>
                <a-button
                    v-if="routerType !== '2'"
                    class="tpf-button"
                    ghost
                    type="primary"
                    @click="onDelCraft"
                    :disabled="isEmpty(selectedRowInfo.selectedRowKeys)"
                >
                    <SvgIcon type="icon-shanchu" /> 删除
                </a-button>
            </template>
            <TpfTable
                class="t-p-[10px] t-box-border t-h-[300px]"
                v-bind="{ ...tableInfo, seq: true, pagination, columns }"
            />
        </TpfCollapse>
        <AddCraft ref="addCraft" @getList="getList" />
    </div>
</template>

<script setup lang="tsx">
    import { unref, watchEffect } from 'vue';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import { TpfColumnType } from '@/types';
    import TpfTable from '@/components/TpfTable/index.vue';
    import AddCraft from './AddCraft.vue';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import { Checkbox } from 'ant-design-vue';
    import router from '@/router';
    import { isEmpty, uniqBy } from 'lodash-es';

    type Props = {
        list?: any[];
        routerType: string;
    };

    const props = defineProps<Props>();

    type dataValue = {
        processCode: string;
        processName: string;
        defaultProcess: number;
        dis: boolean;
        processId: number;
    };
    const [addCraft, onOpenAddCraft] = useOpenAntdModal();

    const columns = [
        {
            title: '工艺编号',
            dataIndex: 'processCode',
            customRender: ({ text, record }) => {
                return <a onClick={() => openDetail(record.processId)}>{text}</a>;
            }
        },
        { title: '工艺名称', dataIndex: 'processName' },
        {
            title: '默认工艺',
            dataIndex: 'defaultProcess',
            customRender: ({ record, text }) => (
                <Checkbox
                    class="radio-check"
                    checked={Number(text) === 1}
                    onChange={val => {
                        if (props.routerType === '2') return;
                        unref(tableInfo).dataSource?.forEach(item => {
                            item.defaultProcess = 0;
                            if (item.processCode === record.processCode) {
                                item.defaultProcess = Number(val.target.checked);
                            }
                        });
                    }}
                />
            )
        }
    ] as TpfColumnType[];

    const onAddCraft = () => {
        onOpenAddCraft(getTableList());
    };
    const openDetail = (processId: string) => {
        router.push({
            path: '/processManagement/workmanshipRoute/detailWorkmanshipRouteDetail',
            query: {
                type: 'detail',
                processId: processId
            }
        });
    };

    const getList = (v: any[]) => {
        const list = unref(v).map(item => ({ ...item, defaultProcess: 0 }));
        setTableList(uniqBy([...getTableList(), ...list], 'processCode'));
    };

    const onDelCraft = () => {
        const newList = getTableList().filter(
            item => !unref(selectedRowInfo).selectedRowKeys.includes(item.processCode)
        );
        setTableList(newList);
    };

    const { tableInfo, pagination, getDataList, selectedRowInfo, setTableList } = useAntdTable({
        api: async () => {
            return { list: [] as dataValue[] };
        },
        rowKey: 'processCode',
        isPageAble: false,
        hasRowSelection: props.routerType !== '2'
    });

    const getSubmitList = () => {
        const list = getTableList();
        if (isEmpty(list)) return [];
        const hasDefaultProcess = list.some(item => Number(item.defaultProcess) === 1);
        if (!hasDefaultProcess) {
            unref(tableInfo).dataSource![0].defaultProcess = 1;
        }
        return unref(tableInfo).dataSource || [];
    };

    const getTableList = () => {
        return unref(tableInfo).dataSource || [];
    };

    watchEffect(() => {
        if (!isEmpty(props.list)) {
            setTableList(props.list || []);
        }
    });

    defineExpose({ getSubmitList });

    getDataList();
</script>
