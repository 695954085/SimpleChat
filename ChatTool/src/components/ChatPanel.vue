<template>
  <div class="chatpanel">
    <div class="chat-content-window">
      <div class="chat-window-header" v-show="loginState">
        <h2 clas="chat-content-window-name">{{$store.state.currentGroupName}}</h2>
        <i class="el-icon-menu" @click.stop="togglePanel"></i>
      </div>
      <div class="chat-window-body">
        <MessageItem :time="messageList.time"
        :sourceName="messageList.sourceName"
        :sendContent="messageList.value"
        :direction="messageList.direction"
        :key="messageList.id"
        :index="'messageList_'+index"
        v-for="(messageList,index) in messageLists">
        </MessageItem>
      </div>
      <div class="chat-window-footer" v-show = "loginState">
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
      <div class="chat-window-footer-byvisitor" v-show ="!loginState">
        <p>游客朋友你好，请<b @click="dialogVisible = true">登录</b>后参与聊天</p>
        <el-dialog
          :visible.sync="dialogVisible"
          width="30%">
          <el-tabs v-model="activeName"  @tab-click="handleTabClick">
            <el-tab-pane label="登录" name="chat-signIn">登录</el-tab-pane>
            <el-tab-pane label="注册" name="chat-signUp"> 注册</el-tab-pane>
          </el-tabs>
          <el-form :model="loginForm" class="demo-ruleForm login-container" v-show="loginFormShow">
            <el-form-item prop="account">
              <el-input type="text" v-model="loginForm.account" auto-complete="off" placeholder="Username"></el-input>
            </el-form-item>
            <el-form-item prop="checkPass">
              <el-input type="password" v-model="loginForm.checkPass" auto-complete="off" placeholder="password"></el-input>
            </el-form-item>
            <el-form-item style="width:100%;">
              <el-button type="primary" style="width:100%;" @click="signIn">Sign in</el-button>
            </el-form-item>
          </el-form>
          <el-form :model="registerForm" class="demo-ruleForm register-container" v-show="!loginFormShow">
            <el-form-item prop="account">
              <el-input type="text" v-model="registerForm.account" auto-complete="off" placeholder="Pick a username"></el-input>
            </el-form-item>
            <el-form-item prop="email">
              <el-input type="text" v-model="registerForm.email" auto-complete="off" placeholder="email-adress"></el-input>
            </el-form-item>
            <el-form-item prop="checkPass">
              <el-input type="password" v-model="registerForm.checkPass" auto-complete="off" placeholder="Create a password"></el-input>
            </el-form-item>
            <el-form-item style="width:100%;">
              <el-button type="primary" style="width:100%;" @click="signUp">Sign up for simplechat</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </div>
    <FloatPanel v-show = "showOnline" ref="main" :mumberLists = "groupMumbers"></FloatPanel>
  </div>
</template>
<script>
import MessageItem from "@/components/MessageItem";
import FloatPanel from "@/components/FloatPanel";

