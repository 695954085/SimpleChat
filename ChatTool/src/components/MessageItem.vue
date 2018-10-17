<template>
  <div class="messageItem">
    <div :class="'chatTool-message-list-time-'+direction">{{content.username}}({{content.date}})</div>
    <div :class="'chatTool-message-container-'+direction">
      <span class="chatTool-message-triangle-left" v-if="showPrise1"></span>
      <div :class="'chatTool-message-article-'+direction">{{resolveT2E}}</div>
      <span class="chatTool-message-triangle-right" v-if="showPrise2"></span>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import emotionparse from "../assets/js/emotionparse";

export default {
  name: "MessageItem",
  props: ["content"],
  data() {
    return {
      showPrise1: false,
      showPrise2: false,
      resolveT2E: ""
    };
  },
  computed: {
    ...mapState(["userName"]),
    direction() {
      return this.content.username === this.userName ? "right" : "left";
    }
  },
  mounted: function() {
    if (this.direction === "left") {
      this.showPrise1 = true;
    } else {
      this.showPrise2 = true;
    }
    this.resolveT2E = emotionparse.resolveTextToEmotion(content.value);
  }
};
</script>

<style lang="scss" scoped>
/* 消息窗口 begin*/
.messageItem {
  display: block;
  left: 0;
  margin: 0 auto;
  overflow-x: hidden;
  .chatTool-message-container-left {
    @include messagequeue(left);
  }
  .chatTool-message-container-right {
    @include messagequeue(right);
  }
  .chatTool-message-list-time-left {
    font-size: 0.8rem;
    padding: 10px 0 6px 30px;
    text-align: left;
  }
  .chatTool-message-list-time-right {
    font-size: 0.8rem;
    padding: 10px 30px 6px 0;
    text-align: right;
  }
}
/* 消息窗口 end*/
</style>
