<template>
    <div class="tpf-logo">
        <img src="/images/sjqj2.jpg" alt="" />

        <!-- <img src="~@/assets/images/logo.png" alt="" /> -->
    </div>
</template>

<script setup lang="ts" name="Logo">
    import { useStore } from '@/store';
    import { storeToRefs } from 'pinia';
    import { computed } from 'vue';

    const { userStore } = useStore();
    const { loginInfo } = storeToRefs(userStore);

    const isMock = computed(() => {
        return [24401489362945, 24401449517057, 24401405476865, 24401359339521].includes(
            loginInfo.value.userId as any
        );
    });
</script>

<style lang="less" scoped>
    .tpf-logo {
        overflow: hidden;
        white-space: nowrap;
        width: 180px;

        img {
            // height: 100%;
            width: 80%;
            margin: 0 auto;
            text-align: center;
            vertical-align: middle;
            margin-left: 10%;
        }
    }
</style>
