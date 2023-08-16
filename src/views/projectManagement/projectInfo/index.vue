<template>
    <div class="projectInfo">
        <InfoModal ref="infoModal" @submitAdd="submitAdd" @submitUpdata="submitUpdata" />
        <DelModal ref="delDetail" />
        <EditBoard ref="editBoard" @editBoardUpdata="init" />

        <TpfLayout>
            <template #header>
                <LoadingSkeleton>
                    <TpfForm :formList="formList" @onSubmit="onSubmit" />
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
                                <SvgIcon type="icon-insert" />
                                新增
                            </a-button>
                            <a-button
                                class="tpf-button"
                                type="primary"
                                :disabled="isEmpty(selectedRowInfo.selectedRowKeys)"
                                @click="onDelete"
                            >
                                <SvgIcon type="icon-shanchu" /> 删除
                            </a-button>
                            <a-button
                                class="tpf-button"
                                type="primary"
                                :disabled="isEmpty(selectedRowInfo.selectedRowKeys)"
                                @click="onEditBoard"
                            >
                                <SvgIcon type="icon-xiugai" />
                                修改看板显示
                            </a-button>

                            <!-- 导入 -->
                            <TpfTableImportBtn
                                :uploadAction="uploadAction"
                                :multiple="false"
                                downLoadTemplate="projectTemplate"
                                @uploadTable="getDataList"
                            />
                        </template>
                    </TpfTableLayout>
                </LoadingSkeleton>
            </template>
        </TpfLayout>
    </div>
</template>

