<template>
    <TpfCollapse title="作业说明">
        <AddESOPJobDescriptionModal
            v-if="showAddESOPJobDescriptionModal"
            ref="AddESOPJobDescriptionModalDom"
            @getDesc="getDesc"
        />
        <TpfTable
            class="t-h-[280px] t-p-[12px]"
            v-bind="{ ...tableInfo, columns, seq: true, pagination }"
        />

        <template #right>
            <a-button
                v-if="!readOnly"
                type="primary"
                class="tpf-button"
                ghost
                @click="openAddProcessModal"
            >
                <SvgIcon type="icon-shu_xinzeng" cursor />添加
            </a-button>
            <a-button
                v-if="!readOnly"
                type="primary"
                class="tpf-button"
                ghost
                :disabled="!selectedRowInfo.selectedRowKeys.length"
                @click="delSelectRow()"
            >
                <SvgIcon type="icon-shanchu" /> 删除
            </a-button>
        </template>
    </TpfCollapse>
</template>

<script setup lang="tsx">
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import TpfTable from '@/components/TpfTable/index.vue';
    import { tableResizable } from '@/config';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import { TpfColumnType } from '@/types';
    import { v4 } from 'uuid';
    import { computed, unref, watchEffect, defineAsyncComponent } from 'vue';

    const AddESOPJobDescriptionModal = defineAsyncComponent(
        () => import('./AddESOPJobDescriptionModal.vue')
    );
    const [
        AddESOPJobDescriptionModalDom,
        openAddESOPJobDescriptionModal,
        showAddESOPJobDescriptionModal
    ] = useOpenAntdModal();

    type Props = {
        list?: { [k: string]: any }[];
        readOnly?: boolean;
        fieldName?: string;
    };

    const props = withDefaults(defineProps<Props>(), {
        list: () => [],
        readOnly: false,
        fieldName: 'guidebookMateriels'
    });

    const columns = computed(() => {
        return [
            { title: '作业内容', dataIndex: 'content', ...tableResizable() },
            { title: '作业要求', dataIndex: 'requirement', ...tableResizable() },
            { title: '注意事项', dataIndex: 'attention', ...tableResizable() }
        ] as TpfColumnType[];
    });
    const { tableInfo, pagination, selectedRowInfo, getTableList, setTableList, delSelectRow } =
        useAntdTable({
            api: async () => ({ list: [] as any[] }),
            rowKey: 'uuid',
            isPageAble: false,
            hasRowSelection: !props.readOnly
        });

    const openAddProcessModal = () => {
        openAddESOPJobDescriptionModal();
    };

    const getDesc = (val: any) => {
        // console.log('list: ', list);
        setTableList([...unref(getTableList()), { ...val, uuid: v4() }]);
    };

    const submit = async () => {
        return { [props.fieldName]: unref(getTableList()) };
    };
    watchEffect(() => {
        if (props.list) {
            const list = props.list.map(item => ({ ...item, uuid: item.guidebookInstructionId }));
            setTableList(list);
        }
    });

    defineExpose({ submit });
</script>
