// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';

import store from './store/store'

import VueSocketio from 'vue-socket.io'

import ElementUI from 'element-ui'
import './assets/theme/theme-default/index.css'
import './assets/theme/font/iconfont.css'

Vue.config.productionTip = false;

Vue.use(VueSocketio, '127.0.0.1:3000');
// Vue.use(VueSocketio, socketio('127.0.0.1:3000'), store);

Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
