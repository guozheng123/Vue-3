<template>
    <TpfLayout>
        <InfoModal ref="infoModal" @submitAdd="submitAdd" @submitUpdata="submitUpdata" />
        <template #header>
            <LoadingSkeleton>
                <TpfForm :formList="formList" @onSubmit="onSubmit" />
            </LoadingSkeleton>
        </template>
        <template #content>
            <LoadingSkeleton>
                <TpfTableLayout showChangeTableFontSize showChangeTableGap>
                    <template #default="args">
                        <TpfTable
                            v-bind="{
                                ...args,
                                ...tableInfo,
                                pagination,
                                columns,
                                operateColumn,
                                seq: true
                            }"
                        />
                    </template>
                    <template #operateLeft>
                        <a-button type="primary" class="tpf-button" @click="onAdd">
                            <SvgIcon type="icon-insert" />新增
                        </a-button>
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
    </TpfLayout>
</template>

<script setup lang="tsx" name="projectInfo">
    import { ref, defineAsyncComponent, unref, computed } from 'vue';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import type { TpfColumnType } from '@/types';
    import SvgIcon from '@/components/SvgIcon/index.vue';

    import { useProjectGroupApi } from '@/api';
    import { withTpfTableOperateColumn } from '@/components/TpfTable';
    import { message } from 'ant-design-vue';
    import { tableResizable, getTpfOptionEnum } from '@/config';
    import dayjs from 'dayjs';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import TpfForm from '@/components/TpfForm/index.vue';
    import TpfTableLayout from '@/components/TpfTableLayout/index.vue';
    import TpfTable from '@/components/TpfTable/index.vue';
    import { fmtDayjsTime } from '@/utils';
    const { statusOption } = getTpfOptionEnum();

    const InfoModal = defineAsyncComponent(() => import('./components/InfoModal.vue'));

    const [infoModal, onOpenInfo] = useOpenAntdModal();

    const projectGroupApi = useProjectGroupApi();

    const searchInfo = ref<{ [k: string]: any }>({});

    const formList = computed(() => [
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
            type: 'Select',
            field: 'forbidden',
            label: '是否启用',
            options: statusOption
        },
        {
            type: 'RangePicker',
            field: 'requirementDate',
            showDefaultValue: [],
            label: '交期',
            allowClear: true
        },
        {
            type: 'Input',
            field: 'createUser',
            label: '创建人',
            allowClear: true
        },
        {
            type: 'Input',
            field: 'modifyUser',
            label: '修改人',
            allowClear: true
        },
        {
            type: 'RangePicker',
            field: 'createDatetime',
            showDefaultValue: [],
            label: '创建日期',
            allowClear: true
        },
        {
            type: 'RangePicker',
            field: 'modifyDatetime',
            showDefaultValue: [],
            label: '修改日期',
            allowClear: true
        }
    ]);

    const columns = ref<TpfColumnType[]>([
        {
            title: '项目集编号',
            dataIndex: 'projectGroupCode',
            fixed: 'left',
            sorter: (a, b) => {
                const a1 = a.projectGroupCode.slice(0, 1).charCodeAt();
                const b1 = b.projectGroupCode.slice(0, 1).charCodeAt();
                return a1 - b1;
            },
            ...tableResizable(),
            customRender: ({ text, record }) => {
                return (
                    <span class="tpf-link" onClick={() => getprojectInfoInfo(record)}>
                        {text}
                    </span>
                );
            }
        },
        { title: '项目集名称', dataIndex: 'projectGroupName', ...tableResizable() },
        {
            title: '是否启用',
            dataIndex: 'forbidden',
            ...tableResizable(),
            customRender: ({ text }) => {
                return text === '1' ? '是' : '否';
            }
        },
        { title: '交期', dataIndex: 'requirementDate', ...tableResizable() },
        { title: '创建人', dataIndex: 'createUser', ...tableResizable() },
        {
            title: '创建日期',
            dataIndex: 'createDatetime',
            sorter: (a, b) => {
                const t1 = new Date(a.createDatetime).getTime();
                const t2 = new Date(b.createDatetime).getTime();
                return t1 - t2;
            },
            ...tableResizable(),
            customRender: ({ text }) => {
                return dayjs(text).format('YYYY-MM-DD');
            }
        },
        { title: '修改人', dataIndex: 'modifyUser', ...tableResizable() },
        {
            title: '修改日期',
            dataIndex: 'modifyDatetime',
            sorter: (a, b) => {
                const t1 = new Date(a.modifyDatetime).getTime();
                const t2 = new Date(b.modifyDatetime).getTime();
                return t1 - t2;
            },
            ...tableResizable(),
            customRender: ({ text }) => {
                return dayjs(text).format('YYYY-MM-DD');
            }
        }
    ]);
    const defaultBtn = [
        { title: '编辑', onClick: (row: any) => onEdit(row) },
        { title: '删除', onClick: (row: any) => onDelete(row) }
    ];
    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 150,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });
    const { tableInfo, pagination, getDataList } = useAntdTable({
        api: async pagination => {
            const { pageSize = 20, current = 1 } = unref(pagination);
            const res = await projectGroupApi.queryProjectGroupListByPage({
                ...unref(searchInfo),
                pageSize,
                page: current
            });
            return res.data.object;
        },
        rowKey: 'projectId'
        // isPageAble: true
    });
    //查看详情
    const getprojectInfoInfo = (v: any) => {
        onOpenInfo('viewInfo', v);
    };
    // 新增
    const onAdd = () => {
        onOpenInfo('add');
    };
    const submitAdd = async (v: any) => {
        const res = await projectGroupApi.addProjectGroup(v);
        if (res.data.value) {
            message.success('信息保存成功！');
            onOpenInfo('close');
            getDataList();
        } else {
            message.error(res.errorMessage);
        }
    };
    //编辑
    const onEdit = (v: any) => {
        onOpenInfo('update', v.value);
    };
    const submitUpdata = async (v: any) => {
        const res = await projectGroupApi.editProjectGroup(v);
        if (res.data.value) {
            message.success('信息保存成功！');
            onOpenInfo('close');
            getDataList();
        } else {
            message.error(res.errorMessage);
        }
    };
    const onSubmit = (val: any) => {
        searchInfo.value = unref(val);
        const [createDatetimeStart = '', createDatetimeEnd = ''] =
            unref(searchInfo).createDatetime || [];
        unref(searchInfo).createDatetimeStart = fmtDayjsTime(createDatetimeStart);
        unref(searchInfo).createDatetimeEnd = fmtDayjsTime(createDatetimeEnd);

        const [modifyDatetimeStart = '', modifyDatetimeEnd = ''] =
            unref(searchInfo).modifyDatetime || [];

        unref(searchInfo).modifyDatetimeStart = fmtDayjsTime(modifyDatetimeStart);
        unref(searchInfo).modifyDatetimeEnd = fmtDayjsTime(modifyDatetimeEnd);

        const [requirementDateStart = '', requirementDateEnd = ''] =
            unref(searchInfo).requirementDate || [];

        unref(searchInfo).requirementDateStart = fmtDayjsTime(requirementDateStart);
        unref(searchInfo).requirementDateEnd = fmtDayjsTime(requirementDateEnd);

        unref(pagination).current = 1;

        getDataList();
    };

    // 删除
    const onDelete = async (v: any) => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定删除选中的项目集吗？' });
        return new Promise((resolve, reject) => {
            resolve(del(v));
        }).catch(() => {});
    };

    const del = async (v: any) => {
        const res = await projectGroupApi.deleteProjectGroupById({
            projectGroupId: v.value.projectGroupId
        });
        if (res.data.value === true) {
            message.success('删除成功！');
            getDataList();
        } else {
            message.error(res.errorMessage);
        }
    };
</script>
