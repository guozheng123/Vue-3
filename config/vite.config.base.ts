import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { createStyleImportPlugin } from 'vite-plugin-style-import';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
import { createHtmlPlugin } from 'vite-plugin-html';
// import topLevelAwait from 'vite-plugin-top-level-await';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import viteCompression from 'vite-plugin-compression';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import pck from '../package.json';
import './plugin/checkUpdate';

const { resolve } = path;

export default defineConfig({
    plugins: [
        vue({ script: { defineModel: true } }),
        vueJsx(),
        createSvgIconsPlugin({
            // 指定需要缓存的图标文件夹
            iconDirs: [path.resolve(process.cwd(), 'src/assets/svg/')],
            // 指定symbolId格式
            symbolId: '[name]'
        }),
        // topLevelAwait({
        //     // The export name of top-level await promise for each chunk module
        //     promiseExportName: '__tla',
        //     // The function to generate import names of top-level await promise in each chunk module
        //     promiseImportName: i => `__tla_${i}`
        // }),

        vueSetupExtend(),
        createStyleImportPlugin({ resolves: [] }),
        Components({
            deep: false,
            dirs: [''],
            dts: 'src/types/components.d.ts',
            include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
            resolvers: [
                AntDesignVueResolver({
                    importStyle: false
                })
            ]
        }),
        viteCompression({
            verbose: true, // 默认即可
            disable: false, //开启压缩(不禁用)，默认即可
            deleteOriginFile: false, //删除源文件
            threshold: 10240, //压缩前最小文件大小
            algorithm: 'gzip', //压缩算法
            ext: '.gz' //文件类型
        }),
        // svgLoader({ svgoConfig: {} })
        createHtmlPlugin({
            minify: true,
            inject: {
                data: {
                    buildTime: new Date().toLocaleString(),
                    version: pck.version,
                    appName: pck.name
                }
            }
        })
    ],
    resolve: {
        alias: [
            {
                find: '@',
                replacement: resolve(__dirname, '../src')
            },
            {
                find: 'vue',
                replacement: 'vue/dist/vue.esm-bundler.js' // compile template
            }
        ],
        extensions: ['.ts', '.js', '.jsx', '.tsx']
    },
    define: {
        'process.env': {}
    },
    css: {
        postcss: {
            plugins: [autoprefixer(), tailwindcss()] as any[]
        },
        preprocessorOptions: {
            less: {
                modifyVars: {
                    hack: `true; @import (reference) "${resolve(
                        './src/assets/css/breakpoint.less'
                    )}";`
                },
                javascriptEnabled: true
            }
        }
    }
});
