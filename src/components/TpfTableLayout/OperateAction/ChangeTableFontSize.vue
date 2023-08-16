<template>
    <a-dropdown :trigger="['click']" placement="bottom" overlayClassName="tpf-dropdown">
        <SvgIcon type="icon-a-Frame1" cursor shadow :size="24" style="color: #1d2129" />
        <template #overlay>
            <TpfDropdownOverlay
                v-model:active="currentFontSize"
                :optionList="changeFountSizeList"
            />
        </template>
    </a-dropdown>
</template>

<script setup lang="ts" name="ChangeTableFontSize">
    import SvgIcon from '@/components/SvgIcon/index.vue';

    import TpfDropdownOverlay from '@/components/TpfDropdown/TpfDropdownOverlay.vue';
    import { useVModel } from '@vueuse/core';

    const changeFountSizeList = [
        { type: '标准', icon: 'icon-biaozhunziti', key: 14 },
        { type: '较大', icon: 'icon-jiaodaziti', key: 18 }
    ];

    type Props = {
        fontSize: 14 | 18;
    };

    const props = defineProps<Props>();

    const emit = defineEmits<{
        (e: 'update:fontSize', val: string): void;
    }>();

    const currentFontSize = useVModel(props, 'fontSize', emit);
</script>

<style lang="less" scoped></style>
