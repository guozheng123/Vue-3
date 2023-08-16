import { App } from 'vue';
import './css/style.css';
import PrintOperate from './components/print-operate';
import PrintCore from './components/print-core';

export default {
    install: (app: App) => {
        app.component('PrintOperate', PrintOperate);
        app.component('PrintCore', PrintCore);
    }
};
