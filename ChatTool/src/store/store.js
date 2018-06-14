import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 定义状态
  state: {
    userId: '',
    userName: 'MrWrong',
    currentGroupName: 'groupName',
    currentGroupMumber: [{
      id: "defult",
      name: "default"
    }],
    token: '',
  },
  //修改多个state用mutations,触发方法($store.commit('handle_token'))
  mutations: {
    handle_token(state) { //这里的state对应着上面这个state
      state.token = "1234567890";
      //你还可以在这里执行其他的操作改变state
    }
  },
  //修改多个mutations用actions,触发方法($store.dispatch('handle_token'))
  actions: {
    handle_token(context) { //这里的context和我们使用的$store拥有相同的对象和方法
      context.commit('handle_token');
      //你还可以在这里触发其他的mutations方法
    },
  }
})

export default store
