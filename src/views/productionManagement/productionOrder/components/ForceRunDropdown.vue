<template>
    <a-dropdown>
        <a-button type="primary" class="tpf-button" :disabled="!selectedRowKeys.length">
            强制执行
            <DownOutlined />
        </a-button>
        <template #overlay>
            <a-menu @click="clickForced">
                <a-menu-item key="forcedComplete">强制完工</a-menu-item>
                <a-menu-item key="forcedClose">强制关闭</a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
    <TpfDeleteDetail ref="delModalDom" v-if="showDelModalDom" />
    <ForcedCompleteModal ref="completeModalDom" @sure="sure" v-if="showCompleteModalDom" />
</template>

<script setup lang="tsx" name="forceRunDropdown">
    import { useOpenAntdModal } from '@/hooks';
    import { defineAsyncComponent, unref } from 'vue';
    import { DownOutlined } from '@ant-design/icons-vue';
    import { useProductionOrderApi } from '@/api';
    import { isArray } from 'lodash-es';
    import { useTpfDeleteDetail } from '@/components/TpfDeleteDetail';

    const ForcedCompleteModal = defineAsyncComponent(() => import('./ForcedCompleteModal.vue'));

    const productionOrderApi = useProductionOrderApi();

    const { delModalDom, openDelModalDom, showDelModalDom, TpfDeleteDetail } = useTpfDeleteDetail();

    type Props = {
        selectedRowKeys?: (string | number)[];
    };
    const props = withDefaults(defineProps<Props>(), {
        selectedRowKeys: () => []
    });
    const emit = defineEmits<{
        (e: 'updateTable'): void;
    }>();

    const [completeModalDom, openCompleteModalDom, showCompleteModalDom] = useOpenAntdModal();

    const sure = async () => {
        const res = await productionOrderApi.batchCompulsoryCompletionProductionOrder({
            ids: unref(props.selectedRowKeys)
        });
        if (isArray(res.data.list) && res.data.list.length) {
            openDelModalDom(res.data.list);
            return;
        }
        const { message } = await import('ant-design-vue');
        message.success('强制完工执行成功');
        emit('updateTable');
    };

    const forcedAction = {
        //强制完工
        forcedComplete: async () => {
            const res = await productionOrderApi.getUnCompleteWorkOrderUnderProductionOrder({
                ids: unref(props.selectedRowKeys)
            });
            openCompleteModalDom(res.data.list);
        },

        //强制关闭
        forcedClose: async () => {
            const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
            await TpfDelConfirm({ content: '确定强制关闭?', title: '确认提示' });
            const res = await productionOrderApi.batchCompulsoryCloseProductionOrder({
                ids: unref(props.selectedRowKeys)
            });
            if (isArray(res.data.list) && res.data.list.length) {
                openDelModalDom(res.data.list);
                return;
            }
            const { message } = await import('ant-design-vue');
            message.success('强制关闭执行成功');
            emit('updateTable');
        }
    };

    const clickForced = ({ key }: any) => {
        forcedAction[key] && forcedAction[key]();
    };
</script>
