<template>
    <div>
        <TpfModal v-model:visible="visible" height="400px" width="1000px" title="新增工序">
            <a-form
                layout="inline"
                :label-col="{ span: 6, offset: 2 }"
                :model="formState"
                @finish="handleFinish"
            >
                <a-form-item label="工序编号">
                    <a-input allowClear v-model:value.trim="formState.operationCode" />
                </a-form-item>
                <a-form-item label="工序名称">
                    <a-input allowClear v-model:value.trim="formState.operationName" />
                </a-form-item>
                <a-form-item label="工序类型">
                    <a-select
                        style="width: 186px"
                        allowClear
                        v-model:value="formState.operationTypeCode"
                    >
                        <a-select-option
                            v-for="item in selectOptions"
                            :value="item.value"
                            :key="item.value"
                        >
                            {{ item.label }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" html-type="submit"> 查询 </a-button>
                </a-form-item>
            </a-form>

            <TpfTable
                v-bind="{
                    ...tableInfo,
                    pagination,
                    columns,
                    seq: true
                }"
            />

            <template #footerRight>
                <a-button class="tpf-button" @click="setVisible(false)">取消</a-button>
                <a-button
                    class="tpf-button"
                    type="primary"
                    @click="onSave"
                    :disabled="isEmpty(selectedRowInfo.selectedRowKeys)"
                >
                    保存
                </a-button>
            </template>
        </TpfModal>
    </div>
</template>

<script setup lang="ts" name="AddCraft">
    import { ref, unref, defineAsyncComponent } from 'vue';
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useRef, useAntdTable } from '@/hooks';
    import { TpfColumnType } from '@/types';
    import { addOperationTypeNameListOptions, getTpfOptionEnum } from '@/config';
    import { useWorkingProcedure } from '@/api';
    import { isEmpty } from 'lodash-es';

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));
    const { getLabel } = getTpfOptionEnum();

    type FormState = {
        operationCode: string;
        operationName: string;
        operationTypeCode: string;
        exclusionCodes: string[];
    };
    const [visible, setVisible] = useRef(false);
    const workingProcedure = useWorkingProcedure();
    const formState = ref<FormState>({
        operationCode: '',
        operationName: '',
        operationTypeCode: '',
        exclusionCodes: []
    });
    const selectOptions = ref(addOperationTypeNameListOptions);
    const countId = ref(0);

    const columns = ref<TpfColumnType[]>([
        { title: '工序编号', dataIndex: 'operationCode' },
        { title: '工序名称', dataIndex: 'operationName' },
        {
            title: '工序类型',
            dataIndex: 'operationTypeCode',
            customRender: ({ text }) => getLabel(text, addOperationTypeNameListOptions)
        }
    ]);
    const emits = defineEmits(['submitAdd']);
    const { tableInfo, pagination, loading, getDataList, selectedRowInfo } = useAntdTable({
        api: async pagination => {
            loading.value = true;
            const { pageSize = 20, current = 1 } = unref(pagination);
            // debugger;
            const res = await workingProcedure.queryOperationInfoListByPage({
                ...unref(formState),
                pageSize,
                page: current
            });
            loading.value = false;
            return res.data.object;
        },
        rowKey: 'operationId',
        hasRowSelection: true
        // isPageAble: true
    });
    const open = (item: any, selectList: any[]) => {
        if (Array.isArray(selectList)) {
            formState.value.exclusionCodes = selectList.map(v => v.operationCode).filter(v => v);
        }
        if (countId.value !== item.id) reset();
        countId.value = item.id;
        setVisible(!visible.value);
        getDataList();
    };
    const reset = () => {
        formState.value.operationCode = '';
        formState.value.operationName = '';
        formState.value.operationTypeCode = '';
        selectedRowInfo.value = {
            selectedRowKeys: [],
            selectedRows: []
        };
    };
    const handleFinish = () => {
        unref(pagination).current = 1;
        getDataList();
    };
    const onSave = () => {
        emits('submitAdd', selectedRowInfo.value.selectedRows);
        setVisible(!visible.value);
        reset();
    };
    defineExpose({
        open
    });
</script>
