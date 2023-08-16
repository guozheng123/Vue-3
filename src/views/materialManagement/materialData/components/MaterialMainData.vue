<template>
    <TpfLayout>
        <template #header>
            <LoadingSkeleton>
                <TpfForm @onSubmit="onSubmit" :pageCode="pageCode" />
            </LoadingSkeleton>
        </template>
        <template #content>
            <TpfTableLayout showChangeTableFontSize showChangeTableGap :pageCode="pageCode">
                <template #default="args">
                    <LoadingSkeleton>
                        <TpfTable
                            v-bind="{
                                ...args,
                                ...tableInfo,
                                pagination,
                                operateColumn,
                                seq: true,
                                beforeRender
                            }"
                        />
                    </LoadingSkeleton>
                </template>
                <template #operateLeft>
                    <a-button type="primary" class="tpf-button" @click="onAdd">
                        <SvgIcon type="icon-insert" /> 新增
                    </a-button>
                    <a-button
                        type="primary"
                        class="tpf-button"
                        :disabled="isEmpty(selectedRowInfo.selectedRowKeys)"
                        @click="onPrint"
                    >
                        <SvgIcon type="icon-dayin" /> 打印
                    </a-button>
                    <a-button
                        class="tpf-button"
                        type="primary"
                        :disabled="isEmpty(selectedRowInfo.selectedRowKeys)"
                        @click="onDelete"
                    >
                        <SvgIcon type="icon-shanchu" /> 删除
                    </a-button>

                    <!-- 导入 -->
                    <TpfTableImportBtn
                        :uploadAction="uploadAction"
                        downLoadTemplate="materialTemplate"
                        @uploadTable="uploadTable"
                    />

                    <a-button class="tpf-button" @click="exportFile" ghost type="primary">
                        <SvgIcon type="icon-daochu" /> 导出
                    </a-button>
                </template>
            </TpfTableLayout>
        </template>
        <Qrprint ref="qrprint" />
    </TpfLayout>
</template>

