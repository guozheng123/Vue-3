<template>
    <TpfLayout class="moveInventory">
        <template #header>
            <LoadingSkeleton><MoveInventoryForm ref="moveInventoryForm" /></LoadingSkeleton>
        </template>
        <template #content>
            <LoadingSkeleton>
                <TpfTableLayout showChangeTableFontSize showChangeTableGap>
                    <template #default="args">
                        <a-form ref="formRef" :model="tableForm" class="table-form">
                            <TpfTable
                                class="tpf-table-form"
                                v-bind="{
                                    ...args,
                                    ...tableInfo,
                                    columns,
                                    seq: true
                                }"
                                :dataSource="dataSource"
                        /></a-form>
                    </template>
                    <template #operateLeft>
                        <a-button type="primary" class="tpf-button" ghost @click="onAdd">
                            <SvgIcon type="icon-tianjia" />添加
                        </a-button>
                        <a-button
                            class="tpf-button"
                            type="primary"
                            :disabled="isEmpty(selectedRowInfo.selectedRowKeys)"
                            @click="onStartMove"
                            ghost
                        >
                            <SvgIcon type="icon-daochu" /> 执行移库
                        </a-button>
                        <a-button
                            class="tpf-button"
                            type="primary"
                            :disabled="isEmpty(selectedRowInfo.selectedRowKeys)"
                            @click="onGetDelConfirm"
                            ghost
                        >
                            <SvgIcon type="icon-shanchu" /> 删除
                        </a-button>
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
        <AddProcessFromMaterielModal
            v-if="showAddProcessFromMaterielModalDom"
            ref="addProcessFromMaterielModalDom"
            :unHasRowSelection="true"
            @getMaterialCode="getMaterialCode"
        />
    </TpfLayout>
</template>

