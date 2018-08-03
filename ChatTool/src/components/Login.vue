
<template>
  <div class="chat-window-footer-byvisitor">
    <p>游客朋友你好，请
      <b @click="dialogVisible = true">登录</b>后参与聊天</p>
    <el-dialog :visible.sync="dialogVisible" width="30%">
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
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
</template>
<script>
export default {
  name: "Login",
  data() {
    return {
      dialogVisible: false,
      loginFormShow: true,
      activeName: "chat-signIn",
      loginForm: {
        account: "",
        checkPass: ""
      },
      registerForm: {
        account: "",
        checkPass: "",
        email: ""
      }
    };
  },
  methods: {
    handleTabClick(tab, event) {
      if (tab.name === "chat-signIn") {
        this.loginFormShow = true;
      }
      if (tab.name === "chat-signUp") {
        this.loginFormShow = false;
      }
    },
    //登录
    async signIn() {
      try {
        let params = new URLSearchParams();
        params.append("username", this.loginForm.account);
        params.append("password", this.loginForm.checkPass);
        params.append("sid", this.$socket.id);

        let responseValue = await login(params);
        let { status, data } = responseValue;
        if (status !== 200) {
          throw data.message || "登录异常";
        }
        this.set_user({
          userName: this.loginForm.account,
          id: data.id
        });
        this.set_token(data.token);
        if (this.token) {
          // 登录成功
          // 1. 默认加入大厅
          this.$socket.emit("createRoom", "all_public_connect", data1 => {
            // 2. 成功加入大厅
            let { error, message } = data1;
            if (error == 0) {
              // 3. 创建/加入大厅失败
              this.$message({
                message,
                type: "error"
              });
              return;
            }
            if (error == -1) {
              // 4. 创建/加入大厅成功
              this.$message({
                message,
                type: "success"
              });
              // 5. 保存roomId
              this.addGroup({
                id: "all_public_connect",
                name: "群聊大厅"
              });
              // 6. 设置currentGroupId
              this.setCurrentGroupId("all_public_connect");
              // 7. 路由跳转
              this.$router.push(`/${this.currentGroupId}`);
              // 8. 设置登录状态为true并关闭登录框
              this.dialogVisible = false;
            }
          });
        }
      } catch (err) {
        this.$message({
          message: err.message || "登录异常",
          type: "error"
        });
      }
    },
    //注册
    async signUp() {
      try {
        let params = new URLSearchParams();
        params.append("username", this.registerForm.account);
        params.append("email", this.registerForm.email);
        params.append("password", this.registerForm.checkPass);
        let responseValue = await register(params);
        let { status, data } = responseValue;
        if (status !== 200) {
          throw data.message || "注册失败";
        }
        this.$message({
          message: "注册成功",
          type: "success"
        });
      } catch (err) {
        this.$message({
          message: err.message || "注册失败",
          type: "error"
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
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
</style>


