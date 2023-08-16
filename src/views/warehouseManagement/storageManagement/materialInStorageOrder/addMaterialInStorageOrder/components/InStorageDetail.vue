<template>
    <TpfCollapse title="入库明细" class="inStorageDetail">
        <template #right>
            <a-button ghost type="primary" class="tpf-button" @click="onAdd">
                <SvgIcon type="icon-xinzeng" /> 新增
            </a-button>
            <a-button ghost type="primary" class="tpf-button" @click="onDelete">
                <SvgIcon type="icon-shanchu" /> 删除
            </a-button>
        </template>
        <TpfSubmitForm
            :formList="formList"
            ref="TpfFormRef"
            @onSubmit="onSubmit"
            :labelCol="{ style: { width: '130px' } }"
        />
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

<script setup lang="tsx" name="inStorageDetail">
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import TpfTable from '@/components/TpfTable/index.vue';
    import { tableResizable } from '@/config';
    import { useAntdTable, useAntdForm, useOpenAntdModal } from '@/hooks';
    import { TpfColumnType } from '@/types';
    import { Checkbox, Select, FormItem, Input, message } from 'ant-design-vue';
    import { ref, computed, toRefs, unref, reactive, defineAsyncComponent, onMounted } from 'vue';
    import { checkRequired, checkGreaterThan, checkNoChinese } from '@/formRuleConfig/Tpfrules';
    import TpfForm from '@/components/TpfForm/index.vue';
    import TpfInputNumber from '@/components/TpfInputNumber/index.vue';
    import { useTpfSubmitForm } from '@/components';
    import { useWarehouseApi, useProjectApi, useMaterialApi } from '@/api';
    import { debounce } from 'lodash-es';
    import { useAddProcessFromMaterielModal, useAddProcessFromBomModal } from '@/components';

    import type { ResGetPositionDataList, ResGetStoreLocationDataList } from '@/api';

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    type Props = {
        inStorageList?: { [k: string]: any }[];
    };
    const { TpfSubmitForm } = useTpfSubmitForm();
    const props = withDefaults(defineProps<Props>(), {
        inStorageList: () => []
    });
    const {
        AddProcessFromMaterielModal,
        addProcessFromMaterielModalDom,
        openAddProcessFromMaterielModalDom,
        showAddProcessFromMaterielModalDom
    } = useAddProcessFromMaterielModal();
    const projectApi = useProjectApi();
    const materialApi = useMaterialApi();
    const warehouseManagementAPi = useWarehouseApi();
    const { formRef, submitForm } = useAntdForm();
    const selectPositionList = ref<ResGetPositionDataList[]>([]);
    const selectStoreCodeList = ref<ResGetStoreLocationDataList[]>([]);
    const TpfFormRef = ref<InstanceType<typeof TpfForm> | null>(null);
    const searchInfo = ref<{ [key: string]: string }>();
    const tableForm = reactive<{ dataSource: { [k: string]: any }[] }>({
        dataSource: []
    });
    const { dataSource } = toRefs(tableForm);
    let countId = 1;
    const formList = computed(() => [
        {
            type: 'Select',
            field: 'positionCode',
            label: '批量选择入库仓位',
            allowClear: true,
            fieldNames: { label: 'name', value: 'code' },
            disabled: !unref(dataSource).length,
            options: [...unref(selectPositionList)],
            onChange: async (value: any) => {
                await TpfFormRef.value?.onSubmit();
                onUpdateTableList({ type: 'positionCode', value });
                onGetStoreList(value);
                resetStoreCode();
            },
            onFocus: () => onGetPositionList()
        },
        {
            type: 'Select',
            field: 'storeLocationCode',
            label: '批量选择入库库位',
            allowClear: true,
            fieldNames: { label: 'storeLocationName', value: 'storeLocationCode' },
            options: [...unref(selectStoreCodeList)],
            disabled: !unref(dataSource).length,
            onChange: async (value: string) => {
                await TpfFormRef.value?.onSubmit();
                onUpdateTableList({ type: 'storeLocationCode', value });
            }
        }
    ]);
    const columns = computed(() => {
        return [
            {
                title: '项目编号',
                dataIndex: 'projectCode',
                width: 260,
                customRender: ({ record, index }) => {
                    return (
                        <FormItem
                            name={['dataSource', index, 'projectCode']}
                            rules={[
                                {
                                    required:
                                        record.isOnLoadSearchProject && !record.outKWList.length,
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
            },
            {
                title: '批次号',
                dataIndex: 'batchNo',
                ...tableResizable(),
                customRender: ({ record, index }) => {
                    return (
                        <FormItem
                            name={['dataSource', index, 'batchNo']}
                            rules={
                                record.supervisorModeName === '批次管理'
                                    ? ([checkRequired(), checkNoChinese()] as any)
                                    : ([checkNoChinese()] as any)
                            }
                        >
                            <Input v-model={[record.batchNo, 'value']} maxlength={20} />
                        </FormItem>
                    );
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
                title: () => <span class="required"> 入库数</span>,
                dataIndex: 'inNum',
                ...tableResizable(),
                customRender: ({ record, index }) => {
                    return (
                        <FormItem
                            name={['dataSource', index, 'inNum']}
                            rules={[checkRequired(), checkGreaterThan()] as any}
                        >
                            <TpfInputNumber
                                style={{ width: '90%' }}
                                v-model={[record.inNum, 'value']}
                                {...{
                                    onChange: () => {
                                        onGetBasicNum(record, index);
                                    }
                                }}
                            />
                        </FormItem>
                    );
                }
            },
            {
                title: '到货单位',
                dataIndex: 'arrivalUnit',
                ...tableResizable(),
                customRender: ({ record, index }) => {
                    return (
                        <Select
                            options={record.inCWList}
                            v-model={[record.arrivalUnit, 'value']}
                            fieldNames={{
                                label: 'materialAuxiliaryUnitName',
                                value: 'materialAuxiliaryUnitCode'
                            }}
                            style={{ width: '90%' }}
                            onFocus={() => {
                                {
                                    onGetArrivalUnit(record, index);
                                }
                            }}
                            onChange={() => onGetBasicNum(record, index)}
                        />
                    );
                }
            },
            {
                title: '基本数量',
                dataIndex: 'basicNum',
                ...tableResizable()
            },
            {
                title: '基本单位',
                dataIndex: 'materialUnitName',
                ...tableResizable()
            },
            {
                title: () => <span class="required"> 入库仓位</span>,
                dataIndex: 'positionCode',
                ...tableResizable(),
                customRender: ({ record, text, index }) => {
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
            },
            {
                title: '入库库位',
                dataIndex: 'storeLocationCode',
                ...tableResizable(),
                customRender: ({ record, text, index }) => (
                    <Select
                        options={record.selectStoreCodeList}
                        class={['workshopCodeRef']}
                        fieldNames={{ label: 'storeLocationName', value: 'storeLocationCode' }}
                        v-model={[record.storeLocationCode, 'value']}
                        style={{ width: '90%' }}
                    />
                )
            }
        ] as TpfColumnType[];
    });
    const { tableInfo, pagination, selectedRowInfo, delSelectRow } = useAntdTable({
        api: async () => ({ list: [] }),
        rowKey: 'countId',
        isPageAble: false,
        hasRowSelection: true
    });
    const onSubmit = (val: any) => {
        searchInfo.value = unref(val);
    };
    const onGetArrivalUnit = async (record: any, index: number) => {
        try {
            if (record?.inCWList?.length && !record.onload) return;
            const res = await materialApi.getMaterialProductUnitList({
                materialCode: record.materialCode,
                enable: 1
            });
            res.data?.list.forEach((item: any) => {
                item.materialAuxiliaryUnitCode =
                    item.materialAuxiliaryUnitCode || item.materialUnitCode;
                item.materialAuxiliaryUnitName =
                    item.materialAuxiliaryUnitName || item.materialUnitName;
            });
            dataSource.value[index].inCWList = res.data.list || [];
            dataSource.value[index].onload = false;
        } catch (error) {
            console.log(error);
        }
    };
    const onUpdateTableList = async ({ type, value }: { type: string; value?: string }) => {
        dataSource.value.forEach(item => {
            item.selectPositionList = selectPositionList;
            item.selectStoreCodeList = selectStoreCodeList;
            if (type === 'positionCode') {
                item.positionCode = value;
                item.storeLocationCode = '';
            }
            if (type === 'storeLocationCode') {
                item.storeLocationCode = value;
            }
        });
        await submitForm();
    };
    const onGetBasicNum = (record: any, index: number) => {
        if (record?.inCWList?.length && record.arrivalUnit && record.inNum) {
            const l = record.inCWList.filter(
                (item: any) => item.materialAuxiliaryUnitCode === record.arrivalUnit
            );
            if (l.length) {
                const curData = l[0];
                dataSource.value[index].basicNum = Number(
                    (
                        (record.inNum * curData.materialUnitUsage) /
                        curData.materialAuxiliaryUnitUsage
                    ).toFixed(8)
                );
            }
        } else {
            dataSource.value[index].basicNum = '';
        }
    };
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
    const resetStoreCode = async () => {
        selectStoreCodeList.value = [];
        TpfFormRef.value?.setNewState({ ...unref(searchInfo), storeLocationCode: '' });
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
            item.inCWList = [
                {
                    materialAuxiliaryUnitName: item.materialUnitName,
                    materialAuxiliaryUnitCode: item.materialUnitCode,
                    materialAuxiliaryUnitUsage: item.materialUnitUsage || 1,
                    materialUnitUsage: item.materialUnitUsage || 1
                }
            ];
            dataSource.value.push({
                countId: countId,
                ...item,
                inNum: '',
                onload: true,
                arrivalUnit: item.materialUnitCode,
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
                message.warning('请新增物料后，再执行入库操作！');
                rej();
            }
        });
        await submitForm();
        return { tableList: [...unref(dataSource)] };
    };
    defineExpose({ submit });
</script>

<style lang="less">
    .inStorageDetail {
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
