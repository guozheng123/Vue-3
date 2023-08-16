<template>
    <TpfModal
        v-model:visible="visible"
        height="400px"
        :title="title"
        width="700px"
        :body-style="{ paddingTop: '24px' }"
    >
        <a-form
            ref="formRef"
            class="tpf-form"
            layout="horizontal"
            :model="formState"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 18 }"
            :rules="rules"
        >
            <a-form-item label="菜单编号" name="menuCode">
                <a-input
                    :disabled="isEdit"
                    :maxlength="50"
                    allowClear
                    v-model:value.trim="formState.menuCode"
                />
            </a-form-item>
            <a-form-item label="菜单名称" name="menuName">
                <a-input :maxlength="20" allowClear v-model:value.trim="formState.menuName" />
            </a-form-item>
            <a-form-item label="上级菜单" name="parentCode">
                <a-tree-select
                    :disabled="isEdit || isChange"
                    v-model:value="formState.parentCode"
                    show-search
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                    placeholder="请选择上级菜单"
                    @select="select"
                    allow-clear
                    tree-default-expand-all
                    :tree-data="treeData"
                    :field-names="{
                        children: 'children',
                        label: 'label',
                        value: 'id'
                    }"
                />
            </a-form-item>

            <a-form-item label="平台" name="platform">
                <a-radio-group v-model:value="formState.platform" :options="TREEACE_TYPE" />
            </a-form-item>

            <a-form-item label="资源类型" name="menuType">
                <a-radio-group
                    @change="changeMenuType"
                    v-model:value="formState.menuType"
                    :options="menuTypeList"
                />
            </a-form-item>
            <a-form-item label="行业" name="industry">
                <a-select v-model:value="formState.industry" :options="TRADE2" />
            </a-form-item>
            <a-form-item label="排序" name="displayOrdinal">
                <a-input-number
                    :min="1"
                    v-model:value.trim="formState.displayOrdinal"
                    class="t-w-full"
                />
            </a-form-item>

            <a-form-item label="URL" name="path">
                <a-input :disabled="isPath" allowClear v-model:value.trim="formState.path" />
            </a-form-item>
            <a-form-item label="组件路径" name="component">
                <a-input :disabled="isPath" allowClear v-model:value.trim="formState.component" />
            </a-form-item>
            <a-form-item label="ICON" name="icon">
                <a-input :disabled="isICON" allowClear v-model:value.trim="formState.icon" />
            </a-form-item>

            <a-form-item label="是否启用" name="isEnable">
                <a-switch
                    checkedValue="1"
                    unCheckedValue="0"
                    v-model:checked="formState.isEnable"
                />
            </a-form-item>
            <a-form-item label="是否显示" name="visible">
                <a-switch checkedValue="0" unCheckedValue="1" v-model:checked="formState.visible" />
            </a-form-item>
            <a-form-item label="是否缓存" name="doCache">
                <a-switch v-model:checked="formState.doCache" />
            </a-form-item>
            <a-form-item label="备注" name="remark">
                <a-textarea :maxlength="200" allowClear v-model:value="formState.remark" />
            </a-form-item>
        </a-form>

        <template #footerRight>
            <a-button class="tpf-button" @click="onCancel">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="onSave">保存</a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="ts" name="AddMenu">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { checkRequired, checkSpecial } from '@/formRuleConfig/Tpfrules';
    import { useRef, useAntdForm } from '@/hooks';
    import type { TpfValidateRule } from '@/types';
    import { Rule } from 'ant-design-vue/es/form';
    import { ref, watch, unref, computed } from 'vue';
    import { useMenuApi } from '@/api';
    import { TRADE2, TREEACE_TYPE, menuType } from '@/config';

    const menuApi = useMenuApi();
    const [visible, setVisible] = useRef(false);
    const { formRef, submitForm, resetFields } = useAntdForm();
    const menuTypeList = ref(menuType); // 资源类型
    const formState = ref({
        id: '',
        menuCode: '',
        menuName: '',
        parentCode: '',
        platform: 'pc',
        menuType: 'M',
        industry: '',
        displayOrdinal: '',
        path: '',
        icon: '',
        isEnable: '1',
        remark: '',
        visible: '0',
        component: '',
        doCache: false
    });
    const treeData: any = ref();
    const isEdit = ref(true);
    const title = ref<string>('');
    const isPath = ref(false);
    const isICON = ref(true);
    const isChange = ref(false);
    const isPathRequired = ref(false);
    const paramsPath = ref('');
    const emits = defineEmits(['submitAdd', 'submitUpdata']);
    const rules = computed(() => {
        return {
            menuCode: [
                checkRequired(),
                checkSpecial(),
                {
                    validator: async (_rule: Rule, value: string) => {
                        try {
                            if (!unref(isEdit)) {
                                const params = {
                                    sysMenuCode: value
                                };
                                const res = await menuApi.checkSysMenuCode(params);
                                if (!res.data.value) {
                                    return Promise.reject(
                                        res.errorMessage || '菜单编号重复或编号格式不正确！'
                                    );
                                }
                                return Promise.resolve();
                            }
                        } catch (error) {
                            console.log('error: ', error);
                        }
                    },
                    trigger: ['blur']
                }
            ],
            menuName: [checkRequired(), checkSpecial()],
            industry: [checkRequired()],
            displayOrdinal: [checkRequired()],
            path: [
                checkRequired({
                    message: '请输入URL',
                    required: unref(isPathRequired)
                })
            ],
            component: [
                checkRequired({
                    message: '请输入组件路径',
                    required: unref(isPathRequired)
                })
            ]
        } as TpfValidateRule;
    });
    watch(
        () => formState.value.menuType,
        val => {
            if (val === 'C') {
                isPath.value = false;
            } else {
                isPath.value = true;
                formState.value.path = '';
            }
            if (val === 'F') {
                isICON.value = true;
                formState.value.icon = '';
            } else {
                isICON.value = false;
            }
        },
        {
            deep: true,
            immediate: true
        }
    );

    watch(
        () => formState.value.parentCode,
        val => {
            menuTypeList.value[2].disabled = val ? false : true;
        },
        {
            deep: true,
            immediate: true
        }
    );
    const changeMenuType = (e?: any) => {
        isPathRequired.value = e.target.value === 'C' ? true : false;
    };
    const select = (select: any, node: any) => {
        if (node.type === 'C') {
            menuTypeList.value[3].disabled = false;
        } else {
            menuTypeList.value[3].disabled = true;
        }
    };
    const onSave = async () => {
        const res = await submitForm();
        if (title.value === '新增菜单') {
            if (res.menuType === 'M') {
                res.path = formState.value.parentCode
                    ? paramsPath.value + '/' + res.menuCode
                    : '/' + res.menuCode;
                res['component'] = res.path;
            }
            emits('submitAdd', res);
        } else {
            if (res.menuType === 'M') {
                res.path = formState.value.parentCode
                    ? paramsPath.value + '/' + res.menuCode
                    : '/' + res.menuCode;
                res['component'] = res.path;
            }

            const params = {
                ...res,
                id: formState.value.id
            };
            emits('submitUpdata', params);
        }
    };
    const onCancel = () => {
        setVisible(!visible.value);
    };
    const open = async (t: string, v: any) => {
        setVisible(!visible.value);
        if (t === 'edit') {
            isEdit.value = true;
            title.value = '编辑菜单';
            const params = {
                id: v.id
            };
            if (v.menuType === 'C') {
                menuTypeList.value[3].disabled = false;
            } else {
                menuTypeList.value[3].disabled = true;
            }
            formState.value = await menuApi.getSysMenuById(params).then(res => res.data.object);
        } else if (t === 'add') {
            isEdit.value = false;
            title.value = '新增菜单';
            if (v) {
                paramsPath.value = v.path;
                formState.value.parentCode = v.id;
                if (v.type === 'C') {
                    menuTypeList.value[3].disabled = false;
                } else {
                    menuTypeList.value[3].disabled = true;
                }
                isChange.value = true;
            } else {
                formState.value.parentCode = '';
                isChange.value = false;
            }
        }
        getTree();
    };
    const getTree = async () => {
        treeData.value = await menuApi.queryMenuTreeSelect().then(res => res.data.list);
    };
    watch(visible, () => {
        resetFields();
    });

    defineExpose({ open });
</script>
