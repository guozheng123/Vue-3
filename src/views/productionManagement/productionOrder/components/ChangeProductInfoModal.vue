<template>
    <TpfModal v-model:visible="visible" title="变更" height="200px" width="800px">
        <a-form
            layout="inline"
            :model="formState"
            class="tpf-form"
            :labelCol="{ style: { width: '98px' } }"
        >
            <a-row style="width: 100%">
                <a-col :span="12">
                    <a-form-item label="变更类型" name="changeType">
                        <a-input v-model:value="formState.changeType" />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="变更内容" name="changeContent">
                        <a-input v-model:value="formState.changeContent" />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="变更原因" name="changeReason">
                        <a-input v-model:value="formState.changeReason" />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="问题点编号" name="problemPointNum">
                        <a-input v-model:value="formState.problemPointNum" />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="原生产订单号" name="originalProductionOrderCode">
                        <a-input v-model:value="formState.originalProductionOrderCode" />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="saveProductInfo">保存</a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="tsx" name="ChangeProductInfoModal">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { ref, unref } from 'vue';
    import { useRef } from '@/hooks';
    import { useProductionOrderApi } from '@/api';

    type EditType = {
        changeType: string;
        changeContent: string;
        changeReason: string;
        problemPointNum: string;
        originalProductionOrderCode: string;
    };
    const productionOrderApi = useProductionOrderApi();

    const [visible, setVisible] = useRef(false);

    const productionOrderId = ref(0);

    const formState = ref<EditType>({} as EditType);

    const saveProductInfo = async () => {
        try {
            await productionOrderApi.editProductionOrderChange({
                ...unref(formState),
                productionOrderId: unref(productionOrderId)
            });
            const { message } = await import('ant-design-vue');
            message.success('变更成功');
            setVisible(false);
        } catch (error) {
            console.log('error: ', error);
        }
    };
    const getProductionOrderChange = async () => {
        if (!unref(productionOrderId)) return;
        const res = await productionOrderApi.getProductionOrderChange({
            productionOrderId: unref(productionOrderId)
        });
        // res.object
        formState.value = res.data.object;
    };

    const open = async (row: any) => {
        console.log('row: ', row);
        formState.value = {} as EditType;
        productionOrderId.value = row.productionOrderId;
        await getProductionOrderChange();

        setVisible(true);
    };
    defineExpose({ open });
</script>
