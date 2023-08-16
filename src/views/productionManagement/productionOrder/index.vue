<template>
    <TpfLayout>
        <template #header>
            <LoadingSkeleton>
                <TpfForm
                    @onSubmit="onSubmit"
                    :pageCode="pageCode"
                    :labelCol="{ style: { width: '126px' } }"
                />
            </LoadingSkeleton>
        </template>
        <template #content>
            <LoadingSkeleton>
                <TpfTableLayout showChangeTableFontSize showChangeTableGap :pageCode="pageCode">
                    <template #default="args">
                        <TpfTable
                            v-bind="{
                                ...args,
                                ...tableInfo,
                                pagination,
                                seq: true,
                                operateColumn,
                                beforeRender
                            }"
                        />
                    </template>
                    <template #operateLeft>
                        <a-button type="primary" class="tpf-button" @click="onAdd">
                            <SvgIcon type="icon-insert" /> 新增
                        </a-button>

                        <!-- 删除 -->
                        <DeleteOrder
                            :selected-row-keys="selectedRowInfo.selectedRowKeys"
                            @updateTable="getDataList"
                        />

                        <!-- 下达 -->
                        <ReleaseOrderDropdown
                            :selected-row-keys="selectedRowInfo.selectedRowKeys"
                            @updateTable="getDataList"
                        />
                        <!-- 强制执行 -->
                        <ForceRunDropdown
                            :selected-row-keys="selectedRowInfo.selectedRowKeys"
                            @updateTable="getDataList"
                        />
                        <!-- 工序BOM -->
                        <ProcessDropdown
                            ref="processDropdownDom"
                            :selected-row-keys="selectedRowInfo.selectedRowKeys"
                            @updateTable="getDataList"
                        />
                        <!-- 批量操作 -->
                        <MultipleOperate
                            :selectedRowInfo="selectedRowInfo"
                            @updateTable="getDataList"
                        />

                        <!-- 导入 -->
                        <TpfTableImportBtn
                            :uploadAction="uploadAction"
                            downLoadTemplate="productionOrderTemplate"
                            @uploadTable="getDataList"
                        />

                        <a-button class="tpf-button" type="primary" @click="exportTable" ghost>
                            <SvgIcon type="icon-daochu" /> 导出
                        </a-button>
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
        <ChangeProductInfoModal
            ref="changeProductInfoModalDom"
            v-if="showChangeProductInfoModalDom"
        />
        <EditProcessModal ref="editProcessModalDom" v-if="showEditProcessModalDom" />
    </TpfLayout>
</template>

