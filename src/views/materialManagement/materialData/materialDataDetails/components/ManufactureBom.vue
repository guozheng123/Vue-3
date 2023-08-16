<template>
    <TpfCollapse title="制造BOM">
        <TpfTable
            class="t-p-[10px] t-box-border t-h-[300px]"
            v-bind="{ ...tableInfo, seq: true, pagination, columns }"
        >
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'defaultProcess'">
                    <a-checkbox v-model:value="record.defaultProcess" />
                </template>
            </template>
        </TpfTable>
    </TpfCollapse>
</template>

<script setup lang="tsx">
    import { onMounted, unref, watchEffect } from 'vue';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import { TpfColumnType } from '@/types';
    import TpfTable from '@/components/TpfTable/index.vue';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { useAntdTable } from '@/hooks';
    import { isEmpty } from 'lodash-es';
    type dataValue = {
        badnessCode: string;
        badnessName: string;
        IQC: string;
        IPQC: string;
        FQC: string;
        OQC: string;
        mbomId: number;
    };

    type Props = {
        list?: any[];
    };
    const props = withDefaults(defineProps<Props>(), {
        list: () => []
    });

    const columns = [
        {
            name: 'IQC',
            dataIndex: 'IQC',
            customRender: ({ text }) =>
                text === '1' ? <SvgIcon type="icon-xuanzhong" class="t-text-primary" /> : null
        },
        {
            title: 'IPQC',
            dataIndex: 'IPQC',
            customRender: ({ text }) =>
                text === '1' ? <SvgIcon type="icon-xuanzhong" class="t-text-primary" /> : null
        },
        {
            title: 'FQC',
            dataIndex: 'FQC',
            customRender: ({ text }) =>
                text === '1' ? <SvgIcon type="icon-xuanzhong" class="t-text-primary" /> : null
        },
        {
            title: 'OQC',
            dataIndex: 'OQC',
            customRender: ({ text }) =>
                text === '1' ? <SvgIcon type="icon-xuanzhong" class="t-text-primary" /> : null
        },
        { title: '不良编号', dataIndex: 'badnessCode' },
        { title: '不良原因', dataIndex: 'badnessName' }
    ] as TpfColumnType[];

    const { tableInfo, pagination, getDataList, setTableList, getTableList } = useAntdTable({
        api: async () => {
            return { list: [] as dataValue[] };
        },
        rowKey: 'badnessCode',
        isPageAble: false
    });

    const getSubmitList = () => {
        return unref(getTableList());
    };
    onMounted(() => {
        getDataList();
    });
    watchEffect(() => {
        if (props.list && !isEmpty(props.list)) {
            setTableList(props.list || []);
        }
    });

    defineExpose({ getSubmitList, setTableList });
</script>