<script setup lang="tsx" name="moveInventory">
    import { useProjectApi, useWarehouseApi, useMaterialApi, ReqConfirmMoveStore } from '@/api';
    import { FormItem, Select, message } from 'ant-design-vue';
    import { checkRequired, checkNoChinese, checkGreaterThan } from '@/formRuleConfig/Tpfrules';
    import { tableResizable } from '@/config';
    import { isEmpty } from 'lodash-es';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { useAntdForm, useAntdTable } from '@/hooks';
    import { ref, computed, unref, toRefs, defineAsyncComponent, reactive } from 'vue';
    import TpfInputNumber from '@/components/TpfInputNumber/index.vue';
    import BigNumber from 'bignumber.js';
    import { useAddProcessFromMaterielModal } from '@/components';
    import TpfAutoComplete from '@/components/TpfAutoComplete/TpfAutoComplete.vue';
    import { debounce } from 'lodash-es';

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));
    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );

    const MoveInventoryForm = defineAsyncComponent(
        () => import('./components/MoveInventoryForm.vue')
    );
    const warehouseApi = useWarehouseApi();
    const materialApi = useMaterialApi();
    const projectApi = useProjectApi();
    const {
        AddProcessFromMaterielModal,
        addProcessFromMaterielModalDom,
        openAddProcessFromMaterielModalDom,
        showAddProcessFromMaterielModalDom
    } = useAddProcessFromMaterielModal();
    let countId = 1;
    let selectMaterialIndex = -1;
    const loading = ref(false);
    const moveInventoryForm = ref<InstanceType<typeof MoveInventoryForm> | null>(null);
    const { formRef, validateFields } = useAntdForm();
    const tableForm = reactive<{ dataSource: { [k: string]: any }[] }>({
        dataSource: []
    });
    const { dataSource } = toRefs(tableForm);

    const columns = computed(() => [
        {
            title: () => <span class="required"> 物料编号</span>,
            dataIndex: 'materialCode',
            ...tableResizable(),
            customRender: ({ record, index }) => {
                return (
                    <FormItem
                        name={['dataSource', index, 'materialCode']}
                        rules={[checkRequired()] as any}
                    >
                        <TpfAutoComplete
                            options={record.materialList}
                            class={['workshopCodeRef']}
                            fieldNames={{ label: 'materialCode', value: 'materialCode' }}
                            v-model:value={record.materialCode}
                            style={{ width: '90%' }}
                            onSelectValue={(row, text) => onMaterialChange(record, text)}
                            onSearchInput={(value: string) => {
                                onGetMaterialList(record, value);
                            }}
                            onClickIcon={() => {
                                selectMaterialIndex = index;
                                record.materialList = [];
                                openAddProcessFromMaterielModalDom();
                            }}
                        />
                    </FormItem>
                );
            }
        },
        {
            title: '物料名称',
            dataIndex: 'materialName',
            ...tableResizable()
        },
        {
            title: () => <span class="required"> 调出仓位名称</span>,
            dataIndex: 'outPositionCode',
            ...tableResizable(),
            customRender: ({ record, index }) => {
                return (
                    <FormItem
                        name={['dataSource', index, 'outPositionCode']}
                        rules={[checkRequired()] as any}
                    >
                        <Select
                            options={record.outPositionList}
                            showSearch={true}
                            allowClear={true}
                            fieldNames={{ label: 'name', value: 'code' }}
                            v-model={[record.outPositionCode, 'value']}
                            style={{ width: '90%' }}
                            onFocus={() => {
                                if (!record.outPositionList?.length)
                                    onGetPositionList(record, 'out');
                            }}
                            onSearch={(value: string) => {
                                onGetPositionList(record, 'out', value);
                            }}
                            onChange={() => {
                                record.outStoreLocationCode = '';
                                record.outStoreLocationList = [];
                            }}
                            filterOption={() => true}
                        />
                    </FormItem>
                );
            }
        },
        {
            title: '调出库位名称',
            dataIndex: 'outStoreLocationCode',
            ...tableResizable(),
            customRender: ({ record, index }) => {
                return (
                    <FormItem name={['dataSource', index, 'outStoreLocationCode']}>
                        <Select
                            disabled={record.outPositionCode ? false : true}
                            showSearch={true}
                            allowClear={true}
                            fieldNames={{ label: 'storeLocationName', value: 'storeLocationCode' }}
                            options={record.outStoreLocationList}
                            v-model={[record.outStoreLocationCode, 'value']}
                            style={{ width: '90%' }}
                            onFocus={() => {
                                if (!record.outStoreLocationList?.length)
                                    onGetStoreLocationList({
                                        record,
                                        listName: 'out',
                                        name: '',
                                        positionCode: record.outPositionCode
                                    });
                            }}
                            onSearch={(value: string) => {
                                onGetStoreLocationList({
                                    record,
                                    listName: 'out',
                                    name: value,
                                    positionCode: record.outPositionCode
                                });
                            }}
                            filterOption={() => true}
                        />
                    </FormItem>
                );
            }
        },
        {
            title: '调出项目名称',
            dataIndex: 'outProjectCode',
            ...tableResizable(),
            customRender: ({ record, index }) => {
                return (
                    <FormItem name={['dataSource', index, 'outProjectCode']}>
                        <Select
                            showSearch={true}
                            allowClear={true}
                            fieldNames={{ label: 'projectName', value: 'projectCode' }}
                            options={record.outProjectList}
                            v-model={[record.outProjectCode, 'value']}
                            style={{ width: '90%' }}
                            onFocus={() => {
                                if (!record.outProjectList?.length) onGetProjectList(record, 'out');
                            }}
                            onSearch={(value: string) => {
                                onGetProjectList(record, 'out', value);
                            }}
                            filterOption={() => true}
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
                            ['1', '批次管理'].includes(record.supervisorModeCode)
                                ? ([checkRequired(), checkNoChinese()] as any)
                                : ([checkNoChinese()] as any)
                        }
                    >
                        <Select
                            allowClear={true}
                            options={record.batchNoList}
                            v-model={[record.batchNo, 'value']}
                            style={{ width: '90%' }}
                            showSearch
                            disabled={!['1', '批次管理'].includes(record.supervisorModeCode)}
                            onFocus={() => {
                                if (!record.batchNoList?.length)
                                    onGetBatchNoList(record, record.materialCode);
                            }}
                            filterOption={() => true}
                        />
                    </FormItem>
                );
            }
        },
        {
            title: () => <span class="required"> 调入仓位名称</span>,
            dataIndex: 'inPositionCode',
            ...tableResizable(),
            customRender: ({ record, index }) => {
                return (
                    <FormItem
                        name={['dataSource', index, 'inPositionCode']}
                        rules={[checkRequired()] as any}
                    >
                        <Select
                            showSearch={true}
                            allowClear={true}
                            fieldNames={{ label: 'name', value: 'code' }}
                            options={record.inPositionList}
                            v-model={[record.inPositionCode, 'value']}
                            style={{ width: '90%' }}
                            onFocus={() => {
                                if (!record.inPositionList?.length) onGetPositionList(record, 'in');
                            }}
                            onSearch={(value: string) => {
                                onGetPositionList(record, 'in', value);
                            }}
                            onChange={() => {
                                record.inStoreLocationCode = '';
                                record.inStoreLocationList = [];
                            }}
                            filterOption={() => true}
                        />
                    </FormItem>
                );
            }
        },
        {
            title: '调入库位名称',
            dataIndex: 'inStoreLocationCode',
            ...tableResizable(),
            customRender: ({ record, index }) => {
                return (
                    <FormItem name={['dataSource', index, 'inStoreLocationCode']}>
                        <Select
                            disabled={record.inPositionCode ? false : true}
                            showSearch={true}
                            allowClear={true}
                            fieldNames={{ label: 'storeLocationName', value: 'storeLocationCode' }}
                            options={record.inStoreLocationList}
                            v-model={[record.inStoreLocationCode, 'value']}
                            style={{ width: '90%' }}
                            onFocus={() => {
                                if (!record.inStoreLocationList?.length)
                                    onGetStoreLocationList({
                                        record,
                                        listName: 'in',
                                        name: '',
                                        positionCode: record.inPositionCode
                                    });
                            }}
                            onSearch={(value: string) => {
                                onGetStoreLocationList({
                                    record,
                                    listName: 'in',
                                    name: value,
                                    positionCode: record.inPositionCode
                                });
                            }}
                            filterOption={() => true}
                        />
                    </FormItem>
                );
            }
        },
        {
            title: '调入项目名称',
            dataIndex: 'inProjectCode',
            ...tableResizable(),
            customRender: ({ record, index }) => {
                return (
                    <FormItem name={['dataSource', index, 'inProjectCode']}>
                        <Select
                            showSearch={true}
                            allowClear={true}
                            fieldNames={{ label: 'projectName', value: 'projectCode' }}
                            options={record.inProjectList}
                            v-model={[record.inProjectCode, 'value']}
                            style={{ width: '90%' }}
                            onFocus={() => {
                                if (!record.inProjectList?.length) onGetProjectList(record, 'in');
                            }}
                            onSearch={(value: string) => {
                                onGetProjectList(record, 'in', value);
                            }}
                            filterOption={() => true}
                        />
                    </FormItem>
                );
            }
        },
        {
            title: () => <span class="required"> 移库数量</span>,
            dataIndex: 'moveNum',
            ...tableResizable(),
            customRender: ({ record, index }) => {
                return (
                    <FormItem
                        name={['dataSource', index, 'moveNum']}
                        rules={[checkRequired(), checkGreaterThan()] as any}
                    >
                        <TpfInputNumber
                            style={{ width: '90%' }}
                            v-model={[record.moveNum, 'value']}
                            {...{
                                onChange: () => {
                                    onGetBasicNum(record);
                                }
                            }}
                        />
                    </FormItem>
                );
            }
        },
        {
            title: () => <span class="required"> 移库单位</span>,
            dataIndex: 'moveUnitCode',
            ...tableResizable(),
            customRender: ({ record, index }) => {
                return (
                    <FormItem
                        name={['dataSource', index, 'moveUnitCode']}
                        rules={[checkRequired()] as any}
                    >
                        <Select
                            options={record.inYKList}
                            v-model:value={record.moveUnitCode}
                            style={{ width: '90%' }}
                            fieldNames={{
                                label: 'materialAuxiliaryUnitName',
                                value: 'materialAuxiliaryUnitCode'
                            }}
                            onFocus={() => {
                                {
                                    onGetArrivalUnit(record, index);
                                }
                            }}
                            onChange={() => {
                                onSetConvertRate(record);
                                onGetBasicNum(record);
                            }}
                        />
                    </FormItem>
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
            dataIndex: 'basicUnit',
            ...tableResizable()
        }
    ]);

    const onAdd = async () => {
        const data = await unref(moveInventoryForm)?.onGetSearchData();
        onSetMaterialInfo(data);
        dataSource.value.push({ ...(data as any), ids: countId, moveNum: '' });
        countId++;
        // unref(moveInventoryForm)?.reset();
    };
    const onSetMaterialInfo = async (record: any) => {
        record.materialName = '';
        if (record.materialList.length && record.materialCode) {
            const list = record.materialList.filter(
                (item: any) => item.materialCode === record.materialCode
            );
            if (list.length) {
                const info = list[0];
                record.materialName = info.materialName;
                record.supervisorModeCode = info.supervisorModeCode;
                record.moveUnitCode = info.materialUnitCode;
                record.basicUnit = info.materialUnitName;
                record.inYKList = [
                    {
                        materialAuxiliaryUnitName: info.materialUnitName,
                        materialAuxiliaryUnitCode: info.materialUnitCode
                    }
                ];
                record.convertRate = '1';
                record.onLoadYK = true;
                await validateFields([
                    ['dataSource', record.ids - 1, 'moveUnitCode'],
                    ['dataSource', record.ids - 1, 'materialCode'],
                    ['dataSource', record.ids - 1, 'batchNo']
                ]);
            }
        } else {
            record.inYKList = [];
            record.basicUnit = '';
            record.basicNum = '';
            record.moveUnitCode = '';
        }
        record.batchNo = '';
        record.batchNoList = [];
    };

    const onMaterialChange = (record: any, text?: string) => {
        record.materialCode = text;
        onSetMaterialInfo(record);
        onGetBasicNum(record);
    };
    const onGetArrivalUnit = async (record: any, index: number) => {
        try {
            if ((record?.inYKList?.length && !record.onLoadYK) || !record.materialCode) return;
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
            dataSource.value[index].inYKList = res.data.list || [];
            dataSource.value[index].onLoadYK = false;
        } catch (error) {
            console.log(error);
        }
    };
    const onSetConvertRate = (record: any) => {
        if (record.inYKList?.length && record.moveNum && record.moveUnitCode) {
            const l = record.inYKList.filter(
                (item: any) => item.materialAuxiliaryUnitCode === record.moveUnitCode
            );
            if (l.length) {
                const info = l[0];
                record.convertRate = new BigNumber(
                    (info.materialUnitUsage / info.materialAuxiliaryUnitUsage).toFixed(8)
                ).toFixed();
            }
        }
    };
    const onGetBasicNum = (record: any) => {
        if (!(record.moveNum > 0)) {
            record.basicNum = '';
            return;
        }
        if (record.convertRate) {
            record.basicNum = new BigNumber(
                Number((record.moveNum * record.convertRate).toFixed(8))
            ).toFixed();
            return;
        } else {
            record.basicNum = '';
        }
    };
    const { tableInfo, selectedRowInfo } = useAntdTable({
        api: async () => {
            return { list: [] };
        },
        rowKey: 'ids',
        isPageAble: false,
        hasRowSelection: true
    });
    const rulesName = [
        'materialCode',
        'outPositionCode',
        'batchNo',
        'inPositionCode',
        'moveNum',
        'moveUnitCode'
    ];
    const onStartMove = async () => {
        try {
            const validateFieldsArr = selectedRowInfo.value.selectedRows.reduce(
                (prev, cur: any, index) => {
                    rulesName.forEach((v: string) => prev.push(['dataSource', cur.ids - 1, v]));
                    return prev;
                },
                [] as any[]
            );
            await validateFields(validateFieldsArr);
            loading.value = true;
            const { data } = await warehouseApi.confirmMoveStore({
                dtoList: selectedRowInfo.value.selectedRows.map((item: ReqConfirmMoveStore) => {
                    return {
                        materialCode: item.materialCode,
                        outPositionCode: item.outPositionCode,
                        outStoreLocationCode: item.outStoreLocationCode,
                        outProjectCode: item.outProjectCode,
                        inPositionCode: item.inPositionCode,
                        inStoreLocationCode: item.inStoreLocationCode,
                        inProjectCode: item.inProjectCode,
                        batchNo: item.batchNo,
                        moveNum: item.moveNum,
                        moveUnitCode: item.moveUnitCode,
                        basicNum: item.basicNum,
                        basicUnit: item.basicUnit,
                        outOrgCode:
                            item.outPositionList?.filter(v => item.outPositionCode === v.code)[0][
                                'orgCode'
                            ] || '',
                        inOrgCode:
                            item.inPositionList?.filter(v => item.inPositionCode === v.code)[0][
                                'orgCode'
                            ] || ''
                    };
                })
            });
            onDelete();
            message.success('执行成功！');
        } catch (error) {
            console.log(error);
        } finally {
            loading.value = false;
        }
    };

    const onDelete = async () => {
        const { selectedRowKeys } = unref(selectedRowInfo);
        dataSource.value =
            unref(dataSource)?.filter(item => {
                if (!selectedRowKeys.includes(item.ids)) return item;
            }) || [];
        // 删除需要重置 ids
        countId = 1;
        dataSource.value.forEach(item => {
            item.ids = countId;
            countId++;
        });
        unref(selectedRowInfo).selectedRowKeys = [];
    };
    const onGetDelConfirm = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定删除选中的数据吗？' });
        onDelete();
    };
    // 获取  仓位
    const onGetPositionList = async (record: any, key: string, name?: string) => {
        try {
            const { data } = await warehouseApi.queryPositionListByParam({
                page: 1,
                pageSize: 20,
                name
            });
            if (key === 'out') {
                record.outPositionList = data?.list || [];
            } else {
                record.inPositionList = data?.list || [];
            }
        } catch (error) {
            console.log(error);
        }
    };
    // 获取  库位
    const onGetStoreLocationList = async ({
        record,
        listName,
        name,
        positionCode
    }: {
        [key: string]: any;
    }) => {
        try {
            const { data } = await await warehouseApi.queryStoreLocationByParam({
                page: 1,
                pageSize: 20,
                isUsed: 1,
                storeLocationName: name,
                positionCode
            });

            if (listName === 'out') {
                record.outStoreLocationList = data?.object?.list || [];
            } else {
                record.inStoreLocationList = data?.object?.list || [];
            }
        } catch (error) {
            console.log(error);
        }
    };
    // 获取  项目
    const onGetProjectList = async (record: any, key: string, name?: string) => {
        try {
            const { data } = await projectApi.queryProjectListByPage({
                page: 1,
                pageSize: 20,
                projectName: name,
                forbidden: '1'
            });
            if (key === 'out') {
                record.outProjectList = data?.object?.list || [];
            } else {
                record.inProjectList = data?.object?.list || [];
            }
        } catch (error) {
            console.log(error);
        }
    };
    // 获取  物料
    let requestId = 0;
    const onGetMaterialList = debounce(async (record: any, name?: string) => {
        try {
            requestId++;
            const responseId = requestId;
            const { data } = await materialApi.queryMaterialPopoutListByPage({
                page: 1,
                pageSize: 20,
                materialCode: name
            });
            if (requestId !== responseId) return;
            record.materialList = data?.object?.list || [];
        } catch (error) {
            console.log(error);
        }
    }, 300);
    // 获取  批次号
    const onGetBatchNoList = async (record: any, name: string) => {
        try {
            if (!name) return;
            const { data } = await warehouseApi.getBatchNoListByMaterialCode({
                materialCode: name
            });
            record.batchNoList =
                data.list?.map((item: string) => {
                    return {
                        label: item,
                        value: item
                    };
                }) || [];
        } catch (error) {
            console.log(error);
        }
    };
    const getMaterialCode = (data: { [key: string]: any }) => {
        const record = dataSource.value[selectMaterialIndex];
        record.materialList = [data];
        onMaterialChange(record, data.materialCode);
    };
</script>

<style lang="less">
    // .moveInventory {
    //     .table-form {
    //         flex: 1;

    //         .ant-form-item,
    //         .ant-form-item-control-input,
    //         .ant-form-item-control-input-content,
    //         .tpf-table {
    //             height: 100%;
    //         }
    //     }
    // }
</style>
