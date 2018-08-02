import axios from 'axios'
import store from '../store/store'
import router from '../router'
import config from '../config'

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
          store.commit('del_token');
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

export const login = params => axios.post(`${config.IP}:${config.PORT}/v1/login`, params);

export const register = params => axios.post(`${config.IP}:${config.PORT}/v1/user`, params);

