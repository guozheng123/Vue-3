<template>
    <TpfCollapse title="入库明细" class="inStorageDetail">
        <template #right>
            <a-button v-if="!isEdit" ghost type="primary" class="tpf-button" @click="onAdd">
                <SvgIcon type="icon-xinzeng" /> 新增
            </a-button>
            <a-button
                v-if="!isEdit"
                :disabled="selectedRowInfo.selectedRowKeys.length === 0"
                ghost
                type="primary"
                class="tpf-button"
                @click="onDelete"
            >
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

<script setup lang="tsx" name="inStorageDetail">
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import TpfTable from '@/components/TpfTable/index.vue';
    import { tableResizable } from '@/config';
    import { useAntdTable, useAntdForm } from '@/hooks';
    import { TpfColumnType } from '@/types';
    import { Select, FormItem, Input, message } from 'ant-design-vue';
    import { ref, computed, toRefs, unref, reactive, watchEffect } from 'vue';
    import {
        checkRequired,
        checkGreaterThan,
        checkNoChinese,
        checkNoSpace
    } from '@/formRuleConfig/Tpfrules';
    import TpfInputNumber from '@/components/TpfInputNumber/index.vue';
    import { useAddProcessFromMaterielModal } from '@/components';
    import { useWarehouseApi, useProjectApi } from '@/api';
    import { debounce } from 'lodash-es';
    import type { ResGetPositionDataList, ResGetStoreLocationDataList } from '@/api';

    type Props = {
        isEdit: boolean;
        originalInfo?: any;
    };

    const props = withDefaults(defineProps<Props>(), {
        isEdit: false
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
                    if (props.isEdit) {
                        return `${record.projectName || ''}${
                            record.projectCode ? '(' + record.projectCode + ')' : ''
                        }`;
                    }
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
                customRender: ({ record, text, index }) => {
                    let batchNoRule: any[] = [];
                    if (record.batchNo) {
                        batchNoRule = [checkNoChinese(), checkNoSpace()];
                    }
                    if (props.isEdit) {
                        return text;
                    }
                    return (
                        <FormItem
                            name={['dataSource', index, 'batchNo']}
                            rules={batchNoRule as any}
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
                customRender: ({ record, index, text }) => {
                    if (props.isEdit) {
                        return record.inNum;
                    }
                    return (
                        <FormItem
                            name={['dataSource', index, 'inNum']}
                            rules={[checkRequired(), checkGreaterThan()] as any}
                        >
                            <TpfInputNumber
                                style={{ width: '90%' }}
                                v-model={[record.inNum, 'value']}
                            />
                        </FormItem>
                    );
                }
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
                customRender: ({ record, index }) => {
                    if (props.isEdit) {
                        return record.positionName;
                    }
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
                customRender: ({ record, text }) => {
                    if (props.isEdit) {
                        return record.storeLocationName;
                    }
                    return (
                        <Select
                            options={record.selectStoreCodeList}
                            class={['workshopCodeRef']}
                            fieldNames={{ label: 'storeLocationName', value: 'storeLocationCode' }}
                            v-model={[record.storeLocationCode, 'value']}
                            style={{ width: '90%' }}
                        />
                    );
                }
            },
            {
                title: '说明',
                dataIndex: 'remarks',
                ...tableResizable(),
                customRender: ({ record, index, text }) => {
                    if (props.isEdit) {
                        return text;
                    }
                    return (
                        <FormItem name={['dataSource', index, 'remarks']}>
                            <Input v-model={[record.remarks, 'value']} maxlength={50} />
                        </FormItem>
                    );
                }
            }
        ] as TpfColumnType[];
    });
    const { tableInfo, pagination, selectedRowInfo, setTableList } = useAntdTable({
        api: async () => ({ list: [] }),
        rowKey: 'countId',
        isPageAble: false,
        hasRowSelection: !props.isEdit
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
                // ...item,
                materialCode: item.materialCode,
                materialName: item.materialName,
                materialUnitName: item.materialUnitName,
                materialUnitCode: item.materialUnitCode,
                inNum: '',
                supervisorModeCode: item.supervisorModeCode,
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

        const res = unref(dataSource).map((e: any) => {
            const params = {
                projectCode: e.projectCode,
                batchNo: e.batchNo,
                materialCode: e.materialCode,
                materialName: e.materialName,
                inNum: e.inNum,
                materialUnitName: e.materialUnitName,
                positionCode: e.positionCode,
                storeLocationCode: e.storeLocationCode,
                remarks: e.remarks
            };
            return params;
        });
        return res;
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
