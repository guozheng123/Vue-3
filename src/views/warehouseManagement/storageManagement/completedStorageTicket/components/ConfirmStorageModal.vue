<template>
    <TpfModal
        class="confirm-storage-modal"
        v-model:visible="visible"
        width="600px"
        title="选择入库仓库"
        height="300px"
    >
        <a-form
            ref="formRef"
            :model="formState"
            autocomplete="off"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 14 }"
            class="form-content"
            :rules="rules"
        >
            <a-form-item name="positionCode" label="仓位名称">
                <a-select
                    v-model:value="formState.positionCode"
                    show-search
                    :filter-option="filterOption"
                    allowClear
                    @change="changePositionCode"
                    :fieldNames="{ label: 'name', value: 'code' }"
                    :options="selectPositionList"
                />
            </a-form-item>
            <a-form-item label="库位名称" class="t-mt-[30px]" name="storeLocationCode">
                <a-select
                    v-model:value="formState.storeLocationCode"
                    :filter-option="filterOption"
                    show-search
                    allowClear
                    :fieldNames="{ label: 'storeLocationName', value: 'storeLocationCode' }"
                    :options="selectStoreCodeList"
                />
            </a-form-item>
        </a-form>
        <template #footerRight>
            <a-button class="tpf-button" @click="setVisible(false)">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="onSave" :loading="loading">
                保存
            </a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="tsx" name="confirmStorageModal">
    import { useWarehouseApi, useInStoreAPi } from '@/api';
    import { useAntdForm, useRef } from '@/hooks';
    import TpfModal from '@/components/TpfModal/index.vue';
    import { ref, unref } from 'vue';
    import type { TpfValidateRule } from '@/types';
    import { checkRequired } from '@/formRuleConfig/Tpfrules';
    import type { ResGetPositionDataList, ResGetStoreLocationDataList } from '@/api';

    const warehouseManagementAPi = useWarehouseApi();

    const inStoreAPi = useInStoreAPi();

    const emit = defineEmits<{
        (e: 'onGetTableList'): void;
    }>();

    const [visible, setVisible] = useRef(false);

    const { formRef, submitForm } = useAntdForm<{
        positionCode: string;
        storeLocationCode: string;
    }>();

    const loading = ref<boolean>(false);

    const selectedRowKeys = ref<number[]>([]);

    const formState = ref({
        positionCode: '',
        storeLocationCode: ''
    });

    const selectPositionList = ref<ResGetPositionDataList[]>([]);

    const selectStoreCodeList = ref<ResGetStoreLocationDataList[]>([]);

    const rules = {
        positionCode: [checkRequired({ message: '请选择仓位名称！' })]
    } as TpfValidateRule;

    const open = (list = []) => {
        selectedRowKeys.value = list;
        onReset();
        onEchoForm();
        setVisible(!visible.value);
    };

    const onReset = () => {
        formState.value.positionCode = '';
        formState.value.storeLocationCode = '';
    };

    const onEchoForm = () => {
        onGetPositionList();
        onGetStoreList();
    };

    const filterOption = (input: string, option: any) => {
        return option.name.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };
    const changePositionCode = () => {
        onGetStoreList();
    };
    const onGetPositionList = async () => {
        try {
            const { data } = await warehouseManagementAPi.getPositionDataList();
            selectPositionList.value = data.list || [];
        } catch (error) {
            console.log(error);
        }
    };
    const onGetStoreList = async () => {
        formState.value.storeLocationCode = '';
        try {
            const positionCode = formState.value.positionCode;
            if (!positionCode) return;
            const { data } = await warehouseManagementAPi.getStoreLocationDataList({
                positionCode
            });
            selectStoreCodeList.value = data.list || [];
        } catch (error) {
            console.log(error);
        }
    };
    const onSave = async () => {
        const res = await submitForm();
        const param = {
            ...res,
            id: unref(selectedRowKeys)
        };
        loading.value = true;
        try {
            const { data } = await inStoreAPi.confirmCompleteInStore(param);
            if (data.value) {
                const { message } = await import('ant-design-vue');
                setVisible(false);
                emit('onGetTableList');
                message.success('确认入库成功！');
            }
        } catch (error) {
            console.log(error);
        } finally {
            loading.value = false;
        }
    };

    defineExpose({ open });
</script>

<style scoped lang="less">
    .confirm-storage-modal {
        .form-content {
            padding: 30px;
            height: 100%;
            display: flex;
            flex-direction: column;
        }
    }
</style>
