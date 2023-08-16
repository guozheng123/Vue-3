<template>
    <TpfCollapse title="物料明细">
        <TpfTable
            class="tpf-table-form"
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
        <!-- 点击添加弹新增盘点范围 -->
        <AddDepartment ref="target" @stock="stock" />
    </TpfCollapse>
</template>

<script setup lang="tsx">
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import TpfTable from '@/components/TpfTable/index.vue';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import { TpfColumnType } from '@/types';
    import { computed, unref, watchEffect, defineAsyncComponent, ref } from 'vue';
    import { v4 } from 'uuid';
    import TpfInputNumber from '@/components/TpfInputNumber/index.vue';
    import { FormItem } from 'ant-design-vue';
    import { cloneDeep } from 'lodash-es';
    import BigNumber from 'bignumber.js';

    const AddDepartment = defineAsyncComponent(() => import('./CountSheetModal.vue'));

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

    const oldDataSouce = ref<any[]>([]);

    const columns = computed(() => {
        return [
            { title: '仓位名称', dataIndex: 'positionName' },
            { title: '库位名称', dataIndex: 'storeLocationName' },
            { title: '项目名称', dataIndex: 'projectName' },
            { title: '零件类型', dataIndex: 'partsType' },
            { title: '物料编号', dataIndex: 'materialCode' },
            { title: '物料名称', dataIndex: 'materialName' },
            { title: '批次号', dataIndex: 'batchNo' },
            { title: '库存数量', dataIndex: 'storeNum' },
            {
                title: '盘点数量',
                dataIndex: 'checkNum',
                customRender: ({ record, index }) => {
                    return (
                        <FormItem name={['dataSource', index, 'checkNum']}>
                            <TpfInputNumber
                                disabled={props.readOnly}
                                style={{ width: '90%' }}
                                v-model={[record.checkNum, 'value']}
                                min={0}
                                {...{
                                    onChange: () => monitorCountQuantity(record)
                                }}
                            />
                        </FormItem>
                    );
                }
            },
            {
                title: '库存损益',
                dataIndex: 'gainLoss'
                // customRender: ({ record }) => {
                //     return (record.gainLoss = record.checkNum - record.storeNum);
                // }
            },
            { title: '基本单位', dataIndex: 'basicUnitName' }
        ] as TpfColumnType[];
    });

    const { tableInfo, pagination, selectedRowInfo, getTableList, setTableList, delSelectRow } =
        useAntdTable({
            api: async () => ({ list: [] as any[] }),
            rowKey: 'uuid',
            isPageAble: false,
            hasRowSelection: !props.readOnly
        });

    const [target, onOpenModal] = useOpenAntdModal();
    const openAddProcessModal = (v: any) => {
        onOpenModal('add', props.info);
    };

    // 监听盘点数量变化
    const monitorCountQuantity = (record: any) => {
        return (record.gainLoss = new BigNumber(
            Number((record.checkNum - record.storeNum).toFixed(8))
        ).toFixed());
    };

    // 自定义事件
    const stock = async (data: any) => {
        const currentList = unref(getTableList());
        setTableList([{ ...data, uuid: v4(), storeNum: 0 }, ...currentList]);
    };

    const getDeleteIdList = () => {
        return unref(oldDataSouce)
            .filter(item => unref(getTableList()).every(it => it.id !== item.id))
            .map(item => item.id);
    };
    const submit = async () => {
        return { [props.fieldName]: unref(getTableList()), deleteIdList: getDeleteIdList() };
    };
    watchEffect(() => {
        if (props.list.length) {
            oldDataSouce.value = cloneDeep(props.list);
            const renderlist = props.list.map((item: any) => ({ ...item, uuid: v4() }));
            setTableList(renderlist);
        }
    });

    defineExpose({ submit });
</script>

<style scoped lang="less">
    .tpf-table-form {
        height: 580px;
    }

    :deep(.ant-row) {
        margin: 0 !important;
    }
</style>
