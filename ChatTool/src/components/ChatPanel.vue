<template>
  <div class="chatpanel">
    <div class="chat-content-window">
      <div class="chat-content-window-name"></div>
      <div class="chat-window-body">
        <MessageItem :time=messageList.time :sourceName=messageList.sourceName :sendContent=messageList.sendContent :direction=messageList.direction :key="index in messageList" v-for="messageList in messageLists">
        </MessageItem>
      </div>
      <div class="chat-window-footer">
        <div class="chat-footer-toolBar">
          <a class="chatTool-emotion" title="表情">
            <i></i>
            <span>表情</span>
          </a>
          <a class="chatTool-fileChat" title="发送文件">
            <i></i>
            <span>文件</span>
          </a>
          <a class="chatTool-videoChat" title="视频聊天">
            <i></i>
            <span>视频通信</span>
          </a>
          <a class="chatTool-locationChat" title="地理位置">
            <i></i>
            <span>位置</span>
          </a>
        </div>
        <div class="chat-footer-editor">
          <el-input type="textarea" placeholder="请输入内容" v-model="textarea"></el-input>
        </div>
        <div class="chat-footer-send">
          <button class="chat-endContact" style="display:none;">结束会话</button>
          <button class="chat-sendBtn">发送(S)</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MessageItem from '@/components/MessageItem'
export default {
  name: 'ChatPanel',
  components: {
    MessageItem: MessageItem
  },
  data() {
    return {
      textarea: 'entertext',
      messageLists:
      [
        { "time": "20180531", "sourceName": "xxx", "sendContent": "hahaha", "direction": "left" },
        { "time": "20180601", "sourceName": "yyy", "sendContent": "hahaha", "direction": "right" }
      ]

    }
  }
}
</script>

<style lang="scss" scoped>
.chatpanel {
  width: 100%;
  height: 100%;
  position: relative;
}


/*聊天窗口样式 begin*/

$color-green: #1AAD19;
$font-color: #333;
$send-button-color:#F57623;
.chat-content-window {
  font-size: .8rem;
  letter-spacing: 0;
  .chat-content-window-name {
    padding: 12px 0;
    font: 1rem bold;
    text-indent: 1rem;
    border-bottom: 1px solid #d3d3d3;
  }
  .chat-window-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    .chat-footer-toolBar {
      height: 24px;
      line-height: 24px;
      background-color: #fff;
      text-align: left;
      a {
        color: #333;
        display: inline-block;
        height: 100%;
        line-height: 100%;
        padding: 0 2px;
        cursor: pointer;
        span {
          height: 100%;
          line-height: 24px;
          float: left;
        }
        i {
          width: 16px;
          height: 16px;
          margin-top: 4px;
          float: left;
        }
      }
      a:nth-child(1) {
        i {
          background-image: url(../assets/chatTool/emotion.png);
        }
      }
      a:nth-child(2) {
        position: relative;
        i {
          background-image: url(../assets/chatTool/sendfile.png);
        }
      }
      a:nth-child(3) {
        i {
          background-image: url(../assets/chatTool/video.png);
        }
      }
      a:nth-child(4) {
        i {
          background-image: url(../assets/chatTool/location.png);
        }
      }
    }
    .chat-footer-editor {
      background: #fff;
      textarea {
        resize: none;
        width: 100%;
        background-color: #fff;
        border: none;
        outline: none;
        height: 80px;
      }
    }
    @mixin sendButtonStyle($colorcolr, $rightPosition) {
      margin-right: $rightPosition;
      padding: 4px 12px;
      border-radius: 12px;
      background-color: $colorcolr;
      color: #fff;
      border: none;
      &:hover {
        opacity: .8;
      }
    }
    .chat-footer-send {
      background-color: #fff;
      height: 40px;
      overflow: hidden;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .chat-sendBtn {
        @include sendButtonStyle($send-button-color, 10px);
      }
      .chat-endContact {
        @include sendButtonStyle(#d3d3d3, 20px);
      }
    }
  }
}







/*聊天窗口样式 end*/
</style>
