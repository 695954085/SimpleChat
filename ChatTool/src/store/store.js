import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userId: '',
    userName: 'MrDefault',
    token: '',
    groupLists:[],//用户的组群信息(包括name,id,mumber,onlineMumber?,最新的一条message)
    currentGroupName: '群聊大厅',//群聊大厅默认群名
    currentGroupId: '',//all_public_connect默认路由跳转进大厅
    currentGroupMumber: [{
      id: "defult",
      name: "default"
    }],
    currentMessageList:[],//存储当前的群的所有消息,
    //ps:几个current后绪考虑合并成一个对象
    loginState: false,
  },
  //修改多个state用mutations,触发方法($store.commit('set_token'))
  mutations: {
    set_token(state, token) { //这里的state对应着上面这个state
      state.token = token;
      sessionStorage.token = token;
      //你还可以在这里执行其他的操作改变state
    },
    del_token(state, token) {
      state.token = '';
      //登录时创建了"大厅"这个组，登出时要删掉
      state.groupLists= [];
      state.currentGroupId = '';
      sessionStorage.removeItem("token");
    },
  },
  //修改多个mutations用actions,触发方法($store.dispatch('handle_token'))
  actions: {
    handle_token(context) { //这里的context和我们使用的$store拥有相同的对象和方法
      context.commit('set_token');
      //你还可以在这里触发其他的mutations方法
    },
  }
})

export default store
