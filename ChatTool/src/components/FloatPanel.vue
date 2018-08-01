
<template>
    <div class="chat-float-panel">
        <p>群组信息</p>
        <div>
          <div class="chat-float-panel-feature">
              <p>功能</p>
              <el-button type="danger" plain @click="exitGroup">退出群组</el-button>
          </div>
          <div class="chat-float-panel-online">
              <p>在线成员</p>
              <ul class="module-online-mumber">
                <li  v-for="(mumberItem,index) in mumberLists"
                 :key="mumberItem.id"
                 :mumberIndex="index">
                    <img class="chat-float-mumber-avatar" :src="mumberItem.avatar"/>
                    <p class="chat-float-mumber-name">{{mumberItem.name}}</p>
                </li>
              </ul>
          </div>
        </div>
    </div>
</template>
<script>
export default {
  name: "FloatPanel",
  props:["mumberLists"],
  data() {
    return {};
  },
  methods: {
    exitGroup() {
      alert("exitGroup");
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



