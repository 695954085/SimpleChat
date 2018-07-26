<template>
  <div class="main">
    <el-row>
      <el-col :offset="18" :span="1">
        <el-button type="primary" @click="dialogVisible1 = true">SignIn</el-button>
      </el-col>
      <el-col :offset="1" :span="1">
        <el-button type="primary" @click="dialogVisible2 = true">SignUp</el-button>
      </el-col>
    </el-row>
    <el-dialog title="系统登录" :visible.sync="dialogVisible1">
      <el-form :model="loginForm" class="demo-ruleForm login-container">
        <el-form-item prop="account">
          <el-input type="text" v-model="loginForm.account" auto-complete="off" placeholder="Username"></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input type="password" v-model="loginForm.checkPass" auto-complete="off" placeholder="password"></el-input>
        </el-form-item>
        <!-- <el-checkbox checked class="remember">记住密码</el-checkbox> -->
        <el-form-item style="width:100%;">
          <el-button type="primary" style="width:100%;" @click="signIn">Sign in</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="用户注册" :visible.sync="dialogVisible2">
      <el-form :model="registerForm" class="demo-ruleForm register-container">
        <el-form-item prop="account">
          <label class="input-label">Username</label>
          <el-input type="text" v-model="registerForm.account" auto-complete="off" placeholder="Pick a username"></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <label class="input-label">Email</label>
          <el-input type="text" v-model="registerForm.email" auto-complete="off" placeholder="you@example.com"></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <label class="input-label">password</label>
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
  name: 'Main',
  data() {
    return {
      dialogVisible1: false,
      dialogVisible2: false,
      loginForm: {
        account: '',
        checkPass: ''
      },
      registerForm: {
        account: '',
        checkPass: '',
        email: ''
      },
      id: ''
    }
  },
  methods: {
    //登录
    signIn() {
      //alert("signIn");
      var params = new URLSearchParams();
      params.append('username', this.loginForm.account);
      params.append('password', this.loginForm.checkPass);
      params.append('sid', this.$socket.id);
      this.$http({
        url: `http://127.0.0.1:3000/v1/login`,
        method: 'post',
        data: params,
      }).then((res) => {
        if (res.status === 200) {
          console.log(res);
          this.$store.state.userName = this.loginForm.account;
          this.$store.state.userid = res.data.id;
          //this.$store.state.token = res.data.token;
          this.$store.commit('set_token', res.data.token);

          if (this.$store.state.token) {
            this.$router.push({ path: '/chat' });
            console.log(this.$store.state.token);
          } else {
            this.dialogVisible2 = true;
            this.dialogVisible1 = false;
          }
        }
        if (res.status === 400) {
          console.log(res);
        }
      }).catch((res) => {
        console.log('登录错误: ', res);
        alert("登录错误，，请重新检查账号和密码！！");
      });
    },
    //注册
    signUp() {
      var params = new URLSearchParams();
      params.append('username', this.registerForm.account);
      params.append('email', this.registerForm.email);
      params.append('password', this.registerForm.checkPass);
      console.log(params);
      this.$http({
        url: `http://127.0.0.1:3000/v1/user`,
        method: 'post',
        data: params
      }).then((res) => {
        console.log(res);
        if (res.status === 200) {
          //返回一个用户id标记一个唯一的用户(res.data.id)
          this.$store.state.userid = res.data.id;
          alert("注册成功");
          this.dialogVisible1 = true;
          this.dialogVisible2 = false;
        }
      }).catch((res) => {
        console.log('注册错误: ', res);
      });
    },
  },
  ready: function() {
    console.log('isLogin: ' + this.$route.params.isLogin);
    if (this.$route.params.isLogin) {
      this.dialogVisible2 = true;
      this.dialogVisible1 = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  width: 350px;
  padding: 35px 35px 15px 35px;
  .remember {
    margin: 0px 0px 35px 0px;
  }
}

.register-container {
  width: 350px;
  padding: 35px 35px 15px 35px;
  .input-label {
    float: left;
    font-size: .8rem;
  }
}
</style>
