<template>
    <div>
        <TpfCollapse title="基础" gap="0">
            <a-form
                ref="baseRef"
                :model="formState"
                name="advanced_search"
                autocomplete="off"
                :label-col="{
                    style: { width: '115px' }
                }"
                :rules="rules"
            >
                <a-card>
                    <a-row :gutter="24">
                        <a-col :span="6">
                            <a-form-item label="员工工号" name="employeeNo">
                                <a-input
                                    v-if="routerType !== 'detail'"
                                    :disabled="editEmployeeNo"
                                    :maxlength="12"
                                    v-model:value.trim="formState.employeeNo"
                                />
                                <span v-if="routerType === 'detail'">{{
                                    formState.employeeNo ? formState.employeeNo : '- -'
                                }}</span>
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="系统用户" name="systemFlag">
                                <a-select
                                    v-if="routerType !== 'detail'"
                                    :disabled="routerType === 'edit'"
                                    @change="changeUser"
                                    v-model:value="formState.systemFlag"
                                    :options="statusNumberOption"
                                />
                                <span v-if="routerType === 'detail'">{{
                                    getLabel(formState.systemFlag, statusNumberOption)
                                }}</span>
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="用户账号" name="userAccount">
                                <a-input
                                    v-if="routerType !== 'detail'"
                                    :disabled="editUserAccount"
                                    :maxlength="12"
                                    v-model:value.trim="formState.userAccount"
                                />
                                <span v-if="routerType === 'detail'">{{
                                    formState.userAccount ? formState.userAccount : '- -'
                                }}</span>
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="用户姓名" name="userName">
                                <a-input
                                    v-if="routerType !== 'detail'"
                                    autocomplete="off"
                                    :maxlength="32"
                                    v-model:value.trim="formState.userName"
                                />
                                <span v-if="routerType === 'detail'">{{
                                    formState.userName ? formState.userName : '- -'
                                }}</span>
                            </a-form-item>
                        </a-col>
                        <!-- <a-col :span="6">
                            <a-form-item label="账号日期" name="time">
                                <a-range-picker
                                    v-if="routerType !== 'detail'"
                                    v-model:value="formState.time"
                                    value-format="YYYY-MM-DD"
                                />
                                <span v-if="routerType === 'detail'">{{
                                    formState.time ? formState.time.join('-') : '- -'
                                }}</span>
                            </a-form-item>
                        </a-col> -->

                        <a-col :span="6">
                            <a-form-item label="账号开始日期" name="fromDate">
                                <a-date-picker
                                    v-if="routerType !== 'detail'"
                                    v-model:value="formState.fromDate"
                                    value-format="YYYY-MM-DD"
                                />
                                <span v-if="routerType === 'detail'">{{
                                    formState.fromDate ? formState.fromDate : '- -'
                                }}</span>
                            </a-form-item>
                        </a-col>

                        <a-col :span="6">
                            <a-form-item label="账号结束日期" name="toDate">
                                <a-date-picker
                                    v-if="routerType !== 'detail'"
                                    v-model:value="formState.toDate"
                                    value-format="YYYY-MM-DD"
                                />
                                <span v-if="routerType === 'detail'">{{
                                    formState.toDate ? formState.toDate : '- -'
                                }}</span>
                            </a-form-item>
                        </a-col>

                        <a-col :span="6">
                            <a-form-item label="用户密码" name="password">
                                <a-input
                                    v-if="routerType === 'add'"
                                    autocomplete="off"
                                    :maxlength="30"
                                    v-model:value.trim="formState.password"
                                />
                                <a-input
                                    v-if="routerType === 'edit'"
                                    autocomplete="off"
                                    :maxlength="30"
                                    disabled
                                    default-value="********"
                                />
                                <span v-if="routerType === 'detail'">{{
                                    formState.password ? formState.password : '- -'
                                }}</span>
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="是否启用" name="lockFlag">
                                <a-switch
                                    :checkedValue="1"
                                    :unCheckedValue="0"
                                    :disabled="routerType === 'detail'"
                                    v-model:checked="formState.lockFlag"
                                />
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-card>
            </a-form>
        </TpfCollapse>
    </div>
</template>

