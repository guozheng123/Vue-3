<template>
    <TpfModal
        class="rework-modal"
        v-model:visible="visible"
        width="600px"
        title="返修处理"
        height="220px"
    >
        <a-form
            ref="reworkModalFormRef"
            :model="formState"
            autocomplete="off"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 14 }"
            class="form-content"
            :rules="rules"
        >
            <a-form-item name="operationId" label="返修工序" class="rework-item">
                <a-select v-model:value="formState.operationId" allowClear>
                    <a-select-option
                        v-for="item in reworkOrderList"
                        :value="item.id"
                        :key="item.id"
                        :name="item.operationName"
                    >
                        {{ item.operationName }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <!-- 返修数 - 工序返修计划数 -->
            <a-form-item name="operationRepairQuantity" label="工序返修数" class="rework-item">
                <a-input-number v-model:value="formState.operationRepairQuantity" />
            </a-form-item>
        </a-form>
        <template #footerRight>
            <a-button class="tpf-button" @click="setVisible(false)">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="onSave" :loading="loading"
                >保存</a-button
            >
        </template>
    </TpfModal>
</template>

<script setup lang="tsx" name="confirmStorageModal">
    import { useRepairOrderDetailApi } from '@/api';
    import { useRef } from '@/hooks';
    import TpfModal from '@/components/TpfModal/index.vue';
    import { ref, unref, computed } from 'vue';
    import { FormInstance, message } from 'ant-design-vue';
    import { checkRequired } from '@/formRuleConfig/Tpfrules';
    import type { TpfValidateRule } from '@/types';
    import type { Rule } from 'ant-design-vue/es/form';

    const useApi = useRepairOrderDetailApi();
    const [visible, setVisible] = useRef(false);
    const reworkModalFormRef = ref<FormInstance>() as any;
    const loading = ref<boolean>(false);
    const emit = defineEmits(['reloadTbleList']);

    const formState = ref({
        operationRepairQuantity: 0,
        operationId: ''
    });
    const repairOrderId = ref('');
    const reworkOrderList = ref<any[]>([]);
    const rules = computed(() => {
        return {
            operationId: [checkRequired()],
            operationRepairQuantity: [
                checkRequired(),
                {
                    validator: (_rule: Rule, value: number) => {
                        if (value === 0) {
                            return Promise.reject('工序返修数不能为0!');
                        }
                        return Promise.resolve();
                    },
                    trigger: ['change', 'blur']
                }
            ]
        } as TpfValidateRule;
    });

    const open = async (data: { operationRepairQuantity: number; repairOrderId: string }) => {
        onReset();
        setVisible(!visible.value);
        console.log(data.operationRepairQuantity);

        repairOrderId.value = data.repairOrderId;
        formState.value.operationRepairQuantity = data.operationRepairQuantity;
        const res = await useApi.getRepairOrderOperationList({ repairOrderId: data.repairOrderId });
        reworkOrderList.value = res.data.list;
    };
    const onReset = () => {
        formState.value.operationId = '';
    };

    const onSave = async () => {
        await reworkModalFormRef.value.validateFields();
        const params = {
            ...unref(formState),
            id: unref(repairOrderId)
        };
        const res = await useApi.generateRepairOrderDetail(params);
        if (res.data.value) {
            message.success('处理成功');
        }
        setVisible(!visible.value);
        emit('reloadTbleList');
    };

    defineExpose({ open });
</script>

<style scoped lang="less">
    .rework-modal {
        .rework-item {
            margin-top: 30px;

            .ant-input-number {
                width: 100%;
            }
        }
    }
</style>
