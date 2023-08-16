<template>
    <TpfModal v-model:visible="visible" :title="props.type" height="300px" width="800px">
        <a-form
            ref="formRef"
            layout="inline"
            class="tpf-form"
            :model="formState"
            :rules="rules"
            :labelCol="{ style: { width: '126px' } }"
        >
            <a-row>
                <a-col :span="12">
                    <a-form-item label="所属组织名称" name="orgCode">
                        <a-select
                            :disabled="props.isEdit"
                            v-model:value="formState.orgCode"
                            show-search
                            allow-clear
                            :options="treeData"
                            :fieldNames="{
                                label: 'factoryName',
                                value: 'factoryCode'
                            }"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="仓位代码" name="positionCode">
                        <a-input-search
                            :disabled="props.isEdit"
                            v-model:value="formState.positionCode"
                            @search="openPositionModel"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item name="positionName" label="仓位名称">
                        <a-input disabled :maxlength="20" v-model:value="formState.positionName" />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item name="storeLocationCode" label="库位代码">
                        <a-input
                            :disabled="props.isEdit"
                            :maxlength="10"
                            v-model:value.trim="formState.storeLocationCode"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item name="storeLocationName" label="库位名称">
                        <a-input
                            :disabled="props.isEdit"
                            :maxlength="20"
                            v-model:value.trim="formState.storeLocationName"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="启用">
                        <a-switch
                            :checkedValue="1"
                            :unCheckedValue="0"
                            v-model:checked="formState.isUsed"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="备注">
                        <a-textarea :maxlength="200" v-model:value.trim="formState.remark" />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="submitBinSettingsModel">
                保存
            </a-button>
        </template>
    </TpfModal>
    <InformationModel @get-data="getData" ref="informationModel" />
</template>

<script setup lang="ts" name="LocationSettingModel">
    import TpfModal from '@/components/TpfModal/index.vue';
    import type { FormInstance } from 'ant-design-vue';
    import { TreeSelectProps, message } from 'ant-design-vue';
    import { ref, watch, unref, defineAsyncComponent } from 'vue';
    import { useRef, useOpenAntdModal } from '@/hooks';
    import { useWarehouseApi, useFactoryAPi } from '@/api';
    import { Rule } from 'ant-design-vue/es/form';
    import { checkRequired, checkSpecial, checkNumLetter } from '@/formRuleConfig/Tpfrules';
    import type { TpfValidateRule } from '@/types';

    const InformationModel = defineAsyncComponent(() => import('../informationModel/index.vue'));

    const warehouseApi = useWarehouseApi();

    const factoryAPi = useFactoryAPi();

    const [informationModel, openInformationModel] = useOpenAntdModal();
    const treeData = ref<TreeSelectProps['treeData']>([]);
    const emit = defineEmits(['uploadTable']);

    const [visible, setVisible] = useRef(false);
    const code = ref('');
    const orgName = ref('');
    type Props = {
        type: string;
        isEdit: boolean;
        editData: any;
    };

    const props = withDefaults(defineProps<Props>(), {
        type: '',
        isEdit: false,
        editData: {}
    });

    const open = async () => {
        const res = await factoryAPi.getFactoryList();
        treeData.value = res.data.list;
        setVisible(!visible.value);
    };

    interface FormState {
        id: string;
        orgCode: string;
        positionCode: string;
        positionName: string;
        storeLocationCode: string;
        storeLocationName: string;
        remark: string;
        isUsed: number;
    }
    const formRef = ref<FormInstance>() as any;
    const formState = ref<FormState>({
        id: '',
        orgCode: '',
        positionCode: '',
        positionName: '',
        storeLocationCode: '',
        storeLocationName: '',
        remark: '',
        isUsed: 1
    });
    const rules = {
        orgCode: [checkRequired({ message: '请选择所属组织名称' })],
        positionCode: [
            checkRequired({ message: '请输入仓位代码' }),
            checkSpecial(),
            checkNumLetter()
        ],
        storeLocationCode: [
            checkRequired({ message: '请输入库位代码' }),
            checkSpecial(),
            {
                validator: async (_rule: Rule, value: string) => {
                    try {
                        if (props.isEdit === false) {
                            if (formState.value.positionCode) {
                                const res = await warehouseApi.checkStoreLocationCode({
                                    code: value,
                                    positionCode: formState.value.positionCode
                                });
                                if (!res.data.value) {
                                    return Promise.reject(res.errorMessage || '库位代码重复');
                                }
                            }
                        }
                        return Promise.resolve();
                    } catch (error) {
                        console.log('error: ', error);
                    }
                },
                trigger: ['blur']
            }
        ],
        storeLocationName: [
            checkRequired({ message: '请输入库位名称' }),
            checkSpecial(),
            {
                validator: async (_rule: Rule, value: string) => {
                    try {
                        if (props.isEdit === false) {
                            if (formState.value.positionCode) {
                                const res = await warehouseApi.checkStoreLocationName({
                                    name: value,
                                    positionCode: formState.value.positionCode
                                });
                                if (!res.data.value) {
                                    return Promise.reject(res.errorMessage || '库位名称重复');
                                }
                            }
                        }
                        return Promise.resolve();
                    } catch (error) {
                        console.log('error: ', error);
                    }
                },
                trigger: ['blur']
            }
        ]
    } as TpfValidateRule;
    watch(
        () => props.editData,
        val => {
            if (JSON.stringify(val) === '{}') {
                formState.value = {
                    id: '',
                    orgCode: '',
                    positionCode: '',
                    positionName: '',
                    storeLocationCode: '',
                    storeLocationName: '',
                    remark: '',
                    isUsed: 1
                };
            } else {
                formState.value = val;
            }
        }
    );
    const openPositionModel = () => {
        if (!props.isEdit) {
            const data = treeData.value?.filter(e => {
                return e.factoryCode === unref(formState).orgCode;
            }) as any;
            openInformationModel({
                code: unref(formState).positionCode,
                orgName: data?.length === 0 ? '' : data[0].factoryName
            });
        }
    };

    const submitBinSettingsModel = async () => {
        try {
            const values = await formRef.value.validateFields();
            const res = await warehouseApi.createUpdateStoreLocation({ ...formState.value });
            if (res.success === true) {
                message.success(props.isEdit ? '编辑成功' : '新增成功');
                emit('uploadTable');
                setVisible(!visible.value);
            }
            console.log('Success:', values);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    const getData = (val: any) => {
        formState.value.positionName = val.name;
        formState.value.positionCode = val.code;
        formRef.value.validateFields([
            'positionCode',
            'positionName',
            'storeLocationCode',
            'storeLocationName'
        ]);
    };

    defineExpose({ open });
</script>
