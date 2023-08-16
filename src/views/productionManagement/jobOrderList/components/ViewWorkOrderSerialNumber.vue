<template>
    <div>
        <TpfModal
            class="ViewWorkOrderSerialNumber"
            v-model:visible="visible"
            title="查看工单序列号"
            height="400px"
            width="1000px"
        >
            <a-form layout="inline" :model="formState" @finish="handleFinish">
                <a-form-item label="作业工单号">
                    <a-select
                        ref="select"
                        v-model:value="formState.workOrderCode"
                        style="width: 160px"
                        :options="options1"
                        mode="tags"
                        :maxTagCount="1"
                    />
                    <!-- <a-input v-model:value="formState.workOrderCode" /> -->
                </a-form-item>
                <a-form-item label="工单序列号">
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

        <TpfQrprint ref="tpfQrprint" width="800px" />
    </div>
</template>

<script setup lang="ts" name="ViewWorkOrderSerialNumber">
    import TpfModal from '@/components/TpfModal/index.vue';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, unref, defineAsyncComponent } from 'vue';
    import type { TpfColumnType } from '@/types';
    import { useAntdTable, useRef, useOpenAntdModal } from '@/hooks';
    import { useJobOrderAPi } from '@/api';
    import { tableResizable, getTpfOptionEnum } from '@/config';
    import type { SelectProps } from 'ant-design-vue';

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfQrprint = defineAsyncComponent(() => import('@/components/TpfQrprint/index.vue'));

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));
    const { statusOption, getLabel } = getTpfOptionEnum();

    const jobOrderAPi = useJobOrderAPi();
    const [visible, setVisible] = useRef(false);
    const [tpfQrprint, onOpenTpfQrprint] = useOpenAntdModal();
    const ids = ref<any>([]);

    const options1 = ref<SelectProps['options']>([]);

    const formState = ref({
        workOrderCode: [],
        workOrderNumberCode: '',
        isPrint: 0
    });
    const columns = ref<TpfColumnType[]>([
        {
            title: '生产单号',
            dataIndex: 'productionOrderCode',
            ...tableResizable()
        },
        {
            title: '作业单号',
            dataIndex: 'workOrderCode',
            ...tableResizable()
        },
        { title: '工单序列号', dataIndex: 'workOrderNumberCode', ...tableResizable() },

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
        ids.value = val;
        console.log(val);
        formState.value.workOrderCode = val;

        const selectOptions = val.map((e: any) => {
            const obj = {
                value: e,
                label: e
            };
            return obj;
        });
        // selectOptions.unshift({
        //     value: '',
        //     label: '所有'
        // });
        // console.log(selectOptions);

        setVisible(!visible.value);
        getDataList();
        options1.value = selectOptions;
    };
    const { tableInfo, pagination, loading, getDataList, selectedRowInfo } = useAntdTable({
        api: async pageInfo => {
            const { current = 1, pageSize } = unref(pageInfo);
            const params = {
                page: current,
                pageSize,
                ...unref(formState)
                // workOrderCode: ids.value
            };
            // console.log(params);

            const res = await jobOrderAPi.queryWorkOrderSerialNumberList(params);
            console.log(res);

            // const res = await jobOrderAPi.queryWorkUnitTypeListByPage(unref(params));
            return res.data.object;
        },
        rowKey: 'id',
        isPageAble: true,
        // colorRow: true,
        hasRowSelection: true
    });
    const onSave = async () => {
        let ids;
        if (selectedRowInfo.value.selectedRows.length > 0) {
            ids = selectedRowInfo.value.selectedRows?.map((e: any) => {
                return e.id;
            });
        } else {
            ids = tableInfo.value.dataSource?.map((e: any) => {
                return e.id;
            });
        }
        const res = await jobOrderAPi.printWorkOrderSerialNumber({ workOrderId: ids as number[] });
        const list = res.data.object.list.map((e: any) => {
            const obj = {
                workOrderCode: e.workOrderCode,
                productionOrderCode: e.productionOrderCode,
                workOrderNumberCode: e.workOrderNumberCode
            };
            e.qrPrint = obj;
            return e;
        });

        onOpenTpfQrprint({
            data: list,
            content: [
                { key: 'workOrderCode', label: '作业单号' },
                { key: 'productionOrderCode', label: '生产单号' },
                { key: 'workOrderNumberCode', label: '工单序列号' }
            ],
            title: '工单序列号打印'
        });
    };
    const handleFinish = () => {
        unref(pagination).current = 1;
        // console.log(val);
        console.log(formState.value);

        getDataList();
    };

    defineExpose({ open });

    // onMounted(() => {
    //     // getDataList();
    // });
</script>

<style scoped lang="less"></style>
