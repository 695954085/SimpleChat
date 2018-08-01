
<template>
  <ul class="chat-container-buttonList">
    <li class="component-iconButton" style="width: 40px; height: 40px;" @click="handleLoginOut">
      <i class="icon iconfont  el-icon-power-power" style="font-size: 26px; line-height: 40px;"></i>
    </li>
  </ul>
</template>
<script>
export default {
  name: "ButtonList",
  data() {
    return {};
  },
  methods: {
    handleLoginOut() {
      this.$http({
        url: `http://127.0.0.1:3000/v1/signout`,
        method: "post",
        data: this.$store.state.userName
      })
        .then(res => {
          console.log(res);
          if (res.status === 200) {
            //删除token,清除sessionstorage,路由置回登录界面,并把登录状态设置为false
            $store.commit('del_token');
            this.$router.push({path:""});
            this.$store.state.loginState = false;
          }
        })
        .catch(res => {
          console.log("登出错误: ", res);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
ul.chat-container-buttonList {
  list-style-type: none;
  li {
    cursor: pointer;
  }
}
</style>



