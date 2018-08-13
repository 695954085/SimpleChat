<template>
  <div class="chatPanel-linkman-group">
    <div class="module-main-feature-linkman" v-for="(groupItem,index) in groupLists" :key="groupItem.roomId" :class="{ 'linkman-select': index === selectedIndex }" @click="groupClick(index)">
      <img class="component-avatar " src="../assets/defaultAvatar.jpg">
      <div class="top-bottom">
        <div class="name-time">
          <p class="name">{{groupItem.roomId}}</p>
          <p class="time"></p>
        </div>
        <div class="preview-unread">
          <p class="preview"></p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      selectedIndex: 0
    };
  },
  computed: {
    ...mapState(["groupLists"])
  },
  methods: {
    groupClick(index) {
      // 需要判断是够已经加入此群？？？ 但是如何判断是够已经加入呢？
      try {
        //1. 创建房间
        this.$socket.emit("createRoom", this.groupLists[index].roomId, val => {
          // 2. 房间创建成功
          let { message, error } = val;
          if (error == 1) {
            this.$message({
              message: err.message || "房间创建异常",
              type: "error"
            });
          } else {
            this.$message({
              message: message,
              type: "success"
            });
            this.$router.push({ path: "/" + this.groupLists[index].roomId });
            this.selectedIndex = index;
          }
        });
      } catch (err) {}
    }
  }
};
</script>
<style lang="scss" scoped>
//联系人列表(LinkMan)
.chatPanel-linkman-group {
  -ms-flex: 1;
  flex: 1;
  overflow-y: auto;
}
.module-main-feature-linkman {
  height: 60px;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  padding: 10px 16px;
  cursor: default;
  transition: background-color 0.2s;
  &:hover {
    background-color: $theme-color;
  }
  .component-avatar {
    width: 48px;
    height: 48px;
    border-radius: 24px;
  }
  .top-bottom {
    -ms-flex: 1;
    flex: 1;
    margin-left: 12px;
    .name-time {
      margin-top: 4px;
      display: flex;
      -ms-flex-pack: justify;
      justify-content: space-between;
      .name {
        font-size: 14px;
      }
      .time {
        font-size: 12px;
      }
    }
    .preview-unread {
      margin-top: 6px;
      display: flex;
      justify-content: space-between;
      .preview {
        color: #aaa;
        font-size: 12px;
        width: 188px;
        height: 20px;
        line-height: 20px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: left;
      }
    }
  }
}
.linkman-select {
  background-color: $theme-color-heavry;
}
</style>
