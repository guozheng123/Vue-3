<template>
    <a-dropdown>
        <a-button class="tpf-button" type="primary" :disabled="isEmpty(selectedRowKeys)">
            下达
            <DownOutlined />
        </a-button>
        <template #overlay>
            <a-menu @click="clickXiaDa">
                <a-menu-item key="releaseProductionOrder" :disabled="selectedRowKeys.length !== 1">
                    下达
                </a-menu-item>
                <a-menu-item key="moreWithDrawAction">批量下达</a-menu-item>
                <a-menu-item key="withdrawReleaseOrder"> 撤回下达 </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>

    <MoreWithDraw
        ref="moreWithDrawModalDom"
        v-if="showMoreWithDrawModalDom"
        :selectNum="selectedRowKeys.length"
        @updateTable="getDataList"
    />

    <ReleaseProductionOrderModal
        ref="releaseModalDom"
        v-if="showReleaseModalDom"
        @updateTable="getDataList"
    />
</template>

<script setup lang="tsx" name="releaseOrderDropdown">
    import { defineAsyncComponent } from 'vue';
    import { useProductionOrderApi } from '@/api';
    import { useOpenAntdModal } from '@/hooks';
    import { DownOutlined } from '@ant-design/icons-vue';
    import type { Key } from 'ant-design-vue/es/vc-tree-select/interface';
    import { isEmpty } from 'lodash-es';

    const MoreWithDraw = defineAsyncComponent(() => import('./MoreWithDraw.vue'));

    const ReleaseProductionOrderModal = defineAsyncComponent(
        () => import('../productionOrderEdit/components/ReleaseProductionOrderModal.vue')
    );

    const productionOrderApi = useProductionOrderApi();

    const [releaseModalDom, openReleaseModalDom, showReleaseModalDom] = useOpenAntdModal();

    const [moreWithDrawModalDom, openMoreWithDrawModalDom, showMoreWithDrawModalDom] =
        useOpenAntdModal();

    type Props = {
        selectedRowKeys?: Key[];
    };
    const props = withDefaults(defineProps<Props>(), {
        selectedRowKeys: () => []
    });

    const emit = defineEmits<{
        (e: 'updateTable'): void;
    }>();

    //查询是否库存齐套
    const checkProductionOrderFullSetRate = async () => {
        const [productionOrderId] = props.selectedRowKeys;
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

    const xiaDaAction = {
        //下达
        releaseProductionOrder: async () => {
            const [productionOrderId] = props.selectedRowKeys;
            //查询是否库存齐套
            const res = await productionOrderApi.releaseOrderCheck(productionOrderId);
            if (!res.data.value) return;
            await checkProductionOrderFullSetRate();
            openReleaseModalDom(productionOrderId);
        },

        //批量下达
        moreWithDrawAction: () => {
            openMoreWithDrawModalDom(props.selectedRowKeys);
        },

        //撤回下达
        withdrawReleaseOrder: async () => {
            const [productionOrderId] = props.selectedRowKeys;
            await productionOrderApi.withdrawReleaseOrder(productionOrderId);
            const { message } = await import('ant-design-vue');
            message.success('操作成功');
            getDataList();
        }
    };

    const getDataList = () => {
        emit('updateTable');
    };

    const clickXiaDa = ({ key }: any) => {
        xiaDaAction[key] && xiaDaAction[key]();
    };
</script>

<style lang="less" scoped></style>
