<template>
    <TpfModal
        destroyOnClose
        class="FactoryModal"
        v-model:visible="visible"
        height="400px"
        width="800px"
        :title="title"
    >
        <a-form
            ref="formRef"
            :model="formState"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 15 }"
            :rules="rules"
        >
            <a-row style="width: 100%">
                <a-col :span="12">
                    <a-form-item label="工厂编号" name="factoryCode">
                        <a-input allowClear v-model:value.trim="formState.factoryCode" disabled />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="工厂名称" name="factoryName">
                        <a-input allowClear v-model:value.trim="formState.factoryName" disabled />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="车间编号" name="workshopCode">
                        <a-input allowClear v-model:value.trim="formState.workshopCode" disabled />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="车间名称" name="workshopName">
                        <a-input allowClear v-model:value.trim="formState.workshopName" disabled />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="班组编号" name="workingTeamCode">
                        <a-input
                            allowClear
                            :disabled="title === '编辑班组'"
                            v-model:value.trim="formState.workingTeamCode"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="班组名称" name="workingTeamName">
                        <a-input allowClear v-model:value.trim="formState.workingTeamName" />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="班组简称" name="workingTeamAbbreviation">
                        <a-input
                            allowClear
                            v-model:value.trim="formState.workingTeamAbbreviation"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="英文名称" name="workingTeamEnglishName">
                        <a-input allowClear v-model:value="formState.workingTeamEnglishName" />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="班组长" name="workingTeamLeaderUserId">
                        <a-select
                            v-model:value="formState.workingTeamLeaderUserId"
                            :options="userList"
                            :fieldNames="{ label: 'userName', value: 'userId' }"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="是否启用" name="status">
                        <a-switch
                            v-model:checked="formState.status"
                            :unCheckedValue="0"
                            :checkedValue="1"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="备注" name="remarks">
                        <a-textarea allowClear v-model:value="formState.remarks" />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>

        <template #footerRight>
            <a-button class="tpf-button" @click="onCancel">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="onSave">保存</a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="ts" name="FactoryModal">
    import TpfModal from '@/components/TpfModal/index.vue';
    import {
        checkRequired,
        checkMaxLength,
        checkSpecial,
        checkNumLetter
    } from '@/formRuleConfig/Tpfrules';
    import { useRef, useAntdForm } from '@/hooks';
    import type { TpfValidateRule } from '@/types';
    import { ref, watch, unref, computed } from 'vue';
    import { useWorkingTeamAPi, useUserApi } from '@/api';
    import type { ResQueryUserListByParam } from '@/api';
    import { isEmpty } from 'lodash-es';

    const workingTeamAPi = useWorkingTeamAPi();

    const userApi = useUserApi();

    const [visible, setVisible] = useRef(false);

    const { formRef, submitForm, resetFields } = useAntdForm();

    const initObj = () => {
        return {
            workingTeamLeaderUserId: '',
            factoryCode: '',
            factoryName: '',
            workshopCode: '',
            workshopName: '',
            workingTeamCode: '',
            workingTeamName: '',
            workingTeamAbbreviation: '',
            workingTeamEnglishName: '',
            status: 1,
            remarks: ''
        };
    };
    const formState = ref({} as ReturnType<typeof initObj>);

    const workshopId = ref('');

    const factoryId = ref('');

    const workingTeamId = ref('');

    const title = ref<string>('');

    const userList = ref<ResQueryUserListByParam[]>([]);

    const emits = defineEmits(['submitAdd', 'submitUpdata']);
    const validateWorkingTeamCode = () => {
        return {
            validator: async (_rule: any, value: any) => {
                if (!value) {
                    return Promise.resolve();
                }
                if (title.value === '编辑班组') {
                    return Promise.resolve();
                }
                try {
                    const { workingTeamCode } = formState.value;
                    const res = await workingTeamAPi.checkWorkingTeamCodeUnique({
                        workingTeamCode,
                        operation: Number(title.value === '编辑班组') //1=编辑 0 =新增
                    });
                    if (!res.data.value) {
                        return Promise.reject(res.errorMessage || '班组编码重复');
                    }
                    return Promise.resolve();
                } catch (error) {
                    console.log('error: ', error);
                }
            },
            trigger: ['blur']
        };
    };

    const validateWorkingTeamName = () => {
        return {
            validator: async (_rule: any, value: any) => {
                if (!value) {
                    return Promise.resolve();
                }
                const { workingTeamCode, workingTeamName } = formState.value;

                const params = {
                    workingTeamCode,
                    workingTeamName,
                    operation: Number(title.value === '编辑班组') //1=编辑 0 =新增
                } as any;
                try {
                    const res = await workingTeamAPi.checkWorkingTeamNameUnique(params);
                    if (!res.data.value) {
                        return Promise.reject(res.errorMessage || '班组名称重复');
                    }
                    return Promise.resolve();
                } catch (error) {
                    console.log('error: ', error);
                }
            },
            trigger: ['blur']
        };
    };

    const rules = {
        workingTeamCode: [
            checkMaxLength(12),
            checkNumLetter({ required: true }),
            validateWorkingTeamCode()
        ],
        workingTeamName: [
            checkRequired(),
            checkMaxLength(32),
            checkSpecial(),
            validateWorkingTeamName()
        ],
        workingTeamAbbreviation: [checkRequired(), checkMaxLength(32)],
        workingTeamEnglishName: [checkSpecial(), checkMaxLength(200)],
        remarks: [checkMaxLength(200)]
    } as TpfValidateRule;

    const workingTeamLeader = computed(() => {
        const res = unref(userList).find(
            item => item.userId === unref(formState).workingTeamLeaderUserId
        );
        return res && res.userName;
    });

    const onSave = async () => {
        const res = await submitForm();
        if (res) {
            res.workshopId = workshopId.value;
            res.factoryId = factoryId.value;
            res.workingTeamLeader = unref(workingTeamLeader);
            if (title.value === '新增班组') {
                emits('submitAdd', res);
            } else {
                res.workingTeamId = workingTeamId.value;
                emits('submitUpdata', res);
            }
        }
    };

    const queryUserListByParam = async () => {
        if (!isEmpty(unref(userList))) return;
        userList.value = await userApi.queryUserListByParam().then(res => res.data.list);
    };

    const onCancel = () => {
        setVisible(!visible.value);
    };
    const getWorkingTeamDetails = async (row: Record<string, any>) => {
        if (!row.workingTeamId) return;
        const res = await workingTeamAPi
            .getWorkingTeamDetails({ workingTeamId: row.workingTeamId })
            .then(res => res.data.object);
        formState.value = res as unknown as ReturnType<typeof initObj>;
    };

    const open = (t: string, v: any) => {
        formState.value = initObj();

        queryUserListByParam();
        setVisible(!visible.value);
        if (t === 'edit') {
            title.value = '编辑班组';
            workshopId.value = v.workshopId;
            factoryId.value = v.factoryId;
            workingTeamId.value = v.workingTeamId;
            getWorkingTeamDetails(v);
        } else if (t === 'add') {
            title.value = '新增班组';
            formState.value.workshopCode = v.rootCode;
            formState.value.workshopName = v.rootName;
            workshopId.value = v.rootId;
            factoryId.value = v.fatherId;
            formState.value.factoryName = v.fatherName;
            formState.value.factoryCode = v.fatherCode;
        }
    };

    watch(visible, () => {
        resetFields();
    });

    defineExpose({ open });
</script>

<style lang="less">
    .FactoryModal {
        .ant-modal-body {
            padding-top: 24px !important;
        }
    }
</style>
