<template>
    <TpfCollapse title="基本信息">
        <TpfSubmitForm
            :formList="initFormList"
            ref="TpfFormRef"
            :rules="rules"
            :labelCol="{ style: { width: '110px' } }"
        />
        <AddProcessModal
            ref="AddProcessModalDom"
            v-if="showAddProcessModalDom"
            @getSelect="getSelect"
        />
    </TpfCollapse>
</template>

<script setup lang="tsx">
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    // import TpfSubmitForm from '@/components/TpfSubmitForm/index.vue';
    import { ref, computed, unref, watchEffect, defineAsyncComponent } from 'vue';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { checkRequired } from '@/formRuleConfig/Tpfrules';
    import { useOpenAntdModal } from '@/hooks';
    import { useGuidebookApi } from '@/api';
    import { useTpfSubmitForm } from '@/components';
    import { isEmpty } from 'lodash-es';

    const { TpfSubmitForm } = useTpfSubmitForm();

    type Props = {
        info?: { [k: string]: any };
        fieldName?: string;
        type?: string;
    };

    const props = withDefaults(defineProps<Props>(), {
        fieldName: 'guidebookBaseInfo'
    });

    const emit = defineEmits<{
        (e: 'changeOperationCode', val: boolean): void;
    }>();
    const guidebookApi = useGuidebookApi();

    const AddProcessModal = defineAsyncComponent(() => import('./AddProcessModal.vue'));

    const [AddProcessModalDom, openAddProcessModalDom, showAddProcessModalDom] = useOpenAntdModal();

    const TpfFormRef = ref<InstanceType<typeof TpfSubmitForm> | null>(null);

    const tpfFormRefData = computed(() => {
        return TpfFormRef.value;
    });

    const initFormList = computed(() => {
        return [
            {
                type: 'Input',
                field: 'guidebookCode',
                label: 'ESOP编号',
                disabled: props.type === 'UPGRADES'
            },
            {
                type: 'Input',
                field: 'guidebookName',
                label: 'ESOP名称',
                disabled: props.type === 'UPGRADES'
            },
            {
                type: 'Input',
                field: 'version',
                label: '版本',
                disabled: true,
                showDefaultValue: 'V1'
            },
            {
                type: 'Input',
                field: 'operationCode',
                label: '工序编号',
                description: '工序编号和物料列表，至少有一个必须维护数据',
                readOnly: true,
                allowClear: true,
                onChange: (e: any) => {
                    const flag = !!e.target.value;
                    console.log('flag: ', flag);
                    emit('changeOperationCode', flag);
                    if (!flag) {
                        getSelect({});
                    }
                },
                slots: {
                    addonAfter: () => (
                        <SvgIcon type="icon-sousuo" size="16" onClick={openAddProcessModalDom} />
                    )
                }
            },
            { type: 'Input', field: 'operationName', label: '工序名称', disabled: true },
            { type: 'Textarea', field: 'remark', label: '备注', rows: 1 },
            {
                type: 'Switch',
                bindValue: 'checked',
                field: 'releaseFlag',
                label: '是否发布',
                unCheckedValue: '0',
                checkedValue: '1',
                showDefaultValue: '0',
                style: { width: 'unset' }
            }
        ];
    });

    const validatorGuidebookCode = () => ({
        trigger: ['blur'],
        validator: async (_rule: any, value: string) => {
            try {
                if (!value) {
                    return Promise.resolve();
                }
                if (['DETAIL', 'UPGRADES'].includes(props.type || '')) {
                    return Promise.resolve();
                }

                const flag = await guidebookApi
                    .checkGuidebookCode({ guidebookCode: value })
                    .then(res => res.data.value);
                if (flag) {
                    return Promise.resolve();
                }
                return Promise.reject('存在重复的编号');
            } catch (error) {
                console.log('error: ', error);
            }
        }
    });

    const rules = {
        guidebookCode: [checkRequired(), validatorGuidebookCode()],
        guidebookName: [checkRequired()]
    };

    const getSelect = (val: any = {}) => {
        if (TpfFormRef.value?.setNewState) {
            const { operationCode = '', operationName = '' } = unref(val) || {};
            TpfFormRef.value.setNewState({ operationCode, operationName });
            emit('changeOperationCode', !isEmpty(unref(val)));
        }
    };

    const submit = async () => {
        const res = (await TpfFormRef.value?.onSubmit()) as any;
        return { [props.fieldName]: { ...res, version: res.version.replace(/v/gi, '') } };
    };
    watchEffect(() => {
        if (props.info) {
            unref(tpfFormRefData)?.setNewState({ ...props.info, version: props.info.versionName });
        }
    });

    defineExpose({ submit });
</script>

<style lang="less" scoped></style>
