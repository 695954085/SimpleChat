
<template>
<div class="chatPanel-linkman-group">
  <div class="module-main-feature-linkman"
   v-for="(groupItem,index) in groupLists" :key="groupItem.id"
   :groupIndex="index"
   :class="{ 'linkman-select': index === selected }"
   @click="groupClick(index)">
      <img class="component-avatar " src="../assets/defaultAvatar.jpg">
      <div class="top-bottom">
          <div class="name-time">
              <p class="name">{{groupItem.name}}</p>
              <p class="time">{{groupItem.message.time}}</p>
          </div>
          <div class="preview-unread">
              <p class="preview">{{groupItem.message.value}}</p>
          </div>
      </div>
  </div>
  </div>
</template>
<script>
export default {
  name: "LinkMan",
  props: ["groupLists", "activeId"],
  data() {
    return {
      selected: null
    };
  },
  methods: {
    groupClick(index) {
      this.$store.state.currentGroupName = this.groupLists[index].name;
      this.$store.state.currentGroupMumber = this.groupLists[index].mumber;
      this.$store.state.currentGroupId = this.groupLists[index].id;
      alert(this.$store.state.currentGroupId);
      // this.$socket.emit("createRoom", this.groupId, data => {
      //   console.log("createRoom");
      // });
      this.$router.push({ path: "/" + this.groupLists[index].id });
      this.selected = index;
    }
  },
  watch: {
    activeId: function(newVal, oldVal) {
      this.groupLists.forEach((item, index) => {
        if (item.id === newVal) {
          this.selected = index;
        }
      });
      console.log("new: %s, old: %s", val, oldVal);
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



