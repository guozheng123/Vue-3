<template>
    <TpfModal
        v-model:visible="visible"
        title="强制完工"
        class="forcedComplete"
        height="200px"
        width="400px"
        v-bind="$attrs"
    >
        <TpfTable :dataSource="dataSource" :columns="delColumns" :pagination="false" />
        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="saveForcedComplete">
                确定
            </a-button>
        </template>
    </TpfModal>
    <TpfDeleteDetail ref="delModalDom" v-if="showDelModalDom" />
</template>

<script setup lang="tsx" name="forcedComplete">
    import { useTpfDeleteDetail } from '@/components/TpfDeleteDetail';
    import TpfModal from '@/components/TpfModal/index.vue';
    import { tableResizable } from '@/config';
    import { useRef } from '@/hooks';
    import type { TpfColumnType } from '@/types';
    import { Badge } from 'ant-design-vue';
    import { defineAsyncComponent } from 'vue';
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const { delModalDom, openDelModalDom, showDelModalDom, TpfDeleteDetail } = useTpfDeleteDetail();

    const [visible, setVisible] = useRef(false);

    const delColumns = [
        { title: '消息', dataIndex: 'message', ...tableResizable() },
        {
            title: '状态结果',
            dataIndex: 'result',
            ...tableResizable(),
            width: 100,
            customRender: ({ text }) => {
                if (text === '失败') {
                    return <Badge color="#f00" text={text} />;
                }
                return <Badge color="#0f0" text={text} />;
            }
        },
        { title: '原因', dataIndex: 'reason', ...tableResizable(), width: 300 }
    ] as TpfColumnType[];

    const dataSource = [{}, {}];

    const saveForcedComplete = () => {
        openDelModalDom([{}, {}]);
        close();
    };

    const open = () => {
        setVisible(true);
    };

    const close = () => {
        setVisible(false);
    };

    defineExpose({ open });
</script>

<style lang="less">
    .forcedComplete {
        .ant-modal-body {
            .ant-form-item {
                justify-content: center;

                .ant-form-item-control {
                    flex-grow: unset;
                }
            }
        }
    }
</style>
