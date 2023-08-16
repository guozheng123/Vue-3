<template>
    <div class="productionOrder" v-loading="loading">
        <!-- 基本信息 -->
        <TpfCollapse title="基本信息" id="productionOrder">
            <TpfDescriptions
                :originalDate="productionOrderInfo"
                :renderList="productionOrderList"
            />
        </TpfCollapse>

        <!-- 物料信息 -->
        <TpfCollapse title="物料信息" id="productionOrderMaterial">
            <TpfDescriptions
                :originalDate="productionOrderInfo"
                :renderList="productionOrderMaterialList"
            />
        </TpfCollapse>

        <!-- 生产工艺 -->
        <TpfCollapse title="生产工艺" class="processInfo-collapse" id="productionOrderProcessVo">
            <TpfTable
                seq
                :columns="columns"
                :dataSource="productionOrderProcessVoList"
                size="small"
                :pagination="false"
            />
        </TpfCollapse>

        <!-- 自定义字段 -->
        <TpfCollapse title="自定义字段" id="DIYFieldList">
            <TpfDescField
                title="自定义字段"
                :pageCode="pageCode"
                :originalDate="productionOrderInfo"
                id="DIYFieldList"
            />
        </TpfCollapse>

        <!-- 客户信息 -->
        <TpfCollapse title="客户信息" id="productionOrderCustomer">
            <TpfDescriptions
                :originalDate="productionOrderInfo"
                :renderList="productionOrderCustomerList"
            />
        </TpfCollapse>

        <!-- 其他 -->
        <TpfCollapse title="其他" id="other">
            <TpfDescriptions
                :descriptionsProps="{
                    labelStyle: { width: '132px' }
                }"
                :originalDate="productionOrderInfo"
                :renderList="otherList"
            />
        </TpfCollapse>

        <!-- 附件 -->
        <TpfCollapse title="附件" id="productionOrderFileVo">
            <div class="uploadBtn" v-noData="!productionOrderFileVoList.length">
                <TpfUpload
                    :fileList="productionOrderFileVoList"
                    is-readonly
                    v-if="productionOrderFileVoList.length"
                />
            </div>
        </TpfCollapse>
        <TpfAnchor :anchorList="anchorList" />
    </div>
</template>

