import { mergeConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import baseConfig from './vite.config.base';

export default mergeConfig(
    {
        mode: 'production',
        plugins: [visualizer({ open: false, gzipSize: true, brotliSize: true })],
        build: {
            minify: 'terser',
            rollupOptions: {
                output: {
                    manualChunks: {
                        ui: ['ant-design-vue'],
                        echarts: ['echarts'],
                        antv: ['@antv/x6-vue-shape', '@antv/x6'],
                        vue: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
                        print: ['vue-plugin-hiprint', 'print-js']
                    }
                }
            },
            terserOptions: {
                compress: {
                    // drop_console: true,
                    // 默认是true
                    drop_debugger: true
                }
            },
            chunkSizeWarningLimit: 2000,
            sourcemap: false,
            reportCompressedSize: false
        }
    },
    baseConfig
);
