// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';


import Vuex from 'vuex'
import store from './store/store'
//import axios from 'axios'
import axios from './axios/http'


import ElementUI from 'element-ui';
//import 'element-ui/lib/theme-chalk/index.css';
import './assets/theme/theme-green/index.css'

Vue.config.productionTip = false

Vue.use(ElementUI);

Vue.prototype.$http = axios;

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
