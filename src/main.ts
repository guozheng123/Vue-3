import { createApp } from 'vue';
import router, { setupRouter } from '@/router';
import { setupStore } from '@/store';
import { closeGlobalLoading } from '@/hooks';
import App from '@/App.vue';
import 'animate.css';
import '@/assets/css/style.less';
import 'nprogress/nprogress.css'; // 注意要引入css样式文件
import 'virtual:svg-icons-register';

import useDirectives from '@/directives';
import useComponents from '@/components/index';
import { setupI18n } from './locales';
import { disAutoConnect } from 'vue-plugin-hiprint';

disAutoConnect();
// import FormEditorPlugin from '@/FormEditorPlugin';

const app = createApp(App);

console.log(`======当前后端域名：${import.meta.env.VITE_APP_API_ROOT} ===========`);

async function setupApp() {
    // app.use(useVxeTable);
    app.use(useComponents);
    app.use(useDirectives);
    // app.use(FormEditorPlugin);

    app.use(router);
    // 挂载vuex状态管理
    setupStore(app);
    // Multilingual configuration
    // Asynchronous case: language files may be obtained from the server si
    setupI18n(app);
    // 挂载路由
    await setupRouter(app);

    app.mount('#app');
    closeGlobalLoading();
}

// app.mount('#app');
setupApp();
