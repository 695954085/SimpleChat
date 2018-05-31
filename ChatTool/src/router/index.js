import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Main from '@/components/Main'
import ChatPanel from '@/components/ChatPanel'
import Container from '@/components/Container'
import MessageItem from '@/components/MessageItem'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      component: Main
    },
    {
      path: '/helloworld',
      component: HelloWorld,
      name: '',
      hidden: true
    },
    {
      path: '/chatpanel',
      component: ChatPanel,
      name: '',
      hidden: true
    },
    {
      path: '/chat',
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
      component:MessageItem,
      name: '',
      hidden: true,
    }

  ]
})
