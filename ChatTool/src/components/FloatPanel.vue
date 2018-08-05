<template>
  <div class="chat-float-panel">
    <p>群组信息</p>
    <div>
      <div class="chat-float-panel-feature">
        <p>功能</p>
        <el-button type="danger" plain @click="deleteRoom">退出群组</el-button>
      </div>
      <div class="chat-float-panel-online">
        <p>在线成员</p>
        <ul class="module-online-mumber">
          <li v-for="member in members" :key="member.sid">
            <img class="chat-float-mumber-avatar" />
            <p class="chat-float-mumber-name">{{member.username}}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "FloatPanel",
  props: ["roomId"],
  methods: {
    ...mapMutations(["deleteGroup"]),
    deleteRoom() {
      this.$socket.emit("deleteRoom", this.roomId, val => {
        let { error, message } = val;
        if (error === 0) {
          this.$message({
            message: message,
            type: "error"
          });
        } else {
          this.$message({
            message: message,
            type: "success"
          });
          // 删除group
          this.deleteGroup(this.roomId);
          // 跳转路由
          this.$router.push("/all_public_connect");
        }
      });
    }
  },
  computed: {
    ...mapGetters(["getCurrentGroup"]),
    members() {
      if (this.getCurrentGroup(this.roomId))
        return this.getCurrentGroup(this.roomId).onlineClients;
      return null;
    }
  }
};
</script>
<style lang="scss" scoped>
.chat-float-panel {
  transform: translateX(0);
  height: 100%;
  width: 300px;
  position: absolute;
  right: 0;
  top: 0;
  background-color: hsla(0, 0%, 98%, 0.95);
  flex-direction: column;
  transition: transform 0.5s;
  & > p {
    display: flex;
    color: $font-color;
    font-weight: 700;
    border-bottom: 1px solid #d3d3d3;
    text-align: center;
    align-items: center;
    height: 60px;
    justify-content: center;
  }
  .chat-float-panel-feature {
    p {
      @include chatPanelTitleStyle;
    }
  }
  .chat-float-panel-online {
    p {
      @include chatPanelTitleStyle;
    }
    ul.module-online-mumber {
      list-style-type: none;
      li {
        padding-left: 10px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .chat-float-mumber-avatar {
          width: 24px;
          height: 24px;
          border-radius: 12px;
        }
      }
    }
  }
}
</style>



