<template>
    <TpfModal
        class="WorknModel"
        v-model:visible="visible"
        width="800px"
        title="选择缺陷类型"
        height="350px"
        :bodyStyle="{ overflow: 'hidden', height: '300px' }"
    >
        <a-form layout="inline" :model="formState" style="width: 92%; margin: 0 auto">
            <a-form-item label="缺陷类型编号">
                <a-input
                    v-model:value="formState.defectCauseClassifyCode"
                    :maxlength="30"
                    onkeyup="value=value.replace(/\s+/g,'')"
                />
            </a-form-item>
            <a-form-item label="缺陷类型名称">
                <a-input
                    v-model:value="formState.defectCauseClassifyName"
                    :maxlength="30"
                    onkeyup="value=value.replace(/\s+/g,'')"
                />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit" @click="onCheck">查询</a-button>
            </a-form-item>
        </a-form>
        <TpfTable v-bind="{ ...tableInfo, columns, pagination }" />
        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">取消</a-button>
            <a-button
                class="tpf-button"
                type="primary"
                @click="submit"
                :disabled="isEmpty(selectRow)"
            >
                保存
            </a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="tsx" name="WorknModel">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { ref, defineAsyncComponent, unref } from 'vue';
    import type { TpfColumnType } from '@/types';
    import { tableResizable } from '@/config';
    import { useAntdTable, useRef } from '@/hooks';
    import { useQualityApi } from '@/api';
    import { isEmpty } from 'lodash-es';

    const qualityApi = useQualityApi();
    const [visible, setVisible] = useRef(false);
    const emit = defineEmits(['clickFu']);
    const open = () => {
        unref(pagination).current = 1;
        getDataList();
        setVisible(!visible.value);
    };

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const formState = ref({
        defectCauseClassifyCode: '',
        defectCauseClassifyName: ''
    });

    const onCheck = () => {
        getDataList();
    };

    const submit = () => {
        emit(
            'clickFu',
            {
                code: unref(selectRow).defectCauseClassifyCode,
                name: unref(selectRow).defectCauseClassifyName
            },
            unref(selectRow).defectCauseClassifyId
        );
        setVisible(false);
    };

    const columns = ref<TpfColumnType[]>([
        { title: '缺陷类型编号', dataIndex: 'defectCauseClassifyCode', ...tableResizable() },
        { title: '缺陷类型名称', dataIndex: 'defectCauseClassifyName', ...tableResizable() },
        { title: '创建人', dataIndex: 'createUser', ...tableResizable() },
        { title: '创建日期', dataIndex: 'createDatetime', ...tableResizable() }
    ]);

    const { tableInfo, pagination, getDataList, selectRow } = useAntdTable({
        api: async pageInfo => {
            const { current: page, pageSize } = unref(pageInfo);
            const res = await qualityApi.queryDefectCauseClassifyListByPage({
                ...formState.value,
                page,
                pageSize: pageSize
            });
            return res.data.object;
        },
        rowKey: 'defectCauseClassifyId',
        isPageAble: true,
        colorRow: true
    });

    defineExpose({ open });
</script>

<style scoped lang="less">
    :deep(.tpf-table) .table-striped td {
        background-color: #ecf5df !important;
    }

    .ant-table-tbody :deep(.table-striped) td {
        background-color: #ecf5df !important;
    }

    :deep(.table-striped) td {
        background-color: #ecf5df !important;
    }

    :deep(.tpf-table-layout) {
        height: 90% !important;
    }

    :deep(.tpf-layout-content) {
        margin-top: 0 !important;

        .operate-line {
            height: 0 !important;
        }
    }
</style>
