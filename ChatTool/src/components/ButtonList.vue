
<template>
  <ul class="chat-container-buttonList">
    <li class="component-iconButton" style="width: 40px; height: 40px;" @click="handleLoginOut">
      <i class="icon iconfont  el-icon-power-power" style="font-size: 26px; line-height: 40px;"></i>
    </li>
  </ul>
</template>
<script>
import { signOut } from "@/api";
import { mapState, mapMutations } from "vuex";
export default {
  name: "ButtonList",
  data() {
    return {};
  },
  methods: {
    ...mapMutations(["clearData"]),
    async handleLoginOut() {
      let params = new URLSearchParams()
      params.append('username', this.userName)
      try {
        let respnse = await signOut(params);
        let { data, status } = respnse;
        if (status !== 200) {
          throw "登出失败";
        }
        let { message } = data;
        this.$message({
          type: "success",
          message: message
        });
        this.clearData();
        this.$router.push("/");
      } catch (err) {
        this.$message({
          message: err.message || "登出失败",
          type: 'error'
        });
      }
    }
  },
  computed: {
    ...mapState(["userName"])
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



