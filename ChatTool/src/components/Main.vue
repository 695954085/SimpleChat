<template>
  <div class="chat-main" @click="showOnline = false">
    <div class="chat-container">
      <div class="chat-container-left" v-show="loginState">
        <img class="chat-component-avatar" src="../assets/defaultAvatar.jpg" @click="setAvatar = true">
        <ButtonList></ButtonList>
        <el-dialog title="个人信息设置" :visible.sync="setAvatar" width="30%">
          <div class="chat-welcome-userName">你好,{{userName}}</div>
          <el-upload class="avatar-uploader" action="http://127.0.0.1:3000/v1/avatar" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span slot="footer" class="dialog-footer">
            <el-button @click="setAvatar = false">取 消</el-button>
            <el-button type="primary" @click="setAvatar = false">确 定</el-button>
          </span>
        </el-dialog>
      </div>
      <div class="chat-container-right">
        <div class="chat-container-feature" v-show="loginState">
          <div class="chat-container-search">
            <input class="chat-search-text" type="text" placeholder="搜索群组/用户(待实现)" autocomplete="false">
            <div class="chat-container-search-plus">
              <i class="el-icon-circle-plus" @click="circlePlus = true"></i>
            </div>
          </div>
          <el-dialog title="创建群组" :visible.sync="circlePlus" width="30%">
            <el-input v-model="roomIdInput" placeholder="输入一个好听的群名吧~~"></el-input>
            <div class="chat-module-groupcreate">
              <el-button @click="createGroup">创建</el-button>
            </div>
          </el-dialog>
          <group-list></group-list>
        </div>
        <div class="chat-container-chatpanel">
          <transition name="fade" mode="out-in">
            <router-view/>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ButtonList from "@/components/ButtonList";
import GroupList from "@/components/GroupList";
import { mapState, mapMutations, mapGetters } from "vuex";

export default {
  data() {
    return {
      setAvatar: false,
      circlePlus: false,
      roomIdInput: "",
      imageUrl: ""
    };
  },
  components: {
    ButtonList,
    GroupList
  },
  sockets: {
    online(val) {
      console.log(val);
      if (val) {
        this.updateOnlineClients(val)
      }
    },
    HallMessage: function(val) {
      this.addConversation(
        Object.assign({}, { val }, { roomId: "all_public_connect" })
      );
    },
    RoomAndPrivateMessage: function(val) {
      this.addConversation(Object.assign({}, { val }, { roomId: val.roomId }));
    }
  },
  methods: {
    ...mapMutations(["addConversation", "addGroup", "updateOnlineClients"]),
    createGroup() {
      try {
        if (!this.roomIdInput) throw new Error("房间名称不能为空");
        //1. 创建房间
        this.$socket.emit("createRoom", this.roomIdInput, val => {
          // 2. 房间创建成功
          let { message, error } = val;
          if (error == 1) {
            this.$message({
              message: err.message || "房间创建异常",
              type: "error"
            });
          } else {
            this.$message({
              message: message,
              type: "success"
            });
            this.addGroup({
              roomId: this.roomIdInput
            });
            this.addConversation({ roomId: this.roomIdInput });
          }
          this.roomIdInput = "";
        });
        this.circlePlus = false;
      } catch (err) {
        this.$message({
          message: err.message || "房间创建异常",
          type: "error"
        });
      }
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  },
  computed: {
    ...mapState(["userName", "loginState", "groupLists"]),
    ...mapGetters(["getCurrentGroup"])
  }
};
</script>

<style lang="scss" scoped>
/*图片上传 start*/
.chat-welcome-userName {
  margin: 20px 0;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
.chat-module-groupcreate {
  padding-top: 20px;
  display: flex;
  justify-content: flex-end;
}
/*图片上传 end*/

.chat-main {
  width: 100%;
  height: 100%;
  background-image: url(../assets/bg.jpg);
}
.chat-container {
  width: 70%;
  position: absolute;
  left: 15%;
  height: 85%;
  top: 7.5%;
  background-color: rgba(255, 255, 255, 0.5);
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  display: flex;
  border-radius: 10px;
  box-shadow: 0 0 60px rgba(0, 0, 0, 0.5);
  .chat-container-left {
    width: 80px;
    background-color: $theme-color;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    -ms-flex-align: center;
    align-items: center;
    position: relative;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    .chat-component-avatar {
      margin-top: 50px;
      width: 60px;
      height: 60px;
      border-radius: 30px;
      cursor: pointer;
    }
    .chat-container-buttonList {
      position: absolute;
      bottom: 40px;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-direction: column;
      flex-direction: column;
      -ms-flex-align: center;
      align-items: center;
    }
  }
  .chat-container-right {
    display: flex;
    flex: 1;
    .chat-container-feature {
      width: 300px;
      height: 100%;
      position: relative;
      display: flex;
      -ms-flex-direction: column;
      flex-direction: column;
      background-color: $theme-color-light;
      .chat-container-search {
        display: flex;
        height: 70px;
        -ms-flex-align: center;
        align-items: center;
        padding: 0 12px;
        position: relative;
        //文本框样式
        .chat-search-text {
          -ms-flex: 1;
          flex: 1;
          height: 36px;
          border-radius: 18px;
          border: none;
          background-color: hsla(0, 0%, 100%, 0.5);
          padding-left: 35px;
          padding-right: 15px;
          padding-top: 2px;
          font-size: 14px;
          color: #333;
          outline: none;
        }
        //加号按钮
        .chat-container-search-plus {
          width: 40px;
          height: 40px;
          margin-left: 5px;
          .el-icon-circle-plus {
            font-size: 38px;
            line-height: 40px;
            color: hsla(0, 0%, 100%, 0.5);
            cursor: pointer;
          }
        }
      }
    }
    .chat-container-chatpanel {
      display: flex;
      -ms-flex-direction: column;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      flex: 1;
      flex-direction: column;
      background-color: hsla(0, 0%, 95%, 0.6);
      overflow: hidden;
      position: relative;
    }
  }
}
</style>
