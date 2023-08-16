<template>
    <component :is="currentCom" :key="code" />
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import Login1 from './Login1.vue';
    import Login2 from './Login2.vue';
    import Login3 from './Login3.vue';
    import Login4 from './Login4.vue';
    import { useRouteBase64, useRouteQuery } from '@/hooks';
    const { code } = useRouteQuery<{ code: string }>();
    const { encodeParams } = useRouteBase64();
    console.log(encodeParams({ code: '10000002136' }));
    console.log('code: ', code);
    const comList = {
        '10000002135': Login1,
        '10000002136': Login2,
        '10000002137': Login3,
        '10000002138': Login4
    };

    const currentCom = computed(() => {
        return comList[code] || Login1;
    });
</script>
