
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
  methods:{
    handleLoginOut(){
      alert("loginOut");
    }
  }
};
</script>
<style lang="scss" scoped>
ul.chat-container-buttonList{
  list-style-type: none;
  li{
    cursor:pointer;
  }
}
</style>



