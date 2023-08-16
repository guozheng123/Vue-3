<template>
    <TpfModal
        v-model:visible="visible"
        title="选择客户"
        height="300px"
        width="800px"
        class="addProjectCodeModal"
    >
        <a-form layout="inline" :model="formState" @finish="handleFinish" class="tpf-form">
            <a-row style="width: 100%">
                <a-col :span="11">
                    <a-form-item label="单位编号" name="customerSupplierCode">
                        <a-input v-model:value="formState.customerSupplierCode" />
                    </a-form-item>
                </a-col>
                <a-col :span="11">
                    <a-form-item label="单位名称" name="customerSupplierName">
                        <a-input v-model:value="formState.customerSupplierName" />
                    </a-form-item>
                </a-col>
                <a-col :span="2">
                    <a-form-item>
                        <a-button
                            type="primary"
                            class="tpf-button"
                            html-type="submit"
                            :loading="loading"
                        >
                            查询
                        </a-button>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <TpfTable v-bind="{ ...tableInfo, pagination, columns }" />
        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">取消</a-button>
            <a-button
                class="tpf-button"
                type="primary"
                @click="saveProjectCode"
                :disabled="isEmpty(selectRow)"
            >
                保存
            </a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="tsx" name="addCustomerModal">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useAntdTable, useRef } from '@/hooks';
    import TpfTable from '@/components/TpfTable/index.vue';
    import { ref, computed, unref } from 'vue';
    import { tableResizable } from '@/config';
    import { TpfColumnType } from '@/types';
    import { useCustomerSupplierAPi } from '@/api';
    import { isEmpty } from 'lodash-es';
    const customerSupplierAPi = useCustomerSupplierAPi();

    const emit = defineEmits<{
        (e: 'getCustomerInfo', val: any): void;
    }>();

    const [visible, setVisible] = useRef(false);

    const formState = ref<{ customerSupplierCode?: string; customerSupplierName?: string }>({});

    const columns = computed(() => {
        return [
            { title: '单位编号', dataIndex: 'customerSupplierCode', ...tableResizable() },
            { title: '单位名称', dataIndex: 'customerSupplierName', ...tableResizable() },
            { title: '联系人', dataIndex: 'contacts', ...tableResizable() },
            { title: '电话', dataIndex: 'telephone', ...tableResizable() },
            { title: '邮箱', dataIndex: 'email', ...tableResizable() },
            { title: '详细地址', dataIndex: 'address', ...tableResizable() }
        ] as TpfColumnType[];
    });

    const { tableInfo, pagination, loading, getDataList, selectRow } = useAntdTable({
        api: async pagination => {
            const { pageSize, current: page } = unref(pagination);
            const res = await customerSupplierAPi.queryCustomerSupplierListByPage({
                pageSize,
                page,
                forbidden: '1',
                ...unref(formState)
            });
            return res.data.object;
        },
        rowKey: 'customerSupplierCode',
        isPageAble: true,
        colorRow: true
    });

    const handleFinish = (val: any) => {
        formState.value = unref(val);
        unref(pagination).current = 1;

        getDataList();
    };

    const saveProjectCode = () => {
        if (unref(selectRow).customerSupplierCode) {
            emit('getCustomerInfo', unref(selectRow));
        }

        setVisible(false);
    };

    const open = () => {
        setVisible(true);
        unref(pagination).current = 1;

        getDataList();
    };
    defineExpose({ open });
</script>
