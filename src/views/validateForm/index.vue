<template>
    <div class="demoPage">
        <div>测试TpfBoxTest组件</div>

        <a-divider />
        <div>使用useForm</div>

        <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-item label="Activity name" name="name" v-bind="validateInfos.name">
                <a-input v-model:value="formState.name" />
            </a-form-item>

            <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button type="primary" @click="onSubmit">Create</a-button>
                <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button @click="getDemo" v-permission="[2, 3]">测试permission</a-button>
            </a-form-item>
        </a-form>

        <a-divider />
        <div>使用ref</div>
        <a-form
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            ref="formRef"
            :model="form2"
            :rules="rules"
        >
            <a-form-item label="type" name="type">
                <a-input v-model:value="form2.type" />
            </a-form-item>

            <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button type="primary" @click="submitForm">Create</a-button>
                <a-button style="margin-left: 10px" @click="rest">Reset</a-button>
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button @click="getDemo">测试接口</a-button>
            </a-form-item>
        </a-form>

        <a-divider />
        <div>
            测试svgIcon
            <SvgIcon type="ico_opt_circle_add" />
        </div>
        <a-divider />
        <div>
            <div>测试分页</div>
            <a-pagination v-bind="pagination" class="tpf-pagination" size="small" />
        </div>
        <a-divider />

        <a-space style="width: 300px">
            <a-button @click="getDataList()" block type="primary"> 走接口 测试 TableHook </a-button>
            <a-button @click="changeSize(18)" block type="primary"> 字体变大</a-button>
            <a-button @click="changeSize(14)" block type="primary"> 字体变小</a-button>
            <a-button @click="sizeType = 'small'" block type="primary"> 间距变小</a-button>
            <a-button @click="sizeType = 'middle'" block type="primary"> 间距标准</a-button>
            <a-button @click="sizeType = 'large'" block type="primary"> 间距变大</a-button>
        </a-space>
        <a-table
            @resizeColumn="handleResizeColumn"
            :scroll="{ x: 300, y: 400 }"
            :size="sizeType"
            class="ant-table-striped"
            :rowClassName="(record:any, index:any) => (index % 2 === 1 ? 'table-striped' : '')"
            :columns="columns"
            v-bind="{ ...tableInfo, pagination, loading }"
        />
        <a-divider />
        <div>121212121212</div>
    </div>
</template>

<script lang="tsx" setup>
    import { Form, Input, Textarea } from 'ant-design-vue';
    import axios from 'axios';
    import { reactive, ref } from 'vue';
    import { useAntdForm, useAntdTable } from '@/hooks';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import http from '@/utils/http';
    import { SizeType } from 'ant-design-vue/lib/config-provider';
    import type { TpfColumnType } from '@/types';

    interface FormState {
        name: string;
    }
    const useForm = Form.useForm;

    const formState = reactive<FormState>({
        name: ''
    });
    const form2 = reactive({
        type: '1'
    });

    const { formRef, submitForm, resetFields: rest } = useAntdForm();
    const getDemo = async () => {
        const res = await http.post('http://127.0.0.1:4523/m1/883869-0-default/demo');
        console.log('res: ', res);
    };

    const getList = async (params: FormState) => {
        const res = await axios.post<any>(
            'http://127.0.0.1:4523/m1/883869-0-default/imgList',
            params
        );
        return res.data;
    };

    const { tableInfo, pagination, loading, getDataList } = useAntdTable({
        api: () => getList(formState)
    });

    const columns = ref<TpfColumnType[]>([
        {
            title: '姓名',
            dataIndex: 'materialCode',
            key: 'name',
            align: 'center',
            width: 150,
            resizable: true,
            minWidth: 100,
            maxWidth: 200,
            customRender: ({ text }) => <Textarea value={text} />
        },
        {
            title: '年龄',
            dataIndex: 'plannedEndDateTime',
            key: 'age',
            align: 'center',
            width: 150,
            resizable: true,
            minWidth: 100,
            maxWidth: 200,
            customRender: ({ text }) => <Input value={text} />
        },
        { title: '住址', dataIndex: 'projectName', key: 'address', align: 'center', width: 150 },
        { title: '住址', dataIndex: 'projectName', key: 'address', align: 'center', width: 150 },
        { title: '住址', dataIndex: 'projectName', key: 'address', align: 'center', width: 150 },
        { title: '住址', dataIndex: 'projectName', key: 'address', align: 'center', width: 150 },
        { title: '住址', dataIndex: 'projectName', key: 'address', align: 'center', width: 150 },
        { title: '住址', dataIndex: 'projectName', key: 'address', align: 'center', width: 150 },
        { title: '住址', dataIndex: 'projectName', key: 'address', align: 'center', width: 150 },
        { title: '住址', dataIndex: 'projectName', key: 'address', align: 'center', width: 150 },
        { title: '住址', dataIndex: 'projectName', key: 'address', align: 'center', width: 150 },
        { title: '住址', dataIndex: 'projectName', key: 'address', align: 'center', width: 150 },
        { title: '住址', dataIndex: 'projectName', key: 'address', align: 'center', width: 150 },
        { title: '住址', dataIndex: 'projectName', key: 'address', align: 'center', width: 150 },
        { title: '住址', dataIndex: 'projectName', key: 'address', align: 'center', width: 150 }
    ]);

    const rules: any = {
        name: [
            { required: true, message: 'Please input Activity name', trigger: 'blur' },
            { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
        ],
        type: [
            { required: true, message: 'Please input Activity name', trigger: 'blur' },
            { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
        ]
    };
    const { resetFields, validate, validateInfos } = useForm(formState, rules);
    const fs = ref('14px');

    const changeSize = (num: number) => {
        fs.value = num + 'px';
    };

    const sizeType = ref<SizeType>('small');

    const onSubmit = async () => {
        const res = await validate();
        console.log('res: ', res);
    };
    const resetForm = () => {
        resetFields();
    };
    const labelCol = { span: 4 };
    const wrapperCol = { span: 10 };
    const handleResizeColumn = (w: number, col: TpfColumnType) => {
        col.width = w;
    };
</script>

<style scoped lang="less">
    .ant-table-striped :deep(.table-striped) td {
        background-color: #fafafa;
    }

    .more {
        cursor: pointer;
        .font();
        .flex_column();
        .justify_align();
    }

    .demoPage {
        padding: 10px;
        margin-left: 180px;
        box-sizing: border-box;
        overflow: auto;
        background-color: #ddd;
    }

    .tpf-table {
        :deep(.ant-table) {
            .ant-table-tbody {
                font-size: v-bind(fs);
            }
        }
    }
</style>
