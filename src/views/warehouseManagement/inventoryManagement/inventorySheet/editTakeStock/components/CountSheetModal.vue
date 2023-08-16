<template>
    <TpfModal v-model:visible="visible" height="500px" width="700px" :title="'新增盘点明细'">
        <a-form
            ref="formRef"
            :model="formState"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 10 }"
            :rules="rules"
        >
            <a-form-item label="仓位名称" name="positionName">
                <a-input
                    :disabled="true"
                    :maxlength="12"
                    allowClear
                    :filter-option="filterOption"
                    v-model:value.trim="formState.positionName"
                />
            </a-form-item>
            <a-form-item label="库位名称" name="storeLocationCode">
                <a-select v-model:value="formState.storeLocationCode" show-search allowClear>
                    <a-select-option
                        v-for="item in selectStoreCodeList"
                        :value="item.storeLocationCode"
                        :key="item.storeLocationCode"
                        >{{ item.storeLocationName }}</a-select-option
                    >
                </a-select>
            </a-form-item>
            <a-form-item label="项目名称" name="projectName">
                <a-input-search v-model:value="formState.projectName" @search="onClickIcon" />
            </a-form-item>
            <a-form-item label="物料编号" name="materialCode">
                <a-input-search v-model:value="formState.materialCode" @search="onClickIcons" />
            </a-form-item>
            <a-form-item label="物料名称" name="materialName">
                <a-input
                    :maxlength="100"
                    allowClear
                    v-model:value.trim="formState.materialName"
                    :disabled="true"
                />
            </a-form-item>
            <a-form-item
                label="批次号"
                name="batchNo"
                :rules="[
                    {
                        required: stockManagementTypes == 'STOCK_AS_BATCH',
                        message: '请填写项目名称！'
                    }
                ]"
            >
                <a-input
                    :maxlength="32"
                    allowClear
                    v-model:value.trim="formState.batchNo"
                    :disabled="stockManagementTypes === 'STOCK_AS_BATCH' ? false : true"
                />
            </a-form-item>
            <a-form-item label="盘点数量" name="checkNum">
                <a-input :maxlength="32" allowClear v-model:value.trim="formState.checkNum" />
            </a-form-item>
            <a-form-item label="基本单位" name="basicUnitName">
                <a-input
                    :maxlength="32"
                    allowClear
                    v-model:value.trim="formState.basicUnitName"
                    :disabled="true"
                />
            </a-form-item>
        </a-form>

        <template #footerRight>
            <a-button class="tpf-button" @click="onCancel">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="onSave">保存</a-button>
        </template>
        <!-- 项目名称 -->
        <AddProjectCodeModal
            ref="addProjectCodeModalDom"
            v-if="showAddProjectCodeModalDom"
            @getProjectInfo="getProjectInfo"
        />
        <!-- 物料信息 -->
        <AddProcessFromMaterielModal
            unHasRowSelection
            v-if="showAddProcessFromMaterielModalDom"
            ref="addProcessFromMaterielModalDom"
            @getMaterialCode="getMaterialInfo"
        />
    </TpfModal>
</template>

<script setup lang="ts" name="AddDepartment">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { checkRequired, checkGreaterThan } from '@/formRuleConfig/Tpfrules';
    import { useRef, useAntdForm, useOpenAntdModal } from '@/hooks';
    import type { TpfValidateRule } from '@/types';
    import { ref, watch, defineAsyncComponent } from 'vue';
    import { useWarehouseApi } from '@/api';
    import { useAddProcessFromMaterielModal } from '@/components';
    import TpfForm from '@/components/TpfForm/index.vue';

    const [visible, setVisible] = useRef(false);
    const { formRef, submitForm, resetFields } = useAntdForm();
    const formState = ref({
        positionName: '',
        positionCode: '',
        projectCode: '',
        materialCode: '',
        materialName: '',
        checkNum: '',
        basicUnitName: '',
        projectName: '',
        batchNo: '',
        storeLocationCode: ''
    });
    const {
        AddProcessFromMaterielModal,
        addProcessFromMaterielModalDom,
        openAddProcessFromMaterielModalDom,
        showAddProcessFromMaterielModalDom
    } = useAddProcessFromMaterielModal();
    // 项目名称
    const getProjectInfo = (val: any) => {
        formState.value.projectName = val.projectName;
        formState.value.projectCode = val.projectCode;
    };

    const stockManagementTypes = ref('');
    const Code = ref('');
    // 物料编号
    const getMaterialInfo = (val: any) => {
        stockManagementTypes.value = val;
        formState.value.materialCode = val.materialCode;
        formState.value.materialName = val.materialName;
        formState.value.basicUnitName = val.materialUnitName;
        stockManagementTypes.value = val.stockManagementType;
    };
    const onClickIcon = (val: any, event: any) => {
        openAddProjectCodeModalDom();
    };
    const TpfFormRef = ref<InstanceType<typeof TpfForm> | null>(null);
    const onClickIcons = () => {
        openAddProcessFromMaterielModalDom([TpfFormRef.value?.newState || {}]);
    };

    const [addProjectCodeModalDom, openAddProjectCodeModalDom, showAddProjectCodeModalDom] =
        useOpenAntdModal();
    const AddProjectCodeModal = defineAsyncComponent(() => import('./AddProjectCodeModal.vue'));

    const emit = defineEmits(['stock']);
    const selectStoreCodeList = ref<any>([]);
    const filterOption = (input: string, option: any) => {
        return option.name.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };
    const warehouseManagementAPi = useWarehouseApi();

    // 校验
    const rules = {
        checkNum: [checkRequired(), checkGreaterThan()],
        materialCode: [checkRequired()]
    } as TpfValidateRule;

    // 保存按钮
    const onSave = async () => {
        const res = await submitForm();
        emit('stock', {
            ...res,
            positionCode: formState.value.positionCode,
            projectCode: formState.value.projectCode
        });
        setVisible(false);
    };
    const onCancel = () => {
        setVisible(!visible.value);
    };
    const open = async (t: string, v: any) => {
        setVisible(!visible.value);
        // 仓位名称
        formState.value.positionName = v.positionName;
        formState.value.positionCode = v.positionCode;
        try {
            const positionCode = v.positionCode;
            Code.value = v.positionCode;
            if (positionCode) {
                // 根据仓位名称取库位数据
                selectStoreCodeList.value = await warehouseManagementAPi
                    .getStoreLocationDataList({
                        positionCode
                    })
                    .then(res => res.data.list || []);
            }
        } catch (error) {
            console.log(error);
        }
    };

    watch(visible, () => {
        resetFields();
    });
    defineExpose({ open });
</script>
