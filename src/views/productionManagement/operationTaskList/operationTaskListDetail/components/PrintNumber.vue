<template>
    <div>
        <TpfModal
            class="ViewWorkOrderSerialNumber"
            v-model:visible="visible"
            title="序列号打印"
            height="400px"
            width="1000px"
        >
            <a-form layout="inline" :model="formState" @finish="handleFinish">
                <a-form-item label="工序任务单号">
                    <a-select
                        v-model:value="formState.operationTaskOrderCode"
                        style="width: 160px"
                        :options="options1"
                    />
                    <!-- <a-input v-model:value="formState.workOrderCode" /> -->
                </a-form-item>
                <a-form-item label="序列号">
                    <a-input v-model:value="formState.workOrderNumberCode" />
                </a-form-item>
                <a-form-item label="是否打印">
                    <a-select style="width: 100px" ref="select" v-model:value="formState.isPrint">
                        <a-select-option :value="1">是</a-select-option>
                        <a-select-option :value="0">否</a-select-option>
                    </a-select>
                    <!-- <a-input v-model:value="formState.isPrint" /> -->
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" html-type="submit">查询</a-button>
                </a-form-item>
            </a-form>
            <TpfLayout style="height: 320px">
                <template #content>
                    <TpfTableLayout>
                        <template #default="args">
                            <TpfTable
                                :scroll="{ y: 350, x: 700 }"
                                v-bind="{
                                    ...args,
                                    ...tableInfo,
                                    loading,
                                    pagination,
                                    columns,
                                    seq: true
                                }"
                            />
                        </template>
                    </TpfTableLayout>
                </template>
            </TpfLayout>
            <template #footerRight>
                <a-button class="tpf-button" @click="visible = false">取消</a-button>
                <a-button class="tpf-button" type="primary" @click="onSave">打印</a-button>
            </template>
        </TpfModal>

        <TpfQrprint ref="tpfQrprint" @emit-on-print="emitOnPrint" width="800px" />
    </div>
</template>

<script setup lang="ts" name="ViewWorkOrderSerialNumber">
    import TpfModal from '@/components/TpfModal/index.vue';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, unref, defineAsyncComponent } from 'vue';
    import type { TpfColumnType } from '@/types';
    import { useAntdTable, useRef, useOpenAntdModal } from '@/hooks';
    import { useOperationTaskListAPi } from '@/api';
    import { tableResizable, getTpfOptionEnum } from '@/config';
    import type { SelectProps } from 'ant-design-vue';
    import { cloneDeep } from 'lodash-es';

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfQrprint = defineAsyncComponent(() => import('@/components/TpfQrprint/index.vue'));

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));
    const { statusOption, getLabel } = getTpfOptionEnum();

    const operationTaskListAPi = useOperationTaskListAPi();
    const [visible, setVisible] = useRef(false);
    const [tpfQrprint, onOpenTpfQrprint] = useOpenAntdModal();
    const ids = ref<any>([]);

    const options1 = ref<SelectProps['options']>([{ label: '所有', value: '' }]);
    const copyOperationTaskOrderCode = ref<string[]>([]);

    const formState = ref({
        operationTaskOrderCode: '',
        workOrderNumberCode: '',
        isPrint: ''
    });
    const columns = ref<TpfColumnType[]>([
        {
            title: '工序任务单号',
            dataIndex: 'operationTaskOrderCode',
            ...tableResizable()
        },
        {
            title: '序列号',
            dataIndex: 'operationTaskOrderNumberCode',
            ...tableResizable()
        },
        { title: '工序名称', dataIndex: 'operationName', ...tableResizable() },

        {
            title: '是否打印',
            dataIndex: 'isPrint',
            ...tableResizable(),
            customRender: ({ text }) => {
                return getLabel(text, statusOption);
            }
        }
    ]);
    const open = (val: any) => {
        val.forEach((ele: string) => {
            options1.value?.push({ label: ele, value: ele });
        });
        copyOperationTaskOrderCode.value = cloneDeep(val);

        setVisible(!visible.value);
        getDataList();
    };
    const { tableInfo, pagination, loading, getDataList, selectedRowInfo } = useAntdTable({
        api: async pageInfo => {
            const { current = 1, pageSize } = unref(pageInfo);
            let ids: string[] = [];

            if (formState.value.operationTaskOrderCode === '') {
                ids = unref(copyOperationTaskOrderCode);
            } else {
                ids.push(formState.value.operationTaskOrderCode);
            }
            const params = {
                page: current,
                pageSize,
                workOrderNumberCode: unref(formState).workOrderNumberCode,
                isPrint: unref(formState).isPrint,
                operationTaskOrderCode: ids
            };

            const res = await operationTaskListAPi.queryWorkOrderSerialNumberList(params);

            return res.data.object;
        },
        rowKey: 'operationTaskOrderNumberId',
        isPageAble: true,
        hasRowSelection: true
    });
    const onSave = async () => {
        // let ids;
        if (selectedRowInfo.value.selectedRows.length > 0) {
            ids.value = selectedRowInfo.value.selectedRows?.map((e: any) => {
                return e.operationTaskOrderNumberId;
            });
        } else {
            ids.value = tableInfo.value.dataSource?.map((e: any) => {
                return e.operationTaskOrderNumberId;
            });
        }
        const res = await operationTaskListAPi.printSerialNumber({ ids: ids.value as number[] });
        const list = res.data.object.list.map((e: any) => {
            const obj = {
                operationTaskOrderNumberCode: e.operationTaskOrderNumberCode,
                operationCode: e.operationCode
            };
            e.qrPrint = obj;
            return e;
        });

        onOpenTpfQrprint({
            data: list,
            content: [
                { key: 'operationTaskOrderCode', label: '工序任务单号' },
                { key: 'operationTaskOrderNumberCode', label: '序列号' },
                { key: 'operationName', label: '工序名称' }
            ],
            title: '序列号打印'
        });
    };
    const emitOnPrint = async () => {
        const uploadRes = await operationTaskListAPi.updatePrintSerialNumberStatus({
            ids: ids.value || []
        });
        getDataList();
    };
    const handleFinish = () => {
        unref(pagination).current = 1;
        getDataList();
    };

    defineExpose({ open });
</script>

<style scoped lang="less">
    :deep(.operate-line) {
        height: 0 !important;
    }
</style>
