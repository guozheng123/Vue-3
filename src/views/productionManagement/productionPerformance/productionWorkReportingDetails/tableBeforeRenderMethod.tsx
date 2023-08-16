import { unref, getCurrentInstance, ref } from 'vue';
import type { TpfColumnType, TpfOperateBtn } from '@/types';
import { getTpfOptionEnum } from '@/config';
import { useRouter } from 'vue-router';
import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
import { useRouteBase64 } from '@/hooks';

export const tableBeforeRenderMethod = <T extends Record<string, any>>() => {
    const {
        workOrderStatus,
        getLabel,
        productionStatus,
        workReportingStatus,
        timeUnitOption,
        workOrderSource
    } = getTpfOptionEnum();

    const proxy = getCurrentInstance();

    const router = useRouter();

    const { encodeParams } = useRouteBase64();

    const defaultBtn = [
        {
            title: '编辑',
            onClick: ({ record }) => {
                router.push({
                    path: '/productionManagement/productionPerformance/editProductionWorkReportingDetails',
                    query: encodeParams({ reportProgressId: record.report_progress_id })
                });
            }
        },
        {
            title: '工序BOM',
            onClick: ({ record }) => {
                router.push({
                    path: '/productionManagement/productionPerformance/detailProductionProcesses',
                    query: encodeParams({
                        reportProgressId: record.report_progress_id,
                        operationId: record.operation_id,
                        beReportProgressId: record.be_report_progress_id,
                        reportProgressCode: record.report_progress_code
                    })
                });
            }
        }
    ] as TpfOperateBtn<T>[];

    const operateColumn = ref<TpfColumnType<T>>({
        title: '操作',
        align: 'center',
        width: 170,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });

    const beforeRender = (list: TpfColumnType<T>[]) =>
        unref(list).map(item => {
            // if (item.dataIndex === 'work_order_code') {
            //     item.customRender = ({ record, text }) => {
            //         return <a onClick={() => proxy!.exposed!.onPicture(record)}>{text}</a>;
            //     };
            // }
            if (item.dataIndex === 'work_order_code-work_order_status') {
                item.customRender = ({ text }) => getLabel(text, workOrderStatus);
            }

            if (item.dataIndex === 'production_status') {
                item.customRender = ({ text }) => getLabel(text, productionStatus);
            }
            if (item.dataIndex === 'status') {
                item.customRender = ({ text }) => getLabel(text, workReportingStatus);
            }

            if (item.dataIndex === 'operation_id-single_plan_hours_unit') {
                item.customRender = ({ text }) => getLabel(text, timeUnitOption);
            }

            if (item.dataIndex === 'origin') {
                item.customRender = ({ text }) => getLabel(text, workOrderSource);
            }
            if (item.dataIndex === 'actual_working_hours' || item.dataIndex === 'pause_time') {
                item.customRender = ({ text }) => {
                    return (text / 60).toFixed(2);
                };
            }

            return item;
        });
    return { beforeRender, operateColumn };
};