<script setup lang="tsx" name="productionOrderInfo">
    import TpfTable from '@/components/TpfTable/index.vue';
    import { ref, computed, unref, defineAsyncComponent, onMounted } from 'vue';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import { PageCodeEnum, tableResizable } from '@/config';
    import { TpfColumnType } from '@/types';
    import { Checkbox } from 'ant-design-vue';
    import TpfDescriptions from '@/components/TpfDescriptions/index.vue';
    import { useProductionOrderApi } from '@/api';
    import { isArray } from 'lodash-es';
    import TpfUpload from '@/components/TpfUpload/index.vue';
    import { useRouteQuery } from '@/hooks';
    import type { TpfDescColumnType } from '@/types';

    const TpfDescField = defineAsyncComponent(() => import('@/components/TpfDescField/index.vue'));

    const pageCode = PageCodeEnum.productionOrder;

    const anchorList = [
        { href: 'productionOrder', title: '基本信息', visible: true },
        { href: 'productionOrderMaterial', title: '物料信息', visible: true },
        { href: 'productionOrderProcessVo', title: '生产工艺', visible: true },
        { href: 'DIYFieldList', title: '自定义字段', visible: true },
        { href: 'productionOrderCustomer', title: '客户信息', visible: true },
        { href: 'other', title: '其他', visible: true },
        { href: 'productionOrderFileVo', title: '附件', visible: true }
    ];

    const TpfAnchor = defineAsyncComponent(() => import('@/components/TpfAnchor/index.vue'));

    const productionOrderApi = useProductionOrderApi();

    const loading = ref(false);

    const productionOrderInfo = ref<{ [k: string]: any }>({});

    const { productionOrderId } = useRouteQuery<{ productionOrderId: string }>();

    const columns = computed(() => {
        return [
            { title: '工艺编号', dataIndex: 'processCode', ...tableResizable() },
            { title: '工艺名称', dataIndex: 'processName', ...tableResizable() },
            {
                title: '工艺版本',
                dataIndex: 'processVersion',
                ...tableResizable(),
                customRender: ({ text }) => (text ? `v${text}` : '')
            },
            {
                title: '默认工艺',
                dataIndex: 'defaultFlag',
                ...tableResizable(),
                customRender: ({ text }) => (
                    <Checkbox class="radio-check" checked={Number(text) === 1} />
                )
            }
        ] as TpfColumnType[];
    });

    const productionOrderProcessVoList = computed(() => {
        if (!isArray(unref(productionOrderInfo).productionOrderProcessVoList)) return [];
        return unref(productionOrderInfo).productionOrderProcessVoList;
    });

    const productionOrderFileVoList = computed(() => {
        if (!isArray(unref(productionOrderInfo).productionOrderFileVoList)) return [];
        const res = unref(productionOrderInfo).productionOrderFileVoList.map(
            (item: any, uid: number) => ({
                ...item,
                name: item.fileName,
                uid
            })
        );
        return res;
    });

    const productionOrderList = computed(() => {
        return [
            { label: '项目编号', field: 'projectCode' },
            { label: '项目名称', field: 'projectName' },
            { label: '项目集编号', field: 'projectGroupCode' },
            { label: '项目集名称', field: 'projectGroupName' },
            { label: '订单状态', field: 'statusCode' },
            { label: '订单类型', field: 'orderTypeCode' },
            { label: '订单来源', field: 'orderSource' },
            { label: '所属工厂', field: 'factoryCode' },
            { label: '计划开始日期', field: 'plannedStartDate' },
            { label: '计划结束日期', field: 'plannedEndDate' },
            { label: '订单交期', field: 'requirementDate' },
            { label: '报工计算逻辑', field: 'confirmLogic' },
            { label: '装备调试', field: 'equipmentDebug' },
            { label: '顺序报工', field: 'reportInOrder' },
            { label: '超产', field: 'overProduction' },
            unref(productionOrderInfo).overProduction === '是' && {
                label: '超产比例(%)',
                field: 'overProductionRatio'
            },
            { label: '产品订单编号', field: 'productOrderCode' },
            { label: '来源单号', field: 'sourceNo' },
            { label: '清单编号', field: 'billNo' },
            { label: '订单批次', field: 'productionBatchNum' },
            { label: '批次序号', field: 'batchSerialNo' },
            { label: '图纸云变更时间', field: 'drawingBomModifyDatetime' },
            { label: '备注信息', field: 'remark' }
        ] as TpfDescColumnType[];
    });
    // console.log(unref(productionOrderInfo), 'GOGOG');

    const productionOrderMaterialList = [
        { label: '物料编号', field: 'materialCode' },
        { label: '物料名称', field: 'materialName' },
        { label: '物料规格', field: 'materialSpec' },
        { label: '图号', field: 'figureNum' },
        { label: '计划数', field: 'plannedQuantity' },
        { label: '基本单位', field: 'materialUnitName' },
        { label: '完工数', field: 'completedQuantity' },
        { label: '超产数', field: 'overProduceQuantity' },
        { label: '报废数', field: 'completedQuantity' },
        { label: '实际开始时间', field: 'actualStartDatetime' },
        { label: '实际结束时间', field: 'actualEndDatetime' }
    ];
    const productionOrderCustomerList = [
        { label: '客户', field: 'customerSupplierName' },
        { label: '客户单号', field: 'customerOrder' },
        { label: '外部单号', field: 'externalErpNum' },
        { label: '外部订单行号', field: 'externalErpRowNum' },
        { label: '销售单价(元)', field: 'price' },
        { label: '客户报价(元)', field: 'customerQuotationPrice' },
        { label: '未税单价(元)', field: 'priceExcludingTax' },
        { label: '加工报价(元)', field: 'manufactureFee' },
        { label: '加工核价(元)', field: 'manufactureAccountFee' },
        { label: '税率(%)', field: 'taxRate' }
    ];
    const otherList = [
        { label: '产品类型', field: 'productType' },
        { label: '父级物料编号', field: 'oneLevelMaterialCode' },
        { label: '父级物料名称', field: 'oneLevelMaterialText' },
        { label: '二层父级物料编号', field: 'twoLevelMaterialCode' },
        { label: '二层父级物料名称', field: 'twoLevelMaterialText' },
        { label: '批号', field: 'lotNum' },
        { label: '二层物料编号', field: 'twoMaterialCode' },
        { label: '二层物料名称', field: 'twoMaterialText' }
    ];

    const getProductionOrderViewById = async () => {
        loading.value = true;

        try {
            const res = await productionOrderApi.getProductionOrderViewById(
                unref(productionOrderId)
            );
            productionOrderInfo.value = res.data.object;
        } finally {
            loading.value = false;
        }
    };

    onMounted(() => {
        getProductionOrderViewById();
    });
</script>

<style lang="less" scoped>
    .productionOrder {
        padding: 0;
        box-sizing: border-box;

        :deep(.tpf-collapse) {
            .tpf-collapse-header {
                background: #fff;
            }

            .tpf-collapse-content {
                background: #fff;
            }
        }

        :deep(.processInfo-collapse) {
            &.tpf-collapse {
                .tpf-collapse-content {
                    height: 280px;

                    .tpf-table {
                        height: 100%;

                        .ant-table.ant-table-small .ant-table-thead > tr > th {
                            padding: 11px 8px;
                        }
                    }
                }
            }
        }

        .uploadBtn {
            background-color: #fff;
            padding: 20px;
            min-height: 40px;
            box-sizing: border-box;
        }
    }
</style>
