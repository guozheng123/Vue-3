<template>
    <a-button
        class="tpf-button"
        type="primary"
        :disabled="!selectedRowKeys.length"
        @click="onDelete"
    >
        <SvgIcon type="icon-shanchu" /> 删除
    </a-button>
    <TpfDeleteDetail ref="delModalDom" v-if="showDelModalDom" />
</template>

<script setup lang="tsx" name="deleteOrder">
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { useProductionOrderApi } from '@/api';
    import type { Key } from 'ant-design-vue/es/vc-tree-select/interface';
    import { useTpfDeleteDetail } from '@/components/TpfDeleteDetail';

    const { delModalDom, openDelModalDom, showDelModalDom, TpfDeleteDetail } = useTpfDeleteDetail();

    const productionOrderApi = useProductionOrderApi();

    type Props = {
        selectedRowKeys?: Key[];
    };
    const props = withDefaults(defineProps<Props>(), {
        selectedRowKeys: () => []
    });
    const emit = defineEmits<{
        (e: 'updateTable'): void;
    }>();

    const getDataList = () => {
        emit('updateTable');
    };

    // 删除
    const onDelete = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定要删除订单吗?删除不可恢复' });
        const res = await productionOrderApi.deleteProductionOrderByIds({
            ids: props.selectedRowKeys
        });

        getDataList();

        if (res.data.list.length) {
            openDelModalDom(res.data.list);
            return;
        }
        const { message } = await import('ant-design-vue');
        message.success('订单删除成功！');
    };
</script>

<style lang="less" scoped></style>
