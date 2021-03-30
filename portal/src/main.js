import { createApp } from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';

import App from './App.vue';

import installElementPlus from './plugins/element';
import router from './router';
import store from './store';

const token = localStorage.getItem('user-token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const app = createApp(App).use(store).use(router).use(VueAxios, axios);
installElementPlus(app);
app.mount('#app');
