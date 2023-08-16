import { mergeConfig, loadEnv } from 'vite';
import eslint from 'vite-plugin-eslint';
import { viteMockServe } from 'vite-plugin-mock';
import baseConfig from './vite.config.base';
import { include, exclude } from './plugin/optimize';

export default ({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return mergeConfig(
        {
            mode: 'development',
            server: {
                proxy: {
                    '/api': {
                        target: env.VITE_APP_API_ROOT,
                        changeOrigin: true,
                        ws: true,
                        rewrite: path => path.replace('/api', '')
                    }
                },
                open: true,
                port: 8099,
                host: '0.0.0.0',
                hmr: {
                    overlay: false
                },
                fs: {
                    strict: true
                }
            },
            optimizeDeps: { include, exclude },
            plugins: [
                viteMockServe({
                    localEnabled:
                        env.VITE_NODE_ENV === 'development' && env.VITE_APP_USE_MOCK === 'true',
                    supportTs: true
                }),
                eslint({
                    cache: false,
                    include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
                    exclude: ['node_modules']
                })
            ]
        },
        baseConfig
    );
};
