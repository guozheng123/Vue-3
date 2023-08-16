<template>
    <TpfAddInfoLayout
        :title="productionOrderId ? '编辑生产订单' : '新增生产订单'"
        class="productionOrderDetail"
    >
        <!-- 基本信息 -->
        <LoadingSkeleton>
            <OrderBaseInfo
                id="orderBaseInfo"
                ref="orderBaseInfoDom"
                :orderSource="orderSource"
                :productionOrder="productionOrderInfo.productionOrder"
            />
        </LoadingSkeleton>

        <!-- 物料信息 -->
        <LoadingSkeleton>
            <MaterielInfo
                id="materielInfo"
                ref="materielInfoDom"
                :productionOrderMaterial="productionOrderInfo.productionOrderMaterial"
                @setMaterialProcessList="setMaterialProcessList"
            />
        </LoadingSkeleton>

        <!-- 生产工艺 -->
        <LoadingSkeleton>
            <ProcessInfo
                id="processInfo"
                ref="processInfoDom"
                :productionOrderProcessVoList="productionOrderInfo.productionOrderProcessVoList"
            />
        </LoadingSkeleton>

        <!-- 自定义字段 -->
        <LoadingSkeleton>
            <TpfCollapse title="自定义字段" id="TpfDIYFieldForm">
                <TpfDIYFieldForm
                    v-if="!!pageCode"
                    :pageCode="pageCode"
                    submitName="diyFieldData"
                    :diyFieldData="productionOrderInfo.diyFieldData"
                    ref="TpfDIYFieldFormDom"
                />
            </TpfCollapse>
        </LoadingSkeleton>

        <!-- 客户信息 -->
        <LoadingSkeleton>
            <CustomerInfo
                id="customerInfo"
                ref="customerInfoDom"
                :productionOrderCustomer="productionOrderInfo.productionOrderCustomer"
            />
        </LoadingSkeleton>

        <!-- 附件 -->
        <LoadingSkeleton>
            <TpfCollapseFileInfo
                id="fileInfo"
                ref="fileInfoDom"
                :maxSize="0"
                accept=".doc,.docx,.xlsx,.xls,.pdf"
                :file-list="productionOrderInfo.productionOrderFileVoList"
            />
        </LoadingSkeleton>

        <ReleaseProductionOrderModal ref="releaseModal" @updateTable="cancelEdit" />

        <TpfAnchor :anchorList="anchorList" />

        <template #footerRight>
            <a-button class="tpf-button" @click="cancelEdit"> 取消 </a-button>
            <a-button type="primary" class="tpf-button" @click="withdrawReleaseOrder">
                下达
            </a-button>
            <a-button type="primary" class="tpf-button" @click="saveInfo"> 保存 </a-button>
        </template>
    </TpfAddInfoLayout>
</template>

