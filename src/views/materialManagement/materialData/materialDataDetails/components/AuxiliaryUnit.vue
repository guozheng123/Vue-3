<template>
    <TpfCollapse title="辅助单位">
        <template #right>
            <a-button
                v-if="routerType !== '2'"
                class="tpf-button"
                ghost
                type="primary"
                @click="onAdd"
            >
                <SvgIcon type="icon-insert" /> 添加辅助单位
            </a-button>
        </template>
        <TpfTable
            class="t-p-[10px] t-box-border t-h-[300px]"
            v-bind="{ ...tableInfo, loading, pagination, columns, seq: true, operateColumn }"
        />
        <AddAuxiliaryUnitModel
            @upload-table="uploadTable"
            ref="addAuxiliary"
            :routerType="routerType"
            :materialUnitInfo="materialUnitInfo"
        />
    </TpfCollapse>
</template>

<script setup lang="tsx">
    import { unref, defineAsyncComponent, ref, computed, watchEffect } from 'vue';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import { TpfColumnType } from '@/types';
    import TpfTable from '@/components/TpfTable/index.vue';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import { Switch, message } from 'ant-design-vue';
    import { withTpfTableOperateColumn } from '@/components/TpfTable';
    import { isEmpty } from 'lodash-es';
    import { v4 } from 'uuid';

    type Props = {
        materialUnitCodeOpt?: any;
        list?: any[];
        routerType: string;
        materialUnitInfo: { materialUnitCode: string; materialUnitName: string };
    };

    const props = defineProps<Props>();

    const AddAuxiliaryUnitModel = defineAsyncComponent(() => import('./addAuxiliaryUnitModel.vue'));

    const [addAuxiliary, openAddAuxiliaryUnitModel] = useOpenAntdModal();

    const defaultBtn = [
        { title: '编辑', onClick: (row: any) => onEdit({ list: row.value, type: 'edit' }) },
        {
            title: '删除',
            onClick: (row: any) => {
                delSelectRow([row.value.uuid]);
            },
            hidden: props.routerType === '1'
        }
    ];

    const onEdit = (row: any) => {
        console.log(row);
        // uuid.value = row.uuid;
        openAddAuxiliaryUnitModel(row);
    };

    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 100,
        fixed: 'right',
        visible: props.routerType !== '2',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });
    const columns = computed<TpfColumnType[]>(() => {
        return [
            { title: '辅助单位', dataIndex: 'materialAuxiliaryUnitName' },
            {
                title: '换算关系',
                dataIndex: 'materialAuxiliaryUnitUsage',
                customRender: ({ record }) => {
                    const str =
                        record.materialAuxiliaryUnitUsage +
                        record.materialAuxiliaryUnitName +
                        '=' +
                        record.materialUnitUsage +
                        props.materialUnitInfo.materialUnitName;
                    return str;
                }
            },
            {
                title: '启用',
                dataIndex: 'enable',
                customRender: ({ text, record }) => {
                    return (
                        <Switch
                            v-model:checked={record.enable}
                            checkedValue={'1'}
                            unCheckedValue={'0'}
                        />
                    );
                }
            }
        ];
    });

    const onAdd = () => {
        openAddAuxiliaryUnitModel({ list: getTableList(), type: 'add' });
    };

    const {
        tableInfo,
        pagination,
        loading,
        getTableList,
        getDataList,
        setTableList,
        delSelectRow
    } = useAntdTable({
        api: async () => {
            return { list: [] as any[] };
        },
        rowKey: 'uuid',
        isPageAble: false
    });

    const getSubmitList = () => {
        return unref(getTableList());
    };

    const uploadTable = (data: any) => {
        let hasFlag = false;

        const currentList = unref(getTableList());
        currentList.forEach(item => {
            if (item.uuid === data.uuid) {
                Object.assign(item, data);
                hasFlag = true;
            }
        });
        const res = hasFlag ? [...currentList] : [...currentList, data];
        if (res.length > 10) {
            return message.warn('最多可以维护10个辅助单位');
        }
        setTableList(res);
        // hasFlag ? setTableList([...currentList]) : setTableList([...currentList, data]);
    };
    watchEffect(() => {
        if (props.list && !isEmpty(props.list)) {
            const res = props.list.map(e => {
                e.uuid = v4();
                return e;
            });
            setTableList(res);
        }
    });

    defineExpose({ getSubmitList, setTableList });
</script>
