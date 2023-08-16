<template>
    <a-dropdown>
        <a-button
            type="primary"
            class="tpf-button"
            :disabled="!selectedRowInfo?.selectedRowKeys.length"
        >
            批量操作
            <DownOutlined />
        </a-button>
        <template #overlay>
            <a-menu @click="clickMultiple">
                <a-menu-item key="protectProcess">维护工艺路线 </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
    <ProtectProcessLineModal
        ref="processLineModalDom"
        v-if="showProcessLineModalDom"
        :selectedRows="selectedRowInfo.selectedRows"
        @updateTable="updateTable"
    />
</template>

<script setup lang="tsx" name="multipleOperate">
    import { useOpenAntdModal } from '@/hooks';
    import { DownOutlined } from '@ant-design/icons-vue';
    import { defineAsyncComponent } from 'vue';
    type Props = {
        selectedRowInfo?: {
            selectedRowKeys: (string | number)[];
            selectedRows: Record<string, any>[];
        };
    };

    const props = withDefaults(defineProps<Props>(), {
        selectedRowInfo: () => ({ selectedRowKeys: [], selectedRows: [] })
    });

    const emit = defineEmits<{
        (e: 'updateTable'): void;
    }>();

    const ProtectProcessLineModal = defineAsyncComponent(
        () => import('./ProtectProcessLineModal.vue')
    );

    const [processLineModalDom, openProcessLineModalDom, showProcessLineModalDom] =
        useOpenAntdModal();

    const multipleAction = {
        protectProcess: () => {
            openProcessLineModalDom();
        }
    };
    const clickMultiple = ({ key }: any) => {
        multipleAction[key] && multipleAction[key]();
    };

    const updateTable = () => {
        emit('updateTable');
    };
</script>

<style lang="less" scoped></style>
