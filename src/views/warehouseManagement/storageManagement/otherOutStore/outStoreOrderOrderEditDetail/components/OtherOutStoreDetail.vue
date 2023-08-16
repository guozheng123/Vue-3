<template>
    <TpfCollapse title="出库明细" class="OtherOutStoreDetail">
        <template #right>
            <a-button v-if="!props.isAdd" ghost type="primary" class="tpf-button" @click="onAdd">
                <SvgIcon type="icon-xinzeng" /> 新增
            </a-button>
            <a-button v-if="!props.isAdd" ghost type="primary" class="tpf-button" @click="onDelete">
                <SvgIcon type="icon-shanchu" /> 删除
            </a-button>
        </template>
        <a-form ref="formRef" :model="tableForm" class="table-form">
            <TpfTable
                class="tpf-table-form"
                v-bind="{
                    ...tableInfo,
                    columns,
                    seq: true,
                    pagination,
                    dataSource
                }"
            />
        </a-form>
        <AddProcessFromMaterielModal
            v-if="showAddProcessFromMaterielModalDom"
            ref="addProcessFromMaterielModalDom"
            @getMaterialCode="getMaterial"
        />
    </TpfCollapse>
</template>

<script setup lang="tsx" name="outStorageDetail">
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import TpfTable from '@/components/TpfTable/index.vue';
    import { tableResizable } from '@/config';
    import { useAntdTable, useAntdForm } from '@/hooks';
    import { TpfColumnType } from '@/types';
    import { Select, FormItem, Input, message } from 'ant-design-vue';
    import { ref, computed, toRefs, unref, reactive, watchEffect } from 'vue';
    import {
        checkRequired,
        checkNoChinese,
        checkGreaterThan,
        checkNoSpace
    } from '@/formRuleConfig/Tpfrules';
    import TpfInputNumber from '@/components/TpfInputNumber/index.vue';
    import { useAddProcessFromMaterielModal } from '@/components';
    import { useWarehouseApi, useProjectApi } from '@/api';
    import { debounce } from 'lodash-es';
    import type { ResGetPositionDataList, ResGetStoreLocationDataList } from '@/api';

    type Props = {
        originalInfo?: { [k: string]: any }[];
        isAdd: boolean;
    };
    const props = withDefaults(defineProps<Props>(), {
        originalInfo: () => [],
        isAdd: false
    });
    const {
        AddProcessFromMaterielModal,
        addProcessFromMaterielModalDom,
        openAddProcessFromMaterielModalDom,
        showAddProcessFromMaterielModalDom
    } = useAddProcessFromMaterielModal();
    const projectApi = useProjectApi();
    const warehouseManagementAPi = useWarehouseApi();
    const { formRef, submitForm } = useAntdForm();
    const selectPositionList = ref<ResGetPositionDataList[]>([]);
    const selectStoreCodeList = ref<ResGetStoreLocationDataList[]>([]);
    const tableForm = reactive<{ dataSource: { [k: string]: any }[] }>({
        dataSource: []
    });
    const { dataSource } = toRefs(tableForm);
    let countId = 1;
    const columns = computed(() => {
        return [
            {
                title: '项目编号',
                dataIndex: 'projectCode',
                width: 260,
                customRender: ({ record, index }) => {
                    if (!props.isAdd) {
                        return (
                            <FormItem
                                name={['dataSource', index, 'projectCode']}
                                rules={[
                                    {
                                        required:
                                            record.isOnLoadSearchProject &&
                                            !record.outKWList.length,
                                        trigger: ['blur'],
                                        message: '未检索到项目'
                                    }
                                ]}
                            >
                                <Select
                                    options={record.outKWList}
                                    allowClear
                                    show-search
                                    loading={record.loading}
                                    v-model={[record.projectCode, 'value']}
                                    style={{ width: '90%' }}
                                    onSearch={(value: string) => onSearchProjectList(record, value)}
                                    onFocus={() => onSearchProjectList(record)}
                                />
                            </FormItem>
                        );
                    }
                    return `${record.projectName || ''}${
                        record.projectCode ? '(' + record.projectCode + ')' : ''
                    }`;
                }
            },
            {
                title: '批次号',
                dataIndex: 'batchNo',
                ...tableResizable(),
                customRender: ({ record, index }) => {
                    if (!props.isAdd) {
                        return (
                            <FormItem
                                name={['dataSource', index, 'batchNo']}
                                rules={[checkNoChinese(), checkNoSpace()] as any}
                            >
                                <Input v-model={[record.batchNo, 'value']} maxlength={20} />
                            </FormItem>
                        );
                    }
                    return record.batchNo;
                }
            },
            {
                title: '物料编号',
                dataIndex: 'materialCode',
                ...tableResizable()
            },
            {
                title: '物料名称',
                dataIndex: 'materialName',
                ...tableResizable()
            },
            {
                title: () => <span class="required"> 出库数</span>,
                dataIndex: 'outNum',
                ...tableResizable(),
                customRender: ({ record, index }) => {
                    if (!props.isAdd) {
                        return (
                            <FormItem
                                name={['dataSource', index, 'outNum']}
                                rules={[checkRequired(), checkGreaterThan()] as any}
                            >
                                <TpfInputNumber
                                    style={{ width: '90%' }}
                                    v-model={[record.outNum, 'value']}
                                />
                            </FormItem>
                        );
                    }
                    return record.outNum;
                }
            },
            {
                title: '基本单位',
                dataIndex: 'materialUnitName',
                ...tableResizable()
            },
            {
                title: () => <span class="required"> 出库仓位</span>,
                dataIndex: 'positionCode',
                ...tableResizable(),
                customRender: ({ record, text, index }) => {
                    if (!props.isAdd) {
                        return (
                            <FormItem
                                name={['dataSource', index, 'positionCode']}
                                rules={[checkRequired()] as any}
                            >
                                <Select
                                    options={record.selectPositionList}
                                    class={['workshopCodeRef']}
                                    fieldNames={{ label: 'name', value: 'code' }}
                                    v-model={[record.positionCode, 'value']}
                                    style={{ width: '90%' }}
                                    onChange={() => {
                                        onResetCurData(record);
                                        onGetStoreList(record.positionCode, index);
                                    }}
                                    onFocus={() => onGetPositionList()}
                                />
                            </FormItem>
                        );
                    }
                    return record.positionName;
                }
            },
            {
                title: '出库库位',
                dataIndex: 'storeLocationCode',
                ...tableResizable(),
                customRender: ({ record, text }) => {
                    if (!props.isAdd) {
                        return (
                            <Select
                                options={record.selectStoreCodeList}
                                class={['workshopCodeRef']}
                                fieldNames={{
                                    label: 'storeLocationName',
                                    value: 'storeLocationCode'
                                }}
                                v-model={[record.storeLocationCode, 'value']}
                                style={{ width: '90%' }}
                            />
                        );
                    }
                    return record.storeLocationName;
                }
            },
            {
                title: '说明',
                dataIndex: 'remarks',
                ...tableResizable(),
                customRender: ({ record, index }) => {
                    if (!props.isAdd)
                        return <Input v-model={[record.remarks, 'value']} maxlength={50} />;
                    return record.remarks;
                }
            }
        ] as TpfColumnType[];
    });
    const { tableInfo, pagination, selectedRowInfo } = useAntdTable({
        api: async () => ({ list: [] }),
        rowKey: 'countId',
        isPageAble: false,
        hasRowSelection: !props.isAdd
    });
    const onGetPositionList = async (index?: number) => {
        try {
            if (selectPositionList.value.length) return;
            const { data } = await warehouseManagementAPi.getPositionDataList();
            selectPositionList.value = data.list || [];
            dataSource.value.forEach(item => {
                item.selectPositionList = data.list || [];
            });
        } catch (error) {
            console.log(error);
        }
    };
    const onResetCurData = (record: any) => {
        record.selectStoreCodeList = [];
        record.storeLocationCode = '';
    };
    const onGetStoreList = async (value: string, index?: number) => {
        try {
            if (!value) return;
            const { data } = await warehouseManagementAPi.getStoreLocationDataList({
                positionCode: value
            });
            if (typeof index === 'number') {
                dataSource.value[index].selectStoreCodeList = data.list || [];
            } else {
                selectStoreCodeList.value = data.list || [];
            }
        } catch (error) {
            console.log(error);
        }
    };
    const onSearchProjectList = debounce(async (record: any, value?: string) => {
        try {
            record.loading = true;
            const res = await projectApi.queryProjectListByPage({
                forbidden: '1',
                pageSize: 50,
                page: 1,
                projectCode: value
            });
            record.outKWList = res.data.object?.list.map(item => ({
                label: `${item.projectName} (${item.projectCode})`,
                value: item.projectCode
            }));
            record.isOnLoadSearchProject = true;
        } catch (error) {
            console.log(error);
        } finally {
            record.loading = false;
        }
    }, 300);
    const getMaterial = (data: any) => {
        data.forEach((item: any) => {
            dataSource.value.push({
                countId: countId,
                ...item,
                materialUnitName: item.materialUnitName,
                outNum: '',
                selectPositionList: unref(selectPositionList)
            });
            countId++;
        });
    };
    const onAdd = () => {
        openAddProcessFromMaterielModalDom();
    };
    const onDelete = () => {
        const { selectedRowKeys } = unref(selectedRowInfo);
        dataSource.value = dataSource.value.filter(item => {
            if (!selectedRowKeys.includes(item.countId)) return item;
        });
        selectedRowInfo.value.selectedRowKeys = [];
    };
    const submit = async () => {
        await new Promise((res, rej) => {
            if (dataSource.value.length) {
                res(true);
            } else {
                message.warning('请新增物料后，再执行保存操作！');
                rej();
            }
        });
        await submitForm();
        return { tableList: [...unref(dataSource)] };
    };
    watchEffect(() => {
        if (props.originalInfo && props.originalInfo.length !== 0) {
            console.log(props.originalInfo);
            dataSource.value = props.originalInfo;
            // console.log(setTableList);

            // setTimeout(() => {
            //     setTableList(props.originalInfo);
            // }, 1000);
        }
    });
    defineExpose({ submit });
</script>

<style lang="less">
    .OtherOutStoreDetail {
        .nStorageDetail-header {
            display: flex;
        }

        &.tpf-collapse {
            .tpf-collapse-content {
                padding: 12px;
                box-sizing: border-box;
                height: 380px;
                display: flex;
                flex-direction: column;

                // .table-form {
                //     flex: 1 0 0;
                // }

                // .tpf-table {
                //     height: 100%;
                // }
            }
        }
    }
</style>
