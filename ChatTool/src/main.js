// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';


import Vuex from 'vuex'
import store from './store/store'

import axios from 'axios'
//import axios from './axios/http'

import VueSocketio from 'vue-socket.io'
//import socketio from 'socket.io-client'

import ElementUI from 'element-ui'
import './assets/theme/theme-default/index.css'
import './assets/theme/font/iconfont.css'

Vue.config.productionTip = false;

Vue.use(VueSocketio, '127.0.0.1:3000');
//Vue.use(VueSocketio, socketio('127.0.0.1:3000'), store);

Vue.use(ElementUI);

Vue.prototype.$http = axios;
// 添加请求拦截器
axios.interceptors.request.use(config => {
  //判断是否存在token，如果存在将每个请求header都添加token
  if (store.state.token) {
    config.headers.common['Authentication'] = 'bearer ' + store.state.token;
  }

  return config;
}, error => {
  // 对请求错误做些什么
  return Promise.reject(error);
});
// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          this.$store.commit('del_token');
          router.replace({
            path: '/login',
            query: {
              redirect: router.currentRoute.fullPath
            } //登录成功后跳入浏览的当前页面
          })
      }
    }
    return Promise.reject(error.response.data)
  });

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
