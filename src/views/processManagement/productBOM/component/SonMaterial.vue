<template>
    <TpfCollapse :title="type === 'update' ? '影响对象' : '子级物料'" gap="0">
        <a-card>
            <TpfLayout style="height: 400px">
                <template #content>
                    <TpfTableLayout>
                        <template #operateLeft>
                            <a-button
                                v-if="!arr.includes(type)"
                                @click="onAdd"
                                class="tpf-button"
                                type="primary"
                                ghost
                            >
                                添加
                            </a-button>
                        </template>
                        <template #operateRight>
                            <!-- <div v-if="type !== 'update'">
                                <a-input
                                    v-model:value="formState.materialCode"
                                    @change="filterTable()"
                                    placeholder="请输入物料编号查询"
                                />
                            </div> -->
                        </template>
                        <template #default="args">
                            <a-form
                                style="height: 100%"
                                ref="formRef"
                                :model="tableInfo"
                                class="table-form"
                            >
                                <TpfTable
                                    style="height: 100%"
                                    ref="tableInstance"
                                    class="tpf-table-form"
                                    v-bind="{
                                        ...args,
                                        ...tableInfo,
                                        seq: true,
                                        columns,
                                        operateColumn,
                                        customRow
                                    }"
                                />
                            </a-form>
                        </template>
                    </TpfTableLayout>
                </template>
            </TpfLayout>
        </a-card>
        <AddProcessFromMaterielModal
            :unHasRowSelection="false"
            isAddMaterialProductBOM
            v-if="showAddProcessFromMaterielModalDom"
            ref="addProcessFromMaterielModalDom"
            @getMaterialCode="getMaterialInfo"
        />
    </TpfCollapse>
</template>

