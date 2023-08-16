<template>
    <TpfLayout>
        <template #header>
            <LoadingSkeleton>
                <TpfForm :formList="formList" :rules="rules" @onSubmit="onSubmit" />
            </LoadingSkeleton>
        </template>
        <template #content>
            <LoadingSkeleton>
                <TpfTableLayout
                    showChangeTableFontSize
                    showChangeTableGap
                    showChangeTableColumnFields
                >
                    <template #default="args">
                        <TpfTable
                            v-bind="{ ...tableInfo, ...args, columns, pagination, operateColumn }"
                        />
                    </template>
                    <template #operateLeft>
                        <a-button class="tpf-button" type="primary">新增11 </a-button>
                        <a-button class="tpf-button" type="primary">新增 </a-button>
                        <a-button class="tpf-button" type="primary">新增 </a-button>
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
    </TpfLayout>
</template>

<script lang="tsx" setup>
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { Input } from 'ant-design-vue';
    import { ref, computed, unref, defineAsyncComponent } from 'vue';
    import { useAntdTable } from '@/hooks';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import TpfForm from '@/components/TpfForm/index.vue';
    import type { TpfColumnType } from '@/types';

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const formState = ref({
        name: 'zs',
        age: 20,
        name1: 2,
        time: '',
        RangePicker: []
    });
    const formList = computed(() => {
        return [
            {
                type: 'DatePicker',
                field: 'time',
                label: '时间',
                placeholder: 'input placeholder',
                allowClear: true
            },
            // {
            //     type: RangePicker,
            //     field: 'RangePicker',
            //     label: '时间2',
            //     placeholder: ['左边', '右边'],
            //     allowClear: true
            // },
            // {
            //     type: Input,
            //     field: 'name',
            //     label: '姓名',
            //     placeholder: 'input placeholder',
            //     allowClear: true
            // },
            {
                type: 'Input',
                field: 'age',
                label: '年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄年龄'
            },
            { type: Input, field: 'age1', label: '年龄111111' }
        ];
    });
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
    const onSubmit = (res: any) => {
        console.log('res:收集到的结果', res);
    };
    const columns = ref<TpfColumnType[]>([
        {
            title: '姓名11',
            dataIndex: 'materialCode',
            key: 'name',
            align: 'center',
            width: 150,
            fixed: 'left'
        },
        {
            title: '年龄',
            dataIndex: 'plannedEndDateTime',
            key: 'age',
            align: 'center',
            width: 350,
            resizable: true,
            minWidth: 100,
            maxWidth: 500
        },
        {
            title: '住址',
            dataIndex: 'projectName',
            key: 'address',
            align: 'center',
            width: 150,
            resizable: true,
            minWidth: 100,
            maxWidth: 200
        },
        { title: '住址', dataIndex: 'projectName', key: 'address', align: 'center', width: 150 },
        { title: '住址', dataIndex: 'projectName', key: 'address', align: 'center', width: 150 },
        { title: '住址', dataIndex: 'projectName', key: 'address', align: 'center', width: 150 },
        { title: '住址', dataIndex: 'projectName', key: 'address', align: 'center', width: 150 },
        { title: '住址', dataIndex: 'projectName', key: 'address', align: 'center', width: 150 },
        { title: '住址', dataIndex: 'projectName', key: 'address', align: 'center', width: 150 },

        {
            title: '住址',
            dataIndex: 'projectName',
            key: 'address',
            align: 'center',
            width: 150,
            fixed: 'right' // { title: '住址', dataIndex: 'projectName', key: 'address', align: 'center', width: 150 },
        }
    ]);

    const defaultBtn = [
        { title: '编辑', onClick: (row: any) => console.log('编辑', row) },
        { title: '编辑2', onClick: () => console.log('编辑2') },
        { title: '编辑3', onClick: () => console.log('编辑3') }
    ];
    const moreBtn = [
        { title: '更多1', onClick: () => console.log('更多1') },
        { title: '更多2', onClick: () => console.log('更多2') },
        { title: '更多3', onClick: () => console.log('更多3') }
    ];
    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 300,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn, moreBtn)
    });
    interface FormState {
        name: string;
    }
    const getList = async (params: FormState) => {
        return { list: [] };
    };

    const { tableInfo, pagination, loading } = useAntdTable({
        api: () => getList(unref(formState)),
        rowKey: 'planWorkTime'
    });
</script>
