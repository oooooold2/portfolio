import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import 'ant-design-vue/dist/reset.css';
import Antd from 'ant-design-vue';
import AppWrapper from './AppWrapper.vue';
import router from './router';

const app = createApp(AppWrapper);

app.use(Antd);
app.use(createPinia());
app.use(router);

app.mount('#app');