<script setup lang="tsx" name="SonMaterial">
    import { ref, unref, defineAsyncComponent, computed } from 'vue';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import type { TpfColumnType } from '@/types';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import { FormItem } from 'ant-design-vue';
    import { useAntdTable, useAntdForm, useRouteQuery } from '@/hooks';
    import { tableResizable, getTpfOptionEnum } from '@/config';
    import { checkRequired } from '@/formRuleConfig/Tpfrules';
    import TpfInputNumber from '@/components/TpfInputNumber/index.vue';
    import { useAddProcessFromMaterielModal } from '@/components';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import { useMaterialProductBOMApi, ChildMaterialVo } from '@/api';

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const {
        AddProcessFromMaterielModal,
        addProcessFromMaterielModalDom,
        openAddProcessFromMaterielModalDom,
        showAddProcessFromMaterielModalDom
    } = useAddProcessFromMaterielModal();
    const arr = ['DETAIL', 'update'];
    const useMaterialProductBOM = useMaterialProductBOMApi();

    const { publishOption, getLabel, updateResult } = getTpfOptionEnum();

    const emit = defineEmits<{
        (e: 'onSubmit', val: any): void;
    }>();
    const { formRef, validateFields } = useAntdForm();

    type Props = {
        materialCode: string;
        originalInfo?: any;
    };
    const props = withDefaults(defineProps<Props>(), {
        materialCode: ''
    });
    const { type } = useRouteQuery<{
        type: string;
    }>();
    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 100,
        fixed: 'right',
        visible: !arr.includes(type),
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });
    // 删除
    const defaultBtn = [
        {
            title: '删除',
            onClick: async ({ record }: any) => {
                if (type === 'DETAIL') {
                    return false;
                }
                await delSelectRow([record.materialCode]);
                emit('onSubmit', unref(getTableList()));
            }
        }
    ];
    const columns = computed<TpfColumnType<any>[]>(() => {
        if (type === 'update') {
            return [
                { title: '父级物料编号', dataIndex: 'materialCode', ...tableResizable() },
                { title: '父级物料名称', dataIndex: 'materialName', ...tableResizable() },
                { title: '图号', dataIndex: 'figureNum', ...tableResizable() },
                { title: '物料规格', dataIndex: 'materialSpec', ...tableResizable() },
                {
                    title: '物料类型',
                    dataIndex: 'materialMold',
                    ...tableResizable(),
                    customRender: ({ record }) => {
                        return record.materialMoldName;
                    }
                },
                {
                    title: '版本',
                    dataIndex: 'bomVersion',
                    ...tableResizable(),
                    customRender: ({ text }) => {
                        return 'V' + text;
                    }
                },
                {
                    title: '状态',
                    dataIndex: 'releaseFlag',
                    ...tableResizable(),
                    customRender: ({ text }) => {
                        return getLabel(text, publishOption);
                    }
                },
                {
                    title: '更新结果',
                    dataIndex: 'updateResult',
                    ...tableResizable(),
                    customRender: ({ text }) => {
                        return getLabel(text, updateResult);
                    }
                }
            ];
        }
        return [
            { title: '物料编号', dataIndex: 'materialCode', ...tableResizable() },
            { title: '物料名称', dataIndex: 'materialName', ...tableResizable() },
            { title: '图号', dataIndex: 'figureNum', ...tableResizable() },
            { title: '物料规格', dataIndex: 'materialSpec', ...tableResizable() },
            {
                title: '基本单位',
                dataIndex: 'materialUnitCode',
                ...tableResizable(),
                customRender: ({ record }) => record.materialUnitName
            },
            {
                title: '物料类型',
                dataIndex: 'materialMold',
                ...tableResizable(),
                customRender: ({ record }) => {
                    return record.materialMoldName;
                }
            },

            { title: '备注', dataIndex: 'remark', ...tableResizable() },
            { title: 'bom 版本', dataIndex: 'bomVersion', ...tableResizable(), visible: false },

            {
                title: () => <span class="required"> 用量</span>,
                dataIndex: 'num',
                ...tableResizable(),
                customRender: ({ record, index }) => {
                    return (
                        <FormItem
                            name={['dataSource', index, 'num']}
                            rules={[checkRequired()] as any}
                        >
                            <TpfInputNumber v-model:value={record.num} fromSys={true} />
                        </FormItem>
                    );
                }
            },

            {
                title: '损耗率(%)',
                dataIndex: 'wasteRate',
                ...tableResizable(),
                customRender: ({ text, record, index }) => {
                    return (
                        <FormItem name={['dataSource', index, 'wasteRate']}>
                            <TpfInputNumber v-model={[record.wasteRate, 'value']} fromSys={true} />
                        </FormItem>
                    );
                }
            }
        ];
    });
    const onAdd = () => {
        openAddProcessFromMaterielModalDom(
            [{ materialCode: props.materialCode }],
            unref(getTableList())
        );
    };
    const getMaterialInfo = (val: any) => {
        const res = val.map((e: any, i: number) => {
            e.index = i;
            e.num = 1;
            return e;
        });
        setTableList(res);
        emit('onSubmit', unref(getTableList()));
    };
    const customRow = (record: any) => ({
        onClick: async () => {
            selectRow.value = record;
            const result = await useMaterialProductBOM.getBomTree({
                materialCode: record.materialCode,
                bomVersion: record.bomVersion
            });
            emit('onSubmit', [result.data.object]);
        }
    });

    const { tableInfo, getTableList, setTableList, delSelectRow, selectedRowInfo, selectRow } =
        useAntdTable({
            api: async () => {
                return { list: [] as ChildMaterialVo[] };
            },
            rowKey: 'materialCode',
            isPageAble: false,
            hasRowSelection: type === 'update',
            colorRow: type === 'update'
        });

    const getSubmitInfo = async () => {
        if (type === 'update') {
            const res = selectedRowInfo.value.selectedRows;
            return { updateParentMaterialVoList: res };
        } else {
            const validateFieldsArr = unref(getTableList()).map((e: any) => {
                return ['dataSource', e.index, 'num'];
            });
            await validateFields(validateFieldsArr);
            return { childMaterials: unref(getTableList()) };
        }
    };

    const setTableListFun = (val: ChildMaterialVo[]) => {
        setTableList(val);
        if (val.length > 0) {
            selectRow.value = val[0];
            customRow(val[0]).onClick();
            const materialCodes = val.map((e: any) => e.materialCode);
            selectedRowInfo.value.selectedRowKeys = materialCodes;
            selectedRowInfo.value.selectedRows = val;
        }
    };
    defineExpose({
        tableInfo,
        getSubmitInfo,
        setTableList,
        getTableList,
        setTableListFun
    });
</script>

<style scoped lang="less">
    :deep(.ant-card) {
        .ant-card-body {
            padding: 8px 12px 8px 12px;
            height: 200;

            .tpf-layout {
                padding: 0 !important;

                .tpf-table-layout {
                    padding: 0;
                }
            }
        }
    }
</style>