<script setup lang="tsx" name="productionOrder">
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, defineAsyncComponent, unref } from 'vue';
    import { useAntdTable, useOpenAntdModal, useRouteBase64 } from '@/hooks';
    import type { OperateBtnClick, TpfColumnType, TpfOperateBtn, TpfUploadFile } from '@/types';
    import type { IProductionOrderList, ReqQueryProductionOrderListByPage } from '@/api';
    import { useProductionOrderApi, useFilesystemApi } from '@/api';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import { PageCodeEnum, getTpfOptionEnum } from '@/config';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { useRouter } from 'vue-router';
    import { Badge } from 'ant-design-vue';

    const { statusNameColor, getLabel } = getTpfOptionEnum();

    const { encodeParams } = useRouteBase64();

    const productionOrderApi = useProductionOrderApi();

    const pageCode = PageCodeEnum.productionOrder;

    const router = useRouter();

    const ReleaseOrderDropdown = defineAsyncComponent(
        () => import('./components/ReleaseOrderDropdown.vue')
    );
    const ForceRunDropdown = defineAsyncComponent(
        () => import('./components/ForceRunDropdown.vue')
    );

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const DeleteOrder = defineAsyncComponent(() => import('./components/DeleteOrder.vue'));

    const ProcessDropdown = defineAsyncComponent(() => import('./components/ProcessDropdown.vue'));

    const MultipleOperate = defineAsyncComponent(() => import('./components/MultipleOperate.vue'));

    const TpfTableImportBtn = defineAsyncComponent(
        () => import('@/components/TpfTable/TpfTableImportBtn.vue')
    );

    const ChangeProductInfoModal = defineAsyncComponent(
        () => import('./components/ChangeProductInfoModal.vue')
    );

    const EditProcessModal = defineAsyncComponent(
        () => import('./components/EditProcessModal.vue')
    );

    const [
        changeProductInfoModalDom,
        openChangeProductInfoModalDom,
        showChangeProductInfoModalDom
    ] = useOpenAntdModal();

    const [editProcessModalDom, openEditProcessModalDom, showEditProcessModalDom] =
        useOpenAntdModal();

    const filesystemApi = useFilesystemApi();

    const processDropdownDom = ref<InstanceType<typeof ProcessDropdown> | null>(null);

    const searchInfo = ref({} as ReqQueryProductionOrderListByPage);

    const go2BomPic = async (productionOrderId: string) => {
        const { purl } = await productionOrderApi
            .viewProductionOrderDraws({ productionOrderId })
            .then(res => res.data.object);
        window.open(purl, '_blank');
    };

    const beforeRender = (list: TpfColumnType<IProductionOrderList>[]) => {
        const res = unref(list).map(item => {
            if (
                ['requirementDate', 'createDatetime', 'modifyDatetime'].includes(
                    item.dataIndex as string
                )
            ) {
                item.sorter = true;
            }

            if (item.dataIndex === 'productionOrderCode') {
                item.sorter = true;

                item.customRender = ({ text, record }) => (
                    <span class="tpf-link" onClick={() => getMerchantManagementInfo(record)}>
                        {text}
                    </span>
                );
            }
            if (item.dataIndex === 'statusCode') {
                item.customRender = ({ text }: { text: string }) => (
                    <Badge color={getLabel(text, statusNameColor)} text={text} />
                );
            }
            if (item.dataIndex === 'drawingFlag') {
                item.customRender = ({ text, record }) => {
                    if (record.partsVersionId && record.drawingBomAccId) {
                        return (
                            <div
                                class="tpf-link"
                                onClick={() => go2BomPic(record.productionOrderId)}
                            >
                                有
                            </div>
                        );
                    }
                    return '无';
                };
            }
            return item;
        });
        return res;
    };

    const defaultBtn = [
        { title: '编辑', onClick: row => onEdit(row) },
        { title: '工艺', onClick: ({ record }) => openEditProcessModalDom(record) },
        { title: '变更', onClick: ({ record }) => openChangeProductInfoModalDom(record) }
    ] as TpfOperateBtn<IProductionOrderList>[];

    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 150,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });
    const { tableInfo, pagination, getDataList, selectedRowInfo, sortFieldInfo } = useAntdTable({
        api: async pagination => {
            const { pageSize, current, sortByAsc, sortedField } = unref(pagination);
            const res = await productionOrderApi.queryProductionOrderListByPage({
                ...unref(searchInfo),
                pageSize,
                page: current,
                sortByAsc,
                sortedField
            });
            return res.data.object;
        },
        rowKey: 'productionOrderId',
        isPageAble: true,
        hasRowSelection: true,
        useSorter: true
    });

    //查看详情
    const getMerchantManagementInfo = ({
        productionOrderId,
        productionOrderCode
    }: IProductionOrderList) => {
        router.push({
            path: '/productionManagement/productionOrder/productionOrderDetail',
            query: encodeParams({ productionOrderId, productionOrderCode })
        });
    };
    // 新增
    const onAdd = () => {
        router.push({
            path: '/productionManagement/productionOrder/productionOrderAdd'
        });
    };

    //编辑
    const onEdit = async ({ record }: OperateBtnClick<IProductionOrderList>) => {
        if (record.statusCode !== '创建') {
            const { message } = await import('ant-design-vue');
            message.error('非创建状态不允许编辑');
            return;
        }

        let orderSource = '';
        if (record.orderSource === '图纸云') {
            orderSource = '3';
        }

        router.push({
            path: `/productionManagement/productionOrder/productionOrderEdit`,
            query: encodeParams({ productionOrderId: record.productionOrderId, orderSource })
        });
    };

    const onSubmit = (val: ReqQueryProductionOrderListByPage) => {
        searchInfo.value = unref(val);
        unref(pagination).current = 1;
        getDataList();
    };

    //导入
    const uploadAction = async (fileInfo: { list: TpfUploadFile[]; overrideFlag: boolean }) => {
        const { list, overrideFlag } = unref(fileInfo);

        const [{ fileCode }] = list;

        return await productionOrderApi.importProductionOrder({ overrideFlag, fileCode });
    };

    const exportTable = () => {
        filesystemApi.exportFileList(
            ({ tableHeaderConfig }) =>
                productionOrderApi.exportProductionOrderExcelFile({
                    ...unref(searchInfo),
                    ...unref(sortFieldInfo),
                    tableHeaderConfig
                }),
            pageCode
        );
    };
</script>
