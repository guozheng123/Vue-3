<template>
    <div class="content">
        <TpfLayout>
            <template #header>
                <LoadingSkeleton>
                    <TpfForm :pageCode="pageCode" @onSubmit="onSubmit" isConfig />
                </LoadingSkeleton>
            </template>
            <template #content>
                <LoadingSkeleton>
                    <TpfTableLayout showChangeTableFontSize showChangeTableGap :pageCode="pageCode">
                        <template #default="args">
                            <TpfTable
                                v-bind="{
                                    ...args,
                                    ...tableInfo,
                                    loading,
                                    pagination,
                                    seq: true,
                                    beforeRender
                                }"
                            />
                        </template>
                        <template #operateLeft>
                            <a-button
                                type="primary"
                                :disabled="!selectedRowInfo.selectedRowKeys.length"
                                class="tpf-button"
                                @click="onRollback"
                            >
                                <template #icon>
                                    <SvgIcon
                                        type="icon-chehuigongxujihua"
                                        style="margin-right: 5px"
                                    />
                                </template>
                                撤回工序计划
                            </a-button>

                            <a-dropdown>
                                <a-button class="tpf-button">
                                    强制执行
                                    <DownOutlined />
                                </a-button>
                                <template #overlay>
                                    <a-menu @click="execute">
                                        <a-menu-item key="1">强制完工</a-menu-item>
                                        <a-menu-item key="2">强制关闭</a-menu-item>
                                    </a-menu>
                                </template>
                            </a-dropdown>

                            <a-dropdown>
                                <a-button class="tpf-button">
                                    打印
                                    <DownOutlined />
                                </a-button>
                                <template #overlay>
                                    <a-menu @click="onPrint">
                                        <a-menu-item key="1">工序任务单</a-menu-item>
                                        <a-menu-item key="2">序列号</a-menu-item>
                                    </a-menu>
                                </template>
                            </a-dropdown>

                            <!-- <a-button
                                class="tpf-button"
                                type="primary"
                                @click="onPrint"
                                :disabled="!selectedRowInfo.selectedRowKeys.length"
                            >
                                <SvgIcon type="icon-dayin" style="margin-right: 5px" /> 打印
                            </a-button> -->
                            <a-button @click="exportTable" class="tpf-button" type="primary" ghost>
                                <template #icon>
                                    <SvgIcon type="icon-daochu" style="margin-right: 5px" />
                                </template>
                                导出
                            </a-button>
                        </template>
                    </TpfTableLayout>
                </LoadingSkeleton>
            </template>
        </TpfLayout>

        <PrintOperation ref="printOperation" />
        <PrintNumber ref="printNumber" />
        <ViewSerialNumber ref="viewSerialNumber" />
    </div>
</template>

