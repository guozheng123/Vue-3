<template>
    <div class="table-operate-left">
        <a-button
            type="primary"
            class="tpf-button"
            @click="putIntoProduction"
            :disabled="selectedRowInfo.selectedRowKeys.length < 1"
        >
            <SvgIcon type="icon-touchan" class="t-mr-1" />
            投产
        </a-button>
        <a-button
            type="primary"
            class="tpf-button"
            @click="processPlanning"
            :disabled="selectedRowInfo.selectedRowKeys.length < 1"
        >
            <SvgIcon type="icon-gongxujihua" class="t-mr-1" />
            工序计划
        </a-button>
        <a-button
            type="primary"
            class="tpf-button"
            @click="rollbackOrder"
            :disabled="selectedRowInfo.selectedRowKeys.length < 1"
        >
            <SvgIcon type="icon-huituidingdan" class="t-mr-1" />
            回退订单
        </a-button>
        <a-dropdown>
            <a-button class="tpf-button" :disabled="selectedRowInfo.selectedRowKeys.length < 1">
                强制执行
                <DownOutlined />
            </a-button>
            <template #overlay>
                <a-menu @click="enforce">
                    <a-menu-item key="1">强制完工</a-menu-item>
                    <a-menu-item key="2">强制关闭</a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>

        <a-button
            type="primary"
            class="tpf-button"
            @click="storesRequisition"
            :disabled="selectedRowInfo.selectedRowKeys.length < 1"
        >
            <SvgIcon type="icon-lingliaoshenqingdan" class="t-mr-1" />
            领料申请单
        </a-button>

        <a-dropdown>
            <a-button class="tpf-button">
                打印
                <DownOutlined />
            </a-button>
            <template #overlay>
                <a-menu @click="onPrint">
                    <a-menu-item key="print">工序流转卡</a-menu-item>
                    <a-menu-item key="2">序列号</a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
        <a-button class="tpf-button" type="primary" @click="startExport" ghost>
            <SvgIcon type="icon-daochu" class="t-mr-1" /> 导出
        </a-button>
    </div>
</template>

