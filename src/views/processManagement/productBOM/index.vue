<template>
    <TpfLayout>
        <template #header>
            <LoadingSkeleton>
                <TpfForm :pageCode="pageCode" @onSubmit="onSubmit" isConfig />
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
                                operateColumn,
                                seq: true,
                                beforeRender
                            }"
                        />
                    </template>
                    <template #operateLeft>
                        <a-button type="primary" class="tpf-button" @click="onAdd">
                            <SvgIcon type="icon-insert" /> 新增
                        </a-button>

                        <a-button
                            class="tpf-button"
                            type="primary"
                            :disabled="isEmpty(selectedRowInfo.selectedRows)"
                            @click="deleteFun"
                        >
                            <SvgIcon type="icon-shanchu" /> 删除
                        </a-button>

                        <a-button
                            class="tpf-button"
                            type="primary"
                            @click="publish"
                            :disabled="isEmpty(selectedRowInfo.selectedRows)"
                        >
                            <SvgIcon type="icon-fuzhi" /> 发布
                        </a-button>

                        <a-button
                            class="tpf-button"
                            type="primary"
                            @click="startUse"
                            :disabled="isEmpty(selectedRowInfo.selectedRows)"
                        >
                            <SvgIcon type="icon-fuzhi" /> 启用/禁用
                        </a-button>

                        <a-button @click="exportTable" class="tpf-button" type="primary" ghost>
                            <SvgIcon type="icon-daochu" /> 导出
                        </a-button>

                        <TpfTableImportBtn
                            :uploadAction="uploadAction"
                            :multiple="false"
                            @upload-table="getDataList"
                            downLoadTemplate="productBomTemplate"
                        />
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
    </TpfLayout>
</template>

