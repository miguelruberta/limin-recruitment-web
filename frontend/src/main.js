import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router/index.js';
import './assets/base.css';
import './assets/tokens.css';

createApp(App).use(createPinia()).use(router).mount('#app');