<template>
  <div class="chatpanel">
    <div class="chat-content-window">
      <div class="chat-window-header" v-show="loginState">
        <h2 clas="chat-content-window-name">{{roomId}}</h2>
        <i class="el-icon-menu" @click.stop="showOnline = true"></i>
      </div>
      <div class="chat-window-body">
        <MessageItem :content="content" :key='index' v-for="(content,index) in conversation">
        </MessageItem>
      </div>
      <div class="chat-window-footer" v-show="loginState">
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
          <textarea placeholder="" v-model="textarea"></textarea>
        </div>
        <div class="chat-footer-send">
          <button class="chat-endContact" style="display:none;">结束会话</button>
          <button class="chat-sendBtn" @click="sendMessage">发送(S)</button>
        </div>
      </div>
      <Login v-show="!loginState"></Login>
    </div>
    <FloatPanel v-show="showOnline" ref="main"></FloatPanel>
  </div>
</template>
<script>
import MessageItem from "@/components/MessageItem";
import FloatPanel from "@/components/FloatPanel";
import Login from "@/components/Login";
import { mapState, mapMutations, mapGetters } from "vuex";

export default {
  name: "ChatPanel",
  components: {
    MessageItem: MessageItem,
    FloatPanel: FloatPanel,
    Login: Login
  },
  data() {
    return {
      textarea: "",
      showOnline: false
    };
  },
  methods: {
    sendMessage() {
      if (this.textarea != "") {
        let chatmessage = {
          date: this.getNowFormatDate(),
          value: this.textarea,
          username: this.userName,
          contentType: "String"
        };
        if (this.roomId === "all_public_connect") {
          chatmessage.type = "hallMessage";
        } else {
          chatmessage.type = "roomMessage";
          chatmessage.roomId = this.roomId;
        }
        //发给socket.io
        this.$socket.emit("message", chatmessage, data => {
          let {error, message} = data
          if (error === -1) {
            //消息发送成功
            //插入到groupLists中
            let currentGroup = this.getCurrentGroup(this.roomId);
            currentGroup.conversation.push(chatmessage);
            this.textarea = "";
          }
          if (error === 0) {
            this.$message({
              message: message || "消息发送失败",
              type: "error"
            });
          }
        });
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
    ...mapState(["userName", "groupLists", "loginState"]),
    ...mapGetters(["getCurrentGroup"]),
    conversation() {
      if (!this.getCurrentGroup(this.roomId)) return null;
      return this.getCurrentGroup(this.roomId).conversation;
    },
    roomId() {
      return this.$route.params[0];
    }
  },
  mounted() {
    document.addEventListener("click", ev => {
      if(this.$refs['main'] && !this.$refs['main'].$el.contains(ev.target)){
        this.showOnline = false
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.chatpanel {
  width: 100%;
  height: 100%;
  position: relative;
}

.el-tabs {
  .el-tabs__nav {
    float: none;
    .el-tabs__item {
      width: 50%;
    }
  }
}

/*聊天窗口样式 begin*/
$send-button-color: $theme-color;

.chat-content-window {
  font-size: 0.8rem;
  letter-spacing: 0;
  .chat-window-header {
    display: flex;
    align-items: center;
    height: 60px;
    justify-content: space-between;
    padding: 0 20px;
    border-bottom: 1px solid #d3d3d3;
    .el-icon-menu {
      color: $theme-color-heavry;
      font-size: 1.6rem;
      cursor: pointer;
    }
  }
  .chat-window-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: hsla(0, 0%, 100%, 0.5);
    .chat-footer-toolBar {
      height: 24px;
      line-height: 24px;
      text-align: left;
      a {
        color: $font-color;
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
    }
    .chat-footer-send {
      background-color: transparent;
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
.chat-footer-editor {
  height: 80px;
  textarea {
    resize: none;
    outline: none;
    width: 100%;
    height: 100%;
    background-color: transparent;
    padding-left: 1rem;
    border: none;
    font-size: 1.4rem;
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    color: $font-color;
  }
}
</style>
