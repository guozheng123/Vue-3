<template>
    <div>
        <TpfModal v-model:visible="visible" width="800px" height="345px" title="添加缺陷原因">
            <a-form
                layout="inline"
                :model="formState"
                class="tpf-form"
                ref="formRef"
                :rules="rules"
            >
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
                        <a-button type="primary" class="tpf-button" @click="onQuery">
                            查询
                        </a-button>
                    </a-col>
                </a-row>
            </a-form>

            <TpfTable v-bind="{ ...tableInfo, pagination, columns, seq: true }" />
            <template #footerRight>
                <a-button class="tpf-button" @click="setVisible(false)">取消</a-button>
                <a-button class="tpf-button" type="primary" @click="onSave">保存</a-button>
            </template>
        </TpfModal>
    </div>
</template>

<script setup lang="tsx" name="AddCraft">
    import { ref, unref, defineAsyncComponent } from 'vue';
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useRef, useAntdForm, useAntdTable } from '@/hooks';
    import type { TpfColumnType, TpfValidateRule } from '@/types';
    import { checkRequired, checkSpecial, checkNumLetter } from '@/formRuleConfig/Tpfrules';
    import { useQualityApi } from '@/api';
    import SvgIcon from '@/components/SvgIcon/index.vue';

    const emits = defineEmits(['submitAdd']);

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const { formRef } = useAntdForm();

    const [visible, setVisible] = useRef(false);

    const qualityApi = useQualityApi();

    const formState = ref();

    const rules = {
        customerSupplierCode: [checkRequired(), checkNumLetter(), checkSpecial()],
        customerSupplierName: [checkRequired()],
        customerSupplierType: [checkRequired()],
        forbidden: [checkRequired()]
    } as TpfValidateRule;

    const columns = ref<TpfColumnType[]>([
        { title: '缺陷原因编号', dataIndex: 'defectCauseCode' },
        { title: '缺陷原因名称', dataIndex: 'defectCauseName' },
        {
            title: 'IQC',
            dataIndex: 'iqcFlag',
            customRender: ({ text }) =>
                text === '1' ? <SvgIcon type="icon-xuanzhong" class="t-text-primary" /> : null
        },
        {
            title: 'IPQC',
            dataIndex: 'ipqcFlag',
            customRender: ({ text }) =>
                text === '1' ? <SvgIcon type="icon-xuanzhong" class="t-text-primary" /> : null
        },
        {
            title: 'FQC',
            dataIndex: 'fqcFlag',
            customRender: ({ text }) =>
                text === '1' ? <SvgIcon type="icon-xuanzhong" class="t-text-primary" /> : null
        },
        {
            title: 'OQC',
            dataIndex: 'oqcFlag',
            customRender: ({ text }) =>
                text === '1' ? <SvgIcon type="icon-xuanzhong" class="t-text-primary" /> : null
        }
    ]);

    const { tableInfo, pagination, getDataList, selectedRowInfo } = useAntdTable({
        api: async pagination => {
            const { pageSize = 20, current = 1 } = unref(pagination);
            const res = await qualityApi.queryDefectCauseListByPage({
                ...unref(formState),
                pageSize,
                page: current
            });
            return res.data.object;
        },
        rowKey: 'defectCauseCode',
        hasRowSelection: true
    });

    const initObj = () => ({ defectCauseCode: '', defectCauseName: '' });

    const open = (data: any[]) => {
        formState.value = initObj();
        setVisible(!visible.value);
        onQuery();
        const codes = unref(data).map(e => {
            return e.defectCauseCode;
        });
        selectedRowInfo.value = {
            selectedRowKeys: codes,
            selectedRows: unref(data)
        };
    };

    const onQuery = () => {
        unref(pagination).current = 1;

        getDataList();
    };

    const onSave = () => {
        emits('submitAdd', unref(selectedRowInfo).selectedRows);
        setVisible(!visible.value);
    };

    defineExpose({ open });
</script>
