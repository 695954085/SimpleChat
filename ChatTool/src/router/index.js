import Vue from 'vue'
import Router from 'vue-router'
import ChatPanel from '@/components/ChatPanel'
import MessageItem from '@/components/MessageItem'

import Main from '@/components/Main'

Vue.use(Router)

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

export default router