<script setup lang="tsx" name="ProductBOM">
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, unref, defineAsyncComponent } from 'vue';
    import { useAntdTable, useRouteBase64 } from '@/hooks';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import { TpfColumnType, TpfUploadFile } from '@/types';
    import { message, Badge } from 'ant-design-vue';
    import { useFilesystemApi, useQueryAPi, useMaterialProductBOMApi } from '@/api';
    import { PageCodeEnum, getTpfOptionEnum } from '@/config';
    import router from '@/router';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { useStore } from '@/store';
    import { isEmpty } from 'lodash-es';

    const { encodeParams } = useRouteBase64();

    const { cacheSearchStore } = useStore();

    const TpfTableImportBtn = defineAsyncComponent(
        () => import('@/components/TpfTable/TpfTableImportBtn.vue')
    );

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const { statusOptionStr, publishOption, getLabel, statusNameColor } = getTpfOptionEnum();

    const pageCode = PageCodeEnum.bomInfo;
    const useMaterialProductBOM = useMaterialProductBOMApi();

    const filesystemApi = useFilesystemApi();
    const useQuery = useQueryAPi();

    const searchInfo = ref<{ [k: string]: any }>({});

    const title = ref('');
    const exportFileParams = ref();

    const defaultBtn = [
        {
            title: '编辑',
            onClick: (row: any) => {
                if (row.value.release_flag === '1') {
                    message.warning('发布的产品BOM,不允许编辑');
                    return false;
                }
                router.push({
                    path: '/processManagement/productBOM/edit',
                    query: encodeParams({
                        type: 'edit',
                        bomId: row.value.bom_id
                    })
                });
            }
        },
        {
            title: '复制',
            onClick: (row: any) => {
                router.push({
                    path: '/processManagement/productBOM/copy',
                    query: encodeParams({ type: 'COPY', bomId: row.value.bom_id })
                });
            }
        },
        {
            title: '升版',
            onClick: (row: any) => {
                if (row.value.release_flag === '0') {
                    message.warning('未发布的产品BOM,不允许升版');
                    return false;
                }
                router.push({
                    path: '/processManagement/productBOM/upgrade',
                    query: encodeParams({
                        type: 'UPGRADES',
                        bomId: row.value.bom_id
                    })
                });
            }
        },
        {
            title: '更新',
            onClick: (row: any) => {
                if (row.value.release_flag === '0') {
                    message.warning('未发布的产品BOM,不允许更新');
                    return false;
                }
                if (row.value.enable === '0') {
                    message.warning('未启用的产品BOM,不允许更新');
                    return false;
                }
                router.push({
                    path: '/processManagement/productBOM/update',
                    query: encodeParams({
                        type: 'update',
                        bomId: row.value.bom_id
                    })
                });
            }
        }
    ];
    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 200,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });

    const beforeRender = (list: TpfColumnType[]) => {
        return unref(list).map(item => {
            if (item.dataIndex === 'material_code') {
                item.customRender = ({ text, record }) => {
                    return (
                        <a
                            onClick={() => {
                                router.push({
                                    path: '/processManagement/productBOM/detail',
                                    query: encodeParams({
                                        type: 'DETAIL',
                                        bomId: unref(record).bom_id
                                    })
                                });
                            }}
                        >
                            {text}
                        </a>
                    );
                };
                item.sorter = {
                    compare: (a: any, b: any) => {
                        return a.material_code > b.material_code ? 1 : -1;
                    }
                };
            }
            if (item.dataIndex === 'create_datetime') {
                item.sorter = {
                    compare: (a: any, b: any) => {
                        return a.create_datetime > b.create_datetime ? 1 : -1;
                    }
                };
            }

            if (item.dataIndex === 'release_flag') {
                item.customRender = ({ text }) => {
                    const showText = getLabel(text, publishOption) || '发布';
                    return <Badge color={getLabel(showText, statusNameColor)} text={showText} />;
                };
            }
            if (item.dataIndex === 'enable') {
                item.customRender = ({ text }) => {
                    const showText = getLabel(text, statusOptionStr);
                    return <Badge color={getLabel(showText, statusNameColor)} text={showText} />;
                };
            }
            if (item.dataIndex === 'bom_version') {
                item.customRender = ({ text }) => 'v' + text;
            }
            return item;
        });
    };

    const onSubmit = (res: any) => {
        const defaultObj = {
            conditionFieldName: 'bom_type',
            value: '0'
        };
        res.conditions.push(defaultObj);
        searchInfo.value = unref(res) || {};
        unref(pagination).current = 1;
        getDataList();
    };
    const uploadAction = async (fileInfo: { list: TpfUploadFile[]; overrideFlag: boolean }) => {
        const { list, overrideFlag } = unref(fileInfo);
        const [{ fileCode }] = list;
        return await useMaterialProductBOM.importBom({ overrideFlag, fileCode });
    };

    const { tableInfo, pagination, getDataList, selectedRowInfo } = useAntdTable({
        api: async pageInfo => {
            const { current, pageSize } = unref(pageInfo);
            exportFileParams.value = {
                page: current,
                pageSize,
                ...unref(searchInfo),
                sortedField: 'create_datetime',
                sortByAsc: false
            };
            const res = await useQuery.execute(unref(exportFileParams));
            return res.data.object;
        },
        rowKey: 'result_entity_id',
        isPageAble: true,
        isConfig: true,
        hasRowSelection: true
    });

    const onAdd = () => {
        title.value = '新增产品BOM';
        router.push({
            path: '/processManagement/productBOM/add',
            query: { type: 'add' }
        });
    };

    const deleteFun = async () => {
        let releaseFlag = false;
        unref(selectedRowInfo).selectedRows.forEach((element: any) => {
            if (element.release_flag === '1') {
                releaseFlag = true;
            }
        });
        if (releaseFlag) {
            message.warning('该产品BOM已经发布,不能删除!');
            return false;
        }
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定删除该产品BOM?删除不可恢复' });
        const params = {
            productBomIds: unref(selectedRowInfo).selectedRowKeys
        };
        const res = await useMaterialProductBOM.deleteBomByIds(params);
        if (res.data.value === true) {
            message.success('删除成功');
            getDataList();
        }
    };

    const publish = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定发布选择的产品BOM吗', title: '发布' });
        const params = {
            productBomIds: unref(selectedRowInfo).selectedRowKeys
        };
        const res = await useMaterialProductBOM.releaseBomByIds(params);
        if (res.data.value === true) {
            message.success('发布成功');
            getDataList();
        }
    };
    const startUse = async () => {
        let releaseFlag = false;
        unref(selectedRowInfo).selectedRows.forEach((element: any) => {
            if (element.release_flag === '0') {
                releaseFlag = true;
            }
        });
        if (releaseFlag) {
            message.warning('不可选择未发布的产品BOM进行操作');
            return false;
        }
        const enableArr = unref(selectedRowInfo).selectedRows.map((value: any) => value.enable);
        // 通过Set去除数组重复项
        const idsSet = new Set(enableArr);
        if (idsSet.size === 2) {
            message.warning('部分产品BOM的是否启用状态不一致,无法操作!');
            return false;
        }
        const params = {
            productBomIds: unref(selectedRowInfo).selectedRowKeys
        };
        const res = await useMaterialProductBOM.productBomIds(params);
        if (res.data.value === true) {
            message.success(enableArr[0] === '1' ? '禁用成功' : '启用成功');
            getDataList();
        }
    };

    const exportTable = async () => {
        const bomId = selectedRowInfo.value.selectedRows.map(e => e.bom_id);
        const params = {
            ...unref(exportFileParams)
        };
        if (bomId.length > 0) {
            params.conditions = [
                {
                    conditionFieldName: 'bom_id',
                    values: bomId,
                    type: 'equal',
                    valueType: 'CHAR'
                }
            ];
        }
        filesystemApi.exportFileList(() =>
            useMaterialProductBOM.exportBom({
                ...params,
                tableHeaderConfig: cacheSearchStore.getUploadLoadSortColumns(pageCode)
            })
        );
    };
</script>
