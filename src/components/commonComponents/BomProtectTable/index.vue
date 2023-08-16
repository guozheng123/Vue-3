<template>
    <div class="bom-protect-table">
        <div class="protect-title">添加工序BOM</div>
        <TpfTableLayout v-if="!isEmpty(currentSelect)">
            <a-form ref="formRef" :model="tableInfo" class="t-flex-1 table-form t-flex">
                <TpfTable v-bind="{ ...tableInfo, columns, pagination }" class="tpf-table-form" />
            </a-form>

            <template #operateRight>
                <a-button
                    class="tpf-button"
                    ghost
                    type="primary"
                    :disabled="currentSelect.isDisabled"
                    @click="addProcessFromMateriel"
                >
                    <SvgIcon type="icon-insert" /> 添加(从物料库)
                </a-button>
                <a-button
                    class="tpf-button"
                    ghost
                    type="primary"
                    @click="addProcessFromBom"
                    v-if="!!bomAccId"
                >
                    <SvgIcon type="icon-insert" /> 添加(从BOM)
                </a-button>
                <a-button
                    class="tpf-button"
                    ghost
                    type="primary"
                    @click="delSelectRowFun()"
                    :disabled="isEmpty(selectedRowInfo.selectedRowKeys)"
                >
                    <SvgIcon type="icon-shanchu" /> 删除
                </a-button>
            </template>
        </TpfTableLayout>
        <a-empty v-else>
            <template #description> 请点击左侧树形菜单进行相关操作 </template>
        </a-empty>

        <AddProcessFromMaterielModal
            v-if="showAddProcessFromMaterielModalDom"
            ref="addProcessFromMaterielModalDom"
            @getMaterialCode="getMaterialCode"
        />

        <AddProcessFromBomModal
            :bomAccId="bomAccId"
            ref="addProcessFromBomModalDom"
            v-if="showAddProcessFromBomModalDom"
            @getMaterialCode="getMaterialCode"
        />
    </div>
</template>

