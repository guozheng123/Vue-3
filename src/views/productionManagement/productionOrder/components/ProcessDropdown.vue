<template>
    <a-dropdown>
        <a-button type="primary" class="tpf-button" :disabled="selectedRowKeys.length !== 1">
            工序BOM
            <DownOutlined />
        </a-button>
        <template #overlay>
            <a-menu @click="clickBom">
                <a-menu-item key="processBomProtect">工序BOM维护</a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
    <ProcessBomProtectModal
        ref="processBomProtectModalDom"
        v-if="showProcessBomProtectModalDom"
        @updateTable="updateTable"
    />
</template>

<script setup lang="tsx" name="processDropdown">
    import { DownOutlined } from '@ant-design/icons-vue';
    import type { Key } from 'ant-design-vue/es/_util/type';
    import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface';
    import { useOpenAntdModal } from '@/hooks';
    import { defineAsyncComponent } from 'vue';

    const ProcessBomProtectModal = defineAsyncComponent(
        () => import('./ProcessBomProtectModal.vue')
    );

    type Props = {
        selectedRowKeys?: Key[];
    };

    const props = withDefaults(defineProps<Props>(), {
        selectedRowKeys: () => []
    });

    const emit = defineEmits<{
        (e: 'updateTable'): void;
    }>();

    const [
        processBomProtectModalDom,
        openProcessBomProtectModalDom,
        showProcessBomProtectModalDom
    ] = useOpenAntdModal();

    const bomAction = {
        processBomProtect: () => {
            const [orderId] = props.selectedRowKeys;
            openProcessBomProtectModalDom(orderId);
        }
    };

    const clickBom = ({ key }: MenuInfo) => {
        bomAction[key] && bomAction[key]();
    };
    const updateTable = () => {
        emit('updateTable');
    };
    defineExpose({ clickBom });
</script>

<style lang="less" scoped></style>
