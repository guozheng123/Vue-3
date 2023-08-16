<template>
    <TpfModal v-model:visible="visible" :title="props.type" height="350px" width="800px">
        <a-form
            ref="formRef"
            class="binSettingsModel"
            layout="inline"
            :model="formState"
            @finish="handleFinish"
            :rules="rules"
        >
            <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-item label="所属组织名称" name="orgCode">
                        <a-tree-select
                            v-model:value="formState.orgCode"
                            :disabled="props.isEdit"
                            show-search
                            style="width: 100%"
                            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                            allow-clear
                            :tree-data="treeData"
                            :fieldNames="{
                                children: 'branchTree',
                                label: 'rootName',
                                value: 'rootCode'
                            }"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="仓位代码" name="code">
                        <a-input
                            :disabled="props.isEdit"
                            :maxlength="10"
                            v-model:value.trim="formState.code"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item name="name" label="仓位名称">
                        <a-input
                            :disabled="props.isEdit"
                            :maxlength="20"
                            v-model:value.trim="formState.name"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="仓位类型">
                        <a-select
                            v-model:value="formState.type"
                            show-search
                            :options="typeList"
                            :field-names="{
                                label: 'name',
                                value: 'code'
                            }"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item name="attribute" label="仓位属性">
                        <a-select
                            :disabled="props.isEdit"
                            v-model:value="formState.attribute"
                            :options="areas"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="仓位地址">
                        <a-input :maxlength="50" v-model:value.trim="formState.address" />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="默认入仓位">
                        <a-switch
                            :checkedValue="1"
                            :unCheckedValue="0"
                            v-model:checked="defaultBin"
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
            <a-button class="tpf-button" type="primary" @click="submitBinSettingsModel"
                >保存</a-button
            >
        </template>
    </TpfModal>
</template>

<script setup lang="ts" name="BinSettingsModel">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { FormInstance, TreeSelectProps, message } from 'ant-design-vue';
    import { ref, watch } from 'vue';
    import { useRef } from '@/hooks';
    import { useWarehouseApi, useWorkingTeamAPi } from '@/api';
    import { Rule } from 'ant-design-vue/es/form';
    import { checkRequired, checkSpecial, checkNumLetter } from '@/formRuleConfig/Tpfrules';
    import type { TpfValidateRule } from '@/types';

    import { cloneDeep, isEmpty } from 'lodash-es';

    const warehouseApi = useWarehouseApi();

    const workingTeamAPi = useWorkingTeamAPi();

    const emit = defineEmits(['uploadTable']);
    const [visible, setVisible] = useRef(false);

    type Props = {
        type: string;
        isEdit: boolean;
        editData: any;
    };
    const defaultBin = ref(1);
    const props = withDefaults(defineProps<Props>(), {
        type: '',
        isEdit: false,
        editData: {}
    });
    const typeList: any = ref([]);

    const treeData = ref<TreeSelectProps['treeData']>([]);
    const open = async () => {
        setVisible(!visible.value);

        const res = await workingTeamAPi.getWorkshopWorkingTeamTreeList();
        treeData.value = res.data.list;

        const res2 = await warehouseApi.queryPositionTypeByParam({});
        const optionsData = res2.data.object.list.filter(e => e.isUsed === 1);

        typeList.value = optionsData;
    };
    const areas = [
        { label: '良品', value: 'y' },
        { label: '不良品', value: 'n' }
    ];

    interface FormState {
        id: string;
        orgCode: string;
        code: string;
        name: string;
        type: string;
        attribute: string;
        address: string;
        remark: string;
        isUsed: number;
        defaultQualified: string | any;
        defaultDisqualified: string | any;
    }
    const formRef = ref<FormInstance>() as any;
    const formState = ref<FormState>({
        id: '',
        orgCode: '',
        code: '',
        name: '',
        type: '',
        attribute: '',
        address: '',
        remark: '',
        isUsed: 1,
        defaultQualified: '', //默认合格仓
        defaultDisqualified: '' //默认不合格仓
    });
    const rules = {
        code: [
            checkRequired({ message: '请输入仓位代码' }),
            checkSpecial(),
            checkNumLetter(),
            {
                validator: async (_rule: Rule, value: string) => {
                    try {
                        if (props.isEdit === false) {
                            const res = await warehouseApi.checkPositionCode({ code: value });
                            if (!res.data.value) {
                                return Promise.reject(res.errorMessage || '仓位代码重复');
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
        orgCode: [checkRequired({ message: '请选择所属组织名称' })],
        name: [
            checkRequired({ message: '请输入仓位名称' }),
            {
                validator: async (_rule: Rule, value: string) => {
                    try {
                        if (props.isEdit === false) {
                            const res = await warehouseApi.checkPositionName({ name: value });
                            if (!res.data.value) {
                                return Promise.reject(res.errorMessage || '仓位名称重复');
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
        attribute: [checkRequired({ message: '请选择仓位属性' })]
    } as TpfValidateRule;
    watch(
        () => props.editData,
        val => {
            if (isEmpty(val)) {
                formState.value = {
                    id: '',
                    orgCode: '',
                    code: '',
                    name: '',
                    type: '',
                    attribute: '',
                    address: '',
                    remark: '',
                    isUsed: 1,
                    defaultQualified: '',
                    defaultDisqualified: ''
                };
                defaultBin.value = 1;
            } else {
                formState.value = cloneDeep(val);
                if (val.attribute === 'y') {
                    defaultBin.value = val.defaultQualified;
                } else {
                    defaultBin.value = val.defaultDisqualified;
                }
            }
        }
    );

    const handleFinish = () => {};
    watch(
        () => [formState.value.attribute, defaultBin.value],
        (val: any) => {
            if (val[0] === 'y') {
                formState.value.defaultDisqualified = null;
                formState.value.defaultQualified = val[1];
            } else if (val[0] === 'n') {
                formState.value.defaultDisqualified = val[1];
                formState.value.defaultQualified = null;
            }
        }
    );
    const submitBinSettingsModel = async () => {
        try {
            await formRef.value.validateFields();
            const res = await warehouseApi.createUpdatePosition({ ...formState.value });
            if (res.success === true) {
                message.success(props.isEdit ? '编辑成功' : '新增成功');
                emit('uploadTable');
                setVisible(!visible.value);
            }
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    defineExpose({ open });
</script>

<style scoped lang="less">
    .binSettingsModel {
        :deep(.ant-form-item-label) {
            width: 110px !important;
        }

        :deep(.ant-row) {
            margin-right: 0 !important;
            margin-left: 0 !important;
        }
        // :deep(.ant-form-item-label) .ant-form-item-control {
        //     margin-left: 10px;
        // }
        .ant-form-item {
            margin: 20px 0 0 0;
        }
    }
</style>