<script setup lang="tsx" name="BomProtectTable">
    import { tableResizable } from '@/config';
    import { useAntdTable, useAntdForm } from '@/hooks';
    import { TpfAxiosRes, TpfColumnType } from '@/types';
    import { unref, defineAsyncComponent, computed, watch } from 'vue';
    import { FormItem, message } from 'ant-design-vue';
    import { isEmpty } from 'lodash-es';
    import { useAddProcessFromMaterielModal, useAddProcessFromBomModal } from '@/components';
    import { useStore } from '@/store';
    import TpfInputNumber from '@/components/TpfInputNumber/index.vue';
    import { checkMoreZero } from '@/formRuleConfig/Tpfrules';

    const { userStore } = useStore();
    const { formRef, validateFields } = useAntdForm();

    const {
        AddProcessFromMaterielModal,
        addProcessFromMaterielModalDom,
        openAddProcessFromMaterielModalDom,
        showAddProcessFromMaterielModalDom
    } = useAddProcessFromMaterielModal();

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );

    const {
        AddProcessFromBomModal,
        addProcessFromBomModalDom,
        openAddProcessFromBomModalDom,
        showAddProcessFromBomModalDom
    } = useAddProcessFromBomModal();

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    type Props = {
        currentSelect?: Record<string, any>;
        bomAccId?: string;
        getMaterialList: (params: {
            bomId: any;
            bomVersion: any;
            operationCode?: string;
            workOrderCode?: string;
        }) => Promise<TpfAxiosRes<any>>;
        rowKey?: string;
    };
    const props = withDefaults(defineProps<Props>(), {
        currentSelect: () => ({}),
        rowKey: 'id'
    });

    const delSelectRowFun = () => {
        let isRequisitionOrder = false; //不包含领料单
        selectedRowInfo.value.selectedRows.forEach((ele: any) => {
            if (ele.isRequisitionOrder) {
                isRequisitionOrder = true;
            }
        });
        if (isRequisitionOrder) {
            return message.warning('已经生成工序领料单的物料组件，不能删除!');
        }
        delSelectRow();
    };

    const {
        tableInfo,
        getDataList,
        selectedRowInfo,
        pagination,
        setTableList,
        getTableList,
        delSelectRow
    } = useAntdTable({
        api: async () => {
            const { bomId, bomVersion, operationCode, workOrderCode } = props.currentSelect || {};
            if (!bomId) return { list: [] };
            const res = await props.getMaterialList({
                bomId,
                bomVersion,
                operationCode,
                workOrderCode
            });
            return res.data;
        },
        rowKey: props.rowKey,
        isPageAble: false,
        hasRowSelection: true
    });

    const validatorNum = () => {
        return {
            trigger: ['change', 'blur'],
            validator: (_rule: any, value: any) => {
                if ([null, undefined, ''].includes(value)) {
                    return Promise.reject('必填字段！');
                }
                if (Number(value) <= 0) {
                    return Promise.reject('必须大于0');
                }
                return Promise.resolve();
            }
        };
    };

    const columns = computed<TpfColumnType[]>(() => [
        { title: '物料编码', dataIndex: 'materialCode', ...tableResizable() },
        { title: '物料名称', dataIndex: 'materialName', ...tableResizable() },
        {
            title: () => <span class="required">生产数量</span>,
            dataIndex: 'num',
            ...tableResizable(),
            customRender: ({ record, index }) => {
                return (
                    <FormItem name={['dataSource', index, 'num']} rules={[validatorNum()] as any}>
                        <TpfInputNumber
                            disabled={record.isRequisitionOrder}
                            min={0}
                            v-model={[record.num, 'value']}
                        />
                    </FormItem>
                );
            }
        },
        { title: '生产单位', dataIndex: 'productUnitCodeName', ...tableResizable() },
        {
            title: '基本数量',
            dataIndex: 'bomRatio',
            ...tableResizable(),
            customRender: ({ record }) => {
                let rate = 0;
                const { productUnitUsage, materialUnitUsage } = record;
                if (productUnitUsage && materialUnitUsage) {
                    rate = materialUnitUsage / productUnitUsage;
                }
                const res = +(Number(record.num || 0) * rate).toFixed(userStore.decimalPlaces);

                return res;
            }
        },
        { title: '基本单位', dataIndex: 'materialUnitName', ...tableResizable() },
        { title: '损耗率%', dataIndex: 'wasteRate', ...tableResizable() },
        { title: '生产管理方式', dataIndex: 'supervisorModeName', ...tableResizable() }
    ]);

    const addProcessFromMateriel = () => {
        openAddProcessFromMaterielModalDom(unref(getTableList()));
    };

    const addProcessFromBom = () => {
        openAddProcessFromBomModalDom(unref(getTableList()));
    };

    watch(
        () => props.currentSelect,
        () => {
            getDataList();
        },
        { deep: true }
    );

    const getMaterialCode = (list: any[]) => {
        list.forEach(item => {
            const flag = unref(getTableList()).some((it: any) => it.id === item.id);
            const { bomRatio, productUnitUsage, materialUnitUsage } = item;

            let num: string | number = '';
            if (bomRatio && productUnitUsage && materialUnitUsage) {
                num = (bomRatio * productUnitUsage) / materialUnitUsage;
            }
            item.num = num;

            if (!flag) {
                setTableList([...unref(getTableList()), item]);
            }
        });
    };

    const getDataSource = async () => {
        await validateFields();

        return unref(getTableList());
    };

    defineExpose({ getDataSource });
</script>

<style lang="less" scoped>
    .bom-protect-table {
        height: 100%;
        display: flex;
        flex-direction: column;

        .protect-title {
            color: #1d2129;
            line-height: 48px;
            padding: 0 10px;
            box-sizing: border-box;
            border-bottom: 1px solid #eee;
        }

        :deep(.tpf-table-layout) {
            flex: 1;
        }
    }
</style>
