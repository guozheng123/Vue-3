<template>
    <div>
        <TpfModal v-model:visible="visible" :title="title" height="200px" width="600px">
            <a-form ref="formRef" :model="formState" :labelCol="{ style: { width: '100px' } }">
                <a-row :gutter="[16, 16]">
                    <a-col :span="16">
                        <a-form-item
                            name="materialAuxiliaryUnitCode"
                            label="单位名称"
                            :rules="[{ required: true, message: '请选择单元名称!' }]"
                        >
                            <a-select
                                :disabled="disabled"
                                v-model:value="formState.materialAuxiliaryUnitCode"
                                style="width: 100%"
                                :options="materialUnitCodeOpt"
                                :fieldNames="{
                                    label: 'materialUnitName',
                                    value: 'materialUnitCode'
                                }"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="[16, 16]">
                    <a-col :span="10">
                        <a-form-item label="辅助单位">
                            <TpfInputNumber
                                :min="0"
                                v-model:value="formState.materialAuxiliaryUnitUsage"
                            >
                                <template #addonAfter>
                                    <div>{{ showMaterialUnitName }}</div>
                                </template>
                            </TpfInputNumber>
                        </a-form-item>
                    </a-col>
                    <a-col style="padding: 5px 0 0 30px" :span="2">
                        <SvgIcon type="icon-trending_flat" />
                    </a-col>
                    <a-col :span="10">
                        <a-form-item label="基本单位">
                            <TpfInputNumber :min="0" v-model:value="formState.materialUnitUsage">
                                <template #addonAfter>
                                    <div>{{ materialUnitInfo.materialUnitName }}</div>
                                </template>
                            </TpfInputNumber>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>

            <template #footerRight>
                <a-button class="tpf-button" @click="visible = false">取消</a-button>
                <a-button class="tpf-button" type="primary" @click="onSave">保存</a-button>
            </template>
        </TpfModal>
    </div>
</template>

<script setup lang="tsx">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { ref, unref, computed } from 'vue';
    import { useRef, useAntdForm } from '@/hooks';
    import { useMaterialUnitApi } from '@/api';
    import TpfInputNumber from '@/components/TpfInputNumber/index.vue';
    import { v4 } from 'uuid';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { message } from 'ant-design-vue';

    type Props = {
        materialUnitInfo: { materialUnitCode: string; materialUnitName: string };
        routerType: string;
    };
    const disabled = ref(false);
    const props = defineProps<Props>();
    const type = ref('');

    const { formRef, submitForm } = useAntdForm();
    const materialUnitApi = useMaterialUnitApi();

    const emit = defineEmits(['uploadTable']);

    const tableInfo = ref<any[]>([]);
    const [visible, setVisible] = useRef(false);

    interface FormState {
        materialAuxiliaryUnitCode: string;
        materialAuxiliaryUnitUsage: number;
        materialUnitUsage: number;
        uuid?: string;
        enable?: string;
    }
    const formState = ref<FormState>({
        materialAuxiliaryUnitCode: '',
        materialAuxiliaryUnitUsage: 1,
        materialUnitUsage: 1
    });
    const materialUnitAllList = ref<any[]>([]);

    const materialUnitCodeOpt = computed(() => {
        return materialUnitAllList.value.filter(
            item => item.materialUnitCode !== props.materialUnitInfo.materialUnitCode
        );
    });

    const showMaterialUnitName = computed(() => {
        const res =
            unref(materialUnitCodeOpt).find(
                item => item.materialUnitCode === unref(formState).materialAuxiliaryUnitCode
            ) || {};

        return res.materialUnitName;
    });

    const title = computed(() => {
        return unref(type) === 'add' ? ' 新增' : '编辑';
    });

    const getMaterialUnitByTenantId = async () => {
        materialUnitAllList.value = await materialUnitApi
            .getMaterialUnitByTenantId({
                status: '1'
            })
            .then(res => res.data.list);
    };

    const open = async (item: any = {}) => {
        console.log(item);

        if (item.type === 'add') {
            formState.value = {
                materialAuxiliaryUnitCode: '',
                materialAuxiliaryUnitUsage: 1,
                materialUnitUsage: 1
            } as any;
        } else {
            formState.value = unref(item.list);
        }
        getMaterialUnitByTenantId();
        tableInfo.value = unref(item.list);
        console.log(item.type);
        type.value = item.type;
        disabled.value = item.type !== 'add';

        setVisible(!visible.value);
    };

    const onSave = async () => {
        await submitForm();

        const {
            uuid,
            enable,
            materialAuxiliaryUnitCode,
            materialAuxiliaryUnitUsage,
            materialUnitUsage
        } = unref(formState);

        let hasFlag = false;
        console.log(unref(tableInfo));

        if (unref(type) === 'add') {
            unref(tableInfo).forEach(ele => {
                console.log(ele, materialAuxiliaryUnitCode);

                if (ele.materialAuxiliaryUnitCode === materialAuxiliaryUnitCode) {
                    hasFlag = true;
                }
            });
        }

        if (hasFlag) {
            return message.warn('该辅助单位已存在!');
        }
        const params = {
            materialAuxiliaryUnitCode, //辅助单位编号
            materialAuxiliaryUnitName: unref(showMaterialUnitName), //辅助单位名字
            materialAuxiliaryUnitUsage, //辅助单位用量
            materialUnitUsage, //基本单位用量
            materialUnitCode: props.materialUnitInfo.materialUnitCode, //基本单位编号
            materialUnitName: props.materialUnitInfo.materialUnitName, //基本单位名字
            enable: uuid ? enable : '1',
            uuid: uuid ? uuid : v4()
        };
        emit('uploadTable', params);
        setVisible(!visible.value);
    };

    defineExpose({ open });
</script>

<style scoped lang="less"></style>