export default {
  name: "ChatPanel",
  components: {
    MessageItem: MessageItem,
    FloatPanel: FloatPanel
  },
  data() {
    return {
      textarea: "",
      messageLists: [],
      dialogVisible: false,
      loginForm: {
        account: "",
        checkPass: ""
      },
      registerForm: {
        account: "",
        checkPass: "",
        email: ""
      },
      loginFormShow: true,
      activeName: "chat-signIn",
      showOnline: false,
      messageLists:
      // [
      //   { "id": "message1", "time": "20180531", "sourceName": "xxx", "value": "testmessage1", "direction": "left" },
      //   { "id": "message2", "time": "20180601", "sourceName": "yyy", "value": "testmessage2", "direction": "right" }
      // ],
    };
  },
  sockets: {
    connect: function() {
      console.log("socket connected");
    },
    disconnect: function(val) {
      console.log(val);
      //清理数据,,路由置回登录
    },
    error: function(val) {
      console.log(val);
    },
    HallMessage: function(val) {
      //服务端用广播,,不用预自己
      if (val.sourceName === this.$store.state.userName) {
        val.direction = "right";
      } else {
        val.direction = "left";
      }
      this.messageLists.push(val);
      //更新groupList这个数据集合里的message信息
      this.groupLists
    },
    RoomAndPrivateMessage: function(val) {
      val.direction = "left";
      this.messageLists.push(val);
      //更新groupList这个数据集合里的message信息
    }
  },
  methods: {
    sendMessage() {
      // $socket is socket.io-client instance
      if (this.textarea != "") {
        let chatmessage = {
          time: this.getNowFormatDate(),
          value: this.textarea,
          sourceName: this.$store.state.userName,
          sid: this.$socket.id
        };
        if (this.$store.state.currentGroupId === "all_public_connect") {
          chatmessage.type = "hallMessage";
        } else {
          chatmessage.type = "roomMessage";
          chatmessage.roomId = this.$store.state.currentGroupId;
        }
        //发给socket.io
        this.$socket.emit("message", chatmessage, data => {
          console.log(data);
          if (data.error === -1) {
            chatmessage.direction = "right";
            this.messageLists.push(chatmessage);
          }
          if (data.error === 0) {
            console.error(data.message);
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
    },
    handleTabClick(tab, event) {
      if (tab.name === "chat-signIn") {
        this.loginFormShow = true;
      }
      if (tab.name === "chat-signUp") {
        this.loginFormShow = false;
      }
    },
    togglePanel() {
      this.showOnline ? this.hide() : this.show();
    },
    show() {
      this.showOnline = true;
      document.addEventListener("click", this.hidePanel, false);
    },

    hide() {
      this.showOnline = false;
      document.removeEventListener("click", this.hidePanel, false);
    },

    hidePanel(e) {
      if (!this.$refs.main.$el.contains(e.target)) {
        this.hide();
      }
    },

    //登录
    signIn() {
      //alert("signIn");
      var params = new URLSearchParams();
      params.append("username", this.loginForm.account);
      params.append("password", this.loginForm.checkPass);
      params.append("sid", this.$socket.id);
      this.$http({
        url: `http://127.0.0.1:3000/v1/login`,
        method: "post",
        data: params
      })
        .then(res => {
          if (res.status === 200) {
            console.log(res);
            this.$store.state.userName = this.loginForm.account;
            this.$store.state.userid = res.data.id;
            //this.$store.state.token = res.data.token;
            this.$store.commit("set_token", res.data.token);

            if (this.$store.state.token) {
              //成功登录
              //this.$router.push({ path: '/chat' });
              console.log(this.$store.state.token);
              this.$store.state.groupLists.push({
                id: "all_public_connect",
                name: "群聊大厅"
              });
              //选中当前联系人
              this.$store.state.currentGroupId = "all_public_connect";

              this.$router.push({
                path: "/" + this.$store.state.currentGroupId
              });
              //设置登录状态为true并关闭登录框
              this.$store.state.loginState = true;
              this.dialogVisible = false;
            }
          }
          if (res.status === 400) {
            console.log(res);
          }
        })
        .catch(res => {
          console.log("登录错误: ", res);
          alert("登录错误，，请重新检查账号和密码！！");
        });
    },
    //注册
    signUp() {
      var params = new URLSearchParams();
      params.append("username", this.registerForm.account);
      params.append("email", this.registerForm.email);
      params.append("password", this.registerForm.checkPass);
      console.log(params);
      this.$http({
        url: `http://127.0.0.1:3000/v1/user`,
        method: "post",
        data: params
      })
        .then(res => {
          console.log(res);
          if (res.status === 200) {
            //返回一个用户id标记一个唯一的用户(res.data.id)
            this.$store.state.userid = res.data.id;
            alert("注册成功");
          }
        })
        .catch(res => {
          console.log("注册错误: ", res);
        });
    }
  },
  computed: {
    groupMumbers() {
      return this.$store.state.currentGroupMumber;
    },
    loginState() {
      return this.$store.state.loginState;
    }
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
  .chat-window-footer-byvisitor {
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: hsla(0, 0%, 100%, 0.5);
    height: 144px;
    display: flex;
    align-items: center;
    justify-content: center;
    p {
      letter-spacing: 1px;
      font-size: 1rem;
      user-select: none;
      b {
        color: $theme-color-heavry;
        font-size: 1.2rem;
        cursor: pointer;
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
