<template>
  <div class="messageItem">
    <div :class="'chatTool-message-list-time-'+direction">{{sourceName}}({{time}})</div>
    <div :class="'chatTool-message-container-'+direction">
      <span class="chatTool-message-triangle-left" v-if="showPrise1"></span>
      <div :class="'chatTool-message-article-'+direction">{{sendContent}}</div>
      <span class="chatTool-message-triangle-right" v-if="showPrise2"></span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MessageItem',
  props:["sourceName","time","sendContent","direction"],
  data() {
    return {
      showPrise1: false,
      showPrise2: false,
    }
  },
  method: {

  },
  computed: {

  },
  mounted: function() {
    if (this.direction === "left") {
      this.showPrise1 = true;
    } else {
      this.showPrise2 = true;
    }
  }
}
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
    font-size: .8rem;
    padding: 10px 0 6px 30px;
    text-align: left;
  }
  .chatTool-message-list-time-right {
    font-size: .8rem;
    padding: 10px 30px 6px 0;
    text-align: right;
  }
}
/* 消息窗口 end*/
</style>
