<template>
    <div class="fc-style">
        {{ state.rules }}
        <a-form
            ref="generateForm"
            :model="state.model"
            :rules="state.rules"
            :layout="state.widgetForm.config.layout"
            :labelAlign="state.widgetForm.config.labelAlign"
            :labelCol="state.widgetForm.config.labelCol"
            :hideRequiredMark="state.widgetForm.config.hideRequiredMark"
        >
            <template v-for="element of state.widgetForm.list">
                <template v-if="element.type === 'grid'">
                    <a-row
                        type="flex"
                        v-if="element.key"
                        :key="element.key"
                        :gutter="element.options.gutter ?? 0"
                        :justify="element.options.justify"
                        :align="element.options.align"
                    >
                        <a-col
                            v-for="(col, colIndex) of element.columns"
                            :key="colIndex"
                            :span="col.span ?? 0"
                        >
                            <AntdGenerateFormItem
                                v-for="colItem of col.list"
                                :model="state.model"
                                :key="colItem.key"
                                :element="colItem"
                                :config="data.config"
                                :disabled="disabled"
                            />
                        </a-col>
                    </a-row>
                </template>
                <AntdGenerateFormItem
                    v-else
                    :model="state.model"
                    :key="element.key"
                    :element="element"
                    :config="data.config"
                    :disabled="disabled"
                />
            </template>
        </a-form>
    </div>
</template>

<script lang="ts" setup name="AntdGenerateForm">
    import { unref, onMounted, reactive, ref, watch } from 'vue';
    import { FormInstance, message } from 'ant-design-vue';
    import AntdGenerateFormItem from './AntdGenerateFormItem.vue';
    import { antd } from '@/FormEditorPlugin/config';
    import { cloneDeep } from 'lodash-es';
    // defineOptions({
    //     name: 'AntdGenerateForm'
    // });
    type Props = {
        data: { [k: string]: any };
        value?: { [k: string]: any };
        disabled?: boolean;
    };
    const props = withDefaults(defineProps<Props>(), {
        data: () => antd.widgetForm,
        disabled: false
    });
    const generateForm = ref<FormInstance | null>(null);

    const state = reactive({
        model: {} as any,
        rules: {} as any,
        widgetForm: (props.data && cloneDeep(props.data)) ?? antd.widgetForm
    });

    const generateModel = (list: any[]) => {
        for (let index = 0; index < list.length; index++) {
            const model = list[index].model;
            if (!model) {
                return;
            }
            if (list[index].type === 'grid') {
                list[index].columns.forEach((col: any) => generateModel(col.list));
            } else {
                if (props.value && Object.keys(props.value).includes(model)) {
                    state.model[model] = props.value[model];
                } else {
                    state.model[model] = list[index].options.defaultValue;
                }
                state.rules[model] = list[index].options.rules;
                console.log(state.rules);
            }
        }
    };

    const generateOptions = (list: any[]) => {
        list.forEach(item => {
            if (item.type === 'grid') {
                item.columns.forEach((col: any) => generateOptions(col.list));
            } else {
                if (item.options.remote && item.options.remoteFunc) {
                    fetch(item.options.remoteFunc)
                        .then(resp => resp.json())
                        .then(json => {
                            if (json instanceof Array) {
                                item.options.remoteOptions = json.map(data => ({
                                    label: data[item.options.props.label],
                                    value: data[item.options.props.value],
                                    children: data[item.options.props.children]
                                }));
                            }
                        });
                }
            }
        });
    };

    watch(
        () => props.data,
        val => {
            state.widgetForm = (val && cloneDeep(val)) ?? antd.widgetForm;
            state.model = {};
            state.rules = {};
            generateModel(state.widgetForm.list);
            generateOptions(state.widgetForm.list);
        },
        { deep: true, immediate: true }
    );

    onMounted(() => {
        generateModel(state.widgetForm?.list ?? []);
        generateOptions(state.widgetForm?.list ?? []);
    });

    const getData = async () => {
        const res = await unref(generateForm)?.validate();
        // console.log('res: ', res);
        return state.model;
    };

    const reset = async () => {
        unref(generateForm)?.resetFields();
    };

    defineExpose({ getData, reset });
</script>
