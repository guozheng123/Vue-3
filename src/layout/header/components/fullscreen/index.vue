<template>
    <ATooltip placement="bottom" color="black">
        <template #title>
            <span>{{ getTitle }}</span>
        </template>
        <span @click="toggle" class="menu-fold">
            <SvgIcon size="24" :type="isFullscreen ? 'icon-quanping' : 'icon-quanping'" shadow />
        </span>
    </ATooltip>
</template>

<script lang="ts" setup>
    import { computed, unref } from 'vue';
    import { useFullscreen } from '@vueuse/core';

    import { useI18n } from '@/hooks/useI18n';
    import SvgIcon from '@/components/SvgIcon/index.vue';

    const { t } = useI18n();
    const { toggle, isFullscreen } = useFullscreen();

    const getTitle = computed(() => {
        return unref(isFullscreen)
            ? t('layout.header.tooltipExitFull')
            : t('layout.header.tooltipEntryFull');
    });
</script>
