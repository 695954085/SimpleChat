import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const store = new Vuex.Store({
  state,
  mutations,
  //修改多个mutations用actions,触发方法($store.dispatch('handle_token'))
  actions
})

export default store