<script setup lang="tsx">
    import { unref } from 'vue';
    import { message, MenuProps } from 'ant-design-vue';
    import { DownOutlined } from '@ant-design/icons-vue';
    import { useJobOrderAPi } from '@/api';
    import { useRouter } from 'vue-router';
    import type { MenuInfo } from 'ant-design-vue/lib/menu/src/interface';
    import { useRouteBase64 } from '@/hooks';

    const { encodeParams } = useRouteBase64();

    const jobOrderAPi = useJobOrderAPi();

    type Props = {
        selectedRowInfo: any;
    };
    const props = withDefaults(defineProps<Props>(), {
        selectedRowInfo: () => {}
    });
    const emit = defineEmits<{
        (e: 'getDataList'): void;
        (e: 'onOpenModal', val: { name: string; value: any }): void;
    }>();

    const router = useRouter();

    const modalTitle = async (content: string, title: string) => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        // }
        await TpfDelConfirm({ content, title });
    };
    // 投产
    const putIntoProduction = async () => {
        const isAllWorkOrderStatusNotProduce = unref(props.selectedRowInfo)?.selectedRows.every(
            (row: { workOrderStatus: string }) => row.workOrderStatus === 'UNSTART'
        );
        if (!isAllWorkOrderStatusNotProduce) {
            message.error('有工单不是未投产状态，无法操作');
            return;
        }
        await modalTitle('确认是否投产操作！', '确认投产！');
        const res = await jobOrderAPi.putIntoProduction({
            workOrderId: unref(props.selectedRowInfo).selectedRowKeys as number[]
        });
        if (res.data.object.success) {
            message.success(res.data.object.message);
            emit('getDataList');
        } else {
            message.error(res.data.object.message);
        }
    };

    //工序计划 OK
    const processPlanning = async () => {
        const res = await jobOrderAPi.workingProcedurePlan({
            workOrderId: unref(props.selectedRowInfo).selectedRowKeys
        });
        if (res.data.object.success === false) {
            message.error(res.data.object.message);
        } else {
            router.push({
                path: '/productionManagement/jobOrderList/processPlanning',
                query: {
                    params: unref(props.selectedRowInfo).selectedRowKeys.toString()
                }
            });
        }
    };

    //回退订单
    const rollbackOrder = async () => {
        const isInvalid = unref(props.selectedRowInfo)?.selectedRows.some(
            (row: { workOrderStatus: string }) =>
                row.workOrderStatus !== 'UNSTART' && row.workOrderStatus !== 'START'
        );

        if (isInvalid) {
            message.error('该工单不是投产或未投产状态，无法操作');
            return;
        }
        await modalTitle('确认是否回退订单操作！', '确认回退订单！');
        const res = await jobOrderAPi.rollbackOrder({
            workOrderId: unref(props.selectedRowInfo).selectedRowKeys as number[]
        });
        if (res.data.object.success) {
            message.success(res.data.object.message);
            emit('getDataList');
        } else {
            message.error(res.data.object.message);
        }
    };

    //强制执行 1强制完工 2强制关闭
    const enforce: MenuProps['onClick'] = async e => {
        if (e.key === '1') {
            await modalTitle('确认是否强制完工操作！', '确认强制完工！');
            const res = await jobOrderAPi.batchForcedFinish({
                workOrderId: unref(props.selectedRowInfo).selectedRowKeys as number[]
            });
            if (res.data.object.success) {
                message.success(res.data.object.message);
                emit('getDataList');
            } else {
                message.error(res.data.object.message);
            }
        } else {
            await modalTitle('确认是否强制关闭操作！', '确认强制关闭！');
            const res = await jobOrderAPi.batchForcedClose({
                workOrderId: unref(props.selectedRowInfo).selectedRowKeys as number[]
            });
            if (res.data.object.success) {
                message.success(res.data.object.message);
                emit('getDataList');
            } else {
                message.error(res.data.object.message);
            }
        }
    };

    const goToCustomerPrint = async () => {
        const { selectedRowKeys } = props.selectedRowInfo;
        if (selectedRowKeys.length === 0) {
            message.warning('请选择数据!');
            return;
        }
        const { object } = await jobOrderAPi
            .printProcessFlowCard({
                workOrderId: selectedRowKeys
            })
            .then(res => res.data);
        if (object.status === false) {
            message.error(object.message);
            return;
        }
        router.push({
            path: '/systemManage/customPrint/customPrintEdit',
            query: encodeParams({
                ids: selectedRowKeys,
                type: 'print',
                templateTypeCode: 'PROCESS_FLOW_CARD_CODE'
            })
        });
    };

    // 打印
    const onPrint = (menuInfo: MenuInfo) => {
        const e = menuInfo;
        if (e.key === 'print') {
            goToCustomerPrint();
            // emit('onOpenModal', {
            //     name: 'onOpenProcessFlowCardModal',
            //     value: unref(props.selectedRowInfo).selectedRowKeys
            // });
        } else {
            console.log(props.selectedRowInfo);
            if (!props.selectedRowInfo) return;
            if (props.selectedRowInfo?.selectedRows.length === 0) {
                message.warning('请勾选数据');
                return false;
            }

            let isBATCH = false;
            unref(props.selectedRowInfo).selectedRows.forEach((e: { reportNumberType: string }) => {
                if (e.reportNumberType === 'BATCH') {
                    isBATCH = true;
                }
            });
            if (isBATCH) {
                message.warning('该工单为批次管理,无法打印工单序列号');
                return false;
            }

            const ids = unref(props.selectedRowInfo).selectedRows.map(
                (e: { workOrderCode: string }) => {
                    return e.workOrderCode;
                }
            );
            emit('onOpenModal', { name: 'onOpenViewWorkOrderSerialNumber', value: ids });
        }
    };

    const storesRequisition = async () => {
        const res = await jobOrderAPi.materialRequisition({
            workOrderId: unref(props.selectedRowInfo).selectedRowKeys
        });
        if (res.data.object.success === false) {
            const { errorList } = res.data.object;
            errorList.forEach(ele => {
                message.error(ele.workOrderCode + ele.message);
            });
            return;
        } else {
            const workOderCodes = unref(props.selectedRowInfo)
                .selectedRows.map((e: any) => e.workOrderCode)
                .toString();
            router.push({
                path: '/productionManagement/jobOrderList/storesRequisition',
                query: {
                    workOrderIdParams: unref(props.selectedRowInfo).selectedRowKeys.toString(),
                    workOderCodeParams: workOderCodes
                }
            });
        }
    };

    // 导出
    const startExport = async () => {
        emit('onOpenModal', { name: 'startExport', value: '' });
    };
</script>

<style lang="less">
    .table-operate-left {
        display: flex;
        gap: 10px;
    }
</style>
