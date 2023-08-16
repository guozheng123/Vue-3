<template>
    <TpfModal
        class="storage-warning-modal"
        v-model:visible="visible"
        width="1000px"
        title="库存预警"
        height="588px"
    >
        <LoadingSkeleton>
            <TpfTableLayout>
                <template #default="args">
                    <TpfTable
                        v-bind="{
                            ...args,
                            ...tableInfo,
                            loading,
                            pagination,
                            columns,
                            seq: true
                        }"
                        bordered
                    />
                </template>

                <template #operateLeft>
                    <a-button @click="exportTable" class="tpf-button" type="primary" ghost>
                        <SvgIcon type="icon-daochu" /> 导出
                    </a-button>
                </template>
            </TpfTableLayout>
        </LoadingSkeleton>
    </TpfModal>
</template>

<script setup lang="tsx" name="storageWarningModal">
    import type { ReqGetStoreInfoPageByParamList } from '@/api';
    import { useWarehouseApi, useFilesystemApi, useInStoreAPi } from '@/api';
    import { useStore } from '@/store';
    import { useAntdTable, useRef } from '@/hooks';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import TpfModal from '@/components/TpfModal/index.vue';
    import { ref, defineAsyncComponent, unref } from 'vue';
    import { PageCodeEnum } from '@/config';
    import type { TableColumnsType } from 'ant-design-vue';
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const pageCode = PageCodeEnum.warehouseManagementWarehouseOutInDetails;
    const [visible, setVisible] = useRef(false);
    const { cacheSearchStore } = useStore();
    const filesystemApi = useFilesystemApi();
    const warehouseApi = useWarehouseApi();
    const columns: TableColumnsType = [
        {
            title: '所属组织名称',
            dataIndex: 'orgName',
            align: 'center',
            width: 120
        },
        {
            title: '物料编号',
            dataIndex: 'materialCode',
            align: 'center',
            width: 120
        },
        {
            title: '物料名称',
            dataIndex: 'materialName',
            align: 'center',
            width: 120
        },
        {
            title: '物料类型',
            dataIndex: 'materialType',
            align: 'center',
            width: 120
        },
        {
            title: '库存数量',
            children: [
                {
                    title: '良品',
                    dataIndex: 'yNum',
                    align: 'center',
                    width: 100
                },
                {
                    title: '不良品',
                    dataIndex: 'nNum',
                    align: 'center',
                    width: 100
                },
                {
                    title: '合计',
                    dataIndex: 'num',
                    align: 'center',
                    width: 100
                }
            ]
        },
        {
            title: '单位',
            dataIndex: 'unit',
            align: 'center',
            width: 120
        },
        {
            title: '最小库存',
            dataIndex: 'minNum',
            align: 'center',
            width: 120
        },
        {
            title: '最大库存',
            dataIndex: 'maxNum',
            align: 'center',
            width: 120
        },
        {
            title: '说明',
            dataIndex: 'remark',
            align: 'center',
            width: 120
        }
    ];
    let paramList: ReqGetStoreInfoPageByParamList;
    const { tableInfo, pagination, loading, getDataList } = useAntdTable({
        api: async pageInfo => {
            const { current, pageSize } = unref(pageInfo);
            const res = await warehouseApi.getQueryStoreAlertPageByParam({
                ...paramList,
                page: current,
                pageSize
            });
            return res.data.object;
        },
        rowKey: 'id',
        isPageAble: true
    });
    const open = (param: ReqGetStoreInfoPageByParamList) => {
        paramList = param;
        setVisible(!visible.value);
        getDataList();
    };
    const exportTable = async () => {
        filesystemApi.exportFileList(() =>
            warehouseApi.exportStoreAlert({
                ...paramList,
                tableHeaderConfig: cacheSearchStore.getUploadLoadSortColumns(pageCode)
            })
        );
    };
    defineExpose({ open });
</script>

<style scoped lang="less">
    .storage-warning-modal {
        .form-content {
            padding: 30px;
            height: 100%;
            display: flex;
            flex-direction: column;

            .store-code {
                margin-top: 30px;
            }
        }
    }
</style>
