<template>
    <TpfCollapse title="接收人">
        <TpfTable
            readOnly
            class="tpf-table-form"
            v-bind="{ ...tableInfo, columns, seq: true, pagination }"
        />
    </TpfCollapse>
</template>

<script setup lang="tsx">
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import TpfTable from '@/components/TpfTable/index.vue';
    import { useAntdTable } from '@/hooks';
    import { TpfColumnType } from '@/types';
    import { computed, watchEffect } from 'vue';

    type Props = {
        info?: any;
        list?: { [k: string]: any }[];
        readOnly?: boolean;
        fieldName?: string;
    };

    const props = withDefaults(defineProps<Props>(), {
        list: () => [],
        readOnly: false,
        info: {},
        fieldName: 'detailDtoList'
    });

    const columns = computed(() => {
        return [
            { title: '发送结果', dataIndex: 'isSend' },
            { title: '接收人', dataIndex: 'recevierUserName' },
            { title: '接收渠道', dataIndex: 'channelCode' },
            { title: '接收人地址', dataIndex: 'recevierAddress' }
        ] as TpfColumnType[];
    });

    const { tableInfo, pagination, setTableList } = useAntdTable({
        api: async () => ({ list: [] as any[] }),
        rowKey: 'uuid',
        isPageAble: false,
        hasRowSelection: !props.readOnly
    });

    watchEffect(() => {
        if (props.list.length) {
            setTableList(props.list);
        }
    });
</script>

<style scoped lang="less">
    .tpf-table-form {
        height: 300px;
    }

    :deep(.ant-row) {
        margin: 0 !important;
    }
</style>
