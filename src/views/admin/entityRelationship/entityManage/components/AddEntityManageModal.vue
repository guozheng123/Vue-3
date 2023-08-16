<template>
    <TpfModal
        v-model:visible="visible"
        width="600px"
        height="400px"
        :title="formState.entityId ? '编辑' : '新增'"
    >
        <a-form
            ref="formRef"
            :model="formState"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 10 }"
            :rules="rules"
        >
            <a-form-item label="服务名" name="serviceName">
                <a-input allowClear v-model:value="formState.serviceName" />
            </a-form-item>
            <a-form-item label="存储名" name="storageName">
                <a-input allowClear v-model:value="formState.storageName" />
            </a-form-item>
            <a-form-item label="实体编码" name="entityCode">
                <a-input allowClear v-model:value="formState.entityCode" />
            </a-form-item>
            <a-form-item label="实体类型" name="entityType">
                <a-select
                    :options="entityTypeList"
                    allowClear
                    v-model:value="formState.entityType"
                />
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
    import { useEntityApi } from '@/api';
    import { checkRequired } from '@/formRuleConfig/Tpfrules';
    import type { TpfValidateRule } from '@/types';
    import { getTpfOptionEnum } from '@/config';
    import { cloneDeep } from 'lodash-es';

    const emit = defineEmits<{
        (e: 'updateTable'): void;
    }>();

    const entityApi = useEntityApi();

    const { entityTypeList } = getTpfOptionEnum();

    const [visible, setVisible] = useRef(false);

    const { formRef, submitForm } = useAntdForm();

    const initFormState = () => ({
        serviceName: '',
        storageName: '',
        entityCode: '',
        enabled: false,
        description: '',
        entityType: '',
        entityId: ''
    });

    const formState = ref(initFormState());

    const onSave = async () => {
        const res = await submitForm();
        console.log(' formState.value', formState.value, res);
        const { entityId = '' } = unref(formState);
        await entityApi.addOrUpdate({ ...res, entityId });
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
        serviceName: [checkRequired()],
        storageName: [checkRequired()],
        entityType: [checkRequired()]
    } as TpfValidateRule;

    defineExpose({ open });
</script>
