import echarts from './echartsCore';

import { nextTick, onMounted, onUnmounted, unref, ref } from 'vue';
// import * as echarts from 'echarts';
import type { ECBasicOption } from 'echarts/types/dist/shared';

export type UseChartType = {
    autoChartSize?: boolean;
    animation?: boolean;
};

export function useChart({ autoChartSize = true, animation = true }: UseChartType = {}) {
    const target = ref<HTMLDivElement | null>(null);
    // 渲染模式
    // echart实例
    let chartInstance: echarts.ECharts | null = null;

    // 初始化echart
    const initCharts = () => {
        const el = unref(target) as HTMLElement;
        if (!el || !unref(el)) {
            return;
        }
        chartInstance = echarts.init(el, { renderer: 'svg' });
    };

    // 更新/设置配置
    const setOption = (option: ECBasicOption, notMerge = false, lazyUpdate = false) => {
        nextTick(() => {
            if (!chartInstance) {
                initCharts();
                if (!chartInstance) return;
            }

            chartInstance.setOption(option, notMerge, lazyUpdate);
            hideLoading();
        });
    };

    // 获取echart实例
    function getInstance(): echarts.ECharts | null {
        if (!chartInstance) {
            initCharts();
        }
        return chartInstance;
    }

    // 更新大小
    function resize() {
        chartInstance?.resize();
    }

    // 监听元素大小
    function watchEl() {
        // 给元素添加过渡
        if (animation) {
            target.value && (target.value.style.transition = 'width 1s, height 1s');
        }
        const resizeObserver = new ResizeObserver(entries => resize());
        target.value && resizeObserver.observe(target.value as Element);
    }

    // 显示加载状
    function showLoading() {
        if (!chartInstance) {
            initCharts();
        }
        chartInstance?.showLoading();
    }
    // 显示加载状
    function hideLoading() {
        if (!chartInstance) {
            initCharts();
        }
        chartInstance?.hideLoading();
    }

    onMounted(() => {
        window.addEventListener('resize', resize);
        if (autoChartSize) watchEl();
    });

    onUnmounted(() => {
        window.removeEventListener('resize', resize);
    });

    return {
        target,
        setOption,
        getInstance,
        showLoading,
        hideLoading,
        echarts
    };
}