<script setup lang="tsx">
    import TpfAddInfoLayout from '@/components/TpfAddInfoLayout/index.vue';
    import { ref, computed, unref, defineAsyncComponent, onMounted } from 'vue';
    import { useProductionOrderApi } from '@/api';
    import type { ProductionOrderByIdType } from '@/api';
    import { useOpenAntdModal, useRouteQuery, useRouteBackTab } from '@/hooks';
    import { PageCodeEnum } from '@/config';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import { useTpfCollapseFileInfo } from '@/components';

    const { TpfCollapseFileInfo } = useTpfCollapseFileInfo();

    const pageCode = PageCodeEnum.productionOrder;

    const anchorList = [
        { href: 'orderBaseInfo', title: '基本信息', visible: true },
        { href: 'materielInfo', title: '物料信息', visible: true },
        { href: 'processInfo', title: '生产工艺', visible: true },
        { href: 'TpfDIYFieldForm', title: '自定义字段', visible: true },
        { href: 'customerInfo', title: '客户信息', visible: true },
        { href: 'fileInfo', title: '附件', visible: true }
    ];

    const TpfAnchor = defineAsyncComponent(() => import('@/components/TpfAnchor/index.vue'));

    const OrderBaseInfo = defineAsyncComponent(() => import('./components/OrderBaseInfo.vue'));

    const MaterielInfo = defineAsyncComponent(() => import('./components/MaterielInfo.vue'));

    const CustomerInfo = defineAsyncComponent(() => import('./components/CustomerInfo.vue'));

    const ProcessInfo = defineAsyncComponent(() => import('./components/ProcessInfo.vue'));

    const TpfDIYFieldForm = defineAsyncComponent(
        () => import('@/components/TpfDIYFieldForm/index.vue')
    );

    const ReleaseProductionOrderModal = defineAsyncComponent(
        () => import('./components/ReleaseProductionOrderModal.vue')
    );

    const { routeBackTab } = useRouteBackTab();

    const [releaseModal, openReleaseModal] = useOpenAntdModal();

    const loading = ref(false);

    const { productionOrderId, orderSource } = useRouteQuery<{
        productionOrderId: string;
        orderSource: string;
    }>();

    const productionOrderApi = useProductionOrderApi();

    const TpfDIYFieldFormDom = ref<InstanceType<typeof TpfDIYFieldForm> | null>(null);
    const orderBaseInfoDom = ref<InstanceType<typeof OrderBaseInfo> | null>(null);
    const materielInfoDom = ref<InstanceType<typeof MaterielInfo> | null>(null);
    const customerInfoDom = ref<InstanceType<typeof CustomerInfo> | null>(null);
    const processInfoDom = ref<InstanceType<typeof ProcessInfo> | null>(null);
    const fileInfoDom = ref<InstanceType<typeof TpfCollapseFileInfo> | null>(null);

    const comList = computed(() => [
        TpfDIYFieldFormDom,
        orderBaseInfoDom,
        materielInfoDom,
        customerInfoDom,
        processInfoDom,
        fileInfoDom
    ]);

    const productionOrderInfo = ref<ProductionOrderByIdType>({} as ProductionOrderByIdType);

    const setMaterialProcessList = (list: Record<string, any>[]) => {
        processInfoDom.value?.setMaterialProcessList(unref(list) || []);
    };

    const getProductionOrderById = async () => {
        if (!unref(productionOrderId)) return;
        loading.value = true;
        try {
            const res = await productionOrderApi.getProductionOrderById({
                productionOrderId: unref(productionOrderId)
            });
            productionOrderInfo.value = res.data.object;
        } finally {
            loading.value = false;
        }
    };

    const cancelEdit = () => {
        routeBackTab();
    };
    const saveParams = async () => {
        const allRes = await Promise.all(unref(comList).map(item => item.value?.submit()));

        const params = allRes.reduce((t, v) => {
            t = { ...t, ...v };
            return t;
        }, {} as any);
        console.log('收集到的参数', params);
        let newProductionOrderId = unref(productionOrderId);
        if (newProductionOrderId) {
            params.productionOrder.productionOrderId = newProductionOrderId;
            await productionOrderApi.editProductionOrder(params);
        } else {
            const res = await productionOrderApi.addProductionOrder(params);
            newProductionOrderId = res.data.value;
        }
        return newProductionOrderId;
    };

    const saveInfo = async () => {
        await saveParams();
        const { message } = await import('ant-design-vue');

        message.success('保存成功');

        cancelEdit();
    };
    //查询是否库存齐套
    const checkProductionOrderFullSetRate = async (productionOrderId: string) => {
        const res = await productionOrderApi.checkProductionOrderFullSetRate({
            ids: [productionOrderId]
        });
        if (!res.data.list.length) return;
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({
            okText: '强制下达',
            width: '600px',
            title: '齐套确认',
            content: (
                <>
                    {res.data.list.map((item, inx) => (
                        <div key={inx}> {item.message} </div>
                    ))}
                </>
            )
        });
    };

    const withdrawReleaseOrder = async () => {
        const productionOrderId = await saveParams();
        const res = await productionOrderApi.releaseOrderCheck(productionOrderId);
        if (!res.data.value) return;
        await checkProductionOrderFullSetRate(productionOrderId);
        openReleaseModal(productionOrderId);
    };

    onMounted(() => {
        getProductionOrderById();
    });
</script>