<script setup lang="tsx" name="projectInfo">
    import { ref, defineAsyncComponent, onMounted, unref, computed } from 'vue';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import type { TpfColumnType, TpfUploadFile } from '@/types';
    import { useProjectApi, useCompanyAPi } from '@/api';
    import { withTpfTableOperateColumn } from '@/components/TpfTable';
    import { message } from 'ant-design-vue';
    import { tableResizable, getTpfOptionEnum } from '@/config';
    import dayjs from 'dayjs';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { fmtDayjsTime } from '@/utils';
    import { isEmpty } from 'lodash-es';
    const { statusOption } = getTpfOptionEnum();

    const TpfTableImportBtn = defineAsyncComponent(
        () => import('@/components/TpfTable/TpfTableImportBtn.vue')
    );

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const DelModal = defineAsyncComponent(() => import('./components/DelModal.vue'));

    const InfoModal = defineAsyncComponent(() => import('./components/InfoModal.vue'));

    const EditBoard = defineAsyncComponent(() => import('./components/EditBoard.vue'));

    const [infoModal, onOpenInfo] = useOpenAntdModal();
    const [delDetail, onOpenDel] = useOpenAntdModal();
    const [editBoard, onOpenEditBoard] = useOpenAntdModal();
    const projectApi = useProjectApi();
    const companyAPi = useCompanyAPi();

    const companyOption = ref([{ value: '', label: '所有' }]);
    const searchInfo = ref<{ [k: string]: any }>({});
    const formList = computed(() => [
        {
            type: 'Input',
            field: 'projectCode',
            label: '项目编号',
            allowClear: true
        },
        {
            type: 'Input',
            field: 'projectName',
            label: '项目名称',
            allowClear: true
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
            type: 'Select',
            field: 'companyId',
            label: '所属公司',
            showDefaultValue: '',

            options: unref(companyOption),
            allowClear: true
        },
        {
            type: 'Select',
            field: 'forbidden',
            label: '是否启用',
            showDefaultValue: '',

            options: statusOption
        },
        {
            type: 'Select',
            field: 'boardShowFlag',
            showDefaultValue: '',
            label: '看板显示',
            options: statusOption
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
            label: '创建日期',
            allowClear: true
        },
        {
            type: 'RangePicker',
            field: 'modifyDatetime',
            label: '修改日期',
            allowClear: true
        }
    ]);

    const columns = ref<TpfColumnType[]>([
        {
            title: '项目编号',
            dataIndex: 'projectCode',
            ...tableResizable(),
            sorter: (a, b) => {
                const a1 = a.projectCode.slice(0, 1).charCodeAt();
                const b1 = b.projectCode.slice(0, 1).charCodeAt();
                return a1 - b1;
            },
            customRender: ({ text, record }) => {
                return (
                    <span class="tpf-link" onClick={() => getprojectInfoInfo(record)}>
                        {text}
                    </span>
                );
            }
        },
        { title: '项目名称', dataIndex: 'projectName', ...tableResizable() },
        { title: '项目集编号', dataIndex: 'projectGroupCode', ...tableResizable() },
        { title: '项目集名称', dataIndex: 'projectGroupName', ...tableResizable() },
        { title: '所属公司', dataIndex: 'companyName', ...tableResizable() },
        {
            title: '是否启用',
            dataIndex: 'forbidden',
            ...tableResizable(),
            customRender: ({ text }) => {
                return text === '1' ? '是' : '否';
            }
        },
        {
            title: '看板显示',
            dataIndex: 'boardShowFlag',
            ...tableResizable(),
            customRender: ({ text }) => {
                return text === '1' ? '是' : '否';
            }
        },
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

    const defaultBtn = [{ title: '编辑', onClick: (row: any) => onEdit(row) }];

    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 100,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });

    const init = () => {
        unref(pagination).current = 1;

        getDataList();
    };
    const { tableInfo, pagination, getDataList, selectedRowInfo } = useAntdTable({
        api: async pagination => {
            const { pageSize = 20, current = 1 } = unref(pagination);
            const res = await projectApi.queryProjectListByPage({
                ...unref(searchInfo),
                pageSize,
                page: current
            });
            return res.data.object;
        },
        rowKey: 'projectId',
        hasRowSelection: true
        // isPageAble: true
    });

    const getCompany = async () => {
        const res = await companyAPi.getCompanyList();
        if (res.success === true) {
            res.data.list.forEach(item => {
                const o = { label: '所有', value: '' };
                o.label = item.companyName;
                o.value = String(item.companyId);
                companyOption.value.push(o);
            });
        }
    };
    //查看详情
    const getprojectInfoInfo = (v: any) => {
        onOpenInfo('viewInfo', v);
    };
    // 新增
    const onAdd = () => {
        onOpenInfo('add');
    };
    const submitAdd = async (v: any) => {
        const res = await projectApi.addProject(v);
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
        const res = await projectApi.editProject(v);
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

        searchInfo.value.createDatetimeStart = fmtDayjsTime(createDatetimeStart);
        searchInfo.value.createDatetimeEnd = fmtDayjsTime(createDatetimeEnd);

        const [modifyDatetimeStart = '', modifyDatetimeEnd = ''] =
            unref(searchInfo).modifyDatetime || [];
        searchInfo.value.modifyDatetimeStart = fmtDayjsTime(modifyDatetimeStart);
        searchInfo.value.modifyDatetimeEnd = fmtDayjsTime(modifyDatetimeEnd);
        unref(pagination).current = 1;

        getDataList();
    };

    //导入
    const uploadAction = async (fileInfo: { list: TpfUploadFile[]; overrideFlag: boolean }) => {
        const { list, overrideFlag } = unref(fileInfo);

        const [{ fileCode }] = list;

        return await projectApi.importProject({ overrideFlag, fileCode });
    };

    // 删除
    const onDelete = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定删除选中的项目信息吗？' });
        del();
    };

    const del = async () => {
        const arr: Array<number> = [];
        unref(selectedRowInfo).selectedRows.forEach((item: any) => {
            arr.push(item.projectId);
        });
        const res = await projectApi.deleteProjectByIds(arr);
        if (res.data.list.length > 0) {
            onOpenDel(res.data.list);
        } else {
            message.success('删除成功！');
        }

        getDataList();
    };

    // 修改看板显示
    const onEditBoard = () => {
        const arr: Array<number> = [];
        unref(selectedRowInfo).selectedRows.forEach((item: any) => {
            arr.push(item.projectId);
        });
        onOpenEditBoard(arr);
    };
    //排序
    onMounted(() => {
        getCompany();
    });
</script>

<style lang="less" scoped>
    .projectInfo {
        height: 100%;

        .projectInfo-searchForm {
            padding: 15px;
            padding-bottom: 0;
            box-sizing: border-box;
        }
    }
</style>
