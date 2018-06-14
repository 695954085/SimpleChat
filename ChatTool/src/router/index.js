import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import ChatPanel from '@/components/ChatPanel'
import Container from '@/components/Container'
import MessageItem from '@/components/MessageItem'

// import Vuex from 'vuex'
// import store from './../store/store'


Vue.use(Router)

const router = new Router({
  routes: [{
      path: '/',
      component: Main
    },
    {
      path: '/login',
      component: Main
    },
    {
      path: '/chatpanel',
      component: ChatPanel,
      name: '',
      hidden: true
    },
    {
      path: '/chat',
      meta: {
        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      },
      component: Container,
      name: '',
      hidden: true,
      children: [{
        path: '/chat/*',
        component: ChatPanel,
        name: '',
        hidden: true
      }, ]
    },
    {
      path: '/messageitem',
      component: MessageItem,
      name: '',
      hidden: true,
    }

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
