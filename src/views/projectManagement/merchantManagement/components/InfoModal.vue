<template>
    <div>
        <TpfModal
            class="InfoModal"
            v-model:visible="visible"
            height="500px"
            width="800px"
            :title="title"
        >
            <a-form
                v-if="title != '客商管理详情'"
                ref="formRef"
                class="tpf-form"
                :model="formState"
                :label-col="{ span: 7 }"
                :wrapper-col="{ span: 20 }"
                :rules="rules"
            >
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-item name="customerSupplierCode" label="单位编号">
                            <a-input
                                :disabled="title === '编辑客商管理' || title === '客商管理详情'"
                                v-model:value.trim="formState.customerSupplierCode"
                            /> </a-form-item
                    ></a-col>
                    <a-col :span="12">
                        <a-form-item name="customerSupplierName" label="单位名称">
                            <a-input
                                :disabled="title === '客商管理详情'"
                                v-model:value.trim="formState.customerSupplierName"
                            /> </a-form-item
                    ></a-col>
                    <a-col :span="12">
                        <a-form-item name="customerSupplierShortName" label="单位简称">
                            <a-input
                                :disabled="title === '客商管理详情'"
                                v-model:value.trim="formState.customerSupplierShortName"
                            /> </a-form-item
                    ></a-col>
                    <a-col :span="12">
                        <a-form-item name="companyId" label="所属公司">
                            <a-select
                                v-model:value="formState.companyId"
                                allowClear
                                :disabled="title === '客商管理详情'"
                            >
                                <a-select-option
                                    v-for="item in companyOption"
                                    :value="item.value"
                                    :key="item.value"
                                    >{{ item.label }}</a-select-option
                                >
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="customerSupplierType" label="类型">
                            <a-select
                                v-model:value="formState.customerSupplierType"
                                :disabled="title === '客商管理详情'"
                            >
                                <a-select-option value="CUSTOMER">客户</a-select-option>
                                <a-select-option value="SUPPLIER">供应商</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="deliveryType" label="发货模式">
                            <a-select
                                v-model:value="formState.deliveryType"
                                :disabled="title === '客商管理详情'"
                            >
                                <a-select-option value="BYCUSTOMER">按客户</a-select-option>
                                <a-select-option value="BYBATCH">按订单批次</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-item name="contacts" label="联系人">
                            <a-input
                                :disabled="title === '客商管理详情'"
                                v-model:value.trim="formState.contacts"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="telephone" label="电话">
                            <a-input
                                :disabled="title === '客商管理详情'"
                                v-model:value.trim="formState.telephone"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="email" label="邮箱">
                            <a-input
                                :disabled="title === '客商管理详情'"
                                v-model:value.trim="formState.email"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="shengshiqu" label="所在地区">
                            <a-cascader
                                :disabled="title === '客商管理详情'"
                                v-model:value="formState.shengshiqu"
                                :options="regionData"
                                expand-trigger="hover"
                                placeholder="请选择地区"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="address" label="详细地址">
                            <a-input
                                :disabled="title === '客商管理详情'"
                                v-model:value.trim="formState.address"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="forbidden" label="启用">
                            <a-switch
                                v-model:checked="formState.forbidden"
                                :disabled="title === '客商管理详情'"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="14">
                        <a-form-item name="remark" label="备注">
                            <a-textarea
                                :rows="3"
                                v-model:value="formState.remark"
                                :disabled="title === '客商管理详情'"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
            <a-form
                v-else-if="title === '客商管理详情'"
                ref="formRef"
                :model="formState"
                :label-col="{ span: 7 }"
                :wrapper-col="{ span: 20 }"
                class="tpf-form read"
            >
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-item name="customerSupplierCode" label="单位编号">
                            <span class="fontcolor">{{
                                formState.customerSupplierCode
                                    ? formState.customerSupplierCode
                                    : '- -'
                            }}</span>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="customerSupplierName" label="单位名称">
                            <span class="fontcolor">{{
                                formState.customerSupplierName
                                    ? formState.customerSupplierName
                                    : '- -'
                            }}</span>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="customerSupplierShortName" label="单位简称">
                            <span class="fontcolor">{{
                                formState.customerSupplierShortName
                                    ? formState.customerSupplierShortName
                                    : '- -'
                            }}</span>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="companyId" label="所属公司">
                            <span class="fontcolor">{{
                                formState.companyName ? formState.companyName : '- -'
                            }}</span>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="customerSupplierType" label="类型">
                            <span class="fontcolor">{{
                                formState.customerSupplierType
                                    ? formState.customerSupplierType === 'CUSTOMER'
                                        ? '客户'
                                        : '供应商'
                                    : '- -'
                            }}</span>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="deliveryType" label="发货模式">
                            <span class="fontcolor">{{
                                formState.deliveryType
                                    ? formState.deliveryType === 'BYCUSTOMER'
                                        ? '按客户'
                                        : '按订单批次'
                                    : '- -'
                            }}</span>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="contacts" label="联系人">
                            <span class="fontcolor">
                                {{ formState.contacts ? formState.contacts : '- -' }}
                            </span>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="telephone" label="电话">
                            <span class="fontcolor">
                                {{ formState.telephone ? formState.telephone : '- -' }}
                            </span>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="email" label="邮箱">
                            <span class="fontcolor">
                                {{ formState.email ? formState.email : '- -' }}
                            </span>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="shengshiqu" label="所在地区">
                            <span class="fontcolor">{{
                                formState.province ? formState.shengshiqu2 : '- -'
                            }}</span>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="address" label="详细地址">
                            <span class="fontcolor">{{
                                formState.address ? formState.address : '- -'
                            }}</span>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="forbidden" label="启用">
                            <a-switch
                                v-model:checked="formState.forbidden"
                                :disabled="title === '客商管理详情'"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="14">
                        <a-form-item name="remark" label="备注" :labelCol="{ span: 6 }">
                            <span class="fontcolor">
                                {{ formState.remark ? formState.remark : '- -' }}
                            </span>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
            <template #footerRight>
                <a-button class="tpf-button" @click="setVisible(false)">
                    {{ title !== '客商管理详情' ? '取消' : '关闭' }}
                </a-button>
                <a-button
                    class="tpf-button"
                    type="primary"
                    @click="onSave"
                    v-if="title !== '客商管理详情'"
                >
                    保存
                </a-button>
            </template>
        </TpfModal>
    </div>