<script setup lang="ts" name="base">
    import { ref, computed, unref, onMounted, watch } from 'vue';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import type { FormInstance } from 'ant-design-vue';
    import {
        checkRequired,
        checkSpecial,
        checkNumLetter,
        checkNumberAndLetter
    } from '@/formRuleConfig/Tpfrules';
    import { Rule } from 'ant-design-vue/es/form';
    import type { TpfValidateRule } from '@/types';

    import { getTpfOptionEnum } from '@/config';
    import { useUserApi } from '@/api';
    import mitts from '@/utils/bus';
    import { useRouter } from 'vue-router';

    type Props = {
        paramsData: any;
    };
    const props = withDefaults(defineProps<Props>(), {
        paramsData: () => ({})
    });
    const userApi = useUserApi();
    const { statusNumberOption, getLabel } = getTpfOptionEnum();
    const $router = useRouter();

    const routerType = computed(() => $router.currentRoute.value.query.type);
    const baseRef = ref<FormInstance>() as any;
    const userId = computed(() => $router.currentRoute.value.query.userId);

    const editEmployeeNo = ref(false);
    const editUserAccount = ref(false);

    const formState = ref<any>({
        toDate: '',
        fromDate: '',
        userAccount: '',
        userName: '',
        employeeNo: '',
        systemFlag: 1,
        lockFlag: 1,
        password: 'IME123456'
    });

    const isSystemUser = ref(formState.value?.systemFlag === 1);

    const rules = computed(() => {
        return {
            employeeNo: [
                {
                    validator: async (_rule: Rule, value: string) => {
                        try {
                            if (routerType.value === 'add' || !editEmployeeNo.value) {
                                if (value) {
                                    const res = await userApi.checkEmployeeNo({
                                        employeeNo: value,
                                        userId: userId.value
                                    });
                                    if (!res.data.value) {
                                        return Promise.reject(res.errorMessage || '员工工号重复');
                                    }
                                    return Promise.resolve();
                                }
                            }
                        } catch (error) {
                            console.log('error: ', error);
                        }
                    },
                    trigger: ['blur']
                },
                // checkSpecial(),
                checkNumberAndLetter()
            ],
            userAccount: [
                checkRequired({
                    message: '请输入用户账号',
                    required: routerType.value !== 'detail' ? unref(isSystemUser) : false
                }),
                // checkSpecial(),
                checkNumberAndLetter(),
                {
                    validator: async (_rule: Rule, value: string) => {
                        try {
                            if (routerType.value === 'add' || !editUserAccount.value) {
                                if (value) {
                                    const res = await userApi.checkUserAccount({
                                        userAccount: value,
                                        userId: userId.value
                                    });
                                    if (!res.data.value) {
                                        return Promise.reject(res.errorMessage || '用户账号重复');
                                    }
                                    return Promise.resolve();
                                }
                            }
                        } catch (error) {
                            console.log('error: ', error);
                        }
                    },
                    trigger: ['blur']
                }
            ],
            fromDate: [
                checkRequired({
                    message: '请选择账号开始日期',
                    required: routerType.value !== 'detail' ? unref(isSystemUser) : false
                })
            ],
            userName: [
                checkSpecial(),
                checkRequired({
                    message: '请输入用户姓名',
                    required: routerType.value !== 'detail'
                })
            ],
            password: [
                checkRequired({
                    message: '请输入密码',
                    required:
                        routerType.value !== 'detail'
                            ? unref(isSystemUser) && routerType.value === 'add'
                            : false
                }),
                checkNumLetter(),

                {
                    validator: async (_rule: Rule, value: string) => {
                        if (routerType.value === 'add') {
                            if (value.length < 8 && value) {
                                return Promise.reject('密码不得少于8位');
                            }
                            if (value) {
                                if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,30}$/.test(value)) {
                                    return Promise.reject('请输入字母+数字组合');
                                }
                            }

                            return Promise.resolve();
                        }
                    },
                    trigger: ['blur']
                }
            ]
        } as TpfValidateRule;
    });

    const changeUser = (e?: any) => {
        isSystemUser.value = e === 0 ? false : true;
        mitts.emit('event', formState.value.systemFlag);
    };
    const load = () => {
        if (routerType.value !== 'add') {
            console.log(props.paramsData);

            Object.keys(formState.value).forEach(key => {
                formState.value[key] = props.paramsData[key];
            });

            isSystemUser.value = formState.value?.systemFlag === 1;
            editEmployeeNo.value = formState.value.employeeNo?.length > 1 ? true : false;
            editUserAccount.value = formState.value.userAccount?.length > 1 ? true : false;
        }
    };
    watch(
        () => formState.value.userName,
        async val => {
            mitts.emit('userName', val);
        },
        { deep: true, immediate: true }
    );
    onMounted(() => {
        load();
    });
    defineExpose({
        formState,
        baseRef
    });
    onMounted(() => {});
</script>

<style scoped lang="less">
    :deep(.ant-card) {
        .ant-card-body {
            padding: 8px 12px 8px 12px;

            .title_name {
                padding-left: 16px !important;
                color: #1d2129;
                font-size: 16px;
            }

            .ant-picker {
                width: 100% !important;
            }
        }
    }
</style>