<script setup lang="tsx" name="materiaDataList">
    import { ref, defineAsyncComponent, unref, shallowRef } from 'vue';
    import { useAntdTable, useOpenAntdModal, useRouteBase64 } from '@/hooks';
    import dayjs from 'dayjs';
    import type { TpfColumnType, TpfOperateBtn, TpfUploadFile } from '@/types';
    import {
        useFilesystemApi,
        useMaterialApi,
        IReqGetMaterialDataList,
        ResQueryMaterialListByPage
    } from '@/api';
    import { withTpfTableOperateColumn } from '@/components/TpfTable';
    import { message } from 'ant-design-vue';
    import {
        getLabel,
        workshopNameOpt,
        managementOpt,
        PageCodeEnum,
        statusOptionStr
    } from '@/config';
    import router from '@/router';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { isEmpty, cloneDeep } from 'lodash-es';

    const { encodeParams } = useRouteBase64();

    const TpfTableImportBtn = defineAsyncComponent(
        () => import('@/components/TpfTable/TpfTableImportBtn.vue')
    );

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const Qrprint = defineAsyncComponent(() => import('./Qrprint.vue'));

    const filesystemApi = useFilesystemApi();

    const materialApi = useMaterialApi();

    const pageCode = PageCodeEnum.materialList; // 物料主数据pagecode

    const materialTypeCode = ref('');

    const [qrprint, onOpenQrPrintModal] = useOpenAntdModal();

    const searchInfo = ref({} as IReqGetMaterialDataList);

    const getWuliaoshuxing = (list: string[]) => {
        const arr = ['自制件', '采购件', '下料件', '虚拟件'];
        const find1 = list.findIndex(item => item === '1');
        if (find1 > -1) {
            return arr[find1] || '';
        }
        return '';
    };

    const defaultBtn = [
        { title: '编辑', onClick: ({ record }) => onEdit(record) }
    ] as TpfOperateBtn<ResQueryMaterialListByPage>[];

    const beforeRender = (list: TpfColumnType<ResQueryMaterialListByPage>[]) => {
        return list.map(item => {
            if (item.dataIndex === 'materialCode') {
                item.customRender = ({ text, record }) => (
                    <span class="tpf-link" onClick={() => getMaterialDataDetails(record)}>
                        {text}
                    </span>
                );
            }

            if (item.dataIndex === 'partsType') {
                item.customRender = ({ text }) => getLabel(text, workshopNameOpt);
            }

            if (item.dataIndex === 'supervisorModeCode') {
                item.customRender = ({ text }) => getLabel(text, managementOpt);
            }

            if (['createDatetime', 'modifyDatetime'].includes(item.dataIndex as string)) {
                item.customRender = ({ text }) => {
                    return text ? dayjs(text).format('YYYY-MM-DD') : '';
                };
            }

            if (item.dataIndex === 'materialPropertyArr') {
                item.customRender = ({ text }) => getWuliaoshuxing(text);
            }
            if (item.dataIndex === 'enable') {
                item.customRender = ({ text }) => getLabel(text, statusOptionStr);
            }
            if (item.dataIndex === 'isExemption') {
                item.customRender = ({ text }) => getLabel(text, statusOptionStr);
            }
            if (item.dataIndex === 'replaceMaterialCodeName') {
                item.customRender = ({ record }) => {
                    const res = record.materialReplaceMaterialList
                        .map((e: any) => e.replaceMaterialCodeName)
                        .join(',');
                    return res;
                };
            }

            return item;
        });
    };

    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 120,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });
    const queryParams = shallowRef({});

    const { tableInfo, pagination, getDataList, selectedRowInfo } = useAntdTable({
        api: async pagination => {
            const { pageSize = 20, current = 1 } = unref(pagination);
            queryParams.value = cloneDeep({
                ...unref(searchInfo),
                materialTypeCode: materialTypeCode.value,
                pageSize,
                page: current
            });

            const res = await materialApi.queryMaterialListByPage(unref(queryParams));
            return res.data.object;
        },
        rowKey: 'id',
        isPageAble: true,
        hasRowSelection: true
    });

    const updateTableList = (code = '') => {
        code = code === 'SYFL' ? '' : code;
        materialTypeCode.value = code;
        unref(pagination).current = 1;
        getDataList();
    };

    // 新增
    const onAdd = () => {
        // cacheSearchStore.restPageJson(pageCode);
        router.push({
            path: '/materialManagement/materialData/addMaterialDataDetails',
            query: encodeParams({ type: '0' })
        });
    };

    //编辑
    const onEdit = (v: ResQueryMaterialListByPage) => {
        router.push({
            path: '/materialManagement/materialData/editMaterialDataDetails',
            query: encodeParams({ type: '1', id: v.id })
        });
    };
    const onSubmit = (val: IReqGetMaterialDataList) => {
        searchInfo.value = unref(val);
        unref(pagination).current = 1;
        getDataList();
    };
    //查看详情
    const getMaterialDataDetails = (v: ResQueryMaterialListByPage) => {
        router.push({
            path: '/materialManagement/materialData/materialDataDetails',
            query: encodeParams({ type: '2', id: v.id })
        });
    };
    //打印
    const onPrint = async () => {
        const arr: Array<number> = [];
        unref(selectedRowInfo).selectedRows.forEach((item: any) => {
            arr.push(item.id);
        });
        const res = await materialApi.getMaterialPrint(arr);
        onOpenQrPrintModal(res.data.list);
    };
    //删除
    const onDelete = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定删除选中的物料信息吗？' });
        del();
    };

    const del = async () => {
        const arr = unref(selectedRowInfo).selectedRows.map((item: any) => item.id);
        const res = await materialApi.deleteMaterialByIds(arr);
        if (res.data.list.length < 1) {
            message.success('删除成功');
            getDataList();
        } else {
            message.error(res.errorMessage);
        }
    };

    //导出

    const exportFile = () => {
        filesystemApi.exportFileList(
            ({ tableHeaderConfig }) =>
                materialApi.exportMaterialExcelFile({
                    ...unref(queryParams),
                    tableHeaderConfig
                }),
            pageCode
        );
    };

    //导入
    const uploadAction = async (fileInfo: { list: TpfUploadFile[]; overrideFlag: boolean }) => {
        const { list, overrideFlag } = unref(fileInfo);

        const [{ fileCode }] = list;

        return await materialApi.importMaterial({ overrideFlag, fileCode });
    };

    const uploadTable = () => {
        unref(pagination).current = 1;
        getDataList();
    };

    defineExpose({ updateTableList });
</script>
