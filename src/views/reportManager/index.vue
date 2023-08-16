<template>
    <iframe :src="panelSrc" frameborder="0" height="100%" width="100%"></iframe>
</template>

<script setup lang="tsx">
    import { useDataEaseApi } from '@/api';
    import { onMounted, ref } from 'vue';

    const dataEaseApi = useDataEaseApi();

    type Props = {
        panel: string;
    };

    const props = defineProps<Props>();
    const panelSrc = ref('');

    const getPanelSrc = async () => {
        panelSrc.value = await dataEaseApi
            .getPanelSrc(props.panel, {
                required: true,
                redirect: false
            })
            .then(res => res.data.value);
    };

    onMounted(() => {
        getPanelSrc();
    });
</script>
