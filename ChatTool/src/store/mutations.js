import Vue from 'vue'
export default {
  set_token(state, token) { //这里的state对应着上面这个state
    state.token = token;
    sessionStorage.token = token;
    //你还可以在这里执行其他的操作改变state
  },
  del_token(state, token) {
    state.token = '';
    //登录时创建了"大厅"这个组，登出时要删掉
    state.groupLists = [];
    state.currentGroupId = '';
    sessionStorage.removeItem("token");
  },
  set_user(state, payload) {
    state.userName = payload.userName
    state.userId = payload.id
    state.loginState = true
  },
  addGroup(state, payload) {
    state.groupLists.push(payload)
  },
  addConversation(state, payload) {
    for (let groupItem of state.groupLists) {
      if (groupItem.roomId === payload.roomId) {
        if (!groupItem.conversation) Vue.set(groupItem, 'conversation', new Array())
        if (payload.val) groupItem.conversation.push(payload.val)
        break
      }
    }
  }
}
