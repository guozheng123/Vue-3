<template>
    <TpfModal
        class="selectProjectGroup"
        v-model:visible="visible"
        height="400px"
        width="800px"
        title="选择项目集"
    >
        <a-form layout="inline" class="tpf-form" :model="formState" :rules="rules">
            <a-row :gutter="24">
                <a-col :span="10">
                    <a-form-item name="projectGroupCode" label="项目集编号">
                        <a-input v-model:value.trim="formState.projectGroupCode" allowClear />
                    </a-form-item>
                </a-col>
                <a-col :span="10">
                    <a-form-item name="projectGroupName" label="项目集名称">
                        <a-input v-model:value.trim="formState.projectGroupName" allowClear />
                    </a-form-item>
                </a-col>
                <a-col :span="3">
                    <a-button type="primary" class="tpf-button" @click="onQuery"> 查询 </a-button>
                </a-col>
            </a-row>
        </a-form>

        <TpfTable v-bind="{ ...tableInfo, pagination, columns, seq: true }" />
        <template #footerRight>
            <a-button class="tpf-button" @click="setVisible(false)">取消</a-button>
            <a-button
                class="tpf-button"
                type="primary"
                @click="onSave"
                :disabled="isEmpty(selectRow)"
                >保存</a-button
            >
        </template>
    </TpfModal>
</template>

<script setup lang="ts" name="InfoModalProject">
    import { ref, unref, defineAsyncComponent } from 'vue';
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useRef, useAntdTable } from '@/hooks';
    import { TpfColumnType } from '@/types';
    import { checkRequired, checkSpecial, checkNumLetter } from '@/formRuleConfig/Tpfrules';
    import { useProjectGroupApi } from '@/api';
    import type { TpfValidateRule } from '@/types';
    import { isEmpty } from 'lodash-es';

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const [visible, setVisible] = useRef(false);

    const projectGroupApi = useProjectGroupApi();

    const formState = ref({ projectGroupCode: '', projectGroupName: '' });

    const rules = {
        customerSupplierCode: [checkRequired(), checkNumLetter(), checkSpecial()],
        customerSupplierName: [checkRequired()],
        customerSupplierType: [checkRequired()],
        forbidden: [checkRequired()]
    } as TpfValidateRule;
    const columns = ref<TpfColumnType[]>([
        { title: '项目集编号', dataIndex: 'projectGroupCode', width: 180 },
        { title: '项目集名称', dataIndex: 'projectGroupName', width: 180 },
        { title: '交期', dataIndex: 'createDatetime', width: 180 },
        { title: '备注', dataIndex: 'remark' }
    ]);
    const projectGroupObj = ref();
    const selectData = ref();
    const emits = defineEmits(['submitAdd']);
    const { tableInfo, pagination, getDataList, selectRow } = useAntdTable({
        api: async pagination => {
            const { pageSize = 20, current = 1 } = unref(pagination);
            const res = await projectGroupApi.queryPopProjectGroupListByPage({
                ...unref(formState),
                pageSize,
                page: current
            });
            return res.data.object;
        },
        rowKey: 'projectGroupId',
        colorRow: true,
        isPageAble: true
    });
    const initObj = () => {
        return {
            projectGroupCode: '',
            projectGroupName: ''
        };
    };
    const open = () => {
        setVisible(!visible.value);
        formState.value = initObj();
        selectData.value = {};
        unref(pagination).current = 1;

        getDataList();
    };
    const onQuery = () => {
        unref(pagination).current = 1;

        getDataList();
    };
    const onSave = async () => {
        projectGroupObj.value = unref(selectRow);
        if (projectGroupObj.value.forbidden === '0') {
            const { message } = await import('ant-design-vue');
            message.error('所选项目集未启用，无法引用');
            return;
        }
        emits('submitAdd', projectGroupObj.value);
        setVisible(!visible.value);
    };

    defineExpose({
        open
    });
</script>
