import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useStore } from '@/store';

export const useCheckNewVision = () => {
    const { userStore } = useStore();

    const timeId = ref(-1);

    const getVerSion = () => {
        clearInterval(timeId.value);
        timeId.value = window.setTimeout(async () => {
            await userStore.getVisionInfo();
            getVerSion();
        }, 1000 * 60 * 2);
    };

    onMounted(async () => {
        await userStore.getVisionInfo();
        getVerSion();
    });

    onBeforeUnmount(() => {
        clearInterval(timeId.value);
    });
};
