<template>
  <div class="chatpanel">
    <div class="chat-content-window">
      <div class="chat-window-header">
        <div clas="chat-content-window-name">{{owner}}</div>
        <el-popover placement="left" width="200" trigger="click">
          <h3>群聊成员</h3>
          <el-menu class="group-list">
            <el-menu-item :key="mumberItem.id" :index="'mumberItem_'+index" v-for="(mumberItem,index) in groupMumbers">
              <span>{{mumberItem.name}}</span>
            </el-menu-item>
          </el-menu>
          <i class="el-icon-more" slot="reference"></i>
        </el-popover>
      </div>
      <div class="chat-window-body">
        <MessageItem :time="messageList.time" :sourceName="messageList.sourceName" :sendContent="messageList.sendContent" :direction="messageList.direction" :key="messageList.id" :index="'messageList_'+index" v-for="(messageList,index) in messageLists">
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
        </div>
        <div class="chat-footer-editor">
          <el-input type="textarea" placeholder="请输入内容" v-model="textarea"></el-input>
        </div>
        <div class="chat-footer-send">
          <button class="chat-endContact" style="display:none;">结束会话</button>
          <button class="chat-sendBtn" @click="sendMessage">发送(S)</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import store from "@/store/store";

import MessageItem from "@/components/MessageItem";

export default {
  name: "ChatPanel",
  components: {
    MessageItem: MessageItem
  },
  data() {
    return {
      textarea: "",
      messageLists: []
      // messageLists:
      // [
      //   { "id": "message1", "time": "20180531", "sourceName": "xxx", "sendContent": "testmessage1", "direction": "left" },
      //   { "id": "message2", "time": "20180601", "sourceName": "yyy", "sendContent": "testmessage2", "direction": "right" }
      // ],
    };
  },
  sockets: {
    connect: function() {
      console.log("socket connected");
    },
    disconnect: function(val) {
      console.log(val);
    },
    error: function(val) {
      console.log(val);
    },
    HallMessage: function(val) {
      //服务端用广播，，不用预自己
      if (val.sourceName === this.$store.state.userName) {
        val.direction = "right";
      } else {
        val.direction = "left";
      }
      this.messageLists.push(val);
    },
    RoomAndPrivateMessage: function(val) {
      val.direction = "left";
      this.messageLists.push(val);
    }
  },
  methods: {
    sendMessage() {
      // this.messageLists.push({ "time": "20180531", "sourceName": this.$store.state.userName, "sendContent": this.textarea, "direction": "right" });

      // $socket is socket.io-client instance
      if (this.textarea != "") {
        let chatmessage = {
          time: this.getNowFormatDate(),
          sendContent: this.textarea,
          sourceName: this.$store.state.userName
        };
        if (this.$store.state.currentGroupName === "所有用户") {
          chatmessage.type = "hallMessage";
        } else {
          chatmessage.type = "roomMessage";
          chatmessage.rooomId = this.$store.state.currentGroupId;
        }
        //发给socket.io
        this.$socket.emit("message", chatmessage, data => {
          console.log(data);
        });
        //自己的消息发出去，，应该是确认别人收了才能自己插上。。
        chatmessage.direction = "right";
        this.messageLists.push(chatmessage);
      }
    },
    getNowFormatDate() {
      let date = new Date();
      let seperator1 = "-";
      let seperator2 = ":";
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      let currentdate =
        date.getFullYear() +
        seperator1 +
        month +
        seperator1 +
        strDate +
        " " +
        date.getHours() +
        seperator2 +
        date.getMinutes() +
        seperator2 +
        date.getSeconds();
      return currentdate;
    }
  },
  computed: {
    owner() {
      return this.$store.state.currentGroupName;
    },
    groupMumbers() {
      return this.$store.state.currentGroupMumber;
    }
  },
  mounted() {
    this.$socket.emit("connect", "是从这开始连接吗?"); //在这里触发connect事件
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.chatpanel {
  width: 100%;
  height: 100%;
  position: relative;
}

/*聊天窗口样式 begin*/

$color-green: #1aad19;
$font-color: #333;
$send-button-color: #f57623;
.chat-content-window {
  font-size: 0.8rem;
  letter-spacing: 0;
  .chat-window-header {
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
    border-bottom: 1px solid #d3d3d3;
    .chat-content-window-name {
      font: 1rem bold;
      text-indent: 1rem;
    }
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
        opacity: 0.8;
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
