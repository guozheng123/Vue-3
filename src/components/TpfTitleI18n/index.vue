<template>
    <i18n-t tag="span" :keypath="getTitle" scope="global" />
</template>

<script setup lang="ts" name="TpfTitleI18n">
    import { type PropType, computed } from 'vue';
    import { useLocaleStore } from '@/store/modules/locale';

    const props = defineProps({
        title: {
            type: [String, Object] as PropType<string | any>,
            required: true,
            default: ''
        }
    });

    const localeStore = useLocaleStore();

    const getTitle = computed(() => {
        const { title = '' } = props;
        if (typeof title === 'object') {
            return title?.[localeStore.locale] ?? title;
        }
        return title;
    });
</script>
