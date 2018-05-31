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
    <el-dialog :model="register-form" title="用户注册" :visible.sync="dialogVisible2">
      <el-form class="demo-ruleForm register-container">
        <el-form-item prop="account">
          <label class="input-label">Username</label>
          <el-input type="text" auto-complete="off" placeholder="Pick a username"></el-input>
        </el-form-item>
        <el-form-item prop="account">
          <label class="input-label">Email</label>
          <el-input type="text" auto-complete="off" placeholder="you@example.com"></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <label class="input-label">password</label>
          <el-input type="password" auto-complete="off" placeholder="Create a password"></el-input>
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
          account: 'admin',
          checkPass: '123456'
        },
    }
  },
  methods: {
    signIn() {
      alert("signIn");
      this.$router.push({ path: '/chat' });
    },
    signUp() {
      alert("signUp")
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