<script setup lang="tsx" name="OperationTaskList">
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, unref, defineAsyncComponent, onMounted } from 'vue';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { TpfColumnType } from '@/types';
    import {
        useOperationTaskListAPi,
        queryOperationTaskOrderList,
        useFilesystemApi,
        useQueryAPi
    } from '@/api';
    import { PageCodeEnum, getTpfOptionEnum } from '@/config';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { DownOutlined } from '@ant-design/icons-vue';
    import { withTpfTableSortColumn } from '@/components/TpfTable/index';
    import { message, Badge } from 'ant-design-vue';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import { useRouter } from 'vue-router';
    import { useStore } from '@/store';

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const PrintOperation = defineAsyncComponent(
        () => import('./operationTaskListDetail/components/PrintOperation.vue')
    );

    const PrintNumber = defineAsyncComponent(
        () => import('./operationTaskListDetail/components/PrintNumber.vue')
    );

    const ViewSerialNumber = defineAsyncComponent(
        () => import('./operationTaskListDetail/components/ViewSerialNumber.vue')
    );

    const [printOperation, onOpenPrintOperation] = useOpenAntdModal();
    const [printNumber, onOpenPrintNumber] = useOpenAntdModal();
    const [viewSerialNumber, onOpenViewSerialNumber] = useOpenAntdModal();

    const router = useRouter();
    const filesystemApi = useFilesystemApi();
    const { cacheSearchStore } = useStore();

    const {
        statusNameColor,
        getLabel,
        workOrderStatus,
        orderSource,
        statusOptionStr,
        productionOrderTypeCodeEnum,
        operationTaskType
    } = getTpfOptionEnum();
    const pageCode = PageCodeEnum.operationTaskOrder;
    const operationTaskListAPi = useOperationTaskListAPi();
    const useQuery = useQueryAPi();

    const searchInfo = ref<{ [k: string]: any }>({});
    const exportFileParams = ref();
    const beforeRender = (list: TpfColumnType[]) => {
        return unref(list).map(item => {
            if (item.dataIndex === 'operation_task_order_code') {
                item.sorter = {
                    compare: (a: queryOperationTaskOrderList, b: queryOperationTaskOrderList) => {
                        return withTpfTableSortColumn(a, b)('operation_task_order_code');
                    }
                };
                item.customRender = ({ text, record }) => {
                    return (
                        <a
                            onClick={() => {
                                router.push({
                                    path: '/productionManagement/operationTaskList/operationTaskListDetail',
                                    query: {
                                        operationTaskOrderId: unref(record).result_entity_id
                                    }
                                });
                            }}
                        >
                            {text}
                        </a>
                    );
                };
            }
            if (item.dataIndex === 'work_order_code') {
                item.sorter = {
                    compare: (a: queryOperationTaskOrderList, b: queryOperationTaskOrderList) => {
                        return withTpfTableSortColumn(a, b)('work_order_code');
                    }
                };
            }
            if (item.dataIndex === 'work_order_code-production_order_code') {
                item.sorter = {
                    compare: (a: queryOperationTaskOrderList, b: queryOperationTaskOrderList) => {
                        return withTpfTableSortColumn(
                            a,
                            b
                        )('work_order_code-production_order_code');
                    }
                };
            }

            if (item.dataIndex === 'operation_task_order_status') {
                item.customRender = ({ text }) => {
                    const showText = getLabel(text, workOrderStatus);
                    return <Badge color={getLabel(showText, statusNameColor)} text={showText} />;
                };
            }
            if (item.dataIndex === 'work_order_code-production_order_code-order_type_code') {
                item.customRender = ({ text }) => getLabel(text, productionOrderTypeCodeEnum);
            }
            if (item.dataIndex === 'work_order_code-production_order_code-report_in_order') {
                item.customRender = ({ text }) => getLabel(text, statusOptionStr);
            }
            if (item.dataIndex === 'work_order_code-production_order_code-order_source') {
                item.customRender = ({ text }) => getLabel(text, orderSource);
            }
            if (item.dataIndex === 'work_order_code-production_order_code-equipment_debug') {
                item.customRender = ({ text }) => getLabel(text, statusOptionStr);
            }

            if (item.dataIndex === 'operation_task_order_code-PZSQL_order_number_count') {
                item.customRender = ({ text, record }) => {
                    return <a onClick={() => openOrderNumber(record)}>{text}</a>;
                };
            }
            if (item.dataIndex === 'work_order_code-report_number_type') {
                item.customRender = ({ text }) => getLabel(text, operationTaskType);
            }

            return item;
        });
    };

    const onSubmit = (res: any) => {
        searchInfo.value = unref(res) || {};
        getDataList();
    };

    const openOrderNumber = async (record: any) => {
        const arr = [];
        arr.push(record.operation_task_order_code);
        onOpenViewSerialNumber(arr);
        // const res = await operationTaskListAPi.queryWorkOrderSerialNumberList({
        //     operationTaskOrderCode: arr
        // });
        // console.log(res);
    };
    const { tableInfo, pagination, loading, getDataList, selectedRowInfo } = useAntdTable({
        api: async pageInfo => {
            const { current, pageSize } = unref(pageInfo);
            exportFileParams.value = {
                page: current,
                pageSize,
                ...unref(searchInfo),
                sortedField: 'create_datetime',
                sortByAsc: false
            };
            const res = await useQuery.execute(unref(exportFileParams));
            return res.data.object;
        },
        rowKey: 'result_entity_id',
        isPageAble: true,
        isConfig: true,
        hasRowSelection: true
    });

    const onRollback = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定撤回工序计划?', title: '确定撤回' });
        const params = {
            operationTaskOrderId: unref(selectedRowInfo).selectedRowKeys
        };
        const res = await operationTaskListAPi.rollbackOperationTaskOrder(params);
        if (res.data.object.success === true) {
            message.success(res.data.object.message);
        } else {
            message.error(res.data.object.message);
        }
        getDataList();
    };
    const execute = async (e: any) => {
        if (selectedRowInfo.value.selectedRows.length === 0) {
            return message.warning('请勾选数据');
        }
        if (e.key === '1') {
            const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
            await TpfDelConfirm({
                content: '是否确认强制完工?此操作不可回退,对生产影响较大,请谨慎操作',
                title: '确认'
            });
            const res = await operationTaskListAPi.batchForcedFinish({
                operationTaskOrderId: unref(selectedRowInfo).selectedRowKeys
            });
            if (res.data.object.success === true) {
                message.success(res.data.object.message);
            }
            getDataList();
        } else {
            const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
            await TpfDelConfirm({
                content: '是否确认强制关闭?此操作不可回退,对生产影响较大,请谨慎操作',
                title: '确认'
            });
            const res = await operationTaskListAPi.batchForcedClose({
                operationTaskOrderId: unref(selectedRowInfo).selectedRowKeys
            });
            if (res.data.object.success === true) {
                message.success(res.data.object.message);
            }
            getDataList();
        }
    };
    const onPrint = async (e: any) => {
        if (e.key === '1') {
            onOpenPrintOperation({
                operationTaskOrderId: unref(selectedRowInfo).selectedRowKeys
            });
        } else {
            const ids = unref(selectedRowInfo).selectedRows.map(
                (e: queryOperationTaskOrderList) => {
                    return e.operation_task_order_code;
                }
            );
            onOpenPrintNumber(ids);
        }
    };
    const exportTable = async () => {
        const params = {
            ...unref(exportFileParams)
        };
        filesystemApi.exportFileList(() =>
            useQuery.exportListExcelFile({
                ...params,
                tableHeaderConfig: cacheSearchStore.getUploadLoadSortColumns(pageCode)
            })
        );
    };

    onMounted(async () => {});
</script>

<style lang="less" scoped>
    .content {
        height: 100%;
    }
</style>
