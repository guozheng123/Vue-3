<template>
    <div class="gutter-example">
        <img class="example-pic" :src="pic01" alt="" v-if="userId === 24401489362945" />
        <img class="example-pic" :src="pic02" alt="" v-else-if="userId === 24401449517057" />
        <img class="example-pic" :src="pic03" alt="" v-else-if="userId === 24401405476865" />
        <!-- <template v-else>
            <Base />
            <Work />
            <Charts />
        </template> -->
        <img :src="sjqjbg" alt="" class="t-h-full t-w-full" v-else />
        <!-- <Base />
        <Work />
        <Charts /> -->
    </div>
</template>

<script setup lang="ts">
    import { defineAsyncComponent } from 'vue';
    import pic03 from '@/assets/images/03.jpg';
    import pic01 from '@/assets/images/01.jpg';
    import pic02 from '@/assets/images/02.jpg';
    import { useStore } from '@/store';
    import { storeToRefs } from 'pinia';
    import { computed } from 'vue';

    const { userStore } = useStore();

    const Work = defineAsyncComponent(() => import('./components/Work.vue'));
    const Base = defineAsyncComponent(() => import('./components/Base.vue'));
    const Charts = defineAsyncComponent(() => import('./components/Charts.vue'));

    const { userInfo } = storeToRefs(userStore);
    const userId = computed(() => userInfo.value.tpfUser.userId);
    /**
     *     const userInfoList = [
                { userId: 24215994171393, list: user1, color: '#e42807' },
                { userId: 24215966908417, list: user2, color: '#cb7d25' },
                { userId: 24215805427713, list: user3, color: '#17d97e' },
                { userId: 24215723638785, list: user4, color: '#2309ec' }
            ];
     */
    import sjqjbg from '@/assets/images/sjqjbg.jpg';
    // import { defineAsyncComponent } from 'vue';

    // const Work = defineAsyncComponent(() => import('./components/Work.vue'));
    // const Base = defineAsyncComponent(() => import('./components/Base.vue'));
    // const Charts = defineAsyncComponent(() => import('./components/Charts.vue'));
</script>

<style lang="less" scoped>
    .gutter-example {
        // margin: 20px;
        .example-pic {
            width: 100%;
        }
        padding: 10px 12px;
        // margin: 20px;
    }
</style>
