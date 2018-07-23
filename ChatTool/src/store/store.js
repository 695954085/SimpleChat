import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 定义状态
  state: {
    userId: '',
    userName: 'MrDefault',
    currentGroupName: '所有用户',
    currentGroupId: '',
    currentGroupMumber: [{
      id: "defult",
      name: "default"
    }],
    token: '',
    // connect: false,
    // message: null
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
      sessionStorage.removeItem("token");
    },
    // SOCKET_CONNECT: (state, status) => {
    //   state.connect = true;
    // },
    // SOCKET_USER_MESSAGE: (state, message) => {
    //   state.message = message;
    // }
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
