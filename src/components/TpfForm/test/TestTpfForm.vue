<template>
    <TpfCollapse :title="`${index}-表单 - TpfForm`" isHidden>
        <TpfForm :form-list="formList" @onSubmit="onSubmit" noUseInit />
        <pre>{{ html }}</pre>
        <a-table :data-source="dataSource" :columns="getColumns()" :pagination="false" />
    </TpfCollapse>
</template>

<script setup lang="tsx" name="TestTpfForm">
    import { defineAsyncComponent, ref, computed } from 'vue';
    import { getColumns } from '@/components/config';
    import TpfForm from '@/components/TpfForm/index.vue';
    const TpfCollapse = defineAsyncComponent(() => import('@/components/TpfCollapse/index.vue'));

    defineProps<{ index?: number }>();

    const onSubmit = async (val: any) => {
        const { message } = await import('ant-design-vue');
        message.success(JSON.stringify(val));
    };

    const formList = computed(() => {
        return [
            {
                type: 'RangePicker', // 注意这里需要从组件库引入
                field: 'RangePicker',
                label: '时间',
                placeholder: ['左边', '右边'],
                allowClear: true,
                slots: {} //插槽放这里
            },
            {
                type: 'Input',
                field: 'name',
                label: '姓名',
                placeholder: 'input placeholder',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'age',
                label: '年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄'
            },
            {
                type: 'Input',
                field: 'projectGroupCode',
                label: '项目集编号',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'projectGroupName',
                label: '项目集名称',
                allowClear: true
            },
            {
                type: 'RangePicker',
                field: 'requirementDate',
                showDefaultValue: [],
                label: '交期',
                allowClear: true
            }
        ];
    });

    const dataSource = ref([
        {
            params: 'noUseInit',
            introduce: '不需要初始化后提交submit',
            type: 'boolean',
            defaultValue: 'false'
        },
        {
            params: 'pageCode',
            introduce: '配置项中的pageCode',
            type: 'string',
            defaultValue: ''
        },
        {
            params: 'noUseCache',
            introduce: '不使用缓存',
            type: 'boolean',
            defaultValue: 'false'
        },
        {
            params: 'hiddenCollapse',
            introduce: '隐藏折叠按钮',
            type: 'boolean',
            defaultValue: 'false'
        },
        {
            params: 'hiddenSubmit',
            introduce: '隐藏提交按钮',
            type: 'boolean',
            defaultValue: 'false'
        },
        {
            params: 'formState',
            introduce: '表单初始化数据',
            type: 'object',
            defaultValue: ''
        },
        {
            params: 'formList',
            introduce: '渲染表单的列表',
            type: 'object',
            defaultValue: ''
        },
        {
            params: 'formProps',
            introduce: 'form组件的props - 支持所有的官方的FormProps',
            type: 'object',
            defaultValue: ''
        },
        {
            params: 'rowProps',
            introduce: '每一行的props - 支持所有的官方的RowProps',
            type: 'object',
            defaultValue: ''
        },
        {
            params: 'colProps',
            introduce: '每一个的props - 支持所有的官方的ColProps',
            type: 'object',
            defaultValue: '{ span: 6 }'
        },
        {
            params: 'formItemProps',
            introduce: '每一个formItem的props - 支持所有的官方的FormItemProps',
            type: 'object',
            defaultValue: ''
        },
        {
            params: 'rules',
            introduce: '表单的 rules - 支持所有的官方的FormRules',
            type: '[]',
            defaultValue: ''
        },
        {
            params: 'labelCol',
            introduce: 'label样式 ',
            type: 'object',
            defaultValue: '{ style: { width: 90px } }'
        },
        {
            params: 'beforeRender',
            introduce: '渲染form前的处理 ',
            type: '(list)=>list',
            defaultValue: ''
        },
        {
            params: '@onSubmit',
            introduce: '提交的事件 ',
            type: '(val:[])=>{}',
            defaultValue: ''
        },
        {
            params: '实例暴露出来的属性',
            introduce: '实例暴露出来的属性 ',
            type: 'onSubmit, newState, formRef, setNewState',
            defaultValue: ''
        },
        {
            params: '其他属性跟插槽',
            introduce: '支持官方的form 表单中的所有组件 支持所有的属性跟插槽',
            type: '',
            defaultValue: ''
        }
    ]);

    const html = `
        <TpfForm :form-list="formList" @onSubmit="onSubmit" noUseInit />

        const TpfForm = defineAsyncComponent(() => import('@/components/TpfForm/index.vue'));
        const onSubmit = async (val: any) => {
        const { message } = await import('ant-design-vue');
        message.success(JSON.stringify(val));
        };
        const formList = computed(() => {
        return [
            {
                type: 'RangePicker', // 注意这里需要从组件库引入
                field: 'RangePicker',
                label: '时间',
                placeholder: ['左边', '右边'],
                allowClear: true,
                slots: {} //插槽放这里
            },
            {
                type: 'Input',
                field: 'name',
                label: '姓名',
                placeholder: 'input placeholder',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'age',
                label: '年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄'
            },
            {
                type: 'Input',
                field: 'projectGroupCode',
                label: '项目集编号',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'projectGroupName',
                label: '项目集名称',
                allowClear: true
            },
            {
                type: 'RangePicker',
                field: 'requirementDate',
                showDefaultValue: [],
                label: '交期',
                allowClear: true
            }
        ];
    });
        `;
</script>
