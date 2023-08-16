<template>
    <TpfModal v-model:visible="visible" title="选择工序" height="345px" width="850px">
        <a-form layout="inline" :model="formState" class="tpf-form" @finish="handleFinish">
            <a-row style="width: 100%">
                <a-col :span="7">
                    <a-form-item label="工序编号" name="operationCode">
                        <a-input v-model:value.trim="formState.operationCode" />
                    </a-form-item>
                </a-col>
                <a-col :span="7">
                    <a-form-item label="工序名称" name="operationName">
                        <a-input v-model:value.trim="formState.operationName" />
                    </a-form-item>
                </a-col>
                <a-col :span="7">
                    <a-form-item label="工序类型" name="operationTypeCode">
                        <a-select
                            v-model:value.trim="formState.operationTypeCode"
                            :options="operationTypeNameListOptions"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="3">
                    <a-button type="primary" @click="onCheck">查询</a-button>
                </a-col>
            </a-row>
        </a-form>
        <TpfTable
            v-bind="{
                ...tableInfo,
                pagination,
                columns
            }"
        />
        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">取消</a-button>
            <a-button
                class="tpf-button"
                type="primary"
                @click="submit"
                :disabled="isEmpty(selectedRowInfo.selectedRowKeys)"
            >
                保存
            </a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="tsx" name="AddProcessFromMaterielModal">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useAntdTable, useRef } from '@/hooks';
    import TpfTable from '@/components/TpfTable/index.vue';
    import { ref, computed, unref } from 'vue';
    import { tableResizable, getTpfOptionEnum } from '@/config';
    import { useOperationInfoApi } from '@/api';
    import { TpfColumnType } from '@/types';
    import { isArray, isEmpty, cloneDeep } from 'lodash-es';
    import { message } from 'ant-design-vue';

    const { operationTypeNameListOptions, getLabel } = getTpfOptionEnum();

    const operationInfoApi = useOperationInfoApi();

    const [visible, setVisible] = useRef(false);

    const formState = ref<{
        operationCode?: string;
        operationName?: string;
        operationTypeCode?: string;
    }>({});

    const columns = computed(() => {
        return [
            { title: '工序编号', dataIndex: 'operationCode', ...tableResizable() },
            { title: '工序名称', dataIndex: 'operationName', ...tableResizable() },
            { title: '创建人', dataIndex: 'createUserName', ...tableResizable() },
            {
                title: '工序类型',
                dataIndex: 'operationTypeCode',
                ...tableResizable(),
                customRender: ({ text }) => getLabel(text, operationTypeNameListOptions)
            },
            { title: '创建时间', dataIndex: 'createDatetime', ...tableResizable() }
        ] as TpfColumnType[];
    });
    const { tableInfo, pagination, getDataList, selectedRowInfo } = useAntdTable({
        api: async pageInfo => {
            const { current: page, pageSize } = unref(pageInfo);
            const res = await operationInfoApi.queryOperationListByWorkshopSectionPage({
                ...formState.value,
                page,
                pageSize: pageSize
            });
            return res.data.object;
        },
        rowKey: 'operationCode',
        isPageAble: true,
        hasRowSelection: true
    });

    // 查询
    const onCheck = () => {
        unref(pagination).current = 1;

        getDataList();
    };

    const emit = defineEmits(['clickFu']);
    const Ids = ref([]) as any;
    // 保存
    const submit = () => {
        emit('clickFu', unref(selectedRowInfo).selectedRows);
        setVisible(false);
    };
    const handleFinish = (val: any) => {
        unref(pagination).current = 1;
        getDataList();
    };
    const open = (val: string[]) => {
        setVisible(!visible.value);
        Ids.value = cloneDeep(val);
        selectedRowInfo.value.selectedRowKeys = val;
        formState.value = {
            operationCode: '',
            operationName: '',
            operationTypeCode: ''
        };
        unref(pagination).current = 1;

        getDataList();
    };

    defineExpose({ open });
</script>
