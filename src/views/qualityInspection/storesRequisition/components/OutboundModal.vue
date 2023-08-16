<template>
    <TpfModal v-model:visible="visible" width="1000px" height="500px" title="出库">
        <a-form style="height: 100%" :model="tableInfo" class="table-form">
            <TpfTable
                class="tpf-table-form"
                v-bind="{ ...tableInfo, pagination, seq: true, columns }"
            />
        </a-form>
        <template #footerRight>
            <TpfButton :btnList="operateBtnList" />
        </template>
    </TpfModal>
</template>

<script setup lang="tsx">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useRef, useAntdTable } from '@/hooks';
    import { computed, defineAsyncComponent, ref, unref, toRaw } from 'vue';
    import { useMaterialRequisitionApi } from '@/api';
    import type { TpfColumnType } from '@/types';
    import { isEmpty, cloneDeep, isArray } from 'lodash-es';
    import TpfInputNumber from '@/components/TpfInputNumber/index.vue';
    import TpfButton from '@/components/TpfButton/index.vue';
    import { FormItem } from 'ant-design-vue';

    const materialRequisitionApi = useMaterialRequisitionApi();

    const currentRowInfo = ref<any>({});

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const emit = defineEmits<{
        (e: 'getBatchInfoList', val: any): void;
    }>();

    const [visible, setVisible] = useRef(false);
    const checkOutStorageNumber = (record: any) => {
        return {
            validator: async (_rule: any, value: string) => {
                if ([null, undefined, ''].includes(value)) {
                    return Promise.resolve();
                }
                if (Number(value) === 0) {
                    return Promise.reject('不可为0');
                }
                if (Number(value) > Number(record.storageNumber)) {
                    return Promise.reject('不可大于现存量');
                }

                return Promise.resolve();
            },
            trigger: ['change', 'blur']
        };
    };

    const columns = computed<TpfColumnType[]>(() => {
        const isSTOCK_AS_BATCH = unref(currentRowInfo).stockManagementType === 'STOCK_AS_BATCH';
        return [
            { title: '项目编号', dataIndex: 'projectCode' },
            { title: '批次号', dataIndex: 'batchNo', visible: isSTOCK_AS_BATCH },
            { title: '物料编号', dataIndex: 'materialCode' },
            { title: '物料名称', dataIndex: 'materialName' },
            { title: '业务单位', dataIndex: 'productUnitCodeName' },
            { title: '现存量', dataIndex: 'storageNumber' },
            {
                title: '出库数',
                dataIndex: 'outStorageNumber',
                customRender: ({ record, text, index }) => {
                    return (
                        <FormItem
                            name={['dataSource', index, 'outStorageNumber']}
                            rules={[checkOutStorageNumber(record)] as any}
                        >
                            <TpfInputNumber
                                min={0}
                                style={{ width: '90%' }}
                                v-model={[record.outStorageNumber, 'value']}
                            />
                        </FormItem>
                    );
                }
            },
            { title: '基本数量', dataIndex: 'basicUnit' },
            { title: '基本单位', dataIndex: 'basicUnitName' },
            { title: '仓位名称', dataIndex: 'positionName' },
            { title: '库位名称', dataIndex: 'storeLocationName', visible: isSTOCK_AS_BATCH }
        ];
    });

    const getOutStorageInfo = async (row = {}) => {
        if (isEmpty(row)) return;
        const { materialRequisitionOrderCode, materialCode, batchInfoList } = row as any;

        if (isArray(batchInfoList) && batchInfoList.length) {
            setTableList(batchInfoList);
            return;
        }

        loading.value = true;
        try {
            const res = await materialRequisitionApi
                .getOutStorageInfo({
                    materialRequisitionOrderCode,
                    materialCode
                })
                .then(res => res.data.list || []);
            console.log('res: ', res);
            setTableList(res);
        } catch (error) {
            console.log('error: ', error);
        } finally {
            loading.value = false;
        }
    };

    const { loading, tableInfo, pagination, getDataList, setTableList, getTableList } =
        useAntdTable({
            api: async () => {
                return { list: [] as any[] };
            },
            rowKey: 'materialCode',
            isPageAble: false,
            hasRowSelection: false
        });

    const operateBtnList = computed(() => {
        return [
            { title: '取消', props: { onClick: () => setVisible(false) } },
            {
                title: '保存',
                props: {
                    type: 'primary',
                    onClick: () => onSave(),
                    disabled: isEmpty(unref(tableInfo).dataSource)
                }
            }
        ];
    });

    const onSave = async () => {
        emit('getBatchInfoList', {
            id: currentRowInfo.value.id,
            batchInfoList: toRaw(unref(getTableList()))
        });
        setVisible(false);
    };

    const open = (row = {}) => {
        console.log('row: ', row);
        setTableList([]);
        getOutStorageInfo(row);
        currentRowInfo.value = cloneDeep(row) as any;

        setVisible(true);
    };

    getDataList();

    defineExpose({ open });
</script>
