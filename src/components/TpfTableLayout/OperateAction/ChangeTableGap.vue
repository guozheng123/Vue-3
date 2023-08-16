<template>
    <a-dropdown :trigger="['click']" placement="bottomLeft" overlayClassName="tpf-dropdown">
        <SvgIcon type="icon-jianju" cursor shadow :size="24" style="color: #1d2129" />
        <template #overlay>
            <TpfDropdownOverlay v-model:active="currentSize" :optionList="changeSizeTypeList" />
        </template>
    </a-dropdown>
</template>

<script setup lang="ts" name="ChangeTableGap">
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { SizeType } from 'ant-design-vue/lib/config-provider';

    import TpfDropdownOverlay from '@/components/TpfDropdown/TpfDropdownOverlay.vue';
    import { useVModel } from '@vueuse/core';

    const changeSizeTypeList = [
        { type: '标准', icon: 'icon-biaozhun', key: 'small' },
        { type: '舒适', icon: 'icon-shushi', key: 'middle' },
        { type: '宽敞', icon: 'icon-kuanchang', key: 'large' }
    ];
    type Props = {
        size: SizeType;
    };

    const props = defineProps<Props>();

    const emit = defineEmits<{
        (e: 'update:size', val: string): void;
    }>();

    const currentSize = useVModel(props, 'size', emit);
</script>

<style lang="less" scoped></style>
