<template>
    <div class="login-box">
        <a-spin size="large" />
    </div>
</template>

<script setup lang="ts">
    import { useStore } from '@/store/index';
    import { onMounted } from 'vue';

    const { userStore } = useStore();

    onMounted(() => {
        userStore.$reset();
        userStore.login();
    });
</script>

<style lang="less" scoped>
    .login-box {
        height: 100vh;
        width: 100vw;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>
