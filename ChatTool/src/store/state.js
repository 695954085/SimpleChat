export default {
  userId: '',
  userName: 'MrDefault',
  token: '',
  groupLists: [],//用户的组群信息(包括name,id,mumber,onlineMumber?,最新的一条message)
  currentGroupName: '群聊大厅',//群聊大厅默认群名
  currentGroupId: '',//all_public_connect默认路由跳转进大厅
  currentGroupMumber: [{
    id: "defult",
    name: "default"
  }],
  currentMessageList: [],//存储当前的群的所有消息,
  //ps:几个current后绪考虑合并成一个对象
  loginState: false,
}
