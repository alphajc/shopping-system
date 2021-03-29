import { createApp } from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

import App from './App.vue'

import installElementPlus from './plugins/element'
import router from './router'
import store from './store'

const app = createApp(App).use(store).use(router).use(VueAxios, axios)
installElementPlus(app)
app.mount('#app')