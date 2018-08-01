import Vue from 'vue'
import Router from 'vue-router'
import ChatPanel from '@/components/ChatPanel'
import MessageItem from '@/components/MessageItem'

import Main from '@/components/Main'

// import Vuex from 'vuex'
// import store from './../store/store'


Vue.use(Router)

// 页面刷新时，重新赋值token
// if (sessionStorage.getItem('token')) {
//   this.$store.commit('set_token', sessionStorage.getItem('token'))
// }


const router = new Router({
  routes: [{
      path: '/',
      component: Main,
      children: [{
        path: '/*',
        component: ChatPanel,
        name: '',
        hidden: false
      }, ]
    },
    {
      path: '/Main',
      component: Main,
      data: function () {
        return {
          isLogin:true,
        }
      }
    },
    {
      path: '/chatpanel',
      component: ChatPanel,
      name: '',
      hidden: true
    },
    {
      path: '/messageitem',
      component: MessageItem,
      name: '',
      hidden: true,
    },
  ]
});
// router.beforeEach((to, from, next) => {
//   console.log(router.app.$options.store);
//   let $store = router.app.$options.store;
//   if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
//     if ($store.state.token) { // 通过vuex state获取当前的token是否存在
//       next();
//     } else {
//       next({
//         path: '/login',
//         // 将跳转的路由path作为参数，登录成功后跳转到该路由
//         // query: {
//         //   redirect: to.fullPath
//         // }
//       })
//     }
//   } else {
//     next();
//   }
// });

export default router
