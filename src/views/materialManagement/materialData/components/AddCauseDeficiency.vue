<template>
    <TpfModal
        class="addCraft"
        v-model:visible="visible"
        width="800px"
        height="345px"
        title="添加缺陷原因"
    >
        <a-form layout="inline" :model="formState" class="tpf-form">
            <a-row style="width: 100%">
                <a-col :span="10">
                    <a-form-item name="defectCauseCode" label="缺陷原因编号">
                        <a-input v-model:value.trim="formState.defectCauseCode" allowClear />
                    </a-form-item>
                </a-col>
                <a-col :span="10">
                    <a-form-item name="defectCauseName" label="缺陷原因名称">
                        <a-input v-model:value.trim="formState.defectCauseName" allowClear />
                    </a-form-item>
                </a-col>

                <a-col :span="3">
                    <a-button type="primary" @click="onQuery()">查询</a-button>
                </a-col>
            </a-row>
        </a-form>

        <TpfTable
            v-bind="{
                ...tableInfo,
                columns,
                seq: true
            }"
        />
        <template #footerRight>
            <a-button class="tpf-button" @click="setVisible(false)">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="onSave">保存</a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="ts" name="AddCraft">
    import { ref, unref, defineAsyncComponent } from 'vue';
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useRef, useAntdTable } from '@/hooks';
    import { useQualityApi } from '@/api';
    import type { ResQueryDefectCauseListByPage } from '@/api';
    import { message } from 'ant-design-vue';

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const emits = defineEmits<{
        (e: 'submitAdd', val: ResQueryDefectCauseListByPage[]): void;
    }>();

    const [visible, setVisible] = useRef(false);

    const qualityApi = useQualityApi();
    const tableList = ref<any[]>([]);
    const formState = ref({
        defectCauseCode: '',
        defectCauseName: ''
    });

    const columns = [
        { title: '缺陷原因编号', dataIndex: 'defectCauseCode' },
        { title: '缺陷原因名称', dataIndex: 'defectCauseName' },
        { title: 'IQC', dataIndex: 'iqcFlag' },
        { title: 'IPQC', dataIndex: 'ipqcFlag' },
        { title: 'FQC', dataIndex: 'fqcFlag' },
        { title: 'OQC', dataIndex: 'oqcFlag' }
    ];

    const { tableInfo, getDataList, selectedRowInfo } = useAntdTable({
        api: async () => {
            const res = await qualityApi.queryDefectCauseListByPage({
                ...unref(formState)
            });
            const list = res.data.object.list.filter(e => {
                const ids = tableList.value.map(ele => ele.defectCauseId);
                return !ids.includes(e.defectCauseId);
            });
            return { list: list };
        },
        rowKey: 'defectCauseId',
        hasRowSelection: true,
        isPageAble: false
    });

    const initObj = () => ({ defectCauseCode: '', defectCauseName: '' });
    const open = (list: any[]) => {
        setVisible(!visible.value);
        formState.value = initObj();
        tableList.value = list;
        onQuery();
    };

    const onQuery = () => {
        getDataList();
    };

    const onSave = () => {
        if (unref(selectedRowInfo).selectedRows.length === 0) {
            return message.warning('请至少选择一条缺陷原因!');
        }
        emits('submitAdd', unref(selectedRowInfo).selectedRows);
        setVisible(!visible.value);
    };

    defineExpose({ open });
</script>
