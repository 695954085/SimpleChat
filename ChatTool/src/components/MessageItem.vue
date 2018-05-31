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
      // direction: "left",
      // sourceName: "机器人",
      // time: "20180531",
      // sendContent: "哈哈哈",
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

$color-green: #1AAD19;
$font-color: #333;
$send-button-color:#F57623;

@mixin chatTool-message-triangle {
  color: $font-color;
  word-break: break-all;
  margin-bottom: 5px;
  padding: 5px 10px;
  border: 1px solid #E3E3E3;
  background: #F1F1F1;
  border-radius: 5px;
  background-color: #E3E3E3;
}

@mixin messagequeue($direction) {
  padding: 0 30px 10px 30px;
  overflow: hidden;
  display: flex;
  align-items: center;
  @if $direction=="left" {
    justify-content: flex-start;
    .chatTool-message-article-left {
      @include chatTool-message-triangle;
    }
    .chatTool-message-triangle-left {
      display: block;
      width: 0;
      height: 0;
      overflow: hidden;
      line-height: 0;
      font-size: 0;
      border-bottom: 8px solid #FFF;
      border-top: 8px solid #FFF;
      border-left: none;
      border-right: 8px solid #E3E3E3;
    }
  }
  @if $direction=="right" {
    justify-content: flex-end;
    .chatTool-message-article-right {
      @include chatTool-message-triangle;
    }
    .chatTool-message-triangle-right {
      display: block;
      width: 0;
      height: 0;
      overflow: hidden;
      line-height: 0;
      font-size: 0;
      border-bottom: 8px solid #FFF;
      border-top: 8px solid #FFF;
      border-right: none;
      border-left: 8px solid #E3E3E3;
    }
  }
  /*失败图标*/
  .chatTool-message-sign-fail {
    display: inline-block;
    width: 20px;
    height: 20px;
    color: #ED4A4B;
    font-size: 1rem;
  }
  /*消息发送图片*/
  .chatTool-message-list-img {
    width: 80px;
    height: 100px;
  }
  /*在输入框里的文件状态*/
  .chatTool-message-locationName {
    text-align: center;
    background-color: #f5f5f5;
    padding: 5px;
  }
  /*file类型的消息*/
  .chatTool-message-fileBox {
    width: 220px;
    height: 60px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border: 1px solid #999;
    background-color: #f5f5f5;
    cursor: pointer;
    .chatTool-message-fileIcon {
      font-size: 3rem;
      color: $send-button-color;
    }
    .chatTool-message-fileName {
      font-size: 1rem;
      white-space: nowrap;
      overflow: hidden;
      max-width: 160px;
      text-overflow: ellipsis;
    }
  }
}

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
