import { ref, onUnmounted } from 'vue';
// 定时器
/**
 *
 * @param gapTime 间隔事件
 * @returns
 */
export const useInterval = (gapTime = 1000) => {
    const timerId = ref(-1);
    const stopInterval = () => {
        clearInterval(timerId.value);
    };
    const startInterval = (api: () => void) => {
        stopInterval();
        timerId.value = window.setInterval(() => {
            api();
        }, gapTime);
        return stopInterval;
    };
    onUnmounted(() => {
        stopInterval();
    });
    return { startInterval, stopInterval };
};
