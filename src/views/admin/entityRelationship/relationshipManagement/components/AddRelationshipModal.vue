<template>
    <TpfModal
        v-model:visible="visible"
        width="600px"
        height="400px"
        :title="formState.entityRelationId ? '编辑' : '新增'"
    >
        <a-form
            ref="formRef"
            :model="formState"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 10 }"
            :rules="rules"
        >
            <a-form-item label="左实体编码" name="leftEntityCode">
                <a-select
                    :options="entityCodeList"
                    :fieldNames="{ label: 'entityCode', value: 'entityCode', options: 'options' }"
                    allowClear
                    v-model:value="formState.leftEntityCode"
                    @change="changeSelectEntityCode($event, 'leftEntityList')"
                />
            </a-form-item>
            <a-form-item label="左实体属性" name="leftEntityRelationPropertyList">
                <a-select
                    allowClear
                    :options="leftEntityList"
                    :fieldNames="{
                        label: 'entityPropertyCode',
                        value: 'entityPropertyCode',
                        options: 'options'
                    }"
                    v-model:value="formState.leftEntityRelationPropertyList"
                    mode="multiple"
                    maxTagCount="responsive"
                />
            </a-form-item>
            <a-form-item label="右实体编码" name="rightEntityCode">
                <a-select
                    :options="entityCodeList"
                    :fieldNames="{ label: 'entityCode', value: 'entityCode', options: 'options' }"
                    allowClear
                    v-model:value="formState.rightEntityCode"
                    @change="changeSelectEntityCode($event, 'rightEntityList')"
                />
            </a-form-item>
            <a-form-item label="右实体属性" name="rightEntityRelationPropertyList">
                <a-select
                    allowClear
                    :options="rightEntityList"
                    :fieldNames="{
                        label: 'entityPropertyCode',
                        value: 'entityPropertyCode',
                        options: 'options'
                    }"
                    v-model:value="formState.rightEntityRelationPropertyList"
                    mode="multiple"
                    maxTagCount="responsive"
                />
            </a-form-item>
            <a-form-item label="映射类型" name="mapType">
                <a-select :options="mapTypeList" allowClear v-model:value="formState.mapType" />
            </a-form-item>
            <a-form-item label="映射规则类型" name="mapRuleType">
                <a-select
                    :options="mapRuleTypeList"
                    allowClear
                    v-model:value="formState.mapRuleType"
                />
            </a-form-item>
            <a-form-item label="映射规则值" name="mapRuleValue">
                <a-input allowClear v-model:value="formState.mapRuleValue" />
            </a-form-item>

            <a-form-item label="启用" name="enabled">
                <a-switch v-model:checked="formState.enabled" />
            </a-form-item>
            <!-- <a-form-item label="描述" name="description">
                <a-textarea allowClear v-model:value="formState.description" />
            </a-form-item> -->
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
    import { useEntityRelationApi, useEntityPropertyApi, useEntityApi } from '@/api';
    import type { ResEntityPropertyQuery, ResEntityQuery, ResEntityRelationQuery } from '@/api';
    import { checkRequired } from '@/formRuleConfig/Tpfrules';
    import type { TpfValidateRule } from '@/types';
    import { getTpfOptionEnum } from '@/config';
    import { cloneDeep, isEmpty } from 'lodash-es';

    const emit = defineEmits<{
        (e: 'updateTable'): void;
    }>();

    const entityPropertyApi = useEntityPropertyApi();

    const entityRelationApi = useEntityRelationApi();

    const entityApi = useEntityApi();

    const { mapTypeList, mapRuleTypeList } = getTpfOptionEnum();

    const [visible, setVisible] = useRef(false);

    const { formRef, submitForm } = useAntdForm();

    const leftEntityList = ref<ResEntityPropertyQuery[]>([]);

    const rightEntityList = ref<ResEntityPropertyQuery[]>([]);

    const changeSelectEntityCode = async (entityCode: any, val: string, isInit = false) => {
        const list = await entityPropertyApi
            .query({ entityCode, enabled: true })
            .then(res => res.data.object.list || []);
        if (val === 'leftEntityList') {
            leftEntityList.value = list;
            if (!isInit) {
                formState.value.leftEntityRelationPropertyList = [];
            }
        }
        if (val === 'rightEntityList') {
            rightEntityList.value = list;
            if (!isInit) {
                formState.value.rightEntityRelationPropertyList = [];
            }
        }
    };

    const entityCodeList = ref<ResEntityQuery[]>([]);

    const getEntityCodeList = async () => {
        entityCodeList.value = await entityApi
            .query({ enabled: true })
            .then(res => res.data.object.list || []);
    };

    const initFormState = () => ({
        entityRelationId: '',
        leftEntityCode: '',
        leftEntityRelationPropertyList: [] as string[],
        rightEntityCode: '',
        rightEntityRelationPropertyList: [] as string[],
        mapType: '',
        mapRuleType: '',
        mapRuleValue: '',
        enabled: false,
        description: ''
    });

    const formState = ref(initFormState());

    const onSave = async () => {
        const res = await submitForm();
        console.log(' formState.value', formState.value, res);

        const leftEntityRelationPropertyList = res.leftEntityRelationPropertyList.map(
            (entityPropertyCode: string) => ({ entityPropertyCode })
        );
        const rightEntityRelationPropertyList = res.rightEntityRelationPropertyList.map(
            (entityPropertyCode: string) => ({ entityPropertyCode })
        );

        const { entityRelationId = '' } = unref(formState);
        await entityRelationApi.addOrUpdate({
            ...res,
            leftEntityRelationPropertyList,
            rightEntityRelationPropertyList,
            entityRelationId
        });
        const { message } = await import('ant-design-vue');
        message.success('操作成功');
        setVisible(false);
        emit('updateTable');
    };

    const renderForm = async (row = {} as ResEntityRelationQuery) => {
        if (isEmpty(row)) return;
        const { leftEntityRelationPropertyList = [], rightEntityRelationPropertyList = [] } = row;
        const leftList = leftEntityRelationPropertyList.map(item => item.entityPropertyCode);
        const rightList = rightEntityRelationPropertyList.map(item => item.entityPropertyCode);
        formState.value.leftEntityRelationPropertyList = leftList;
        formState.value.rightEntityRelationPropertyList = rightList;
        await changeSelectEntityCode(row.leftEntityCode, 'leftEntityList', true);
        await changeSelectEntityCode(row.rightEntityCode, 'rightEntityList', true);
    };

    const open = async (row = {} as ResEntityRelationQuery) => {
        console.log('row: ', row);
        getEntityCodeList();
        formState.value = initFormState();
        setVisible(true);
        formState.value = cloneDeep(row) as any;
        renderForm(row);
    };
    const rules = {
        entityRelationId: [checkRequired()],
        leftEntityCode: [checkRequired()],
        leftEntityRelationPropertyList: [checkRequired()],
        rightEntityCode: [checkRequired()],
        rightEntityRelationPropertyList: [checkRequired()],
        mapType: [checkRequired()],
        mapRuleType: [checkRequired()],
        mapRuleValue: [checkRequired()]
    } as TpfValidateRule;

    defineExpose({ open });
</script>
