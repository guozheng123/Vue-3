<template>
    <TpfCollapse title="基础信息" gap="0">
        <a-form
            ref="informationRef"
            :model="formState"
            name="advanced_search"
            :label-col="labelCol"
        >
            <a-card style="width: 100%">
                <a-row :gutter="24">
                    <a-col :span="6">
                        <a-form-item label="作业工单编号" name="workUnitCode">
                            <span>{{ formState.workUnitCode }}</span>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="序列号" name="workOrderNumberCode">
                            <span>{{ formState.workOrderNumberCode }}</span>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="工序名称" name="operationName">
                            <span>{{ formState.operationName }}</span>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="作业单元" name="workUnitName">
                            <span>{{ formState.workUnitName }}</span>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="报工号">
                            <span>{{ formState.reportProgressCode }}</span>
                        </a-form-item>
                    </a-col>

                    <a-col :span="6">
                        <a-form-item label="生产状态">
                            <span>{{
                                getLabel(formState.productionStatus, productionStatus)
                            }}</span>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="物料名称">
                            <span>{{ formState.materialName }}</span>
                        </a-form-item>
                    </a-col>

                    <a-col :span="6">
                        <a-form-item label="物料编号">
                            <span>{{ formState.materialCode }}</span>
                        </a-form-item>
                    </a-col>
                    <!-- <a-col :span="6">
                        <a-form-item label="操作员">
                            <span>{{ formState.reportUserName }}</span>
                        </a-form-item>
                    </a-col> -->

                    <a-col :span="6">
                        <a-form-item label="合格数">
                            <span> {{ formState.qualifiedQuantity }} </span>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="返修数">
                            <span> {{ formState.repairQuantity }} </span>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="报废数">
                            <span> {{ formState.scrappedQuantity }} </span>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-card>
        </a-form>
    </TpfCollapse>
</template>

<script setup lang="ts" name="Information">
    import { ref, onMounted } from 'vue';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import { getTpfOptionEnum } from '@/config';

    type Props = {
        data: any;
    };
    const props = withDefaults(defineProps<Props>(), {
        data: () => ({})
    });
    const labelCol = { style: { width: '120px' } };
    const { getLabel, productionStatus } = getTpfOptionEnum();

    const informationRef = ref();
    const formState = ref({
        workUnitCode: '--',
        workOrderNumberCode: '--',
        operationName: '--',
        workUnitName: '--',
        reportProgressCode: '--',
        productionStatus: '--',
        reportUserName: '--',
        materialName: '--',
        materialCode: '--',
        qualifiedQuantity: '--',
        repairQuantity: '--',
        scrappedQuantity: '--'
    });

    const load = async () => {
        Object.keys(formState.value).forEach(key => {
            formState.value[key] = props.data[key] ? props.data[key] : '--';
        });
    };
    onMounted(async () => {
        load();
    });
    defineExpose({
        formState,
        informationRef
    });
</script>

<style></style>