</template>

<script setup lang="ts" name="InfoModalCustomerSupplier">
    import { ref, reactive } from 'vue';
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useRef, useAntdForm } from '@/hooks';
    import { checkRequired, checkMaxLength, checkNumLetter } from '@/formRuleConfig/Tpfrules';
    import type { TpfValidateRule } from '@/types';
    import { useCustomerSupplierAPi, useCompanyAPi } from '@/api';
    import { regionData } from '@/config';
    import { formateTreeCode } from '@/utils';
    import { getSysGroupManagement } from '@/utils';

    const { formRef, submitForm } = useAntdForm();

    const [visible, setVisible] = useRef(false);

    const customerSupplierAPi = useCustomerSupplierAPi();

    const companyAPi = useCompanyAPi();

    const title = ref('新增客商管理');

    const formState = ref();

    const customerSupplierId = ref();

    const companyOption = reactive([{ value: 0, label: '' }]);

    const emits = defineEmits(['submitAdd', 'submitUpdata']);

    const initObj = () => {
        return {
            customerSupplierCode: '' as string,
            customerSupplierName: '',
            customerSupplierType: '' as string | number,
            forbidden: true,
            customerSupplierShortName: '',
            contacts: '',
            telephone: '',
            province: '',
            address: '',
            createUser: '',
            modifyUser: '',
            deliveryType: 'BYCUSTOMER' as string | number,
            remark: '',
            email: '',
            createDatetime: [],
            modifyDatetime: [],
            shengshiqu: [],
            companyId: '' as string | number
        };
    };

    const rules = {
        customerSupplierCode: [
            checkRequired({ message: '必填字段 ,只允许数字字母组合!' }),
            checkNumLetter({ message: '必填字段 ,只允许数字字母组合!', required: true }),
            checkMaxLength(50),
            {
                validator: async (_rule, value) => {
                    try {
                        if (!value) {
                            return Promise.resolve();
                        }
                        if (title.value === '编辑客商管理' || title.value === '客商管理详情') {
                            return Promise.resolve();
                        }
                        const { customerSupplierCode } = formState.value;
                        if (/^[A-Za-z0-9]+$/.test(value)) {
                            const res = await customerSupplierAPi.checkCustomerSupplierCode({
                                customerSupplierCode
                            });
                            if (!res.data.value) {
                                return Promise.reject(res.errorMessage || '该单位编号已有！');
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
        customerSupplierName: [checkRequired(), checkMaxLength(100)],
        customerSupplierType: [checkRequired()],
        customerSupplierShortName: [checkMaxLength(50)],
        deliveryType: [checkRequired()],
        contacts: [checkMaxLength(50)],
        telephone: [checkMaxLength(20)],
        email: [checkMaxLength(50)],
        address: [checkMaxLength(100)],
        remark: [checkMaxLength(500)],
        companyId: [checkRequired({ required: getSysGroupManagement() })]
    } as TpfValidateRule;

    const open = (t: string, v: any) => {
        setVisible(!visible.value);
        getCompany();
        if (t === 'add') {
            title.value = '新增客商管理';
            formState.value = initObj();
        } else if (t === 'update') {
            title.value = '编辑客商管理';
            formState.value = initObj();
            formState.value = { ...v };
            if (v.province) {
                formState.value.shengshiqu = [v.province, v.city, v.area];
            } else {
                formState.value.shengshiqu = [];
            }
            formState.value.forbidden = v.forbidden === '0' ? false : true;
            formState.value.deliveryType = v.deliveryType ? v.deliveryType : 'BYCUSTOMER';
            customerSupplierId.value = v.customerSupplierId;
        } else if (t === 'viewInfo') {
            title.value = '客商管理详情';
            formState.value = initObj();
            formState.value = { ...v };
            if (v.province) {
                formState.value.shengshiqu = [v.province, v.city, v.area];
                formState.value.shengshiqu2 = formateTreeCode(
                    regionData,
                    formState.value.shengshiqu
                );
            }
            formState.value.forbidden = v.forbidden === '0' ? false : true;
            formState.value.deliveryType = v.deliveryType ? v.deliveryType : 'BYCUSTOMER';
        }
    };

    const onSave = async () => {
        const res = await submitForm();
        if (res) {
            res.province = res.shengshiqu[0];
            res.city = res.shengshiqu[1];
            res.area = res.shengshiqu[2];
            res.forbidden = res.forbidden ? 1 : 0;
            if (title.value === '新增客商管理') {
                emits('submitAdd', res);
            } else if (title.value === '编辑客商管理') {
                res.customerSupplierId = customerSupplierId.value;
                emits('submitUpdata', res);
            }
        }
    };
    const getCompany = async () => {
        const res = await companyAPi.getCompanyIsValidList();
        if (res.success === true) {
            companyOption.length = 0;
            res.data.list.forEach(item => {
                const o = { label: '所有', value: 0 };
                o.label = item.companyName;
                o.value = item.companyId;
                companyOption.push(o);
            });
        }
    };

    defineExpose({ open });
</script>

<style scoped lang="less">
    .read {
        .fontcolor {
            color: #1d2129;
        }
    }
</style>
