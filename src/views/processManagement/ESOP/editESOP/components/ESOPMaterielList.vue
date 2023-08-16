<template>
    <TpfCollapse title="物料列表">
        <AddProcessFromMaterielModal
            v-if="showAddProcessFromMaterielModalDom"
            ref="addProcessFromMaterielModalDom"
            @getMaterialCode="getMaterialCode"
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
    import { useAntdTable, useRouteBase64 } from '@/hooks';
    import { TpfColumnType } from '@/types';
    import { computed, unref, watchEffect } from 'vue';
    import { useRouter } from 'vue-router';
    import { useAddProcessFromMaterielModal } from '@/components';
    import { v4 } from 'uuid';

    const { encodeParams } = useRouteBase64();

    const {
        AddProcessFromMaterielModal,
        addProcessFromMaterielModalDom,
        openAddProcessFromMaterielModalDom,
        showAddProcessFromMaterielModalDom
    } = useAddProcessFromMaterielModal();

    type Props = {
        list?: { [k: string]: any }[];
        readOnly?: boolean;
        fieldName?: string;
    };

    const props = withDefaults(defineProps<Props>(), {
        list: () => [],
        readOnly: false,
        fieldName: 'guidebookMaterials'
    });

    const router = useRouter();

    const go2Detail = (row: Record<string, any>) => {
        router.push({
            path: '/materialManagement/materialData/materialDataDetails',
            query: encodeParams({ type: '2', id: row.id })
        });
    };

    const columns = computed(() => {
        return [
            {
                title: '物料编号',
                dataIndex: 'materialCode',
                ...tableResizable(),
                customRender: ({ record, text }) => (
                    <span class="tpf-link" onClick={() => go2Detail(record)}>
                        {text}
                    </span>
                )
            },
            { title: '物料名称', dataIndex: 'materialName', ...tableResizable() },
            { title: '图号', dataIndex: 'figureNum', ...tableResizable() },
            { title: '物料规格', dataIndex: 'materialSpec', ...tableResizable() },
            { title: '物料单位', dataIndex: 'materialUnitName', ...tableResizable() },
            { title: '物料类型', dataIndex: 'materialTypeName', ...tableResizable() },
            { title: '备注', dataIndex: 'remark', ...tableResizable() }
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
        openAddProcessFromMaterielModalDom(unref(getTableList()));
    };

    const getMaterialCode = (list: any[]) => {
        list = list.map(item => ({ ...item, uuid: v4() }));
        setTableList([...unref(getTableList()), ...list]);
    };

    const submit = async () => {
        return { [props.fieldName]: unref(getTableList()) };
    };
    watchEffect(() => {
        getTableList();
        if (props.list) {
            const list = props.list.map(item => ({ ...item, uuid: v4() }));
            setTableList(list);
        }
    });

    defineExpose({ submit });
</script>
