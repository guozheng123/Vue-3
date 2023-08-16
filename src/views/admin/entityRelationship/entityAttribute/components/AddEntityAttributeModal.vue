<template>
    <TpfModal
        v-model:visible="visible"
        width="600px"
        height="400px"
        :title="formState.entityPropertyId ? '编辑' : '新增'"
    >
        <a-form
            ref="formRef"
            :model="formState"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 10 }"
            :rules="rules"
        >
            <a-form-item label="实体编码" name="entityCode">
                <a-input allowClear v-model:value="formState.entityCode" />
            </a-form-item>
            <a-form-item label="实体属性名称" name="entityPropertyName">
                <a-input allowClear v-model:value="formState.entityPropertyName" />
            </a-form-item>
            <a-form-item label="实体属性编码" name="entityPropertyCode">
                <a-input allowClear v-model:value="formState.entityPropertyCode" />
            </a-form-item>
            <a-form-item label="值类型" name="valueType">
                <a-select
                    :options="valueTypeOption"
                    allowClear
                    v-model:value="formState.valueType"
                />
            </a-form-item>
            <a-form-item label="存储类型" name="storageType">
                <a-select
                    :options="storageTypeOption"
                    allowClear
                    v-model:value="formState.storageType"
                />
            </a-form-item>
            <a-form-item label="值类型长度" name="valueTypeLength">
                <a-input allowClear v-model:value="formState.valueTypeLength" />
            </a-form-item>
            <a-form-item label="值来源类型" name="valueSourceType">
                <a-select
                    :options="[{ value: 'ENTITY', label: 'ENTITY' }]"
                    allowClear
                    v-model:value="formState.valueSourceType"
                />
            </a-form-item>
            <a-form-item label="值来源" name="valueSource">
                <a-input allowClear v-model:value="formState.valueSource" />
            </a-form-item>
            <a-form-item label="存储名" name="storageName">
                <a-input allowClear v-model:value="formState.storageName" />
            </a-form-item>
            <a-form-item label="启用" name="enabled">
                <a-switch v-model:checked="formState.enabled" />
            </a-form-item>
            <a-form-item label="描述" name="description">
                <a-textarea allowClear v-model:value="formState.description" />
            </a-form-item>
        </a-form>
        <template #footerRight>
            <a-button class="tpf-button" @click="setVisible(false)">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="onSave">保存</a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="ts">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useRef, useAntdForm } from '@/hooks';
    import { ref, unref } from 'vue';
    import { useEntityPropertyApi } from '@/api';
    import { checkRequired } from '@/formRuleConfig/Tpfrules';
    import type { TpfValidateRule } from '@/types';
    import { getTpfOptionEnum } from '@/config';
    import { cloneDeep } from 'lodash-es';

    const emit = defineEmits<{
        (e: 'updateTable'): void;
    }>();

    const entityPropertyApi = useEntityPropertyApi();

    const { valueTypeOption, storageTypeOption } = getTpfOptionEnum();

    const [visible, setVisible] = useRef(false);

    const { formRef, submitForm } = useAntdForm();

    const initFormState = () => ({
        storageName: '',
        valueSource: '',
        valueSourceType: '',
        valueTypeLength: '',
        entityCode: '',
        entityPropertyId: '',
        entityPropertyName: '',
        entityPropertyCode: '',
        valueType: '',
        storageType: '',
        enabled: false,
        description: ''
    });

    const formState = ref(initFormState());

    const onSave = async () => {
        const res = await submitForm();
        console.log(' formState.value', formState.value, res);
        const { entityPropertyId = '' } = unref(formState);
        await entityPropertyApi.addOrUpdate({ ...res, entityPropertyId });
        const { message } = await import('ant-design-vue');
        message.success('操作成功');
        setVisible(false);
        emit('updateTable');
    };

    const open = (row = {}) => {
        console.log('row: ', row);
        formState.value = initFormState();
        setVisible(true);
        formState.value = cloneDeep(row) as any;
    };
    const rules = {
        entityCode: [checkRequired()],
        storageName: [checkRequired()],
        entityPropertyName: [checkRequired()],
        entityPropertyCode: [checkRequired()],
        valueType: [checkRequired()],
        storageType: [checkRequired()]
    } as TpfValidateRule;

    defineExpose({ open });
</script>
